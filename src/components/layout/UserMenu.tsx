'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOCK_PROFILE_USER } from '@/data/mockProfileData';
import {
  IconProfil,
  IconCommunaute,
  IconPublications,
  IconGroupes,
  IconDiscussions,
} from './app-launcher/AppLauncherIcons';

interface UserMenuProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  triggerVariant?: 'hotdog' | 'avatar' | 'auto';
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onOpenAuth,
  triggerVariant = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Données automatiques du compte connecté
  const currentUser = MOCK_PROFILE_USER;

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

  // Verrouillage STRICT et ABSOLU de l'arrière-plan (aucun défilement ni sautillement sur mobile iOS/Android/Desktop)
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    body.classList.add('modal-scroll-locked');
    html.classList.add('modal-scroll-locked');
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      body.classList.remove('modal-scroll-locked');
      html.classList.remove('modal-scroll-locked');
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const showHotDog = triggerVariant === 'hotdog' || triggerVariant === 'auto';
  const showAvatar = triggerVariant === 'avatar' || triggerVariant === 'auto';

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      {/* 1. Variante Déclencheur HOT DOG (3 traits stylisés aux couleurs de Sunubiblio) */}
      {showHotDog && (
        <button
          type="button"
          className={`user-menu-hotdog-btn ${isOpen ? 'is-active' : ''} ${triggerVariant === 'auto' ? 'mobile-only-trigger' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Ouvrir le menu de navigation et Mon Espace"
          title="Menu de navigation"
        >
          <div className="hotdog-icon-wrap" aria-hidden="true">
            <span className="hotdog-bar hotdog-bar-top" />
            <span className="hotdog-bar hotdog-bar-middle" />
            <span className="hotdog-bar hotdog-bar-bottom" />
          </div>
        </button>
      )}

      {/* 2. Variante Déclencheur AVATAR (utilisée sur Desktop) */}
      {showAvatar && (
        <button
          type="button"
          className={`user-avatar-trigger-btn ${isOpen ? 'is-active' : ''} ${triggerVariant === 'auto' ? 'desktop-only-trigger' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Mon espace et menu utilisateur"
          title="Mon Espace & Profil"
        >
          <div className="avatar-ring">
            <img
              src={currentUser.avatarUrl || '/images/user-profile-logo.png'}
              alt={currentUser.displayName}
              className="avatar-logo-img"
            />
          </div>
        </button>
      )}

      {/* Popover / Side-Drawer Moderne avec animation fluide */}
      {isOpen && (
        <>
          <div
            className="user-menu-backdrop"
            onClick={() => setIsOpen(false)}
            onTouchMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-hidden="true"
          />
          <div
            className="user-menu-dropdown"
            role="dialog"
            aria-label="Menu personnel de Mon Espace"
          >
            {/* ZONE HAUTE DU DRAWER */}
            <div className="user-drawer-top">
              {/* 1. Carte En-tête Profil avec la vraie photo du titulaire de compte */}
              <div className="user-card-header">
                <div className="user-header-avatar">
                  <img
                    src={currentUser.avatarUrl || '/images/user-profile-logo.png'}
                    alt={currentUser.displayName}
                    className="user-header-avatar-img"
                  />
                  {currentUser.isVerified && (
                    <span className="user-header-verified-dot" title="Compte vérifié">
                      ✓
                    </span>
                  )}
                </div>
                <div className="user-header-info">
                  <h3 className="user-display-name">{currentUser.displayName}</h3>
                  <p className="user-email-preview">
                    {currentUser.username ? `${currentUser.username.replace('@', '')}@sunubiblio.sn` : 'etudiant@sunubiblio.sn'}
                  </p>
                  <div className="user-plan-tag">
                    <span className="plan-dot" />
                    <span>{currentUser.isGoldMember ? 'Membre Gold' : 'Pass Découverte'} • {currentUser.role || 'Étudiant'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="user-drawer-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Bannière d'accès rapide / Callout Gold */}
              <div className="user-menu-banner">
                <div className="banner-left">
                  <strong>Sunubiblio Gold</strong>
                  <span>Accès illimité Concours, IA & Docs</span>
                </div>
                <Link
                  href="/tarifs"
                  className="user-upgrade-pill-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Découvrir
                </Link>
              </div>
            </div>

            {/* ZONE CENTRALE DÉFILABLE (Mon Profil + Communauté) */}
            <div className="user-drawer-body">
              {/* Section : MON PROFIL */}
              <div className="user-menu-section">
                <span className="user-section-title">Mon Profil</span>

                <Link
                  href="/profil"
                  className="user-menu-link-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="user-menu-icon-wrap">
                    <IconProfil size={20} className="user-menu-vector-icon" />
                  </div>
                  <span className="user-menu-item-text">Voir mon profil</span>
                  <svg className="user-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Section : COMMUNAUTÉ */}
              <div className="user-menu-section">
                <span className="user-section-title">Communauté</span>

                <Link
                  href="/communaute"
                  className="user-menu-link-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="user-menu-icon-wrap">
                    <IconCommunaute size={20} className="user-menu-vector-icon" />
                  </div>
                  <span className="user-menu-item-text">Communauté</span>
                  <svg className="user-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                <Link
                  href="/publications"
                  className="user-menu-link-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="user-menu-icon-wrap">
                    <IconPublications size={20} className="user-menu-vector-icon" />
                  </div>
                  <span className="user-menu-item-text">Publications</span>
                  <svg className="user-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                <Link
                  href="/groupes"
                  className="user-menu-link-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="user-menu-icon-wrap">
                    <IconGroupes size={20} className="user-menu-vector-icon" />
                  </div>
                  <span className="user-menu-item-text">Groupes</span>
                  <svg className="user-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                <Link
                  href="/discussions"
                  className="user-menu-link-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="user-menu-icon-wrap">
                    <IconDiscussions size={20} className="user-menu-vector-icon" />
                  </div>
                  <span className="user-menu-item-text">Messages</span>
                  <svg className="user-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* ZONE BASSE DU DRAWER (Fixée tout en bas avec Inscription et Déconnexion) */}
            <div className="user-drawer-footer">
              {/* Bouton Inscription */}
              <button
                type="button"
                className="user-drawer-register-btn"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAuth) onOpenAuth('register');
                }}
              >
                <div className="register-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <span className="register-main-label">Inscription</span>
                <span className="register-free-badge">Gratuit</span>
              </button>

              {/* Bouton Déconnexion */}
              <button
                type="button"
                className="user-drawer-logout-btn"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAuth) onOpenAuth('login');
                }}
              >
                <div className="logout-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


