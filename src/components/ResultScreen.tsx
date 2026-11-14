import { useState } from 'react';
import { Trophy, RotateCcw, Home, Star, Clock, Share2 } from 'lucide-react';
import type { QuizResultRecord } from '@/types';

interface Props {
  score: number;
  total: number; // max score
  correct: number;
  incorrect: number;
  totalQuestions: number;
  timeUsed: number; // seconds spent on the sprint
  subject: QuizResultRecord['subject'];
  onRetry: () => void;
  onHome: () => void;
}

function getMotivation(pct: number): { title: string; message: string; emoji: string } {
  if (pct === 100)
    return {
      title: 'Бездоганно!',
      message: 'Ти готовий до НМТ на 100%. Продовжуй у тому ж дусі!',
      emoji: '🏆',
    };
  if (pct >= 67)
    return {
      title: 'Чудовий результат!',
      message: 'Ти впевнено володієш темою. Ще трохи практики — і буде ідеал.',
      emoji: '🎉',
    };
  if (pct >= 34)
    return {
      title: 'Непогано для старту',
      message: 'Ти на правильному шляху. Повтори тему і спробуй ще раз.',
      emoji: '💪',
    };
  return {
    title: 'Не здавайся!',
    message: 'Кожен майстер колись був новачком. Пройди спринт ще раз — стане легше.',
    emoji: '🌱',
  };
}

export default function ResultScreen({
  score,
  total,
  correct,
  incorrect,
  totalQuestions,
  timeUsed,
  subject,
  onRetry,
  onHome,
}: Props) {
  const [shareStatus, setShareStatus] = useState('');
  const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  const m = getMotivation(pct);
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : pct >= 20 ? 1 : 0;
  const mins = Math.floor(timeUsed / 60);
  const secs = timeUsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  async function shareResult() {
    const subjects: Record<Exclude<QuizResultRecord['subject'], 'random'>, string> = {
      history: 'історії України',
      ukrainian: 'української мови',
      math: 'математики',
      english: 'англійської мови',
      biology: 'біології',
      chemistry: 'хімії',
      physics: 'фізики',
      geography: 'географії',
      literature: 'української літератури',
    };
    const subjectText = subject === 'random' ? 'у випадковому спринті' : `з ${subjects[subject]}`;
    try {
      await navigator.clipboard.writeText(`Я набрав ${pct}% ${subjectText} в NMT Sprint Tutor 🦉`);
      setShareStatus('Результат скопійовано!');
    } catch {
      setShareStatus('Не вдалося скопіювати результат.');
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col px-5 pb-10 pt-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-8 text-center shadow-lg animate-pop">
        <div className="mb-2 text-6xl animate-floaty">{m.emoji}</div>
        <h2 className="text-2xl font-extrabold text-slate-100">{m.title}</h2>
        <p className="mt-1 text-sm font-medium text-slate-400">{m.message}</p>

        {/* Stars */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              size={28}
              className={i < stars ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
            />
          ))}
        </div>
      </div>

      {/* Score */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-800 p-5 text-center shadow-sm">
          <Trophy size={24} className="mx-auto text-amber-500" />
          <p className="mt-2 text-3xl font-extrabold text-slate-100">
            {score}
            <span className="text-lg text-slate-300">/{total}</span>
          </p>
          <p className="text-xs font-bold text-slate-300">Бали</p>
        </div>
        <div className="rounded-2xl bg-slate-800 p-5 text-center shadow-sm">
          <p className="mt-1 text-3xl font-extrabold text-brand-cyan">{pct}%</p>
          <p className="text-xs font-bold text-slate-300">Правильних</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-900/20 p-4">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-xl font-extrabold text-emerald-400">{correct}</p>
            <p className="text-xs font-bold text-emerald-400">Правильно</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-red-900/20 p-4">
          <span className="text-xl">❌</span>
          <div>
            <p className="text-xl font-extrabold text-red-400">{incorrect}</p>
            <p className="text-xs font-bold text-red-400">Неправильно</p>
          </div>
        </div>
      </div>

      {/* Time spent */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-slate-800 p-4 shadow-sm">
        <Clock size={20} className="text-brand-cyan" />
        <p className="text-lg font-extrabold tabular-nums text-slate-100">{timeStr}</p>
        <p className="text-xs font-bold text-slate-300">Витрачено часу</p>
      </div>

      <button
        type="button"
        onClick={shareResult}
        className="mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800 px-4 py-3 font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95"
      >
        <Share2 size={18} />
        Поділитися результатом
      </button>
      {shareStatus && <p className="mt-2 text-center text-xs font-semibold text-slate-400">{shareStatus}</p>}

      {/* Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-purple px-4 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90 active:scale-95"
        >
          <RotateCcw size={20} />
          Ще раз
        </button>
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800 px-4 py-4 font-bold text-slate-300 transition hover:bg-slate-700 active:scale-95"
        >
          <Home size={20} />
          На головну
        </button>
      </div>
    </div>
  );
}
