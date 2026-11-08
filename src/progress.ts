import type { QuizResultRecord } from './types';

const STORAGE_KEY = 'nmt_sprint_progress';

export function loadProgress(): QuizResultRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as QuizResultRecord[];
  } catch {
    return [];
  }
}

export function saveProgress(record: QuizResultRecord): QuizResultRecord[] {
  const all = loadProgress();
  all.push(record);
  // Keep only the most recent 50 records to avoid unbounded growth.
  const trimmed = all.slice(-50);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
  return trimmed;
}

export function getRecentResults(count: number): QuizResultRecord[] {
  const all = loadProgress();
  return all.slice(-count).reverse();
}

/** Count consecutive days (ending today or yesterday) with at least one quiz. */
export function getStreak(): number {
  const all = loadProgress();
  if (all.length === 0) return 0;

  // Collect unique date strings (YYYY-MM-DD).
  const dates = new Set<string>();
  for (const r of all) {
    const d = r.date.slice(0, 10);
    dates.add(d);
  }

  // Walk backwards from today.
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
    } else {
      // Allow a gap only if it's today (no quiz yet today).
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

export function createRecord(
  subject: QuizResultRecord['subject'],
  score: number,
  correct: number,
  total: number,
): QuizResultRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    subject,
    score,
    correct,
    total,
    date: new Date().toISOString(),
  };
}
