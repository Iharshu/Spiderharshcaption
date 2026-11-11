import { CaptionProject, CaptionStyleConfig, CaptionSegment, ExportProgress, AspectRatio } from '../types';
import { computeWordState } from '../animations/engine';

export interface ExportResolution {
  width: number;
  height: number;
  label: string;
}

export const EXPORT_RESOLUTIONS: Record<AspectRatio, ExportResolution> = {
  '9:16': { width: 1080, height: 1920, label: '1080 x 1920 (Vertical 9:16 Reels/Shorts)' },
  '16:9': { width: 1920, height: 1080, label: '1920 x 1080 (Landscape 16:9 YouTube)' },
  '1:1': { width: 1080, height: 1080, label: '1080 x 1080 (Square 1:1 Feed)' },
  '4:5': { width: 1080, height: 1350, label: '1080 x 1350 (Portrait 4:5 Instagram)' }
};

export function getPreferredFullVideoMime(): { mime: string; ext: 'mp4' | 'webm' } {
  if (typeof MediaRecorder !== 'undefined') {
    const mp4Types = [
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4;codecs=avc1',
      'video/mp4'
    ];
    for (const t of mp4Types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return { mime: t, ext: 'mp4' };
      }
    }
    const webmTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    for (const t of webmTypes) {
      if (MediaRecorder.isTypeSupported(t)) {
        return { mime: t, ext: 'webm' };
      }
    }
  }
  return { mime: 'video/webm', ext: 'webm' };
}

/**
 * Checks browser codec support for transparent WebM VP9 vs fallback
 */
export function getSupportedVideoMimeTypes(): {
  transparentSupported: boolean;
  preferredTransparentMime: string;
  preferredStandardMime: string;
} {
  const transparentOptions = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=daala',
    'video/webm'
  ];

  const standardOptions = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];

  let preferredTransparentMime = '';
  let transparentSupported = false;

  if (typeof MediaRecorder !== 'undefined') {
    for (const mime of transparentOptions) {
      if (MediaRecorder.isTypeSupported(mime)) {
        preferredTransparentMime = mime;
        transparentSupported = true;
        break;
      }
    }
  }

  let preferredStandardMime = 'video/webm';
  if (typeof MediaRecorder !== 'undefined') {
    for (const mime of standardOptions) {
      if (MediaRecorder.isTypeSupported(mime)) {
        preferredStandardMime = mime;
        break;
      }
    }
  }

  return {
    transparentSupported,
    preferredTransparentMime: preferredTransparentMime || preferredStandardMime,
    preferredStandardMime
  };
}

/**
 * Draws a single frame of animated captions onto Canvas 2D
 */
