'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ContactCategory } from '@/types/contact';

interface CategoryOptionConfig {
  value: ContactCategory;
  label: string;
  description: string;
  badge: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const CATEGORY_CONFIGS: CategoryOptionConfig[] = [
  {
    value: 'Question générale',
    label: 'Question générale',
    description: 'Renseignements généraux sur Sunubiblio et nos services',
    badge: 'Information',
    color: '#4f46e5',
    bgColor: '#eef2ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    value: 'Compte',
    label: 'Compte & Profil',
    description: 'Connexion, mot de passe oublié ou gestion de votre profil',
    badge: 'Espace membre',
    color: '#2563eb',
    bgColor: '#eff6ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    value: 'Bibliothèque',
    label: 'Bibliothèque & Ouvrages',
    description: 'Livres, chapitres, manuels ou documents pédagogiques',
    badge: 'Ressources',
    color: '#059669',
    bgColor: '#ecfdf5',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    value: 'Concours',
    label: 'Concours & Examens',
    description: 'Annales, épreuves, corrigés ou sessions FASTEF, ENA, etc.',
    badge: 'Concours',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    value: 'Abonnement',
    label: 'Abonnement & Formules',
    description: 'Questions sur les formules 3 000, 5 000 ou 9 000 FCFA',
    badge: 'Abonnement',
    color: '#d97706',
    bgColor: '#fffbeb',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    value: 'Paiement',
    label: 'Paiement (Wave / Orange Money)',
    description: 'Validation de paiement, reçu ou problème de transaction',
    badge: 'Transaction',
    color: '#9333ea',
    bgColor: '#faf5ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    value: 'Problème technique',
    label: 'Problème technique',
    description: 'Anomalie sur le site, bug d’affichage ou lenteur constatée',
    badge: 'Assistance',
    color: '#dc2626',
    bgColor: '#fef2f2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    value: 'Suggestion',
    label: 'Suggestion & Idée',
    description: 'Proposer une amélioration ou une ressource à ajouter',
    badge: 'Amélioration',
    color: '#0891b2',
    bgColor: '#ecfeff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
      </svg>
    ),
  },
  {
    value: 'Partenariat',
    label: 'Partenariat & Collaboration',
    description: 'Écoles, universités, institutions ou enseignants',
    badge: 'Partenaire',
    color: '#db2777',
    bgColor: '#fdf2f8',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: 'Autre',
    label: 'Autre demande',
    description: 'Toute autre question ou besoin non répertorié ci-dessus',
    badge: 'Divers',
    color: '#475569',
    bgColor: '#f1f5f9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

interface CategorySelectProps {
  value: ContactCategory;
  onChange: (value: ContactCategory) => void;
  id?: string;
  hasError?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  id = 'contact-category',
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedConfig =
    CATEGORY_CONFIGS.find((c) => c.value === value) || CATEGORY_CONFIGS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation (Escape to close)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = CATEGORY_CONFIGS.findIndex((c) => c.value === value);
          const nextIndex =
            e.key === 'ArrowDown'
              ? (currentIndex + 1) % CATEGORY_CONFIGS.length
              : (currentIndex - 1 + CATEGORY_CONFIGS.length) % CATEGORY_CONFIGS.length;
          onChange(CATEGORY_CONFIGS[nextIndex].value);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    },
    [isOpen, onChange, value]
  );

  return (
    <div className="custom-category-select" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Hidden input for form serialization */}
      <input type="hidden" name="category" value={value} />

      {/* Main trigger button */}
      <button
        type="button"
        id={id}
        className={`select-trigger ${isOpen ? 'is-open' : ''} ${hasError ? 'select-error' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Catégorie sélectionnée : ${selectedConfig.label}`}
      >
        <div className="trigger-left">
          <div
            className="trigger-icon"
            style={{
              color: selectedConfig.color,
              background: selectedConfig.bgColor,
            }}
            aria-hidden="true"
          >
            {selectedConfig.icon}
          </div>
          <div className="trigger-text-wrapper">
            <span className="trigger-label">{selectedConfig.label}</span>
          </div>
        </div>

