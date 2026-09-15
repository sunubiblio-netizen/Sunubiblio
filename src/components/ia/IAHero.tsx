'use client';

import React from 'react';

export const IAHero: React.FC = () => {
  return (
    <section className="ia-hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text-block">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Nouvel Espace
            </div>
            
            <h1 className="hero-title">
              Intelligence <span className="title-gradient">Artificielle</span>
            </h1>
            
            <h2 className="hero-subtitle">
              Votre assistant intelligent pour apprendre, comprendre et travailler avec vos documents.
            </h2>
            
            <p className="hero-description">
              Découvrez une nouvelle façon d'explorer le savoir. Sunubiblio intègre désormais une assistance pédagogique sur mesure pour générer des QCM, résumer des textes longs et vous accompagner dans vos révisions.
            </p>
          </div>

          <div className="hero-visual-block">
            <div className="abstract-ai-visual">
              <div className="glowing-orb"></div>
              <div className="grid-overlay"></div>
              <div className="floating-elements">
                <div className="float-item float-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <div className="float-item float-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="float-item float-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ia-hero-section {
          padding: 80px 0;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .ia-hero-section::before {
          content: '';
          position: absolute;
          top: -150px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 60px;
          position: relative;
          z-index: 1;
        }

        .hero-text-block {
          flex: 1;
          max-width: 600px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #4f46e5;
          border-radius: 50%;
          box-shadow: 0 0 8px #4f46e5;
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin: 0 0 20px 0;
          letter-spacing: -0.03em;
        }

        .title-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(20px, 2.5vw, 24px);
          font-weight: 600;
          color: #334155;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }

        .hero-description {
          font-size: 16px;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        .hero-visual-block {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .abstract-ai-visual {
          position: relative;
          width: 100%;
          max-width: 450px;
          aspect-ratio: 1;
        }

        .glowing-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.4;
          animation: pulse 4s ease-in-out infinite alternate;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          border-radius: 30px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .float-item {
          position: absolute;
          width: 56px;
          height: 56px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
        }

        .float-1 {
          top: 20%;
          left: 10%;
          animation: float 6s ease-in-out infinite;
        }

        .float-2 {
          top: 40%;
          right: 15%;
          animation: float 5s ease-in-out infinite 1s;
        }

        .float-3 {
          bottom: 20%;
          left: 30%;
          animation: float 7s ease-in-out infinite 2s;
        }

        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @media (max-width: 960px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }

          .hero-text-block {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .abstract-ai-visual {
            max-width: 350px;
          }
        }
      `}</style>
    </section>
  );
};