export function drawCaptionFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentTime: number,
  captions: CaptionSegment[],
  config: CaptionStyleConfig,
  renderMode: 'transparent' | 'green-screen' | 'full-video' | boolean = 'transparent',
  videoElement?: HTMLVideoElement | null
) {
  const mode = typeof renderMode === 'boolean'
    ? (renderMode ? 'green-screen' : 'transparent')
    : renderMode;

  // Clear or apply backdrop
  if (mode === 'green-screen') {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(0, 0, width, height);
  } else if (mode === 'full-video') {
    if (videoElement && videoElement.readyState >= 2) {
      ctx.drawImage(videoElement, 0, 0, width, height);
    } else {
      // Tech studio gradient backdrop when no video file is attached
      const grad = ctx.createRadialGradient(width / 2, height * 0.4, 60, width / 2, height / 2, height * 0.8);
      grad.addColorStop(0, '#161F36');
      grad.addColorStop(0.5, '#0C0F1A');
      grad.addColorStop(1, '#07080D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  // Find active segment for this timestamp
  const activeSegment = captions.find(
    s => currentTime >= s.start && currentTime <= s.end
  );

  if (!activeSegment || activeSegment.words.length === 0) {
    return;
  }

  // Scale factor based on 1080px base canvas width
  const scaleMultiplier = width / 1080;
  const scaledFontSize = Math.round(config.fontSize * scaleMultiplier * 1.6);
  const fontWeight = config.fontWeight || '800';
  ctx.font = `${fontWeight} ${scaledFontSize}px "${config.fontFamily}", system-ui, sans-serif`;
  ctx.textBaseline = 'middle';

  // Measure all words
  const wordsWithMetrics = activeSegment.words.map((w, idx) => {
    const metrics = ctx.measureText(w.word);
    return {
      ...w,
      index: idx,
      width: metrics.width,
      state: computeWordState(
        w,
        idx,
        activeSegment.words.length,
        activeSegment.start,
        activeSegment.end,
        currentTime,
        config
      )
    };
  });

  const spaceWidth = ctx.measureText(' ').width;

  // Split words into lines based on maxWordsPerLine or canvas width limit
  const lines: typeof wordsWithMetrics[] = [];
  let currentLine: typeof wordsWithMetrics = [];
  const maxWordsPerLine = config.maxWordsPerLine || 4;
  const maxWidth = width * 0.88;

  let currentLineWidth = 0;
  for (const item of wordsWithMetrics) {
    const testWidth = currentLineWidth + (currentLine.length > 0 ? spaceWidth : 0) + item.width;
    if (currentLine.length >= maxWordsPerLine || (currentLine.length > 0 && testWidth > maxWidth)) {
      lines.push(currentLine);
      currentLine = [item];
      currentLineWidth = item.width;
    } else {
      currentLine.push(item);
      currentLineWidth = testWidth;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  const lineHeight = scaledFontSize * config.lineHeight;
  const totalBlockHeight = lines.length * lineHeight;

  // Anchor position
  const anchorX = (width * config.positionX) / 100;
  const anchorY = (height * (activeSegment.positionY ?? config.positionY)) / 100;
  const startY = anchorY - totalBlockHeight / 2 + lineHeight / 2;

  // Draw background box if enabled
  if (config.box.enabled) {
    let maxMeasuredLineWidth = 0;
    lines.forEach(line => {
      const lineWidth = line.reduce((acc, w) => acc + w.width, 0) + (line.length - 1) * spaceWidth;
      if (lineWidth > maxMeasuredLineWidth) maxMeasuredLineWidth = lineWidth;
    });

    const boxPadX = config.box.paddingX * scaleMultiplier * 1.5;
    const boxPadY = config.box.paddingY * scaleMultiplier * 1.5;
    const boxWidth = maxMeasuredLineWidth + boxPadX * 2;
    const boxHeight = totalBlockHeight + boxPadY * 2;
    const boxX = anchorX - boxWidth / 2;
    const boxY = anchorY - boxHeight / 2;
    const radius = config.box.borderRadius * scaleMultiplier * 1.2;

    ctx.save();
    ctx.globalAlpha = config.box.opacity;
    ctx.fillStyle = config.box.color;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, radius);
    ctx.fill();

    if (config.box.borderWidth > 0) {
      ctx.lineWidth = config.box.borderWidth * scaleMultiplier;
      ctx.strokeStyle = config.box.borderColor;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw each line and word
  lines.forEach((line, lineIdx) => {
    const lineWidth = line.reduce((acc, w) => acc + w.width, 0) + (line.length - 1) * spaceWidth;
    let wordStartX = anchorX - lineWidth / 2;
    if (config.textAlign === 'left') {
      wordStartX = anchorX - maxWidth / 2;
    } else if (config.textAlign === 'right') {
      wordStartX = anchorX + maxWidth / 2 - lineWidth;
    }

    const wordCenterY = startY + lineIdx * lineHeight;

    line.forEach(item => {
      const state = item.state;
      const wordMidX = wordStartX + item.width / 2;

      ctx.save();
      ctx.translate(wordMidX + state.translateX * scaleMultiplier, wordCenterY + state.translateY * scaleMultiplier);
      if (state.rotate) {
        ctx.rotate((state.rotate * Math.PI) / 180);
      }
      ctx.scale(state.scale, state.scale);
      ctx.globalAlpha = state.opacity;

      // Glow / Shadow
      if (config.glow.enabled && state.glowBlur > 0) {
        ctx.shadowColor = state.glowColor;
        ctx.shadowBlur = state.glowBlur * scaleMultiplier * 1.5;
      } else if (config.shadow.enabled) {
        ctx.shadowColor = config.shadow.color;
        ctx.shadowOffsetX = config.shadow.offsetX * scaleMultiplier;
        ctx.shadowOffsetY = config.shadow.offsetY * scaleMultiplier;
        ctx.shadowBlur = config.shadow.blur * scaleMultiplier;
      }

      // Stroke
      if (config.stroke.enabled && config.stroke.width > 0) {
        ctx.lineWidth = config.stroke.width * scaleMultiplier * 2;
        ctx.strokeStyle = config.stroke.color;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(item.word, -item.width / 2, 0);
      }

      // Fill text
      ctx.fillStyle = state.color;
      ctx.fillText(item.word, -item.width / 2, 0);

      // Karaoke highlight wipe effect
      if (config.animation === 'karaoke-highlight' && state.isCurrent && state.karaokeProgress > 0) {
        ctx.save();
        const wipeWidth = item.width * state.karaokeProgress;
        ctx.beginPath();
        ctx.rect(-item.width / 2, -scaledFontSize, wipeWidth, scaledFontSize * 2);
        ctx.clip();
        ctx.fillStyle = config.highlightColor;
        ctx.fillText(item.word, -item.width / 2, 0);
        ctx.restore();
      }

      ctx.restore();

      wordStartX += item.width + spaceWidth;
    });
  });
}

/**
 * Deterministic frame-by-frame video export engine
 */
/**
 * Deterministic video export engine supporting Full Video (video+captions+audio),
 * Transparent WebM (alpha channel), and Green Screen Chroma Key.
 */
export async function exportVideoCaptions(
  project: CaptionProject,
  format: 'full-video' | 'webm-transparent' | 'webm-green' | 'mp4-green',
  onProgress: (progress: ExportProgress) => void,
  abortSignal?: { aborted: boolean }
): Promise<Blob> {
  const resolution = EXPORT_RESOLUTIONS[project.aspectRatio] || EXPORT_RESOLUTIONS['9:16'];
  const { width, height } = resolution;
  const isTransparent = format === 'webm-transparent';
  const isFullVideo = format === 'full-video';
  const renderMode: 'transparent' | 'green-screen' | 'full-video' = isFullVideo
    ? 'full-video'
    : (isTransparent ? 'transparent' : 'green-screen');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: isTransparent, willReadFrequently: false });

  if (!ctx) {
    throw new Error('Failed to create canvas rendering context');
  }

  // Ensure fonts are loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  const fps = 30;
  const duration = Math.max(1, project.duration || 10);
  const totalFrames = Math.ceil(duration * fps);
  const frameDurationMs = 1000 / fps;

  // Setup offscreen video and audio if full-video export
  let offscreenVideo: HTMLVideoElement | null = null;
  let audioTracks: MediaStreamTrack[] = [];
  let audioContext: AudioContext | null = null;

  if (isFullVideo && project.video?.url) {
    onProgress({
      status: 'rendering',
      currentFrame: 0,
      totalFrames,
      percentage: 2,
      message: 'Loading source video & extracting audio stream...'
    });

    offscreenVideo = document.createElement('video');
    offscreenVideo.crossOrigin = 'anonymous';
    offscreenVideo.src = project.video.url;
    offscreenVideo.playsInline = true;
    offscreenVideo.muted = false;
    offscreenVideo.preload = 'auto';

    await new Promise<void>((resolve) => {
      if (offscreenVideo!.readyState >= 2) {
        resolve();
      } else {
        offscreenVideo!.onloadeddata = () => resolve();
        offscreenVideo!.onerror = () => resolve();
        setTimeout(resolve, 3500);
      }
    });

    // Capture audio from source video via Web Audio API or stream
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        const source = audioContext.createMediaElementSource(offscreenVideo);
        const dest = audioContext.createMediaStreamDestination();
        source.connect(dest);
        const tracks = dest.stream.getAudioTracks();
        if (tracks.length > 0) {
          audioTracks = tracks;
        }
      }
    } catch (audioErr) {
      console.warn('WebAudio capture notice, checking captureStream fallback:', audioErr);
      try {
        const stream = (offscreenVideo as any).captureStream
          ? (offscreenVideo as any).captureStream()
          : (offscreenVideo as any).mozCaptureStream
          ? (offscreenVideo as any).mozCaptureStream()
          : null;
        if (stream && stream.getAudioTracks().length > 0) {
          audioTracks = stream.getAudioTracks();
        }
      } catch (e) {
        console.warn('Fallback stream capture warning:', e);
      }
    }
  }

  // Choose appropriate MIME type
  let mimeType = 'video/webm';
  if (isFullVideo) {
    const fullMime = getPreferredFullVideoMime();
    mimeType = fullMime.mime;
  } else if (isTransparent) {
    const { preferredTransparentMime } = getSupportedVideoMimeTypes();
    mimeType = preferredTransparentMime;
  } else {
    const { preferredStandardMime } = getSupportedVideoMimeTypes();
    mimeType = preferredStandardMime;
  }

  const canvasStream = canvas.captureStream(fps);
  const combinedTracks: MediaStreamTrack[] = [
    ...canvasStream.getVideoTracks(),
    ...audioTracks
  ];
  const combinedStream = new MediaStream(combinedTracks);
  const chunks: Blob[] = [];

  let mediaRecorder: MediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 12_000_000 // 12 Mbps for crystal clear 1080p
    });
  } catch (err) {
    console.warn(`MediaRecorder init failed for ${mimeType}, attempting fallback to basic video/webm`, err);
    mediaRecorder = new MediaRecorder(combinedStream);
  }

  mediaRecorder.ondataavailable = e => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || mimeType });
      resolve(blob);
    };
    mediaRecorder.onerror = (err: any) => reject(err);
  });

  mediaRecorder.start(100);

  // If we have an active video with live audio track, run synchronous paced playback for pristine lip-sync
  if (isFullVideo && offscreenVideo && audioTracks.length > 0) {
    try {
      offscreenVideo.currentTime = 0;
      await offscreenVideo.play();
    } catch {
      // If unmuted play fails, continue
    }

    const startTime = performance.now();
    const effectiveDuration = Math.min(duration, offscreenVideo.duration || duration);

    while (!abortSignal?.aborted) {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const currentTime = offscreenVideo.currentTime || elapsed;

      drawCaptionFrame(ctx, width, height, currentTime, project.captions, project.customStyle, 'full-video', offscreenVideo);

      const percentage = Math.min(100, Math.round((currentTime / effectiveDuration) * 100));
      onProgress({
        status: 'rendering',
        currentFrame: Math.round(currentTime * fps),
        totalFrames,
        percentage,
        message: `Rendering full video + burned-in captions (${percentage}%)`
      });

      if (currentTime >= effectiveDuration || offscreenVideo.ended) {
        break;
      }

      await new Promise(r => setTimeout(r, Math.floor(frameDurationMs)));
    }

    try {
      offscreenVideo.pause();
    } catch {}
  } else {
    // Frame-by-frame loop (with seeking if video has no audio or transparent/green screen)
    for (let frame = 0; frame < totalFrames; frame++) {
      if (abortSignal?.aborted) {
        mediaRecorder.stop();
        throw new Error('Export cancelled by user');
      }

      const currentTime = frame / fps;

      if (offscreenVideo) {
        offscreenVideo.currentTime = currentTime;
        await new Promise(r => {
          offscreenVideo!.onseeked = () => r(null);
          setTimeout(r, 40);
        });
      }

      drawCaptionFrame(ctx, width, height, currentTime, project.captions, project.customStyle, renderMode, offscreenVideo);

      const percentage = Math.round(((frame + 1) / totalFrames) * 100);
      onProgress({
        status: 'rendering',
        currentFrame: frame + 1,
        totalFrames,
        percentage,
        message: isFullVideo
          ? `Rendering full video frame ${frame + 1} of ${totalFrames} (${percentage}%)`
          : `Rendering frame ${frame + 1} of ${totalFrames} (${percentage}%)`
      });

      await new Promise(r => setTimeout(r, Math.min(10, frameDurationMs)));
    }
  }

  onProgress({
    status: 'encoding',
    currentFrame: totalFrames,
    totalFrames,
    percentage: 100,
    message: 'Finalizing video stream and encoding container...'
  });

  mediaRecorder.stop();
  const finalBlob = await recordingPromise;

  // Cleanup
  combinedStream.getTracks().forEach(t => t.stop());
  canvasStream.getTracks().forEach(t => t.stop());
  audioTracks.forEach(t => t.stop());
  if (audioContext) {
    try {
      await audioContext.close();
    } catch {}
  }

  return finalBlob;
}

