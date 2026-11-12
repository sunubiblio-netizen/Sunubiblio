'use client';

import React, { useMemo } from 'react';
import { AIMode } from '@/types/ai';

interface IAHeroCenteredProps {
  onNewChat?: () => void;
  isConversationActive?: boolean;
  onSelectOption?: (mode: AIMode) => void;
  userName?: string;
  isSubscriber?: boolean;
}

export const IAHeroCentered: React.FC<IAHeroCenteredProps> = ({
  isConversationActive = false,
  onSelectOption,
  userName = 'Petit Fall',
  isSubscriber = false,
}) => {
  if (isConversationActive) {
    return null;
  }

  // Salutation dynamique selon l'heure locale
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5 ? 'Bonsoir' : 'Bonjour';
  }, []);

  const minimalistActions = [
    {
      id: 'resumer',
      mode: 'resumer' as AIMode,
      label: 'Résumer un cours ou un document',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'expliquer',
      mode: 'expliquer' as AIMode,
      label: 'Expliquer une notion pas à pas',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
    {
      id: 'qcm',
      mode: 'qcm' as AIMode,
      label: 'Générer un QCM d’entraînement',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: 'antiplagiat',
      mode: 'antiplagiat' as AIMode,
      label: 'Vérification antiplagiat',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="m11 8 2 2-4 4" />
        </svg>
      ),
    },
  ];

  return (
    <header className="chatgpt-style-hero">
      <div className="container">
        {/* Titre central sobre et aéré */}
        <div className="chatgpt-welcome-center">
          <h1 className="chatgpt-greeting-heading">
            {isSubscriber && userName
              ? `${greeting} ${userName}, que souhaitez-vous réviser ?`
              : `${greeting}, que souhaitez-vous réviser ?`}
          </h1>

          {/* 4 Actions rapides minimalistes à la ligne, calquées sur ChatGPT */}
          <div className="chatgpt-minimalist-actions">
            {minimalistActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onSelectOption && onSelectOption(action.mode)}
                className="minimalist-action-row"
              >
                <span className="action-row-icon">{action.icon}</span>
                <span className="action-row-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatgpt-style-hero {
          width: 100%;
          padding: 30px 0 10px 0;
          position: relative;
          background: transparent;
        }

        .chatgpt-welcome-center {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 16px;
        }

        .chatgpt-greeting-heading {
          font-size: clamp(23px, 3.8vw, 32px);
          font-weight: 600;
          color: #1e293b;
          letter-spacing: -0.015em;
          margin: 0 0 32px 0;
          line-height: 1.3;
        }

        .chatgpt-minimalist-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 440px;
          margin: 0 auto 16px auto;
        }

        .minimalist-action-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #475569;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }

        .minimalist-action-row:hover {
          background: #f8fafc;
          color: #0f172a;
          transform: translateX(4px);
        }

        .action-row-icon {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.18s ease;
        }

        .minimalist-action-row:hover .action-row-icon {
          color: #d97706;
        }

        .action-row-label {
          flex: 1;
        }

        @media (max-width: 640px) {
          .chatgpt-style-hero {
            padding-top: 16px;
          }

          .chatgpt-greeting-heading {
            margin-bottom: 22px;
            font-size: 21px;
          }

          .chatgpt-minimalist-actions {
            gap: 10px;
          }

          .minimalist-action-row {
            font-size: 14px;
            padding: 8px 10px;
          }
        }
      `}</style>
    </header>
  );
};
