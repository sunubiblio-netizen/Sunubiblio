'use client';

import React from 'react';
import Link from 'next/link';

export const EducationCTA: React.FC = () => {
  return (
    <section className="education-cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-content">
            <div className="badge-pill cta-badge">
              <span className="badge-dot" />
              <span>Plateforme Universelle</span>
            </div>

            <h2 className="cta-title">Votre apprentissage commence ici</h2>

            <p className="cta-description">
              Trouvez les ressources dont vous avez besoin et avancez à votre rythme avec
              Sunubiblio. Accédez à des milliers d’ouvrages, cours et annales classés par cycle et
              matière.
            </p>

            <div className="cta-actions">
              <Link
                href="/bibliotheque"
                className="cta-btn"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 8px 24px -4px rgba(217, 119, 6, 0.45)',
                  color: '#ffffff',
                }}
              >
                <span>Explorer la bibliothèque</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="cta-graphic" aria-hidden="true">
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
              <circle cx="110" cy="110" r="90" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="110" cy="110" r="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <circle cx="110" cy="110" r="30" fill="rgba(255,255,255,0.15)" />
              <path d="M110 88 L124 102 L110 116 L96 102 Z" fill="#ffffff" />
              <path d="M110 116 L124 130 L110 144 L96 130 Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .education-cta-section {
          padding: 40px 0 70px;
          background: transparent;
        }

        .cta-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%);
          border-radius: 28px;
          padding: 56px 60px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 24px 50px -12px rgba(15, 23, 42, 0.25);
        }

        .cta-content {
          max-width: 600px;
          position: relative;
          z-index: 2;
        }

        .cta-badge {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
          margin-bottom: 18px;
        }

        .cta-badge :global(.badge-dot) {
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
        }

        .cta-title {
          font-size: 34px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 14px;
          line-height: 1.22;
          letter-spacing: -0.025em;
        }

        .cta-description {
          font-size: 16px;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 0 28px;
        }

        .cta-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border-radius: var(--radius-full, 9999px);
          box-shadow: 0 8px 24px -4px rgba(217, 119, 6, 0.4);
          transition: all 0.2s ease;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          box-shadow: 0 12px 28px -4px rgba(217, 119, 6, 0.55);
        }

        .cta-graphic {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
        }

        @media (max-width: 900px) {
          .cta-card {
            padding: 40px 32px;
          }

          .cta-graphic {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .education-cta-section {
            padding: 30px 0 50px;
          }

          .cta-card {
            padding: 32px 22px;
            border-radius: 20px;
          }

          .cta-title {
            font-size: 26px;
          }

          .cta-description {
            font-size: 14.5px;
          }

          .cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
