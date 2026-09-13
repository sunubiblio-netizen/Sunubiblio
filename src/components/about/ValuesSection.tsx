'use client';

import React from 'react';

export const ValuesSection: React.FC = () => {
  const values = [
    {
      id: 'accessibilite',
      num: '01',
      title: 'Accessibilité',
      desc: 'Rendre les ressources plus simples à trouver et à utiliser, pour que la connaissance soit à la portée de chaque apprenant, où qu’il soit.',
      accent: '#3b82f6',
    },
    {
      id: 'simplicite',
      num: '02',
      title: 'Simplicité',
      desc: 'Créer une expérience claire, fluide, intuitive et sans complexité inutile pour maximiser le temps consacré à l’apprentissage effectif.',
      accent: '#6366f1',
    },
    {
      id: 'qualite',
      num: '03',
      title: 'Qualité',
      desc: 'Mettre en avant des ressources utiles, vérifiées, rigoureusement organisées et directement alignées avec les programmes officiels.',
      accent: '#9333ea',
    },
    {
      id: 'progression',
      num: '04',
      title: 'Progression',
      desc: 'Encourager une démarche d’entraînement régulière, structurée et bienveillante pour développer durablement l’autonomie de chacun.',
      accent: '#ec4899',
    },
  ];

  return (
    <section className="values-section" id="valeurs">
      <div className="container">
        <div className="values-header">
          <div className="badge-pill values-badge">
            <span className="badge-dot" />
            <span>Nos Valeurs</span>
          </div>

          <h2 className="values-title">
            Ce qui guide <span className="gradient-hero-text">Sunubiblio</span>
          </h2>

          <p className="values-subtitle">
            Des principes fondamentaux qui orientent chacune de nos décisions de conception et d’accompagnement pédagogique.
          </p>
        </div>

        <div className="values-grid">
          {values.map((v) => (
            <div key={v.id} className="value-card">
              <div className="value-top">
                <span className="value-num" style={{ color: v.accent }}>{v.num}</span>
                <span className="value-dot" style={{ backgroundColor: v.accent }} />
              </div>

              <h3 className="value-card-title">{v.title}</h3>
              <p className="value-card-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .values-section {
          padding: 60px 0 60px 0;
          position: relative;
        }

        .values-header {
          text-align: center;
          max-width: 740px;
          margin: 0 auto 44px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .values-badge {
          margin-bottom: 16px;
        }

        .values-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .values-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .value-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 32px 24px;
          box-shadow: var(--shadow-xs);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.4);
        }

        .value-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .value-num {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          font-family: monospace;
        }

        .value-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .value-card-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .value-card-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.65;
        }

        @media (max-width: 1080px) {
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 600px) {
          .values-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .value-card {
            padding: 24px 20px;
          }
        }
      `}</style>
    </section>
  );
};
