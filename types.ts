export interface UserState {
  name: string;
  xp: number;
  completedLessons: string[];
  profilePicture?: string;
}

export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  HOME = 'HOME',
  LEARN = 'LEARN',
  MENTOR = 'MENTOR',
  TOOLS = 'TOOLS',
  BOOKS = 'BOOKS'
}

export interface LessonSection {
  title: string;
  content: string;
}

export interface Lesson {
  id: string;
  topic: string;
  title: string;
  duration: string; // e.g., "5 min read"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sections: LessonSection[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ToolTemplate {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  inputs: { label: string; key: string; placeholder: string }[];
}

export interface GeneratedToolResult {
  markdown: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  color: string; // CSS gradient or color class
}