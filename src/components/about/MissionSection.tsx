'use client';

import React from 'react';

export const MissionSection: React.FC = () => {
  const pillars = [
    {
      id: 'acceder',
      tag: 'Pilier 01',
      title: 'Accéder',
      desc: 'Retrouver facilement et sans friction les ressources pédagogiques dont vous avez besoin.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      accentColor: '#3b82f6',
      bgLight: '#eff6ff',
      details: ['Manuels scolaires par niveau', 'Documents de référence', 'Lecture en ligne et hors ligne'],
    },
    {
      id: 'preparer',
      tag: 'Pilier 02',
      title: 'Se préparer',
      desc: 'Organiser ses révisions méthodiquement et préparer efficacement ses examens et concours.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      accentColor: '#8b5cf6',
      bgLight: '#f5f3ff',
      details: ['Annales officielles corrigées', 'Épreuves types FASTEF, ENA...', 'Méthodologie pas à pas'],
    },
    {
      id: 'progresser',
      tag: 'Pilier 03',
      title: 'Progresser',
      desc: 'Apprendre régulièrement, s’auto-évaluer et mesurer concrètement son évolution.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      accentColor: '#ec4899',
      bgLight: '#fdf2f8',
      details: ['QCM auto-corrigés', 'Gestion de favoris & signets', 'Apprentissage à son rythme'],
    },
  ];

  return (
    <section className="mission-section" id="mission">
      <div className="container">
        <div className="mission-header">
          <div className="badge-pill mission-badge">
            <span className="badge-dot" />
            <span>Engagés pour l’Apprentissage</span>
          </div>

          <h2 className="mission-title">
            Notre <span className="gradient-hero-text">mission</span>
          </h2>

          <p className="mission-subtitle">
            Faciliter l’accès aux ressources éducatives et aider chaque apprenant à mieux apprendre, mieux se préparer et progresser à son rythme.
          </p>
        </div>

        <div className="mission-grid">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="pillar-card">
              <div className="pillar-top">
                <span className="pillar-tag" style={{ color: pillar.accentColor, backgroundColor: pillar.bgLight }}>
                  {pillar.tag}
                </span>
                <div
                  className="pillar-icon-box"
                  style={{ color: pillar.accentColor, backgroundColor: pillar.bgLight }}
                >
                  {pillar.icon}
                </div>
              </div>

              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>

              <div className="pillar-divider" />

              <ul className="pillar-features">
                {pillar.details.map((item, idx) => (
                  <li key={idx} className="pillar-feature-item">
                    <span className="pfeat-bullet" style={{ backgroundColor: pillar.accentColor }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mission-section {
          padding: 60px 0 60px 0;
          position: relative;
        }

        .mission-header {
          text-align: center;
          max-width: 740px;
          margin: 0 auto 48px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mission-badge {
          margin-bottom: 16px;
        }

        .mission-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .mission-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .pillar-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 36px 28px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }

        .pillar-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card-hover);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .pillar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .pillar-tag {
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pillar-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .pillar-desc {
          font-size: 14.5px;
          color: var(--text-body);
          line-height: 1.6;
          min-height: 48px;
        }

        .pillar-divider {
          width: 100%;
          height: 1px;
          background: var(--border-subtle);
          margin: 22px 0 18px 0;
        }

        .pillar-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pillar-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .pfeat-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 960px) {
          .mission-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .pillar-card {
            padding: 28px 22px;
          }

          .pillar-desc {
            min-height: auto;
          }
        }
      `}</style>
    </section>
  );
};
