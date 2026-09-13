/**
 * Types pour le module « Documents utiles » de Sunubiblio
 * Architecture prête pour PostgreSQL / Supabase
 */

export type DocumentCategory =
  | 'all'
  | 'administratifs'
  | 'guides'
  | 'formulaires'
  | 'textes-officiels'
  | 'scolaires'
  | 'professionnels'
  | 'modeles'
  | 'autres';

export interface DocumentCategoryInfo {
  id: DocumentCategory;
  label: string;
  description: string;
  iconName: string;
}

export type DocumentFormat = 'PDF' | 'DOCX' | 'XLSX' | 'Autre';

export type DocumentAccessLevel = 'free' | 'premium';

export interface UsefulDocument {
  id: string;
  title: string;
  description: string;
  category: Exclude<DocumentCategory, 'all'>;
  type: string; // Ex: 'Modèle de lettre', 'Guide méthodologique', 'Texte de loi', 'Formulaire officiel'
  format: DocumentFormat;
  year: number;
  fileSize?: string; // Ex: '185 Ko', '1.4 Mo'
  pageCount?: number;
  accessLevel: DocumentAccessLevel;
  issuer?: string; // Ex: 'Ministère de l'Éducation', 'Sunubiblio Pédagogie', 'Direction des Bourses'
  downloadsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  tags: string[];
  summaryOutline?: string[]; // Sections clés du document
  usageAdvice?: string; // Conseil pratique d'utilisation
}

export interface DocumentFilterState {
  searchQuery: string;
  category: DocumentCategory;
  format: DocumentFormat | 'all';
  year: number | 'all';
  accessLevel: DocumentAccessLevel | 'all';
  sortBy: 'pertinence' | 'recent' | 'downloads' | 'title';
  page: number;
  perPage: number;
}
