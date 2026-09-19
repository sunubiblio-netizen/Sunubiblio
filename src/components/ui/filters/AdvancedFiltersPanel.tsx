'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilterChip } from './FilterChip';

export interface AdvancedFilterValues {
  priceRange: string;
  availability: string;
  language: string;
  minExperience: string;
}

export interface AdvancedFiltersPanelProps {
  values: AdvancedFilterValues;
  onChange: (patch: Partial<AdvancedFilterValues>) => void;
  onReset: () => void;
  priceOptions: { id: string; label: string }[];
  availabilityOptions: { id: string; label: string }[];
  languageOptions: string[];
  experienceOptions: { id: string; label: string }[];
  activeCount: number;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  values,
  onChange,
  onReset,
  priceOptions,
  availabilityOptions,
  languageOptions,
  experienceOptions,
  activeCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermer au clic extérieur et Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="advanced-filters-panel-root" ref={panelRef}>
      <FilterChip
        label="+ Filtres"
        isActive={activeCount > 0}
        isOpen={isOpen}
        countBadge={activeCount > 0 ? activeCount : undefined}
        onClick={() => setIsOpen(!isOpen)}
        icon={
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        }
      />

      {isOpen && (
        <div className="advanced-popover-card" role="dialog" aria-label="Filtres avancés">
          <div className="popover-title-row">
            <h3 className="popover-title">Filtres avancés</h3>
            <button
              type="button"
              className="popover-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="popover-body-content">
            {/* 1. Tarif */}
            <div className="filter-group">
              <label className="group-label">Tarif horaire</label>
              <div className="pills-grid">
                {priceOptions.map((opt) => {
                  const isSelected = values.priceRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`pill-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onChange({ priceRange: opt.id })}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Disponibilité */}
            <div className="filter-group">
              <label className="group-label">Disponibilité</label>
              <div className="pills-grid">
                {availabilityOptions.map((opt) => {
                  const isSelected = values.availability === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`pill-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onChange({ availability: opt.id })}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Expérience */}
            <div className="filter-group">
              <label className="group-label">Expérience minimale</label>
              <div className="pills-grid">
                {experienceOptions.map((opt) => {
                  const isSelected = values.minExperience === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`pill-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onChange({ minExperience: opt.id })}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Langue */}
            <div className="filter-group">
              <label className="group-label">Langue d'enseignement</label>
              <div className="pills-grid">
                {languageOptions.map((lang) => {
                  const val = lang === 'Toutes les langues' ? 'all' : lang;
                  const isSelected = values.language === val;
                  return (
                    <button
                      key={lang}
                      type="button"
                      className={`pill-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onChange({ language: val })}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="popover-footer-row">
            <button
              type="button"
              className="reset-action-btn"
              onClick={onReset}
              disabled={activeCount === 0}
            >
              Réinitialiser
            </button>
            <button
              type="button"
              className="apply-action-btn"
              onClick={() => setIsOpen(false)}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .advanced-filters-panel-root {
          position: relative;
          display: inline-block;
        }

        .advanced-popover-card {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 320px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.16),
            0 2px 8px rgba(0, 0, 0, 0.04);
          z-index: 210;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popover-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .popover-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .popover-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .popover-close-btn:hover {
          color: #0f172a;
        }

        .popover-body-content {
          padding: 14px 16px;
          max-height: 360px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .popover-body-content::-webkit-scrollbar {
          width: 4px;
        }

        .popover-body-content::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 9999px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .group-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .pills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pill-btn {
          padding: 5px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pill-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .pill-btn.selected {
          background: #eef2ff;
          border-color: #6366f1;
          color: #4338ca;
          font-weight: 600;
        }

        .popover-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }

        .reset-action-btn {
          background: transparent;
          border: none;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
        }

        .reset-action-btn:hover:not(:disabled) {
          color: #ef4444;
        }

        .reset-action-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .apply-action-btn {
          padding: 6px 14px;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .apply-action-btn:hover {
          background: #4338ca;
        }

        @media (max-width: 640px) {
          .advanced-popover-card {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            border-radius: 20px 20px 0 0;
            max-height: 80vh;
          }
        }
      `}</style>
    </div>
  );
};
