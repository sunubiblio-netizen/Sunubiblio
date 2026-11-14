'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIMode } from '@/types/ai';

interface AIModeSelectorProps {
  currentMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
}

export interface ModeOption {
  id: AIMode;
  label: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
}

export interface ModeCategory {
  id: string;
  title: string;
  items: ModeOption[];
}

export const MODE_CATEGORIES: ModeCategory[] = [
  {
    id: 'general',
    title: 'Assistant & Révisions Pédagogiques',
    items: [
      {
        id: 'assistant',
        label: 'Assistant',
        badge: 'Général',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        ),
        desc: 'Posez des questions libres ou discutez de vos révisions'
      },
      {
        id: 'resumer',
        label: 'Résumer',
        badge: 'Synthèse',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="13" y2="18"></line>
          </svg>
        ),
        desc: 'Extraire l’essentiel d’un cours ou document long'
      },
      {
        id: 'expliquer',
        label: 'Expliquer',
        badge: 'Pédagogie',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        ),
        desc: 'Comprendre pas à pas une notion ou un théorème'
      },
      {
        id: 'qcm',
        label: 'QCM',
        badge: 'Évaluation',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        ),
        desc: 'Générer des questions à choix multiples corrigées'
      },
      {
        id: 'exercices',
        label: 'Exercices',
        badge: 'Pratique',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ),
        desc: 'Créer des exercices progressifs selon votre niveau'
      },
      {
        id: 'corriger',
        label: 'Corriger',
        badge: 'Analyse',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        ),
        desc: 'Vérifier vos devoirs et obtenir des conseils'
      },
      {
        id: 'antiplagiat',
        label: 'Antiplagiat',
        badge: 'Similarité',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        ),
        desc: 'Vérifier la similarité et l’originalité d’un document'
      }
    ]
  },
  {
    id: 'redaction',
    title: 'Aide à l\'écriture et diagnostic éthique',
    items: [
      {
        id: 'memoire',
        label: 'Mémoire universitaire',
        badge: 'Master 1 & 2',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        ),
        desc: 'Master 1 & 2, fin d’études supérieures'
      },
      {
        id: 'these',
        label: 'Thèse de doctorat',
        badge: 'Doctorat',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M11 11h2M11 15h2M16 11h2M16 15h2M12 3 2 7h20L12 3z"></path>
          </svg>
        ),
        desc: 'Travaux doctoraux et recherches approfondies'
      },
      {
        id: 'rapport_stage',
        label: 'Rapport de stage / professionnel',
        badge: 'Professionnel',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        ),
        desc: 'Immersion en entreprise et bilans d’activité'
      },
      {
        id: 'article_scientifique',
        label: 'Article scientifique ou d’analyse',
        badge: 'Publication',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
        desc: 'Publication, revue ou communication de recherche'
      },
      {
        id: 'manuscrit_livre',
        label: 'Manuscrit de livre / essai',
        badge: 'Édition',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        ),
        desc: 'Ouvrage littéraire, essai ou manuel pédagogique'
      },
      {
        id: 'autre_academique',
        label: 'Autre document académique',
        badge: 'Académique',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <circle cx="10" cy="14" r="1.5"></circle>
          </svg>
        ),
        desc: 'Devoir de recherche, exposé ou projet tutoré'
      }
    ]
  },
  {
    id: 'outils_doc',
    title: 'Suite Bureautique & Documents',
    items: [
      {
        id: 'doc_pdf',
        label: 'Documents PDF',
        badge: 'Créer · Modifier · Convertir',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15h6"></path>
            <path d="M9 11h6"></path>
          </svg>
        ),
        desc: 'Créer un PDF, insérer un fichier, modifier, annoter ou convertir'
      },
      {
        id: 'doc_word',
        label: 'Documents Word (.docx)',
        badge: 'Créer · Modifier · Insérer',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
        desc: 'Créer ou importer un document Word pour rédiger et modifier'
      },
      {
        id: 'doc_excel',
        label: 'Feuilles Excel (.xlsx)',
        badge: 'Créer · Modifier · Calculer',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        ),
        desc: 'Créer un tableur, importer une feuille, insérer des formules et calculs'
      },
      {
        id: 'doc_powerpoint',
        label: 'Présentations PowerPoint (.pptx)',
        badge: 'Créer · Modifier · Diapos',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="M15 11l-3-3"></path>
          </svg>
        ),
        desc: 'Générer une présentation, concevoir des slides et structurer'
      }
    ]
  }
];

