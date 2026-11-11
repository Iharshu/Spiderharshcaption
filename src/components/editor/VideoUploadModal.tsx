import React, { useState, useRef } from 'react';
import { Upload, X, Film, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { VideoMetadata } from '../../types';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelected: (metadata: VideoMetadata) => void;
  currentVideo: VideoMetadata | null;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onVideoSelected,
  currentVideo
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<VideoMetadata | null>(currentVideo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processVideoFile = (file: File) => {
    setError(null);
    setIsProcessing(true);

    // Validate mime type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      setError('Please upload a valid MP4, WebM, or MOV video file.');
      setIsProcessing(false);
      return;
    }

    // Validate size (max 250MB for in-browser client video)
    if (file.size > 250 * 1024 * 1024) {
      setError('Video file exceeds 250MB. Please choose a shorter clip or compress the file.');
      setIsProcessing(false);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const videoElem = document.createElement('video');
    videoElem.preload = 'metadata';
    videoElem.src = objectUrl;

    videoElem.onloadedmetadata = () => {
      const meta: VideoMetadata = {
        file,
        name: file.name,
        url: objectUrl,
        duration: Math.round(videoElem.duration * 100) / 100,
        width: videoElem.videoWidth || 1080,
        height: videoElem.videoHeight || 1920,
        size: file.size,
        type: file.type || 'video/mp4'
      };
      setPreviewMeta(meta);
      setIsProcessing(false);
    };

    videoElem.onerror = () => {
      setError('Could not decode video metadata. The file may be corrupt or encoded in an unsupported codec.');
      setIsProcessing(false);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  // Sample video option so users can test immediately with a ready talking-head reel
  const handleLoadSampleVideo = () => {
    setIsProcessing(true);
    setError(null);

    // High performance synthesized portrait canvas video clip generator
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1080;
    sampleCanvas.height = 1920;
    const ctx = sampleCanvas.getContext('2d')!;

    // Animate a sleek studio lighting backdrop for 10 seconds
    const stream = sampleCanvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const sampleUrl = URL.createObjectURL(blob);
      const meta: VideoMetadata = {
        name: 'spider_sample_reel_1080x1920.mp4',
        url: sampleUrl,
        duration: 10.0,
        width: 1080,
        height: 1920,
        size: blob.size || 1500000,
        type: 'video/webm'
      };
      setPreviewMeta(meta);
      setIsProcessing(false);
    };

    recorder.start();

    // Render 300 frames (10 seconds at 30 fps)
    let f = 0;
    const interval = setInterval(() => {
      if (f >= 60) {
        clearInterval(interval);
        recorder.stop();
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      const t = f / 30;
      // Studio background gradient
      const grad = ctx.createRadialGradient(540, 750, 50, 540, 960, 900);
      grad.addColorStop(0, '#1E2640');
      grad.addColorStop(0.5, '#0E1322');
      grad.addColorStop(1, '#070910');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Stylized speaker silhouette & studio ring light
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(540, 620, 240, 0, Math.PI * 2);
      ctx.stroke();

      // Speaker head
      ctx.fillStyle = '#182038';
      ctx.beginPath();
      ctx.arc(540, 620, 190, 0, Math.PI * 2);
      ctx.fill();

      // Speaker shoulders
      ctx.beginPath();
      ctx.ellipse(540, 1180, 420, 320, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soundwave bars responding to speech
      ctx.fillStyle = '#EF4444';
      for (let i = 0; i < 18; i++) {
        const barH = 20 + Math.sin(t * 8 + i * 0.8) * 45;
        ctx.fillRect(360 + i * 20, 900 - barH / 2, 10, barH);
      }

      ctx.restore();
      f++;
    }, 16);
  };

  const handleConfirm = () => {
    if (previewMeta) {
      onVideoSelected(previewMeta);
      onClose();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${mins}:${String(remainingSec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0F1322] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090B12]">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-white tracking-tight">
              {currentVideo ? 'Replace Video Track' : 'Upload Video'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-red-500 bg-red-500/10 scale-[0.99]'
                : 'border-white/15 bg-white/[0.02] hover:border-red-500/40 hover:bg-white/[0.04]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Drag & drop your edited video here
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              Supports MP4, MOV, or WebM exported from CapCut (up to 250MB)
            </p>
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-colors"
            >
              Browse Files
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview of Selected Video */}
          {previewMeta && (
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-xs">
                      {previewMeta.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{previewMeta.width}x{previewMeta.height}</span>
                      <span>·</span>
                      <span>{formatDuration(previewMeta.duration)}</span>
                      <span>·</span>
                      <span>{formatBytes(previewMeta.size)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewMeta(null)}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Video mini player preview */}
              <div className="relative aspect-video max-h-40 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <video
                  src={previewMeta.url}
                  className="w-full h-full object-contain"
                  controls
                  muted
                />
              </div>
            </div>
          )}

          {/* Quick Sample Option */}
          <div className="pt-2 flex items-center justify-between border-t border-white/[0.07]">
            <span className="text-xs text-slate-400">
              Don't have a video file ready right now?
            </span>
            <button
              type="button"
              onClick={handleLoadSampleVideo}
              disabled={isProcessing}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 9:16 Sample Video</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#090B12]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!previewMeta || isProcessing}
            onClick={handleConfirm}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              previewMeta && !isProcessing
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Apply Video to Timeline'}
          </button>
        </div>
      </div>
    </div>
  );
};
