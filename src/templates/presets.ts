import { CaptionTemplate, CaptionStyleConfig, TemplateCategory, AnimationStyle, WordHighlightMode } from '../types';

// Palette definitions for distinct visual styles (Stark Crimson, Arc Cyan, Titanium Gold & Viral Hues)
const ACCENT_COLORS = [
  '#00F0FF', '#EF4444', '#FFD700', '#F59E0B', '#10B981', 
  '#38BDF8', '#8B5CF6', '#EC4899', '#06B6D4', '#F43F5E',
  '#6366F1', '#A855F7', '#22C55E', '#FB923C', '#EAB308',
  '#F472B6', '#4ADE80', '#FCD34D', '#818CF8', '#2DD4BF'
];

const FONTS_BY_VIBE = {
  podcast: ['Plus Jakarta Sans', 'Outfit', 'Montserrat', 'Manrope', 'Urbanist'],
  neon: ['Bebas Neue', 'Russo One', 'Outfit', 'Bricolage Grotesque', 'Montserrat'],
  cinematic: ['Montserrat', 'Plus Jakarta Sans', 'Outfit', 'Manrope', 'Rozha One'],
  karaoke: ['Poppins', 'Outfit', 'Plus Jakarta Sans', 'Bricolage Grotesque', 'Bebas Neue'],
  '3d-motion': ['Bebas Neue', 'Anton', 'Montserrat', 'Bricolage Grotesque', 'Russo One'],
  reels: ['Montserrat', 'Bebas Neue', 'Poppins', 'Urbanist', 'Bricolage Grotesque'],
  gaming: ['Russo One', 'Bangers', 'Bebas Neue', 'Luckiest Guy', 'Anton'],
  aesthetic: ['Plus Jakarta Sans', 'Outfit', 'Poppins', 'Manrope', 'Urbanist']
};

const ANIMATIONS_BY_CATEGORY: Record<TemplateCategory, AnimationStyle[]> = {
  podcast: ['word-pop', 'smooth-fade', 'typewriter', 'slide-up', 'stagger'],
  neon: ['glow-pulse', 'rgb-split', 'word-pop', 'scale-in', 'bounce'],
  cinematic: ['cinematic-fade', 'blur-reveal', 'smooth-fade', 'letter-reveal', 'slide-up'],
  karaoke: ['karaoke-highlight', 'word-pop', 'wave', 'smooth-fade', 'bounce'],
  '3d-motion': ['flip', 'elastic', 'zoom-in', 'bounce', 'rgb-split'],
  reels: ['word-pop', 'bounce', 'elastic', 'scale-in', 'typewriter', 'shake'],
  gaming: ['shake', 'rgb-split', 'zoom-in', 'bounce', 'word-pop'],
  aesthetic: ['blur-reveal', 'smooth-fade', 'letter-reveal', 'cinematic-fade', 'slide-up']
};

const HIGHLIGHT_MODES: WordHighlightMode[] = [
  'color-and-scale', 'color', 'scale', 'glow', 'box', 'underline', 'karaoke-fill'
];

