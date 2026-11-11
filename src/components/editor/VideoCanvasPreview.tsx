import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Shield, Eye, Video as VideoIcon, Sparkles } from 'lucide-react';
import { CaptionProject, CaptionStyleConfig, CaptionSegment, AspectRatio } from '../../types';
import { computeWordState, getWordInlineStyle } from '../../animations/engine';

interface VideoCanvasPreviewProps {
  project: CaptionProject;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  onOpenUpload: () => void;
  onOpenTranscribe: () => void;
  compact?: boolean;
}

export const VideoCanvasPreview: React.FC<VideoCanvasPreviewProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  onUpdateAspectRatio,
  onOpenUpload,
  onOpenTranscribe,
  compact = false
}) => {
  const [showSafeGuides, setShowSafeGuides] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync HTML5 video element with applet currentTime and isPlaying
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.25) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackSpeed;
    video.muted = isMuted;
  }, [playbackSpeed, isMuted]);

  // Find active caption segment
  const activeSegment = project.captions.find(
    s => currentTime >= s.start && currentTime <= s.end
  );

  const cfg = project.customStyle;

  // Aspect ratio geometry classes
  const aspectClass = compact
    ? project.aspectRatio === '9:16'
      ? 'aspect-[9/16] h-full max-h-[34vh] max-w-[210px]'
      : project.aspectRatio === '16:9'
      ? 'aspect-[16/9] w-full max-w-[340px] max-h-[30vh]'
      : project.aspectRatio === '1:1'
      ? 'aspect-square max-h-[32vh] max-w-[240px]'
      : 'aspect-[4/5] max-h-[34vh] max-w-[230px]'
    : project.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[70vh]'
      : project.aspectRatio === '16:9'
      ? 'aspect-[16/9] w-full max-w-2xl'
      : project.aspectRatio === '1:1'
      ? 'aspect-square max-h-[65vh]'
      : 'aspect-[4/5] max-h-[68vh]';

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className={`flex-1 h-full bg-[#070910] flex flex-col items-center justify-between overflow-hidden relative ${
      compact ? 'p-1.5 gap-1.5' : 'p-4'
    }`}>
      {/* Top Preview Controls Bar */}
      <div className={`w-full flex items-center justify-between px-2 ${
        compact ? 'mb-1 max-w-full' : 'mb-3 max-w-3xl'
      }`}>
        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1 bg-[#121626] p-0.5 rounded-xl border border-white/[0.08]">
          {(['9:16', '16:9', '1:1', '4:5'] as AspectRatio[]).map(r => (
            <button
              key={r}
              onClick={() => onUpdateAspectRatio(r)}
              className={`rounded-lg font-bold transition-all ${
                compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
              } ${
                project.aspectRatio === r
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '9:16' ? (compact ? '9:16' : '9:16 Reels') : r === '16:9' ? (compact ? '16:9' : '16:9 YouTube') : r === '1:1' ? (compact ? '1:1' : '1:1 Square') : (compact ? '4:5' : '4:5 Feed')}
            </button>
          ))}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* Prominent Auto Captions Button */}
          <button
            onClick={onOpenTranscribe}
            className="px-3 py-1.5 rounded-lg border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-black text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
            title="Generate captions in 50+ languages with Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
            <span>Auto Captions (50+)</span>
          </button>

          {/* Safe Area Guides */}
          <button
            onClick={() => setShowSafeGuides(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              showSafeGuides
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Instagram/TikTok Safe Margins"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Safe Guides</span>
          </button>

          {/* Quick Upload Video */}
          <button
            onClick={onOpenUpload}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
            title="Replace or upload video"
          >
            <VideoIcon className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Change Video</span>
          </button>
        </div>
      </div>

      {/* Center Video & Caption Viewport */}
      <div
        ref={containerRef}
        className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 flex items-center justify-center select-none group`}
      >
        {/* Video Player or Fallback Backdrop */}
        {project.video?.url ? (
          <video
            ref={videoRef}
            src={project.video.url}
            className="w-full h-full object-cover pointer-events-none"
            playsInline
            muted={isMuted}
            onEnded={() => onSeek(0)}
          />
        ) : (
          <div className="w-full h-full spider-grid-pattern bg-[#090B12] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500/20 via-blue-500/20 to-transparent border border-red-500/30 flex items-center justify-center mb-4">
              <VideoIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Preview Canvas
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Upload your CapCut video or test animated captions right away on this canvas
            </p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer"
            >
              Upload Video Track
            </button>
          </div>
        )}

        {/* Instagram / TikTok Safe Area Guides */}
        {showSafeGuides && (
          <div className="absolute inset-0 pointer-events-none z-20 border-2 border-dashed border-blue-500/40">
            {/* Top Bar Safe Margin */}
            <div className="absolute top-0 left-0 right-0 h-[14%] bg-blue-500/10 border-b border-blue-500/30 flex items-center justify-center">
              <span className="text-[10px] font-mono text-blue-300">
                Top Safe Margin (Stories / Profile)
              </span>
            </div>

            {/* Bottom Actions Safe Margin */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-blue-500/10 border-t border-blue-500/30 flex items-center justify-center">
              <span className="text-[10px] font-mono text-blue-300">
                Bottom Safe Margin (Audio & Captions)
              </span>
            </div>

            {/* Right Action Icons Margin */}
            <div className="absolute top-[14%] bottom-[20%] right-0 w-[16%] bg-blue-500/5 border-l border-blue-500/20 flex items-center justify-center">
              <span className="text-[9px] font-mono text-blue-300 rotate-90 whitespace-nowrap">
                Right Icons Safe
              </span>
            </div>
          </div>
        )}

        {/* Live Animated Captions Overlay */}
        {activeSegment && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-10 flex flex-col items-center px-4 transition-all duration-75"
            style={{
              top: `${activeSegment.positionY ?? cfg.positionY}%`,
              transform: 'translateY(-50%)'
            }}
          >
            {/* Box wrapper if enabled */}
            <div
              className="inline-block max-w-[90%] text-center"
              style={{
                backgroundColor: cfg.box.enabled ? cfg.box.color : undefined,
                opacity: cfg.box.enabled ? cfg.box.opacity : 1,
                borderRadius: cfg.box.enabled ? `${cfg.box.borderRadius}px` : undefined,
                padding: cfg.box.enabled ? `${cfg.box.paddingY}px ${cfg.box.paddingX}px` : undefined,
                border: cfg.box.enabled && cfg.box.borderWidth > 0
                  ? `${cfg.box.borderWidth}px solid ${cfg.box.borderColor}`
                  : undefined
              }}
            >
              <div
                style={{
                  fontFamily: `"${cfg.fontFamily}", system-ui, sans-serif`,
                  fontWeight: cfg.fontWeight,
                  fontSize: `${cfg.fontSize}px`,
                  lineHeight: cfg.lineHeight,
                  letterSpacing: `${cfg.letterSpacing}px`,
                  textTransform: cfg.textTransform,
                  textAlign: cfg.textAlign
                }}
              >
                {activeSegment.words.map((wordObj, wIdx) => {
                  const state = computeWordState(
                    wordObj,
                    wIdx,
                    activeSegment.words.length,
                    activeSegment.start,
                    activeSegment.end,
                    currentTime,
                    cfg
                  );
                  const inlineStyle = getWordInlineStyle(state, cfg);

                  return (
                    <React.Fragment key={wIdx}>
                      <span style={inlineStyle}>
                        {wordObj.word}
                      </span>
                      {wIdx < activeSegment.words.length - 1 && ' '}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Media Bar */}
      <div className="w-full max-w-xl bg-[#121626]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl px-5 py-2.5 mt-3 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center transition-all shadow-md shadow-red-500/20 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Reset Playhead */}
          <button
            onClick={() => onSeek(0)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Mute */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
          {[0.5, 1, 1.5, 2].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors ${
                playbackSpeed === speed
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
