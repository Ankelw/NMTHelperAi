import { useState } from 'react';
import { Flame, TrendingUp, Award, RotateCcw, Target } from 'lucide-react';
import { SUBJECTS } from '@/questions';
import {
  getCompletedSubjects,
  getDailyGoal,
  loadProgress,
  getStreak,
  getSubjectStats,
  getTodayQuizCount,
  saveDailyGoal,
} from '@/progress';
import type { DailyGoal, QuizResultRecord } from '@/types';

interface Props {
  recent: QuizResultRecord[];
  streak: number;
  onClear: () => void;
}

const SUBJECT_LABELS: Record<string, string> = {
  history: 'Історія України',
  ukrainian: 'Українська мова',
  math: 'Математика',
  english: 'Англійська мова',
  biology: 'Біологія',
  chemistry: 'Хімія',
  physics: 'Фізика',
  geography: 'Географія',
  literature: 'Українська література',
  random: 'Випадковий спринт',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${day}.${month} ${hh}:${mm}`;
}

export default function ProgressPanel({ recent, streak, onClear }: Props) {
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => getDailyGoal());
  const todayCount = getTodayQuizCount();
  const stats = getSubjectStats(SUBJECTS.map((subject) => subject.id));
  const allResults = loadProgress();
  const completedSubjects = getCompletedSubjects();
  const currentStreak = getStreak();
  const achievements = [
    { label: 'Перший тест', earned: allResults.length > 0 },
    { label: 'Бездоганно', earned: allResults.some((result) => result.total > 0 && result.correct === result.total) },
    { label: 'Серія 3 дні', earned: currentStreak >= 3 },
    { label: 'Серія 7 днів', earned: currentStreak >= 7 },
    { label: '10 тестів', earned: allResults.length >= 10 },
    { label: 'Знавець', earned: completedSubjects.size === SUBJECTS.length },
  ];

  return (
    <div className="mt-8 animate-slideUp">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-300">Мій прогрес</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Очистити історію результатів і серію днів?')) onClear();
          }}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          <RotateCcw size={14} />
          Скинути прогрес
        </button>
      </div>

      {/* Streak card */}
      {streak > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-900/20 to-amber-900/20 p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-100">
              {streak} {streak === 1 ? 'день' : streak < 5 ? 'дні' : 'днів'} поспіль
            </p>
            <p className="text-xs font-bold text-orange-400">Так тримати!</p>
          </div>
        </div>
      )}

      {/* Daily goal */}
      <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Target size={19} className="text-brand-cyan" />
          <p className="text-sm font-bold text-slate-200">Денна ціль</p>
          <p className="ml-auto text-sm font-extrabold text-slate-100">
            {todayCount} з {dailyGoal} сьогодні
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple transition-all"
            style={{ width: `${Math.min(100, (todayCount / dailyGoal) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex gap-2">
          {([1, 3, 5] as const).map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => {
                saveDailyGoal(goal);
                setDailyGoal(goal);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                dailyGoal === goal
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-purple text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {goal} {goal === 1 ? 'тест' : 'тести'}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-bold text-slate-300">Досягнення</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.label}
              className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold ${
                achievement.earned
                  ? 'border-amber-500/30 bg-amber-900/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-500'
              }`}
            >
              <Award size={16} />
              {achievement.label}
            </div>
          ))}
        </div>
      </div>

      {/* Subject statistics */}
      <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-300">Статистика за предметами</p>
        <div className="space-y-3">
          {stats.map((stat) => {
            const label = SUBJECT_LABELS[stat.subject];
            const percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            return (
              <div key={stat.subject}>
                <div className="mb-1 flex justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-300">{label}</span>
                  <span className="font-bold text-slate-400">{percentage}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent results */}
      {recent.length > 0 && (
        <div className="space-y-2">
          {recent.map((r) => {
            const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
            return (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      pct >= 80
                        ? 'bg-emerald-900/20 text-emerald-400'
                        : pct >= 50
                          ? 'bg-amber-900/20 text-amber-400'
                          : 'bg-red-900/20 text-red-400'
                    }`}
                  >
                    {pct >= 80 ? <Award size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300">
                      {SUBJECT_LABELS[r.subject] ?? r.subject}
                    </p>
                    <p className="text-xs font-medium text-slate-400">{formatDate(r.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-slate-100">{r.score}</p>
                  <p className="text-xs font-medium text-slate-300">
                    {r.correct}/{r.total} · {pct}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
