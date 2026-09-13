'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

export default function FavorisPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="favoris-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="favoris" />

      <main className="favoris-main">
        <div className="container favoris-container">
          <div className="badge-pill fav-badge">
            <span className="badge-dot" />
            <span>Espace Personnel & Favoris</span>
          </div>

          <h1 className="favoris-title">
            Mes <span className="gradient-hero-text">Favoris</span> & Documents Sauvegardés
          </h1>
          <p className="favoris-subtitle">
            Retrouvez rapidement vos livres, annales de concours, cours et fascicules préférés.
          </p>

          <div className="fav-empty-card">
            <div className="fav-icon-box">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="fav-empty-title">Vous n'avez pas encore de favoris</h2>
            <p className="fav-empty-desc">
              Parcourez la bibliothèque ou le portail des concours et cliquez sur l’icône cœur pour
              enregistrer vos documents et réviser hors connexion.
            </p>

            <div className="fav-actions">
              <Link href="/bibliotheque" className="btn-primary fav-cta-btn">
                <span>Explorer la bibliothèque</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/concours" className="btn-secondary fav-sec-btn">
                Voir les concours
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .favoris-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
        }

        .favoris-main {
          flex: 1;
        }

        .favoris-container {
          padding-top: 48px;
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 820px;
        }

        .fav-badge {
          margin-bottom: 16px;
        }

        .favoris-title {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .favoris-subtitle {
          font-size: 15px;
          color: #64748b;
          max-width: 600px;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .fav-empty-card {
          width: 100%;
          background: #ffffff;
          border: 1.5px dashed rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-xl);
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
        }

        .fav-icon-box {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: rgba(236, 72, 153, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .fav-empty-title {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .fav-empty-desc {
          font-size: 14px;
          color: #64748b;
          max-width: 460px;
          line-height: 1.55;
          margin-bottom: 24px;
        }

        .fav-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .fav-cta-btn {
          padding: 11px 22px;
          font-size: 14px;
        }

        .fav-sec-btn {
          padding: 11px 20px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
