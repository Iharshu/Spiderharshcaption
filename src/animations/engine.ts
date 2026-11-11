import { AnimationStyle, CaptionStyleConfig, CaptionWord } from '../types';

export interface WordFrameState {
  scale: number;
  opacity: number;
  translateY: number;
  translateX: number;
  rotate: number; // degrees
  blur: number; // px
  color: string;
  glowBlur: number;
  glowColor: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  karaokeProgress: number; // 0 to 1
  rgbSplitOffset: number;
}

/**
 * Calculates the exact deterministic state of a word at timestamp `currentTime`
 */
export function computeWordState(
  word: CaptionWord,
  wordIndex: number,
  totalWords: number,
  segmentStart: number,
  segmentEnd: number,
  currentTime: number,
  config: CaptionStyleConfig
): WordFrameState {
  const isPast = currentTime > word.end;
  const isFuture = currentTime < word.start;
  const isCurrent = currentTime >= word.start && currentTime <= word.end;

  const wordDuration = Math.max(0.1, word.end - word.start);
  const elapsedInWord = Math.max(0, currentTime - word.start);
  const wordProgress = Math.min(1, Math.max(0, elapsedInWord / wordDuration));

  // Segment-level animation progress (used for sentence and stagger animations)
  const animDurationSec = Math.max(0.1, config.animationDuration / 1000);
  const elapsedInSegment = Math.max(0, currentTime - segmentStart);
  const segmentProgress = Math.min(1, elapsedInSegment / animDurationSec);

  const intensity = config.animationIntensity || 1.0;

  // Defaults
  let scale = 1.0;
  let opacity = 1.0;
  let translateY = 0;
  let translateX = 0;
  let rotate = 0;
  let blur = 0;
  let color = isCurrent ? config.highlightColor : isPast ? (config.inactiveWordColor || config.textColor) : config.textColor;
  let glowBlur = config.glow.enabled ? config.glow.blur : 0;
  let glowColor = config.glow.color;
  let karaokeProgress = isPast ? 1 : isCurrent ? wordProgress : 0;
  let rgbSplitOffset = 0;

  // Apply animation styles
  switch (config.animation) {
    case 'word-pop': {
      if (isCurrent) {
        // Pop up to 1.25x and smoothly settle
        const popCurve = Math.sin(Math.min(1, elapsedInWord / 0.15) * Math.PI * 0.5);
        scale = 1.0 + (0.28 * intensity) * (1 - popCurve * 0.4);
        translateY = -4 * intensity;
        glowBlur = 12 * intensity;
        glowColor = config.highlightColor;
      } else if (isPast) {
        scale = 1.0;
      } else {
        scale = 0.95;
        opacity = 0.7;
      }
      break;
    }

    case 'bounce': {
      if (isCurrent) {
        // Elastic bounce curve
        const t = Math.min(1, elapsedInWord / (0.25 * intensity));
        const bounce = Math.sin(t * Math.PI * 2.5) * Math.exp(-t * 3);
        scale = 1.0 + bounce * 0.3 * intensity;
        translateY = -bounce * 12 * intensity;
      }
      break;
    }

    case 'smooth-fade': {
      if (isFuture) {
        opacity = 0;
        translateY = 6;
      } else if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.15);
        opacity = t;
        translateY = (1 - t) * 6;
      }
      break;
    }

    case 'typewriter': {
      if (isFuture) {
        opacity = 0;
      } else if (isCurrent) {
        opacity = 1;
        scale = 1.03;
      }
      break;
    }

    case 'zoom-in': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.2);
        scale = (0.7 + 0.35 * t) * intensity;
        opacity = Math.min(1, t * 1.5);
      } else if (isFuture) {
        opacity = 0;
        scale = 0.6;
      }
      break;
    }

    case 'zoom-out': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.2);
        scale = (1.35 - 0.3 * t) * intensity;
        opacity = Math.min(1, t * 1.5);
      } else if (isFuture) {
        opacity = 0;
        scale = 1.4;
      }
      break;
    }

    case 'glow-pulse': {
      if (isCurrent) {
        const pulse = 0.5 + 0.5 * Math.sin(currentTime * 10 * intensity);
        glowBlur = (10 + pulse * 18) * intensity;
        glowColor = config.highlightColor;
        scale = 1.0 + pulse * 0.08 * intensity;
      }
      break;
    }

    case 'shake': {
      if (isCurrent) {
        const shakeVal = Math.sin(currentTime * 35) * Math.exp(-wordProgress * 2);
        translateX = shakeVal * 5 * intensity;
        translateY = Math.cos(currentTime * 28) * 3 * intensity;
        rotate = shakeVal * 2.5 * intensity;
      }
      break;
    }

    case 'slide-up': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.2);
        translateY = (1 - t) * 16 * intensity;
        opacity = t;
      } else if (isFuture) {
        opacity = 0;
        translateY = 16 * intensity;
      }
      break;
    }

    case 'slide-down': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.2);
        translateY = -(1 - t) * 16 * intensity;
        opacity = t;
      } else if (isFuture) {
        opacity = 0;
        translateY = -16 * intensity;
      }
      break;
    }

    case 'rgb-split': {
      if (isCurrent) {
        rgbSplitOffset = (3 + Math.sin(currentTime * 15) * 2) * intensity;
        scale = 1.05;
      }
      break;
    }

    case 'karaoke-highlight': {
      karaokeProgress = isPast ? 1 : isCurrent ? wordProgress : 0;
      if (isCurrent) {
        scale = 1.04;
        glowBlur = 8 * intensity;
        glowColor = config.highlightColor;
      }
      break;
    }

    case 'elastic': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.3);
        const p = 0.3;
        const s = p / 4;
        const val = Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
        scale = 1.0 + (val - 1) * 0.4 * intensity;
      }
      break;
    }

    case 'blur-reveal': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.25);
        blur = (1 - t) * 12 * intensity;
        opacity = Math.min(1, t * 1.3);
        scale = 1.15 - 0.15 * t;
      } else if (isFuture) {
        opacity = 0;
        blur = 12 * intensity;
      }
      break;
    }

    case 'flip': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.25);
        rotate = (1 - t) * 90 * intensity;
        scale = 0.8 + 0.2 * t;
        opacity = Math.min(1, t * 2);
      } else if (isFuture) {
        opacity = 0;
      }
      break;
    }

    case 'scale-in': {
      if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.18);
        scale = 0.4 + 0.6 * t;
        opacity = t;
      } else if (isFuture) {
        opacity = 0;
        scale = 0.4;
      }
      break;
    }

    case 'wave': {
      const wavePhase = (wordIndex / Math.max(1, totalWords)) * Math.PI * 2;
      const waveVal = Math.sin(currentTime * 6 + wavePhase);
      translateY = waveVal * 7 * intensity;
      if (isCurrent) {
        scale = 1.12;
      }
      break;
    }

    case 'stagger': {
      const delay = wordIndex * 0.08;
      const staggerElapsed = Math.max(0, elapsedInSegment - delay);
      const t = Math.min(1, staggerElapsed / 0.18);
      if (elapsedInSegment < delay) {
        opacity = 0;
        translateY = 12;
      } else {
        opacity = t;
        translateY = (1 - t) * 12;
        if (isCurrent) {
          scale = 1.08;
        }
      }
      break;
    }

    case 'letter-reveal': {
      if (isFuture) {
        opacity = 0;
        translateY = 8;
      } else if (isCurrent) {
        const t = Math.min(1, elapsedInWord / 0.15);
        opacity = t;
        translateY = (1 - t) * 8;
        scale = 1.06;
      }
      break;
    }

    case 'cinematic-fade':
    default: {
      const segRemaining = segmentEnd - currentTime;
      if (elapsedInSegment < 0.2) {
        opacity = elapsedInSegment / 0.2;
      } else if (segRemaining < 0.2) {
        opacity = Math.max(0, segRemaining / 0.2);
      } else {
        opacity = 1;
      }
      if (isCurrent) {
        scale = 1.05;
        glowBlur = 6 * intensity;
        glowColor = config.highlightColor;
      }
      break;
    }
  }

  // Highlight behavior modification
  if (isCurrent) {
    if (config.highlightMode === 'color') {
      scale = 1.0;
    } else if (config.highlightMode === 'scale') {
      color = config.textColor;
      scale = Math.max(scale, 1.18 * intensity);
    } else if (config.highlightMode === 'color-and-scale') {
      scale = Math.max(scale, 1.18 * intensity);
    }
  }

  return {
    scale,
    opacity: Math.max(0, Math.min(1, opacity)),
    translateY,
    translateX,
    rotate,
    blur,
    color,
    glowBlur,
    glowColor,
    isCurrent,
    isPast,
    isFuture,
    karaokeProgress,
    rgbSplitOffset
  };
}

