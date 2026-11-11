export type SupportedLanguage = string;

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type TemplateCategory =
  | 'podcast'
  | 'neon'
  | 'cinematic'
  | 'karaoke'
  | '3d-motion'
  | 'reels'
  | 'gaming'
  | 'aesthetic';

export type AnimationStyle =
  | 'word-pop'
  | 'bounce'
  | 'smooth-fade'
  | 'typewriter'
  | 'zoom-in'
  | 'zoom-out'
  | 'glow-pulse'
  | 'shake'
  | 'slide-up'
  | 'slide-down'
  | 'rgb-split'
  | 'karaoke-highlight'
  | 'elastic'
  | 'blur-reveal'
  | 'flip'
  | 'scale-in'
  | 'wave'
  | 'stagger'
  | 'letter-reveal'
  | 'cinematic-fade';

export type WordHighlightMode =
  | 'color'
  | 'scale'
  | 'glow'
  | 'box'
  | 'underline'
  | 'karaoke-fill'
  | 'color-and-scale';

export interface CaptionWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface CaptionSegment {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
  words: CaptionWord[];
  positionY?: number; // optional custom override (-100 to 100)
}

export interface CaptionBoxStyle {
  enabled: boolean;
  color: string;
  opacity: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  borderWidth: number;
  borderColor: string;
}

export interface TextStrokeStyle {
  enabled: boolean;
  color: string;
  width: number;
}

export interface TextGlowStyle {
  enabled: boolean;
  color: string;
  blur: number;
  spread: number;
  intensity: number;
}

export interface TextShadowStyle {
  enabled: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}

export interface CaptionStyleConfig {
  fontFamily: string;
  fontWeight: number | string;
  fontSize: number; // base font size in pixels at 1080p width
  lineHeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textColor: string;
  gradientText?: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    angle: number;
  };
  highlightColor: string;
  highlightSecondaryColor?: string;
  inactiveWordColor?: string;
  highlightMode: WordHighlightMode;
  stroke: TextStrokeStyle;
  glow: TextGlowStyle;
  shadow: TextShadowStyle;
  box: CaptionBoxStyle;
  animation: AnimationStyle;
  animationDuration: number; // ms
  animationIntensity: number; // 0.5 to 2.0
  positionX: number; // 0 to 100%
  positionY: number; // 0 to 100% (e.g. 78% for bottom third)
  textAlign: 'center' | 'left' | 'right';
  maxWordsPerLine: number;
  maxLines: number;
}

export interface CaptionTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  popular?: boolean;
  tags: string[];
  config: CaptionStyleConfig;
}

export interface VideoMetadata {
  file?: File;
  name: string;
  url: string;
  duration: number;
  width: number;
  height: number;
  size: number;
  type: string;
}

export interface CaptionProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  language: SupportedLanguage;
  video: VideoMetadata | null;
  captions: CaptionSegment[];
  activeTemplateId: string;
  customStyle: CaptionStyleConfig;
  aspectRatio: AspectRatio;
  duration: number;
}

export type ExportFormat = 'full-video' | 'webm-transparent' | 'webm-green' | 'mp4-green' | 'srt' | 'vtt';

export interface ExportProgress {
  status: 'idle' | 'rendering' | 'encoding' | 'completed' | 'error';
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}
