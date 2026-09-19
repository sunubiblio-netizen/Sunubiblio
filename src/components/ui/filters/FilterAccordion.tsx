'use client';

import React from 'react';
import { FilterGlassOption } from './FilterGlassPanel';

export interface FilterAccordionProps {
  id: string;
  title: string;
  options: FilterGlassOption[];
  selectedValue: string;
  onSelect: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}

/**
 * Helper to get an SVG icon based on section id
 */
export function getSectionSvgIcon(id: string): React.ReactNode {
  const norm = id.toLowerCase();

  // Catégorie / Domaine / Thème
  if (norm.includes('cat') || norm.includes('domain') || norm.includes('tradition')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }

  // Niveau / Diplôme / Grade / Classe
  if (norm.includes('level') || norm.includes('niveau') || norm.includes('diplom') || norm.includes('grade') || norm.includes('cycle')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  }

  // Matière / Sujet
  if (norm.includes('subject') || norm.includes('matiere')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }

  // Format / Type / Document
  if (norm.includes('type') || norm.includes('format') || norm.includes('doc')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }

  // Année / Session / Époque
  if (norm.includes('year') || norm.includes('annee') || norm.includes('session') || norm.includes('epoch')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  // Zone / Pays / Ville
  if (norm.includes('country') || norm.includes('zone') || norm.includes('city') || norm.includes('pays')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }

  // Tarif / Prix / Formule / Accès
  if (norm.includes('price') || norm.includes('tarif') || norm.includes('access') || norm.includes('plan')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  }

  // Disponibilité / Horaires
  if (norm.includes('avail') || norm.includes('dispo') || norm.includes('time')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  // Concours / Compétition
  if (norm.includes('concours') || norm.includes('compet')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34c3.07-.82 5-3.3 5-6.66V4H6v4c0 3.36 1.93 5.84 5 6.66z" />
      </svg>
    );
  }

  // Difficulté / Niveau de complexité
  if (norm.includes('diff') || norm.includes('level_diff')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20v-6M6 20V10M18 20V4" />
      </svg>
    );
  }

  // Statut (ouvert, en cours, etc.)
  if (norm.includes('status') || norm.includes('statut')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  // Expérience
  if (norm.includes('exp')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }

  // Mode d'enseignement (visio/présentiel)
  if (norm.includes('mode')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }

  // Défaut : filtres / réglages
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  id,
  title,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
  icon,
}) => {
  // Find current selected option label to display discreetly in the header
  const currentOption = options.find((opt) => {
    const val = opt.value ?? opt.id ?? '';
    return val === selectedValue;
  });

  const isCustomSelected =
    selectedValue &&
    selectedValue !== 'all' &&
    selectedValue !== 'all_rel';

  const selectedDisplayLabel = currentOption ? currentOption.label : '';

  const sectionIcon = icon || getSectionSvgIcon(id);

  return (
    <div className={`sunu-filter-accordion-item ${isOpen ? 'is-open' : ''} ${isCustomSelected ? 'has-selection' : ''}`}>
      {/* Header Row (Always visible & clickable) */}
      <button
        type="button"
        className="accordion-header-btn"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="header-left">
          <span className="accordion-chevron" aria-hidden="true">
            {isOpen ? '⌄' : '›'}
          </span>
          <span className="section-svg-icon" aria-hidden="true">
            {sectionIcon}
          </span>
          <span className="accordion-title">{title}</span>
        </div>

        <div className="header-right">
          {isCustomSelected ? (
            <span className="current-value-badge" title={selectedDisplayLabel}>
              {selectedDisplayLabel}
            </span>
          ) : (
            <span className="default-value-hint">Tous</span>
          )}
        </div>
      </button>

      {/* Unfolding Body */}
      {isOpen && (
        <div className="accordion-body-collapse" role="region">
          <div className="options-radio-list">
            {options.map((opt, idx) => {
              const optVal = (opt.value ?? opt.id ?? '') as string;
              const isSelected = selectedValue === optVal;

              return (
                <button
                  key={optVal || idx}
                  type="button"
                  className={`option-row-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(optVal)}
                >
                  <div className="radio-indicator">
                    <span className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                  </div>

                  <div className="option-text-cluster">
                    <span className="option-label">{opt.label}</span>
                    {opt.description && (
                      <span className="option-desc">{opt.description}</span>
                    )}
                  </div>

                  {opt.badge !== undefined && (
                    <span className="option-badge">{opt.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .sunu-filter-accordion-item {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 14px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .sunu-filter-accordion-item.is-open {
          background: #ffffff;
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 4px 16px -2px rgba(99, 102, 241, 0.08);
        }

        .sunu-filter-accordion-item.has-selection:not(.is-open) {
          border-color: rgba(99, 102, 241, 0.28);
          background: rgba(245, 243, 255, 0.6);
        }

        .accordion-header-btn {
          width: 100%;
          min-height: 46px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          user-select: none;
          transition: background 0.15s ease;
        }

        .accordion-header-btn:hover {
          background: rgba(248, 250, 252, 0.8);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
          min-width: 0;
        }

        .accordion-chevron {
          font-size: 16px;
          font-weight: 700;
          color: #6366f1;
          width: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          line-height: 1;
        }

        .section-svg-icon {
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .accordion-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-right {
          display: flex;
          align-items: center;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .current-value-badge {
          background: #ede9fe;
          color: #4f46e5;
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .default-value-hint {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Options list container */
        .accordion-body-collapse {
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          padding: 8px 10px 10px;
          background: #ffffff;
          animation: accordionExpand 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes accordionExpand {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .options-radio-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 240px;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding-right: 2px;
        }

        .option-row-btn {
          width: 100%;
          min-height: 38px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: all 0.15s ease;
        }

        .option-row-btn:hover {
          background: #f8fafc;
        }

        .option-row-btn.is-selected {
          background: #f5f3ff;
          border-color: rgba(99, 102, 241, 0.2);
        }

        .radio-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .radio-circle {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1.8px solid #cbd5e1;
          display: block;
          transition: all 0.15s ease;
          position: relative;
        }

        .radio-circle.checked {
          border-color: #4f46e5;
          background: #4f46e5;
          box-shadow: inset 0 0 0 3px #ffffff;
        }

        .option-text-cluster {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .option-label {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .option-row-btn.is-selected .option-label {
          color: #4338ca;
          font-weight: 700;
        }

        .option-desc {
          font-size: 11px;
          color: #64748b;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .option-badge {
          background: #f1f5f9;
          color: #64748b;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .option-row-btn.is-selected .option-badge {
          background: #ede9fe;
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
};
