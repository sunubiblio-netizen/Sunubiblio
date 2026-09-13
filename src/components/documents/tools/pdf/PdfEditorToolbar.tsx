'use client';

import React from 'react';
import { PdfActiveTool, HighlightColor, HIGHLIGHT_COLORS } from './types';

interface PdfEditorToolbarProps {
  activeTool: PdfActiveTool;
  selectedColor: HighlightColor;
  canUndo: boolean;
  canRedo: boolean;
  onSelectTool: (tool: PdfActiveTool) => void;
  onSelectColor: (color: HighlightColor) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAnnotations: () => void;
}

export const PdfEditorToolbar: React.FC<PdfEditorToolbarProps> = ({
  activeTool,
  selectedColor,
  canUndo,
  canRedo,
  onSelectTool,
  onSelectColor,
  onUndo,
  onRedo,
  onClearAnnotations,
}) => {
  return (
    <div className="pdf-pro-toolbar" role="toolbar" aria-label="Outils d'édition PDF">
      <div className="toolbar-tools-row">
        {/* 1. Sélection / Curseur */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'select' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('select')}
          title="Sélection & Lecture (Curseur classique)"
          aria-label="Sélection"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <span className="tool-name">Sélection</span>
        </button>

        {/* 2. Surligner */}
        <div className="pdf-tool-compound">
          <button
            type="button"
            className={`pdf-tool-btn ${activeTool === 'highlight' ? 'is-active' : ''}`}
            onClick={() => onSelectTool('highlight')}
            title="Surligner un passage (sélectionnez du texte)"
            aria-label="Surligner"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 11l-6 6v3h3l6-6" />
              <path d="M22 7l-3-3a2 2 0 0 0-2.83 0L10 10l6 6 6.17-6.17a2 2 0 0 0 0-2.83z" />
            </svg>
            <span className="tool-name">Surligner</span>
          </button>

          {/* Palette de couleurs pour surlignage */}
          {activeTool === 'highlight' && (
            <div className="pdf-color-palette" title="Couleur de surlignage">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-dot-btn ${selectedColor === c.id ? 'is-selected' : ''}`}
                  style={{ backgroundColor: c.dot }}
                  onClick={() => onSelectColor(c.id)}
                  title={`Surlignage : ${c.label}`}
                  aria-label={c.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Souligner */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'underline' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('underline')}
          title="Souligner une ligne"
          aria-label="Souligner"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 3v7a6 6 0 0 0 12 0V3" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
          <span className="tool-name">Souligner</span>
        </button>

        {/* 4. Barrer */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'strike' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('strike')}
          title="Barrer un passage"
          aria-label="Barrer"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
            <path d="M14 12a4 4 0 0 1 0 8H6" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
          <span className="tool-name">Barrer</span>
        </button>

        {/* 5. Texte libre */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'text' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('text')}
          title="Ajouter une zone de texte sur le document"
          aria-label="Ajouter du texte"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
          <span className="tool-name">Texte</span>
        </button>

        {/* 6. Commentaire / Note */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'comment' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('comment')}
          title="Déposer une note / commentaire contextuel"
          aria-label="Ajouter un commentaire"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="tool-name">Commentaire</span>
        </button>

        {/* 7. Dessiner */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'draw' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('draw')}
          title="Dessiner à main levée / Trait"
          aria-label="Dessiner"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span className="tool-name">Dessiner</span>
        </button>

        {/* 8. Forme / Encadré */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'shape' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('shape')}
          title="Ajouter un cadre / forme"
          aria-label="Forme"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
          <span className="tool-name">Forme</span>
        </button>

        {/* 9. Signature numérique */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'signature' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('signature')}
          title="Apposer un visa ou une signature certifiée"
          aria-label="Signature"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
            <line x1="16" y1="8" x2="2" y2="22" />
            <line x1="17.5" y1="15" x2="9" y2="15" />
          </svg>
          <span className="tool-name">Signature</span>
        </button>

        {/* Séparateur */}
        <div className="toolbar-separator" />

        {/* 10. Gomme / Supprimer annotation */}
        <button
          type="button"
          className={`pdf-tool-btn ${activeTool === 'eraser' ? 'is-active' : ''}`}
          onClick={() => onSelectTool('eraser')}
          title="Gomme (cliquez sur une annotation pour la retirer)"
          aria-label="Gomme"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M7 21h10" />
            <path d="M5.5 15.5l7-7a2.12 2.12 0 0 1 3 0l3 3a2.12 2.12 0 0 1 0 3l-7 7H6a2 2 0 0 1-2-2v-2.5a2 2 0 0 1 .5-1.5z" />
          </svg>
          <span className="tool-name">Gomme</span>
        </button>

        {/* 11. Undo / Redo */}
        <div className="pdf-history-actions">
          <button
            type="button"
            className="pdf-history-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="Annuler (Ctrl+Z)"
            aria-label="Annuler"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button
            type="button"
            className="pdf-history-btn"
            disabled={!canRedo}
            onClick={onRedo}
            title="Rétablir (Ctrl+Y)"
            aria-label="Rétablir"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Guide contextuel dynamique de l'outil actif */}
      <div className="pdf-tool-helper-hint">
        {activeTool === 'select' && <span>Mode lecture & sélection classique active.</span>}
        {activeTool === 'highlight' && (
          <span>Cliquez sur un paragraphe ou sélectionnez du texte pour appliquer le surlignage {selectedColor}.</span>
        )}
        {activeTool === 'underline' && <span>Cliquez sur une section pour appliquer un soulignement professionnel.</span>}
        {activeTool === 'strike' && <span>Cliquez sur un passage pour le barrer (révision de manuscrit).</span>}
        {activeTool === 'text' && <span>Cliquez sur la page pour placer une nouvelle boîte de texte personnalisée.</span>}
        {activeTool === 'comment' && <span>Cliquez n’importe où sur le document pour déposer une note révisable.</span>}
        {activeTool === 'draw' && <span>Outil stylet actif : tracez des annotations libres sur la page.</span>}
        {activeTool === 'shape' && <span>Cliquez sur la page pour insérer un encadré de validation.</span>}
        {activeTool === 'signature' && <span>Cliquez sur la page pour apposer le visa de certification Sunubiblio.</span>}
        {activeTool === 'eraser' && <span>Cliquez sur n’importe quelle annotation pour la supprimer.</span>}
      </div>
    </div>
  );
};
