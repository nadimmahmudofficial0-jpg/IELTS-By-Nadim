export interface DailyProgress {
  current: number;
  total: number;
}

export interface EssayAnalysisResult {
  band: string;
  feedback: string;
  corrected: string;
}

export interface VocabWord {
  word: string;
  type: string;
  meaning: string;
  bangla: string;
}

export interface MockQuestion {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface MockReadingTest {
  title: string;
  passage: string;
  questions: MockQuestion[];
}

export interface MockListeningTest {
  scenario: string;
  script: string;
  questions: MockQuestion[];
}

export interface MockSpeakingTest {
  questions: string[];
}

export interface SpeakingFeedback {
  band: string;
  fluency: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
}

export type TabType = 'home' | 'writing' | 'vocab' | 'profile' | 'mock' | 'about' | 'info';