// Curated naming stems for realistic, professional template naming
const NAME_STEMS: Record<TemplateCategory, string[]> = {
  podcast: [
    'Joe Rogan Bold', 'Silicon Insider', 'Huberman Neuro', 'Lex Fridman Deep', 'Diary of CEO', 
    'Studio Minimal', 'Deep Dive Monologue', 'Sharp Broadcast', 'Mic Drop Clean', 'Voice Impact',
    'Chamber Slate', 'Auditorium Pro', 'Soundstage Alpha', 'Airwave Crisp', 'Broadcaster Prime',
    'Talk Track Master', 'Host Highlight', 'Episode Spotlight', 'Dialogue Flow', 'Podcast Punch'
  ],
  neon: [
    'Cyberpunk Redux', 'Spider Venom', 'Tokyo Nights', 'Hyper Laser', 'Synthwave Horizon', 
    'Electric Violet', 'Crimson Pulse', 'Acid Matrix', 'Plasma Surge', 'Overdrive Aura',
    'Neon Cobalt', 'Strobe Glow', 'Laser Beam Pro', 'Radiant Blaze', 'Vapor Grid',
    'Arcade Lumens', 'Phosphor Green', 'Midnight Volt', 'Prism Flare', 'Solar Flare 2.0'
  ],
  cinematic: [
    'Oppenheimer Dramatic', 'Dune Sands', 'Film Grain Classic', 'Letterbox Gold', 'Anamorphic Blue', 
    'Director Cut', 'Noir Silver', 'IMAX Grandeur', 'Documentary True', 'A24 Minimalist',
    'Golden Hour', 'Blockbuster Punch', 'Moody Monochrome', 'Vintage Lens', 'Chroma Prestige',
    'Sundance Indie', 'Panavision Clean', 'Silver Screen', 'Cinema Scope', 'Oscar Narrative'
  ],
  karaoke: [
    'Spotify Singalong', 'Billiards Bounce', 'Rhythm Tracker', 'Pop Beat Pulse', 'Chorus Wave', 
    'Lyrics Studio', 'Vocal Runner', 'Melody Glow', 'Syllable Snap', 'Harmony Trace',
    'Tempo Runner', 'Chart Topper', 'Studio Vocalist', 'Playback Shine', 'Lyricist Gold',
    'Acoustic Warmth', 'Bar Lounge Lyrics', 'Karaoke Legend', 'Beat Drops', 'Word Sweeper'
  ],
  '3d-motion': [
    'Spatial Kinetic', 'Matrix Parallax', 'Spider Web Jump', 'Gravity Flip', 'Dimension Shift', 
    'Elastic Pop', 'Isometric Drift', 'Tesseract Bounce', 'Zero Gravity', 'Angular Velocity',
    'Gyroscope Spin', 'Vortex Scale', 'Warp Speed', 'Depth Layered', 'Pop-Out 3D',
    'Spatial Hologram', 'Card Flip Motion', 'Rebound Flex', 'Impulse Kinetic', 'Perspective Tilt'
  ],
  reels: [
    'MrBeast Viral', 'Alex Hormozi Yellow', 'Iman Gadzhi High-Ticket', 'Ali Abdaal Clarity', 'TikTok Velocity', 
    'Retention King', 'Hook Magnet', 'Flash Reel', 'Shorts Turbo', 'Attention Grabber',
    'Fast Paced Bold', 'Viral Box Highlight', 'Swipe Stopper', 'CapCut Viral 1', 'CapCut Trending 2',
    'Social Dynamo', 'Hustler Grit', 'Creator Secret', 'Reel Domination', 'Engagement Engine'
  ],
  gaming: [
    'Twitch Speedrun', 'Call of Duty Clutch', 'Valorant Ace', 'Cyber Apex', 'Rage Quit Red', 
    'Headshot Glow', 'Pixel Level Up', 'Arcade Overkill', 'RGB Battlestation', 'Victory Royale',
    'Stealth Ops', 'Respawn Pulse', 'Boss Fight Bold', 'GG No Re', 'Level Complete',
    'Streamer Cam Pro', 'Console Royale', 'Turbo Glitch', 'Killstreak Fire', 'Esports Champion'
  ],
  aesthetic: [
    'Minimal Beige', 'Vogue Editorial', 'Nordic Clean', 'Whisper Serene', 'Pastel Harmony', 
    'Cottagecore Soft', 'Silk Luxe', 'Paper Texture', 'Calm Horizon', 'Ethereal Mist',
    'Zen Studio', 'Botanical Green', 'Velvet Muted', 'Boutique Coffee', 'Subtle Muse',
    'Architectural White', 'Studio Lo-Fi', 'Warm Linen', 'Organic Aura', 'Serenity Soft'
  ]
};

