import React from 'react';
import { X, CheckCircle2, ArrowRight, Video, Sparkles, Layers, Sliders, Download, Film } from 'lucide-react';

interface CapCutGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapCutGuideModal: React.FC<CapCutGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Edit Base Video in CapCut',
      desc: 'Cut, trim, color grade, and finalize your talking-head or voiceover video in CapCut first. Export your MP4/MOV file.',
      icon: Film,
      color: 'text-blue-400'
    },
    {
      num: 2,
      title: 'Upload to SpiderHarshCaption',
      desc: 'Drag & drop your edited video into SpiderHarshCaption. The studio automatically inspects video duration and resolution.',
      icon: Video,
      color: 'text-red-400'
    },
    {
      num: 3,
      title: 'Auto-Generate Multi-Language Captions',
      desc: 'Select Hindi (Devanagari), Punjabi (Gurmukhi), English, or Hinglish. Our speech engine produces syllable-accurate word timestamps.',
      icon: Sparkles,
      color: 'text-amber-400'
    },
    {
      num: 4,
      title: 'Choose from 500+ Presets',
      desc: 'Browse Podcast Pro, Neon Glow, Cinematic, Karaoke, 3D Motion, Trending Reels, Gaming, or Aesthetic styles.',
      icon: Layers,
      color: 'text-emerald-400'
    },
    {
      num: 5,
      title: 'Customize Typography & Glow',
      desc: 'Tailor font family from 100+ fonts, word highlight colors, outer glow intensity, stroke borders, and Instagram safe area positioning.',
      icon: Sliders,
      color: 'text-purple-400'
    },
    {
      num: 6,
      title: 'Export Transparent Video or SRT',
      desc: 'Export WebM with alpha transparency (VP9) for instant drag & drop overlay, or export Chroma Green Screen / SubRip SRT.',
      icon: Download,
      color: 'text-pink-400'
    },
    {
      num: 7,
      title: 'Import Overlay into CapCut',
      desc: 'Add the exported transparent video as an "Overlay" track on top of your original CapCut timeline. Perfectly aligned!',
      icon: CheckCircle2,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0F1322] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090B12]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-sm">
              7
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                CapCut & SpiderHarshCaption Workflow
              </h2>
              <p className="text-xs text-slate-400">
                The standard production pipeline for viral Instagram Reels & YouTube Shorts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map(step => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-red-500/30 transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-red-400 font-bold">
                        STEP {step.num}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pro Tips Box */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 via-blue-500/10 to-transparent border border-red-500/20">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Pro Tip for CapCut Chroma Keying:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your editing setup prefers MP4/MOV with Green-Screen: export using the <strong className="text-white">Green-Screen</strong> option, add it as an Overlay in CapCut, tap <strong className="text-white">Cutout &rarr; Chroma Key</strong>, pick the green backdrop, and set intensity to 10-15%. Clean transparent animated text instantly!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#090B12]">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md shadow-red-500/20"
          >
            Got it, Let's Edit
          </button>
        </div>
      </div>
    </div>
  );
};
