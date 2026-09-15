'use client';

import React from 'react';

export const IAHistory: React.FC = () => {
  return (
    <section className="ia-history-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Mes dernières activités IA</h2>
          <p className="section-subtitle">
            Retrouvez ici l'historique de vos résumés, QCM générés et conversations.
          </p>
        </div>

        <div className="history-empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h3 className="empty-title">Vous n'avez encore aucune activité IA.</h3>
          <p className="empty-description">
            Commencez par utiliser l'un des outils ci-dessus ou interrogez l'Assistant Sunubiblio.
          </p>
        </div>
      </div>

      <style jsx>{`
        .ia-history-section {
          padding: 60px 0;
          background: #ffffff;
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: clamp(24px, 3.5vw, 28px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
        }

        .section-subtitle {
          font-size: 15.5px;
          color: #64748b;
          margin: 0;
        }

        .history-empty-state {
          background: #f8fafc;
          border: 1px dashed rgba(203, 213, 225, 0.8);
          border-radius: 20px;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #eef2ff;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #334155;
          margin: 0 0 10px 0;
        }

        .empty-description {
          font-size: 15px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </section>
  );
};
