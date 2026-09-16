'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/aiService';
import { AIMessage } from '@/types/ai';

interface ExerciseAIContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId?: string;
  questionId?: string;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  subject: string;
  chapter: string;
  competitionName?: string;
  levelLabel?: string;
  isAIAvailable?: boolean;
}

interface QuickPromptAction {
  id: string;
  icon: string;
  label: string;
  prompt: string;
}

export const ExerciseAIContextDrawer: React.FC<ExerciseAIContextDrawerProps> = ({
  isOpen,
  onClose,
  exerciseId,
  questionId,
  questionText,
  questionNumber,
  totalQuestions,
  subject,
  chapter,
  competitionName,
  levelLabel,
  isAIAvailable = true,
}) => {
  // Liste des messages du dialogue
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [showHelperMenu, setShowHelperMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mettre à jour automatiquement le message d'accueil contextuel lorsque la question change
  useEffect(() => {
    setMessages([
      {
        id: `msg-welcome-q${questionNumber}`,
        role: 'assistant',
        content: `Bonjour 👋 Je suis l'assistant pédagogique Sunubiblio.\n\nJe suis connecté à votre session d'entraînement en **${subject}** (${chapter || 'Général'}${competitionName ? ` • ${competitionName}` : ''}).\n\nQue souhaitez-vous approfondir sur la **Question ${questionNumber}** ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setHasError(null);
  }, [questionNumber, questionText, subject, chapter, competitionName]);

  // Empêcher le scroll d'arrière-plan sur mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Défilement automatique vers le dernier message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Actions pédagogiques rapides contextuelles
  const quickActions: QuickPromptAction[] = [
    {
      id: 'explain-question',
      icon: '💡',
      label: 'Expliquer la question',
      prompt: `Peux-tu m'expliquer clairement ce qui est demandé dans cette question : "${questionText}" ?`,
    },
    {
      id: 'give-hint',
      icon: '🧠',
      label: 'Donne-moi un indice',
      prompt: `Donne-moi un indice méthodologique sans me donner directement la réponse pour : "${questionText}".`,
    },
    {
      id: 'explain-concept',
      icon: '📚',
      label: 'Expliquer la notion',
      prompt: `Quelle est la notion ou règle de cours fondamentale testée ici dans le chapitre ${chapter || subject} ?`,
    },
    {
      id: 'similar-problem',
      icon: '📝',
      label: 'Exercice similaire',
      prompt: `Propose-moi un petit exemple ou exercice similaire d'entraînement basé sur la même règle.`,
    },
    {
      id: 'review-advice',
      icon: '📖',
      label: 'Que dois-je revoir ?',
      prompt: `Quels points clés du programme dois-je réviser pour maîtriser ce type d'exercice en ${subject} ?`,
    },
  ];

  // Envoi de message avec contrôle serveur
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setHasError(null);
    setShowHelperMenu(false);

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Appel vers la route sécurisée côté serveur
      const res = await fetch('/api/ai/exercise-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          questionId,
          questionNumber,
          prompt: text,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error(errorData.error || "L'assistant IA est désactivé pour cette épreuve.");
        }
        throw new Error(errorData.error || 'Erreur lors du traitement.');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: data.id || `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      // Fallback local vers AIService si le serveur Next.js n'a pas encore recompilé ou hors-ligne
      try {
        const enrichedContent = `[Contexte : ${subject} | ${chapter || 'Général'} | Q.${questionNumber} : "${questionText}"]\n${text}`;
        const fallbackMsg = await AIService.processRequest({
          content: enrichedContent,
          mode: 'assistant',
        });
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch {
        setHasError(err.message || 'Impossible de joindre le tuteur IA Sunubiblio.');
        const errorMessage: AIMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${err.message || 'Le service IA pédagogique est momentanément indisponible. Veuillez réessayer.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInsertTemplate = (template: string) => {
    setInputText((prev) => (prev ? `${prev} ${template}` : template));
    setShowHelperMenu(false);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-ai-drawer-backdrop" onClick={onClose} role="presentation">
      <div
        className="mobile-ai-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Assistant IA Sunubiblio"
      >
        {/* Poignée de manipulation mobile */}
        <div className="sheet-handle-bar" onClick={onClose} aria-hidden="true" />

        {/* En-tête de l'assistant IA */}
        <div className="ai-drawer-header">
          <div className="ai-drawer-identity">
            <div className="ai-drawer-avatar" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
                <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
              </svg>
            </div>
            <div className="ai-drawer-titles">
              <div className="ai-drawer-title-row">
                <h3 className="ai-drawer-name">IA Sunubiblio</h3>
                <span className="ai-coach-pill">Tuteur Pédagogique</span>
              </div>
              <span className="ai-drawer-context-pill">
                Q.{questionNumber}/{totalQuestions} • {subject}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="ai-drawer-close-btn"
            onClick={onClose}
            aria-label="Fermer l'assistant IA"
            title="Fermer (Échap)"
          >
            ✕
          </button>
        </div>

        {/* Aperçu compact de la question active */}
        <div className="ai-drawer-question-box">
          <div className="drawer-question-label">
            <span>Question {questionNumber} sur {totalQuestions}</span>
            {competitionName && <span className="drawer-contest-tag">{competitionName}</span>}
          </div>
          <p className="drawer-question-snippet" title={questionText}>
            « {questionText} »
          </p>
        </div>

        {/* Zone de discussion */}
        <div className="ai-drawer-messages-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-drawer-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
            >
              <div className="bubble-content">
                <p style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
              </div>
              <span className="bubble-time">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="ai-drawer-bubble bubble-ai is-typing">
              <div className="ai-typing-indicator" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="typing-text">L'IA Sunubiblio analyse la question...</span>
            </div>
          )}

          {hasError && (
            <div className="ai-error-banner">
              <span>{hasError}</span>
              <button
                type="button"
                className="ai-retry-btn"
                onClick={() => handleSendMessage("Explique-moi cette question")}
              >
                Réessayer
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions d'actions rapides (Scroll fluide horizontal au pouce) */}
        <div className="ai-drawer-quick-actions" aria-label="Suggestions d'actions rapides">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="quick-action-chip"
              onClick={() => handleSendMessage(action.prompt)}
              disabled={isLoading}
            >
              <span className="chip-icon" aria-hidden="true">{action.icon}</span>
              <span className="chip-text">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Menu d'aide rapide du bouton "+" */}
        {showHelperMenu && (
          <div className="composer-helper-dropdown">
            <div className="helper-dropdown-title">Insérer un élément de réflexion :</div>
            <button
              type="button"
              className="helper-option-btn"
              onClick={() => handleInsertTemplate("Quelle règle de cours doit-on appliquer ici ?")}
            >
              📚 Règle de cours fondamentale
            </button>
            <button
              type="button"
              className="helper-option-btn"
              onClick={() => handleInsertTemplate("Quels sont les pièges fréquents dans ce type d'exercice ?")}
            >
              ⚠️ Piège fréquent des candidats
            </button>
            <button
              type="button"
              className="helper-option-btn"
              onClick={() => handleInsertTemplate("Comment éliminer les options manifestement fausses ?")}
            >
              🧭 Méthode d'élimination logique
            </button>
          </div>
        )}

        {/* Barre de saisie moderne */}
        <div className="ai-drawer-composer">
          <div className="composer-input-pill">
            <button
              type="button"
              className={`composer-plus-btn ${showHelperMenu ? 'is-active' : ''}`}
              title="Ajouter une piste d'analyse"
              aria-label="Options d'assistance"
              onClick={() => setShowHelperMenu((prev) => !prev)}
            >
              +
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire à l'IA Sunubiblio..."
              className="composer-textarea"
              disabled={isLoading}
              aria-label="Poser une question à l'assistant IA"
            />

            <button
              type="button"
              className={`composer-send-btn ${inputText.trim() ? 'has-content' : ''}`}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              aria-label="Envoyer le message"
              title="Envoyer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
