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
  if (isExercisePlayer) {
    return null;
  }

  // Determine active route
  const isHome = cleanPath === '/' || cleanPath === '';
  const isBibliotheque = cleanPath === '/bibliotheque' || cleanPath.startsWith('/bibliotheque/');
  const isEducation = cleanPath === '/education' || cleanPath.startsWith('/education/');
  const isConcours = cleanPath === '/concours' || cleanPath.startsWith('/concours/');
  const isProfil = cleanPath === '/profil' || cleanPath.startsWith('/profil/') || cleanPath === '/favoris';

  return (
    <nav className="mobile-bottom-nav-root" aria-label="Navigation mobile principale">
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

        {/* 3. Éducation */}
        <Link
          href="/education"
          className={`nav-tab-item ${isEducation ? 'active' : ''}`}
          aria-label="Aller à l'espace éducation"
          aria-current={isEducation ? 'page' : undefined}
        >
          <div className="tab-icon-wrap">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isEducation ? 'rgba(79, 70, 229, 0.12)' : 'none'}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="tab-label">Éducation</span>
          {isEducation && <span className="active-dot-indicator" />}
        </Link>

        {/* 4. Concours */}
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
