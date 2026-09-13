'use client';

import React from 'react';

export const SenegalSection: React.FC = () => {
  const highlights = [
    {
      flagOrIcon: '🇸🇳',
      title: 'Ancrage Sénégalais',
      desc: 'Une plateforme développée pour répondre précisément aux programmes et exigences scolaires et universitaires du Sénégal.',
    },
    {
      flagOrIcon: '📚',
      title: 'Continuité Éducative',
      desc: 'Une bibliothèque organisée par filières, niveaux et séries (S1, S2, L, etc.) pour un repérage immédiat.',
    },
    {
      flagOrIcon: '🎯',
      title: 'Spécialisation Concours',
      desc: 'Une attention méticuleuse portée aux concours nationaux majeurs : FASTEF, ENA, Police, Douane, Santé, EAMAC...',
    },
    {
      flagOrIcon: '📱',
      title: 'Ergonomie Mobile-First',
      desc: 'Pensé pour fonctionner avec fluidité sur smartphone, avec des pages légères et adaptées aux connexions mobiles.',
    },
    {
      flagOrIcon: '💡',
      title: 'Innovation Utile',
      desc: 'Des technologies modernes mises au service d’un besoin réel : simplifier la vie quotidienne des apprenants.',
    },
  ];

  return (
    <section className="senegal-section" id="senegal">
      <div className="container">
        <div className="senegal-card-box">
          <div className="senegal-header">
            <div className="badge-pill senegal-badge">
              <span className="badge-dot" />
              <span>Réalités Locales & Terrain</span>
            </div>

            <h2 className="senegal-title">
              Pensé pour les <span className="gradient-hero-text">réalités de nos apprenants</span>
            </h2>

            <p className="senegal-subtitle">
              Sunubiblio est conçu avec l’ambition de répondre concrètement aux défis rencontrés par les élèves, étudiants et candidats au Sénégal dans leurs études et la préparation de leurs concours.
            </p>
          </div>

          <div className="senegal-grid">
            {highlights.map((item, idx) => (
              <div key={idx} className="senegal-item">
                <div className="senegal-icon-sphere">
                  <span className="sphere-emoji">{item.flagOrIcon}</span>
                </div>
                <h3 className="senegal-item-title">{item.title}</h3>
                <p className="senegal-item-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .senegal-section {
          padding: 30px 0 60px 0;
          position: relative;
        }

        .senegal-card-box {
          background: linear-gradient(180deg, #ffffff 0%, #fbfaff 100%);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 50px 40px;
          box-shadow: var(--shadow-card);
        }

        .senegal-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 44px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .senegal-badge {
          margin-bottom: 16px;
        }

        .senegal-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .senegal-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .senegal-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .senegal-item {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 26px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-normal);
        }

        .senegal-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .senegal-icon-sphere {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .sphere-emoji {
          font-size: 24px;
        }

        .senegal-item-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .senegal-item-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
        }

        @media (max-width: 1200px) {
          .senegal-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .senegal-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .senegal-card-box {
            padding: 32px 20px;
          }

          .senegal-item {
            padding: 20px 16px;
          }
        }
      `}</style>
    </section>
  );
};
