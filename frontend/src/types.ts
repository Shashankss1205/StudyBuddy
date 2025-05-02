export interface PageResult {
  page_number: number;
  image: string;
  explanation: string;
  audio: string;
  audio_url: string;
  image_url: string;
}

export interface ProcessResponse {
  success: boolean;
  results: PageResult[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface ApiResponse {
  total_pages: number;
  pdf_name: string;
  pages: {
    page_number: number;
    image: string;
    explanation: string;
    audio: string;
    audio_url: string;
    image_url: string;
  }[];
}

export interface ExistingPDF {
  name: string;
  total_pages: number;
  date_processed: string;
  original_filename: string;
} 