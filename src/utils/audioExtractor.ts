/**
 * Extracts and downsamples audio from video file using the browser's Web Audio API
 */

export interface ExtractedAudioResult {
  base64: string;
  mimeType: string;
  duration: number;
  sampleRate: number;
}

/**
 * Encodes Float32 mono audio buffer into 16-bit PCM WAV Blob
 */
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * 2 for 16-bit mono)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, samples.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Downsamples an AudioBuffer to targetSampleRate (e.g. 16000Hz mono)
 */
function downsampleAudioBuffer(
  audioBuffer: AudioBuffer,
  targetSampleRate = 16000
): Float32Array {
  const originalSampleRate = audioBuffer.sampleRate;
  const originalLength = audioBuffer.length;
  const numChannels = audioBuffer.numberOfChannels;

  // Mix down to mono first
  const monoSamples = new Float32Array(originalLength);
  for (let c = 0; c < numChannels; c++) {
    const channelData = audioBuffer.getChannelData(c);
    for (let i = 0; i < originalLength; i++) {
      monoSamples[i] += channelData[i] / numChannels;
    }
  }

  if (originalSampleRate === targetSampleRate) {
    return monoSamples;
  }

  const sampleRatio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(originalLength / sampleRatio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalIndex = i * sampleRatio;
    const lowerIndex = Math.floor(originalIndex);
    const upperIndex = Math.min(lowerIndex + 1, originalLength - 1);
    const fraction = originalIndex - lowerIndex;
    result[i] = monoSamples[lowerIndex] * (1 - fraction) + monoSamples[upperIndex] * fraction;
  }

  return result;
}

/**
 * Extracts audio track from video file or blob
 */
export async function extractAudioFromVideo(
  videoFile: File | Blob,
  maxDurationSeconds = 120
): Promise<ExtractedAudioResult> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass();

  try {
    const arrayBuffer = await videoFile.arrayBuffer();
    const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);

    // Limit to max duration for fast transcription
    const duration = Math.min(decodedAudio.duration, maxDurationSeconds);
    const targetSampleRate = 16000;

    const monoDownsampled = downsampleAudioBuffer(decodedAudio, targetSampleRate);
    // Slice to duration
    const finalSamples = monoDownsampled.subarray(0, Math.round(duration * targetSampleRate));

    const wavBlob = encodeWAV(finalSamples, targetSampleRate);

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        const base64Index = resultStr.indexOf(',') + 1;
        resolve(resultStr.substring(base64Index));
      };
      reader.onerror = reject;
      reader.readAsDataURL(wavBlob);
    });

    return {
      base64,
      mimeType: 'audio/wav',
      duration,
      sampleRate: targetSampleRate
    };
  } finally {
    audioCtx.close().catch(() => {});
  }
}
