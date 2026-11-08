import { useEffect, useRef, useState } from 'react';
import { Check, X as XIcon, Clock, Trophy, ChevronRight, Loader2, Bot, WifiOff } from 'lucide-react';
import type { Question, Mode } from '@/types';
import { fetchExplanation } from '@/openrouter';
import type { OpenRouterSettings } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D'];
const TIME_LIMIT = 120; // seconds

const FUN_CORRECT = [
  'Влучно! 🎯',
  'Це правильно! 🔥',
  'Молодець! 💪',
  'Точно! ✨',
  'Ненавідно кращий результат! 🏆',
  'А як же інакше! 😎',
  'НМТ схвалить! 📚',
];

const FUN_WRONG = [
  'Ні, не той варіант 😅',
  'До侵, але не в цю сторону 🎯',
  'Мимо цілля 🏹',
  'Потрібно повторити тему 📖',
  'Ще трохи практики і буде ідеал! 💪',
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function playTone(freq: number, duration = 150) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // ignore audio errors
  }
}

function spawnConfetti() {
  const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const count = 60;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = `${50 + (Math.random() - 0.5) * 40}vw`;
    el.style.top = '0';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    document.body.appendChild(el);

    const tx = (Math.random() - 0.5) * 200;
    const ty = window.innerHeight + 100;
    const anim = el.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) rotate(720deg)`, opacity: 0 },
      ],
      {
        duration: 800 + Math.random() * 600,
        easing: 'cubic-bezier(0, 0.9, 0.3, 1)',
      }
    );
    anim.onfinish = () => el.remove();
  }
}

interface Props {
  questions: Question[];
  settings: OpenRouterSettings;
  mode: Mode;
  onFinish: (score: number, correct: number, incorrect: number, timeUsed: number) => void;
  onApiError: () => void;
}

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
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [secretMode, setSecretMode] = useState(false);
  const timerRef = useRef<number | null>(null);

  const current = questions[index];
  const total = questions.length;

  // Shuffle options so the correct answer is not always under A
  const [shuffledOptions, setShuffledOptions] = useState<Array<{ text: string; isCorrect: boolean }>>(
    () => {
      const correctIndex = current.correctIndex;
      return current.options.map((opt, i) => ({
        text: opt,
        isCorrect: i === correctIndex,
      }));
    }
  );

  const correctLetter = shuffledOptions.findIndex((o) => o.isCorrect);
  const correctLetterChar = LETTERS[correctLetter];

  // Regenerate shuffled options when question changes
  useEffect(() => {
    const correctIndex = current.correctIndex;
    setShuffledOptions(
      current.options.map((opt, i) => ({ text: opt, isCorrect: i === correctIndex }))
    );
    setSelected(null);
    setLocked(false);
    setExplanation(null);
    setExplLoading(false);
  }, [index, current]);

  // Countdown timer
  useEffect(() => {
    if (locked || secretMode) return;
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
  }, [index, timeLeft, locked, secretMode]);

  function handleTimeout() {
    onFinish(score, correctCount, total - correctCount, TIME_LIMIT);
  }

  async function handleAnswer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    if (timerRef.current) window.clearInterval(timerRef.current);

    const isCorrect = shuffledOptions[i].isCorrect;
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
      playTone(880);
      spawnConfetti();
    } else {
      setIncorrectCount((c) => c + 1);
      playTone(220, 300);
    }

    if (mode === 'ai') {
      setExplLoading(true);
      try {
        const text = await fetchExplanation(current, settings);
        setExplanation(text);
        setExplanationMode('ai');
      } catch {
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
    setTimeLeft(TIME_LIMIT);
  }

  const progressPct = ((index + (locked ? 1 : 0)) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeColor = timeLeft <= 30 ? 'text-red-500' : 'text-slate-200';

  const funMessage =
    locked &&
    (selected === null ? null : shuffledOptions[selected ?? -1]?.isCorrect
      ? FUN_CORRECT[Math.floor(Math.random() * FUN_CORRECT.length)]
      : FUN_WRONG[Math.floor(Math.random() * FUN_WRONG.length)]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-5 pb-10">
      {/* Status row */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div
          onClick={() => {
            setEasterEggClicks((c) => {
              const next = c + 1;
              if (next >= 10) {
                setSecretMode(true);
              }
              return next;
            });
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:scale-105 transition ${timeColor}`}
          title="Секретний режим: 10 кліків на номер питання 🦉"
        >
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

      {secretMode && (
        <div className="mt-2 flex justify-center animate-bounce">
          <span className="text-xs font-bold text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30">
            🦉 Секретний режим увімкнено — всі відповіді правильні!
          </span>
        </div>
      )}

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
        {shuffledOptions.map((opt, i) => {
          let state: 'idle' | 'correct' | 'wrong' | 'muted' = 'idle';
          if (locked) {
            if (opt.isCorrect) state = 'correct';
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
              <span className="flex-1">{opt.text}</span>
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

          {funMessage && (
            <p className="mb-2 text-sm font-bold text-brand-cyan text-center">{funMessage}</p>
          )}

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
