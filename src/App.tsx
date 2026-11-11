import React, { useState } from 'react';
import { CaptionProject, SupportedLanguage, CaptionSegment } from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CaptionStudio } from './components/editor/CaptionStudio';
import { CapCutGuideModal } from './components/common/CapCutGuideModal';
import { TranscriptionModal } from './components/editor/TranscriptionModal';
import { ExportModal } from './components/editor/ExportModal';
import { createDefaultProject } from './utils/sampleData';
import { saveProject } from './storage/db';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [currentProject, setCurrentProject] = useState<CaptionProject>(() => {
    return createDefaultProject('My Viral Reel', 'en', 'reels-001');
  });
  const [isCapCutGuideOpen, setIsCapCutGuideOpen] = useState(false);
  const [isGlobalTranscribeOpen, setIsGlobalTranscribeOpen] = useState(false);
  const [isGlobalExportOpen, setIsGlobalExportOpen] = useState(false);

  const handleNewProject = () => {
    const freshProject = createDefaultProject('New Reel Project', 'en', 'reels-001');
    setCurrentProject(freshProject);
    saveProject(freshProject).catch(() => {});
    setCurrentView('editor');
  };

  const handleOpenProject = (project: CaptionProject) => {
    setCurrentProject(project);
    setCurrentView('editor');
  };

  const handleUpdateProject = (updated: CaptionProject) => {
    setCurrentProject(updated);
  };

  const handleCaptionsGenerated = (newCaptions: CaptionSegment[], detectedLang: SupportedLanguage) => {
    let maxEnd = currentProject.duration;
    newCaptions.forEach(c => {
      if (c.end > maxEnd) maxEnd = Math.ceil(c.end);
    });

    const updated: CaptionProject = {
      ...currentProject,
      captions: newCaptions,
      language: detectedLang,
      duration: Math.max(maxEnd, 5),
      updatedAt: Date.now()
    };
    setCurrentProject(updated);
    saveProject(updated).catch(() => {});
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewProject={handleNewProject}
        onOpenCapCutGuide={() => setIsCapCutGuideOpen(true)}
        onOpenExport={() => setIsGlobalExportOpen(true)}
        onOpenTranscribe={() => setIsGlobalTranscribeOpen(true)}
        projectTitle={currentProject.title}
        hasCaptions={currentProject.captions.length > 0}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'dashboard' ? (
          <Dashboard
            onOpenProject={handleOpenProject}
            onNewProject={handleNewProject}
            onOpenCapCutGuide={() => setIsCapCutGuideOpen(true)}
          />
        ) : (
          <CaptionStudio
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onOpenCapCutGuide={() => setIsCapCutGuideOpen(true)}
          />
        )}
      </main>

      {/* CapCut Workflow Step-by-Step Modal */}
      <CapCutGuideModal
        isOpen={isCapCutGuideOpen}
        onClose={() => setIsCapCutGuideOpen(false)}
      />

      {/* Global Auto Caption Modal (50+ Languages) */}
      <TranscriptionModal
        isOpen={isGlobalTranscribeOpen}
        onClose={() => setIsGlobalTranscribeOpen(false)}
        onCaptionsGenerated={handleCaptionsGenerated}
        currentVideo={currentProject.video}
        currentLanguage={currentProject.language}
      />

      {/* Global Export Modal */}
      <ExportModal
        isOpen={isGlobalExportOpen}
        onClose={() => setIsGlobalExportOpen(false)}
        project={currentProject}
      />
    </div>
  );
}
