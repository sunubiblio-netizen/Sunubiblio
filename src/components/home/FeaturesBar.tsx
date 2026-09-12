import React from 'react';
import { FEATURES } from '@/data/categories';

export const FeaturesBar: React.FC = () => {
  const renderIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'zap':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case 'shield':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'device':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="14" height="12" rx="2" />
            <polygon points="6 15 6 18 12 18 12 15" />
            <line x1="4" y1="18" x2="14" y2="18" />
            <rect x="16" y="8" width="6" height="12" rx="1.5" />
          </svg>
        );
      case 'heart':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="features-bar-section">
      <div className="container">
        <div className="features-wrapper">
          {FEATURES.map((feat, idx) => (
            <React.Fragment key={feat.id}>
              <div className="feature-item">
                <div className="feature-icon-circle" style={{ backgroundColor: feat.iconBg }}>
                  {renderIcon(feat.icon, feat.iconColor)}
                </div>
                <div className="feature-texts">
                  <h4 className="feature-title">{feat.title}</h4>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              </div>
              {idx < FEATURES.length - 1 && <div className="feature-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
