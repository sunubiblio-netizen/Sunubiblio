'use client';

import React from 'react';
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
      case 'tree':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22v-7" />
            <path d="M17 14a5 5 0 0 0-10 0" />
            <path d="M19 10a7 7 0 0 0-14 0" />
            <path d="M21 6a9 9 0 0 0-18 0" />
          </svg>
        );
      case 'khanda':
      case 'compass':
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
    <section className="traditions-overview-section" id="toutes-les-traditions">
      <div className="container">
        <div className="religion-section-header">
          <div>
            <div className="section-pill-tag">Grandes Traditions du Monde</div>
            <h2 className="religion-section-title">Les 8 Grandes Traditions Spirituelles</h2>
            <p className="religion-section-subtitle">
              Une classification universelle respectueuse permettant d'explorer les sagesses, écritures et philosophies.
            </p>
          </div>
        </div>

        <div className="traditions-cards-grid">
          {traditions.map((trad) => {
            const isSelected = selectedTraditionId === trad.id;
            return (
              <button
                key={trad.id}
                type="button"
                className={`tradition-card-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectTradition(trad.id)}
                style={{
                  '--trad-accent': trad.accentColor,
                  '--trad-bg': trad.bgLight,
                } as React.CSSProperties}
              >
                <div className="trad-card-head">
                  <div
                    className="trad-icon-wrap"
                    style={{ backgroundColor: trad.bgLight, color: trad.accentColor }}
                  >
                    {renderIcon(trad.iconName, trad.accentColor)}
                  </div>
                  <span
                    className="trad-badge"
                    style={{
                      backgroundColor: trad.bgLight,
                      color: trad.accentColor,
                      borderColor: trad.borderColor,
                    }}
                  >
                    {trad.badge}
                  </span>
                </div>

                <h3 className="trad-title">{trad.title}</h3>
                <p className="trad-subtitle">{trad.subtitle}</p>
                <p className="trad-desc">{trad.description}</p>

                <div className="trad-card-foot">
                  <span className="trad-count">
                    {trad.branchesCount} courant{trad.branchesCount > 1 ? 's' : ''} &bull; {trad.resourceCount} œuvre{trad.resourceCount > 1 ? 's' : ''}
                  </span>
                  <span className="trad-arrow" style={{ color: trad.accentColor }}>
                    {isSelected ? 'Sélectionné ✓' : 'Explorer →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
