'use client';

import React, { useRef } from 'react';
import {
  PdfPageModel,
  PdfActiveTool,
  HighlightColor,
  HIGHLIGHT_COLORS,
  PdfHighlightAnnotation,
  PdfCommentAnnotation,
  PdfTextAnnotation,
  PdfSignatureAnnotation,
} from './types';
import { PdfNoteOverlay } from './PdfNoteOverlay';
import { PdfFloatingTextOverlay } from './PdfFloatingTextOverlay';

interface PdfDocumentCanvasProps {
  page: PdfPageModel;
  totalPages: number;
  zoomLevel: number;
  activeTool: PdfActiveTool;
  selectedColor: HighlightColor;
  highlights: PdfHighlightAnnotation[];
  comments: PdfCommentAnnotation[];
  texts: PdfTextAnnotation[];
  signatures: PdfSignatureAnnotation[];
  underlines: string[]; // paragraph IDs
  strikethroughs: string[]; // paragraph IDs
  onToggleHighlightParagraph: (paragraphId: string, color: HighlightColor) => void;
  onUpdateHighlightColor: (id: string, color: HighlightColor) => void;
  onDeleteHighlight: (id: string) => void;
  onToggleUnderline: (paragraphId: string) => void;
  onToggleStrike: (paragraphId: string) => void;
  onAddComment: (xPercent: number, yPercent: number) => void;
  onUpdateComment: (id: string, content: string) => void;
  onDeleteComment: (id: string) => void;
  onToggleCommentOpen: (id: string) => void;
  onAddText: (xPercent: number, yPercent: number) => void;
  onUpdateText: (id: string, content: string) => void;
  onDeleteText: (id: string) => void;
  onAddSignature: (xPercent: number, yPercent: number) => void;
  onDeleteSignature: (id: string) => void;
}

