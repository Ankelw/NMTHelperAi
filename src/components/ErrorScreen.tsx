import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  message: string;
  onRestartLocal: () => void;
  onHome: () => void;
}

export default function ErrorScreen({ message, onRestartLocal, onHome }: Props) {
  return (
    <div className="mx-auto flex max-w-xl flex-col px-5 pb-10 pt-10">
      <div className="rounded-3xl bg-slate-800 p-8 text-center shadow-lg animate-pop">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-900/20 text-red-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-100">Щось пішло не так</h2>
        <p className="mt-2 text-sm font-medium text-slate-400">{message}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onRestartLocal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-purple px-4 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90 active:scale-95"
        >
          <RotateCcw size={20} />
          Перезапустити тест у локальному режимі
        </button>
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800 px-4 py-4 font-bold text-slate-300 transition hover:bg-slate-700 active:scale-95"
        >
          <Home size={20} />
          Головне меню
        </button>
      </div>
    </div>
  );
}
