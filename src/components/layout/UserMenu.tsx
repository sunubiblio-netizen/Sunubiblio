'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconProfil,
  IconCommunaute,
  IconPublications,
  IconGroupes,
  IconDiscussions,
} from './app-launcher/AppLauncherIcons';

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

      {/* Popover Menu Déroulant Moderne avec animation de slide */}
      {isOpen && (
        <>
          <div
            className="user-menu-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
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

          {/* 2. Section : MON PROFIL */}
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
              <span>Profil</span>
            </Link>
          </div>

          {/* 3. Section : COMMUNAUTÉ */}
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
              <span>Communauté</span>
            </Link>

            <Link
              href="/publications"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <div className="user-menu-icon-wrap">
                <IconPublications size={20} className="user-menu-vector-icon" />
              </div>
              <span>Publications</span>
            </Link>

            <Link
              href="/communaute#groupes"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <div className="user-menu-icon-wrap">
                <IconGroupes size={20} className="user-menu-vector-icon" />
              </div>
              <span>Groupes</span>
            </Link>

            <Link
              href="/communaute#discussions"
              className="user-menu-link-item"
              onClick={() => setIsOpen(false)}
            >
              <div className="user-menu-icon-wrap">
                <IconDiscussions size={20} className="user-menu-vector-icon" />
              </div>
              <span>Discussions</span>
            </Link>
          </div>

          {/* 4. Section : Déconnexion & Compte */}
          <div className="user-menu-section no-border">
            <button
              type="button"
              className="user-menu-action-btn"
              onClick={() => {
                setIsOpen(false);
                if (onOpenAuth) onOpenAuth('login');
              }}
            >
              <div className="user-menu-icon-wrap logout-icon-wrap">
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

