import React, { useState, useRef } from 'react';
import { X, Download, Film, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, FileText } from 'lucide-react';
import { CaptionProject, ExportFormat, ExportProgress } from '../../types';
import { exportVideoCaptions, generateSRT, generateVTT, downloadFile, getSupportedVideoMimeTypes, EXPORT_RESOLUTIONS } from '../../export/exportEngine';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CaptionProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('full-video');
  const [progress, setProgress] = useState<ExportProgress>({
    status: 'idle',
    currentFrame: 0,
    totalFrames: 0,
    percentage: 0,
    message: ''
  });
  const [downloadBlob, setDownloadBlob] = useState<{ blob: Blob | string; filename: string; mimeType: string } | null>(null);
  const abortSignalRef = useRef<{ aborted: boolean }>({ aborted: false });

  if (!isOpen) return null;

  const { transparentSupported, preferredTransparentMime } = getSupportedVideoMimeTypes();

  const handleStartExport = async () => {
    abortSignalRef.current = { aborted: false };
    setDownloadBlob(null);

    // If text subtitle format
    if (selectedFormat === 'srt') {
      const srtContent = generateSRT(project.captions);
      const filename = `${project.title.toLowerCase().replace(/\s+/g, '_')}_captions.srt`;
      downloadFile(srtContent, filename, 'text/plain');
      setProgress({
        status: 'completed',
        currentFrame: 1,
        totalFrames: 1,
        percentage: 100,
        message: 'SRT Subtitles exported successfully with Unicode encoding!'
      });
      setDownloadBlob({ blob: srtContent, filename, mimeType: 'text/plain' });
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      return;
    }

    if (selectedFormat === 'vtt') {
      const vttContent = generateVTT(project.captions);
      const filename = `${project.title.toLowerCase().replace(/\s+/g, '_')}_captions.vtt`;
      downloadFile(vttContent, filename, 'text/vtt');
      setProgress({
        status: 'completed',
        currentFrame: 1,
        totalFrames: 1,
        percentage: 100,
        message: 'WebVTT Subtitles exported successfully!'
      });
      setDownloadBlob({ blob: vttContent, filename, mimeType: 'text/vtt' });
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      return;
    }

    // Video export formats: full-video, webm-transparent or webm-green / mp4-green
    try {
      setProgress({
        status: 'rendering',
        currentFrame: 0,
        totalFrames: Math.ceil((project.duration || 10) * 30),
        percentage: 0,
        message: selectedFormat === 'full-video'
          ? 'Preparing video stream, audio mixer & caption engine...'
          : 'Preparing frame renderer...'
      });

      const videoBlob = await exportVideoCaptions(
        project,
        selectedFormat,
        prog => setProgress(prog),
        abortSignalRef.current
      );

      const ext = selectedFormat === 'mp4-green'
        ? 'mp4'
        : (videoBlob.type.includes('mp4') ? 'mp4' : 'webm');

      const filename = selectedFormat === 'full-video'
        ? `${project.title.toLowerCase().replace(/\s+/g, '_')}_with_captions.${ext}`
        : `${project.title.toLowerCase().replace(/\s+/g, '_')}_${selectedFormat}_animated.${ext}`;

      // Automatically trigger download
      downloadFile(videoBlob, filename, videoBlob.type);

      setProgress({
        status: 'completed',
        currentFrame: Math.ceil((project.duration || 10) * 30),
        totalFrames: Math.ceil((project.duration || 10) * 30),
        percentage: 100,
        message: selectedFormat === 'full-video'
          ? 'Full video with burned-in captions & audio exported successfully!'
          : 'Animated video exported successfully!'
      });

      setDownloadBlob({
        blob: videoBlob,
        filename,
        mimeType: videoBlob.type
      });

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      if (err?.message === 'Export cancelled by user') {
        setProgress({
          status: 'idle',
          currentFrame: 0,
          totalFrames: 0,
          percentage: 0,
          message: 'Export was cancelled'
        });
      } else {
        console.error('Export error:', err);
        setProgress({
          status: 'error',
          currentFrame: 0,
          totalFrames: 0,
          percentage: 0,
          message: err?.message || 'Video export failed'
        });
      }
    }
  };

  const handleCancelExport = () => {
    abortSignalRef.current.aborted = true;
  };

  const resolution = EXPORT_RESOLUTIONS[project.aspectRatio] || EXPORT_RESOLUTIONS['9:16'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090D1A] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#06080E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Download className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                Export Studio Captions
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Full Video + Overlay
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct complete video download or transparent overlay for CapCut
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Export Format Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Choose Export Option
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1: Complete Full Video with Captions (TOP PRIORITY) */}
              <button
                type="button"
                onClick={() => setSelectedFormat('full-video')}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between md:col-span-2 relative overflow-hidden group ${
                  selectedFormat === 'full-video'
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-950/50 via-[#0B1528] to-red-950/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                      <Film className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white tracking-wide">
                          Full Video with Burned-In Captions
                        </span>
                        <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/40">
                          Recommended
                        </span>
                      </div>
                      <span className="text-[11px] text-cyan-400/90 font-mono">
                        Includes Video + Animated Captions + Original Audio
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ready to Post
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Downloads the <strong>complete video</strong> with your animated subtitles permanently embedded with the original sound. Ready to post directly to Instagram Reels, YouTube Shorts, and TikTok without needing CapCut!
                </p>
              </button>

              {/* Option 2: Transparent WebM for CapCut */}
              <button
                type="button"
                onClick={() => setSelectedFormat('webm-transparent')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedFormat === 'webm-transparent'
                    ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-bold text-white">
                      Transparent WebM Overlay
                    </span>
                  </div>
                  {transparentSupported && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                      Alpha VP9
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export captions with 100% transparent background. Drop into CapCut as an overlay layer.
                </p>
              </button>

              {/* Option 3: Green Screen Chroma Key */}
              <button
                type="button"
                onClick={() => setSelectedFormat('webm-green')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedFormat === 'webm-green'
                    ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00FF00] border border-black/40" />
                    <span className="text-sm font-bold text-white">
                      Green-Screen Video
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                    Chroma Key
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vibrant green backdrop for universal compatibility with CapCut mobile Chroma Key removal.
                </p>
              </button>

              {/* Option 4: SRT Subtitles */}
              <button
                type="button"
                onClick={() => setSelectedFormat('srt')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedFormat === 'srt'
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">
                      SubRip Subtitles (.srt)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Unicode UTF-8
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Standard SRT file with millisecond timestamps and native 50+ language support.
                </p>
              </button>

              {/* Option 5: WebVTT */}
              <button
                type="button"
                onClick={() => setSelectedFormat('vtt')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedFormat === 'vtt'
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">
                      WebVTT Subtitles (.vtt)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    Web Player
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Modern WebVTT subtitles for web video players and YouTube custom caption tracks.
                </p>
              </button>
            </div>
          </div>

          {/* Resolution & Project Specs */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Resolution:</span>{' '}
              <strong className="text-white">{resolution.label}</strong>
            </div>
            <div>
              <span className="text-slate-400">Duration:</span>{' '}
              <strong className="text-white font-mono">{project.duration || 10}s</strong>
            </div>
          </div>

          {/* Progress / Status Display */}
          {(progress.status === 'rendering' || progress.status === 'encoding') && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-red-500 animate-spin" />
                  {progress.message}
                </span>
                <span className="font-mono font-bold text-red-400">
                  {progress.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-150"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Rendering frame-by-frame for exact typography and glow</span>
                <button
                  type="button"
                  onClick={handleCancelExport}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  Cancel Export
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {progress.status === 'completed' && downloadBlob && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">
                    Export Ready!
                  </p>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">
                    {downloadBlob.filename}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => downloadFile(downloadBlob.blob, downloadBlob.filename, downloadBlob.mimeType)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Again</span>
              </button>
            </div>
          )}

          {/* Error State */}
          {progress.status === 'error' && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{progress.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#090B12]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            disabled={progress.status === 'rendering' || progress.status === 'encoding'}
            onClick={handleStartExport}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 transition-all flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {progress.status === 'rendering' ? 'Exporting...' : 'Render & Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
