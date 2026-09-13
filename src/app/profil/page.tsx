'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

export default function ProfilPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="profil-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="profil" />

      <main className="profil-main">
        <div className="container profil-container">
          {/* Profile Card Header */}
          <div className="profile-header-card">
            <div className="profile-avatar-box">
              <span className="profile-avatar-txt">SB</span>
            </div>

            <div className="profile-details">
              <div className="profile-name-row">
                <h1 className="profile-user-name">Mon Compte Sunubiblio</h1>
                <span className="account-status-tag">Compte Démo Gratuit</span>
              </div>
              <p className="profile-email">Connectez-vous pour accéder à vos documents enregistrés et synchroniser vos cours.</p>
            </div>

            <div className="profile-auth-btns">
              <button
                type="button"
                className="btn-primary auth-action-btn"
                onClick={() => handleOpenAuth('login')}
              >
                Se connecter
              </button>
              <button
                type="button"
                className="btn-secondary auth-action-btn"
                onClick={() => handleOpenAuth('register')}
              >
                Créer un compte
              </button>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="profile-settings-grid">
            {/* Box 1: Formule & Abonnement */}
            <div className="settings-box">
              <div className="box-icon-wrap icon-sub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="box-title">Formules d’abonnement</h3>
              <p className="box-desc">
                Accédez en illimité aux 1 200+ ressources, annales corrigées et corrections détaillées.
              </p>
              <Link href="/#tarifs" className="btn-secondary box-action-btn">
                Voir les tarifs (dès 3 000 FCFA/mois)
              </Link>
            </div>

            {/* Box 2: Téléchargements & Hors connexion */}
            <div className="settings-box">
              <div className="box-icon-wrap icon-download">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="box-title">Mes Téléchargements</h3>
              <p className="box-desc">
                Vos manuels, fascicules et sujets enregistrés pour réviser sans connexion Internet.
              </p>
              <Link href="/bibliotheque" className="btn-secondary box-action-btn">
                Explorer les manuels hors connexion
              </Link>
            </div>

            {/* Box 3: Sécurité & Paramètres */}
            <div className="settings-box">
              <div className="box-icon-wrap icon-shield">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="box-title">Sécurité & Confidentialité</h3>
              <p className="box-desc">
                Données d'apprentissage chiffrées, gestion des appareils autorisés et mot de passe.
              </p>
              <button
                type="button"
                className="btn-secondary box-action-btn"
                onClick={() => handleOpenAuth('login')}
              >
                Gérer la sécurité
              </button>
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
        .profil-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
        }

        .profil-main {
          flex: 1;
        }

        .profil-container {
          padding-top: 36px;
          padding-bottom: 60px;
          max-width: 960px;
        }

        .profile-header-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-xl);
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 28px;
          box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.04);
          flex-wrap: wrap;
        }

        .profile-avatar-box {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        .profile-details {
          flex: 1;
          min-width: 260px;
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .profile-user-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .account-status-tag {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .profile-email {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.45;
        }

        .profile-auth-btns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .auth-action-btn {
          font-size: 13.5px;
          padding: 9px 18px;
        }

        /* Grid */
        .profile-settings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .settings-box {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.02);
        }

        .box-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .icon-sub {
          background: rgba(79, 70, 229, 0.1);
        }

        .icon-download {
          background: rgba(14, 165, 233, 0.1);
        }

        .icon-shield {
          background: rgba(16, 185, 129, 0.1);
        }

        .box-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .box-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 20px;
          flex: 1;
        }

        .box-action-btn {
          width: 100%;
          font-size: 12.5px;
          padding: 9px;
          text-align: center;
        }

        @media (max-width: 860px) {
          .profil-container {
            padding-top: 20px;
            padding-bottom: 96px !important;
          }

          .profile-settings-grid {
            grid-template-columns: 1fr;
          }

          .profile-header-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-auth-btns {
            width: 100%;
          }

          .auth-action-btn {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
