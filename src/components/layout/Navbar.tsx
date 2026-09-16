'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLauncher } from './AppLauncher';
import { UserMenu } from './UserMenu';
import { NotificationsPopover } from './NotificationsPopover';
import { HelpPopover } from './HelpPopover';
import { ContextualNavigation } from './ContextualNavigation';
import { SunuIaIcon } from './SunuIaIcon';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  activePage?: string;
  hideOnMobile?: boolean;
}

// Logo SVG officiel Sunubiblio réutilisable
const SunubiblioLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="6 6 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="navPet1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <linearGradient id="navPet2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="navPet3" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="navPet4" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
      <path d="M 0,-6 C 12,-28 28,-36 36,-28 C 44,-20 36,-4 14,0 Z" fill="url(#navPet1)" />
      <path d="M 6,0 C 28,12 36,28 28,36 C 20,44 4,36 0,14 Z" fill="url(#navPet2)" />
      <path d="M 0,6 C -12,28 -28,36 -36,28 C -44,20 -36,4 -14,0 Z" fill="url(#navPet3)" />
      <path d="M -6,0 C -28,-12 -36,-28 -28,-36 C -20,-44 -4,-36 0,-14 Z" fill="url(#navPet4)" />
    </g>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activePage = 'accueil',
  hideOnMobile = false,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname() || '/';

  // Détection active de la route courante pour la navigation essentielle et tiroirs
  const isBibliotheque = pathname === '/bibliotheque' || pathname.startsWith('/bibliotheque/');
  const isEducation = pathname === '/education' || pathname.startsWith('/education/');
  const isConcours = pathname === '/concours' || pathname.startsWith('/concours/');
  const isExercices = pathname === '/exercices' || pathname.startsWith('/exercices/');
  const isIA = pathname === '/ia' || pathname.startsWith('/ia/');

  return (
    <header className={`navbar-wrapper ${hideOnMobile ? 'desktop-only-navbar' : ''}`}>
      {/* =========================================================
          1. HEADER DESKTOP / TABLETTE (Inchangé - Disposition fluide)
          ========================================================= */}
      <div className="container navbar-container navbar-desktop-container desktop-only">
        {/* GAUCHE : [Logo Sunubiblio] + [Nav Essentielle] */}
        <div className="nav-left-group">
          {/* Logo & Marque Sunubiblio */}
          <Link
            href="/"
            className="brand-link"
            title="Sunubiblio — Accueil"
            aria-label="Sunubiblio — Retour à l'accueil"
          >
            <div className="brand-logo-wrap">
              <SunubiblioLogo size={32} />
            </div>
            <span className="brand-name">Sunubiblio</span>
          </Link>

          {/* Navigation essentielle visible sur Desktop : Bibliothèque, Éducation, Concours */}
          <nav className="essential-nav-links desktop-only" aria-label="Navigation principale essentielle">
            <Link
              href="/bibliotheque"
              className={`essential-nav-link ${isBibliotheque ? 'active' : ''}`}
            >
              <span>Bibliothèque</span>
              {isBibliotheque && <span className="active-indicator" />}
            </Link>

            <Link
              href="/education"
              className={`essential-nav-link ${isEducation ? 'active' : ''}`}
            >
              <span>Éducation</span>
              {isEducation && <span className="active-indicator" />}
            </Link>

            <Link
              href="/concours"
              className={`essential-nav-link ${isConcours ? 'active' : ''}`}
            >
              <span>Concours</span>
              {isConcours && <span className="active-indicator" />}
            </Link>
          </nav>
        </div>

        {/* DROITE : [Aide] + [Notifications] + [SunuIA] + [Applications] + [Avatar] */}
        <div className="nav-right-actions">
          {/* 1. Aide & FAQ */}
          <div className="desktop-only">
            <HelpPopover />
          </div>

          {/* 2. Notifications */}
          <NotificationsPopover />

          {/* 3. Bouton Accès Direct SunuIA */}
          <Link
            href="/ia"
            className={`nav-ia-pill-btn ${isIA ? 'is-active' : ''}`}
            title="Accéder à SunuIA — Assistant intelligent Sunubiblio"
            aria-label="SunuIA — Assistant intelligent"
          >
            <span className="ia-icon-sparkle">
              <SunuIaIcon size={18} />
            </span>
            <span className="ia-text desktop-only">SunuIA</span>
            <span className="ia-pulse-dot" aria-hidden="true" />
          </Link>

          {/* 4. Lanceur d'Applications (Grille 3x3 moderne) */}
          <AppLauncher />

          {/* 5. Avatar / Mon Espace */}
          <UserMenu onOpenAuth={onOpenAuth} />
        </div>
      </div>

      {/* =========================================================
          2. HEADER MOBILE EXCLUSIF : STRUCTURÉ EN 2 SECTIONS
          ========================================================= */}
      <div className="navbar-mobile-header mobile-only">
        {/* SECTION 1 — IDENTITÉ : Ligne dédiée aérée pour le Logo & Marque */}
        <div className="mobile-header-identity">
          <Link
            href="/"
            className="mobile-brand-link"
            title="Sunubiblio — Accueil"
            aria-label="Sunubiblio — Retour à l'accueil"
          >
            <div className="brand-logo-wrap">
              <SunubiblioLogo size={28} />
            </div>
            <span className="brand-name">Sunubiblio</span>
          </Link>
        </div>

        {/* SECTION 2 — NAVIGATION & ACTIONS : Rangée harmonieuse et équilibrée */}
        <div className="mobile-header-actions-row">
          {/* 1. Menu rapide (tiroir latéral) */}
          <button
            type="button"
            className="mobile-action-btn"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            aria-label="Ouvrir le menu de navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {mobileDrawerOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* 2. Notifications */}
          <NotificationsPopover />

          {/* 3. Bouton SunuIA (Pilule mobile élégante) */}
          <Link
            href="/ia"
            className={`nav-ia-pill-btn mobile-ia-pill ${isIA ? 'is-active' : ''}`}
            title="Accéder à SunuIA — Assistant intelligent Sunubiblio"
            aria-label="SunuIA — Assistant intelligent"
          >
            <span className="ia-icon-sparkle">
              <SunuIaIcon size={16} />
            </span>
            <span className="ia-text">SunuIA</span>
            <span className="ia-pulse-dot" aria-hidden="true" />
          </Link>

          {/* 4. Applications (Lanceur grille 3x3) */}
          <AppLauncher />

          {/* 5. Avatar / Mon Espace */}
          <UserMenu onOpenAuth={onOpenAuth} />
        </div>
      </div>

      {/* =========================================================
          TIROIR LATÉRAL MOBILE POUR LES LIENS SECONDAIRES
          ========================================================= */}
      {mobileDrawerOpen && (
        <div className="mobile-menu-drawer mobile-only">
          <div className="mobile-drawer-header">
            <span className="drawer-heading">Menu Rapide</span>
            <button
              type="button"
              className="drawer-close-icon"
              onClick={() => setMobileDrawerOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mobile-nav-items">
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}
            >
              🏠 Accueil
            </Link>
            <Link
              href="/bibliotheque"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${isBibliotheque ? 'active' : ''}`}
            >
              📚 Bibliothèque
            </Link>
            <Link
              href="/education"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname.startsWith('/education') ? 'active' : ''}`}
            >
              🎓 Éducation
            </Link>
            <Link
              href="/concours"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${isConcours ? 'active' : ''}`}
            >
              🏆 Concours
            </Link>
            <Link
              href="/exercices"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${isExercices ? 'active' : ''}`}
            >
              📝 Exercices & QCM
            </Link>
            <Link
              href="/ia"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${isIA ? 'active' : ''}`}
            >
              <SunuIaIcon size={18} style={{ marginRight: '8px' }} /> SunuIA
            </Link>
            <Link
              href="/documents"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname.startsWith('/documents') ? 'active' : ''}`}
            >
              📄 Documents & Outils
            </Link>
            <Link
              href="/religion"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname.startsWith('/religion') ? 'active' : ''}`}
            >
              🕌 Religion & Savoirs
            </Link>
            <Link
              href="/tarifs"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname.startsWith('/tarifs') ? 'active' : ''}`}
            >
              ⭐ Formules & Tarifs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileDrawerOpen(false)}
              className={`mobile-nav-item ${pathname.startsWith('/contact') ? 'active' : ''}`}
            >
              ✉️ Assistance & Contact
            </Link>
          </div>

          <div className="mobile-drawer-auth">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                setMobileDrawerOpen(false);
                if (onOpenAuth) onOpenAuth('login');
              }}
            >
              Se connecter / S'inscrire
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          NAVIGATION CONTEXTUELLE DYNAMIQUE SOUS LE HEADER
          ========================================================= */}
      <ContextualNavigation />
    </header>
  );
};
