'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProfileUser } from '@/types/profile';

interface ProfileHeaderCardProps {
  user: ProfileUser;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onEditCover?: () => void;
  onEditProfile?: () => void;
  hasActiveStory?: boolean;
  activeStoriesCount?: number;
  onViewStories?: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  user,
  onOpenAuth,
  onEditCover,
  onEditProfile,
  hasActiveStory,
  activeStoriesCount,
  onViewStories,
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowersCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setMenuOpen(false);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + 'K';
    }
    return num.toString();
  };

  return (
    <div className="profile-header-card-container">
      {/* 1. Grande Couverture */}
      <div className="profile-cover-wrap">
        <Image
          src={user.coverUrl}
          alt={`Couverture de ${user.displayName}`}
          fill
          priority
          className="profile-cover-img"
          sizes="(max-width: 768px) 100vw, 850px"
        />
        <div className="profile-cover-gradient-overlay" />
        
        {/* Bouton Modifier la couverture */}
        <button
          type="button"
          onClick={onEditCover || onEditProfile}
          className="profile-edit-cover-btn"
          title="Modifier la couverture"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span>Modifier la couverture</span>
        </button>
      </div>

      {/* 2. Contenu Identité & Actions */}
      <div className="profile-header-body">
        <div className="profile-top-row">
          {/* Avatar rond chevauchant avec pastille de vérification et anneau de story */}
          <div
            className={`profile-avatar-wrapper ${hasActiveStory ? 'has-active-story' : ''}`}
            onClick={hasActiveStory && onViewStories ? onViewStories : undefined}
            role={hasActiveStory ? 'button' : undefined}
            tabIndex={hasActiveStory ? 0 : undefined}
            title={hasActiveStory ? `Regarder la story (${activeStoriesCount || 1}) • Expire dans 24h` : undefined}
            style={hasActiveStory ? { cursor: 'pointer' } : undefined}
          >
            {hasActiveStory && <div className="profile-avatar-story-glow-ring" />}
            <div className="profile-avatar-inner">
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                width={128}
                height={128}
                priority
                className="profile-avatar-img"
              />
              {user.isVerified && (
                <div className="profile-avatar-verified-badge" title="Profil vérifié">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              )}
            </div>

            {hasActiveStory && (
              <div className="profile-avatar-story-chip-pill">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                <span>Story</span>
              </div>
            )}
          </div>

          {/* Statistiques (Publications, Abonnés, Abonnements) */}
          <div className="profile-stats-cluster">
            <div className="profile-stat-box">
              <span className="profile-stat-number">{user.publicationsCount}</span>
              <span className="profile-stat-label">Publications</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-number">{formatCount(followersCount)}</span>
              <span className="profile-stat-label">Abonnés</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-number">{formatCount(user.followingCount)}</span>
              <span className="profile-stat-label">Abonnements</span>
            </div>
          </div>
        </div>

        {/* Ligne Identité + Boutons d'Action */}
        <div className="profile-identity-and-actions">
          <div className="profile-identity-info">
            <div className="profile-name-line">
              <h1 className="profile-display-name">{user.displayName}</h1>
              {user.isVerified && (
                <span className="profile-inline-verified-icon" title="Enseignant certifié Sunubiblio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#6366f1">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </span>
              )}
            </div>

            <span className="profile-username-tag">{user.username}</span>

            {/* Badge Professionnel */}
            {user.badgeLabel && (
              <div className="profile-professional-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>{user.badgeLabel}</span>
              </div>
            )}
          </div>

          {/* Boutons d'Action : Suivi(e) / Message / Plus */}
          <div className="profile-actions-toolbar">
            <button
              type="button"
              onClick={handleToggleFollow}
              className={`profile-action-btn-follow ${isFollowing ? 'following' : ''}`}
            >
              {isFollowing ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Suivi(e)</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Suivre</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth ? onOpenAuth('login') : alert('Messagerie privée disponible pour les membres.')}
              className="profile-action-btn-message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Message</span>
            </button>

            {/* Menu More (...) */}
            <div className="profile-more-menu-container">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="profile-action-btn-more"
                aria-label="Plus d'options de profil"
                aria-expanded={menuOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <div className="profile-more-dropdown-menu">
                  <button type="button" onClick={handleShare} className="profile-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>Partager le profil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); if (onEditProfile) onEditProfile(); }}
                    className="profile-dropdown-item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Modifier le profil</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="profile-bio-text">{user.bio}</p>

        {/* Métadonnées (Ville, Matière, Niveau, Rôle) */}
        <div className="profile-metadata-pills-row">
          <span className="profile-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{user.city}, {user.country}</span>
          </span>

          <span className="profile-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            </svg>
            <span>{user.subject}</span>
          </span>

          <span className="profile-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 7 10-5 10 5-10 5z" />
              <path d="M12 22V12" />
            </svg>
            <span>{user.level}</span>
          </span>

          <span className="profile-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            <span>{user.role}</span>
          </span>
        </div>

        {/* Notification Copié */}
        {copiedNotification && (
          <div className="profile-toast-notification">
            Lien du profil copié dans le presse-papier !
          </div>
        )}
      </div>
    </div>
  );
};
