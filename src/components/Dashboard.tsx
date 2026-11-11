import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Film, Clock, ArrowRight, Play, Star, Trash2, Edit2, Layers, BookOpen, Search, Check, Globe, Mic, Zap, ShieldAlert } from 'lucide-react';
import { CaptionProject, CaptionTemplate, SupportedLanguage, TemplateCategory } from '../types';
import { listProjects, deleteProject, getRecentlyUsedTemplates, getFavoriteTemplates } from '../storage/db';
import { TEMPLATE_PRESETS, CATEGORY_INFO, getTemplateById } from '../templates/presets';
import { createDefaultProject } from '../utils/sampleData';
import { LANGUAGES_50_PLUS } from '../utils/languages';

interface DashboardProps {
  onOpenProject: (project: CaptionProject) => void;
  onNewProject: () => void;
  onOpenCapCutGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenProject,
  onNewProject,
  onOpenCapCutGuide
}) => {
  const [projects, setProjects] = useState<CaptionProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrendingFilter, setActiveTrendingFilter] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projs = await listProjects();
      setProjects(projs);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      loadProjects();
    }
  };

  const handleLaunchSample = (langCode: string, templateId = 'reels-001') => {
    const proj = createDefaultProject(`Sample ${langCode.toUpperCase()} Reel`, langCode, templateId);
    onOpenProject(proj);
  };

  const popularLanguages = LANGUAGES_50_PLUS.slice(0, 14);

  const filteredTemplates = TEMPLATE_PRESETS.filter(t => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.config.fontFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.config.animation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrending = activeTrendingFilter === 'all' ||
      (activeTrendingFilter === 'pop' && (t.config.animation === 'word-pop' || t.config.animation === 'bounce')) ||
      (activeTrendingFilter === 'glow' && (t.config.animation === 'glow-pulse' || t.config.glow.enabled)) ||
      (activeTrendingFilter === 'karaoke' && t.config.animation === 'karaoke-highlight') ||
      (activeTrendingFilter === 'kinetic' && (t.config.animation === 'shake' || t.config.animation === 'rgb-split' || t.config.animation === 'elastic'));

    return matchesCat && matchesSearch && matchesTrending;
  }).slice(0, 48);

  return (
    <div className="w-full min-h-screen bg-[#07080D] text-slate-100 flex flex-col">
      {/* Iron Man Stark Tech Hero Banner */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20 spider-grid-pattern">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Arc Reactor Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-6 arc-reactor-glow">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>STARK EDITION · 50+ LANGUAGES & CAPCUT OVERLAY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-5">
            Viral Animated Captions with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-rose-400 to-amber-400">
              Iron Man Precision.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mb-8 leading-relaxed">
            The studio for Instagram Reels, YouTube Shorts & CapCut creators. 500+ trending motion presets, automatic multi-language speech recognition in 50+ languages, and transparent video export.
          </p>

          {/* Primary CTA Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 w-full max-w-md">
            <button
              onClick={onNewProject}
              className="flex-1 sm:flex-initial px-6 py-3.5 text-sm font-black rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Captions</span>
            </button>

            <button
              onClick={onOpenCapCutGuide}
              className="flex-1 sm:flex-initial px-5 py-3.5 text-sm font-bold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 border border-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>CapCut Pipeline</span>
            </button>
          </div>

          {/* 50+ Languages Instant Quick-Start Carousel */}
          <div className="w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-[#0B0F1A]/80 border border-cyan-500/20 backdrop-blur-md text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Test In Your Language (50+ Supported)
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400/80">
                1-Click Instant Transcripts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {popularLanguages.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleLaunchSample(l.code, 'reels-001')}
                  className="p-2 rounded-xl bg-white/[0.02] hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-400/40 text-left transition-all group"
                  title={`Start with ${l.name}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm">{l.flag}</span>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                      {l.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {l.nativeName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-10">
        {/* Recent Projects Section */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Recent Projects</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Stored securely in your local browser database
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj)}
                  className="p-4 rounded-2xl bg-[#0C101C] border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                        {proj.language}
                      </span>
                      <button
                        onClick={e => handleDelete(e, proj.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate mb-1 group-hover:text-cyan-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-mono">
                      "{proj.captions[0]?.text || 'No captions'}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                    <span className="text-slate-300 font-semibold">
                      {proj.captions.length} captions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 500+ Trending Motion Templates Section */}
        <section className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-red-500" />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  500+ Trending Motion Templates
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Word Pop, Karaoke Syllables, Iron Man HUD, RGB Split, and Retention Bounces
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search styles, fonts, effects..."
                className="w-full bg-[#101424] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Trending Effect Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Trending Motion:</span>
            {[
              { id: 'all', label: 'All Styles' },
              { id: 'pop', label: '🔥 Hormozi / MrBeast Pop' },
              { id: 'glow', label: '⚡ Arc Reactor & Neon Glow' },
              { id: 'karaoke', label: '🎵 Karaoke Syllable Wave' },
              { id: 'kinetic', label: '💥 RGB Split & Shake' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveTrendingFilter(f.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTrendingFilter === f.id
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-black font-extrabold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              All (500)
            </button>
            {(Object.keys(CATEGORY_INFO) as TemplateCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-extrabold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {CATEGORY_INFO[cat].label} ({CATEGORY_INFO[cat].count})
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map(template => {
              const cfg = template.config;

              return (
                <div
                  key={template.id}
                  onClick={() => {
                    const proj = createDefaultProject(`${template.name} Reel`, 'en', template.id);
                    onOpenProject(proj);
                  }}
                  className="rounded-2xl p-4 bg-[#0A0E1A] border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {template.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/80 uppercase">
                      {template.category}
                    </span>
                  </div>

                  {/* Visual Render Preview with live hover motion */}
                  <div className="py-6 px-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center text-center overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform">
                    <div
                      style={{
                        fontFamily: `"${cfg.fontFamily}", system-ui, sans-serif`,
                        fontWeight: cfg.fontWeight,
                        fontSize: '20px',
                        color: cfg.highlightColor,
                        textTransform: cfg.textTransform,
                        letterSpacing: `${cfg.letterSpacing}px`,
                        WebkitTextStroke: cfg.stroke.enabled ? `${cfg.stroke.width * 0.8}px ${cfg.stroke.color}` : undefined,
                        textShadow: cfg.glow.enabled
                          ? `0 0 12px ${cfg.glow.color}`
                          : cfg.shadow.enabled
                          ? `2px 2px 4px ${cfg.shadow.color}`
                          : undefined,
                        backgroundColor: cfg.box.enabled ? cfg.box.color : undefined,
                        padding: cfg.box.enabled ? '4px 10px' : undefined,
                        borderRadius: cfg.box.enabled ? `${cfg.box.borderRadius * 0.7}px` : undefined
                      }}
                    >
                      VIRAL MOTION
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-400/70">
                      {cfg.animation}
                    </span>
                    <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Use Preset &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
