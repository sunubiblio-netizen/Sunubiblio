'use client';

import React from 'react';

export const IADocumentsSection: React.FC = () => {
  return (
    <section className="ia-docs-section">
      <div className="container">
        <div className="docs-content-wrapper">
          <div className="docs-text">
            <h2 className="docs-title">Travailler avec mes documents</h2>
            <p className="docs-description">
              L'IA n'est pas juste un gadget indépendant. Elle est profondément intégrée à vos ressources Sunubiblio. Vous pouvez directement interagir avec les livres, cours et documents auxquels vous avez accès.
            </p>
            <ul className="docs-features-list">
              <li>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Résumer un document complet en quelques secondes.</span>
              </li>
              <li>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Obtenir des explications sur les passages difficiles.</span>
              </li>
              <li>
                <div className="feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>Générer automatiquement des QCM depuis vos cours.</span>
              </li>
            </ul>
          </div>

          <div className="docs-visual">
            <div className="flow-mockup">
              <div className="flow-step">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                </div>
                <span className="step-label">Bibliothèque</span>
              </div>
              <div className="flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
              <div className="flow-step">
                <div className="step-book">
                  <div className="book-cover"></div>
                  <div className="book-btn">Résumer avec l'IA</div>
                </div>
                <span className="step-label">Livre / Document</span>
              </div>
              <div className="flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
              <div className="flow-step active">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <span className="step-label">Assistant IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ia-docs-section {
          padding: 80px 0;
          background: #f8fafc;
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        .docs-content-wrapper {
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .docs-text {
          flex: 1;
        }

        .docs-title {
          font-size: clamp(28px, 3.5vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .docs-description {
          font-size: 16px;
          color: #64748b;
          line-height: 1.7;
          margin: 0 0 32px 0;
        }

        .docs-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .docs-features-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15.5px;
          color: #334155;
          font-weight: 500;
        }

        .feature-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          flex-shrink: 0;
        }

        .docs-visual {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .flow-mockup {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #ffffff;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .flow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: #f1f5f9;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .flow-step.active .step-icon {
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.4);
          border-color: #4f46e5;
        }

        .step-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .flow-step.active .step-label {
          color: #4f46e5;
        }

        .step-book {
          width: 100px;
          height: 130px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 8px;
          border: 1px solid rgba(203, 213, 225, 0.8);
          box-shadow: 4px 4px 10px rgba(15, 23, 42, 0.05);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 12px;
          position: relative;
          overflow: hidden;
        }

        .book-cover {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 40px;
          background: #cbd5e1;
          border-radius: 4px;
        }

        .book-btn {
          font-size: 9px;
          font-weight: 700;
          background: #4f46e5;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 1;
        }

        .flow-arrow {
          color: #cbd5e1;
        }

        @media (max-width: 960px) {
          .docs-content-wrapper {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }

          .docs-features-list li {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .flow-mockup {
            flex-direction: column;
            gap: 24px;
            padding: 30px;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </section>
  );
};
