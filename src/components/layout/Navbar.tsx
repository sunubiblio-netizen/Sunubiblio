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

// Logo officiel Sunubiblio réutilisable (chargé depuis /logo.svg pour garantir le rendu parfait sans conflit de gradients)
const SunubiblioLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <img
    src="/logo.svg"
    alt="Sunubiblio"
    width={size}
    height={size}
    className={className}
    style={{
      display: 'block',
      width: `${size}px`,
      height: `${size}px`,
      flexShrink: 0,
      objectFit: 'contain',
    }}
  />
);

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activePage = 'accueil',
  hideOnMobile = false,
}) => {
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

        {/* SECTION 2 — NAVIGATION & ACTIONS : [SB] (Mon Espace) ... [🔔] [SunuIA] [⋮⋮⋮] */}
        <div className="mobile-header-actions-row">
          {/* 1. Profil & Mon Espace Biblio à gauche (remplace l'ancien menu 3 traits) */}
          <div className="mobile-profile-left">
            <UserMenu onOpenAuth={onOpenAuth} />
          </div>

          {/* 2. Groupe compact des actions de droite : [🔔] [SunuIA] [⋮⋮⋮] */}
          <div className="mobile-actions-right-group">
            {/* Notifications */}
            <NotificationsPopover />

            {/* Logo SunuIA pur (26px) */}
            <Link
              href="/ia"
              className="mobile-ia-icon-link"
              title="Accéder à SunuIA — Assistant intelligent Sunubiblio"
              aria-label="SunuIA — Assistant intelligent"
            >
              <SunuIaIcon size={26} />
            </Link>

            {/* Applications (Lanceur grille 3x3) */}
            <AppLauncher />
          </div>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION CONTEXTUELLE DYNAMIQUE SOUS LE HEADER
          ========================================================= */}
      <ContextualNavigation />
    </header>
  );
};
