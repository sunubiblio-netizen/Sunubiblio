'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type MobileTab = 'feed' | 'explore' | 'create' | 'community' | 'profile';

interface PublicationsMobileBottomBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenCreate: () => void;
  userAvatar?: string;
}

export const PublicationsMobileBottomBar: React.FC<PublicationsMobileBottomBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreate,
  userAvatar = '/avatar_mamadou.jpg',
}) => {
  return (
    <nav className="insta-mobile-bottom-bar" aria-label="Navigation mobile principale">
      {/* 1. 🏠 Accueil / Fil */}
      <button
        type="button"
        className={`insta-bottom-btn ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onSelectTab('feed')}
        aria-label="Fil d'actualité"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'feed' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={activeTab === 'feed' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>

      {/* 2. 🔍 Explorer (Recherche & Thématiques) */}
      <button
        type="button"
        className={`insta-bottom-btn ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => onSelectTab('explore')}
        aria-label="Explorer les thématiques"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </button>

      {/* 3. ➕ Créer une publication (Bouton central carré arrondi) */}
      <button
        type="button"
        className="insta-bottom-btn insta-create-btn"
        onClick={onOpenCreate}
        aria-label="Créer une publication"
      >
        <div className="insta-create-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>

      {/* 4. 👥 Communauté & Groupes (ou Vidéos) */}
      <button
        type="button"
        className={`insta-bottom-btn ${activeTab === 'community' ? 'active' : ''}`}
        onClick={() => onSelectTab('community')}
        aria-label="Groupes et Communautés"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'community' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={activeTab === 'community' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </button>

      {/* 5. 👤 Profil Utilisateur */}
      <Link
        href="/profil"
        className={`insta-bottom-btn insta-profile-btn ${activeTab === 'profile' ? 'active' : ''}`}
        aria-label="Mon Profil"
      >
        <div className={`insta-bottom-avatar-wrap ${activeTab === 'profile' ? 'is-current' : ''}`}>
          <Image
            src={userAvatar}
            alt="Profil"
            width={24}
            height={24}
            className="insta-bottom-avatar"
          />
        </div>
      </Link>
    </nav>
  );
};
