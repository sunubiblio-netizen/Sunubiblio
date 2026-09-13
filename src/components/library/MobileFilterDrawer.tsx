'use client';

import React from 'react';
import { FilterState } from '@/types/library';
import { SUBJECT_OPTIONS, RESOURCE_TYPES, ACCESS_LEVELS, RELIGION_SUB_OPTIONS } from '@/data/mockLibrary';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

const CATEGORY_FILTER_LIST = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'livres', label: 'Livres' },
  { id: 'cours', label: 'Cours' },
  { id: 'annales', label: 'Annales' },
  { id: 'exercices', label: 'Exercices' },
  { id: 'documents', label: 'Documents' },
  { id: 'religion', label: 'Religion & Spiritualité' },
];

const CYCLE_FILTER_LIST = [
  { id: 'all', label: 'Tous les niveaux' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'college', label: 'Collège' },
  { id: 'lycee', label: 'Lycée' },
  { id: 'universite', label: 'Université' },
];

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="drawer-handle" />

        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <h2 className="drawer-title">Filtres de recherche</h2>
            <button
              type="button"
              className="drawer-reset-link"
              onClick={onResetFilters}
            >
              Réinitialiser
            </button>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="drawer-body">
          {/* 1. Catégorie */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Catégorie</h3>
            <div className="drawer-pills">
              {CATEGORY_FILTER_LIST.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`drawer-pill ${filters.category === cat.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ category: cat.id, religionSub: 'all_rel' })}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* If Religion selected */}
          {filters.category === 'religion' && (
            <div className="drawer-section">
              <h3 className="drawer-section-title">Tradition & Spiritualité</h3>
              <div className="drawer-pills">
                {RELIGION_SUB_OPTIONS.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className={`drawer-pill ${filters.religionSub === sub.id ? 'active' : ''}`}
                    onClick={() => onFilterChange({ religionSub: sub.id })}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Niveau */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Niveau</h3>
            <div className="drawer-pills">
              {CYCLE_FILTER_LIST.map((cyc) => (
                <button
                  key={cyc.id}
                  type="button"
                  className={`drawer-pill ${filters.cycle === cyc.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ cycle: cyc.id, grade: undefined })}
                >
                  {cyc.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Matière */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Matière</h3>
            <div className="drawer-pills">
              {SUBJECT_OPTIONS.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`drawer-pill ${filters.subject === sub.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ subject: sub.id })}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Type de ressource */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Format de document</h3>
            <div className="drawer-pills">
              {RESOURCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`drawer-pill ${filters.resourceType === type.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ resourceType: type.id })}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Accès */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Accès & Formule</h3>
            <div className="drawer-pills">
              {ACCESS_LEVELS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  className={`drawer-pill ${filters.accessLevel === acc.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ accessLevel: acc.id })}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-primary drawer-apply-btn"
            onClick={onClose}
          >
            Afficher {totalResultsCount} ressource{totalResultsCount > 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fade-in 0.2s ease-out;
        }

        .drawer-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 560px;
          max-height: 85vh;
          border-radius: 24px 24px 0 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
          animation: slide-up 0.25s var(--ease-spring);
        }

        .drawer-handle {
          width: 44px;
          height: 4px;
          background: #cbd5e1;
          border-radius: 4px;
          margin: 10px auto 4px auto;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 14px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .drawer-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .drawer-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .drawer-reset-link {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-body {
          padding: 18px 20px;
          overflow-y: auto;
          flex: 1;
        }

        .drawer-section {
          margin-bottom: 20px;
        }

        .drawer-section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin-bottom: 10px;
        }

        .drawer-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .drawer-pill {
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          transition: all 0.15s ease;
        }

        .drawer-pill.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        .drawer-footer {
          padding: 14px 20px 20px 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .drawer-apply-btn {
          width: 100%;
          padding: 13px;
          font-size: 15px;
          border-radius: var(--radius-md);
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
