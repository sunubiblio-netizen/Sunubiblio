'use client';

import React, { useState } from 'react';
import { PRICING_FAQS } from '@/data/pricingPlans';

export const PricingFAQ: React.FC = () => {
  // State: open items (first item opened by default)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    faq_1: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="pricing-faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <div className="badge-pill faq-badge">
            <span className="badge-dot" />
            <span>Foire aux questions</span>
          </div>

          <h2 className="faq-title">
            Questions fréquentes sur nos <span className="gradient-hero-text">abonnements</span>
          </h2>

          <p className="faq-subtitle">
            Tout ce que vous devez savoir pour démarrer sereinement sur Sunubiblio.
          </p>
        </div>

        <div className="faq-accordion-list">
          {PRICING_FAQS.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className={`faq-card ${isOpen ? 'faq-card-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  id={`faq-btn-${faq.id}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <div className={`faq-chevron ${isOpen ? 'rotate' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    className="faq-answer"
                    id={`faq-ans-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support contact note */}
        <div className="faq-support-box">
          <div className="support-info">
            <span className="support-title">Une question spécifique ou un besoin particulier ?</span>
            <span className="support-desc">Notre équipe d’assistance éducative est à votre écoute pour vous orienter.</span>
          </div>
          <a
            href="mailto:contact@sunubiblio.sn"
            className="btn-secondary support-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Contacter le support</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .pricing-faq-section {
          padding: 60px 0 60px 0;
          position: relative;
        }

        .faq-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .faq-badge {
          margin-bottom: 16px;
        }

        .faq-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .faq-subtitle {
          font-size: clamp(14px, 1.8vw, 16px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .faq-accordion-list {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .faq-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-normal);
        }

        .faq-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: var(--shadow-sm);
        }

        .faq-card-open {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          text-align: left;
          background: transparent;
          cursor: pointer;
          gap: 16px;
        }

        .faq-question-text {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-heading);
          line-height: 1.4;
        }

        .faq-chevron {
          color: var(--text-muted);
          transition: transform 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .faq-chevron.rotate {
          transform: rotate(180deg);
          color: var(--primary);
        }

        .faq-answer {
          padding: 0 24px 22px 24px;
          border-top: 1px solid transparent;
        }

        .faq-card-open .faq-answer {
          border-top-color: #f1f5f9;
          padding-top: 16px;
        }

        .faq-answer p {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--text-body);
        }

        .faq-support-box {
          max-width: 840px;
          margin: 40px auto 0 auto;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 24px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .support-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .support-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .support-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        .support-btn {
          padding: 10px 20px;
          font-size: 13.5px;
          flex-shrink: 0;
        }

        @media (max-width: 680px) {
          .faq-question-btn {
            padding: 16px 18px;
          }

          .faq-question-text {
            font-size: 14.5px;
          }

          .faq-answer {
            padding: 0 18px 18px 18px;
          }

          .faq-support-box {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 18px;
          }

          .support-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
