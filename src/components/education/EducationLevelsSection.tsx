'use client';

import React from 'react';
import { EDUCATION_LEVELS } from '@/data/educationData';
import { EducationLevelCard, EducationCycleId } from '@/types/education';

interface EducationLevelsSectionProps {
  selectedLevel: EducationCycleId | 'all';
  onSelectLevel: (levelId: EducationCycleId | 'all') => void;
  onOpenLevelModal?: (level: EducationLevelCard) => void;
}

export const EducationLevelsSection: React.FC<EducationLevelsSectionProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  const handleCardClick = (levelId: EducationCycleId) => {
    onSelectLevel(selectedLevel === levelId ? 'all' : levelId);
    // Smooth scroll directly to the catalog section
    const target = document.getElementById('ressources');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getLevelIcon = (id: EducationCycleId) => {
    switch (id) {
      case 'prescolaire':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'primaire':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'college':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'lycee':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      case 'universite':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L2 8h20L12 3z" />
            <path d="M4 10v8M8 10v8M12 10v8M16 10v8M20 10v8" />
            <path d="M2 18h20M2 21h20" />
          </svg>
        );
      case 'formation_pro':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
    }
  };

  return (
    <section className="levels-section-wrap" id="niveaux">
      <div className="container">
        {/* Centered Designed Header */}
        <div className="levels-center-header">
          <div className="levels-badge-pill">
            <span className="badge-pulse-dot" />
            <span>Parcours d’apprentissage</span>
          </div>

          <h2 className="levels-main-title">
            Explorez par <span className="levels-title-accent">niveau scolaire & académique</span>
          </h2>

          <p className="levels-main-desc">
            Du préscolaire aux études universitaires et professionnelles, choisissez votre cycle
            pour filtrer instantanément les documents certifiés conformes au Sénégal.
          </p>
        </div>

        {/* 6 High-End Level Cards Grid */}
        <div className="levels-cards-grid">
          {EDUCATION_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <div
                key={level.id}
                className={`edu-card ${isSelected ? 'edu-card-active' : ''} ${level.image ? 'has-banner' : ''}`}
                onClick={() => handleCardClick(level.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(level.id);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Sélectionner le niveau ${level.title}`}
              >
                {/* Image illustrative en arrière-plan avec fondu dégradé doux (conserve la taille originale) */}
                {level.image && (
                  <div className="edu-card-backdrop" aria-hidden="true">
                    <img
                      src={level.image}
                      alt=""
                      className="edu-backdrop-img"
                      style={level.imagePosition ? { objectPosition: level.imagePosition } : undefined}
                    />
                    <div className="edu-backdrop-gradient" />
                  </div>
                )}

                <div className="edu-card-body">
                  {/* Top Row: Icon + Badge */}
                  <div className="edu-card-top">
                    <div
                      className="edu-card-icon"
                      style={
                        level.image
                          ? {
                              background: 'transparent',
                              color: '#ffffff',
                              boxShadow: 'none',
                            }
                          : {
                              background: level.iconBg,
                              color: level.iconColor,
                            }
                      }
                    >
                      {getLevelIcon(level.id)}
                    </div>

                    <span
                      className="edu-card-badge"
                      style={
                        level.image
                          ? {
                              background: 'transparent',
                              color: '#ffffff',
                              boxShadow: 'none',
                            }
                          : {
                              color: level.iconColor,
                              background: level.iconBg,
                            }
                      }
                    >
                      {level.badge}
                    </span>
                  </div>

                  {/* Card Title & Subtitle */}
                  <div className="edu-card-title-wrap">
                    <h3 className="edu-card-title">{level.title}</h3>
                  </div>
                  <div className="edu-card-subtitle">{level.subtitle}</div>

                  {/* Description */}
                  <p className="edu-card-desc">{level.description}</p>

                  {/* Grades Preview Pills */}
                  <div className="edu-grades-row">
                    {level.grades.slice(0, 3).map((g) => (
                      <span key={g} className="edu-grade-pill">
                        {g}
                      </span>
                    ))}
                    {level.grades.length > 3 && (
                      <span className="edu-grade-pill edu-grade-more">
                        +{level.grades.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Footer Action */}
                  <div className="edu-card-footer">
                    <span className="edu-action-label">
                      {isSelected ? '✓ Niveau actif (Afficher)' : 'Explorer les ressources'}
                    </span>
                    <div className="edu-action-arrow">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .levels-section-wrap {
          padding: 64px 0 54px;
          background: transparent;
        }

        /* Scoped Centered Header without class conflicts */
        .levels-center-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 48px;
        }

        .levels-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 14px;
        }

        .badge-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
        }

        .levels-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .levels-main-title {
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin: 0 0 12px 0;
        }

        .levels-main-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        /* 6 Cards Grid */
        .levels-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .edu-card {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          outline: none;
          position: relative;
          overflow: hidden;
        }

        .edu-card-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 205px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .edu-backdrop-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          -webkit-mask-image: linear-gradient(
            to bottom,
            #000000 0%,
            #000000 68%,
            rgba(0, 0, 0, 0.25) 88%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            #000000 0%,
            #000000 68%,
            rgba(0, 0, 0, 0.25) 88%,
            transparent 100%
          );
        }

        .edu-backdrop-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.05) 18%,
            transparent 32%,
            rgba(241, 245, 249, 0.4) 48%,
            rgba(248, 250, 252, 0.88) 68%,
            rgba(255, 255, 255, 0.98) 88%,
            #ffffff 100%
          );
        }

        .edu-card-active .edu-backdrop-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.05) 18%,
            transparent 32%,
            rgba(241, 245, 249, 0.4) 48%,
            rgba(255, 253, 250, 0.88) 68%,
            rgba(255, 253, 250, 0.98) 88%,
            #fffdfa 100%
          );
        }

        .edu-card:hover .edu-backdrop-img {
          transform: scale(1.04);
        }

        .edu-card-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .edu-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 16px 32px -8px rgba(217, 119, 6, 0.12);
        }

        .edu-card-active {
          border-color: #d97706;
          box-shadow: 0 0 0 3.5px rgba(245, 158, 11, 0.18), 0 12px 28px -6px rgba(217, 119, 6, 0.12);
          background: #fffdfa;
        }

        .edu-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .has-banner .edu-card-top {
          margin-bottom: 58px;
        }

        .edu-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          border: none;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
        }

        .has-banner .edu-card-icon {
          width: 26px;
          height: 26px;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
        }

        .has-banner .edu-card-icon svg {
          width: 22px;
          height: 22px;
        }

        .edu-card:hover .edu-card-icon {
          transform: scale(1.06);
        }

        .edu-card-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: none;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.1);
        }

        .has-banner .edu-card-badge {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .edu-card-title-wrap {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 9px;
          padding: 2px 10px;
          margin: 0 0 5px -2px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        .edu-card:hover .edu-card-title-wrap {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(245, 158, 11, 0.35);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.08);
        }

        .edu-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #b45309;
          background: linear-gradient(135deg, #9a3412 0%, #d97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.25;
          transition: all 0.25s ease;
        }

        .edu-card:hover .edu-card-title {
          background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .edu-card-subtitle {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .edu-card-desc {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
          margin: 0 0 14px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .edu-grades-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .edu-grade-pill {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 9px;
          border-radius: 6px;
        }

        .edu-grade-more {
          color: #475569;
          background: #e2e8f0;
          font-weight: 700;
        }

        .edu-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .edu-action-label {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          transition: color 0.15s ease;
        }

        .edu-card:hover .edu-action-label {
          color: #d97706;
        }

        .edu-action-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .edu-card:hover .edu-action-arrow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .levels-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .levels-section-wrap {
            padding: 44px 0 36px;
          }

          .levels-main-title {
            font-size: 26px;
          }

          .levels-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
};
