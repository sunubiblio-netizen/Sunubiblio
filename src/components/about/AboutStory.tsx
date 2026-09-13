'use client';

import React from 'react';

export const AboutStory: React.FC = () => {
  return (
    <section className="about-story-section" id="histoire">
      <div className="container">
        <div className="story-card-wrapper">
          <div className="story-grid">
            {/* Left: The Story & Motivation */}
            <div className="story-content-col">
              <div className="badge-pill story-badge">
                <span className="badge-dot" />
                <span>Notre Histoire</span>
              </div>

              <h2 className="story-title">
                Pourquoi <span className="gradient-hero-text">Sunubiblio</span> ?
              </h2>

              <p className="story-lead">
                Trouver les bonnes ressources pour apprendre, réviser ou préparer un concours peut être difficile lorsqu’elles sont dispersées entre plusieurs sources.
              </p>

              <p className="story-body">
                Photocopies de mauvaise qualité qui s’égarent, cours introuvables, groupes de messagerie encombrés, annales sans corrigés clairs… Les apprenants perdent souvent un temps précieux à chercher l’information au lieu de se concentrer sur l’essentiel : <strong>apprendre et réussir</strong>.
              </p>

              <p className="story-body">
                Sunubiblio a pour ambition de réunir ces ressources dans un <strong>espace unique, simple, fiable et accessible</strong> à tous, quel que soit votre parcours ou votre situation géographique au Sénégal.
              </p>

              {/* Key Highlights */}
              <div className="story-takeaways">
                <div className="takeaway-item">
                  <div className="takeaway-icon-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <span className="takeaway-title">Avant Sunubiblio</span>
                    <span className="takeaway-desc">Documents éparpillés, éditions obsolètes, recherche fastidieuse.</span>
                  </div>
                </div>

                <div className="takeaway-item">
                  <div className="takeaway-icon-box box-success">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="takeaway-title">Avec Sunubiblio</span>
                    <span className="takeaway-desc">Un espace ordonné, des contenus vérifiés et disponibles en 1 clic.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Abstract Graphic "Scattered -> Organized" */}
            <div className="story-visual-col" aria-hidden="true">
              <div className="convergence-box">
                <div className="convergence-header">
                  <span className="conv-tag">Transformation Visuelle</span>
                  <span className="conv-caption">Des ressources dispersées → un espace organisé</span>
                </div>

                {/* The Graphic Arena */}
                <div className="convergence-arena">
                  {/* Scattered side (Left / Top) */}
                  <div className="scattered-zone">
                    <span className="zone-label">Ressources éparpillées</span>
                    <div className="scatter-item item-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>Sujet FASTEF 2021.pdf</span>
                    </div>
                    <div className="scatter-item item-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      <span>Cours Maths Terminale</span>
                    </div>
                    <div className="scatter-item item-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      <span>QCM concours santé</span>
                    </div>
                    <div className="scatter-item item-4">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span>Corrigé incomplet</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flow-arrow-wrap">
                    <div className="flow-pulse-line" />
                    <div className="flow-icon-circle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="19 12 12 19 5 12" />
                      </svg>
                    </div>
                  </div>

                  {/* Organized Unified Hub (Bottom) */}
                  <div className="hub-zone">
                    <div className="hub-card">
                      <div className="hub-top">
                        <div className="hub-logo-dot">
                          <span className="dot-inner" />
                        </div>
                        <div className="hub-meta">
                          <span className="hub-title">Espace Unique Sunubiblio</span>
                          <span className="hub-status">Classé • Indexé • Accessible 24h/24</span>
                        </div>
                        <span className="hub-tag-ready">Vérifié ✓</span>
                      </div>
                      <div className="hub-preview-grid">
                        <div className="hub-mini-col">
                          <span className="mini-col-title">📚 Manuels</span>
                          <span className="mini-col-stat">Classés par classe</span>
                        </div>
                        <div className="hub-mini-col">
                          <span className="mini-col-title">🎯 Annales</span>
                          <span className="mini-col-stat">Corrigés détaillés</span>
                        </div>
                        <div className="hub-mini-col">
                          <span className="mini-col-title">📝 Exercices</span>
                          <span className="mini-col-stat">QCM interactifs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-story-section {
          padding: 40px 0 60px 0;
          position: relative;
        }

        .story-card-wrapper {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 50px 44px;
          box-shadow: var(--shadow-card);
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .story-badge {
          margin-bottom: 16px;
        }

        .story-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .story-lead {
          font-size: 16.5px;
          font-weight: 700;
          color: var(--text-heading);
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .story-body {
          font-size: 15px;
          color: var(--text-body);
          line-height: 1.65;
          margin-bottom: 14px;
        }

        .story-takeaways {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .takeaway-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--surface-subtle);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .takeaway-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .box-success {
          background: #ecfdf5;
        }

        .takeaway-title {
          display: block;
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-heading);
        }

        .takeaway-desc {
          display: block;
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.45;
        }

        /* Right Visual Transformation */
        .convergence-box {
          background: linear-gradient(180deg, #f8fafc 0%, #faf8ff 100%);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
        }

        .convergence-header {
          text-align: center;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .conv-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--primary);
        }

        .conv-caption {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .convergence-arena {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .scattered-zone {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .zone-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .scatter-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
        }

        .item-1 { align-self: flex-start; transform: rotate(-1deg); }
        .item-2 { align-self: flex-end; transform: rotate(1.5deg); }
        .item-3 { align-self: flex-start; margin-left: 20px; }
        .item-4 { align-self: flex-end; margin-right: 15px; color: #dc2626; border-color: #fca5a5; }

        .flow-arrow-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 8px 0;
        }

        .flow-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #6366f1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }

        .hub-zone {
          position: relative;
        }

        .hub-card {
          background: #ffffff;
          border: 2px solid #6366f1;
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          box-shadow: 0 10px 24px -4px rgba(99, 102, 241, 0.15);
        }

        .hub-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .hub-logo-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .hub-meta {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
        }

        .hub-title {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-heading);
        }

        .hub-status {
          font-size: 11px;
          color: #10b981;
          font-weight: 600;
        }

        .hub-tag-ready {
          font-size: 10.5px;
          font-weight: 800;
          color: #065f46;
          background: #ecfdf5;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .hub-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .hub-mini-col {
          background: #f8fafc;
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mini-col-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .mini-col-stat {
          font-size: 10.5px;
          color: var(--text-muted);
        }

        @media (max-width: 960px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .story-card-wrapper {
            padding: 32px 20px;
          }
        }
      `}</style>
    </section>
  );
};
