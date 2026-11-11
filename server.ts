import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing json and large audio payloads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Health and capability check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: 'SpiderHarshCaption API'
  });
});

// Automatic transcription endpoint using Gemini Audio capability
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/wav', language = 'auto', context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'NO_API_KEY',
        message: 'GEMINI_API_KEY is not configured in the Secrets panel. Please configure it or use manual subtitle editing / instant sample transcripts.'
      });
    }

    if (!audioBase64) {
      return res.status(400).json({
        success: false,
        error: 'NO_AUDIO_DATA',
        message: 'No audio data was provided for transcription.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const languageInstructions: Record<string, string> = {
      hi: 'The speaker is speaking Hindi. Transcribe in pure Devanagari script (e.g. नमस्ते दोस्तों, स्वागत है आपका). Pay careful attention to matras and conjuncts.',
      pa: 'The speaker is speaking Punjabi. Transcribe in authentic Gurmukhi script (e.g. ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੋਸਤੋ, ਕਿਵੇਂ ਹੋ ਸਾਰੇ). Ensure proper Gurmukhi Unicode character representation.',
      en: 'The speaker is speaking English. Transcribe in clear, properly punctuated English.',
      hinglish: 'The speaker is speaking Hinglish (Hindi words written in Latin/English alphabet, e.g. "Aaj hum baat karenge naye features ke baare mein"). Transcribe in natural Roman script.',
      auto: 'Detect the spoken language automatically. Transcribe in its authentic native script with proper character encoding.'
    };

    const targetLangHint = languageInstructions[language] ||
      `The speaker is speaking ${language}. Transcribe speech accurately in its authentic native script and orthography with correct word boundaries and punctuation.`;


    const promptText = `
You are an elite, highly precise video captioning and speech-to-text timing engine for viral reels, shorts, podcasts and CapCut creators.
Analyze the provided audio track and produce synchronized captions with both segment timestamps and individual word-level timestamps.

Language instruction:
${targetLangHint}
${context ? `Additional creator context: ${context}` : ''}

CRITICAL TIMING REQUIREMENTS:
1. Divide speech into punchy, readable short segments (2 to 6 words per segment) suitable for vertical reels (Instagram, TikTok, YouTube Shorts).
2. For each segment, provide:
   - "id": a unique string (e.g. "seg-1", "seg-2")
   - "start": timestamp in seconds (decimal number, e.g. 0.35)
   - "end": timestamp in seconds (decimal number, e.g. 2.15)
   - "text": exact segment text
   - "words": array of every word in that segment with:
     - "word": the word string
     - "start": start time in seconds
     - "end": end time in seconds
3. Timestamps must be strictly non-decreasing and reflect actual vocal timing.
4. If there are periods of silence or music without speech, do not generate captions for those gaps.
5. Return clean JSON adhering exactly to the requested schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64
          }
        },
        {
          text: promptText
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: {
              type: Type.STRING,
              description: 'The primary language identified in the audio (e.g. Hindi, Punjabi, English, Hinglish)'
            },
            summary: {
              type: Type.STRING,
              description: 'Brief one-line summary of spoken content'
            },
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  start: { type: Type.NUMBER },
                  end: { type: Type.NUMBER },
                  text: { type: Type.STRING },
                  words: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        word: { type: Type.STRING },
                        start: { type: Type.NUMBER },
                        end: { type: Type.NUMBER }
                      },
                      required: ['word', 'start', 'end']
                    }
                  }
                },
                required: ['id', 'start', 'end', 'text', 'words']
              }
            }
          },
          required: ['detectedLanguage', 'captions']
        }
      }
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      success: false,
      error: 'TRANSCRIPTION_FAILED',
      message: error?.message || 'Failed to process audio transcription'
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SpiderHarshCaption server running at http://localhost:${PORT}`);
  });
}

startServer();
