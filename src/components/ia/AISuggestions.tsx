'use client';

import React from 'react';
import { AIMode } from '@/types/ai';

interface AISuggestionsProps {
  onSelectSuggestion: (suggestion: { prompt: string; mode: AIMode }) => void;
}

interface SuggestionItem {
  id: string;
  icon: string;
  label: string;
  prompt: string;
  mode: AIMode;
}

const SUGGESTIONS_LIST: SuggestionItem[] = [
  {
    id: 'resumer',
    icon: '📋',
    label: 'Résumer mon document',
    prompt: 'Fais-moi un résumé clair et concis en extrayant les points clés de ce cours.',
    mode: 'resumer'
  },
  {
    id: 'expliquer',
    icon: '💡',
    label: 'Expliquer ce cours simplement',
    prompt: 'Explique-moi ce concept pas à pas avec des exemples simples et concrets.',
    mode: 'expliquer'
  },
  {
    id: 'qcm',
    icon: '📝',
    label: 'Générer un QCM',
    prompt: 'Génère 10 questions à choix multiples (QCM) avec correction détaillée pour m’évaluer.',
    mode: 'qcm'
  },
  {
    id: 'exercices',
    icon: '🎯',
    label: 'Créer des exercices',
    prompt: 'Donne-moi 3 exercices d’entraînement progressifs conformes au programme d’examen.',
    mode: 'exercices'
  },
  {
    id: 'corriger',
    icon: '✍️',
    label: 'Corriger mon devoir',
    prompt: 'Analyse et corrige ce devoir en m’indiquant les points forts et les erreurs à éviter.',
    mode: 'corriger'
  },
  {
    id: 'antiplagiat',
    icon: '🔎',
    label: 'Vérifier la similarité (antiplagiat)',
    prompt: 'Vérifie si ce texte ou document présente des passages similaires au fonds documentaire.',
    mode: 'antiplagiat'
  },
  {
    id: 'biblio',
    icon: '📚',
    label: 'Rechercher dans ma bibliothèque',
    prompt: 'Quelles sont les meilleures ressources disponibles dans Sunubiblio sur ce thème ?',
    mode: 'assistant'
  }
];

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  onSelectSuggestion,
}) => {
  return (
    <div className="ia-suggestions-container" aria-label="Suggestions rapides pour démarrer">
      <div className="suggestions-grid">
        {SUGGESTIONS_LIST.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSuggestion({ prompt: item.prompt, mode: item.mode })}
            className="suggestion-chip-btn"
            title={`Pré-remplir : « ${item.prompt} »`}
          >
            <span className="chip-icon">{item.icon}</span>
            <span className="chip-label">{item.label}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .ia-suggestions-container {
          width: 100%;
          max-width: 860px;
          margin: 18px auto 0 auto;
          display: flex;
          justify-content: center;
        }

        .suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .suggestion-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.02);
          user-select: none;
        }

        .suggestion-chip-btn:hover {
          background: #f8faff;
          border-color: #6366f1;
          color: #4f46e5;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 14px rgba(99, 102, 241, 0.1);
        }

        .chip-icon {
          font-size: 14px;
        }

        .chip-label {
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .suggestions-grid {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 6px;
            scrollbar-width: none;
            width: 100%;
          }

          .suggestion-chip-btn {
            font-size: 12.5px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
};
