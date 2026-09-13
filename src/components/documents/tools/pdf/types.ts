/**
 * Types pour le Studio / Éditeur PDF Moderne de Sunubiblio
 */

export type PdfActiveTool =
  | 'select'
  | 'text'
  | 'highlight'
  | 'underline'
  | 'strike'
  | 'comment'
  | 'draw'
  | 'shape'
  | 'signature'
  | 'eraser';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

export interface HighlightColorConfig {
  id: HighlightColor;
  label: string;
  bg: string;
  border: string;
  dot: string;
}

export const HIGHLIGHT_COLORS: HighlightColorConfig[] = [
  { id: 'yellow', label: 'Jaune classique', bg: 'rgba(254, 240, 138, 0.65)', border: '#facc15', dot: '#eab308' },
  { id: 'green', label: 'Vert menthe', bg: 'rgba(187, 247, 208, 0.65)', border: '#86efac', dot: '#22c55e' },
  { id: 'blue', label: 'Bleu pastel', bg: 'rgba(191, 219, 254, 0.65)', border: '#93c5fd', dot: '#3b82f6' },
  { id: 'pink', label: 'Rose doux', bg: 'rgba(251, 207, 232, 0.65)', border: '#f9a8d4', dot: '#ec4899' },
];

export interface PdfHighlightAnnotation {
  id: string;
  pageNumber: number;
  color: HighlightColor;
  targetParagraphId: string;
  createdAt: string;
}

export interface PdfCommentAnnotation {
  id: string;
  pageNumber: number;
  xPercent: number;
  yPercent: number;
  author: string;
  content: string;
  createdAt: string;
  isOpen: boolean;
}

export interface PdfTextAnnotation {
  id: string;
  pageNumber: number;
  xPercent: number;
  yPercent: number;
  content: string;
  color: string;
  fontSize: number;
  isEditing: boolean;
}

export interface PdfSignatureAnnotation {
  id: string;
  pageNumber: number;
  xPercent: number;
  yPercent: number;
  signerName: string;
  dateStr: string;
  signatureId: string;
}

export interface PdfPageModel {
  pageNumber: number;
  title: string;
  rotation: 0 | 90 | 180 | 270;
  isDeleted: boolean;
  contentParagraphs: {
    id: string;
    type: 'h1' | 'h2' | 'p' | 'quote' | 'table';
    text: string;
  }[];
}
