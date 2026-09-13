'use client';

import React, { useState } from 'react';
import { CONTACT_FAQS } from '@/data/contactData';

export const ContactFAQ: React.FC = () => {
  // Only one question open at a time (first open by default)
  const [openId, setOpenId] = useState<string | null>('faq_contact_1');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="contact-faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <div className="badge-pill faq-badge">
            <span className="badge-dot" />
            <span>Assistance Rapide</span>
          </div>

          <h2 className="faq-title">
            Questions <span className="gradient-hero-text">fréquentes</span>
          </h2>

          <p className="faq-subtitle">
            Retrouvez rapidement les réponses aux interrogations les plus courantes sur le contact et l’assistance Sunubiblio.
          </p>
        </div>

        <div className="faq-list">
          {CONTACT_FAQS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-accordion-card ${isOpen ? 'card-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  id={`cfaq-btn-${item.id}`}
                >
                  <span className="question-text">{item.question}</span>
                  <div className={`faq-chevron ${isOpen ? 'rotate' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    className="faq-answer-pane"
                    id={`cfaq-ans-${item.id}`}
                    role="region"
                    aria-labelledby={`cfaq-btn-${item.id}`}
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .contact-faq-section {
          padding: 50px 0 60px 0;
          position: relative;
        }

        .faq-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 36px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .faq-badge {
          margin-bottom: 14px;
        }

        .faq-title {
          font-size: clamp(26px, 3.2vw, 36px);
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

        .faq-list {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .faq-accordion-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-normal);
        }

        .faq-accordion-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: var(--shadow-sm);
        }

        .card-open {
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

        .question-text {
          font-size: 15.5px;
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

        .faq-answer-pane {
          padding: 0 24px 20px 24px;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .faq-answer-pane p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-body);
        }

        @media (max-width: 600px) {
          .faq-question-btn {
            padding: 16px 18px;
          }

          .question-text {
            font-size: 14.5px;
          }

          .faq-answer-pane {
            padding: 0 18px 16px 18px;
          }
        }
      `}</style>
    </section>
  );
};
