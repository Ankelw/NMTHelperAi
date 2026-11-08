import { useEffect, useRef, useState } from 'react';
import { Check, X as XIcon, Clock, Trophy, ChevronRight, Loader2, Bot, WifiOff } from 'lucide-react';
import type { Question, Mode } from '@/types';
import { fetchExplanation } from '@/openrouter';
import type { OpenRouterSettings } from '@/types';

interface Props {
  questions: Question[];
  settings: OpenRouterSettings;
  mode: Mode;
  onFinish: (score: number, correct: number, incorrect: number, timeUsed: number) => void;
  onApiError: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];
const TIME_LIMIT = 120; // seconds

export default function QuizScreen({ questions, settings, mode, onFinish, onApiError }: Props) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explLoading, setExplLoading] = useState(false);
  const [explanationMode, setExplanationMode] = useState<Mode>(mode);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<number | null>(null);

  const current = questions[index];
  const total = questions.length;

  // Countdown timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTimeout() {
    // Treat remaining questions as incorrect
    onFinish(score, correctCount, total - correctCount, TIME_LIMIT);
  }

  async function handleAnswer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    if (timerRef.current) window.clearInterval(timerRef.current);

    const isCorrect = i === current.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
    } else {
      setIncorrectCount((c) => c + 1);
    }

    // Fetch AI explanation (fallback to local)
    if (mode === 'ai') {
      setExplLoading(true);
      try {
        const text = await fetchExplanation(current, settings);
        setExplanation(text);
        setExplanationMode('ai');
      } catch {
        // Fallback to local explanation; don't hard-fail the quiz
        setExplanation(current.explanation);
        setExplanationMode('mock');
        onApiError();
      } finally {
        setExplLoading(false);
      }
    } else {
      setExplanation(current.explanation);
      setExplanationMode('mock');
    }
  }

  function handleNext() {
    if (index + 1 >= total) {
      onFinish(score, correctCount, incorrectCount, TIME_LIMIT - timeLeft);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
    setLocked(false);
    setExplanation(null);
    setExplLoading(false);
  }

  const progressPct = ((index + (locked ? 1 : 0)) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeColor = timeLeft <= 30 ? 'text-red-500' : 'text-slate-700';

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-5 pb-10">
      {/* Status row */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className={`flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 shadow-sm ${timeColor}`}>
          <Clock size={18} />
          <span className="font-bold tabular-nums text-slate-200">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 font-bold text-slate-200 shadow-sm">
          <Trophy size={18} className="text-amber-500" />
          <span className="tabular-nums">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs font-bold text-slate-400">
          <span>
            Питання {index + 1} / {total}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div key={index} className="mt-5 rounded-3xl bg-slate-800 p-6 shadow-lg animate-slideUp">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-purple-900/20 px-2.5 py-1 text-xs font-bold text-brand-purple">
            {current.topic}
          </span>
        </div>
        <p className="text-lg font-bold leading-snug text-slate-100">{current.prompt}</p>
      </div>

      {/* Options */}
      <div className="mt-4 grid grid-cols-1 gap-3">
        {current.options.map((opt, i) => {
          let state: 'idle' | 'correct' | 'wrong' | 'muted' = 'idle';
          if (locked) {
            if (i === current.correctIndex) state = 'correct';
            else if (i === selected) state = 'wrong';
            else state = 'muted';
          }
          const styles: Record<string, string> = {
            idle:
              'border-2 border-slate-700 bg-slate-800 text-slate-200 hover:border-brand-cyan hover:bg-cyan-900/10',
            correct: 'border-2 border-emerald-400 bg-emerald-900/20 text-emerald-400 animate-pop',
            wrong: 'border-2 border-red-400 bg-red-900/20 text-red-400 animate-shake',
            muted: 'border-2 border-slate-700 bg-slate-800 text-slate-500 opacity-60',
          };
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => handleAnswer(i)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition active:scale-[0.98] ${styles[state]}`}
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                  state === 'correct'
                    ? 'bg-emerald-500 text-white'
                    : state === 'wrong'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                }`}
              >
                {state === 'correct' ? <Check size={18} /> : state === 'wrong' ? <XIcon size={18} /> : LETTERS[i]}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {locked && (
        <div className="mt-5 animate-slideUp rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-purple text-white">
              <Bot size={18} />
            </div>
            <h3 className="font-extrabold text-slate-100">Пояснення від AI Tutor</h3>
            {explanationMode === 'mock' && mode === 'ai' && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-900/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                <WifiOff size={11} /> локально
              </span>
            )}
            {explanationMode === 'mock' && mode === 'mock' && (
              <span className="ml-auto rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                Mock
              </span>
            )}
          </div>
          {explLoading ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Генеруємо пояснення...
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed text-slate-300">{explanation}</p>
          )}

          <button
            onClick={handleNext}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple px-4 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90 active:scale-95"
          >
            {index + 1 >= total ? 'Побачити результат' : 'Далі'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
