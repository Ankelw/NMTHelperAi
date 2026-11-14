export type SubjectId =
  | 'history'
  | 'ukrainian'
  | 'math'
  | 'english'
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'geography'
  | 'literature';

export interface QuizResultRecord {
  id: string;
  subject: SubjectId | 'random';
  score: number;
  correct: number;
  total: number;
  date: string; // ISO date string
  questionOutcomes?: QuestionOutcome[];
}

export interface QuestionOutcome {
  questionId: string;
  subject: SubjectId;
  correct: boolean;
  answered: boolean;
}

export interface Question {
  id: string;
  subject: SubjectId;
  topic: string;
  prompt: string;
  options: string[]; // exactly 4
  correctIndex: number; // 0..3
  explanation: string; // local fallback explanation
}

export interface Subject {
  id: SubjectId;
  label: string;
  icon: string; // lucide icon name
  topics: string[];
}

export type QuestionCount = 3 | 5 | 10;

export type DailyGoal = 1 | 3 | 5;

export type Screen = 'home' | 'quiz' | 'result' | 'error';

export interface OpenRouterSettings {
  apiKey: string;
  model: string;
}

export type Mode = 'ai' | 'mock';
