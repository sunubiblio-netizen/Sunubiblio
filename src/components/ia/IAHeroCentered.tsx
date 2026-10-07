'use client';

import React from 'react';
import Link from 'next/link';

interface IAHeroCenteredProps {
  onNewChat?: () => void;
  isConversationActive?: boolean;
}

export const IAHeroCentered: React.FC<IAHeroCenteredProps> = ({
  onNewChat,
  isConversationActive = false
}) => {
  return (
    <header className="ia-header-centered-root">
      <div className="container">
        {/* Bloc Titre STRICTEMENT CENTRÉ */}
        <div className="hero-center-box">
          <div className="ai-badge-pill">
            <span className="badge-sparkle-dot"></span>
            <span>Assistant Intelligent Sunubiblio</span>
          </div>

          <h1 className="main-title">
            Assistant <span className="gradient-ai-text">IA</span>
          </h1>

          <p className="main-subtitle">
            Votre tuteur intelligent pour résumer, comprendre et apprendre
          </p>

          {!isConversationActive && (
            <>
              <p className="main-description">
                Analysez vos cours, vulgarisez des concepts complexes et obtenez des explications claires et fiables.
              </p>

              {/* Les 3 Options Clés Demandées : 1. Résumer, 2. Expliquer, 3. Assistant général */}
              <div className="ai-three-options-grid">
                <Link href="/ia/resumer" className="ai-option-card">
                  <div className="option-icon-wrap icon-resumer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="21" y1="10" x2="3" y2="10" />
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="14" x2="3" y2="14" />
                      <line x1="21" y1="18" x2="13" y2="18" />
                    </svg>
                  </div>
                  <div className="option-text-meta">
                    <span className="option-number">Option 1</span>
                    <h2 className="option-title">1. Résumer</h2>
                    <p className="option-desc">Synthèse automatique de cours et longs documents</p>
                  </div>
                </Link>

                <Link href="/ia/expliquer" className="ai-option-card">
                  <div className="option-icon-wrap icon-expliquer">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div className="option-text-meta">
                    <span className="option-number">Option 2</span>
                    <h2 className="option-title">2. Expliquer</h2>
                    <p className="option-desc">Pédagogie pas-à-pas et vulgarisation adaptée</p>
                  </div>
                </Link>

                <Link href="/ia/assistant" className="ai-option-card">
                  <div className="option-icon-wrap icon-general">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="option-text-meta">
                    <span className="option-number">Option 3</span>
                    <h2 className="option-title">3. Assistant général</h2>
                    <p className="option-desc">Dialogue libre et tuteur interactif continu</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .ia-header-centered-root {
          padding: ${isConversationActive ? '28px 0 16px 0' : '44px 0 20px 0'};
          position: relative;
          text-align: center;
          background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
          border-bottom: ${isConversationActive ? '1px solid rgba(226, 232, 240, 0.7)' : 'none'};
          transition: all 0.3s ease;
        }

        .hero-center-box {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ai-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 14px;
        }

        .badge-sparkle-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 10px #6366f1;
        }

        .main-title {
          font-size: clamp(32px, 4.5vw, 46px);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          margin: 0 0 10px 0;
          letter-spacing: -0.025em;
          text-align: center;
          width: 100%;
        }

        .gradient-ai-text {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 45%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-subtitle {
          font-size: clamp(16px, 2.4vw, 20px);
          font-weight: 600;
          color: #475569;
          margin: 0 0 10px 0;
          line-height: 1.4;
          text-align: center;
          width: 100%;
        }

        .main-description {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 auto 22px;
          max-width: 620px;
          text-align: center;
        }

        .ai-three-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 24px;
          text-align: left;
        }

        .ai-option-card {
          text-decoration: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ai-option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -4px rgba(99, 102, 241, 0.15);
          border-color: #a5b4fc;
        }

        .option-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-resumer {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-expliquer {
          background: #fdf2f8;
          color: #db2777;
        }

        .icon-general {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .option-text-meta {
          flex: 1;
        }

        .option-number {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6366f1;
          letter-spacing: 0.04em;
        }

        .option-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 2px 0;
        }

        .option-desc {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }

        @media (max-width: 768px) {
          .ai-three-options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </header>
  );
};
