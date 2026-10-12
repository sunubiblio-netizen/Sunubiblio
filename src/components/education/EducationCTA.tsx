'use client';

import React from 'react';
import Link from 'next/link';

export const EducationCTA: React.FC = () => {
  return (
    <section className="education-cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-content">
            <div className="cta-badge-pill">
              <span className="badge-pulse-dot" />
              <span>Plateforme universelle</span>
            </div>

            <h2 className="cta-title">
              Votre <span className="cta-title-accent">apprentissage</span> commence ici
            </h2>

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
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  height: '46px',
                  padding: '0 26px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>Explorer la bibliothèque</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="cta-graphic" aria-hidden="true">
            <div className="cta-graphic-glow" />
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ctaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="ctaCapShade" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="ctaBookPage" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
              </defs>

              {/* Cercles orbitaux dorés */}
              <circle cx="110" cy="110" r="96" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="110" cy="110" r="76" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="1.5" />
              <circle cx="110" cy="110" r="54" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="1.5" />

              {/* Étoiles scintillantes dorées */}
              <path d="M175 60 Q175 68 183 68 Q175 68 175 76 Q175 68 167 68 Q175 68 175 60 Z" fill="#fbbf24" opacity="0.9" />
              <path d="M45 155 Q45 161 51 161 Q45 161 45 167 Q45 161 39 161 Q45 161 45 155 Z" fill="#f59e0b" opacity="0.8" />
              <circle cx="56" cy="72" r="2.5" fill="#fbbf24" opacity="0.75" />
              <circle cx="170" cy="158" r="2.5" fill="#f59e0b" opacity="0.75" />

              {/* Toque académique (diplômé / réussite) */}
              <path
                d="M 110 72 L 152 90 L 110 108 L 68 90 Z"
                fill="url(#ctaGoldGrad)"
                stroke="#fef3c7"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 84 99 L 84 116 C 84 127 136 127 136 116 L 136 99"
                fill="url(#ctaCapShade)"
                stroke="rgba(245, 158, 11, 0.5)"
                strokeWidth="1"
              />
              <path
                d="M 110 90 Q 142 98 146 116"
                stroke="#fef3c7"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="146" cy="117" r="3.2" fill="#fef3c7" />

              {/* Livre ouvert du savoir */}
              <path
                d="M 110 134 L 110 152"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 110 135 C 97 130 80 131 68 136 L 68 152 C 80 147 97 146 110 151 Z"
                fill="url(#ctaBookPage)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 110 135 C 123 130 140 131 152 136 L 152 152 C 140 147 123 146 110 151 Z"
                fill="url(#ctaBookPage)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line x1="75" y1="140" x2="102" y2="137" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
              <line x1="75" y1="145" x2="98" y2="142" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
              <line x1="118" y1="137" x2="145" y2="140" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
              <line x1="122" y1="142" x2="145" y2="145" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
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
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.25);
        }

        .cta-content {
          max-width: 600px;
          position: relative;
          z-index: 2;
        }

        .cta-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 18px;
        }

        .badge-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);
        }

        .cta-title {
          font-size: 34px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 14px;
          line-height: 1.22;
          letter-spacing: -0.025em;
        }

        .cta-title-accent {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
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

        :global(.cta-actions .cta-btn) {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 9px !important;
          height: 46px !important;
          padding: 0 26px !important;
          font-size: 14.5px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: #ffffff !important;
          border-radius: 9999px !important;
          border: none !important;
          outline: none !important;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4) !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        :global(.cta-actions .cta-btn:hover) {
          transform: translateY(-2px) !important;
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.52) !important;
          color: #ffffff !important;
        }

        :global(.cta-actions .cta-btn:active) {
          transform: translateY(0) !important;
        }

        .cta-graphic {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 220px;
          height: 220px;
        }

        .cta-graphic-glow {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 55%, transparent 75%);
          filter: blur(12px);
          pointer-events: none;
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

          :global(.cta-actions .cta-btn) {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};
