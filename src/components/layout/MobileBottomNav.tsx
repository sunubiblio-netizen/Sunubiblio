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
  const isBibliotheque = cleanPath === '/bibliotheque' || cleanPath.startsWith('/bibliotheque/');
  const isConcours = cleanPath === '/concours' || cleanPath.startsWith('/concours/');
  const isFavoris = cleanPath === '/favoris' || cleanPath.startsWith('/favoris/');
  const isProfil = cleanPath === '/profil' || cleanPath.startsWith('/profil/');

  return (
    <nav
      className={`mobile-bottom-nav-root ${shouldHideBottomNav ? 'is-hidden-on-player' : ''}`}
      style={shouldHideBottomNav ? { display: 'none' } : undefined}
      aria-label="Navigation mobile principale"
      aria-hidden={shouldHideBottomNav ? 'true' : undefined}
    >
      <div className="bottom-nav-grid">
        {/* 1. Accueil */}
        <Link
          href="/"
          className={`nav-tab-item ${isHome ? 'active' : ''}`}
          aria-label="Aller à l'accueil"
          aria-current={isHome ? 'page' : undefined}
        >
          <div className="tab-pill">
            <svg
              width="18"
              height="18"
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

        {/* 2. Bibliothèque */}
        <Link
          href="/bibliotheque"
          className={`nav-tab-item ${isBibliotheque ? 'active' : ''}`}
          aria-label="Aller à la bibliothèque"
          aria-current={isBibliotheque ? 'page' : undefined}
        >
          <div className="tab-pill">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="9" y1="7" x2="16" y2="7" strokeWidth="2" />
              <line x1="9" y1="11" x2="14" y2="11" strokeWidth="2" />
            </svg>
          </div>
          <span className="tab-label">Bibliothèque</span>
        </Link>

        {/* 3. Concours */}
        <Link
          href="/concours"
          className={`nav-tab-item ${isConcours ? 'active' : ''}`}
          aria-label="Aller aux concours"
          aria-current={isConcours ? 'page' : undefined}
        >
          <div className="tab-pill">
            <svg
              width="18"
              height="18"
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

        {/* 4. Favoris */}
        <Link
          href="/favoris"
          className={`nav-tab-item ${isFavoris ? 'active' : ''}`}
          aria-label="Aller aux favoris"
          aria-current={isFavoris ? 'page' : undefined}
        >
          <div className="tab-pill">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isFavoris ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFavoris ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
          </div>
          <span className="tab-label">Favoris</span>
        </Link>

        {/* 5. Profil (avec avatar Telegram circulaire compact) */}
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
    </nav>
  );
};
