/**
 * Types pour les Outils de documents Sunubiblio
 * Vérification & Aide à l'écriture, Conversion Word -> PDF, Modification PDF, Mes Documents
 */

export type DocumentTypeTarget =
  | 'livre'
  | 'memoire'
  | 'these'
  | 'rapport'
  | 'article'
  | 'academique';

export interface DocumentTypeTargetInfo {
  id: DocumentTypeTarget;
  label: string;
  description: string;
  icon: string;
}

export type AIAssistanceLevel = 'faible' | 'moderee' | 'elevee' | 'indeterminee';

export interface AIPassageFlag {
  id: string;
  excerpt: string;
  locationLabel: string; // Ex: 'Paragraphe 3'
  charStart?: number;
  charEnd?: number;
  confidenceIndicator: 'Probabilité notable' | 'Indicateur moyen' | 'Style standardisé';
  whyFlagged: string;
  whatCanImprove: string;
  reformulationSuggestion: string;
  personalizationTips: string[];
}

export interface VerificationAlert {
  id: string;
  type: 'affirmation_non_sourcee' | 'repetition' | 'clarte' | 'formulation_generique' | 'structure';
  title: string;
  excerpt: string;
  explanation: string;
  suggestion: string;
}

export interface DocumentAnalysisReport {
  id: string;
  targetType: DocumentTypeTarget;
  analyzedAt: string;
  wordCount: number;
  readingTimeMinutes: number;
  globalQualityScore: number; // 0 à 100
  aiAssistanceIndicator: {
    level: AIAssistanceLevel;
    label: string;
    description: string;
    ethicalDisclaimer: string;
  };
  executiveSummary: string;
  structureAssessment: {
    detectedSections: string[];
    isCoherent: boolean;
    observations: string[];
  };
  strengths: string[];
  priorityImprovements: string[];
  flaggedPassages: AIPassageFlag[];
  stylisticAlerts: VerificationAlert[];
}

export type ProcessedDocType = 'verification' | 'word_to_pdf' | 'pdf_modified';

export interface UserProcessedDocument {
  id: string;
  name: string;
  originalName: string;
  type: ProcessedDocType;
  size: string;
  processedAt: string;
  status: 'ready' | 'processing' | 'failed';
  downloadToken: string;
  downloadUrl?: string;
  summary?: string;
  analysisReport?: DocumentAnalysisReport;
}

export interface PdfAnnotationItem {
  id: string;
  type: 'text' | 'highlight' | 'underline' | 'shape' | 'signature';
  pageNumber: number;
  content?: string;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface PdfPageState {
  pageNumber: number;
  rotation: 0 | 90 | 180 | 270;
  isDeleted: boolean;
}

export type DocumentToolsTab = 'verify' | 'convert' | 'pdf-edit' | 'my-documents';
