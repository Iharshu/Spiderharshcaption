import React, { useState } from 'react';
import { Type, Palette, Sparkles, Box, Sliders, Move, AlignCenter, AlignLeft, AlignRight, Layers, Flame } from 'lucide-react';
import { CaptionStyleConfig, AnimationStyle, WordHighlightMode } from '../../types';
import { FONT_LIBRARY, getFontsForLanguage } from '../../utils/fontLibrary';

interface StyleInspectorProps {
  config: CaptionStyleConfig;
  onChange: (updated: CaptionStyleConfig) => void;
  language: string;
}

export const StyleInspector: React.FC<StyleInspectorProps> = ({ config, onChange, language }) => {
  const [activeTab, setActiveTab] = useState<'typography' | 'color' | 'glow' | 'box' | 'animation' | 'position'>('typography');

  const availableFonts = getFontsForLanguage(language);

  const update = (partial: Partial<CaptionStyleConfig>) => {
    onChange({ ...config, ...partial });
  };

  const updateStroke = (partial: Partial<CaptionStyleConfig['stroke']>) => {
    onChange({ ...config, stroke: { ...config.stroke, ...partial } });
  };

  const updateGlow = (partial: Partial<CaptionStyleConfig['glow']>) => {
    onChange({ ...config, glow: { ...config.glow, ...partial } });
  };

  const updateShadow = (partial: Partial<CaptionStyleConfig['shadow']>) => {
    onChange({ ...config, shadow: { ...config.shadow, ...partial } });
  };

  const updateBox = (partial: Partial<CaptionStyleConfig['box']>) => {
    onChange({ ...config, box: { ...config.box, ...partial } });
  };

  const animationOptions: { id: AnimationStyle; label: string; desc: string }[] = [
    { id: 'word-pop', label: 'Word Pop', desc: 'Punchy scale jump for viral short videos' },
    { id: 'bounce', label: 'Bounce', desc: 'Elastic bouncy kinetic impact' },
    { id: 'smooth-fade', label: 'Smooth Fade', desc: 'Gentle opacity ramp with soft drift' },
    { id: 'typewriter', label: 'Typewriter', desc: 'Instant crisp syllable popping' },
    { id: 'zoom-in', label: 'Zoom In', desc: 'Fast forward perspective expansion' },
    { id: 'zoom-out', label: 'Zoom Out', desc: 'Reverse scale deceleration' },
    { id: 'glow-pulse', label: 'Glow Pulse', desc: 'Electric radiant aura modulation' },
    { id: 'shake', label: 'Shake Impact', desc: 'High-energy tremor on active words' },
    { id: 'slide-up', label: 'Slide Up', desc: 'Upward dynamic entry' },
    { id: 'slide-down', label: 'Slide Down', desc: 'Downward kinetic sweep' },
    { id: 'rgb-split', label: 'RGB Split', desc: 'Chromatic aberration red/blue separation' },
    { id: 'karaoke-highlight', label: 'Karaoke Highlight', desc: 'Syllable-by-syllable smooth color wipe' },
    { id: 'elastic', label: 'Elastic Spring', desc: 'Spring-loaded rebound overshoot' },
    { id: 'blur-reveal', label: 'Blur Reveal', desc: 'Cinematic optical defocus into focus' },
    { id: 'flip', label: '3D Flip', desc: 'Kinetic 3D rotation reveal' },
    { id: 'scale-in', label: 'Scale In', desc: 'Micro to full size rapid pop' },
    { id: 'wave', label: 'Wave Flow', desc: 'Continuous sinusoidal undulating text' },
    { id: 'stagger', label: 'Stagger', desc: 'Cascading sequential word arrival' },
    { id: 'letter-reveal', label: 'Letter Reveal', desc: 'Clean typographic glyph discovery' },
    { id: 'cinematic-fade', label: 'Cinematic Fade', desc: 'Polished documentary film dissolve' }
  ];

  const highlightModes: { id: WordHighlightMode; label: string }[] = [
    { id: 'color-and-scale', label: 'Color + Scale' },
    { id: 'color', label: 'Color Only' },
    { id: 'scale', label: 'Scale Pop' },
    { id: 'glow', label: 'Glow Pulse' },
    { id: 'karaoke-fill', label: 'Karaoke Wipe' },
    { id: 'box', label: 'Word Box' }
  ];

  return (
    <div className="w-full lg:w-80 h-full bg-[#080B14] border-l border-cyan-500/20 flex flex-col overflow-hidden select-none">
      {/* Iron Man / Stark Quick Preset Strip */}
      <div className="p-2.5 border-b border-cyan-500/20 bg-[#06080E] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            STARK TECH HUD
          </span>
          <span className="text-slate-400 font-mono text-[10px]">QUICK STYLES</span>
        </div>

        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => update({
              fontFamily: 'Bebas Neue',
              fontWeight: 800,
              textColor: '#FFFFFF',
              highlightColor: '#00F0FF',
              animation: 'word-pop',
              stroke: { enabled: true, color: '#000000', width: 3 },
              glow: { enabled: true, color: '#00F0FF', blur: 18, spread: 2, intensity: 1.5 }
            })}
            className="px-1.5 py-1 text-[10px] font-bold rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all truncate"
            title="Arc Reactor HUD Style"
          >
            ⚡ Arc HUD
          </button>

          <button
            type="button"
            onClick={() => update({
              fontFamily: 'Montserrat',
              fontWeight: 900,
              textColor: '#FFFFFF',
              highlightColor: '#FFD700',
              animation: 'word-pop',
              stroke: { enabled: true, color: '#000000', width: 4 },
              glow: { enabled: false, color: '#FFD700', blur: 10, spread: 2, intensity: 1 }
            })}
            className="px-1.5 py-1 text-[10px] font-bold rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all truncate"
            title="Hormozi Viral Yellow"
          >
            🔥 Hormozi
          </button>

          <button
            type="button"
            onClick={() => update({
              fontFamily: 'Anton',
              fontWeight: 900,
              textColor: '#FFFFFF',
              highlightColor: '#EF4444',
              animation: 'shake',
              stroke: { enabled: true, color: '#000000', width: 4 },
              glow: { enabled: true, color: '#EF4444', blur: 14, spread: 2, intensity: 1.3 }
            })}
            className="px-1.5 py-1 text-[10px] font-bold rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all truncate"
            title="MrBeast Retention Shake"
          >
            💥 MrBeast
          </button>

          <button
            type="button"
            onClick={() => update({
              fontFamily: 'Poppins',
              fontWeight: 800,
              textColor: '#FFFFFF',
              highlightColor: '#38BDF8',
              animation: 'karaoke-highlight',
              stroke: { enabled: false, color: '#000', width: 0 },
              glow: { enabled: true, color: '#38BDF8', blur: 12, spread: 2, intensity: 1 }
            })}
            className="px-1.5 py-1 text-[10px] font-bold rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all truncate"
            title="Spotify Karaoke Syllable Wipe"
          >
            🎵 Karaoke
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-6 border-b border-cyan-500/15 bg-[#06080E] p-1 gap-1">
        <button
          onClick={() => setActiveTab('typography')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'typography'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Typography"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('color')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'color'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Colors & Highlights"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('glow')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'glow'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Glow & Shadow Effects"
        >
          <Flame className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('box')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'box'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Background Box"
        >
          <Box className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('animation')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'animation'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Animation Engine"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('position')}
          className={`py-2 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeTab === 'position'
              ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Position & Safe Area"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Typography */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Font Family (100+ Available)
              </label>
              <select
                value={config.fontFamily}
                onChange={e => update({ fontFamily: e.target.value })}
                className="w-full bg-[#161B2E] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-red-500 outline-none"
              >
                {availableFonts.map(f => (
                  <option key={`${f.name}-${f.category}`} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Font Size ({config.fontSize}px)
                </label>
                <input
                  type="range"
                  min="24"
                  max="76"
                  value={config.fontSize}
                  onChange={e => update({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Weight
                </label>
                <select
                  value={config.fontWeight}
                  onChange={e => update({ fontWeight: e.target.value })}
                  className="w-full bg-[#161B2E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="400">Regular (400)</option>
                  <option value="600">SemiBold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">ExtraBold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* Letter Spacing & Line Height */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Letter Spacing ({config.letterSpacing}px)
                </label>
                <input
                  type="range"
                  min="-2"
                  max="6"
                  step="0.5"
                  value={config.letterSpacing}
                  onChange={e => update({ letterSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Line Height ({config.lineHeight})
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="1.8"
                  step="0.05"
                  value={config.lineHeight}
                  onChange={e => update({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>
            </div>

            {/* Text Transform */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Casing
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#161B2E] p-1 rounded-lg border border-white/5">
                {(['none', 'uppercase', 'capitalize'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update({ textTransform: t })}
                    className={`py-1 text-xs rounded font-medium transition-colors ${
                      config.textTransform === t
                        ? 'bg-red-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'none' ? 'Normal' : t === 'uppercase' ? 'UPPER' : 'Title'}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Stroke / Outline */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Text Outline / Stroke
                </span>
                <input
                  type="checkbox"
                  checked={config.stroke.enabled}
                  onChange={e => updateStroke({ enabled: e.target.checked })}
                  className="accent-red-500"
                />
              </div>

              {config.stroke.enabled && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Thickness ({config.stroke.width}px)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={config.stroke.width}
                      onChange={e => updateStroke({ width: parseInt(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Stroke Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.stroke.color}
                        onChange={e => updateStroke({ color: e.target.value })}
                        className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-300">
                        {config.stroke.color}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Colors & Highlights */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            {/* Primary Text Color */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Base Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.textColor}
                  onChange={e => update({ textColor: e.target.value })}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={config.textColor}
                  onChange={e => update({ textColor: e.target.value })}
                  className="w-28 bg-[#161B2E] border border-white/10 rounded px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Word Highlight Color */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Active Word Highlight Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.highlightColor}
                  onChange={e => update({ highlightColor: e.target.value })}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={config.highlightColor}
                  onChange={e => update({ highlightColor: e.target.value })}
                  className="w-28 bg-[#161B2E] border border-white/10 rounded px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Inactive Word Color */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Inactive Word Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.inactiveWordColor?.startsWith('#') ? config.inactiveWordColor : '#A0AEC0'}
                  onChange={e => update({ inactiveWordColor: e.target.value })}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-slate-400">
                  Muted tone for words before/after active
                </span>
              </div>
            </div>

            {/* Word Highlight Mode */}
            <div className="pt-3 border-t border-white/[0.06]">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Highlight Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {highlightModes.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => update({ highlightMode: m.id })}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-colors ${
                      config.highlightMode === m.id
                        ? 'bg-red-500/20 border-red-500 text-white font-bold'
                        : 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Glow & Shadow */}
        {activeTab === 'glow' && (
          <div className="space-y-4">
            {/* Outer Glow */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  Outer Neon Glow
                </span>
                <input
                  type="checkbox"
                  checked={config.glow.enabled}
                  onChange={e => updateGlow({ enabled: e.target.checked })}
                  className="accent-red-500"
                />
              </div>

              {config.glow.enabled && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Glow Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.glow.color}
                        onChange={e => updateGlow({ color: e.target.value })}
                        className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-300">
                        {config.glow.color}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Glow Radius ({config.glow.blur}px)
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="32"
                      value={config.glow.blur}
                      onChange={e => updateGlow({ blur: parseInt(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Drop Shadow */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Drop Shadow
                </span>
                <input
                  type="checkbox"
                  checked={config.shadow.enabled}
                  onChange={e => updateShadow({ enabled: e.target.checked })}
                  className="accent-red-500"
                />
              </div>

              {config.shadow.enabled && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Offset X ({config.shadow.offsetX}px)
                      </label>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={config.shadow.offsetX}
                        onChange={e => updateShadow({ offsetX: parseInt(e.target.value) })}
                        className="w-full accent-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Offset Y ({config.shadow.offsetY}px)
                      </label>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={config.shadow.offsetY}
                        onChange={e => updateShadow({ offsetY: parseInt(e.target.value) })}
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Blur Radius ({config.shadow.blur}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={config.shadow.blur}
                      onChange={e => updateShadow({ blur: parseInt(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Background Box */}
        {activeTab === 'box' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Enable Caption Background
              </span>
              <input
                type="checkbox"
                checked={config.box.enabled}
                onChange={e => updateBox({ enabled: e.target.checked })}
                className="accent-red-500"
              />
            </div>

            {config.box.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Box Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.box.color}
                      onChange={e => updateBox({ color: e.target.value })}
                      className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {config.box.color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Opacity ({Math.round(config.box.opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.box.opacity}
                    onChange={e => updateBox({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Corner Radius ({config.box.borderRadius}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={config.box.borderRadius}
                    onChange={e => updateBox({ borderRadius: parseInt(e.target.value) })}
                    className="w-full accent-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Padding X ({config.box.paddingX}px)
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="40"
                      value={config.box.paddingX}
                      onChange={e => updateBox({ paddingX: parseInt(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Padding Y ({config.box.paddingY}px)
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={config.box.paddingY}
                      onChange={e => updateBox({ paddingY: parseInt(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Animation Engine */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                20 Animated Styles
              </label>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {animationOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ animation: opt.id })}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                      config.animation === opt.id
                        ? 'bg-red-500/20 border-red-500 text-white font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Intensity & Duration */}
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Animation Intensity ({config.animationIntensity}x)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.animationIntensity}
                  onChange={e => update({ animationIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Animation Duration ({config.animationDuration}ms)
                </label>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="25"
                  value={config.animationDuration}
                  onChange={e => update({ animationDuration: parseInt(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Position & Layout */}
        {activeTab === 'position' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Vertical Presets
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Top (20%)', y: 20 },
                  { label: 'Center (50%)', y: 50 },
                  { label: 'Bottom (78%)', y: 78 }
                ].map(preset => (
                  <button
                    key={preset.y}
                    type="button"
                    onClick={() => update({ positionY: preset.y })}
                    className={`py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                      config.positionY === preset.y
                        ? 'bg-red-500 text-white font-bold border-red-500'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Y Slider */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Vertical Y ({config.positionY}%)
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={config.positionY}
                onChange={e => update({ positionY: parseInt(e.target.value) })}
                className="w-full accent-red-500"
              />
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Text Alignment
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#161B2E] p-1 rounded-lg border border-white/5">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => update({ textAlign: align })}
                    className={`py-1 flex items-center justify-center rounded text-xs transition-colors ${
                      config.textAlign === align
                        ? 'bg-red-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max words per line */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Max Words Per Line ({config.maxWordsPerLine})
              </label>
              <input
                type="range"
                min="2"
                max="6"
                value={config.maxWordsPerLine}
                onChange={e => update({ maxWordsPerLine: parseInt(e.target.value) })}
                className="w-full accent-red-500"
              />
              <span className="text-[10px] text-slate-500">
                Instagram Reels recommend 2 to 4 words per line for high retention.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