        <div className={`trigger-chevron ${isOpen ? 'chevron-rotated' : ''}`} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="mobile-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="dropdown-menu-portal" role="presentation">
            <div className="dropdown-header-note">
              <span className="header-note-text">Choisissez la thématique de votre message</span>
              <button
                type="button"
                className="close-dropdown-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le menu des catégories"
              >
                ✕ Fermer
              </button>
            </div>
            <ul
              ref={listRef}
              className="dropdown-list"
              role="listbox"
              aria-activedescendant={`category-option-${value}`}
            >
            {CATEGORY_CONFIGS.map((config) => {
              const isSelected = config.value === value;
              return (
                <li
                  key={config.value}
                  id={`category-option-${config.value}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`dropdown-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    onChange(config.value);
                    setIsOpen(false);
                  }}
                >
                  <div
                    className="item-icon-wrapper"
                    style={{
                      color: config.color,
                      background: config.bgColor,
                    }}
                    aria-hidden="true"
                  >
                    {config.icon}
                  </div>

                  <div className="item-content">
                    <div className="item-title-row">
                      <span className="item-title">{config.label}</span>
                      <span
                        className="item-badge"
                        style={{
                          color: config.color,
                          backgroundColor: config.bgColor,
                        }}
                      >
                        {config.badge}
                      </span>
                    </div>
                    <span className="item-description">{config.description}</span>
                  </div>

                  {isSelected && (
                    <div className="item-check" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </>
    )}

      <style jsx>{`
        .custom-category-select {
          position: relative;
          width: 100%;
        }

        .select-trigger {
          width: 100%;
          min-height: 48px;
          padding: 8px 14px 8px 10px;
          border: 1.5px solid var(--border-subtle, #e2e8f0);
          border-radius: var(--radius-md, 12px);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          outline: none;
        }

        .select-trigger:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }

        .select-trigger:focus-visible,
        .select-trigger.is-open {
          border-color: #6366f1;
          box-shadow: 0 0 0 3.5px rgba(99, 102, 241, 0.15);
          background: #ffffff;
        }

        .select-error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }

        .trigger-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .trigger-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .select-trigger:hover .trigger-icon {
          transform: scale(1.05);
        }

        .trigger-text-wrapper {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .trigger-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-heading, #0f172a);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trigger-chevron {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
          flex-shrink: 0;
        }

        .chevron-rotated {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        /* Dropdown Popover */
        .dropdown-menu-portal {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          z-index: 70;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          box-shadow:
            0 20px 45px -10px rgba(15, 23, 42, 0.18),
            0 6px 18px -4px rgba(99, 102, 241, 0.08);
          overflow: hidden;
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .mobile-backdrop {
          display: none;
        }

        .close-dropdown-btn {
          display: none;
        }

        .dropdown-header-note {
          padding: 10px 16px 8px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-note-text {
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .dropdown-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          max-height: 310px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }

        /* Custom subtle scrollbar */
        .dropdown-list::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .dropdown-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .dropdown-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .dropdown-item:hover {
          background: #f8faff;
          transform: translateX(2px);
        }

        .dropdown-item.is-selected {
          background: #eef2ff;
        }

        .item-icon-wrapper {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .dropdown-item.is-selected .item-title {
          color: #4338ca;
        }

        .item-badge {
          font-size: 10.5px;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 999px;
          letter-spacing: 0.02em;
        }

        .item-description {
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-check {
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 6px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .dropdown-menu-portal {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 20px 20px 0 0;
            max-height: 70vh;
            border: none;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.25);
            animation: sheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 1000;
          }

          @keyframes sheetSlideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .mobile-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 999;
          }

          .dropdown-header-note {
            padding: 14px 18px 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .close-dropdown-btn {
            display: inline-flex;
            align-items: center;
            background: rgba(99, 102, 241, 0.08);
            color: #4f46e5;
            font-size: 12px;
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .close-dropdown-btn:active {
            background: rgba(99, 102, 241, 0.18);
          }

          .dropdown-list {
            max-height: calc(70vh - 50px);
            padding: 10px;
          }

          .dropdown-item {
            padding: 12px;
            min-height: 52px;
          }

          .item-description {
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
};
