export type AIMode = 
  | 'assistant' 
  | 'resumer' 
  | 'expliquer' 
  | 'qcm' 
  | 'exercices' 
  | 'corriger'
  | 'antiplagiat'
  // Aide à l'écriture & diagnostic éthique
  | 'memoire'
  | 'these'
  | 'rapport_stage'
  | 'article_scientifique'
  | 'manuscrit_livre'
  | 'autre_academique'
  // Suite Bureautique & Outils Documents
  | 'doc_pdf'
  | 'doc_word'
  | 'doc_excel'
  | 'doc_powerpoint';

export type AIAttachmentType = 'document' | 'image' | 'library' | 'text' | 'file';

export interface AIAttachment {
  id: string;
  type: AIAttachmentType;
  name: string;
  size?: string;
  url?: string;
  previewUrl?: string;
  contentSnippet?: string;
  libraryResourceId?: string;
  subject?: string;
  level?: string;
  status: 'ready' | 'uploading' | 'error';
  errorMessage?: string;
  description?: string;
  extractedText?: string;
  keyConcepts?: string[];
  pagesCount?: number;
}

export interface AIMessageSource {
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AIMode;
  attachments?: AIAttachment[];
  isWebSearch?: boolean;
  language?: string;
  sources?: AIMessageSource[];
  status?: 'sending' | 'thinking' | 'complete' | 'error';
  isDevPreview?: boolean;
}

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
  mode: AIMode;
}

export interface AIQuotaInfo {
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  maxFileSizeMB: number;
  supportedFormats: string[];
}
