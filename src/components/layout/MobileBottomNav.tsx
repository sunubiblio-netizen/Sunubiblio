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

  // Masquer la navigation mobile inférieure pendant le passage d'un test spécifique ou dans les discussions
  const isExercisePlayer = cleanPath.startsWith('/exercices/') && cleanPath !== '/exercices';
  const isDiscussions = cleanPath.startsWith('/discussions');
  const shouldHideBottomNav = isExercisePlayer || isDiscussions;

  // Determine active route
  const isHome = cleanPath === '/' || cleanPath === '';
  const isEducation = cleanPath === '/education' || cleanPath.startsWith('/education/');
  const isBibliotheque = cleanPath === '/bibliotheque' || cleanPath.startsWith('/bibliotheque/');
  const isConcours = cleanPath === '/concours' || cleanPath.startsWith('/concours/');
  const isProfil = cleanPath === '/profil' || cleanPath.startsWith('/profil/');

  return (
    <nav
      className={`mobile-bottom-nav-root ${shouldHideBottomNav ? 'is-hidden-on-player' : ''}`}
      style={shouldHideBottomNav ? { display: 'none' } : undefined}
      aria-label="Navigation mobile principale"
      aria-hidden={shouldHideBottomNav ? 'true' : undefined}
    >
      {/* Arrière-plan SVG blanc pur 100% opaque avec encoche incurvée au centre */}
      <div className="bottom-nav-notch-backdrop" aria-hidden="true">
        <svg
          className="bottom-nav-notch-svg"
          viewBox="0 0 360 62"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 28 0 L 138 0 C 152 0 156 30 180 30 C 204 30 208 0 222 0 L 332 0 C 347.5 0 360 12.5 360 28 L 360 38 C 360 51.5 349 62 335.5 62 L 24.5 62 C 11 62 0 51.5 0 38 L 0 28 C 0 12.5 12.5 0 28 0 Z"
            fill="#ffffff"
            stroke="rgba(226, 232, 240, 0.95)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Contenu de navigation : [Accueil] [Éducation] | [BIBLIOTHÈQUE FAB] | [Concours] [Profil] */}
      <div className="bottom-nav-content">
        {/* GROUPE GAUCHE : Accueil & Éducation */}
        <div className="nav-side-group nav-left-group">
          {/* 1. Accueil */}
          <Link
            href="/"
            className={`nav-tab-item ${isHome ? 'active' : ''}`}
            aria-label="Aller à l'accueil"
            aria-current={isHome ? 'page' : undefined}
          >
            <div className="tab-pill">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill={isHome ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isHome ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H15V15.5C15 14.9477 14.5523 14.5 14 14.5H10C9.44772 14.5 9 14.9477 9 15.5V21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z" />
              </svg>
            </div>
            <span className="tab-label">Accueil</span>
          </Link>

          {/* 2. Éducation */}
          <Link
            href="/education"
            className={`nav-tab-item ${isEducation ? 'active' : ''}`}
            aria-label="Aller à l'éducation"
            aria-current={isEducation ? 'page' : undefined}
          >
            <div className="tab-pill">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isEducation ? '2.4' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="tab-label">Éducation</span>
          </Link>
        </div>

        {/* GROUPE CENTRE : Bibliothèque (Bouton rond surélevé FAB dans l'encoche) */}
        <div className="nav-center-slot">
          <Link
            href="/bibliotheque"
            className={`nav-center-fab ${isBibliotheque ? 'active' : ''}`}
            aria-label="Aller à la bibliothèque"
            aria-current={isBibliotheque ? 'page' : undefined}
          >
            <div className="center-fab-circle">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="9" y1="7" x2="16" y2="7" />
                <line x1="9" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <span className="center-fab-label">Bibliothèque</span>
          </Link>
        </div>

        {/* GROUPE DROITE : Concours & Profil */}
        <div className="nav-side-group nav-right-group">
          {/* 4. Concours */}
          <Link
            href="/concours"
            className={`nav-tab-item ${isConcours ? 'active' : ''}`}
            aria-label="Aller aux concours"
            aria-current={isConcours ? 'page' : undefined}
          >
            <div className="tab-pill">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill={isConcours ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isConcours ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <span className="tab-label">Concours</span>
          </Link>

          {/* 5. Profil (avec avatar circulaire Mamadou Diop) */}
          <Link
            href="/profil"
            className={`nav-tab-item ${isProfil ? 'active' : ''}`}
            aria-label="Accéder au profil"
            aria-current={isProfil ? 'page' : undefined}
          >
            <div className="tab-pill">
              <div className={`telegram-avatar-frame ${isProfil ? 'is-active' : ''}`}>
                <img
                  src="/avatar_mamadou.jpg"
                  alt="Profil"
                  className="telegram-avatar-img"
                />
              </div>
            </div>
            <span className="tab-label">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
