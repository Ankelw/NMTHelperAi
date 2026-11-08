import { Settings as SettingsIcon } from 'lucide-react';
import type { Mode } from '@/types';

interface Props {
  mode: Mode;
  onOpenSettings: () => void;
}

export default function TopBar({ mode, onOpenSettings }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple shadow-md">
          <span className="text-lg">🦉</span>
        </div>
        <div>
          <h1 className="text-sm font-extrabold leading-tight text-slate-100">NMT Sprint</h1>
          <p className="text-[10px] font-medium text-slate-300">Експрес-тренажер</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-block ${
            mode === 'ai'
              ? 'bg-emerald-900/20 text-emerald-400'
              : 'bg-amber-900/20 text-amber-400'
          }`}
        >
          {mode === 'ai' ? 'AI Tutor' : 'Mock-режим'}
        </span>
        <button
          onClick={onOpenSettings}
          className="rounded-full p-2.5 text-slate-400 shadow-sm transition hover:rotate-90 hover:bg-slate-700 hover:text-brand-cyan active:scale-90"
          aria-label="Налаштування"
        >
          <SettingsIcon size={22} />
        </button>
      </div>
    </header>
  );
}
