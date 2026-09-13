'use client';

import React from 'react';

export const FeaturesOverview: React.FC = () => {
  const features = [
    {
      id: 'biblio',
      title: 'Bibliothèque numérique',
      desc: 'Catalogue complet de manuels scolaires, cours détaillés, fiches synthétiques et documents de référence consultables en ligne.',
      status: 'Disponible',
      isAvailable: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'concours',
      title: 'Préparation aux concours',
      desc: 'Dossiers complets des concours nationaux (FASTEF, ENA, Police, Douanes...) avec programmes officiels et annales corrigées.',
      status: 'Disponible',
      isAvailable: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'exercices',
      title: 'Exercices et QCM interactifs',
      desc: 'Banque de questions auto-évaluées avec corrections immédiates pour valider l’assimilation de chaque chapitre.',
      status: 'Disponible',
      isAvailable: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'progression',
      title: 'Suivi de progression',
      desc: 'Tableau de bord personnalisé pour mesurer ses révisions, ses scores d’entraînement et son niveau de maîtrise par matière.',
      status: 'Bientôt disponible',
      isAvailable: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: 'ia',
      title: 'Outils intelligents & IA',
      desc: 'Tuteur pédagogique contextuel pour expliquer des notions complexes, résumer des documents et générer des fiches de mémorisation.',
      status: 'Bientôt disponible',
      isAvailable: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <section className="features-overview-section" id="fonctionnalites">
      <div className="container">
        <div className="features-header">
          <div className="badge-pill feat-badge">
            <span className="badge-dot" />
            <span>Écosystème Sunubiblio</span>
          </div>

          <h2 className="features-title">
            Un seul espace pour <span className="gradient-hero-text">apprendre et se préparer</span>
          </h2>

          <p className="features-subtitle">
            Une architecture pensée pour couvrir tous les besoins des apprenants, avec une transparence totale sur les modules actifs et futurs.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`feature-box-card ${!feat.isAvailable ? 'card-upcoming' : ''}`}
            >
              <div className="fbox-top">
                <div className={`fbox-icon-wrap ${feat.isAvailable ? 'icon-active' : 'icon-muted'}`}>
                  {feat.icon}
                </div>
                <span className={`fbox-status-pill ${feat.isAvailable ? 'status-live' : 'status-soon'}`}>
                  {feat.isAvailable && <span className="status-dot" />}
                  {feat.status}
                </span>
              </div>

              <h3 className="fbox-title">{feat.title}</h3>
              <p className="fbox-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features-overview-section {
          padding: 60px 0 60px 0;
          position: relative;
        }

        .features-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 48px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .feat-badge {
          margin-bottom: 16px;
        }

        .features-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .features-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-box-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-xl);
          padding: 30px 24px;
          box-shadow: var(--shadow-xs);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }

        .feature-box-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .card-upcoming {
          background: #fafafa;
          border-style: dashed;
        }

        .fbox-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .fbox-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-active {
          background: #eef2ff;
          color: #4f46e5;
        }

        .icon-muted {
          background: #f1f5f9;
          color: var(--text-muted);
        }

        .fbox-status-pill {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .status-live {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        .status-soon {
          background: #f1f5f9;
          color: var(--text-muted);
          border: 1px solid #e2e8f0;
        }

        .fbox-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .fbox-desc {
          font-size: 13.5px;
          color: var(--text-body);
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .feature-box-card {
            padding: 24px 18px;
          }
        }
      `}</style>
    </section>
  );
};
