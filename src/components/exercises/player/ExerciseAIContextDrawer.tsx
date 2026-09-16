'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  testTitle?: string;
  resourceTitle?: string;
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

interface AttachedItem {
  id: string;
  type: 'image' | 'document' | 'resource';
  name: string;
  size?: string;
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
  testTitle,
  resourceTitle,
  competitionName,
  levelLabel,
  isAIAvailable = true,
}) => {
  // Liste des messages
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  
  // Menu pièces jointes "+"
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedItems, setAttachedItems] = useState<AttachedItem[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // 1. Initialiser ou actualiser automatiquement le contexte quand la question change
  useEffect(() => {
    const welcomeContent = `Bonjour 👋 Je suis votre **tuteur IA Sunubiblio**.\n\nJe suis connecté à votre session d'entraînement :\n• **Matière :** ${subject}\n• **Chapitre :** ${chapter || 'Général'}${competitionName ? `\n• **Concours :** ${competitionName}` : ''}${testTitle ? `\n• **Épreuve :** ${testTitle}` : ''}\n\nJe suis prêt pour la **Question ${questionNumber} sur ${totalQuestions}**. Que souhaitez-vous approfondir ?`;

    setMessages([
      {
        id: `msg-welcome-q${questionNumber}`,
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setHasError(null);
  }, [questionNumber, questionText, subject, chapter, competitionName, testTitle, totalQuestions]);

  // 2. Empêcher le scroll d'arrière-plan du body lors de l'ouverture du drawer
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

  // 3. Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 4. Scroll automatique vers le dernier message UNIQUEMENT dans la boîte de conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isOpen, isLoading]);

  // 5. Redimensionnement automatique de la zone de texte (textarea)
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

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

  // Gestion des pièces jointes
  const handleAttachImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    setAttachedItems((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        type: 'image',
        name: file.name,
        size: `${sizeKb} Ko`,
      },
    ]);
    setShowAttachmentMenu(false);
  };

  const handleAttachDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    setAttachedItems((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        type: 'document',
        name: file.name,
        size: `${sizeKb} Ko`,
      },
    ]);
    setShowAttachmentMenu(false);
  };

  const handleAttachResource = () => {
    if (!resourceTitle) return;
    setAttachedItems((prev) => {
      if (prev.some((item) => item.type === 'resource')) return prev;
      return [
        ...prev,
        {
          id: `res-${Date.now()}`,
          type: 'resource',
          name: resourceTitle,
        },
      ];
    });
    setShowAttachmentMenu(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Envoi de message avec contexte sécurisé
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setHasError(null);
    setShowAttachmentMenu(false);

    // Contexte enrichi avec les pièces jointes
    const attachmentsSummary = attachedItems.length > 0
      ? `\n[Pièces jointes analysées : ${attachedItems.map((a) => `${a.name} (${a.type})`).join(', ')}]`
      : '';

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `${text}${attachmentsSummary}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttachedItems([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      // 1. Appel API sécurisé côté serveur
      const res = await fetch('/api/ai/exercise-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          questionId,
          questionNumber,
          prompt: `${text}${attachmentsSummary}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors du traitement de votre demande.');
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
      // Fallback local via AIService si connexion locale perturbée
      try {
        const enriched = `[Contexte : ${subject} | ${chapter || 'Général'} | Q.${questionNumber} : "${questionText}"]\n${text}${attachmentsSummary}`;
        const fallbackMsg = await AIService.processRequest({
          content: enriched,
          mode: 'assistant',
        });
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch {
        setHasError(err.message || 'Impossible de joindre le tuteur IA.');
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ ${err.message || 'Le service IA pédagogique est temporairement indisponible. Veuillez réessayer.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
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
        {/* =========================================================
            ZONE 1 : HEADER FIXE EN HAUT
            ========================================================= */}
        <div className="ai-drawer-top-section">
          {/* Poignée tactile mobile */}
          <div className="sheet-handle-bar" onClick={onClose} aria-hidden="true" />

          {/* En-tête de marque */}
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

          {/* Récépissé contextuel de la question active */}
          <div className="ai-drawer-question-box">
            <div className="drawer-question-label">
              <span>Question {questionNumber} sur {totalQuestions}</span>
              {competitionName && <span className="drawer-contest-tag">{competitionName}</span>}
            </div>
            <p className="drawer-question-snippet" title={questionText}>
              « {questionText} »
            </p>
          </div>
        </div>

        {/* =========================================================
            ZONE 2 : CONVERSATION SCROLLABLE (AU CENTRE)
            ========================================================= */}
        <div className="ai-drawer-messages-area" role="log" aria-live="polite">
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
            <div className="ai-drawer-bubble bubble-ai is-typing" aria-label="Chargement de la réponse">
              <div className="ai-typing-indicator" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="typing-text">L'IA Sunubiblio analyse la question...</span>
            </div>
          )}

          {hasError && (
            <div className="ai-error-banner" role="alert">
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

        {/* =========================================================
            ZONE 3 : SUGGESTIONS + BARRE DE SAISIE FIXE EN BAS
            ========================================================= */}
        <div className="ai-drawer-bottom-section">
          {/* Actions rapides contextuelles (Scroll horizontal au pouce) */}
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

          {/* Badges des pièces jointes sélectionnées */}
          {attachedItems.length > 0 && (
            <div className="ai-attachments-pill-list">
              {attachedItems.map((item) => (
                <div key={item.id} className="attachment-chip-item">
                  <span className="attachment-chip-icon">
                    {item.type === 'image' && '📷'}
                    {item.type === 'document' && '📄'}
                    {item.type === 'resource' && '📚'}
                  </span>
                  <span className="attachment-chip-name">{item.name}</span>
                  {item.size && <span className="attachment-chip-size">({item.size})</span>}
                  <button
                    type="button"
                    className="attachment-chip-remove"
                    onClick={() => handleRemoveAttachment(item.id)}
                    aria-label="Supprimer la pièce jointe"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Menu popover des pièces jointes (+) */}
          {showAttachmentMenu && (
            <div className="composer-attachments-popover" role="menu">
              <div className="popover-title">Joindre un document pédagogique :</div>
              
              <button
                type="button"
                role="menuitem"
                className="attachment-menu-btn"
                onClick={() => imageInputRef.current?.click()}
              >
                <span className="menu-btn-icon">📷</span>
                <div className="menu-btn-texts">
                  <strong>Photo / Schéma de la question</strong>
                  <small>Formats : PNG, JPG, WebP</small>
                </div>
              </button>

              <button
                type="button"
                role="menuitem"
                className="attachment-menu-btn"
                onClick={() => docInputRef.current?.click()}
              >
                <span className="menu-btn-icon">📄</span>
                <div className="menu-btn-texts">
                  <strong>Document de travail / Annale</strong>
                  <small>Formats : PDF, DOCX, TXT</small>
                </div>
              </button>

              {resourceTitle && (
                <button
                  type="button"
                  role="menuitem"
                  className="attachment-menu-btn"
                  onClick={handleAttachResource}
                >
                  <span className="menu-btn-icon">📚</span>
                  <div className="menu-btn-texts">
                    <strong>Ressource du cours Sunubiblio</strong>
                    <small>« {resourceTitle} »</small>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Inputs cachés de téléchargement */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAttachImage}
          />
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            onChange={handleAttachDocument}
          />

          {/* VRAIE BARRE DE SAISIE MODERNE (Toujours visible en bas) */}
          <div className="ai-drawer-composer">
            <div className="composer-input-pill">
              <button
                type="button"
                className={`composer-plus-btn ${showAttachmentMenu ? 'is-active' : ''}`}
                title="Joindre une pièce ou ressource Sunubiblio"
                aria-label="Options et pièces jointes"
                aria-expanded={showAttachmentMenu}
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
              >
                +
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez à l’IA Sunubiblio..."
                className="composer-textarea"
                disabled={isLoading}
                aria-label="Écrivez à l’IA"
              />

              <button
                type="button"
                className={`composer-send-btn ${inputText.trim() ? 'has-content' : ''}`}
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                aria-label="Envoyer le message"
                title="Envoyer (Entrée)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
