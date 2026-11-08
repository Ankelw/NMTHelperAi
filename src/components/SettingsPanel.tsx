import { useState } from 'react';
import { X, KeyRound, Bot, Check, Trash2, Loader2, Zap, Pencil } from 'lucide-react';
import type { OpenRouterSettings } from '@/types';
import { DEFAULT_MODEL, MODEL_OPTIONS, saveSettings, testModel, type TestResult } from '@/openrouter';

interface Props {
  open: boolean;
  settings: OpenRouterSettings;
  onClose: () => void;
  onSave: (s: OpenRouterSettings) => void;
}

export default function SettingsPanel({ open, settings, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [customModel, setCustomModel] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  if (!open) return null;

  // Determine whether current model value matches a preset option
  const isPreset = MODEL_OPTIONS.some((m) => m.id === model);

  const handleSave = () => {
    const next = { apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODEL };
    saveSettings(next);
    onSave(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const handleClear = () => {
    setApiKey('');
    setModel(DEFAULT_MODEL);
    setTestResult(null);
    const next = { apiKey: '', model: DEFAULT_MODEL };
    saveSettings(next);
    onSave(next);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testModel(apiKey, model.trim() || DEFAULT_MODEL);
    setTestResult(result);
    setTesting(false);
  };

  const selectedOption = MODEL_OPTIONS.find((m) => m.id === model);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-slate-900 p-6 shadow-2xl animate-pop">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-100">Налаштування AI</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-700"
            aria-label="Закрити"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5">
          {/* API key */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
              <KeyRound size={16} className="text-brand-cyan" />
              API-ключ OpenRouter
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="sk-or-v1-..."
              className="w-full rounded-xl border-2 border-slate-600 px-4 py-3 text-slate-200 outline-none transition focus:border-brand-cyan bg-slate-800"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Зберігається лише у вашому браузері (localStorage).
            </p>
          </div>

          {/* Model selector */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
              <Bot size={16} className="text-brand-purple" />
              Модель штучного інтелекту
            </label>

            {customModel || !isPreset ? (
              <div>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="vendor/model-name"
                  className="w-full rounded-xl border-2 border-slate-600 px-4 py-3 text-slate-200 outline-none transition focus:border-brand-purple bg-slate-800"
                />
                {MODEL_OPTIONS.length > 0 && (
                  <button
                    onClick={() => {
                      setCustomModel(false);
                      setModel(selectedOption?.id ?? DEFAULT_MODEL);
                      setTestResult(null);
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                  >
                    ← Повернутись до списку
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {MODEL_OPTIONS.map((m) => {
                    const active = model === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setModel(m.id);
                          setTestResult(null);
                        }}
                        className={`flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition active:scale-95 ${
                          active
                            ? 'border-brand-purple bg-purple-900/20 shadow-sm'
                            : 'border-slate-700 bg-slate-800 hover:border-brand-purple/40'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-300">{m.label}</span>
                        {m.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              m.badge === 'free'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setCustomModel(true);
                    setTestResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-brand-purple"
                >
                  <Pencil size={13} />
                  Ввести свою модель
                </button>
              </div>
            )}

            <p className="mt-1.5 break-all text-xs text-slate-400">
              Обрано: <span className="font-semibold text-slate-300">{model || DEFAULT_MODEL}</span>
            </p>
          </div>

          {/* Test button + result */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple px-4 py-3 font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Перевіряємо...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Перевірити, чи модель працює
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-sm font-medium animate-slideUp ${
                  testResult.ok
                    ? 'bg-emerald-900/20 text-emerald-400'
                    : 'bg-red-900/20 text-red-400'
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">{testResult.ok ? '✅' : '⚠️'}</span>
                <div>
                  <p>{testResult.message}</p>
                  {testResult.modelEcho && (
                    <p className="mt-1 break-all text-xs text-slate-400">
                      Сервер підтвердив модель: {testResult.modelEcho}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-cyan-900/20 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-200">Як це працює?</p>
            <p className="mt-1">
              Без ключа застосунок працює у <b>Mock-режимі</b> — пояснення беруться з
              локальної бази. Із ключем AI Tutor генерує пояснення через OpenRouter.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple px-4 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90 active:scale-95"
          >
            {saved ? <Check size={18} /> : null}
            {saved ? 'Збережено!' : 'Зберегти'}
          </button>
          <button
            onClick={handleClear}
            className="rounded-xl border-2 border-slate-700 px-4 py-3 text-slate-300 transition hover:bg-slate-700 active:scale-95"
            aria-label="Очистити"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
