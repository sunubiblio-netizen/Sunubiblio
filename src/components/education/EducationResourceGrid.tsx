'use client';

import React from 'react';
import { EducationResource } from '@/types/education';

interface EducationResourceGridProps {
  resources: EducationResource[];
  isLoading?: boolean;
  onSelectResource: (resource: EducationResource) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const EducationResourceGrid: React.FC<EducationResourceGridProps> = ({
  resources,
  isLoading = false,
  onSelectResource,
  onResetFilters,
  hasActiveFilters,
}) => {
  if (isLoading) {
    return (
      <div className="loading-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton-cover" />
            <div className="skeleton-body">
              <div className="skeleton-line short" />
              <div className="skeleton-line medium" />
              <div className="skeleton-line long" />
            </div>
          </div>
        ))}

        <style jsx>{`
          .loading-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .skeleton-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
          }
          .skeleton-cover {
            height: 120px;
            background: #f1f5f9;
            animation: pulse 1.5s infinite;
          }
          .skeleton-body {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .skeleton-line {
            height: 12px;
            background: #f1f5f9;
            border-radius: 6px;
            animation: pulse 1.5s infinite;
          }
          .short { width: 30%; }
          .medium { width: 70%; }
          .long { width: 100%; }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // If no resources match
  if (resources.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-icon-wrap">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <circle cx="16" cy="9" r="3" stroke="#ec4899" strokeWidth="2" />
            <line x1="18.5" y1="11.5" x2="21" y2="14" stroke="#ec4899" strokeWidth="2" />
          </svg>
        </div>

        {hasActiveFilters ? (
          <>
            <h3 className="empty-title">Aucune ressource ne correspond à votre recherche</h3>
            <p className="empty-desc">
              Modifiez vos filtres de niveau, de matière ou vos termes de recherche pour explorer
              d’autres ressources pédagogiques.
            </p>
            <button
              type="button"
              className="btn-primary empty-btn"
              onClick={onResetFilters}
            >
              <span>Réinitialiser les filtres</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <h3 className="empty-title">Les ressources éducatives arrivent bientôt</h3>
            <p className="empty-desc">
              Nous préparons progressivement une bibliothèque adaptée à chaque niveau scolaire et
              académique, avec le concours des enseignants sénégalais.
            </p>
          </>
        )}

        <style jsx>{`
          .empty-state-container {
            background: #ffffff;
            border: 1.5px dashed rgba(226, 232, 240, 0.95);
            border-radius: 20px;
            padding: 56px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin: 20px 0 40px;
          }

          .empty-icon-wrap {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .empty-title {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 10px;
            letter-spacing: -0.015em;
          }

          .empty-desc {
            font-size: 14.5px;
            line-height: 1.6;
            color: #64748b;
            max-width: 520px;
            margin: 0 0 24px;
          }

          .empty-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="resources-grid-section">
      <div className="resources-grid">
        {resources.map((res) => (
          <div
            key={res.id}
            className="res-card"
            onClick={() => onSelectResource(res)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectResource(res);
              }
            }}
            aria-label={`Ouvrir la ressource ${res.title}`}
          >
            {/* Top Cover Banner */}
            <div
              className="res-cover"
              style={{ background: res.coverGradient }}
            >
              <div className="res-cover-overlay">
                <span className="res-type-pill">{res.typeLabel}</span>
                {res.isPremium ? (
                  <span className="res-premium-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Abonnement</span>
                  </span>
                ) : (
                  <span className="res-free-badge">Gratuit</span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="res-content">
              <div className="res-meta-line">
                <span className="res-subject">{res.subject}</span>
                <span className="res-dot" />
                <span className="res-level">{res.levelLabel} {res.grade ? `(${res.grade})` : ''}</span>
              </div>

              <h4 className="res-title">{res.title}</h4>
              <p className="res-description">{res.description}</p>

              <div className="res-footer">
                <div className="res-stats">
                  {res.year && (
                    <span className="res-stat-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{res.year}</span>
                    </span>
                  )}
                  {res.pagesCount && (
                    <span className="res-stat-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <span>{res.pagesCount} p.</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="res-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectResource(res);
                  }}
                >
                  <span>Ouvrir</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .resources-grid-section {
          margin-bottom: 48px;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .res-card {
          background: #ffffff;
          border: 1px solid var(--border-card, rgba(226, 232, 240, 0.9));
          border-radius: var(--radius-xl, 18px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          outline: none;
        }

        .res-card:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 14px 32px -8px rgba(99, 102, 241, 0.12);
        }

        .res-cover {
          height: 100px;
          position: relative;
        }

        .res-cover-overlay {
          position: absolute;
          inset: 0;
          padding: 12px 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%);
        }

        .res-type-pill {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          padding: 3px 8px;
          border-radius: 999px;
        }

        .res-premium-badge {
          font-size: 10.5px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 2px 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .res-free-badge {
          font-size: 10.5px;
          font-weight: 700;
          color: #ffffff;
          background: rgba(16, 185, 129, 0.9);
          backdrop-filter: blur(8px);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .res-content {
          padding: 18px 18px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .res-meta-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .res-subject {
          font-weight: 700;
          color: #4f46e5;
        }

        .res-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .res-level {
          color: #64748b;
          font-weight: 500;
        }

        .res-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading, #0f172a);
          line-height: 1.35;
          margin: 0 0 6px;
        }

        .res-description {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--text-body, #64748b);
          margin: 0 0 16px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .res-footer {
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .res-stats {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .res-stat-item {
          font-size: 11.5px;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .res-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 5px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #1e1b4b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .res-card:hover .res-action-btn {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        @media (max-width: 1024px) {
          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .resources-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
