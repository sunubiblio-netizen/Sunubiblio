'use client';

import React, { useState } from 'react';
import { AIService } from '@/services/aiService';

interface AIExerciseHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  subject: string;
  chapter: string;
  hasAnswered: boolean;
  mode: 'hint' | 'explain';
}

export const AIExerciseHelpModal: React.FC<AIExerciseHelpModalProps> = ({
  isOpen,
  onClose,
  questionText,
  subject,
  chapter,
  hasAnswered,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const fetchHelp = async () => {
    setLoading(true);
    setResponse(null);

    const promptText = mode === 'hint'
      ? `Dans le cadre d'un entraînement sur ${subject} (${chapter}), donne-moi un indice pédagogique méthodologique court sans révéler directement la réponse pour la question suivante : "${questionText}".`
      : `Explique-moi les concepts clés et la démarche de réflexion pour la question suivante en ${subject} (${chapter}) : "${questionText}".`;

    try {
      const res = await AIService.processRequest({
        content: promptText,
        mode: mode === 'hint' ? 'expliquer' : 'assistant',
      });
      setResponse(res.content);
    } catch {
      setResponse("Désolé, l'assistant pédagogique n'a pas pu traiter la demande. Veuillez réessayer dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  // Charger automatiquement quand la modale s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      fetchHelp();
    } else {
      setResponse(null);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="ai-help-modal-backdrop" onClick={onClose}>
      <div
        className="ai-help-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ai-modal-header">
          <div className="ai-brand-badge">
            <div className="ai-spark-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span>Sunubiblio IA Pédagogique</span>
          </div>

          <button
            type="button"
            className="ai-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="ai-modal-body">
          <h3 className="ai-modal-title">
            {mode === 'hint' ? '💡 Indice Méthodologique' : '🧠 Explication Pédagogique'}
          </h3>

          <div className="ai-question-preview">
            <span className="preview-label">Question ciblée :</span>
            <p className="preview-text">« {questionText} »</p>
          </div>

          {loading ? (
            <div className="ai-loading-box">
              <div className="ai-spinner" />
              <p>L’IA analyse le contexte pédagogique de la question...</p>
            </div>
          ) : (
            <div className="ai-response-box">
              <div className="ai-response-content">
                {response ? (
                  <p style={{ whiteSpace: 'pre-line' }}>{response}</p>
                ) : (
                  <p>Aucune réponse reçue.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ai-modal-footer">
          <button
            type="button"
            className="btn-secondary ai-footer-btn"
            onClick={onClose}
          >
            Retour à l'exercice
          </button>
        </div>
      </div>
    </div>
  );
};
