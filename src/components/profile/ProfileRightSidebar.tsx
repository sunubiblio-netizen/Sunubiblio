'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProfileUser, ProfileSuggestion } from '@/types/profile';

interface ProfileRightSidebarProps {
  user: ProfileUser;
  suggestions: ProfileSuggestion[];
  onCreatePostClick?: () => void;
}

export const ProfileRightSidebar: React.FC<ProfileRightSidebarProps> = ({
  user,
  suggestions: initialSuggestions,
  onCreatePostClick,
}) => {
  const [suggestions, setSuggestions] = useState<ProfileSuggestion[]>(initialSuggestions);

  const handleToggleSuggestionFollow = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFollowing: !s.isFollowing } : s))
    );
  };

  return (
    <aside className="profile-right-sidebar" aria-label="Informations complémentaires et suggestions">
      {/* 1. Carte Membre Gold */}
      <div className="profile-widget-card widget-gold-member">
        <div className="widget-gold-header">
          <div className="widget-gold-crown-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
          <div className="widget-gold-texts">
            <h3 className="widget-gold-title">Membre Gold</h3>
            <p className="widget-gold-sub">
              Accès illimité aux concours, documents & IA
            </p>
          </div>
        </div>

        <Link href="/tarifs" className="btn-gold-advantages">
          Voir les avantages
        </Link>
      </div>

      {/* 2. Carte À propos rapide */}
      <div className="profile-widget-card">
        <h3 className="widget-card-title">À propos</h3>
        <ul className="widget-about-facts-list">
          <li className="widget-about-fact-item">
            <span className="fact-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <span className="fact-text">Professeur de Mathématiques</span>
          </li>

          <li className="widget-about-fact-item">
            <span className="fact-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="fact-text">{user.school}</span>
          </li>

          <li className="widget-about-fact-item">
            <span className="fact-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="fact-text">{user.city}, {user.country}</span>
          </li>

          <li className="widget-about-fact-item">
            <span className="fact-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span className="fact-text">Membre depuis {user.memberSince}</span>
          </li>
        </ul>
      </div>

      {/* 3. Carte Centres d'intérêt */}
      <div className="profile-widget-card">
        <h3 className="widget-card-title">Centres d’intérêt</h3>
        <div className="widget-interests-tags-wrap">
          {user.interests.map((interest, idx) => (
            <span key={idx} className="widget-interest-pill">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Carte Suggestions */}
      <div className="profile-widget-card">
        <div className="widget-header-with-action">
          <h3 className="widget-card-title">Suggestions</h3>
          <Link href="/communaute" className="widget-link-action">
            Voir tout
          </Link>
        </div>

        <div className="widget-suggestions-list">
          {suggestions.map((sug) => (
            <div key={sug.id} className="suggestion-user-row">
              <Image
                src={sug.avatarUrl}
                alt={sug.name}
                width={40}
                height={40}
                className="suggestion-avatar"
              />
              <div className="suggestion-texts">
                <strong className="suggestion-name">{sug.name}</strong>
                <span className="suggestion-role">{sug.role}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSuggestionFollow(sug.id)}
                className={`btn-suggestion-follow ${sug.isFollowing ? 'following' : ''}`}
              >
                {sug.isFollowing ? 'Suivi' : 'Suivre'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Carte CTA Partagez vos connaissances */}
      <div className="profile-widget-card widget-community-cta">
        <div className="widget-cta-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h4 className="widget-cta-title">Partagez vos connaissances avec la communauté !</h4>
        <p className="widget-cta-text">
          Publiez vos ressources, vos vidéos et aidez d’autres étudiants à réussir.
        </p>
        <button
          type="button"
          onClick={onCreatePostClick}
          className="btn-create-publication-cta"
        >
          Créer une publication
        </button>
      </div>
    </aside>
  );
};
