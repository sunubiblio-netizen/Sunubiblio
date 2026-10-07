export type AIMode = 
  | 'assistant' 
  | 'resumer' 
  | 'expliquer' 
  | 'qcm' 
  | 'exercices' 
  | 'corriger'
  | 'antiplagiat';

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
