'use client';

import React from 'react';

export const ApproachSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Chercher',
      desc: 'Trouver rapidement la bonne ressource grâce à notre moteur de recherche et nos filtres ciblés par niveau et concours.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      color: '#3b82f6',
    },
    {
      step: '02',
      title: 'Comprendre',
      desc: 'Consulter et exploiter des cours complets, des fiches méthodologiques et des manuels conformes aux programmes nationaux.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      color: '#6366f1',
    },
    {
      step: '03',
      title: 'S’entraîner',
      desc: 'Mettre ses connaissances en pratique sur des sujets d’annales réelles et des QCM interactifs auto-évalués.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      color: '#9333ea',
    },
    {
      step: '04',
      title: 'Progresser',
      desc: 'Mesurer concrètement ses acquis, combler ses lacunes pas à pas et aborder ses examens avec une sérénité maximale.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: '#ec4899',
    },
  ];

  return (
    <section className="approach-section" id="approche">
      <div className="container">
        <div className="approach-header">
          <div className="badge-pill approach-badge">
            <span className="badge-dot" />
            <span>Méthodologie Éducative</span>
          </div>

          <h2 className="approach-title">
            Pensé pour les <span className="gradient-hero-text">apprenants</span>
          </h2>

          <p className="approach-subtitle">
            Une démarche en quatre temps qui transforme la révision en un processus clair, stimulant et gratifiant.
          </p>
        </div>

        {/* The Desktop / Mobile Timeline */}
        <div className="timeline-container">
          <div className="timeline-line-desktop" aria-hidden="true" />

          <div className="steps-grid">
            {steps.map((item, idx) => (
              <div key={item.step} className="step-card">
                {/* Step Marker */}
                <div className="step-badge-wrap">
                  <div className="step-circle" style={{ borderColor: item.color, color: item.color }}>
                    <span className="step-number">{item.step}</span>
                  </div>
                </div>

                <div className="step-content">
                  <div className="step-icon-bar" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .approach-section {
          padding: 60px 0 70px 0;
          position: relative;
        }

        .approach-header {
          text-align: center;
          max-width: 740px;
          margin: 0 auto 52px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .approach-badge {
          margin-bottom: 16px;
        }

        .approach-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .approach-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .timeline-container {
          position: relative;
        }

        .timeline-line-desktop {
          position: absolute;
          top: 32px;
          left: 12%;
          right: 12%;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 33%, #9333ea 66%, #ec4899 100%);
          z-index: 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-badge-wrap {
          margin-bottom: 22px;
        }

        .step-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ffffff;
          border: 2.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
          transition: transform 0.25s ease;
        }

        .step-card:hover .step-circle {
          transform: scale(1.08);
        }

        .step-number {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .step-content {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 26px 20px;
          box-shadow: var(--shadow-xs);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all var(--transition-normal);
          height: 100%;
        }

        .step-card:hover .step-content {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .step-icon-bar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .step-title {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .step-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .timeline-line-desktop {
            display: none;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .step-card {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
            gap: 16px;
          }

          .step-badge-wrap {
            margin-bottom: 0;
            flex-shrink: 0;
          }

          .step-circle {
            width: 48px;
            height: 48px;
          }

          .step-number {
            font-size: 16px;
          }

          .step-content {
            align-items: flex-start;
            padding: 20px 18px;
          }
        }
      `}</style>
    </section>
  );
};
