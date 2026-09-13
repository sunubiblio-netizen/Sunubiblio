'use client';

import React from 'react';

export const ContactHero: React.FC = () => {
  return (
    <section className="contact-hero">
      <div className="container">
        {/* Background ambient lighting */}
        <div className="hero-ambient" aria-hidden="true">
          <div className="ambient-blob blob-purple" />
          <div className="ambient-blob blob-blue" />
          <div className="ambient-blob blob-rose" />
        </div>

        <div className="hero-grid">
          {/* Left Text */}
          <div className="hero-text-col">
            <div className="badge-pill hero-badge">
              <span className="badge-dot" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Contactez-nous</span>
            </div>

            <h1 className="hero-title">
              Nous sommes là pour{' '}
              <span className="gradient-hero-text">vous aider</span>
            </h1>

            <p className="hero-subtitle">
              Une question sur la bibliothèque, une suggestion pour améliorer la plateforme ou besoin d’assistance sur votre abonnement ? Écrivez-nous et notre équipe vous répondra.
            </p>

            <div className="hero-guarantees-row">
              <div className="guarantee-chip">
                <span className="chip-dot" />
                <span>Réponse attentive</span>
              </div>
              <div className="guarantee-chip">
                <span className="chip-dot" />
                <span>Support pédagogique & technique</span>
              </div>
              <div className="guarantee-chip">
                <span className="chip-dot" />
                <span>À votre écoute au Sénégal 🇸🇳</span>
              </div>
            </div>
          </div>

          {/* Right: Abstract Graphic Composition (Enveloppes, Chat, Sparkles, No Person) */}
          <div className="hero-graphic-col" aria-hidden="true">
            <div className="contact-visual-stage">
              {/* Central Glowing Shield / Card */}
              <div className="central-contact-sphere">
                <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="url(#contactGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <defs>
                    <linearGradient id="contactGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="0.5" stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating Badge 1: Direct Message */}
              <div className="floating-item float-mail">
                <div className="fitem-icon icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="fitem-label">Demande enregistrée</span>
              </div>

              {/* Floating Badge 2: Phone call assistance */}
              <div className="floating-item float-phone">
                <div className="fitem-icon icon-emerald">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="fitem-label">+221 78 439 63 26</span>
              </div>

              {/* Floating Sparkle Pill */}
              <div className="floating-sparkle">
                <span className="sparkle-symbol">✨</span>
                <span>Assistance dédiée</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-hero {
          position: relative;
          padding: 56px 0 44px 0;
          overflow: hidden;
        }

        .hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }

        .blob-purple {
          width: 360px;
          height: 360px;
          top: -30px;
          right: 15%;
          background: rgba(147, 51, 234, 0.16);
        }

        .blob-blue {
          width: 300px;
          height: 300px;
          top: 40px;
          left: 5%;
          background: rgba(59, 130, 246, 0.12);
        }

        .blob-rose {
          width: 260px;
          height: 260px;
          bottom: 20px;
          right: 35%;
          background: rgba(236, 72, 153, 0.1);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-badge {
          margin-bottom: 18px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          background: rgba(238, 242, 255, 0.9);
          color: var(--primary);
        }

        .hero-title {
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 26px;
        }

        .hero-guarantees-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .guarantee-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        /* Right Graphic Arena */
        .hero-graphic-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .contact-visual-stage {
          position: relative;
          width: 100%;
          max-width: 360px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .central-contact-sphere {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 16px 40px -8px rgba(99, 102, 241, 0.25);
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .floating-item {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08);
          z-index: 3;
        }

        .float-mail {
          top: 20px;
          left: 10px;
        }

        .float-phone {
          bottom: 25px;
          right: 10px;
        }

        .fitem-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-emerald {
          background: #ecfdf5;
        }

        .fitem-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .floating-sparkle {
          position: absolute;
          top: 30px;
          right: 15px;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: #ffffff;
          border-radius: var(--radius-full);
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(49, 46, 129, 0.2);
          z-index: 3;
        }

        .sparkle-symbol {
          font-size: 12px;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            text-align: center;
          }

          .hero-text-col {
            align-items: center;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-guarantees-row {
            justify-content: center;
          }
        }

        @media (max-width: 540px) {
          .contact-hero {
            padding: 36px 0 28px 0;
          }

          .hero-title {
            font-size: 27px;
          }

          .contact-visual-stage {
            height: 220px;
          }

          .central-contact-sphere {
            width: 100px;
            height: 100px;
          }

          .float-mail {
            left: 0;
            top: 5px;
          }

          .float-phone {
            right: 0;
            bottom: 5px;
          }
        }
      `}</style>
    </section>
  );
};