// Liste aplatie pour retrouver l'option active facilement
const ALL_MODES = MODE_CATEGORIES.flatMap((c) => c.items);

export const AIModeSelector: React.FC<AIModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = ALL_MODES.find((m) => m.id === currentMode) || ALL_MODES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (mode: AIMode) => {
    onSelectMode(mode);
    setIsOpen(false);
  };

  return (
    <div className="mode-selector-root" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`mode-btn-trigger ${isOpen ? 'active' : ''}`}
        aria-label={`Mode IA actuel : ${activeOption.label}. Cliquez pour changer de mode.`}
        aria-expanded={isOpen}
      >
        <span className="mode-icon">{activeOption.icon}</span>
        <span className="mode-label">{activeOption.label}</span>
        <svg 
          width="13" 
          height="13" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="chevron-icon"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="mode-menu-popover">
          <div className="menu-header">
            <span>Modes & Outils de l'Assistant</span>
          </div>

          <div className="modes-scroll-container">
            {MODE_CATEGORIES.map((category, catIndex) => (
              <div key={category.id} className="mode-category-group">
                <div className="category-section-title">
                  <span>{category.title}</span>
                </div>

                <div className="modes-list">
                  {category.items.map((option) => {
                    const isSelected = option.id === currentMode;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(option.id)}
                        className={`mode-item ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="item-icon-box">
                          {option.icon}
                        </div>
                        <div className="item-info">
                          <div className="item-title-row">
                            <span className="title">{option.label}</span>
                            <span className="badge">{option.badge}</span>
                          </div>
                          <span className="desc">{option.desc}</span>
                        </div>
                        {isSelected && (
                          <span className="check-mark">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {catIndex < MODE_CATEGORIES.length - 1 && (
                  <div className="category-divider" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .mode-selector-root {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .mode-btn-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 12px;
          background: rgba(245, 158, 11, 0.08);
          border: 1.5px solid rgba(245, 158, 11, 0.28);
          border-radius: 9999px;
          color: #b45309;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .mode-btn-trigger:hover,
        .mode-btn-trigger.active {
          background: rgba(245, 158, 11, 0.16);
          border-color: #f59e0b;
          color: #92400e;
        }

        .mode-icon {
          display: flex;
          align-items: center;
          color: #d97706;
        }

        .mode-label {
          white-space: nowrap;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chevron-icon {
          color: #d97706;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .mode-btn-trigger.active .chevron-icon {
          transform: rotate(180deg);
        }

        .mode-menu-popover {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 0;
          width: 330px;
          max-width: 92vw;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 45px -8px rgba(15, 23, 42, 0.16), 0 4px 14px rgba(245, 158, 11, 0.08);
          padding: 8px 6px;
          z-index: 1000;
          animation: popoverFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-header {
          padding: 8px 12px 6px 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 6px;
        }

        .modes-scroll-container {
          max-height: min(440px, 60vh);
          overflow-y: auto;
          padding: 2px 4px 6px 4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modes-scroll-container::-webkit-scrollbar {
          width: 5px;
        }

        .modes-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .category-section-title {
          padding: 6px 10px 4px 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #b45309;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .category-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 8px 8px;
        }

        .modes-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mode-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background 0.15s ease;
        }

        .mode-item:hover {
          background: #fefce8;
        }

        .mode-item.selected {
          background: #fef3c7;
        }

        .item-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #fffbeb;
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .badge {
          font-size: 10px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 9999px;
          background: #f1f5f9;
          color: #64748b;
          white-space: nowrap;
        }

        .desc {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .check-mark {
          color: #d97706;
          display: flex;
          align-items: center;
          font-weight: 800;
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
