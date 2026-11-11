import { CaptionProject, CaptionSegment, SupportedLanguage } from '../types';
import { getTemplateById } from '../templates/presets';

export const SAMPLE_CAPTIONS_HI: CaptionSegment[] = [
  {
    id: 'hi-1',
    start: 0.2,
    end: 2.4,
    text: 'नमस्ते दोस्तों स्वागत है',
    words: [
      { word: 'नमस्ते', start: 0.2, end: 0.7 },
      { word: 'दोस्तों', start: 0.75, end: 1.3 },
      { word: 'स्वागत', start: 1.35, end: 1.85 },
      { word: 'है', start: 1.9, end: 2.35 }
    ]
  },
  {
    id: 'hi-2',
    start: 2.5,
    end: 4.8,
    text: 'आज हम सीखेंगे वायरल रील्स',
    words: [
      { word: 'आज', start: 2.5, end: 2.9 },
      { word: 'हम', start: 2.95, end: 3.3 },
      { word: 'सीखेंगे', start: 3.35, end: 3.9 },
      { word: 'वायरल', start: 3.95, end: 4.35 },
      { word: 'रील्स', start: 4.4, end: 4.75 }
    ]
  },
  {
    id: 'hi-3',
    start: 4.9,
    end: 7.2,
    text: 'के लिए प्रीमियम एनिमेटेड कैप्शन्स',
    words: [
      { word: 'के', start: 4.9, end: 5.15 },
      { word: 'लिए', start: 5.2, end: 5.55 },
      { word: 'प्रीमियम', start: 5.6, end: 6.2 },
      { word: 'एनिमेटेड', start: 6.25, end: 6.7 },
      { word: 'कैप्शन्स', start: 6.75, end: 7.15 }
    ]
  },
  {
    id: 'hi-4',
    start: 7.3,
    end: 9.8,
    text: 'जो आपकी रीच को दस गुना बढ़ा देंगे',
    words: [
      { word: 'जो', start: 7.3, end: 7.55 },
      { word: 'आपकी', start: 7.6, end: 8.0 },
      { word: 'रीच', start: 8.05, end: 8.4 },
      { word: 'को', start: 8.45, end: 8.7 },
      { word: 'दस', start: 8.75, end: 9.05 },
      { word: 'गुना', start: 9.1, end: 9.4 },
      { word: 'बढ़ा', start: 9.45, end: 9.7 },
      { word: 'देंगे', start: 9.72, end: 9.78 }
    ]
  }
];

export const SAMPLE_CAPTIONS_PA: CaptionSegment[] = [
  {
    id: 'pa-1',
    start: 0.2,
    end: 2.3,
    text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੋਸਤੋ',
    words: [
      { word: 'ਸਤਿ', start: 0.2, end: 0.65 },
      { word: 'ਸ੍ਰੀ', start: 0.7, end: 1.15 },
      { word: 'ਅਕਾਲ', start: 1.2, end: 1.65 },
      { word: 'ਦੋਸਤੋ', start: 1.7, end: 2.25 }
    ]
  },
  {
    id: 'pa-2',
    start: 2.4,
    end: 4.6,
    text: 'ਕਿਵੇਂ ਹੋ ਸਾਰੇ',
    words: [
      { word: 'ਕਿਵੇਂ', start: 2.4, end: 2.9 },
      { word: 'ਹੋ', start: 2.95, end: 3.4 },
      { word: 'ਸਾਰੇ', start: 3.45, end: 4.55 }
    ]
  },
  {
    id: 'pa-3',
    start: 4.7,
    end: 7.1,
    text: 'ਅੱਜ ਅਸੀਂ ਸਿੱਖਾਂਗੇ ਕੈਪਕਟ ਵਾਸਤੇ',
    words: [
      { word: 'ਅੱਜ', start: 4.7, end: 5.1 },
      { word: 'ਅਸੀਂ', start: 5.15, end: 5.6 },
      { word: 'ਸਿੱਖਾਂਗੇ', start: 5.65, end: 6.3 },
      { word: 'ਕੈਪਕਟ', start: 6.35, end: 6.75 },
      { word: 'ਵਾਸਤੇ', start: 6.8, end: 7.05 }
    ]
  },
  {
    id: 'pa-4',
    start: 7.2,
    end: 9.8,
    text: 'ਸਭ ਤੋਂ ਬਿਹਤਰੀਨ ਐਨੀਮੇਟਡ ਸਬਟਾਈਟਲ',
    words: [
      { word: 'ਸਭ', start: 7.2, end: 7.5 },
      { word: 'ਤੋਂ', start: 7.55, end: 7.85 },
      { word: 'ਬਿਹਤਰੀਨ', start: 7.9, end: 8.5 },
      { word: 'ਐਨੀਮੇਟਡ', start: 8.55, end: 9.1 },
      { word: 'ਸਬਟਾਈਟਲ', start: 9.15, end: 9.75 }
    ]
  }
];