// Generate an individual template with mathematically diverse parameters
function buildPreset(
  category: TemplateCategory,
  index: number,
  categoryCount: number
): CaptionTemplate {
  const stems = NAME_STEMS[category];
  const stem = stems[index % stems.length];
  const subVariant = Math.floor(index / stems.length) + 1;
  const name = subVariant > 1 ? `${stem} Mark ${subVariant}` : stem;
  const id = `${category}-${String(index + 1).padStart(3, '0')}`;

  const fonts = FONTS_BY_VIBE[category];
  const fontFamily = fonts[index % fonts.length];
  const animations = ANIMATIONS_BY_CATEGORY[category];
  const animation = animations[index % animations.length];

  const primaryAccent = ACCENT_COLORS[(index * 3) % ACCENT_COLORS.length];
  const secondaryAccent = ACCENT_COLORS[(index * 3 + 7) % ACCENT_COLORS.length];

  // Variations in typography size and weight
  const fontWeights = [700, 800, 900];
  const fontWeight = fontWeights[index % fontWeights.length];
  const fontSize = 42 + (index % 5) * 4; // 42 to 58 px

  // Category specific archetype tuning
  const isNeon = category === 'neon';
  const isGaming = category === 'gaming';
  const isKaraoke = category === 'karaoke';
  const isPodcast = category === 'podcast';
  const isReels = category === 'reels';
  const isAesthetic = category === 'aesthetic';
  const isCinematic = category === 'cinematic';
  const is3D = category === '3d-motion';

  // Box configurations
  const boxEnabled = (isReels && index % 2 === 0) || (isPodcast && index % 3 === 0) || (isGaming && index % 2 === 1);
  const boxStyle = {
    enabled: boxEnabled,
    color: index % 4 === 0 ? '#000000' : index % 4 === 1 ? '#090B12' : '#161B2E',
    opacity: isPodcast ? 0.75 : 0.88,
    borderRadius: (index % 3) * 6 + 6,
    paddingX: 18 + (index % 4) * 4,
    paddingY: 10 + (index % 3) * 2,
    borderWidth: (index % 3 === 0) ? 1.5 : 0,
    borderColor: primaryAccent
  };

  // Text color & gradients
  let textColor = '#FFFFFF';
  let gradientText: CaptionStyleConfig['gradientText'] = undefined;
  if ((isNeon || isReels || isGaming) && index % 3 === 0) {
    gradientText = {
      enabled: true,
      startColor: '#FFFFFF',
      endColor: primaryAccent,
      angle: 90 + (index % 4) * 45
    };
  } else if (isAesthetic) {
    textColor = index % 2 === 0 ? '#F8FAFC' : '#E2E8F0';
  }

  // Stroke configurations
  const strokeWidth = (isGaming || isReels) ? 3 + (index % 3) : isNeon ? 2 : (index % 2 === 0 ? 2 : 0);
  const stroke = {
    enabled: strokeWidth > 0,
    color: isGaming ? '#000000' : isNeon ? primaryAccent : '#000000',
    width: strokeWidth
  };

  // Glow configurations
  const glow = {
    enabled: isNeon || (isGaming && index % 2 === 0) || (is3D && index % 3 === 0),
    color: primaryAccent,
    blur: isNeon ? 16 + (index % 4) * 4 : 10,
    spread: 2,
    intensity: isNeon ? 1.6 : 1.0
  };

  // Shadow configurations
  const shadow = {
    enabled: !isAesthetic || index % 2 === 0,
    color: 'rgba(0, 0, 0, 0.85)',
    offsetX: 2 + (index % 3),
    offsetY: 3 + (index % 3),
    blur: 6 + (index % 4) * 2
  };

  // Word highlight mode
  const highlightMode: WordHighlightMode = isKaraoke 
    ? (index % 2 === 0 ? 'karaoke-fill' : 'color-and-scale')
    : HIGHLIGHT_MODES[(index + (isReels ? 0 : 2)) % HIGHLIGHT_MODES.length];

  // Positions: 78% default bottom for reels, 82% or 50% for cinematic/quotes
  const positionY = isCinematic && index % 4 === 0 ? 50 : 78 + (index % 3) * 2;

  const config: CaptionStyleConfig = {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight: 1.25,
    letterSpacing: isAesthetic ? 1.5 : (index % 3 === 0 ? -0.5 : 0.5),
    textTransform: (isGaming || isReels || isNeon) ? 'uppercase' : (index % 2 === 0 ? 'none' : 'capitalize'),
    textColor,
    gradientText,
    highlightColor: primaryAccent,
    highlightSecondaryColor: secondaryAccent,
    inactiveWordColor: isKaraoke ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.75)',
    highlightMode,
    stroke,
    glow,
    shadow,
    box: boxStyle,
    animation,
    animationDuration: 280 + (index % 5) * 40,
    animationIntensity: is3D || isGaming ? 1.3 : isAesthetic ? 0.8 : 1.0,
    positionX: 50,
    positionY,
    textAlign: 'center',
    maxWordsPerLine: 4,
    maxLines: 2
  };

  return {
    id,
    name,
    category,
    description: `Engineered for ${category} content. Features ${animation} animation with ${fontFamily} typography.`,
    popular: index < 10,
    tags: [category, animation, fontFamily.toLowerCase().replace(/\s+/g, '-')],
    config
  };
}

// Generate the 500 required presets across 8 categories
function generate500Presets(): CaptionTemplate[] {
  const quotas: { category: TemplateCategory; count: number }[] = [
    { category: 'podcast', count: 80 },
    { category: 'neon', count: 70 },
    { category: 'cinematic', count: 60 },
    { category: 'karaoke', count: 60 },
    { category: '3d-motion', count: 60 },
    { category: 'reels', count: 70 },
    { category: 'gaming', count: 50 },
    { category: 'aesthetic', count: 50 }
  ];

  const presets: CaptionTemplate[] = [];

  for (const { category, count } of quotas) {
    for (let i = 0; i < count; i++) {
      presets.push(buildPreset(category, i, count));
    }
  }

  return presets;
}

export const TEMPLATE_PRESETS: CaptionTemplate[] = generate500Presets();

export const CATEGORY_INFO: Record<TemplateCategory, { label: string; count: number; description: string }> = {
  'podcast': { label: 'Podcast Pro', count: 80, description: 'Clean, highly readable typography favored by top podcasters & interviewers' },
  'neon': { label: 'Neon Glow', count: 70, description: 'High-voltage electric pulses, laser outlines, and radiant night aesthetics' },
  'cinematic': { label: 'Cinematic', count: 60, description: 'Sophisticated letterforms with filmic letterboxing and subtle dissolves' },
  'karaoke': { label: 'Karaoke', count: 60, description: 'Rhythmic syllable-by-syllable wipes, lyric trackers, and musical bounces' },
  '3d-motion': { label: '3D Motion', count: 60, description: 'Parallax depth, kinetic elastic pops, and multi-plane perspective shifts' },
  'reels': { label: 'Trending Reels', count: 70, description: 'High-retention Hormozi & MrBeast style bold word pop highlights' },
  'gaming': { label: 'Gaming', count: 50, description: 'Action-heavy shake impacts, RGB chromatic splits, and arcade fonts' },
  'aesthetic': { label: 'Aesthetic', count: 50, description: 'Minimalist editorial styles, gentle blur reveals, and calming color palettes' }
};

export function getTemplateById(id: string): CaptionTemplate {
  return TEMPLATE_PRESETS.find(t => t.id === id) || TEMPLATE_PRESETS[0];
}
