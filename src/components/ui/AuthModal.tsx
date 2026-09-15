'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined' || !document.body) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999999 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-icon-brand">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <path d="M 0,-6 C 12,-28 28,-36 36,-28 C 44,-20 36,-4 14,0 Z" fill="#6366F1" transform="translate(50,50)" />
              <path d="M 6,0 C 28,12 36,28 28,36 C 20,44 4,36 0,14 Z" fill="#06B6D4" transform="translate(50,50)" />
              <path d="M 0,6 C -12,28 -28,36 -36,28 C -44,20 -36,4 -14,0 Z" fill="#EC4899" transform="translate(50,50)" />
              <path d="M -6,0 C -28,-12 -36,-28 -28,-36 C -20,-44 -4,-36 0,-14 Z" fill="#9333EA" transform="translate(50,50)" />
            </svg>
          </div>
          <h3 className="modal-title">
            {mode === 'login' ? 'Connexion à Sunubiblio' : 'Créer un compte apprenant'}
          </h3>
          <p className="modal-subtitle">
            {mode === 'login'
              ? 'Accédez à vos documents, cours et historique'
              : 'Rejoignez des milliers d’élèves, étudiants et professionnels'}
          </p>
        </div>

        {/* Success Alert */}
        {submitted ? (
          <div className="success-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{mode === 'login' ? 'Connexion réussie ! Redirection...' : 'Compte créé avec succès ! Bienvenue !'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex. Awa Diop"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <input
                type="email"
                required
                placeholder="votre.email@domaine.sn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label className="form-label">Mot de passe</label>
                {mode === 'login' && (
                  <a href="#reset" className="forgot-link">Mot de passe oublié ?</a>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
              {loading ? (
                <span className="spinner" />
              ) : mode === 'login' ? (
                'Se connecter'
              ) : (
                'Créer mon compte gratuit'
              )}
            </button>
          </form>
        )}

        {/* Toggle Mode Footer */}
        <div className="modal-footer">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => setMode('register')}
              >
                Inscrivez-vous
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{' '}
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => setMode('login')}
              >
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fade-in 0.2s ease;
        }

        .modal-card {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 32px 28px 24px;
          box-shadow: 0 24px 48px -12px rgba(79, 70, 229, 0.2);
          animation: zoom-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .close-btn:hover {
          color: #0f172a;
          background: #e2e8f0;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .modal-icon-brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }

        .modal-subtitle {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.4;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label-with-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .forgot-link {
          font-size: 12px;
          color: #6366f1;
          font-weight: 600;
        }

        .form-input {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #0f172a;
          transition: all 0.2s;
        }

        .form-input:focus {
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .auth-submit-btn {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          font-size: 14.5px;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          color: #065f46;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #ffffff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .modal-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }

        .switch-mode-btn {
          color: #4f46e5;
          font-weight: 700;
          margin-left: 4px;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoom-up {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
};
