'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FilterChip } from './FilterChip';

export interface FilterBottomSheetSection {
  id: string;
  title: string;
  currentValueLabel?: string;
  options: { id: string; label: string; badge?: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  defaultOpen?: boolean;
}

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sections: FilterBottomSheetSection[];
  onReset: () => void;
  totalResults: number;
  activeCount: number;
  activeChips?: { id: string; label: string; onRemove: () => void }[];
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  sections,
  onReset,
  totalResults,
  activeCount,
  activeChips = [],
}) => {
  const [mounted, setMounted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    // Initialise les sections par défaut
    const initial: Record<string, boolean> = {};
    sections.forEach((sec, i) => {
      initial[sec.id] = sec.defaultOpen !== undefined ? sec.defaultOpen : i === 0;
    });
    setOpenSections(initial);
  }, [sections]);

  // Bloquer le scroll d'arrière-plan
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return createPortal(
    <div className="sunu-bottomsheet-backdrop" onClick={onClose} style={{ zIndex: 999999 }}>
      <div className="sunu-bottomsheet-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drag / Touch Handle */}
        <div className="sheet-handle-bar">
          <div className="sheet-handle-pill" />
        </div>

        {/* En-tête de la Bottom Sheet */}
        <div className="sheet-header">
          <div className="sheet-title-group">
            <h2 className="sheet-title">Filtres</h2>
            {activeCount > 0 && <span className="sheet-count-badge">{activeCount}</span>}
          </div>
          <button
            type="button"
            className="sheet-close-btn"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            ✕
          </button>
        </div>

        {/* Chips actifs en haut du tiroir si présents */}
        {activeChips.length > 0 && (
          <div className="sheet-active-chips-strip">
            {activeChips.map((chip) => (
              <FilterChip
                key={chip.id}
                label={chip.label}
                onRemove={chip.onRemove}
                ariaLabel={`Retirer ${chip.label}`}
              />
            ))}
          </div>
        )}

        {/* Corps défilable avec sections accordéons */}
        <div className="sheet-scrollable-body">
          {sections.map((section) => {
            const isSectionOpen = openSections[section.id];
            return (
              <div key={section.id} className="sheet-section-accordion">
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isSectionOpen}
                >
                  <div className="sec-label-col">
                    <span className="sec-title">{section.title}</span>
                    {section.currentValueLabel && (
                      <span className="sec-val">{section.currentValueLabel}</span>
                    )}
                  </div>

                  <svg
                    className={`accordion-chevron ${isSectionOpen ? 'open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isSectionOpen && (
                  <div className="accordion-content-pills">
                    {section.options.map((opt) => {
                      const isSelected = section.selectedValue === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`sheet-pill-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => section.onSelect(opt.id)}
                        >
                          <span>{opt.label}</span>
                          {opt.badge && <span className="pill-badge">{opt.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pied de page fixe avec actions */}
        <div className="sheet-fixed-footer">
          <button
            type="button"
            className="sheet-reset-btn"
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="sheet-apply-btn"
            onClick={onClose}
          >
            Voir les {totalResults} résultats
          </button>
        </div>
      </div>

      <style jsx>{`
        .sunu-bottomsheet-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          animation: backdropFadeIn 0.2s ease-out;
        }

        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .sunu-bottomsheet-panel {
          background: #ffffff;
          border-radius: 24px 24px 0 0;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
          animation: sheetSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes sheetSlideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .sheet-handle-bar {
          display: flex;
          justify-content: center;
          padding: 10px 0 4px;
        }

        .sheet-handle-pill {
          width: 38px;
          height: 4px;
          border-radius: 9999px;
          background: #cbd5e1;
        }

        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sheet-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sheet-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .sheet-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 9999px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
        }

        .sheet-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .sheet-active-chips-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          background: #fafafa;
          border-bottom: 1px solid #f1f5f9;
          overflow-x: auto;
          white-space: nowrap;
        }

        .sheet-scrollable-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sheet-section-accordion {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 10px;
        }

        .accordion-header-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .sec-label-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sec-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
        }

        .sec-val {
          font-size: 12px;
          color: #6366f1;
          font-weight: 600;
        }

        .accordion-chevron {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .accordion-chevron.open {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        .accordion-content-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px 0 10px;
          animation: pillsFade 0.15s ease;
        }

        @keyframes pillsFade {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sheet-pill-btn {
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.12s ease;
        }

        .sheet-pill-btn.selected {
          background: #eef2ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        .pill-badge {
          font-size: 9.5px;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(99, 102, 241, 0.15);
          color: #4338ca;
        }

        .sheet-fixed-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid #f1f5f9;
          background: #ffffff;
        }

        .sheet-reset-btn {
          flex: 1;
          height: 44px;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sheet-reset-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sheet-apply-btn {
          flex: 2;
          height: 44px;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
        }

        .sheet-apply-btn:hover {
          background: #4338ca;
        }
      `}</style>
    </div>,
    document.body
  );
};
