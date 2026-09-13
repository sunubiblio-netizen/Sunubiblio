export type ContactCategory =
  | 'Question générale'
  | 'Compte'
  | 'Bibliothèque'
  | 'Concours'
  | 'Abonnement'
  | 'Paiement'
  | 'Problème technique'
  | 'Suggestion'
  | 'Partenariat'
  | 'Autre';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: ContactCategory;
  message: string;
  honeypot?: string; // Anti-spam field (hidden from human users)
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  messageId?: string;
}

export interface ContactFAQItem {
  id: string;
  question: string;
  answer: string;
}

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved' | 'spam';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: ContactCategory;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt?: string;
}
