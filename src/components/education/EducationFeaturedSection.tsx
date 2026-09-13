'use client';

import React from 'react';
import { EducationResource } from '@/types/education';

interface EducationFeaturedSectionProps {
  resources: EducationResource[];
  onSelectResource: (resource: EducationResource) => void;
}

export const EducationFeaturedSection: React.FC<EducationFeaturedSectionProps> = ({
  resources,
  onSelectResource,
}) => {
  const featured = resources.filter((r) => r.featured);

  if (featured.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <div className="badge-pill featured-badge">
              <span className="badge-dot" />
              <span>Sélection Pédagogique</span>
            </div>
            <h2 className="section-title">
              Ressources <span className="gradient-hero-text">à la une</span>
            </h2>
            <p className="section-subtitle">
              Les documents pédagogiques recommandés pour réviser efficacement les examens et
              concours nationaux.
            </p>
          </div>
        </div>

        <div className="featured-grid">
          {featured.map((item) => (
            <div
              key={item.id}
              className="featured-card"
              onClick={() => onSelectResource(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectResource(item);
                }
              }}
              aria-label={`Consulter la ressource ${item.title}`}
            >
              {/* Artistic Cover Header */}
              <div
                className="cover-banner"
                style={{ background: item.coverGradient }}
              >
                <div className="cover-overlay">
                  <div className="cover-tags">
                    <span className="type-badge">{item.typeLabel}</span>
                    {item.isPremium ? (
                      <span className="premium-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>Abonnement</span>
                      </span>
                    ) : (
                      <span className="free-badge">✓ Gratuit</span>
                    )}
                  </div>

                  <div className="cover-center-symbol" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>

                  {item.year && <span className="year-pill">Session {item.year}</span>}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <div className="meta-row">
                  <span className="subject-tag">{item.subject}</span>
                  <span className="level-tag">
                    {item.levelLabel} {item.grade ? `• ${item.grade}` : ''}
                  </span>
                </div>

                <h3 className="resource-title">{item.title}</h3>
                <p className="resource-desc">{item.description}</p>

                <div className="card-bottom">
                  {item.pagesCount && (
                    <span className="pages-count">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <span>{item.pagesCount} pages</span>
                    </span>
                  )}

                  <button
                    type="button"
                    className="consult-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectResource(item);
                    }}
                  >
                    <span>Consulter</span>
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
      </div>

      <style jsx>{`
        .featured-section {
          padding: 56px 0 50px;
          background: #ffffff;
        }

        .section-header {
          margin-bottom: 36px;
        }

        .featured-badge {
          display: inline-flex;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 30px;
          font-weight: 800;
          color: var(--text-heading, #0f172a);
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-body, #64748b);
          margin: 0;
          max-width: 680px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .featured-card {
          background: #ffffff;
          border: 1px solid var(--border-card, rgba(226, 232, 240, 0.9));
          border-radius: var(--radius-xl, 20px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          outline: none;
        }

        .featured-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 36px -8px rgba(99, 102, 241, 0.12);
        }

        .cover-banner {
          height: 130px;
          position: relative;
        }

        .cover-overlay {
          position: absolute;
          inset: 0;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%);
        }

        .cover-tags {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .type-badge {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.02em;
        }

        .premium-badge {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 3px 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .free-badge {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          background: rgba(16, 185, 129, 0.85);
          backdrop-filter: blur(8px);
          padding: 3px 9px;
          border-radius: 999px;
        }

        .cover-center-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .year-pill {
          align-self: flex-start;
          font-size: 10.5px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(0, 0, 0, 0.25);
          padding: 2px 7px;
          border-radius: 4px;
        }

        .card-body {
          padding: 20px 20px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .subject-tag {
          font-weight: 700;
          color: #4f46e5;
        }

        .level-tag {
          color: #64748b;
          font-weight: 500;
        }

        .resource-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading, #0f172a);
          line-height: 1.35;
          margin: 0 0 8px;
        }

        .resource-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-body, #64748b);
          margin: 0 0 16px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-bottom {
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pages-count {
          font-size: 12px;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .consult-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: #1e1b4b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .featured-card:hover .consult-btn {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        @media (max-width: 1024px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .featured-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  );
};
