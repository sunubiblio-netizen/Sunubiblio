'use client';

import React from 'react';

interface IAHeroCenteredProps {
  onNewChat?: () => void;
  isConversationActive?: boolean;
}

export const IAHeroCentered: React.FC<IAHeroCenteredProps> = ({
  onNewChat,
  isConversationActive = false
}) => {
  return (
    <header className="ia-header-centered-root">
      <div className="container">
        {/* Bloc Titre STRICTEMENT CENTRÉ */}
        <div className="hero-center-box">
          <div className="ai-badge-pill">
            <span className="badge-sparkle-dot"></span>
            <span>Assistant Intelligent Sunubiblio</span>
          </div>

          <h1 className="main-title">
            Intelligence <span className="gradient-ai-text">artificielle</span>
          </h1>

          <p className="main-subtitle">
            Votre assistant intelligent Sunubiblio
          </p>

          {!isConversationActive && (
            <p className="main-description">
              Analysez vos cours, résumez vos documents, générez des QCM d'entraînement et préparez vos examens en toute sérénité.
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .ia-header-centered-root {
          padding: ${isConversationActive ? '28px 0 16px 0' : '52px 0 24px 0'};
          position: relative;
          text-align: center;
          background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
          border-bottom: ${isConversationActive ? '1px solid rgba(226, 232, 240, 0.7)' : 'none'};
          transition: all 0.3s ease;
        }


        .hero-center-box {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ai-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 18px;
        }

        .badge-sparkle-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 10px #6366f1;
        }

        .main-title {
          font-size: clamp(34px, 5vw, 48px);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          margin: 0 0 12px 0;
          letter-spacing: -0.025em;
          text-align: center;
          width: 100%;
        }

        .gradient-ai-text {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 45%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-subtitle {
          font-size: clamp(18px, 2.8vw, 22px);
          font-weight: 600;
          color: #475569;
          margin: 0 0 12px 0;
          line-height: 1.4;
          text-align: center;
          width: 100%;
        }

        .main-description {
          font-size: clamp(14.5px, 2vw, 16px);
          color: #64748b;
          line-height: 1.65;
          margin: 0 auto;
          max-width: 640px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .ia-header-centered-root {
            padding: ${isConversationActive ? '20px 0 12px 0' : '36px 0 18px 0'};
          }
          .main-title {
            font-size: 30px;
          }
          .main-subtitle {
            font-size: 17px;
          }
        }
      `}</style>
    </header>
  );
};
