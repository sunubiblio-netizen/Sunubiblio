'use client';

import React from 'react';
import { ReligionBranch, ReligionBranchId, ReligionTraditionId } from '@/types/religion';

interface SenegalReligionsSectionProps {
  branches: ReligionBranch[];
  selectedBranchId: ReligionBranchId | null;
  onSelectBranch: (traditionId: ReligionTraditionId, branchId: ReligionBranchId) => void;
}

export const SenegalReligionsSection: React.FC<SenegalReligionsSectionProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  const islamBranches = branches.filter((b) => b.traditionId === 'islam');
  const christianBranches = branches.filter((b) => b.traditionId === 'christianisme');
  const otherBranches = branches.filter(
    (b) => b.traditionId === 'religions-traditionnelles-africaines' || b.traditionId === 'autres-traditions'
  );

  return (
    <section className="senegal-religions-section" id="religions-senegal">
      <div className="container">
        {/* Section Header matching Sunubiblio standards */}
        <div className="section-header">
          <div className="header-left">
            <div className="section-icon-box">
              <span className="senegal-flag-icon">🇸🇳</span>
            </div>
            <div>
              <div className="badge-pill senegal-badge">
                <span className="badge-dot" style={{ background: '#059669' }} />
                <span>Patrimoine National &amp; Vivier Spirituel</span>
              </div>
              <h2 className="section-title">Religions et spiritualités au Sénégal</h2>
              <p className="section-subtitle">
                Découvrez les principales traditions et expressions religieuses présentes au Sénégal.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Sous-section : ISLAM AU SÉNÉGAL (Mise en avant prioritaire) */}
        <div className="sub-tradition-block">
          <div className="sub-tradition-header">
            <div className="sub-indicator islam-indicator" />
            <div>
              <h3 className="sub-tradition-title">Islam au Sénégal</h3>
              <p className="sub-tradition-desc">
                Un ancrage historique profond porté par les grandes confréries soufies, la science utile et la concorde pacifique.
              </p>
            </div>
          </div>

          <div className="branches-grid">
            {islamBranches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  className={`branch-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => onSelectBranch('islam', branch.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectBranch('islam', branch.id);
                    }
                  }}
                >
                  <div className="branch-card-top">
                    <div
                      className="branch-icon-box"
                      style={{ backgroundColor: branch.bgLight, color: branch.accentColor }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                      </svg>
                    </div>
                    {branch.badge && (
                      <span
                        className="branch-badge-tag"
                        style={{
                          backgroundColor: branch.bgLight,
                          color: branch.accentColor,
                          borderColor: branch.borderColor,
                        }}
                      >
                        {branch.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="branch-name">{branch.title}</h4>
                  {branch.location && (
                    <span className="branch-location">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{branch.location}</span>
                    </span>
                  )}
                  <p className="branch-desc">{branch.description}</p>

                  <div className="branch-footer">
                    <span className="branch-count">
                      {branch.resourceCount} œuvre{branch.resourceCount > 1 ? 's' : ''} disponible{branch.resourceCount > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      className="branch-action-link"
                      style={{ color: branch.accentColor }}
                      tabIndex={-1}
                    >
                      <span>{isSelected ? 'Sélectionné ✓' : 'Accéder au courant'}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Sous-section : CHRISTIANISME AU SÉNÉGAL */}
        <div className="sub-tradition-block">
          <div className="sub-tradition-header">
            <div className="sub-indicator christian-indicator" />
            <div>
              <h3 className="sub-tradition-title">Christianisme au Sénégal</h3>
              <p className="sub-tradition-desc">
                Une tradition vivante, fraternelle et engagée dans l’éducation, le dialogue œcuménique et la culture de paix.
              </p>
            </div>
          </div>

          <div className="branches-grid">
            {christianBranches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  className={`branch-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => onSelectBranch('christianisme', branch.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectBranch('christianisme', branch.id);
                    }
                  }}
                >
                  <div className="branch-card-top">
                    <div
                      className="branch-icon-box"
                      style={{ backgroundColor: branch.bgLight, color: branch.accentColor }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="6" y1="8" x2="18" y2="8" />
                      </svg>
                    </div>
                    {branch.badge && (
                      <span
                        className="branch-badge-tag"
                        style={{
                          backgroundColor: branch.bgLight,
                          color: branch.accentColor,
                          borderColor: branch.borderColor,
                        }}
                      >
                        {branch.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="branch-name">{branch.title}</h4>
                  {branch.location && (
                    <span className="branch-location">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{branch.location}</span>
                    </span>
                  )}
                  <p className="branch-desc">{branch.description}</p>

                  <div className="branch-footer">
                    <span className="branch-count">
                      {branch.resourceCount > 0
                        ? `${branch.resourceCount} œuvre${branch.resourceCount > 1 ? 's' : ''}`
                        : 'En cours de numérisation'}
                    </span>
                    <button
                      type="button"
                      className="branch-action-link"
                      style={{ color: branch.accentColor }}
                      tabIndex={-1}
                    >
                      <span>{isSelected ? 'Sélectionné ✓' : 'Découvrir'}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Sous-section : AUTRES EXPRESSIONS SPIRITUELLES & SAGESSES */}
        <div className="sub-tradition-block">
          <div className="sub-tradition-header">
            <div className="sub-indicator other-indicator" />
            <div>
              <h3 className="sub-tradition-title">Spiritualités traditionnelles &amp; dialogue</h3>
              <p className="sub-tradition-desc">
                L’héritage de la parole ancestrale, les cosmogonies d'Afrique de l’Ouest et les rencontres interculturelles.
              </p>
            </div>
          </div>

          <div className="branches-grid">
            {otherBranches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  className={`branch-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => onSelectBranch(branch.traditionId, branch.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectBranch(branch.traditionId, branch.id);
                    }
                  }}
                >
                  <div className="branch-card-top">
                    <div
                      className="branch-icon-box"
                      style={{ backgroundColor: branch.bgLight, color: branch.accentColor }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22v-7" />
                        <path d="M17 14a5 5 0 0 0-10 0" />
                        <path d="M19 10a7 7 0 0 0-14 0" />
                        <path d="M21 6a9 9 0 0 0-18 0" />
                      </svg>
                    </div>
                    {branch.badge && (
                      <span
                        className="branch-badge-tag"
                        style={{
                          backgroundColor: branch.bgLight,
                          color: branch.accentColor,
                          borderColor: branch.borderColor,
                        }}
                      >
                        {branch.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="branch-name">{branch.title}</h4>
                  <p className="branch-desc">{branch.description}</p>

                  <div className="branch-footer">
                    <span className="branch-count">
                      {branch.resourceCount} document{branch.resourceCount > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      className="branch-action-link"
                      style={{ color: branch.accentColor }}
                      tabIndex={-1}
                    >
                      <span>{isSelected ? 'Sélectionné ✓' : 'Consulter'}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .senegal-religions-section {
          padding: 44px 0 52px 0;
          background: #f8fafc;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .senegal-flag-icon {
          font-size: 22px;
          line-height: 1;
        }

        .senegal-badge {
          margin-bottom: 8px;
        }

        .sub-tradition-block {
          margin-bottom: 36px;
        }

        .sub-tradition-block:last-child {
          margin-bottom: 0;
        }

        .sub-tradition-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
        }

        .sub-indicator {
          width: 4px;
          height: 28px;
          border-radius: 9999px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .islam-indicator {
          background: #059669;
        }

        .christian-indicator {
          background: #2563eb;
        }

        .other-indicator {
          background: #7c3aed;
        }

        .sub-tradition-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .sub-tradition-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
          width: 100%;
        }

        .branch-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 20px;
          padding: 22px 18px 18px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px -2px rgba(79, 70, 229, 0.04);
          text-align: left;
          outline: none;
        }

        .branch-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 32px -4px rgba(79, 70, 229, 0.1);
        }

        .branch-card.is-active {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.18);
          background: #fcfdfd;
        }

        .branch-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .branch-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .branch-badge-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 9999px;
          border: 1px solid transparent;
        }

        .branch-name {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .branch-location {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 10px;
        }

        .branch-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 16px 0;
          flex: 1;
        }

        .branch-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .branch-count {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .branch-action-link {
          background: transparent;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          padding: 0;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .branch-card:hover .branch-action-link {
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .branches-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
