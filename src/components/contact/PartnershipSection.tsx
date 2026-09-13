'use client';

import React from 'react';

interface PartnershipSectionProps {
  onSelectPartnership: () => void;
}

export const PartnershipSection: React.FC<PartnershipSectionProps> = ({ onSelectPartnership }) => {
  return (
    <section className="partnership-section" id="partenariat">
      <div className="container">
        <div className="partnership-card-box">
          <div className="partnership-icon-sphere">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.3">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div className="partnership-content">
            <h2 className="partnership-title">Vous souhaitez collaborer avec Sunubiblio ?</h2>
            <p className="partnership-desc">
              Vous êtes une école, une université, un centre de formation, une organisation ou un créateur de contenu pédagogique ? Contactez-nous pour échanger sur une éventuelle collaboration éducative au Sénégal.
            </p>
          </div>

          <div className="partnership-action">
            <button
              type="button"
              className="btn-secondary partnership-cta-btn"
              onClick={onSelectPartnership}
            >
              <span>Proposer une collaboration</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .partnership-section {
          padding: 20px 0 60px 0;
          position: relative;
        }

        .partnership-card-box {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          box-shadow: var(--shadow-sm);
        }

        .partnership-icon-sphere {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #fdf4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.12);
        }

        .partnership-content {
          flex: 1;
        }

        .partnership-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }

        .partnership-desc {
          font-size: 14px;
          color: var(--text-body);
          line-height: 1.55;
        }

        .partnership-action {
          flex-shrink: 0;
        }

        .partnership-cta-btn {
          padding: 12px 24px;
          font-size: 14px;
          white-space: nowrap;
        }

        @media (max-width: 860px) {
          .partnership-card-box {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
            gap: 20px;
          }

          .partnership-action {
            width: 100%;
          }

          .partnership-cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
