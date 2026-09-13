'use client';

import React from 'react';
import { PricingPlan } from '@/types/pricing';
import { PRICING_PLANS } from '@/data/pricingPlans';
import { PricingCard } from './PricingCard';

interface PricingGridProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingGrid: React.FC<PricingGridProps> = ({ onSelectPlan }) => {
  return (
    <section className="pricing-grid-section" id="pricing-plans">
      <div className="container">
        <div className="pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-col ${plan.isPopular ? 'col-popular' : ''}`}
            >
              <PricingCard
                plan={plan}
                onSelect={onSelectPlan}
              />
            </div>
          ))}
        </div>

        {/* Footnote about prices and tax */}
        <div className="pricing-footnote">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            Tous les tarifs sont indiqués en Francs CFA (XOF) TTC. Aucun frais caché. Annulation possible à tout moment.
          </span>
        </div>
      </div>

      <style jsx>{`
        .pricing-grid-section {
          padding: 20px 0 60px 0;
          position: relative;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .pricing-col {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1100px) {
          .col-popular {
            transform: translateY(-8px);
          }
        }

        .pricing-footnote {
          margin-top: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          padding: 0 16px;
        }

        @media (max-width: 1080px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .pricing-footnote {
            font-size: 12px;
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </section>
  );
};
