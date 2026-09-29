'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { CreateDiscussionInput } from '@/types/community';

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDiscussionInput) => void;
}

export const NewDiscussionModal: React.FC<NewDiscussionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  useLockBodyScroll(isOpen);
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Veuillez indiquer un titre clair pour votre discussion.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Veuillez détailler votre question ou le sujet du débat.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['Discussion', 'Entraide'],
    });

    onClose();
  };

  return createPortal(
    <div
      className="communaute-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-disc-title"
    >
      {/* Cadre lumineux dynamique sur les 4 côtés DE TOUT L'ÉCRAN / VIEWPORT */}
      <div className="sunu-edge-top" aria-hidden="true">
        <div className="sunu-edge-beam-top" />
      </div>
      <div className="sunu-edge-right" aria-hidden="true">
        <div className="sunu-edge-beam-right" />
      </div>
      <div className="sunu-edge-bottom" aria-hidden="true">
        <div className="sunu-edge-beam-bottom" />
      </div>
      <div className="sunu-edge-left" aria-hidden="true">
        <div className="sunu-edge-beam-left" />
      </div>

      <div className="communaute-modal-panel">
        <div className="communaute-modal-header">
          <h3 id="new-disc-title" className="communaute-modal-title">
            Ouvrir une discussion ou un débat
          </h3>
          <button
            type="button"
            className="communaute-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="communaute-modal-body">
          {errorMsg && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="communaute-form-group">
            <label className="communaute-form-label">Titre de la discussion *</label>
            <input
              type="text"
              placeholder="Ex: Quelle méthode adopter pour l’épreuve de résumé de texte FASTEF ?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMsg('');
              }}
              className="communaute-form-input"
              required
            />
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Développement du sujet *</label>
            <textarea
              placeholder="Détaillez vos interrogations, les difficultés rencontrées ou votre proposition..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="communaute-form-textarea"
              style={{ minHeight: '110px' }}
              required
            />
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Mots-clés / Tags (séparés par des virgules)</label>
            <input
              type="text"
              placeholder="Ex: FASTEF, Méthodologie, Concours, Dissertation"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="communaute-form-input"
            />
          </div>

          <div className="communaute-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn-modal-submit"
            >
              Publier la discussion
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
