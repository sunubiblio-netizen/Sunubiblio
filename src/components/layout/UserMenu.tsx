'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserMenuProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fermer automatiquement au changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fermeture clic extérieur et Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      {/* Bouton Avatar avec anneau dégradé Sunubiblio */}
      <button
        type="button"
        className={`user-avatar-trigger-btn ${isOpen ? 'is-active' : ''}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Mon espace et menu utilisateur"
        title="Mon Espace & Profil"
      >
        <div className="avatar-ring">
          <span className="avatar-initials">SB</span>
        </div>
      </button>

      {/* Popover Menu Déroulant Moderne */}
      {isOpen && (
        <div
          className="user-menu-dropdown"
          role="dialog"
          aria-label="Menu personnel de Mon Espace"
        >
          {/* 1. Carte En-tête Profil */}
          <div className="user-card-header">
            <div className="user-header-avatar">
              <span>SB</span>
            </div>
            <div className="user-header-info">
              <h3 className="user-display-name">Mon Espace Sunubiblio</h3>
              <p className="user-email-preview">etudiant@sunubiblio.sn</p>
              <div className="user-plan-tag">
                <span className="plan-dot" />
                <span>Pass Découverte • Gratuit</span>
              </div>
            </div>
          </div>

          {/* Bannière d'accès rapide / Callout */}
          <div className="user-menu-banner">
            <div className="banner-left">
              <strong>Passez à Sunubiblio Gold</strong>
              <span>Accès illimité aux concours, documents & IA</span>
            </div>
            <Link
              href="/tarifs"
              className="user-upgrade-pill-btn"
              onClick={() => setIsOpen(false)}
            >
              Découvrir
            </Link>
          </div>

          {/* 2. Section : Mon Espace Social & Apprentissage */}
          <div className="user-menu-section">
            <span className="user-section-title">Mon Activité & Savoirs</span>

            <Link
              href="/profil"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Mon Profil & Publications</span>
            </Link>

            <Link
              href="/favoris"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Mes Favoris & Enregistrés</span>
            </Link>

            <Link
              href="/profil#progression"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Ma Progression & Scores</span>
            </Link>
          </div>

          {/* 3. Section : Création & Commerce */}
          <div className="user-menu-section">
            <span className="user-section-title">Création & Ventes</span>

            <Link
              href="/documents"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Mes Documents & Fichiers</span>
            </Link>

            <Link
              href="/marketplace#ventes"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Mes Ventes & Ressources</span>
              <span className="section-pill-gold">Vendeur</span>
            </Link>
          </div>

          {/* 4. Section : Gestion du Compte */}
          <div className="user-menu-section no-border">
            <Link
              href="/tarifs"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Mon Abonnement</span>
            </Link>

            <button
              type="button"
              className="user-menu-action-btn"
              onClick={() => {
                setIsOpen(false);
                if (onOpenAuth) onOpenAuth('login');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Se connecter / Changer de compte</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
