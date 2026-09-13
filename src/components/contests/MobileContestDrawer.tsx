'use client';

import React from 'react';
import { ContestFilterState } from '@/types/contest';
import { CONTEST_DOMAINS, CONTEST_DIPLOMAS, CONTEST_STATUSES, CONTEST_COUNTRIES } from '@/data/mockContests';

interface MobileContestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ContestFilterState;
  onFilterChange: (newFilters: Partial<ContestFilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const MobileContestDrawer: React.FC<MobileContestDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-handle" />

        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <h2 className="drawer-title">Filtrer les concours</h2>
            <button type="button" className="drawer-reset-link" onClick={onResetFilters}>
              Réinitialiser
            </button>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* Domaine */}
          <div className="drawer-group">
            <h3 className="drawer-group-title">Domaine</h3>
            <div className="pills-flex">
              {CONTEST_DOMAINS.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  className={`drawer-chip ${filters.domain === dom.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ domain: dom.id })}
                >
                  {dom.label}
                </button>
              ))}
            </div>
          </div>

          {/* Niveau */}
          <div className="drawer-group">
            <h3 className="drawer-group-title">Niveau d’études</h3>
            <div className="pills-flex">
              {CONTEST_DIPLOMAS.map((dip) => (
                <button
                  key={dip.id}
                  type="button"
                  className={`drawer-chip ${filters.diploma === dip.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ diploma: dip.id })}
                >
                  {dip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statut */}
          <div className="drawer-group">
            <h3 className="drawer-group-title">Statut de la session</h3>
            <div className="pills-flex">
              {CONTEST_STATUSES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`drawer-chip ${filters.status === st.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ status: st.id })}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pays */}
          <div className="drawer-group">
            <h3 className="drawer-group-title">Zone</h3>
            <div className="pills-flex">
              {CONTEST_COUNTRIES.map((cty) => (
                <button
                  key={cty.id}
                  type="button"
                  className={`drawer-chip ${filters.country === cty.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ country: cty.id })}
                >
                  {cty.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-primary drawer-apply-btn" onClick={onClose}>
            Afficher {totalCount} concours
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

        .drawer-group {
          margin-bottom: 20px;
        }

        .drawer-group-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin-bottom: 10px;
        }

        .pills-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .drawer-chip {
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          transition: all 0.15s ease;
        }

        .drawer-chip.active {
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
