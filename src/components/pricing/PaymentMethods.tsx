'use client';

import React from 'react';
import { PAYMENT_METHODS } from '@/data/pricingPlans';

export const PaymentMethods: React.FC = () => {
  return (
    <section className="payment-methods-section" id="paiements">
      <div className="container">
        <div className="payment-box">
          {/* Section Header */}
          <div className="payment-header">
            <div className="badge-pill payment-badge">
              <span className="badge-dot" />
              <span>Modes de paiement acceptés</span>
            </div>

            <h2 className="payment-title">
              Réglez en toute sécurité avec <span className="gradient-hero-text">Wave, Orange Money ou Carte</span>
            </h2>

            <p className="payment-subtitle">
              Activation immédiate de votre abonnement dès confirmation bancaire. Vos transactions sont chiffrées de bout en bout.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="payment-grid">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} className="payment-card">
                <div className="pm-top">
                  <div className={`pm-icon-wrap pm-icon-${method.iconName}`}>
                    {method.iconName === 'wave' && (
                      <img
                        src="/images/payments/wave-logo.png"
                        alt="Logo Wave Sénégal"
                        className="pm-logo-img"
                      />
                    )}
                    {method.iconName === 'orange-money' && (
                      <img
                        src="/images/payments/orange-money-logo.png"
                        alt="Logo Orange Money Sénégal"
                        className="pm-logo-img"
                      />
                    )}
                    {method.iconName === 'card' && (
                      <img
                        src="/images/payments/card-logo.png"
                        alt="Logo Carte Bancaire Mastercard"
                        className="pm-logo-img pm-card-img"
                      />
                    )}
                  </div>

                  <span
                    className="pm-badge"
                    style={{ backgroundColor: `${method.badgeColor}15`, color: method.badgeColor }}
                  >
                    {method.badge}
                  </span>
                </div>

                <h3 className="pm-name">{method.name}</h3>
                <p className="pm-tagline">{method.tagline}</p>
                <p className="pm-desc">{method.description}</p>
              </div>
            ))}
          </div>

          {/* Security Banner footer */}
          <div className="payment-security-banner">
            <div className="security-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="security-text">
              <span className="security-title">Protocole bancaire sécurisé SSL 256-bit</span>
              <span className="security-detail">
                Sunubiblio ne conserve aucune donnée bancaire sensible. Toutes les informations transitent directement via des serveurs bancaires certifiés PCI-DSS.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-methods-section {
          padding: 30px 0 60px 0;
          position: relative;
        }

        .payment-box {
          background: linear-gradient(180deg, #ffffff 0%, #fcfaff 100%);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-card);
          padding: 48px 36px;
        }

        .payment-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .payment-badge {
          margin-bottom: 16px;
        }

        .payment-title {
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .payment-subtitle {
          font-size: clamp(14px, 1.8vw, 16px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 36px;
        }

        .payment-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 28px 24px;
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .payment-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .pm-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .pm-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
        }

        .pm-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pm-icon-wave {
          background: #00b0f4;
        }

        .pm-icon-orange-money {
          background: #ffffff;
          border: 1px solid #fed7aa;
        }

        .pm-icon-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
        }

        .pm-card-img {
          object-fit: contain;
          padding: 6px;
        }

        .pm-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.02em;
        }

        .pm-name {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 6px;
        }

        .pm-tagline {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .pm-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .payment-security-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
        }

        .security-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .security-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .security-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .security-detail {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .payment-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .payment-box {
            padding: 32px 20px;
          }
        }

        @media (max-width: 640px) {
          .payment-security-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};
