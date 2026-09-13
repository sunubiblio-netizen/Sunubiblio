'use client';

import React from 'react';

export const AudienceSection: React.FC = () => {
  const audiences = [
    {
      id: 'eleves',
      title: 'Élèves',
      badge: 'Collège & Lycée',
      desc: 'Pour apprendre, comprendre les cours et réviser efficacement leurs devoirs, le BFEM et le Baccalauréat.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      accentColor: '#3b82f6',
      bgLight: '#eff6ff',
    },
    {
      id: 'etudiants',
      title: 'Étudiants',
      badge: 'Licence & Master',
      desc: 'Pour approfondir leurs connaissances universitaires, accéder aux manuels de référence et structurer leurs semestres.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      accentColor: '#6366f1',
      bgLight: '#eef2ff',
    },
    {
      id: 'candidats',
      title: 'Candidats aux concours',
      badge: 'FASTEF, ENA, Police...',
      desc: 'Pour retrouver programmes, sujets des sessions antérieures, corrigés méthodologiques et fiches de révision ciblées.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      accentColor: '#9333ea',
      bgLight: '#f5f3ff',
    },
    {
      id: 'professionnels',
      title: 'Personnes en formation',
      badge: 'Auto-formation & Métiers',
      desc: 'Pour continuer à apprendre tout au long de sa vie, développer de nouvelles compétences professionnelles et enrichir sa culture.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      accentColor: '#ec4899',
      bgLight: '#fdf2f8',
    },
  ];

  return (
    <section className="audience-section" id="public">
      <div className="container">
        <div className="audience-header">
          <div className="badge-pill audience-badge">
            <span className="badge-dot" />
            <span>Pour Qui ?</span>
          </div>

          <h2 className="audience-title">
            Sunubiblio est <span className="gradient-hero-text">pensé pour vous</span>
          </h2>

          <p className="audience-subtitle">
            Une plateforme universelle qui s’adapte aux exigences académiques et aux ambitions de chaque profil au Sénégal.
          </p>
        </div>

        <div className="audience-grid">
          {audiences.map((item) => (
            <div key={item.id} className="audience-card">
              <div className="audience-top">
                <div
                  className="audience-icon-box"
                  style={{ color: item.accentColor, backgroundColor: item.bgLight }}
                >
                  {item.icon}
                </div>
                <span
                  className="audience-mini-badge"
                  style={{ color: item.accentColor, backgroundColor: item.bgLight }}
                >
                  {item.badge}
                </span>
              </div>

              <h3 className="audience-card-title">{item.title}</h3>
              <p className="audience-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .audience-section {
          padding: 60px 0 60px 0;
          position: relative;
        }

        .audience-header {
          text-align: center;
          max-width: 740px;
          margin: 0 auto 44px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .audience-badge {
          margin-bottom: 16px;
        }

        .audience-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .audience-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .audience-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .audience-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-xl);
          padding: 30px 22px;
          box-shadow: var(--shadow-xs);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }

        .audience-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .audience-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .audience-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .audience-mini-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          letter-spacing: 0.02em;
        }

        .audience-card-title {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .audience-card-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .audience-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .audience-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .audience-card {
            padding: 24px 18px;
          }
        }
      `}</style>
    </section>
  );
};
