import { Flame, TrendingUp, Award, RotateCcw } from 'lucide-react';
import type { QuizResultRecord } from '@/types';

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
  if (recent.length === 0 && streak === 0) return null;

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
