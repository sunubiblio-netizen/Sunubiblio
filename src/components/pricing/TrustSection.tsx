'use client';

import React from 'react';
import { TRUST_POINTS } from '@/data/pricingPlans';

export const TrustSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'lock':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'book':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'devices':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'bolt':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-grid">
          {TRUST_POINTS.map((point, index) => (
            <div key={index} className="trust-item">
              <div className="trust-icon-box">
                {getIcon(point.icon)}
              </div>
              <h3 className="trust-title">{point.title}</h3>
              <p className="trust-desc">{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .trust-section {
          padding: 30px 0 50px 0;
          position: relative;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .trust-item {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 28px 22px;
          box-shadow: var(--shadow-xs);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all var(--transition-normal);
        }

        .trust-item:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .trust-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: #eef2ff;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .trust-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .trust-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
        }

        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 600px) {
          .trust-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .trust-item {
            padding: 22px 18px;
          }
        }
      `}</style>
    </section>
  );
};
