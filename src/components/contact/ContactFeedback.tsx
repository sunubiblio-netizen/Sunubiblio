'use client';

import React from 'react';
import Link from 'next/link';

interface ContactSuccessProps {
  onReset: () => void;
}

export const ContactSuccess: React.FC<ContactSuccessProps> = ({ onReset }) => {
  return (
    <div className="feedback-card success-card">
      <div className="feedback-icon-wrap icon-success">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h3 className="feedback-title">Message envoyé !</h3>

      <p className="feedback-desc">
        Merci pour votre message. Nous avons bien reçu votre demande et nous vous répondrons dès que possible.
      </p>

      <div className="feedback-actions">
        <button
          type="button"
          className="btn-primary feedback-btn-primary"
          onClick={onReset}
        >
          <span>Envoyer un autre message</span>
        </button>

        <Link href="/" className="btn-secondary feedback-btn-secondary">
          <span>Retour à l’accueil</span>
        </Link>
      </div>

      <style jsx>{`
        .feedback-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 50px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--shadow-card);
          animation: fadeIn 0.3s ease;
        }

        .feedback-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feedback-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .feedback-desc {
          font-size: 15px;
          color: var(--text-body);
          line-height: 1.65;
          max-width: 480px;
          margin-bottom: 32px;
        }

        .feedback-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .feedback-btn-primary {
          padding: 12px 24px;
        }

        .feedback-btn-secondary {
          padding: 12px 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 500px) {
          .feedback-card {
            padding: 36px 20px;
          }

          .feedback-actions {
            flex-direction: column;
            width: 100%;
          }

          .feedback-btn-primary,
          .feedback-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

interface ContactErrorProps {
  message?: string;
  onRetry: () => void;
}

export const ContactErrorBanner: React.FC<ContactErrorProps> = ({
  message = 'Impossible d’envoyer votre message. Veuillez réessayer dans quelques instants.',
  onRetry,
}) => {
  return (
    <div className="error-banner">
      <div className="error-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="error-text">{message}</span>
      </div>
      <button type="button" className="btn-retry" onClick={onRetry}>
        Réessayer
      </button>

      <style jsx>{`
        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 24px;
          animation: shake 0.3s ease;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .error-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #991b1b;
        }

        .btn-retry {
          background: #ffffff;
          border: 1px solid #fca5a5;
          color: #dc2626;
          font-weight: 700;
          font-size: 12.5px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-retry:hover {
          background: #dc2626;
          color: #ffffff;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        @media (max-width: 600px) {
          .error-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .btn-retry {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
