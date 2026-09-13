'use client';

import React from 'react';

export const VisionSection: React.FC = () => {
  return (
    <section className="vision-section" id="vision">
      <div className="container">
        <div className="vision-container-box">
          <div className="vision-grid">
            {/* Visual Column: Abstract Constellation of Knowledge */}
            <div className="vision-graphic-col" aria-hidden="true">
              <div className="vision-graphic-wrapper">
                <div className="vision-ambient-glow" />
                
                {/* SVG Abstract Constellation / Knowledge Network */}
                <svg viewBox="0 0 400 360" className="constellation-svg" fill="none">
                  {/* Glowing connecting paths */}
                  <path d="M 80,180 Q 150,90 240,110 T 340,180" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 120,280 Q 200,240 280,260 T 360,200" stroke="rgba(236, 72, 153, 0.35)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 200,60 L 200,300" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" />
                  
                  {/* Node 1: Primary Education */}
                  <g transform="translate(80, 180)">
                    <circle r="32" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2))" />
                    <circle r="6" fill="#3b82f6" />
                    <text x="0" y="48" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Éducation</text>
                  </g>

                  {/* Node 2: Central Sunubiblio Hub */}
                  <g transform="translate(200, 160)">
                    <circle r="44" fill="#ffffff" stroke="#6366f1" strokeWidth="3" filter="drop-shadow(0 8px 24px rgba(99, 102, 241, 0.3))" />
                    <path d="M -10,-10 C -4,-18 4,-18 10,-10 C 18,-4 18,4 10,10 C 4,18 -4,18 -10,10 C -18,4 -18,-4 -10,-10 Z" fill="url(#coreGradient)" />
                    <text x="0" y="62" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="800">Sunubiblio</text>
                  </g>

                  {/* Node 3: Concours & Excellence */}
                  <g transform="translate(320, 140)">
                    <circle r="30" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(139, 92, 246, 0.2))" />
                    <circle r="5" fill="#8b5cf6" />
                    <text x="0" y="46" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Concours</text>
                  </g>

                  {/* Node 4: Autonomie & Avenir */}
                  <g transform="translate(260, 270)">
                    <circle r="26" fill="#ffffff" stroke="#ec4899" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(236, 72, 153, 0.2))" />
                    <circle r="4" fill="#ec4899" />
                    <text x="0" y="42" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Avenir</text>
                  </g>

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="coreGradient" x1="-18" y1="-18" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="0.5" stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Text Column */}
            <div className="vision-text-col">
              <div className="badge-pill vision-badge">
                <span className="badge-dot" />
                <span>Horizons & Ambition</span>
              </div>

              <h2 className="vision-title">
                Notre <span className="gradient-hero-text">vision</span> pour l’Afrique
              </h2>

              <p className="vision-main-text">
                Construire une expérience d’apprentissage numérique moderne, adaptée aux besoins réels des apprenants d’aujourd’hui.
              </p>

              <p className="vision-sub-text">
                Sunubiblio veut devenir un espace de référence pour apprendre, réviser et se préparer, en réunissant progressivement ressources éducatives, entraînement structuré et outils d’apprentissage intelligents.
              </p>

              <div className="vision-points-list">
                <div className="vision-point">
                  <div className="point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="point-content">
                    <span className="point-title">Un parcours éducatif continu</span>
                    <span className="point-desc">De l’élève du collège/lycée jusqu’à l’étudiant d’université et au candidat aux grands concours.</span>
                  </div>
                </div>

                <div className="vision-point">
                  <div className="point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="point-content">
                    <span className="point-title">Égalité des chances & Accessibilité</span>
                    <span className="point-desc">Permettre à chaque apprenant, qu’il soit à Dakar ou en région, d’avoir les mêmes opportunités.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vision-section {
          padding: 40px 0 60px 0;
          position: relative;
        }

        .vision-container-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f5f3ff 50%, #faf5ff 100%);
          border-radius: var(--radius-2xl);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: var(--shadow-sm);
          padding: 56px 44px;
        }

        .vision-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 48px;
          align-items: center;
        }

        .vision-graphic-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vision-graphic-wrapper {
          position: relative;
          width: 100%;
          max-width: 380px;
        }

        .vision-ambient-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          filter: blur(20px);
          pointer-events: none;
        }

        .constellation-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .vision-text-col {
          display: flex;
          flex-direction: column;
        }

        .vision-badge {
          margin-bottom: 16px;
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.85);
        }

        .vision-title {
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 18px;
        }

        .vision-main-text {
          font-size: 18px;
          font-weight: 700;
          color: #4338ca;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .vision-sub-text {
          font-size: 15px;
          color: var(--text-body);
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .vision-points-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .vision-point {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
        }

        .point-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .point-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .point-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-heading);
        }

        .point-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.45;
        }

        @media (max-width: 960px) {
          .vision-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .vision-container-box {
            padding: 36px 20px;
          }

          .vision-badge {
            align-self: center;
          }

          .vision-text-col {
            text-align: center;
          }

          .vision-point {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};
