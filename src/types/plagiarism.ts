export type PlagiarismAnalysisStep = 
  | 'idle' 
  | 'reading' 
  | 'extracting' 
  | 'comparing' 
  | 'matching' 
  | 'generating_report' 
  | 'completed' 
  | 'error';

export type SimilarityLevel = 'faible' | 'modere' | 'eleve';

export interface SimilarSource {
  id: string;
  title: string;
  author?: string;
  institution?: string;
  url?: string;
  type: 'sunubiblio_library' | 'academic_archive' | 'institutional_document';
  resourceId?: string;
  category?: string;
}

export interface SimilarPassage {
  id: string;
  userText: string;
  matchedText: string;
  similarityScore: number;
  source: SimilarSource;
  isCitation?: boolean;
  pageNumber?: number;
  advice?: string;
}

export interface PlagiarismReport {
  id: string;
  documentName: string;
  fileSize: string;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  analyzedAt: string;
  similarityScore: number; // 0 to 100
  similarityLevel: SimilarityLevel;
  passagesCount: number;
  passages: SimilarPassage[];
  sourcesCount: number;
  sources: SimilarSource[];
  disclaimer: string;
  academicAdvice: string[];
}

export interface PlagiarismHistoryItem {
  id: string;
  documentName: string;
  similarityScore: number;
  similarityLevel: SimilarityLevel;
  date: string;
  fileSize: string;
  reportId: string;
}

export interface PlagiarismQuota {
  used: number;
  limit: number;
  planName: string;
  maxPagesPerDoc: number;
  maxFileSizeMB: number;
}
