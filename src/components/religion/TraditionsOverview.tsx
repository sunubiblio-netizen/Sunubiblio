'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ReligionTradition, ReligionTraditionId } from '@/types/religion';

interface TraditionsOverviewProps {
  traditions: ReligionTradition[];
  selectedTraditionId: ReligionTraditionId | null;
  onSelectTradition: (traditionId: ReligionTraditionId) => void;
}

export const TraditionsOverview: React.FC<TraditionsOverviewProps> = ({
  traditions,
  selectedTraditionId,
  onSelectTradition,
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
  // Filter for the 8 primary world traditions in the required order
  const PRIMARY_IDS: ReligionTraditionId[] = [
    'islam',
    'christianisme',
    'judaisme',
    'hindouisme',
    'bouddhisme',
    'sikhisme',
    'taoisme',
    'religions-traditionnelles-africaines',
  ];

  const primaryTraditions = PRIMARY_IDS.map(
    (id) => traditions.find((t) => t.id === id)
  ).filter(Boolean) as ReligionTradition[];

  const renderIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'crescent':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        );
      case 'cross':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="6" y1="8" x2="18" y2="8" />
          </svg>
        );
      case 'star-david':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2" />
          </svg>
        );
      case 'lotus':
      case 'wheel':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="3" x2="12" y2="9" />
            <line x1="12" y1="15" x2="12" y2="21" />
            <line x1="3" y1="12" x2="9" y2="12" />
            <line x1="15" y1="12" x2="21" y2="12" />
          </svg>
        );
      case 'khanda':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="4" x2="12" y2="20" />
            <path d="M7 10c0 4 5 7 5 7s5-3 5-7" />
          </svg>
        );
      case 'yin-yang':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a5 5 0 0 0 0 10 5 5 0 0 1 0 10" />
            <circle cx="12" cy="7" r="1.5" fill={color} />
            <circle cx="12" cy="17" r="1.5" fill="none" stroke={color} strokeWidth="1.5" />
          </svg>
        );
      case 'tree':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22v-7" />
            <path d="M17 14a5 5 0 0 0-10 0" />
            <path d="M19 10a7 7 0 0 0-14 0" />
            <path d="M21 6a9 9 0 0 0-18 0" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
    }
  };

  return (
    <section className="categories-section traditions-overview-section" id="grandes-traditions">
      <div className="container">
        {/* Section Header matching Sunubiblio standard */}
        <div className="section-header">
          <div className="header-left">
            <div className="section-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <h2 className="section-title">Les grandes traditions spirituelles</h2>
              <p className="section-subtitle">
                Découvrez les principales traditions spirituelles et religieuses à travers le monde.
              </p>
            </div>
          </div>
        </div>

        {/* 8 Cards Grid matching Sunubiblio design */}
        <div className="traditions-cards-grid">
          {primaryTraditions.map((trad) => {
            const isSelected = selectedTraditionId === trad.id;
            return (
              <div
                key={trad.id}
                className={`tradition-card ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleCardClick(trad.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(trad.id);
                  }
                }}
              >
                <div className="trad-top">
                  <div
                    className="trad-icon-wrapper"
                    style={{ backgroundColor: trad.bgLight }}
                  >
                    {renderIcon(trad.iconName, trad.accentColor)}
                  </div>
                  {trad.badge && (
                    <span
                      className="trad-badge-pill"
                      style={{
                        backgroundColor: trad.bgLight,
                        color: trad.accentColor,
                        borderColor: trad.borderColor,
                      }}
                    >
                      {trad.badge}
                    </span>
                  )}
                </div>

                <h3 className="trad-title">{trad.title}</h3>
                <p className="trad-desc">{trad.description}</p>

                <div className="trad-footer">
                  {trad.resourceCount > 0 ? (
                    <span className="trad-resource-count">
                      {trad.resourceCount} document{trad.resourceCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="trad-resource-count text-muted">À venir</span>
                  )}
                  <span
                    className="trad-explore-btn"
                    style={{ color: trad.accentColor }}
                  >
                    <span>Découvrir</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .traditions-overview-section {
          padding: 36px 0 44px 0;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        .traditions-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          width: 100%;
        }

        .tradition-card {
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

        .tradition-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 32px -4px rgba(79, 70, 229, 0.1);
        }

        .tradition-card.is-active {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          background: #fafaff;
        }

        .trad-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .trad-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .tradition-card:hover .trad-icon-wrapper {
          transform: scale(1.06);
        }

        .trad-badge-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 9999px;
          border: 1px solid transparent;
        }

        .trad-title {
          font-size: 16.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        .trad-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 16px 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .trad-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .trad-resource-count {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
        }

        .trad-explore-btn {
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

        .tradition-card:hover .trad-explore-btn {
          transform: translateX(3px);
        }

        @media (max-width: 1080px) {
          .traditions-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .traditions-cards-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .tradition-card {
            padding: 18px 16px 16px;
          }
        }
      `}</style>
    </section>
  );
};
