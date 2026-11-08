import type { OpenRouterSettings, Question } from './types';

const STORAGE_KEY = 'nmt_sprint_openrouter';

export const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';

export interface ModelOption {
  id: string;
  label: string;
  badge: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash', badge: 'free' },
  { id: 'google/gemini-2.5-flash-preview', label: 'Gemini 2.5 Flash', badge: 'preview' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o mini', badge: '' },
  { id: 'openai/gpt-4o', label: 'GPT-4o', badge: '' },
  { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', badge: '' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', badge: '' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B', badge: 'free' },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B', badge: 'free' },
];

export interface TestResult {
  ok: boolean;
  message: string;
  modelEcho?: string;
}

/**
 * Lightweight connectivity probe: sends a tiny chat request and checks the
 * model actually responds. Returns a human-readable result for the UI.
 */
export async function testModel(
  apiKey: string,
  model: string,
): Promise<TestResult> {
  const key = apiKey.trim();
  if (!key) {
    return { ok: false, message: 'Спершу вставте API-ключ.' };
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': 'https://nmt-sprint.local',
        'X-Title': 'NMT Sprint Tutor',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Відповідь одним словом: "готово"' }],
        max_tokens: 10,
      }),
    });

    if (res.status === 401) {
      return { ok: false, message: 'Невірний API-ключ. Перевірте значення.' };
    }
    if (res.status === 402) {
      return { ok: false, message: 'На рахунку OpenRouter недостатньо коштів для цієї моделі.' };
    }
    if (res.status === 404) {
      return { ok: false, message: 'Модель не знайдено. Виберіть іншу.' };
    }
    if (!res.ok) {
      return { ok: false, message: `Помилка сервера (${res.status}). Спробуйте пізніше.` };
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    const echoModel: string | undefined = data?.model;
    if (!content || !content.trim()) {
      return { ok: false, message: 'Модель не повернула відповідь. Спробуйте іншу.' };
    }
    return {
      ok: true,
      message: `Модель працює! Відповідь: «${content.trim()}».`,
      modelEcho: echoModel,
    };
  } catch {
    return { ok: false, message: 'Немає зв\u2019язку з OpenRouter. Перевірте інтернет.' };
  }
}

export function loadSettings(): OpenRouterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OpenRouterSettings>;
      return { apiKey: parsed.apiKey ?? '', model: parsed.model ?? DEFAULT_MODEL };
    }
  } catch {
    // ignore malformed storage
  }
  return { apiKey: '', model: DEFAULT_MODEL };
}

export function saveSettings(settings: OpenRouterSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Ask OpenRouter for a plain-language explanation of why the correct answer is right.
 * Falls back gracefully: throws on any error so the caller can switch to Mock mode.
 */
export async function fetchExplanation(
  question: Question,
  settings: OpenRouterSettings,
): Promise<string> {
  if (!settings.apiKey.trim()) {
    throw new Error('missing-api-key');
  }

  const letters = ['A', 'B', 'C', 'D'];
  const optionsText = question.options.map((o, i) => `${letters[i]}) ${o}`).join('\n');
  const correctLetter = letters[question.correctIndex];
  const correctText = question.options[question.correctIndex];

  const systemPrompt =
    'Ти — доброзичливий AI-репетитор, що готує учнів до НМТ (український зовнішній тест). ' +
    'Пояснюй коротко, простими українськими словами, у 2-4 реченнях. ' +
    'Не пиши варіанти A/B/C/D у відповіді, лише суть.';

  const userPrompt =
    `Питання: ${question.prompt}\n` +
    `Варіанти:\n${optionsText}\n` +
    `Правильна відповідь: ${correctLetter}) ${correctText}\n` +
    `Поясни простими словами, чому ця відповідь правильна.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
      'HTTP-Referer': 'https://nmt-sprint.local',
      'X-Title': 'NMT Sprint Tutor',
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    throw new Error(`openrouter-http-${res.status}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error('openrouter-empty');
  }
  return content.trim();
}
