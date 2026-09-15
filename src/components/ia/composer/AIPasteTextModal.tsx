'use client';

import React, { useState } from 'react';
import { AIAttachment } from '@/types/ai';

interface AIPasteTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddText: (attachment: AIAttachment) => void;
}

export const AIPasteTextModal: React.FC<AIPasteTextModalProps> = ({
  isOpen,
  onClose,
  onAddText,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const attachment: AIAttachment = {
      id: 'txt-' + Date.now(),
      type: 'text',
      name: title.trim() || 'Extrait de texte collé',
      contentSnippet: content.trim(),
      size: `${content.trim().length} caractères`,
      status: 'ready'
    };

    onAddText(attachment);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="paste-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="paste-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-icon-title">
            <div className="paste-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </div>
            <div>
              <h3 className="modal-title">Coller du texte pour l'IA</h3>
              <p className="modal-subtitle">Insérez vos notes, un paragraphe ou un énoncé d'exercice</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-close-modal" aria-label="Fermer la fenêtre">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="form-group">
            <label className="form-label">Titre ou référence (optionnel)</label>
            <input
              type="text"
              placeholder="Ex: Chapitre 3 — Électromagnétisme, Devoir Maison 2..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="form-group">
            <div className="label-with-count">
              <label className="form-label">Contenu textuel *</label>
              <span className="char-count">{content.length} caractères</span>
            </div>
            <textarea
              placeholder="Collez ici votre texte brut..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="text-area-input"
              required
              autoFocus
            />
          </div>

          <div className="modal-actions-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annuler
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="btn-submit-paste"
            >
              Attacher le texte
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .paste-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .paste-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 580px;
          border-radius: 24px;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.2);
          overflow: hidden;
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-icon-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .paste-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #faf5ff;
          color: #9333ea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .modal-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .btn-close-modal {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-body-form {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label-with-count {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .char-count {
          font-size: 11.5px;
          color: #94a3b8;
        }

        .title-input,
        .text-area-input {
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #0f172a;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .title-input:focus,
        .text-area-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .text-area-input {
          resize: vertical;
          line-height: 1.6;
        }

        .modal-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-cancel {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit-paste {
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-submit-paste:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
