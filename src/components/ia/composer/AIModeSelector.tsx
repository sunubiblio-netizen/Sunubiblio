'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIMode } from '@/types/ai';

interface AIModeSelectorProps {
  currentMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
}

interface ModeOption {
  id: AIMode;
  label: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
}

const MODES: ModeOption[] = [
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
];

export const AIModeSelector: React.FC<AIModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = MODES.find((m) => m.id === currentMode) || MODES[0];

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
            <span>Mode d'intelligence artificielle</span>
          </div>

          <div className="modes-list">
            {MODES.map((option) => {
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
          background: rgba(99, 102, 241, 0.06);
          border: 1px solid rgba(99, 102, 241, 0.18);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .mode-btn-trigger:hover,
        .mode-btn-trigger.active {
          background: rgba(99, 102, 241, 0.12);
          border-color: #6366f1;
        }

        .mode-icon {
          display: flex;
          align-items: center;
        }

        .mode-label {
          white-space: nowrap;
        }

        .chevron-icon {
          color: #818cf8;
          transition: transform 0.2s ease;
        }

        .mode-btn-trigger.active .chevron-icon {
          transform: rotate(180deg);
        }

        .mode-menu-popover {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 0;
          width: 310px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.12);
          padding: 8px;
          z-index: 1000;
          animation: popoverFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-header {
          padding: 8px 12px 6px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
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
          background: #f8faff;
        }

        .mode-item.selected {
          background: rgba(99, 102, 241, 0.08);
        }

        .item-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
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
        }

        .desc {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .check-mark {
          color: #4f46e5;
          display: flex;
          align-items: center;
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
