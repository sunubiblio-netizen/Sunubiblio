'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ReligionTradition, ReligionTraditionId } from '@/types/religion';

interface ReligionTraditionsSectionProps {
  traditions: ReligionTradition[];
}

export const ReligionTraditionsSection: React.FC<ReligionTraditionsSectionProps> = ({
  traditions,
}) => {
  const router = useRouter();

  const getTraditionSlug = (id: ReligionTraditionId): string => {
    if (id === 'religions-traditionnelles-africaines') return 'spiritualites-africaines';
    return id;
  };

  const handleCardClick = (tradId: ReligionTraditionId) => {
    const slug = getTraditionSlug(tradId);
    router.push(`/religion/${slug}`);
  };

  // Les 6 grandes traditions dans l'ordre exact demandé par l'utilisateur:
  // 1: Islam, 2: Christianisme, 3: Judaïsme, 4: Bouddhisme, 5: Hindouisme, 6: Spiritualités africaines
  const DISPLAYED_IDS: ReligionTraditionId[] = [
    'islam',
    'christianisme',
    'judaisme',
    'bouddhisme',
    'hindouisme',
    'religions-traditionnelles-africaines',
  ];

  const primaryTraditions = DISPLAYED_IDS.map((id) =>
    traditions.find((t) => t.id === id)
  ).filter(Boolean) as ReligionTradition[];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'crescent':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        );
      case 'cross':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="6" y1="8" x2="18" y2="8" />
          </svg>
        );
      case 'star-david':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2" />
          </svg>
        );
      case 'wheel':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="3" x2="12" y2="9" />
            <line x1="12" y1="15" x2="12" y2="21" />
            <line x1="3" y1="12" x2="9" y2="12" />
            <line x1="15" y1="12" x2="21" y2="12" />
          </svg>
        );
      case 'lotus':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 0 1 9 9c0 5-4 9-9 9s-9-4-9-9a9 9 0 0 1 9-9Z" />
            <path d="M12 8a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4s-4-1.8-4-4a4 4 0 0 1 4-4Z" />
          </svg>
        );
      case 'tree':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22v-7" />
            <path d="M17 14a5 5 0 0 0-10 0" />
            <path d="M19 10a7 7 0 0 0-14 0" />
            <path d="M21 6a9 9 0 0 0-18 0" />
          </svg>
        );
    }
  };

  return (
    <section className="religion-traditions-section-wrap" id="traditions">
      <div className="container">
        {/* En-tête centré rigoureusement identique à Éducation */}
        <div className="traditions-center-header">
          <div className="traditions-badge-pill">
            <span className="badge-pulse-dot" />
            <span>Grandes Traditions & Sagesses</span>
          </div>

          <h2 className="traditions-main-title">
            Explorez par <span className="traditions-title-accent">tradition spirituelle & confession</span>
          </h2>

          <p className="traditions-main-desc">
            De la théologie musulmane et des confréries du Sénégal aux écrits chrétiens, cosmogonies africaines et sagesses universelles : choisissez une tradition pour accéder directement à sa bibliothèque certifiée.
          </p>
        </div>

        {/* Grille de 6 Cartes Immersives (Même structure, dimension, typographie et effets que Éducation) */}
        <div className="traditions-cards-grid">
          {primaryTraditions.map((trad) => {
            const hasBanner = Boolean(trad.image);

            return (
              <div
                key={trad.id}
                className={`rel-card ${hasBanner ? 'has-banner' : ''}`}
                onClick={() => handleCardClick(trad.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(trad.id);
                  }
                }}
                aria-label={`Découvrir la tradition ${trad.title}`}
              >
                {/* Image d'arrière-plan avec fondu dégradé doux vers le blanc pur (#ffffff) */}
                {trad.image && (
                  <div className="rel-card-backdrop" aria-hidden="true">
                    <img
                      src={trad.image}
                      alt=""
                      className="rel-backdrop-img"
                      style={trad.imagePosition ? { objectPosition: trad.imagePosition } : undefined}
                    />
                    <div className="rel-backdrop-gradient" />
                  </div>
                )}

                <div className="rel-card-body">
                  {/* Top Row: Icon + Badge */}
                  <div className="rel-card-top">
                    <div
                      className="rel-card-icon"
                      style={
                        trad.image
                          ? {
                              background: 'transparent',
                              color: '#ffffff',
                              boxShadow: 'none',
                            }
                          : {
                              background: trad.bgLight,
                              color: trad.accentColor,
                            }
                      }
                    >
                      {renderIcon(trad.iconName)}
                    </div>

                    <span
                      className="rel-card-badge"
                      style={
                        trad.image
                          ? {
                              background: 'transparent',
                              color: '#ffffff',
                              boxShadow: 'none',
                            }
                          : {
                              color: trad.accentColor,
                              background: trad.bgLight,
                            }
                      }
                    >
                      {trad.badge}
                    </span>
                  </div>

                  {/* Card Title & Subtitle avec pillule floue protectrice identique à Éducation */}
                  <div className="rel-card-title-wrap">
                    <h3 className="rel-card-title">{trad.title}</h3>
                  </div>
                  <div className="rel-card-subtitle">{trad.subtitle}</div>

                  {/* Description concise */}
                  <p className="rel-card-desc">{trad.description}</p>

                  {/* Courants / Branches Preview Pills */}
                  {trad.grades && trad.grades.length > 0 && (
                    <div className="rel-grades-row">
                      {trad.grades.slice(0, 3).map((g) => (
                        <span key={g} className="rel-grade-pill">
                          {g}
                        </span>
                      ))}
                      {trad.grades.length > 3 && (
                        <span className="rel-grade-pill rel-grade-more">
                          +{trad.grades.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Footer Action */}
                  <div className="rel-card-footer">
                    <span className="rel-action-label">
                      {trad.resourceCount > 0
                        ? `Consulter les ${trad.resourceCount} ouvrages`
                        : 'Explorer la bibliothèque'}
                    </span>
                    <div className="rel-action-arrow">
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
        .religion-traditions-section-wrap {
          padding: 64px 0 54px;
          background: #ffffff !important;
          position: relative;
        }

        .traditions-center-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 48px;
        }

        .traditions-badge-pill {
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

        .traditions-main-title {
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin: 0 0 12px 0;
        }

        .traditions-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .traditions-main-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        /* 6 Cards Grid (Strictement identique à Éducation) */
        .traditions-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .rel-card {
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

        .rel-card-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 205px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .rel-backdrop-img {
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

        .rel-backdrop-gradient {
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

        .rel-card:hover .rel-backdrop-img {
          transform: scale(1.04);
        }

        .rel-card-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .rel-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 16px 32px -8px rgba(217, 119, 6, 0.12);
        }

        .rel-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .has-banner .rel-card-top {
          margin-bottom: 58px;
        }

        .rel-card-icon {
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

        .has-banner .rel-card-icon {
          width: 26px;
          height: 26px;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
          color: #ffffff;
        }

        .has-banner .rel-card-icon svg {
          width: 22px;
          height: 22px;
        }

        .rel-card:hover .rel-card-icon {
          transform: scale(1.06);
        }

        .rel-card-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: none;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.1);
        }

        .has-banner .rel-card-badge {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
          color: #ffffff;
        }

        .rel-card-title-wrap {
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

        .rel-card:hover .rel-card-title-wrap {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(245, 158, 11, 0.35);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.08);
        }

        .rel-card-title {
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

        .rel-card:hover .rel-card-title {
          background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rel-card-subtitle {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .rel-card-desc {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
          margin: 0 0 14px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rel-grades-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .rel-grade-pill {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 9px;
          border-radius: 6px;
        }

        .rel-grade-more {
          color: #475569;
          background: #e2e8f0;
          font-weight: 700;
        }

        .rel-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .rel-action-label {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          transition: color 0.15s ease;
        }

        .rel-card:hover .rel-action-label {
          color: #d97706;
        }

        .rel-action-arrow {
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

        .rel-card:hover .rel-action-arrow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .traditions-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .religion-traditions-section-wrap {
            padding: 44px 0 36px;
          }

          .traditions-main-title {
            font-size: 26px;
          }

          .traditions-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
};
