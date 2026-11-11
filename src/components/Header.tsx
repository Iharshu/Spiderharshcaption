import React from 'react';
import { Film, Sparkles, BookOpen, Download, Plus, Layers, Zap } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'editor';
  onNavigate: (view: 'dashboard' | 'editor') => void;
  onNewProject: () => void;
  onOpenCapCutGuide: () => void;
  onOpenExport?: () => void;
  onOpenTranscribe?: () => void;
  projectTitle?: string;
  hasCaptions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onNewProject,
  onOpenCapCutGuide,
  onOpenExport,
  onOpenTranscribe,
  projectTitle,
  hasCaptions
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090F]/95 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Mark with Iron Man Arc Reactor & Spider Motif */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group shrink-0"
        >
          {/* Iron Man / Arc Reactor Core */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-500 to-cyan-500 p-[1px] arc-reactor-glow transition-all group-hover:scale-105">
            <div className="w-full h-full rounded-xl bg-[#090C16] flex items-center justify-center relative overflow-hidden">
              {/* Arc Reactor Core Ring */}
              <div className="w-4 h-4 rounded-full border-2 border-cyan-400/80 flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                Spider<span className="text-red-500">Harsh</span>Caption
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/30">
                MARK 85
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              currentView === 'dashboard' ? 'text-white font-bold' : ''
            }`}
          >
            Dashboard
          </button>

          {currentView === 'editor' && (
            <span className="text-slate-600 font-light select-none">/</span>
          )}

          {currentView === 'editor' && (
            <span className="text-cyan-300 font-bold truncate max-w-xs whitespace-nowrap">
              {projectTitle || 'Studio Console'}
            </span>
          )}

          <button
            onClick={onOpenCapCutGuide}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-white text-slate-300"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>CapCut Pipeline</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Auto Captions Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Auto Caption Generator Button */}
          {currentView === 'editor' && onOpenTranscribe && (
            <button
              onClick={onOpenTranscribe}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-black rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
              title="Generate Captions in 50+ Languages"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>Auto Captions (50+)</span>
            </button>
          )}

          {currentView === 'editor' && onOpenExport ? (
            <button
              onClick={onOpenExport}
              disabled={!hasCaptions}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-lg ${
                hasCaptions
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          ) : (
            <button
              onClick={onNewProject}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black rounded-lg bg-gradient-to-r from-red-600 via-rose-500 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-white transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Create New Captions</span>
              <span className="sm:hidden">New Project</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
