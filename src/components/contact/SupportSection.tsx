'use client';

import React from 'react';

interface SupportSectionProps {
  onSelectSubscriptionHelp: () => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ onSelectSubscriptionHelp }) => {
  return (
    <section className="support-section" id="support-abonnement">
      <div className="container">
        <div className="support-card-box">
          <div className="support-icon-sphere">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </div>

          <div className="support-content">
            <h2 className="support-title">Besoin d’aide avec votre abonnement ?</h2>
            <p className="support-desc">
              Notre équipe peut vous aider concernant votre formule, votre paiement Wave ou Orange Money, ou le déblocage immédiat de vos ressources.
            </p>
          </div>

          <div className="support-action">
            <button
              type="button"
              className="btn-primary support-cta-btn"
              onClick={onSelectSubscriptionHelp}
            >
              <span>Contacter le support</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .support-section {
          padding: 20px 0 40px 0;
          position: relative;
        }

        .support-card-box {
          background: linear-gradient(135deg, #ffffff 0%, #fcfaff 100%);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: var(--radius-2xl);
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          box-shadow: var(--shadow-sm);
        }

        .support-icon-sphere {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.15);
        }

        .support-content {
          flex: 1;
        }

        .support-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }

        .support-desc {
          font-size: 14px;
          color: var(--text-body);
          line-height: 1.55;
        }

        .support-action {
          flex-shrink: 0;
        }

        .support-cta-btn {
          padding: 12px 24px;
          font-size: 14px;
          white-space: nowrap;
        }

        @media (max-width: 860px) {
          .support-card-box {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
            gap: 20px;
          }

          .support-action {
            width: 100%;
          }

          .support-cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
