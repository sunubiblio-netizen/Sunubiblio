'use client';

import React from 'react';
import { ContestFilterState } from '@/types/contest';
import { CONTEST_DOMAINS, CONTEST_DIPLOMAS, CONTEST_STATUSES, CONTEST_COUNTRIES } from '@/data/mockContests';

interface ContestFiltersProps {
  filters: ContestFilterState;
  onFilterChange: (newFilters: Partial<ContestFilterState>) => void;
  onResetFilters: () => void;
  activeCount: number;
}

export const ContestFilters: React.FC<ContestFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeCount,
}) => {
  return (
    <aside className="contest-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="sidebar-title">Filtres concours</span>
          {activeCount > 0 && <span className="active-badge">{activeCount}</span>}
        </div>
        {activeCount > 0 && (
          <button type="button" className="reset-btn" onClick={onResetFilters}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* 1. Domaine */}
      <div className="filter-block">
        <h3 className="filter-title">Domaine</h3>
        <div className="options-stack">
          {CONTEST_DOMAINS.map((dom) => (
            <label
              key={dom.id}
              className={`filter-item ${filters.domain === dom.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="contest_domain"
                checked={filters.domain === dom.id}
                onChange={() => onFilterChange({ domain: dom.id })}
                className="hidden-radio"
              />
              <span className="radio-dot" />
              <span className="item-text">{dom.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Niveau d'études requis */}
      <div className="filter-block">
        <h3 className="filter-title">Niveau requis</h3>
        <div className="options-stack">
          {CONTEST_DIPLOMAS.map((dip) => (
            <label
              key={dip.id}
              className={`filter-item ${filters.diploma === dip.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="contest_diploma"
                checked={filters.diploma === dip.id}
                onChange={() => onFilterChange({ diploma: dip.id })}
                className="hidden-radio"
              />
              <span className="radio-dot" />
              <span className="item-text">{dip.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Statut de la session */}
      <div className="filter-block">
        <h3 className="filter-title">Statut</h3>
        <div className="options-stack">
          {CONTEST_STATUSES.map((st) => (
            <label
              key={st.id}
              className={`filter-item ${filters.status === st.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="contest_status"
                checked={filters.status === st.id}
                onChange={() => onFilterChange({ status: st.id })}
                className="hidden-radio"
              />
              <span className="radio-dot" />
              <span className="item-text">{st.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Pays */}
      <div className="filter-block">
        <h3 className="filter-title">Zone géographique</h3>
        <div className="options-stack">
          {CONTEST_COUNTRIES.map((cty) => (
            <label
              key={cty.id}
              className={`filter-item ${filters.country === cty.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="contest_country"
                checked={filters.country === cty.id}
                onChange={() => onFilterChange({ country: cty.id })}
                className="hidden-radio"
              />
              <span className="radio-dot" />
              <span className="item-text">{cty.label}</span>
            </label>
          ))}
        </div>
      </div>

      <style jsx>{`
        .contest-sidebar {
          width: 275px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          padding: 20px 18px;
          height: fit-content;
          position: sticky;
          top: 96px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
        }

        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .sidebar-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .active-badge {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          background: #4f46e5;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reset-btn {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
        }

        .reset-btn:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        .filter-block {
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .filter-block:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .filter-title {
          font-size: 12.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin-bottom: 9px;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
          user-select: none;
        }

        .filter-item:hover {
          background: #f8fafc;
        }

        .filter-item.active {
          background: #eef2ff;
        }

        .hidden-radio {
          display: none;
        }

        .radio-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .filter-item.active .radio-dot {
          border-color: #4f46e5;
          background: #4f46e5;
        }

        .filter-item.active .radio-dot::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
        }

        .item-text {
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          line-height: 1.3;
        }

        .filter-item.active .item-text {
          color: #4f46e5;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .contest-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
