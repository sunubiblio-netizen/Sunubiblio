'use client';

import React, { useRef, useEffect } from 'react';
import { AIMessage, AIMode, AIAttachment } from '@/types/ai';
import { AIMessageBubble } from './AIMessageBubble';
import { AIComposer } from '../composer/AIComposer';

interface AIConversationViewProps {
  messages: AIMessage[];
  isLoading: boolean;
  onSendMessage: (payload: {
    content: string;
    mode: AIMode;
    attachments: AIAttachment[];
    isWebSearch: boolean;
  }) => void;
  onResetChat: () => void;
  onRetryLast?: () => void;
}

export const AIConversationView: React.FC<AIConversationViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onResetChat,
  onRetryLast,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="ai-workspace-conversation">
      {/* Centered Conversation Container (Max-Width: 800px) */}
      <div className="conversation-column">
        {/* Discrete Session Toolbar */}
        <div className="conversation-toolbar">
          <div className="session-status-badge">
            <span className="live-status-dot" aria-hidden="true" />
            <span className="session-title">Session de travail active</span>
          </div>

          <div className="session-actions">
            <button
              type="button"
              onClick={onResetChat}
              className="btn-new-chat-session"
              aria-label="Démarrer une nouvelle discussion"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Nouvelle discussion</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="conversation-stream">
          {messages.map((msg) => (
            <AIMessageBubble
              key={msg.id}
              message={msg}
              onRetry={msg.role === 'assistant' ? onRetryLast : undefined}
            />
          ))}

          {/* Thinking / Generation Animation (Compact & Elegant) */}
          {isLoading && (
            <div className="assistant-thinking-indicator" role="status" aria-live="polite">
              <div className="thinking-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="thinking-content">
                <span className="thinking-name">Assistant Sunubiblio</span>
                <div className="typing-dots-pill">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="thinking-label">formule votre réponse...</span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="scroll-anchor" />
        </div>
      </div>

      {/* Docked Floating Composer with Fade Gradient */}
      <div className="docked-composer-container">
        <div className="composer-dock-inner">
          <AIComposer
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder="Posez une question ou poursuivez l'échange..."
            isFloatingBottom={true}
          />
        </div>
      </div>

      <style jsx>{`
        .ai-workspace-conversation {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 180px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* -------------------------------------------------------------
           CENTERED COLUMN (Strictly 800px max, perfectly balanced)
        ------------------------------------------------------------- */
        .conversation-column {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 8px 16px;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .conversation-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0 16px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          margin-bottom: 24px;
        }

        .session-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }

        .live-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px #6366f1;
        }

        .btn-new-chat-session {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
        }

        .btn-new-chat-session:hover {
          background: #eef2ff;
          border-color: #6366f1;
          transform: translateY(-1px);
        }

        /* -------------------------------------------------------------
           STREAM: Generous bottom padding to prevent composer overlap
        ------------------------------------------------------------- */
        .conversation-stream {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          /* Critical: 160px buffer ensures last message is NEVER hidden behind docked composer */
          padding-bottom: 180px;
        }

        .assistant-thinking-indicator {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          animation: fadeIn 0.2s ease;
        }

        .thinking-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
        }

        .thinking-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .thinking-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .typing-dots-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8faff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        .thinking-label {
          font-size: 12.5px;
          color: #64748b;
          font-style: italic;
          margin-left: 4px;
        }

        .scroll-anchor {
          height: 1px;
          width: 100%;
        }

        /* -------------------------------------------------------------
           DOCKED FLOATING COMPOSER
           Gradient background allows messages to scroll smoothly behind
        ------------------------------------------------------------- */
        .docked-composer-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          pointer-events: none; /* Allows scrolling behind the transparent fade area */
          padding: 24px 16px calc(env(safe-area-inset-bottom, 0px) + 12px) 16px;
          background: linear-gradient(to top, rgba(255, 255, 255, 1) 72%, rgba(255, 255, 255, 0) 100%);
        }

        .composer-dock-inner {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          pointer-events: auto; /* Re-enables interaction inside the composer */
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .conversation-column {
            padding: 4px 12px;
          }

          .conversation-stream {
            padding-bottom: 190px;
          }

          .docked-composer-container {
            padding: 16px 12px calc(env(safe-area-inset-bottom, 0px) + 10px) 12px;
          }
        }
      `}</style>
    </div>
  );
};
