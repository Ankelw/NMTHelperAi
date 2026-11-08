export type SubjectId = 'history' | 'ukrainian' | 'math' | 'english';

export interface QuizResultRecord {
  id: string;
  subject: SubjectId | 'random';
  score: number;
  correct: number;
  total: number;
  date: string; // ISO date string
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

export type Screen = 'home' | 'quiz' | 'result' | 'error';

export interface OpenRouterSettings {
  apiKey: string;
  model: string;
}

export type Mode = 'ai' | 'mock';
