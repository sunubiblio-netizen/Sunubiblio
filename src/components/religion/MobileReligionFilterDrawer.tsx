'use client';

import React, { useEffect } from 'react';
import {
  ReligionFilterState,
  ReligionTradition,
  ReligionBranch,
  ReligionResourceType,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionPlanRequired,
} from '@/types/religion';
import { RELIGION_CONTENT_TYPES, INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';
import { PRICING_PLANS } from '@/data/pricingPlans';

interface MobileReligionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const MobileReligionFilterDrawer: React.FC<MobileReligionFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  traditions,
  branches,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const availableBranches =
    filters.traditionId !== 'all'
      ? branches.filter((b) => b.traditionId === filters.traditionId)
      : branches;

  const availableAuthors = React.useMemo(() => {
    const set = new Set(INITIAL_RELIGION_RESOURCES.map((r) => r.auteur));
    return Array.from(set).sort();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Poignée de glissement tactile */}
        <div className="drawer-handle" />

        {/* Header du tiroir */}
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

        {/* Corps des filtres scrollable */}
        <div className="drawer-body">
          {/* 1. Tradition spirituelle */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Grande Tradition</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.traditionId === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ traditionId: 'all', branchId: 'all', page: 1 })}
              >
                Toutes les traditions
              </button>
              {traditions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`drawer-pill ${filters.traditionId === t.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ traditionId: t.id, branchId: 'all', page: 1 })}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Courant / Branche (dynamique) */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Courant &amp; Confrérie</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.branchId === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ branchId: 'all', page: 1 })}
              >
                Tous les courants
              </button>
              {availableBranches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`drawer-pill ${filters.branchId === b.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ branchId: b.id, page: 1 })}
                >
                  {b.title}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Type de document */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Type de document</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.contentType === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ contentType: 'all', page: 1 })}
              >
                Tous les types
              </button>
              {RELIGION_CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`drawer-pill ${filters.contentType === type.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ contentType: type.id, page: 1 })}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Auteur */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Auteurs &amp; Figures</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.author === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ author: 'all', page: 1 })}
              >
                Tous les auteurs
              </button>
              {availableAuthors.map((author) => (
                <button
                  key={author}
                  type="button"
                  className={`drawer-pill ${filters.author === author ? 'active' : ''}`}
                  onClick={() => onFilterChange({ author, page: 1 })}
                >
                  {author}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Époque / Période */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Époque / Période</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.year === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ year: 'all', page: 1 })}
              >
                Toutes les époques
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.year === 'before-1800' ? 'active' : ''}`}
                onClick={() => onFilterChange({ year: 'before-1800', page: 1 })}
              >
                Classique (&lt; 1800)
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.year === '1800-1950' ? 'active' : ''}`}
                onClick={() => onFilterChange({ year: '1800-1950', page: 1 })}
              >
                XIXe &amp; début XXe
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.year === 'post-1950' ? 'active' : ''}`}
                onClick={() => onFilterChange({ year: 'post-1950', page: 1 })}
              >
                Contemporain (&gt; 1950)
              </button>
            </div>
          </div>

          {/* 6. Formule d’abonnement */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Formule d’accès</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.requiredPlan === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ requiredPlan: 'all', page: 1 })}
              >
                Toutes les formules
              </button>
              {PRICING_PLANS.map((plan) => {
                const planKey =
                  plan.slug === 'gratuit'
                    ? 'gratuit'
                    : plan.slug === 'simple'
                    ? 'simple'
                    : plan.slug === 'recommande'
                    ? 'recommande'
                    : 'gold';
                const isSelected = filters.requiredPlan === planKey;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    className={`drawer-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => onFilterChange({ requiredPlan: planKey, page: 1 })}
                  >
                    {plan.name} ({plan.formattedPrice})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Ordre de tri */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Ordre de tri</h3>
            <div className="drawer-pills">
              <button
                type="button"
                className={`drawer-pill ${filters.sortBy === 'pertinence' ? 'active' : ''}`}
                onClick={() => onFilterChange({ sortBy: 'pertinence', page: 1 })}
              >
                Pertinence &amp; Vues
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => onFilterChange({ sortBy: 'recent', page: 1 })}
              >
                Année de publication
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.sortBy === 'titre' ? 'active' : ''}`}
                onClick={() => onFilterChange({ sortBy: 'titre', page: 1 })}
              >
                Titre (A-Z)
              </button>
              <button
                type="button"
                className={`drawer-pill ${filters.sortBy === 'auteur' ? 'active' : ''}`}
                onClick={() => onFilterChange({ sortBy: 'auteur', page: 1 })}
              >
                Auteur (A-Z)
              </button>
            </div>
          </div>
        </div>

        {/* Pied de page collant avec bouton d'application */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-primary drawer-apply-btn"
            onClick={onClose}
          >
            Afficher les {totalResults} document{totalResults > 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fade-in 0.2s ease-out;
        }

        .drawer-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 580px;
          max-height: 85vh;
          border-radius: 24px 24px 0 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-handle {
          width: 44px;
          height: 5px;
          border-radius: 9999px;
          background: #cbd5e1;
          margin: 12px auto 6px;
          flex-shrink: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          flex-shrink: 0;
        }

        .drawer-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .drawer-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .drawer-reset-link {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          cursor: pointer;
          padding: 0;
        }

        .drawer-reset-link:hover {
          text-decoration: underline;
        }

        .drawer-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .drawer-close-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .drawer-body {
          padding: 18px 20px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .drawer-section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          margin: 0;
        }

        .drawer-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .drawer-pill {
          display: inline-flex;
          align-items: center;
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .drawer-pill:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .drawer-pill.active {
          background: #1e1b4b;
          color: #ffffff;
          border-color: #1e1b4b;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(30, 27, 75, 0.2);
        }

        .drawer-footer {
          padding: 14px 20px 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.85);
          background: #ffffff;
          flex-shrink: 0;
        }

        .drawer-apply-btn {
          width: 100%;
          justify-content: center;
          padding: 13px 20px;
          font-size: 14.5px;
          font-weight: 700;
          border-radius: 12px;
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