/**
 * Generates SubRip (.srt) format with UTF-8 BOM
 */
export function generateSRT(captions: CaptionSegment[]): string {
  function formatTimeSRT(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  }

  const srtEntries = captions.map((seg, idx) => {
    const startStr = formatTimeSRT(seg.start);
    const endStr = formatTimeSRT(seg.end);
    return `${idx + 1}\n${startStr} --> ${endStr}\n${seg.text.trim()}\n`;
  });

  return srtEntries.join('\n');
}

/**
 * Generates WebVTT (.vtt) format
 */
export function generateVTT(captions: CaptionSegment[]): string {
  function formatTimeVTT(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }

  let vtt = 'WEBVTT - SpiderHarshCaption Animated Subtitles\n\n';
  captions.forEach((seg, idx) => {
    vtt += `${idx + 1}\n${formatTimeVTT(seg.start)} --> ${formatTimeVTT(seg.end)}\n${seg.text.trim()}\n\n`;
  });
  return vtt;
}

/**
 * Helper to download a blob or text file
 */
export function downloadFile(blob: Blob | string, filename: string, mimeType = 'application/octet-stream') {
  const actualBlob = typeof blob === 'string' 
    ? new Blob(['\uFEFF' + blob], { type: `${mimeType};charset=utf-8` }) // UTF-8 BOM for Gurmukhi/Devanagari
    : blob;

  const url = URL.createObjectURL(actualBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