export const SAMPLE_CAPTIONS_EN: CaptionSegment[] = [
  {
    id: 'en-1',
    start: 0.2,
    end: 2.2,
    text: 'Here is the secret',
    words: [
      { word: 'Here', start: 0.2, end: 0.6 },
      { word: 'is', start: 0.65, end: 0.95 },
      { word: 'the', start: 1.0, end: 1.3 },
      { word: 'secret', start: 1.35, end: 2.15 }
    ]
  },
  {
    id: 'en-2',
    start: 2.3,
    end: 4.5,
    text: 'to viral short videos',
    words: [
      { word: 'to', start: 2.3, end: 2.6 },
      { word: 'viral', start: 2.65, end: 3.1 },
      { word: 'short', start: 3.15, end: 3.65 },
      { word: 'videos', start: 3.7, end: 4.45 }
    ]
  },
  {
    id: 'en-3',
    start: 4.6,
    end: 7.0,
    text: 'Nobody watches boring subtitles anymore',
    words: [
      { word: 'Nobody', start: 4.6, end: 5.1 },
      { word: 'watches', start: 5.15, end: 5.65 },
      { word: 'boring', start: 5.7, end: 6.2 },
      { word: 'subtitles', start: 6.25, end: 6.6 },
      { word: 'anymore', start: 6.65, end: 6.95 }
    ]
  },
  {
    id: 'en-4',
    start: 7.1,
    end: 9.9,
    text: 'SpiderHarshCaption makes every word pop',
    words: [
      { word: 'SpiderHarshCaption', start: 7.1, end: 8.0 },
      { word: 'makes', start: 8.05, end: 8.4 },
      { word: 'every', start: 8.45, end: 8.8 },
      { word: 'word', start: 8.85, end: 9.25 },
      { word: 'pop', start: 9.3, end: 9.85 }
    ]
  }
];

export const SAMPLE_CAPTIONS_HINGLISH: CaptionSegment[] = [
  {
    id: 'hgl-1',
    start: 0.2,
    end: 2.3,
    text: 'Agar aap bhi reels banate ho',
    words: [
      { word: 'Agar', start: 0.2, end: 0.6 },
      { word: 'aap', start: 0.65, end: 1.0 },
      { word: 'bhi', start: 1.05, end: 1.35 },
      { word: 'reels', start: 1.4, end: 1.85 },
      { word: 'banate', start: 1.9, end: 2.15 },
      { word: 'ho', start: 2.18, end: 2.28 }
    ]
  },
  {
    id: 'hgl-2',
    start: 2.4,
    end: 4.8,
    text: 'Toh basic subtitles band karo',
    words: [
      { word: 'Toh', start: 2.4, end: 2.75 },
      { word: 'basic', start: 2.8, end: 3.3 },
      { word: 'subtitles', start: 3.35, end: 4.1 },
      { word: 'band', start: 4.15, end: 4.5 },
      { word: 'karo', start: 4.55, end: 4.78 }
    ]
  },
  {
    id: 'hgl-3',
    start: 4.9,
    end: 7.3,
    text: 'Ye Spider style captions try karo',
    words: [
      { word: 'Ye', start: 4.9, end: 5.2 },
      { word: 'Spider', start: 5.25, end: 5.75 },
      { word: 'style', start: 5.8, end: 6.2 },
      { word: 'captions', start: 6.25, end: 6.8 },
      { word: 'try', start: 6.85, end: 7.05 },
      { word: 'karo', start: 7.1, end: 7.28 }
    ]
  },
  {
    id: 'hgl-4',
    start: 7.4,
    end: 9.9,
    text: 'Retention sidha 100 percent cross hoga',
    words: [
      { word: 'Retention', start: 7.4, end: 8.0 },
      { word: 'sidha', start: 8.05, end: 8.4 },
      { word: '100', start: 8.45, end: 8.85 },
      { word: 'percent', start: 8.9, end: 9.35 },
      { word: 'cross', start: 9.4, end: 9.65 },
      { word: 'hoga', start: 9.7, end: 9.88 }
    ]
  }
];

