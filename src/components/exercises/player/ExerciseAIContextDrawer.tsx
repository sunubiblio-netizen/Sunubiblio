'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '@/services/aiService';
import { AIMessage } from '@/types/ai';

interface ExerciseAIContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  subject: string;
  chapter: string;
  competitionName?: string;
  levelLabel?: string;
  isExamStrict?: boolean;
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
  questionText,
  questionNumber,
  totalQuestions,
  subject,
  chapter,
  competitionName,
  levelLabel,
  isExamStrict = false,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Bonjour 👋 Je suis l'assistant pédagogique Sunubiblio.\n\nJe suis connecté à votre session de test en **${subject}** (${chapter || 'Général'}${competitionName ? ` • ${competitionName}` : ''}).\n\nQue souhaitez-vous approfondir sur la **Question ${questionNumber}** ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Empêcher le scroll arrière sur mobile
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

  // Scroll au dernier message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Actions d'aide rapide pédagogiques contextualisées
  const quickActions: QuickPromptAction[] = [
    {
      id: 'explain-question',
      icon: '💡',
      label: 'Expliquer la question',
      prompt: `Peux-tu m'expliquer clairement ce qui est demandé dans cette question : "${questionText}" ?`,
    },
    {
      id: 'explain-concept',
      icon: '📚',
      label: 'Expliquer la notion',
      prompt: `Quelle est la notion ou règle de cours fondamentale testée ici dans le chapitre ${chapter || subject} ?`,
    },
    {
      id: 'give-hint',
      icon: '🧠',
      label: 'Donne-moi un indice',
      prompt: `Donne-moi un indice méthodologique sans me donner directement la réponse pour : "${questionText}".`,
    },
    {
      id: 'simplify',
      icon: '✍️',
      label: 'Explique-moi simplement',
      prompt: `Explique-moi la question avec des mots simples et une analogie facile à retenir : "${questionText}".`,
    },
    {
      id: 'review-advice',
      icon: '📖',
      label: 'Que dois-je revoir ?',
      prompt: `Quels points clés du programme dois-je réviser pour maîtriser ce type d'exercice en ${subject} ?`,
    },
    {
      id: 'similar-problem',
      icon: '📝',
      label: 'Exercice similaire',
      prompt: `Propose-moi un petit exemple ou exercice similaire d'entraînement basé sur la même règle.`,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Contexte enrichi et sécurisé
    const enrichedContent = `[Contexte de l'exercice : ${subject} | Chapitre : ${chapter || 'Général'} | Concours/Niveau : ${competitionName || levelLabel || 'Général'} | Question ${questionNumber}/${totalQuestions} : "${questionText}"]\n\nDemande de l'apprenant : ${text}`;

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
      const response = await AIService.processRequest({
        content: enrichedContent,
        mode: 'assistant',
      });

      setMessages((prev) => [...prev, response]);
    } catch {
      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Désolé, le service IA pédagogique n'a pas pu traiter la demande à cet instant. Veuillez réessayer.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    <div className="mobile-ai-drawer-backdrop" onClick={onClose}>
      <div
        className="mobile-ai-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Assistant IA Sunubiblio"
      >
        {/* Poignée de drag */}
        <div className="sheet-handle-bar" onClick={onClose} />

        {/* En-tête de l'IA */}
        <div className="ai-drawer-header">
          <div className="ai-drawer-identity">
            <div className="ai-drawer-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
                <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
              </svg>
            </div>
            <div className="ai-drawer-titles">
              <h3 className="ai-drawer-name">IA Sunubiblio Pédagogique</h3>
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
          <p className="drawer-question-snippet">« {questionText} »</p>
        </div>

        {/* Corps des messages */}
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
              <div className="ai-typing-indicator">
                <span />
                <span />
                <span />
              </div>
              <span className="typing-text">L'IA analyse votre question...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Barre d'actions rapides (scroll horizontal au pouce) */}
        <div className="ai-drawer-quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="quick-action-chip"
              onClick={() => handleSendMessage(action.prompt)}
              disabled={isLoading}
            >
              <span className="chip-icon">{action.icon}</span>
              <span className="chip-text">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Barre de saisie moderne */}
        <div className="ai-drawer-composer">
          <div className="composer-input-pill">
            <button
              type="button"
              className="composer-plus-btn"
              title="Ajouter une ressource ou formule"
              onClick={() => {
                setInputText((prev) => (prev ? `${prev} [Formule/Règle] ` : 'Pouvez-vous analyser la règle : '));
              }}
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
            />

            <button
              type="button"
              className={`composer-send-btn ${inputText.trim() ? 'has-content' : ''}`}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              aria-label="Envoyer"
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
