import React, { useState, useEffect, useRef } from 'react';
import { CaptionProject, CaptionStyleConfig, CaptionTemplate, CaptionSegment, VideoMetadata, AspectRatio, SupportedLanguage } from '../../types';
import { TemplateSelector } from './TemplateSelector';
import { VideoCanvasPreview } from './VideoCanvasPreview';
import { StyleInspector } from './StyleInspector';
import { CaptionTimeline } from './CaptionTimeline';
import { VideoUploadModal } from './VideoUploadModal';
import { TranscriptionModal } from './TranscriptionModal';
import { ExportModal } from './ExportModal';
import { saveProject, getFavoriteTemplates, toggleFavoriteTemplate, addRecentlyUsedTemplate } from '../../storage/db';
import { Sparkles, Video, Layers, Sliders, Edit3, PanelLeftClose, PanelRightClose, PanelLeft, PanelRight } from 'lucide-react';

interface CaptionStudioProps {
  project: CaptionProject;
  onUpdateProject: (updated: CaptionProject) => void;
  onOpenCapCutGuide: () => void;
}

export const CaptionStudio: React.FC<CaptionStudioProps> = ({
  project,
  onUpdateProject,
  onOpenCapCutGuide
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  // Responsive mobile active view: 'canvas' | 'templates' | 'style' | 'timeline'
  const [mobileActiveView, setMobileActiveView] = useState<'canvas' | 'templates' | 'style' | 'timeline'>('canvas');

  // Desktop panel toggle states
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(getFavoriteTemplates());

  // Animation frame loop for playback
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const tick = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime(prev => {
          const maxDur = Math.max(project.duration || 10, 1);
          const next = prev + delta;
          if (next >= maxDur) {
            return 0; // loop
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, project.duration]);

  // Debounced auto-save to IndexedDB
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProject(project).catch(err => console.warn('Auto-save err:', err));
    }, 800);
    return () => clearTimeout(timer);
  }, [project]);

  // Apply a preset template
  const handleSelectTemplate = (template: CaptionTemplate) => {
    addRecentlyUsedTemplate(template.id);
    const updated: CaptionProject = {
      ...project,
      activeTemplateId: template.id,
      customStyle: { ...template.config },
      updatedAt: Date.now()
    };
    onUpdateProject(updated);
  };

  const handleUpdateStyle = (newStyle: CaptionStyleConfig) => {
    onUpdateProject({
      ...project,
      customStyle: newStyle,
      updatedAt: Date.now()
    });
  };

  const handleUpdateCaptions = (captions: CaptionSegment[]) => {
    let maxEnd = project.duration;
    captions.forEach(c => {
      if (c.end > maxEnd) maxEnd = Math.ceil(c.end);
    });

    onUpdateProject({
      ...project,
      captions,
      duration: maxEnd,
      updatedAt: Date.now()
    });
  };

  const handleToggleFavorite = (templateId: string) => {
    const nextFavs = toggleFavoriteTemplate(templateId);
    setFavorites(nextFavs);
  };

  const handleVideoSelected = (meta: VideoMetadata) => {
    onUpdateProject({
      ...project,
      video: meta,
      duration: Math.max(project.duration, Math.ceil(meta.duration)),
      aspectRatio: meta.width > meta.height ? '16:9' : '9:16',
      updatedAt: Date.now()
    });
    setMobileActiveView('canvas');
  };

  const handleCaptionsGenerated = (newCaptions: CaptionSegment[], detectedLang: SupportedLanguage) => {
    let maxEnd = project.duration;
    newCaptions.forEach(c => {
      if (c.end > maxEnd) maxEnd = Math.ceil(c.end);
    });

    onUpdateProject({
      ...project,
      captions: newCaptions,
      language: detectedLang,
      duration: Math.max(maxEnd, 5),
      updatedAt: Date.now()
    });
    setCurrentTime(0);
    setMobileActiveView('canvas');
  };

  const handleUpdateAspectRatio = (ratio: AspectRatio) => {
    onUpdateProject({
      ...project,
      aspectRatio: ratio,
      updatedAt: Date.now()
    });
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-57px)] flex flex-col bg-[#07080D] overflow-hidden">
      {/* Mobile & Tablet HUD Navigation Bar (Screens < 1280px) */}
      <div className="flex xl:hidden items-center justify-between px-3 py-2 bg-[#090C16] border-b border-cyan-500/20 overflow-x-auto scrollbar-none gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setMobileActiveView('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'canvas'
                ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>

          <button
            onClick={() => setMobileActiveView('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'templates'
                ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates (500)</span>
          </button>

          <button
            onClick={() => setMobileActiveView('style')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'style'
                ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Style Tools</span>
          </button>

          <button
            onClick={() => setMobileActiveView('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'timeline'
                ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Captions ({project.captions.length})</span>
          </button>
        </div>

        {/* Quick Auto Captions button on Mobile Bar */}
        <button
          onClick={() => setIsTranscribeOpen(true)}
          className="px-2.5 py-1 text-xs font-black rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shrink-0 flex items-center gap-1 shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>Auto Captions</span>
        </button>
      </div>

      {/* Mobile & Tablet Dual Split View (< 1280px) */}
      <div className="flex-1 flex flex-col xl:hidden overflow-hidden w-full h-full">
        {mobileActiveView === 'canvas' ? (
          /* Full Canvas Mode */
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
            <div className="flex-1 flex flex-col overflow-hidden">
              <VideoCanvasPreview
                project={project}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(prev => !prev)}
                onSeek={time => setCurrentTime(time)}
                onUpdateAspectRatio={handleUpdateAspectRatio}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenTranscribe={() => setIsTranscribeOpen(true)}
                compact={false}
              />
            </div>
            <div className="w-full shrink-0">
              <CaptionTimeline
                captions={project.captions}
                currentTime={currentTime}
                duration={project.duration}
                isPlaying={isPlaying}
                onSeek={time => setCurrentTime(time)}
                onTogglePlay={() => setIsPlaying(prev => !prev)}
                onUpdateCaptions={handleUpdateCaptions}
                onSelectSegment={id => setSelectedSegmentId(id)}
                selectedSegmentId={selectedSegmentId}
                onOpenTranscribe={() => setIsTranscribeOpen(true)}
              />
            </div>
          </div>
        ) : (
          /* Split View: Top Video Canvas (LIVE PREVIEW) + Bottom Tools */
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
            {/* Top Sticky Live Video Preview - always visible while using style/templates/timeline tools */}
            <div className="h-[38vh] min-h-[220px] max-h-[340px] shrink-0 border-b border-cyan-500/25 bg-[#06080E] relative shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-1 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold uppercase pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Preview
              </div>
              <VideoCanvasPreview
                project={project}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(prev => !prev)}
                onSeek={time => setCurrentTime(time)}
                onUpdateAspectRatio={handleUpdateAspectRatio}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenTranscribe={() => setIsTranscribeOpen(true)}
                compact={true}
              />
            </div>

            {/* Bottom Drawer for Style Tools, 500 Templates, or Caption Editor */}
            <div className="flex-1 overflow-y-auto w-full bg-[#080B14]">
              {mobileActiveView === 'style' && (
                <StyleInspector
                  config={project.customStyle}
                  onChange={handleUpdateStyle}
                  language={project.language}
                />
              )}
              {mobileActiveView === 'templates' && (
                <TemplateSelector
                  activeTemplateId={project.activeTemplateId}
                  onSelectTemplate={handleSelectTemplate}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  language={project.language}
                />
              )}
              {mobileActiveView === 'timeline' && (
                <CaptionTimeline
                  captions={project.captions}
                  currentTime={currentTime}
                  duration={project.duration}
                  isPlaying={isPlaying}
                  onSeek={time => setCurrentTime(time)}
                  onTogglePlay={() => setIsPlaying(prev => !prev)}
                  onUpdateCaptions={handleUpdateCaptions}
                  onSelectSegment={id => setSelectedSegmentId(id)}
                  selectedSegmentId={selectedSegmentId}
                  onOpenTranscribe={() => setIsTranscribeOpen(true)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Multi-Panel Studio (Screens >= 1280px) */}
      <div className="hidden xl:flex flex-1 overflow-hidden relative">
        {/* Left: Template Tray */}
        {showLeftPanel && (
          <div className="h-full w-80 shrink-0 z-20">
            <TemplateSelector
              activeTemplateId={project.activeTemplateId}
              onSelectTemplate={handleSelectTemplate}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              language={project.language}
            />
          </div>
        )}

        {/* Center: Live Video Canvas */}
        <div className="flex-1 h-full flex flex-col">
          {/* Top Panel Controls bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#06080E] border-b border-cyan-500/15 text-xs text-slate-400">
            <button
              onClick={() => setShowLeftPanel(p => !p)}
              className="hover:text-cyan-400 flex items-center gap-1 font-mono text-[11px]"
              title={showLeftPanel ? 'Hide Template Tray' : 'Show Template Tray'}
            >
              {showLeftPanel ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
              <span>{showLeftPanel ? 'Collapse Templates' : 'Open Templates'}</span>
            </button>

            {/* Stark Tech Status Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] text-cyan-300 font-bold uppercase">
                STARK HUD · {project.aspectRatio} · {project.customStyle.animation}
              </span>
            </div>

            <button
              onClick={() => setShowRightPanel(p => !p)}
              className="hover:text-cyan-400 flex items-center gap-1 font-mono text-[11px]"
              title={showRightPanel ? 'Hide Styling Inspector' : 'Show Styling Inspector'}
            >
              <span>{showRightPanel ? 'Collapse Inspector' : 'Open Inspector'}</span>
              {showRightPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <VideoCanvasPreview
            project={project}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(prev => !prev)}
            onSeek={time => setCurrentTime(time)}
            onUpdateAspectRatio={handleUpdateAspectRatio}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenTranscribe={() => setIsTranscribeOpen(true)}
            compact={false}
          />
        </div>

        {/* Right: Style & Animation Inspector */}
        {showRightPanel && (
          <div className="h-full w-80 shrink-0 z-20">
            <StyleInspector
              config={project.customStyle}
              onChange={handleUpdateStyle}
              language={project.language}
            />
          </div>
        )}
      </div>

      {/* Desktop Bottom Timeline */}
      <div className="hidden xl:block w-full shrink-0">
        <CaptionTimeline
          captions={project.captions}
          currentTime={currentTime}
          duration={project.duration}
          isPlaying={isPlaying}
          onSeek={time => setCurrentTime(time)}
          onTogglePlay={() => setIsPlaying(prev => !prev)}
          onUpdateCaptions={handleUpdateCaptions}
          onSelectSegment={id => setSelectedSegmentId(id)}
          selectedSegmentId={selectedSegmentId}
          onOpenTranscribe={() => setIsTranscribeOpen(true)}
        />
      </div>

      {/* Modals */}
      <VideoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoSelected={handleVideoSelected}
        currentVideo={project.video}
      />

      <TranscriptionModal
        isOpen={isTranscribeOpen}
        onClose={() => setIsTranscribeOpen(false)}
        onCaptionsGenerated={handleCaptionsGenerated}
        currentVideo={project.video}
        currentLanguage={project.language}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />
    </div>
  );
};
