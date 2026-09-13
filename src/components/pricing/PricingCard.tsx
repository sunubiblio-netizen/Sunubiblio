'use client';

import React from 'react';
import { PricingPlan } from '@/types/pricing';

interface PricingCardProps {
  plan: PricingPlan;
  isCurrent?: boolean;
  onSelect: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrent = false,
  onSelect,
}) => {
  const isRecommended = plan.isPopular;
  const isGold = plan.isGold;

  return (
    <div
      className={`pricing-card ${isRecommended ? 'card-recommended' : ''} ${
        isGold ? 'card-gold' : ''
      }`}
    >
      {/* Recommended Top Badge */}
      {plan.badge && (
        <div className="card-badge-container">
          <span className="badge-recommended">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Gold Top Badge */}
      {isGold && !plan.badge && (
        <div className="card-badge-container">
          <span className="badge-gold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 3h12l4 6-10 13L2 9z" />
            </svg>
            EXCELLENCE VIP
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="card-header">
        <div className="plan-name-row">
          <h3 className="plan-name">{plan.name}</h3>
        </div>

        <p className="plan-desc">{plan.description}</p>

        {/* Pricing tag */}
        <div className="price-container">
          <div className="price-main">
            <span className="price-amount">{plan.formattedPrice}</span>
            <span className="price-period">{plan.periodLabel}</span>
          </div>
          <span className="billing-note">
            {plan.price === 0 ? 'Sans carte bancaire' : 'Facturation mensuelle sans engagement'}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="card-cta-wrapper">
        <button
          type="button"
          className={`pricing-cta-btn ${
            isRecommended
              ? 'btn-cta-primary'
              : isGold
              ? 'btn-cta-gold'
              : 'btn-cta-secondary'
          }`}
          onClick={() => onSelect(plan)}
        >
          <span>{plan.ctaText}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Feature Divider */}
      <div className="card-divider">
        <span>Inclus dans cette formule</span>
      </div>

      {/* Feature list */}
      <ul className="features-list">
        {plan.features.map((feature) => (
          <li
            key={feature.id}
            className={`feature-item ${
              feature.included ? 'feature-included' : 'feature-excluded'
            } ${feature.highlight ? 'feature-highlight' : ''}`}
          >
            <div className="feature-icon" aria-hidden="true">
              {feature.included ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>

            <span className="feature-label">
              {feature.label}
              {feature.highlight && (
                <span className="feature-star-badge" title="Point fort">★</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .pricing-card {
          position: relative;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-card);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all var(--transition-normal);
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
        }

        /* Recommended Card Highlights */
        .card-recommended {
          border: 2px solid #6366f1;
          box-shadow: 0 16px 36px -4px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(15, 23, 42, 0.04);
          background: linear-gradient(180deg, #ffffff 0%, #fdfcff 100%);
        }

        .card-gold {
          border: 1.5px solid rgba(234, 179, 8, 0.4);
          background: linear-gradient(180deg, #ffffff 0%, #fffdfa 100%);
        }

        .card-badge-container {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .badge-recommended {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          color: #ffffff;
          padding: 5px 16px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          white-space: nowrap;
        }

        .badge-gold {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #7c3aed 100%);
          color: #ffffff;
          padding: 5px 16px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          white-space: nowrap;
        }

        .card-header {
          margin-bottom: 24px;
        }

        .plan-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .plan-name {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
        }

        .plan-desc {
          font-size: 14px;
          color: var(--text-muted);
          min-height: 42px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .price-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price-amount {
          font-size: 34px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .price-period {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .billing-note {
          font-size: 12px;
          color: var(--text-faint);
          font-weight: 500;
        }

        .card-cta-wrapper {
          margin-bottom: 24px;
        }

        .pricing-cta-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 700;
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .btn-cta-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #9333ea 100%);
          color: #ffffff;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.55);
        }

        .btn-cta-secondary {
          background: var(--surface-subtle);
          color: var(--text-heading);
          border: 1px solid var(--border-subtle);
        }

        .btn-cta-secondary:hover {
          background: #ffffff;
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-1px);
        }

        .btn-cta-gold {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%);
          color: #ffffff;
          border: 1px solid rgba(234, 179, 8, 0.35);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.25);
        }

        .btn-cta-gold:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
        }

        .card-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .card-divider::before,
        .card-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
        }

        .card-divider span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-faint);
          white-space: nowrap;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          line-height: 1.45;
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .feature-included .feature-icon {
          background: #ecfdf5;
          color: #10b981;
        }

        .card-recommended .feature-included .feature-icon {
          background: #eef2ff;
          color: #6366f1;
        }

        .feature-excluded {
          opacity: 0.45;
        }

        .feature-excluded .feature-icon {
          background: #f1f5f9;
          color: var(--text-faint);
        }

        .feature-label {
          color: var(--text-body);
        }

        .feature-highlight .feature-label {
          font-weight: 700;
          color: var(--text-heading);
        }

        .feature-star-badge {
          display: inline-block;
          margin-left: 6px;
          color: #f59e0b;
          font-size: 12px;
        }

        @media (max-width: 640px) {
          .pricing-card {
            padding: 26px 18px;
          }

          .price-amount {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};
