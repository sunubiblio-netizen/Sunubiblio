'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname() || '/';

  // Normalize path without trailing slash for matching
  const cleanPath =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  // Masquer la navigation mobile inférieure pendant le passage d'un test spécifique (/exercices/[id])
  const isExercisePlayer = cleanPath.startsWith('/exercices/') && cleanPath !== '/exercices';

  // Determine active route
  const isHome = cleanPath === '/' || cleanPath === '';
  const isBibliotheque = cleanPath === '/bibliotheque' || cleanPath.startsWith('/bibliotheque/');
  const isConcours = cleanPath === '/concours' || cleanPath.startsWith('/concours/');
  const isFavoris = cleanPath === '/favoris' || cleanPath.startsWith('/favoris/');
  const isProfil = cleanPath === '/profil' || cleanPath.startsWith('/profil/');

  return (
    <nav
      className={`mobile-bottom-nav-root ${isExercisePlayer ? 'is-hidden-on-player' : ''}`}
      style={isExercisePlayer ? { display: 'none' } : undefined}
      aria-label="Navigation mobile principale"
      aria-hidden={isExercisePlayer ? 'true' : undefined}
    >
      <div className="bottom-nav-grid">
        {/* 1. Accueil */}
        <Link
          href="/"
          className={`nav-tab-item ${isHome ? 'active' : ''}`}
          aria-label="Aller à l'accueil"
          aria-current={isHome ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isHome ? 'rgba(79, 70, 229, 0.12)' : 'none'}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="tab-label">Accueil</span>
          {isHome && <span className="active-dot-indicator" />}
        </Link>

        {/* 2. Bibliothèque */}
        <Link
          href="/bibliotheque"
          className={`nav-tab-item ${isBibliotheque ? 'active' : ''}`}
          aria-label="Aller à la bibliothèque"
          aria-current={isBibliotheque ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isBibliotheque ? 'rgba(79, 70, 229, 0.12)' : 'none'}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="tab-label">Bibliothèque</span>
          {isBibliotheque && <span className="active-dot-indicator" />}
        </Link>

        {/* 3. Concours */}
        <Link
          href="/concours"
          className={`nav-tab-item ${isConcours ? 'active' : ''}`}
          aria-label="Aller aux concours"
          aria-current={isConcours ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isConcours ? 'rgba(79, 70, 229, 0.12)' : 'none'}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <span className="tab-label">Concours</span>
          {isConcours && <span className="active-dot-indicator" />}
        </Link>

        {/* 4. Favoris */}
        <Link
          href="/favoris"
          className={`nav-tab-item ${isFavoris ? 'active' : ''}`}
          aria-label="Aller aux favoris"
          aria-current={isFavoris ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isFavoris ? 'rgba(236, 72, 153, 0.15)' : 'none'}
              stroke={isFavoris ? '#ec4899' : 'currentColor'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="tab-label">Favoris</span>
          {isFavoris && <span className="active-dot-indicator" />}
        </Link>

        {/* 5. Profil */}
        <Link
          href="/profil"
          className={`nav-tab-item ${isProfil ? 'active' : ''}`}
          aria-label="Accéder au profil"
          aria-current={isProfil ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isProfil ? 'rgba(79, 70, 229, 0.12)' : 'none'}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="tab-label">Profil</span>
          {isProfil && <span className="active-dot-indicator" />}
        </Link>
      </div>
    </nav>
  );
};
