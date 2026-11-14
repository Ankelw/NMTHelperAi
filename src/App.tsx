import { useMemo, useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import SettingsPanel from '@/components/SettingsPanel';
import HomeScreen from '@/components/HomeScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { QUESTIONS, SUBJECTS, getQuestionsFor, getRandomSprint } from '@/questions';
import { loadSettings } from '@/openrouter';
import {
  clearProgress,
  createRecord,
  getRecentResults,
  getStreak,
  loadIncorrectQuestionIds,
  loadSavedQuestions,
  saveIncorrectQuestionIds,
  saveProgress,
  toggleSavedQuestion,
} from '@/progress';
import type {
  OpenRouterSettings,
  Question,
  QuestionOutcome,
  Screen,
  SubjectId,
  Mode,
  QuizResultRecord,
  QuestionCount,
} from '@/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<OpenRouterSettings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(() => (loadSettings().apiKey.trim() ? 'ai' : 'mock'));

  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<QuestionCount>(3);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState({
    score: 0,
    correct: 0,
    incorrect: 0,
    total: 0,
    timeUsed: 0,
    subject: 'random' as QuizResultRecord['subject'],
  });
  const [recentResults, setRecentResults] = useState<QuizResultRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>(() => loadSavedQuestions());
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<string[]>(() => loadIncorrectQuestionIds());
  const incorrectQuestions = useMemo(
    () => incorrectQuestionIds.map((id) => QUESTIONS.find((question) => question.id === id)).filter(
      (question): question is Question => question !== undefined,
    ),
    [incorrectQuestionIds],
  );

  useEffect(() => {
    setRecentResults(getRecentResults(5));
    setStreak(getStreak());
  }, [screen]);

  const subjects = SUBJECTS;

  const handleSelectSubject = (id: SubjectId) => {
    setSubject(id);
    setTopic(null);
  };

  const setCount = (count: QuestionCount) => {
    setQuestionCount(count);
  };

  const startQuiz = (qs: Question[]) => {
    if (qs.length === 0) {
      setError('Для обраної теми немає питань. Спробуйте іншу тему або «Випадковий спринт».');
      setScreen('error');
      return;
    }
    setQuestions(qs);
    setResult({
      score: 0,
      correct: 0,
      incorrect: 0,
      total: qs.length,
      timeUsed: 0,
      subject: subject ?? 'random',
    });
    setScreen('quiz');
  };

  const handleStart = () => {
    if (!subject) return;
    const qs = getQuestionsFor(subject, topic, questionCount);
    startQuiz(qs);
  };

  const handleRandomSprint = () => {
    const qs = getRandomSprint(questionCount);
    setSubject(null);
    setTopic(null);
    startQuiz(qs);
  };

  const handleStartFromList = (items: Question[]) => {
    setSubject(null);
    setTopic(null);
    startQuiz(items.slice(0, questionCount));
  };

  const handleFinish = (
    score: number,
    correct: number,
    incorrect: number,
    timeUsed: number,
    outcomes: QuestionOutcome[],
  ) => {
    const subjectTag: QuizResultRecord['subject'] = subject ?? 'random';
    setResult({
      score,
      correct,
      incorrect,
      total: questions.length,
      timeUsed,
      subject: subjectTag,
    });
    const wrongIds = outcomes.filter((outcome) => outcome.answered && !outcome.correct).map(
      (outcome) => outcome.questionId,
    );
    setIncorrectQuestionIds(saveIncorrectQuestionIds(wrongIds));
    saveProgress(createRecord(subjectTag, score, correct, questions.length, outcomes));
    setScreen('result');
  };

  // When AI fails mid-quiz, switch global mode to mock so the rest uses local explanations.
  const handleApiError = () => {
    setMode('mock');
  };

  const handleRestartLocal = () => {
    setMode('mock');
    // Re-run with the same subject/topic, or random if none selected.
    const qs =
      subject !== null ? getQuestionsFor(subject, topic, questionCount) : getRandomSprint(questionCount);
    startQuiz(qs);
  };

  const handleRetry = () => {
    if (subject !== null) {
      startQuiz(getQuestionsFor(subject, topic, questionCount));
    } else {
      startQuiz(getRandomSprint(questionCount));
    }
  };

  const handleHome = () => {
    setScreen('home');
    setQuestions([]);
    setError('');
    // Re-evaluate mode based on saved settings.
    const s = loadSettings();
    setSettings(s);
    setMode(s.apiKey.trim() ? 'ai' : 'mock');
  };

  const handleSaveSettings = (s: OpenRouterSettings) => {
    setSettings(s);
    setMode(s.apiKey.trim() ? 'ai' : 'mock');
  };

  const handleClearProgress = () => {
    clearProgress();
    setRecentResults([]);
    setStreak(0);
  };

  const handleToggleSavedQuestion = (question: Question) => {
    setSavedQuestions(toggleSavedQuestion(question));
  };

  const bgClass = useMemo(
    () =>
      'min-h-screen bg-gradient-to-b from-slate-950 via-indigo-900 to-slate-950',
    [],
  );

  return (
    <div className={bgClass}>
      <TopBar mode={mode} onOpenSettings={() => setSettingsOpen(true)} />

      {screen === 'home' && (
        <HomeScreen
          subjects={subjects}
          selectedSubject={subject}
          selectedTopic={topic}
          questionCount={questionCount}
          setQuestionCount={setCount}
          onSelectSubject={handleSelectSubject}
          onSelectTopic={setTopic}
          onStart={handleStart}
          onRandomSprint={handleRandomSprint}
          savedQuestionCount={savedQuestions.length}
          incorrectQuestionCount={incorrectQuestions.length}
          onStartSaved={() => handleStartFromList(savedQuestions)}
          onStartIncorrect={() => handleStartFromList(incorrectQuestions)}
          recentResults={recentResults}
          streak={streak}
          onClearProgress={handleClearProgress}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          questions={questions}
          settings={settings}
          mode={mode}
          savedQuestionIds={savedQuestions.map((question) => question.id)}
          onFinish={handleFinish}
          onApiError={handleApiError}
          onToggleSavedQuestion={handleToggleSavedQuestion}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          score={result.score}
          total={result.total * 10}
          correct={result.correct}
          incorrect={result.incorrect}
          totalQuestions={result.total}
          timeUsed={result.timeUsed}
          subject={result.subject}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      {screen === 'error' && (
        <ErrorScreen message={error} onRestartLocal={handleRestartLocal} onHome={handleHome} />
      )}

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
