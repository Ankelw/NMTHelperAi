import type { DailyGoal, Question, QuestionOutcome, QuizResultRecord, SubjectId } from './types';

const STORAGE_KEY = 'nmt_sprint_progress';
const SAVED_QUESTIONS_KEY = 'nmt_sprint_saved_questions';
const INCORRECT_QUESTIONS_KEY = 'nmt_sprint_incorrect_questions';
const DAILY_GOAL_KEY = 'nmt_sprint_daily_goal';

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

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadSavedQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(SAVED_QUESTIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (question): question is Question =>
        typeof question === 'object' &&
        question !== null &&
        'id' in question &&
        typeof question.id === 'string' &&
        'options' in question &&
        Array.isArray(question.options),
    );
  } catch {
    return [];
  }
}

export function toggleSavedQuestion(question: Question): Question[] {
  const saved = loadSavedQuestions();
  const updated = saved.some((item) => item.id === question.id)
    ? saved.filter((item) => item.id !== question.id)
    : [...saved, question];
  try {
    localStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function loadIncorrectQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(INCORRECT_QUESTIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveIncorrectQuestionIds(ids: string[]): string[] {
  const updated = [...new Set([...loadIncorrectQuestionIds(), ...ids])];
  try {
    localStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function getDailyGoal(): DailyGoal {
  try {
    const value = Number(localStorage.getItem(DAILY_GOAL_KEY));
    return value === 1 || value === 3 || value === 5 ? value : 3;
  } catch {
    return 3;
  }
}

export function saveDailyGoal(goal: DailyGoal): void {
  try {
    localStorage.setItem(DAILY_GOAL_KEY, String(goal));
  } catch {
    // ignore storage errors
  }
}

export function getRecentResults(count: number): QuizResultRecord[] {
  const all = loadProgress();
  return all.slice(-count).reverse();
}

export interface SubjectStats {
  subject: SubjectId;
  correct: number;
  total: number;
}

export function getSubjectStats(subjects: SubjectId[]): SubjectStats[] {
  const stats = new Map(subjects.map((subject) => [subject, { subject, correct: 0, total: 0 }]));
  for (const record of loadProgress()) {
    if (record.questionOutcomes) {
      for (const outcome of record.questionOutcomes) {
        const stat = stats.get(outcome.subject);
        if (!stat) continue;
        stat.total++;
        if (outcome.correct) stat.correct++;
      }
    } else if (record.subject !== 'random') {
      const stat = stats.get(record.subject);
      if (stat) {
        stat.correct += record.correct;
        stat.total += record.total;
      }
    }
  }
  return [...stats.values()];
}

export function getCompletedSubjects(): Set<SubjectId> {
  const completed = new Set<SubjectId>();
  for (const record of loadProgress()) {
    if (record.subject !== 'random') completed.add(record.subject);
  }
  return completed;
}

export function getTodayQuizCount(): number {
  const today = new Date();
  return loadProgress().filter((record) => {
    const date = new Date(record.date);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }).length;
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
  questionOutcomes?: QuestionOutcome[],
): QuizResultRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    subject,
    score,
    correct,
    total,
    date: new Date().toISOString(),
    questionOutcomes,
  };
}