/**
 * Returns CSS style object for HTML/DOM preview
 */
export function getWordInlineStyle(
  state: WordFrameState,
  config: CaptionStyleConfig
): React.CSSProperties {
  const transform = [
    `scale(${state.scale.toFixed(3)})`,
    `translate3d(${state.translateX.toFixed(1)}px, ${state.translateY.toFixed(1)}px, 0)`,
    state.rotate ? `rotate(${state.rotate.toFixed(1)}deg)` : ''
  ].filter(Boolean).join(' ');

  let filter = '';
  if (state.blur > 0) {
    filter += `blur(${state.blur.toFixed(1)}px) `;
  }
  if (state.glowBlur > 0) {
    filter += `drop-shadow(0 0 ${state.glowBlur.toFixed(1)}px ${state.glowColor}) `;
  }

  let textShadow = '';
  if (config.shadow.enabled) {
    textShadow += `${config.shadow.offsetX}px ${config.shadow.offsetY}px ${config.shadow.blur}px ${config.shadow.color}`;
  }
  if (state.rgbSplitOffset > 0) {
    textShadow += `, -${state.rgbSplitOffset}px 0 rgba(239, 68, 68, 0.85), ${state.rgbSplitOffset}px 0 rgba(59, 130, 246, 0.85)`;
  }

  let webkitTextStroke = '';
  if (config.stroke.enabled) {
    webkitTextStroke = `${config.stroke.width}px ${config.stroke.color}`;
  }

  return {
    display: 'inline-block',
    transform,
    opacity: state.opacity,
    filter: filter.trim() || undefined,
    color: state.color,
    textShadow: textShadow.trim() || undefined,
    WebkitTextStroke: webkitTextStroke || undefined,
    transition: 'transform 0.08s ease-out, opacity 0.08s ease-out, color 0.1s ease',
    willChange: 'transform, opacity'
  };
}
