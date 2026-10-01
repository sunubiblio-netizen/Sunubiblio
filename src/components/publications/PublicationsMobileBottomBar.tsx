'use client';

import React from 'react';
import Link from 'next/link';

export type MobileNavTab = 'accueil' | 'recherche' | 'creer' | 'bibliotheque' | 'profil';

interface PublicationsMobileBottomBarProps {
  activeTab?: MobileNavTab;
  onOpenCreate: () => void;
}

export const PublicationsMobileBottomBar: React.FC<PublicationsMobileBottomBarProps> = ({
  activeTab = 'accueil',
  onOpenCreate,
}) => {
  return (
    <nav className="pub-mobile-bottom-bar" aria-label="Navigation mobile principale">
      {/* 1. Accueil */}
      <Link
        href="/publications"
        className={`pub-mobile-bottom-item ${activeTab === 'accueil' ? 'active' : ''}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="pub-mobile-bottom-label">Accueil</span>
      </Link>

      {/* 2. Recherche */}
      <Link
        href="/recherche"
        className={`pub-mobile-bottom-item ${activeTab === 'recherche' ? 'active' : ''}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span className="pub-mobile-bottom-label">Recherche</span>
      </Link>

      {/* 3. Créer */}
      <button
        type="button"
        className="pub-mobile-bottom-item pub-mobile-create-item"
        onClick={onOpenCreate}
        aria-label="Créer une publication"
      >
        <div className="pub-mobile-create-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span className="pub-mobile-bottom-label">Créer</span>
      </button>

      {/* 4. Bibliothèque */}
      <Link
        href="/bibliotheque"
        className={`pub-mobile-bottom-item ${activeTab === 'bibliotheque' ? 'active' : ''}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="pub-mobile-bottom-label">Bibliothèque</span>
      </Link>

      {/* 5. Profil */}
      <Link
        href="/profil"
        className={`pub-mobile-bottom-item ${activeTab === 'profil' ? 'active' : ''}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="pub-mobile-bottom-label">Profil</span>
      </Link>
    </nav>
  );
};
