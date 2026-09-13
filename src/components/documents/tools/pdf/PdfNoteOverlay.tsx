'use client';

import React, { useState } from 'react';
import { PdfCommentAnnotation } from './types';

interface PdfNoteOverlayProps {
  note: PdfCommentAnnotation;
  index: number;
  onUpdateContent: (id: string, newContent: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleOpen: (id: string) => void;
}

export const PdfNoteOverlay: React.FC<PdfNoteOverlayProps> = ({
  note,
  index,
  onUpdateContent,
  onDeleteNote,
  onToggleOpen,
}) => {
  const [editingText, setEditingText] = useState(note.content);
  const [isEditing, setIsEditing] = useState(!note.content);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingText.trim()) {
      onUpdateContent(note.id, editingText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`pdf-note-pin-wrapper ${note.isOpen ? 'is-open' : ''}`}
      style={{ left: `${note.xPercent}%`, top: `${note.yPercent}%` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pastille cliquable */}
      <button
        type="button"
        className="pdf-note-pin-btn"
        onClick={() => onToggleOpen(note.id)}
        title={`Note #${index + 1} par ${note.author}`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="pin-index">{index + 1}</span>
      </button>

      {/* Bulle / Popover de note contextuelle */}
      {note.isOpen && (
        <div className="pdf-note-popover" role="dialog" aria-label="Commentaire">
          <div className="note-popover-header">
            <div className="note-author-group">
              <span className="note-author-avatar">{note.author.charAt(0)}</span>
              <div>
                <span className="note-author-name">{note.author}</span>
                <span className="note-date">{note.createdAt}</span>
              </div>
            </div>
            <button
              type="button"
              className="note-close-btn"
              onClick={() => onToggleOpen(note.id)}
              title="Fermer la note"
            >
              ✕
            </button>
          </div>

          <div className="note-popover-body">
            {isEditing ? (
              <form onSubmit={handleSave}>
                <textarea
                  className="note-textarea"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="Écrivez votre commentaire ici..."
                  autoFocus
                  rows={3}
                />
                <div className="note-form-actions">
                  <button type="submit" className="note-save-btn">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className="note-cancel-btn"
                    onClick={() => {
                      if (!note.content) {
                        onDeleteNote(note.id);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="note-content-view">
                <p className="note-text">{note.content}</p>
                <div className="note-view-actions">
                  <button
                    type="button"
                    className="note-action-link"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier
                  </button>
                  <span className="action-sep">•</span>
                  <button
                    type="button"
                    className="note-action-link delete"
                    onClick={() => onDeleteNote(note.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
