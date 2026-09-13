'use client';

import React from 'react';
import { CONTACT_INFO } from '@/data/contactData';

export const ContactCards: React.FC = () => {
  return (
    <section className="contact-cards-section" id="coordonnees">
      <div className="container">
        <div className="contact-cards-header">
          <div className="badge-pill ccard-badge">
            <span className="badge-dot" />
            <span>Canaux Directs</span>
          </div>
          <h2 className="ccard-title">
            Parlons de <span className="gradient-hero-text">votre besoin</span>
          </h2>
          <p className="ccard-subtitle">
            Choisissez le canal qui vous convient le mieux pour échanger avec notre équipe d’assistance.
          </p>
        </div>

        <div className="contact-cards-grid">
          {/* Card 1: Phone */}
          <div className="contact-info-card">
            <div className="cic-icon-wrap icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="cic-name">Téléphone</h3>
            <p className="cic-value">{CONTACT_INFO.phone}</p>
            <p className="cic-desc">
              Échangez directement de vive voix avec notre équipe pour toute question urgente.
            </p>
            <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="btn-primary cic-action-btn">
              <span>Appeler</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="contact-info-card">
            <div className="cic-icon-wrap icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="cic-name">Email</h3>
            <p className="cic-value">{CONTACT_INFO.email}</p>
            <p className="cic-desc">
              Transmettez-nous vos demandes détaillées, propositions de partenariat ou pièces jointes.
            </p>
            <a href={`mailto:${CONTACT_INFO.email}`} className="btn-secondary cic-action-btn">
              <span>Envoyer un email</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          </div>

          {/* Card 3: Availability / Scope */}
          <div className="contact-info-card">
            <div className="cic-icon-wrap icon-rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
            <h3 className="cic-name">{CONTACT_INFO.availabilityTitle}</h3>
            <p className="cic-value value-highlight">Accompagnement apprenants</p>
            <p className="cic-desc">
              {CONTACT_INFO.availabilityDescription}
            </p>
            <a href="#formulaire" className="btn-secondary cic-action-btn">
              <span>Formulaire en ligne</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-cards-section {
          padding: 20px 0 50px 0;
          position: relative;
        }

        .contact-cards-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 36px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ccard-badge {
          margin-bottom: 14px;
        }

        .ccard-title {
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .ccard-subtitle {
          font-size: clamp(14px, 1.8vw, 16px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .contact-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .contact-info-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 34px 26px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all var(--transition-normal);
        }

        .contact-info-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .cic-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .icon-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .icon-rose {
          background: #fdf2f8;
          color: #ec4899;
        }

        .cic-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .cic-value {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
          word-break: break-all;
        }

        .value-highlight {
          color: #4f46e5;
          font-size: 17px;
        }

        .cic-desc {
          font-size: 13.5px;
          color: var(--text-body);
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }

        .cic-action-btn {
          width: 100%;
          padding: 11px 18px;
          font-size: 14px;
          font-weight: 700;
        }

        @media (max-width: 960px) {
          .contact-cards-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .contact-info-card {
            padding: 26px 20px;
          }
        }
      `}</style>
    </section>
  );
};
