import React, { useState, useMemo } from 'react';
import { Search, Star, Sparkles, Filter, Check } from 'lucide-react';
import { CaptionTemplate, TemplateCategory } from '../../types';
import { TEMPLATE_PRESETS, CATEGORY_INFO } from '../../templates/presets';

interface TemplateSelectorProps {
  activeTemplateId: string;
  onSelectTemplate: (template: CaptionTemplate) => void;
  favorites: string[];
  onToggleFavorite: (templateId: string) => void;
  language: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  activeTemplateId,
  onSelectTemplate,
  favorites,
  onToggleFavorite,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: TemplateCategory | 'all' | 'favorites'; label: string; count?: number }[] = [
    { id: 'all', label: 'All 500 Presets', count: TEMPLATE_PRESETS.length },
    { id: 'favorites', label: 'Starred Favorites', count: favorites.length },
    { id: 'reels', label: 'Trending Reels', count: 70 },
    { id: 'podcast', label: 'Podcast Pro', count: 80 },
    { id: 'neon', label: 'Neon Glow', count: 70 },
    { id: 'karaoke', label: 'Karaoke', count: 60 },
    { id: '3d-motion', label: '3D Motion', count: 60 },
    { id: 'cinematic', label: 'Cinematic', count: 60 },
    { id: 'gaming', label: 'Gaming', count: 50 },
    { id: 'aesthetic', label: 'Aesthetic', count: 50 }
  ];

  const filteredTemplates = useMemo(() => {
    let result = TEMPLATE_PRESETS;

    if (selectedCategory === 'favorites') {
      result = result.filter(t => favorites.includes(t.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.config.fontFamily.toLowerCase().includes(q) ||
          t.config.animation.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, searchQuery, favorites]);

  // Preview sample text based on language
  const previewSampleText = language === 'hi' 
    ? 'प्रीमियम रील्स' 
    : language === 'pa' 
    ? 'ਵਧੀਆ ਕੈਪਸ਼ਨ' 
    : language === 'hinglish' 
    ? 'VIRAL REELS' 
    : 'VIRAL REEL';

  return (
    <div className="w-full lg:w-80 h-full bg-[#080B14] border-r border-cyan-500/20 flex flex-col overflow-hidden select-none">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-cyan-500/20 bg-[#06080E] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            500+ PRESET MATRIX
          </span>
          <span className="text-[11px] font-mono text-cyan-400/80">
            {filteredTemplates.length} styles
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search fonts, vibes, animations..."
            className="w-full bg-[#161B2E] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-red-500 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredTemplates.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No templates match your search. Try adjusting the query or category.
          </div>
        ) : (
          filteredTemplates.map(template => {
            const isSelected = template.id === activeTemplateId;
            const isFav = favorites.includes(template.id);
            const cfg = template.config;

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`relative rounded-xl p-3 border cursor-pointer transition-all group overflow-hidden ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-[#121626] border-white/[0.06] hover:border-white/20 hover:bg-[#161B2E]'
                }`}
              >
                {/* Top info row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                      {template.name}
                    </span>
                    {template.popular && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(template.id);
                      }}
                      className={`p-1 rounded hover:bg-white/10 transition-colors ${
                        isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Preview Card */}
                <div
                  className="w-full py-4 px-2 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center text-center overflow-hidden"
                  style={{
                    backgroundColor: cfg.box.enabled ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.45)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: `"${cfg.fontFamily}", system-ui, sans-serif`,
                      fontWeight: cfg.fontWeight,
                      fontSize: '18px',
                      color: cfg.highlightColor,
                      textTransform: cfg.textTransform,
                      letterSpacing: `${cfg.letterSpacing}px`,
                      WebkitTextStroke: cfg.stroke.enabled ? `${cfg.stroke.width * 0.7}px ${cfg.stroke.color}` : undefined,
                      textShadow: cfg.glow.enabled
                        ? `0 0 10px ${cfg.glow.color}`
                        : cfg.shadow.enabled
                        ? `2px 2px 4px ${cfg.shadow.color}`
                        : undefined,
                      backgroundColor: cfg.box.enabled ? cfg.box.color : undefined,
                      padding: cfg.box.enabled ? '4px 10px' : undefined,
                      borderRadius: cfg.box.enabled ? `${cfg.box.borderRadius * 0.6}px` : undefined
                    }}
                  >
                    {previewSampleText}
                  </div>
                </div>

                {/* Bottom metadata tags */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="capitalize">{template.category}</span>
                  <span className="font-mono text-slate-500">{cfg.animation}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
