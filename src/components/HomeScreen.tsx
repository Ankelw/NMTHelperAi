import { Sparkles, Shuffle, Landmark, BookOpen, Calculator, Globe, Play, ChevronRight, type LucideIcon } from 'lucide-react';
import type { Subject, SubjectId, QuizResultRecord, QuestionCount } from '@/types';
import ProgressPanel from '@/components/ProgressPanel';

interface Props {
  subjects: Subject[];
  selectedSubject: SubjectId | null;
  selectedTopic: string | null;
  questionCount: QuestionCount;
  setQuestionCount: (count: QuestionCount) => void;
  onSelectSubject: (id: SubjectId) => void;
  onSelectTopic: (topic: string | null) => void;
  onStart: () => void;
  onRandomSprint: () => void;
  recentResults: QuizResultRecord[];
  streak: number;
}

const ICONS: Record<string, LucideIcon> = {
  Landmark,
  BookOpen,
  Calculator,
  Globe,
};

export default function HomeScreen({
  subjects,
  selectedSubject,
  selectedTopic,
  questionCount,
  setQuestionCount,
  onSelectSubject,
  onSelectTopic,
  onStart,
  onRandomSprint,
  recentResults,
  streak,
}: Props) {
  const activeSubject = subjects.find((s) => s.id === selectedSubject) ?? null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-5 pb-10">
      {/* Empty-state hero */}
      <div className="mt-4 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6 text-center shadow-sm">
        <div className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-700 text-5xl shadow-md animate-floaty">
          🦉
        </div>
        <h2 className="text-2xl font-extrabold leading-tight text-slate-100">
          Пройди 3 швидкі питання
        </h2>
        <p className="mt-1 text-base font-medium text-slate-400">
          до НМТ за 2 хвилини — без нудних підручників.
        </p>
      </div>

      {/* Subject picker */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-bold text-slate-300">Оберіть предмет</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {subjects.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            const active = selectedSubject === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSubject(s.id)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition active:scale-95 ${
                  active
                    ? 'border-brand-cyan bg-cyan-900/20 shadow-md'
                    : 'border-slate-700 bg-slate-800 hover:border-brand-cyan/40'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                    active
                      ? 'bg-gradient-to-br from-brand-cyan to-brand-purple text-white'
                      : 'bg-slate-700 text-slate-400 group-hover:text-brand-cyan'
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-slate-300">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic picker */}
      {activeSubject && (
        <div className="mt-5 animate-slideUp">
          <p className="mb-3 text-sm font-bold text-slate-300">Оберіть тему</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectTopic(null)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                selectedTopic === null
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-brand-purple/40'
              }`}
            >
              Усі теми
            </button>
            {activeSubject.topics.map((t) => (
              <button
                key={t}
                onClick={() => onSelectTopic(t)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                  selectedTopic === t
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-brand-purple/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Random sprint */}
      <button
        onClick={onRandomSprint}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-purple bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-4 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:opacity-90 active:scale-95"
      >
        <Shuffle size={20} />
        Випадковий експрес-спринт (3 питання)
      </button>

      {/* Question count selector */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-slate-400 text-center">Скільки питань?</p>
        <div className="flex justify-center gap-2">
          {[3, 5, 10].map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n as QuestionCount)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition active:scale-95 ${
                questionCount === n
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-purple text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-brand-cyan hover:bg-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Start */}
      <button
        disabled={!activeSubject}
        onClick={onStart}
        className={`mt-4 flex items-center justify-center gap-2 rounded-2xl px-6 py-5 text-lg font-extrabold transition active:scale-95 ${
          activeSubject
            ? 'bg-gradient-to-r from-brand-cyan to-brand-purple text-white shadow-xl shadow-cyan-500/30 hover:opacity-90'
            : 'cursor-not-allowed bg-slate-200 text-slate-400'
        }`}
      >
        <Play size={22} fill="currentColor" />
        Почати тест
      </button>

      {!activeSubject && (
        <p className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-400">
          <ChevronRight size={14} /> Спершу оберіть предмет
        </p>
      )}

      <ProgressPanel recent={recentResults} streak={streak} />
    </div>
  );
}