export function getSampleCaptionsByLanguage(lang: SupportedLanguage): CaptionSegment[] {
  switch (lang) {
    case 'hi':
      return SAMPLE_CAPTIONS_HI;
    case 'pa':
      return SAMPLE_CAPTIONS_PA;
    case 'hinglish':
      return SAMPLE_CAPTIONS_HINGLISH;
    case 'en':
      return SAMPLE_CAPTIONS_EN;
    default: {
      // Native phrases for 50+ languages catalogue
      const langPhrases: Record<string, string[]> = {
        es: ['Aprende a crear subtítulos', 'animados profesionales para tus reels', 'aumenta tu retención al instante', 'con SpiderHarshCaption studio'],
        fr: ['Créez des sous-titres animés', 'tendance pour vos courtes vidéos', 'boostez votre audience TikTok', 'en quelques clics seulement'],
        de: ['Erstellen Sie virale Untertitel', 'für Ihre YouTube Shorts', 'verdoppeln Sie die Wiedergabezeit', 'mit SpiderHarshCaption'],
        ja: ['バズるリール動画の秘密', '視聴維持率を劇的に上げる', 'プロ仕様のアニメーション字幕', '今すぐ作成を始めよう'],
        ko: ['릴스와 쇼츠를 위한', '트렌디한 애니메이션 자막', '시청 지속 시간을 극대화하세요', 'SpiderHarshCaption 스튜디오'],
        zh: ['打造百万播放爆款短视频', '高留存率动态动画字幕', '轻松导入导出剪映CapCut', '让每一个字都充满质感'],
        ar: ['سر مقاطع الفيديو واسعة الانتشار', 'تسميات توضيحية متحركة مذهلة', 'ارفع نسبة المشاهدة فوراً', 'مع استوديو الكابشن الاحترافي'],
        pt: ['Legendas animadas automáticas', 'que aumentam sua retenção', 'perfeito para Reels e TikTok', 'exporte direto para o CapCut'],
        ru: ['Секрет вирусных коротких видео', 'трендовые анимированные субтитры', 'увеличьте удержание аудитории', 'быстрый экспорт в CapCut'],
        it: ['Sottotitoli animati premium', 'per conquistare i tuoi Reels', 'massimizza il tempo di visualizzazione', 'con effetti di tendenza'],
        bn: ['ভাইরাল রিলসের গোপন কৌশল', 'অ্যানিমেটেড সাবটাইটেল তৈরি করুন', 'দর্শকদের ধরে রাখুন শেষ পর্যন্ত', 'SpiderHarshCaption স্টুডিও'],
        mr: ['व्हायरल रील्सचे सर्वात मोठे रहस्य', 'आकर्षक अ‍ॅनिमेटेड कॅप्शन्स', 'तुमचा रीच दहा पटीने वाढवा', 'आताच सुरुवात करा'],
        te: ['వైరల్ రీల్స్ రహస్యం ఇదే', 'అద్భుతమైన యానిమేటెడ్ క్యాప్షన్స్', 'మీ వీడియో వ్యూస్ పెంచుకోండి', 'సులభంగా ఎగుమతి చేయండి'],
        ta: ['வைரல் வீடியோக்களின் ரகசியம்', 'அசத்தலான அனிமேஷன் சப்டைட்டில்ஸ்', 'உங்கள் பார்வைகளை இரட்டிப்பாக்குங்கள்', 'இப்போதே தொடங்குங்கள்'],
        gu: ['વાયરલ રીલ્સનું સાચું રહસ્ય', 'પ્રીમિયમ એનિમેટેડ કેપ્શન્સ', 'તમારી રીચ દસ ગણી વધારો', 'હમણાં જ બનાવો'],
        kn: ['ವೈರಲ್ ರೀಲ್ಸ್ ನ ರಹಸ್ಯ', 'ಆಕರ್ಷಕ ಅನಿಮೇಟೆಡ್ ಉಪಶೀರ್ಷಿಕೆಗಳು', 'ವೀಡಿಯೊ ವೀಕ್ಷಣೆ ಹೆಚ್ಚಿಸಿ', 'ತಕ್ಷಣವೇ ಪ್ರಾರಂಭಿಸಿ'],
        ml: ['വൈറൽ റീലുകളുടെ രഹസ്യം', 'മികച്ച ആനിമേഷൻ അടിക്കുറിപ്പുകൾ', 'പ്രേക്ഷകരെ ആകർഷിക്കുക', 'ഇപ്പോൾ തന്നെ തുടങ്ങൂ'],
        ur: ['وائرل ویڈیوز کا سب سے بڑا راز', 'شاندار اینیمیٹڈ کیپشنز بنائیں', 'ویڈیو ریٹینشن میں اضافہ کریں', 'ابھی شروع کریں'],
        tr: ['Viral videoların en büyük sırrı', 'trend animasyonlu altyazılar', 'izlenme süresini ikiye katlayın', 'hemen denemeye başlayın']
      };

      const phrases = langPhrases[lang] || [
        'Make every single word pop',
        'with dynamic animated subtitles',
        'skyrocket your video retention',
        'export transparent overlay for CapCut'
      ];

      return phrases.map((phrase, idx) => {
        const start = 0.2 + idx * 2.3;
        const end = start + 2.1;
        const words = phrase.split(' ');
        const dur = (end - start) / words.length;
        return {
          id: `${lang}-${idx + 1}`,
          start: Math.round(start * 100) / 100,
          end: Math.round(end * 100) / 100,
          text: phrase,
          words: words.map((w, wIdx) => ({
            word: w,
            start: Math.round((start + wIdx * dur) * 100) / 100,
            end: Math.round((start + (wIdx + 1) * dur) * 100) / 100
          }))
        };
      });
    }
  }
}

/**
 * Creates a complete mock or initialized project
 */
export function createDefaultProject(
  title = 'Untitled Reel Project',
  language: SupportedLanguage = 'en',
  templateId = 'reels-001'
): CaptionProject {
  const template = getTemplateById(templateId);
  const captions = getSampleCaptionsByLanguage(language);

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    language,
    video: null,
    captions,
    activeTemplateId: template.id,
    customStyle: { ...template.config },
    aspectRatio: '9:16',
    duration: 10
  };
}
