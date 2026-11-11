export interface FontItem {
  name: string;
  category: 'sans' | 'display' | 'devanagari' | 'gurmukhi' | 'handwritten' | 'impact';
  scripts: ('latin' | 'hindi' | 'punjabi')[];
  weights: number[];
  popular?: boolean;
}

export const FONT_LIBRARY: FontItem[] = [
  // --- Devanagari & Hindi Masters ---
  { name: 'Hind', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [500, 600, 700], popular: true },
  { name: 'Poppins', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700, 800, 900], popular: true },
  { name: 'Mukta', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700, 800], popular: true },
  { name: 'Rozha One', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [400], popular: true },
  { name: 'Kalam', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700], popular: true },
  { name: 'Rajdhani', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700], popular: true },
  { name: 'Tiro Devanagari Hindi', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [400], popular: true },
  { name: 'Gotu', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [400] },
  { name: 'Sarala', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700] },
  { name: 'Khand', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700] },
  { name: 'Teko', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700] },
  { name: 'Yatra One', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [400] },
  { name: 'Halant', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700] },
  { name: 'Eczar', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700, 800] },
  { name: 'Ranga', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700] },
  { name: 'Federo', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [400] },
  { name: 'Amita', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700] },
  { name: 'Martel', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700, 800] },
  { name: 'Biryani', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700, 800] },
  { name: 'Karma', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [600, 700] },
  { name: 'Jaldi', category: 'devanagari', scripts: ['hindi', 'latin'], weights: [700] },

  // --- Gurmukhi & Punjabi Masters ---
  { name: 'Noto Sans Gurmukhi', category: 'gurmukhi', scripts: ['punjabi', 'latin'], weights: [600, 700, 800, 900], popular: true },
  { name: 'Tiro Gurmukhi', category: 'gurmukhi', scripts: ['punjabi', 'latin'], weights: [400], popular: true },
  { name: 'Mukta Mahee', category: 'gurmukhi', scripts: ['punjabi', 'latin'], weights: [600, 700, 800], popular: true },
  { name: 'Baloo Paaji 2', category: 'gurmukhi', scripts: ['punjabi', 'latin'], weights: [600, 700, 800], popular: true },
  { name: 'Gurmukhi MN', category: 'gurmukhi', scripts: ['punjabi', 'latin'], weights: [700] },

  // --- Impact & Viral Reels ---
  { name: 'Bebas Neue', category: 'impact', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Anton', category: 'impact', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Russo One', category: 'impact', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Bangers', category: 'impact', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Luckiest Guy', category: 'impact', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Permanent Marker', category: 'handwritten', scripts: ['latin'], weights: [400], popular: true },
  { name: 'Oswald', category: 'impact', scripts: ['latin'], weights: [600, 700], popular: true },
  { name: 'Black Ops One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Fugaz One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Chango', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Bowlby One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Titan One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Righteous', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Carter One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Alfa Slab One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Squada One', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Audiowide', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Orbitron', category: 'impact', scripts: ['latin'], weights: [700, 800, 900] },
  { name: 'Passion One', category: 'impact', scripts: ['latin'], weights: [700, 900] },
  { name: 'Paytone One', category: 'impact', scripts: ['latin'], weights: [400] },

  // --- Modern Display & High Retention Sans ---
  { name: 'Montserrat', category: 'sans', scripts: ['latin'], weights: [700, 800, 900], popular: true },
  { name: 'Plus Jakarta Sans', category: 'sans', scripts: ['latin'], weights: [600, 700, 800], popular: true },
  { name: 'Outfit', category: 'sans', scripts: ['latin'], weights: [600, 700, 800, 900], popular: true },
  { name: 'Bricolage Grotesque', category: 'display', scripts: ['latin'], weights: [700, 800, 900], popular: true },
  { name: 'Manrope', category: 'sans', scripts: ['latin'], weights: [600, 700, 800], popular: true },
  { name: 'Urbanist', category: 'sans', scripts: ['latin'], weights: [700, 800, 900], popular: true },
  { name: 'Syne', category: 'display', scripts: ['latin'], weights: [700, 800] },
  { name: 'Clash Display', category: 'display', scripts: ['latin'], weights: [600, 700] },
  { name: 'Cabinet Grotesk', category: 'display', scripts: ['latin'], weights: [700, 800] },
  { name: 'Satoshi', category: 'sans', scripts: ['latin'], weights: [700, 900] },
  { name: 'General Sans', category: 'sans', scripts: ['latin'], weights: [600, 700] },
  { name: 'Space Grotesk', category: 'sans', scripts: ['latin'], weights: [600, 700] },
  { name: 'Archivo Black', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Barlow Condensed', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Antonio', category: 'sans', scripts: ['latin'], weights: [700] },
  { name: 'Big Shoulders Display', category: 'display', scripts: ['latin'], weights: [700, 800, 900] },
  { name: 'DM Sans', category: 'sans', scripts: ['latin'], weights: [700] },
  { name: 'Public Sans', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Work Sans', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Prompt', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Kanit', category: 'sans', scripts: ['latin'], weights: [700, 800, 900] },
  { name: 'Chakra Petch', category: 'display', scripts: ['latin'], weights: [700] },
  { name: 'Saira Extra Condensed', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Exo 2', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Staatliches', category: 'impact', scripts: ['latin'], weights: [400] },
  { name: 'Darker Grotesque', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Unbounded', category: 'display', scripts: ['latin'], weights: [700, 800, 900] },
  { name: 'Schibsted Grotesk', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Clash Grotesk', category: 'sans', scripts: ['latin'], weights: [600, 700] },
  { name: 'Sora', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Figtree', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Albert Sans', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Red Hat Display', category: 'display', scripts: ['latin'], weights: [700, 900] },
  { name: 'Lexend', category: 'sans', scripts: ['latin'], weights: [700, 800] },
  { name: 'Rubik', category: 'sans', scripts: ['latin'], weights: [700, 800, 900] },
  { name: 'Nunito', category: 'sans', scripts: ['latin'], weights: [800, 900] },
  { name: 'Fredoka', category: 'sans', scripts: ['latin'], weights: [600, 700] },
  { name: 'Comfortaa', category: 'sans', scripts: ['latin'], weights: [700] },
  { name: 'Caveat', category: 'handwritten', scripts: ['latin'], weights: [700] },
  { name: 'Satisfy', category: 'handwritten', scripts: ['latin'], weights: [400] },
  { name: 'Shadows Into Light', category: 'handwritten', scripts: ['latin'], weights: [400] },
  { name: 'Pacifico', category: 'handwritten', scripts: ['latin'], weights: [400] },
  { name: 'Shrikhand', category: 'display', scripts: ['latin'], weights: [400] },
  { name: 'Secular One', category: 'sans', scripts: ['latin'], weights: [400] },
  { name: 'Cinzel', category: 'display', scripts: ['latin'], weights: [700, 900] },
  { name: 'Cinzel Decorative', category: 'display', scripts: ['latin'], weights: [700] },
  { name: 'Playfair Display', category: 'display', scripts: ['latin'], weights: [700, 900] },
  { name: 'Cormorant Garamond', category: 'display', scripts: ['latin'], weights: [700] },
  { name: 'Fraunces', category: 'display', scripts: ['latin'], weights: [700, 900] },
  { name: 'Abril Fatface', category: 'display', scripts: ['latin'], weights: [400] },
  { name: 'Bodoni Moda', category: 'display', scripts: ['latin'], weights: [700, 900] },
  { name: 'Yeseva One', category: 'display', scripts: ['latin'], weights: [400] },
  { name: 'Prata', category: 'display', scripts: ['latin'], weights: [400] },
  { name: 'DM Serif Display', category: 'display', scripts: ['latin'], weights: [400] },
  { name: 'Castoro Titling', category: 'display', scripts: ['latin'], weights: [400] }
];

export function getFontsForLanguage(lang: string): FontItem[] {
  let fonts = FONT_LIBRARY;
  if (lang === 'hi') {
    fonts = FONT_LIBRARY.filter(f => f.scripts.includes('hindi') || f.popular);
  } else if (lang === 'pa') {
    fonts = FONT_LIBRARY.filter(f => f.scripts.includes('punjabi') || f.popular);
  }
  // Deduplicate by font name to ensure strictly unique keys
  const uniqueMap = new Map<string, FontItem>();
  for (const f of fonts) {
    if (!uniqueMap.has(f.name)) {
      uniqueMap.set(f.name, f);
    }
  }
  return Array.from(uniqueMap.values());
}
