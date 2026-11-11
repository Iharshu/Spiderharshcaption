export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  category: 'popular' | 'indian' | 'european' | 'asian' | 'americas' | 'middle-eastern';
  sampleText: string;
  script: string;
}

export const LANGUAGES_50_PLUS: LanguageItem[] = [
  // --- Popular / Universal ---
  { code: 'auto', name: 'Auto Detect (AI)', nativeName: 'Smart Multi-Language', flag: '⚡', category: 'popular', sampleText: 'Auto-detecting vocal audio language...', script: 'Multi' },
  { code: 'en', name: 'English', nativeName: 'English (US/UK/Global)', flag: '🇺🇸', category: 'popular', sampleText: 'Make every single word pop with animated subtitles', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', category: 'popular', sampleText: 'नमस्ते दोस्तों, आज हम सीखेंगे वायरल रील्स एडिटिंग', script: 'Devanagari' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', category: 'popular', sampleText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੋਸਤੋ, ਕਿਵੇਂ ਹੋ ਸਾਰੇ', script: 'Gurmukhi' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Roman Hindi', flag: '🇮🇳', category: 'popular', sampleText: 'Reels ko viral karne ka sabse bada secret', script: 'Latin' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', category: 'popular', sampleText: 'Aprende a crear subtítulos animados profesionales', script: 'Latin' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', category: 'popular', sampleText: 'Créez des sous-titres animés tendance pour vos vidéos', script: 'Latin' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', category: 'popular', sampleText: 'Erstellen Sie virale animierte Untertitel für Shorts', script: 'Latin' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', category: 'popular', sampleText: '視聴維持率を劇的に上げるアニメーション字幕', script: 'Japanese' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', category: 'popular', sampleText: '릴스와 쇼츠를 위한 트렌디한 자막 스튜디오', script: 'Hangul' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', category: 'popular', sampleText: '爆款短视频动画字幕制作神器', script: 'Han' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', category: 'popular', sampleText: 'اصنع تسميات توضيحية متحركة مذهلة للفيديوهات', script: 'Arabic' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português (Brasil)', flag: '🇧🇷', category: 'popular', sampleText: 'Legendas animadas automáticas que viralizam seus Reels', script: 'Latin' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', category: 'popular', sampleText: 'Создавайте трендовые анимированные субтитры', script: 'Cyrillic' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', category: 'popular', sampleText: 'Sottotitoli animati di qualità premium per i tuoi video', script: 'Latin' },

  // --- Indian & South Asian Languages ---
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', category: 'indian', sampleText: 'ভাইরাল রিলসের জন্য দুর্দান্ত অ্যানিমেটেড সাবটাইটেল', script: 'Bengali' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', category: 'indian', sampleText: 'तुमच्या व्हिडिओसाठी सर्वोत्तम अ‍ॅनिमेटेड कॅप्शन्स', script: 'Devanagari' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', category: 'indian', sampleText: 'వైరల్ రీల్స్ కోసం ఉత్తమ యానిమేటెడ్ క్యాప్షన్స్', script: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', category: 'indian', sampleText: 'வைரல் வீடியோக்களுக்கான அசத்தலான அனிமேஷன் சப்டைட்டில்ஸ்', script: 'Tamil' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', category: 'indian', sampleText: 'વાયરલ રીલ્સ માટે પ્રીમિયમ એનિમેટેડ કેપ્શન્સ', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', category: 'indian', sampleText: 'ವೈರಲ್ ರೀಲ್ಸ್ ಗಾಗಿ ಅದ್ಭುತ ಅನಿಮೇಟೆಡ್ ಉಪಶೀರ್ಷಿಕೆಗಳು', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', category: 'indian', sampleText: 'വൈറൽ റീലുകൾക്കായി മികച്ച ആനിമേഷൻ അടിക്കുറിപ്പുകൾ', script: 'Malayalam' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', category: 'indian', sampleText: 'وائرل ویڈیوز کے لیے بہترین اینیمیٹڈ کیپشنز', script: 'Arabic-Persian' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', category: 'indian', sampleText: 'रउआ सब खातिर वायरल रील्स के खास कैप्शन्स', script: 'Devanagari' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', flag: '🇮🇳', category: 'indian', sampleText: 'खम्मा घणी, रील्स खातिर शानदार एनिमेटेड कैप्शन्स', script: 'Devanagari' },
  { code: 'hr', name: 'Haryanvi', nativeName: 'हरियाणवी', flag: '🇮🇳', category: 'indian', sampleText: 'राम राम भाइयो, वायरल रील्स का सबसे तगड़ा कैप्शन टूल', script: 'Devanagari' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', category: 'indian', sampleText: 'भाइरल भिडियोहरूको लागि उत्कृष्ट एनिमेटेड क्याप्सनहरू', script: 'Devanagari' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', category: 'indian', sampleText: 'වෛරස් වීඩියෝ සඳහා විශිෂ්ට උපසිරැසි', script: 'Sinhala' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', category: 'indian', sampleText: 'भवतः चलच्चित्रार्थं अनुपमाः अनुशीर्षकाः', script: 'Devanagari' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', category: 'indian', sampleText: 'وائرل ريلز لاءِ بهترين اينيميٽڊ ڪئپشنز', script: 'Arabic' },

  // --- European Languages ---
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', category: 'european', sampleText: 'Reels ve Shorts için trend animasyonlu altyazılar', script: 'Latin' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', category: 'european', sampleText: 'Maak virale geanimeerde ondertitels voor video\'s', script: 'Latin' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', category: 'european', sampleText: 'Twórz wiralowe animowane napisy do rolek', script: 'Latin' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', category: 'european', sampleText: 'Skapa virala animerade undertexter för videor', script: 'Latin' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', category: 'european', sampleText: 'Δημιουργήστε εντυπωσιακούς υπότιτλους βίντεο', script: 'Greek' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', category: 'european', sampleText: 'Vytvářejte virální animované titulky pro videa', script: 'Latin' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', category: 'european', sampleText: 'Creează subtitrări animate uimitoare pentru Reels', script: 'Latin' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', category: 'european', sampleText: 'Створюйте вірусні анімовані субтитри для відео', script: 'Cyrillic' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', category: 'european', sampleText: 'Készíts vírusos animált feliratokat videóidhoz', script: 'Latin' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', category: 'european', sampleText: 'Luo viraaleja animoituja tekstityksiä videoihin', script: 'Latin' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', category: 'european', sampleText: 'Lav fængende animerede undertekster til videoer', script: 'Latin' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', category: 'european', sampleText: 'Lag virale animerte undertekster til reels', script: 'Latin' },

  // --- East & Southeast Asian Languages ---
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', category: 'asian', sampleText: 'Buat subtitle animasi viral untuk Reels dan TikTok', script: 'Latin' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', category: 'asian', sampleText: 'Tạo phụ đề động bắt mắt cho video ngắn', script: 'Latin' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', category: 'asian', sampleText: 'สร้างคำบรรยายภาพเคลื่อนไหวสุดไวรัลสำหรับวิดีโอ', script: 'Thai' },
  { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Tagalog', flag: '🇵🇭', category: 'asian', sampleText: 'Gumawa ng viral na animated captions para sa videos', script: 'Latin' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', category: 'asian', sampleText: 'Hasilkan sari kata animasi tular untuk video pendek', script: 'Latin' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲', category: 'asian', sampleText: 'ဗီဒီယိုများအတွက် အမိုက်စား စာတန်းထိုးများ', script: 'Myanmar' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', category: 'asian', sampleText: 'បង្កើតចំណងជើងរងចលនាសម្រាប់វីដេអូ', script: 'Khmer' },

  // --- Middle Eastern & African Languages ---
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', category: 'middle-eastern', sampleText: 'زیرنویس‌های متحرک جذاب برای ویدیوهای وایرال', script: 'Arabic-Persian' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', category: 'middle-eastern', sampleText: 'צור כתוביות מונפשות ויראליות לסרטונים', script: 'Hebrew' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', category: 'middle-eastern', sampleText: 'Tengeneza manukuu yenye uhuishaji kwa video zako', script: 'Latin' }
];

export function getLanguageByCode(code: string): LanguageItem {
  return LANGUAGES_50_PLUS.find(l => l.code === code) || LANGUAGES_50_PLUS[0];
}
