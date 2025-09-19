
export enum Role {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  role: Role;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}