export const PdfDocumentCanvas: React.FC<PdfDocumentCanvasProps> = ({
  page,
  totalPages,
  zoomLevel,
  activeTool,
  selectedColor,
  highlights,
  comments,
  texts,
  signatures,
  underlines,
  strikethroughs,
  onToggleHighlightParagraph,
  onUpdateHighlightColor,
  onDeleteHighlight,
  onToggleUnderline,
  onToggleStrike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onToggleCommentOpen,
  onAddText,
  onUpdateText,
  onDeleteText,
  onAddSignature,
  onDeleteSignature,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Gérer les clics sur la feuille pour les outils qui créent des éléments à une coordonnée
  const handleSheetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sheetRef.current) return;

    const rect = sheetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = Math.max(5, Math.min(90, Math.round((x / rect.width) * 100)));
    const yPercent = Math.max(5, Math.min(90, Math.round((y / rect.height) * 100)));

    if (activeTool === 'comment') {
      onAddComment(xPercent, yPercent);
    } else if (activeTool === 'text') {
      onAddText(xPercent, yPercent);
    } else if (activeTool === 'signature') {
      onAddSignature(xPercent, yPercent);
    }
  };

  // Gérer le clic sur un paragraphe de texte
  const handleParagraphClick = (pId: string, e: React.MouseEvent) => {
    if (activeTool === 'highlight') {
      e.stopPropagation();
      onToggleHighlightParagraph(pId, selectedColor);
    } else if (activeTool === 'underline') {
      e.stopPropagation();
      onToggleUnderline(pId);
    } else if (activeTool === 'strike') {
      e.stopPropagation();
      onToggleStrike(pId);
    }
  };

  // Filtrer les annotations pour la page courante
  const pageHighlights = highlights.filter((h) => h.pageNumber === page.pageNumber);
  const pageComments = comments.filter((c) => c.pageNumber === page.pageNumber);
  const pageTexts = texts.filter((t) => t.pageNumber === page.pageNumber);
  const pageSignatures = signatures.filter((s) => s.pageNumber === page.pageNumber);

  return (
    <div className="pdf-pro-canvas-container">
      {/* Feuille A4 réaliste avec zoom CSS */}
      <div
        className="pdf-sheet-scaler-wrap"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          ref={sheetRef}
          className={`pdf-a4-sheet ${activeTool !== 'select' ? `cursor-mode-${activeTool}` : ''}`}
          onClick={handleSheetClick}
          style={{ transform: `rotate(${page.rotation}deg)` }}
        >
          {/* Filigrane d'authentification académique */}
          <div className="pdf-sheet-watermark" aria-hidden="true">
            SUNUBIBLIO CERTIFIED
          </div>

          {/* En-tête officiel du document */}
          <header className="pdf-sheet-header">
            <div className="sheet-header-left">
              <span className="sheet-republique">RÉPUBLIQUE DU SÉNÉGAL</span>
              <span className="sheet-ministere">Ministère de l’Enseignement Supérieur, de la Recherche et de l’Innovation</span>
            </div>
            <div className="sheet-header-right">
              <div className="sheet-seal-badge">
                <span>DOCUMENT OFFICIEL</span>
                <strong>REF-SNB-2026</strong>
              </div>
            </div>
          </header>

          {/* Corps principal du document */}
          <main className="pdf-sheet-content">
            {page.contentParagraphs.map((item) => {
              const highlight = pageHighlights.find((h) => h.targetParagraphId === item.id);
              const isUnderlined = underlines.includes(item.id);
              const isStriked = strikethroughs.includes(item.id);

              const colorConfig = highlight
                ? HIGHLIGHT_COLORS.find((c) => c.id === highlight.color) || HIGHLIGHT_COLORS[0]
                : null;

              const paragraphClasses = [
                'pdf-paragraph-node',
                item.type,
                highlight ? 'has-highlight' : '',
                isUnderlined ? 'has-underline' : '',
                isStriked ? 'has-strike' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={item.id}
                  className="pdf-paragraph-wrapper"
                  onClick={(e) => handleParagraphClick(item.id, e)}
                >
                  {/* Le texte du document */}
                  {item.type === 'h1' && (
                    <h1 className={paragraphClasses}>{item.text}</h1>
                  )}
                  {item.type === 'h2' && (
                    <h2 className={paragraphClasses}>{item.text}</h2>
                  )}
                  {item.type === 'quote' && (
                    <blockquote className={paragraphClasses}>{item.text}</blockquote>
                  )}
                  {item.type === 'p' && (
                    <p className={paragraphClasses}>{item.text}</p>
                  )}

                  {/* Calque de surlignage superposé interactif */}
                  {highlight && colorConfig && (
                    <div
                      className="pdf-highlight-overlay"
                      style={{
                        backgroundColor: colorConfig.bg,
                        borderBottom: `2px solid ${colorConfig.border}`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Menu contextuel au survol du surlignage */}
                      <div className="highlight-action-pill">
                        <span className="pill-title">Surligné</span>
                        <div className="pill-colors">
                          {HIGHLIGHT_COLORS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className={`pill-color-dot ${c.id === highlight.color ? 'selected' : ''}`}
                              style={{ backgroundColor: c.dot }}
                              onClick={() => onUpdateHighlightColor(highlight.id, c.id)}
                              title={c.label}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          className="pill-delete-btn"
                          onClick={() => onDeleteHighlight(highlight.id)}
                          title="Supprimer ce surlignage"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </main>

          {/* Calques superposés : Notes & Commentaires flottants */}
          {pageComments.map((comment, idx) => (
            <PdfNoteOverlay
              key={comment.id}
              note={comment}
              index={idx}
              onUpdateContent={onUpdateComment}
              onDeleteNote={onDeleteComment}
              onToggleOpen={onToggleCommentOpen}
            />
          ))}

          {/* Calques superposés : Boîtes de texte libre */}
          {pageTexts.map((txt) => (
            <PdfFloatingTextOverlay
              key={txt.id}
              annotation={txt}
              onUpdateText={onUpdateText}
              onDeleteText={onDeleteText}
            />
          ))}

          {/* Calques superposés : Signatures & Visas certifiés */}
          {pageSignatures.map((sig) => (
            <div
              key={sig.id}
              className="pdf-signature-stamp-overlay"
              style={{ left: `${sig.xPercent}%`, top: `${sig.yPercent}%` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sig-stamp-inner">
                <div className="sig-stamp-seal">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="sig-stamp-details">
                  <span className="sig-stamp-title">VISA NUMÉRIQUE CERTIFIÉ</span>
                  <span className="sig-stamp-name">{sig.signerName}</span>
                  <span className="sig-stamp-date">{sig.dateStr}</span>
                  <span className="sig-stamp-id">ID: {sig.signatureId}</span>
                </div>
                <button
                  type="button"
                  className="sig-delete-btn"
                  onClick={() => onDeleteSignature(sig.id)}
                  title="Retirer ce visa"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Pied de page du document */}
          <footer className="pdf-sheet-footer">
            <span className="footer-left">Plateforme Numérique Universelle Sunubiblio</span>
            <span className="footer-center">CONFIDENTIEL • USAGE ACADÉMIQUE</span>
            <span className="footer-right">
              Page {page.pageNumber} sur {totalPages}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
};
