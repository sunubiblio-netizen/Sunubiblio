'use client';

import React from 'react';
import Link from 'next/link';
import { Community, StudyGroup, PeerUser } from '@/types/community';

interface CommunityRightSidebarProps {
  communities: Community[];
  groups: StudyGroup[];
  peers: PeerUser[];
  onToggleJoinCommunity: (id: string) => void;
  onToggleJoinGroup: (id: string) => void;
  onToggleFollowPeer: (id: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectTab: (tab: 'feed' | 'groups' | 'discussions' | 'peers') => void;
}

export const CommunityRightSidebar: React.FC<CommunityRightSidebarProps> = ({
  communities,
  groups,
  peers,
  onToggleJoinCommunity,
  onToggleJoinGroup,
  onToggleFollowPeer,
  onOpenAuth,
  onSelectTab,
}) => {
  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace('.', ',')}K membres`;
    }
    return `${count} membres`;
  };

  return (
    <aside className="communaute-right-sidebar" aria-label="Recommandations et découverte">
      {/* 1. Communautés recommandées */}
      <div className="communaute-widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Communautés recommandées</h2>
          <button
            type="button"
            className="widget-see-all-link"
            onClick={() => onSelectTab('feed')}
          >
            Voir tout
          </button>
        </div>

        <div className="widget-items-list">
          {communities
            .filter((c) => !c.isOfficial)
            .slice(0, 4)
            .map((comm) => (
              <div key={comm.id} className="widget-item-row">
                <div className="widget-item-left">
                  <div className="widget-item-icon">{comm.icon || '👥'}</div>
                  <div className="widget-item-texts">
                    <span className="widget-item-name">{comm.name}</span>
                    <span className="widget-item-sub">{formatMembers(comm.memberCount)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn-widget-action ${comm.isJoined ? 'joined' : ''}`}
                  onClick={() => onToggleJoinCommunity(comm.id)}
                >
                  {comm.isJoined ? 'Membre' : 'Rejoindre'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* 2. Groupes populaires */}
      <div className="communaute-widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Groupes populaires</h2>
          <Link
            href="/groupes"
            className="widget-see-all-link"
          >
            Voir tout
          </Link>
        </div>

        <div className="widget-items-list">
          {groups.slice(0, 4).map((grp) => (
            <div key={grp.id} className="widget-item-row">
              <div className="widget-item-left">
                <div className="widget-item-icon">{grp.icon || '📚'}</div>
                <div className="widget-item-texts">
                  <span className="widget-item-name">{grp.name}</span>
                  <span className="widget-item-sub">{formatMembers(grp.memberCount)}</span>
                </div>
              </div>

              <button
                type="button"
                className={`btn-widget-action ${grp.isJoined ? 'joined' : ''}`}
                onClick={() => onToggleJoinGroup(grp.id)}
              >
                {grp.isJoined ? 'Membre' : 'Rejoindre'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Membres à découvrir */}
      <div className="communaute-widget-card">
        <div className="widget-card-header">
          <h2 className="widget-card-title">Membres à découvrir</h2>
          <button
            type="button"
            className="widget-see-all-link"
            onClick={() => onSelectTab('peers')}
          >
            Voir tout
          </button>
        </div>

        <div className="widget-items-list">
          {peers.slice(0, 3).map((peer) => (
            <div key={peer.id} className="widget-item-row">
              <div className="widget-item-left">
                <img
                  src={peer.avatarUrl}
                  alt={peer.displayName}
                  className="widget-item-avatar"
                />
                <div className="widget-item-texts">
                  <span className="widget-item-name">{peer.displayName}</span>
                  <span className="widget-item-sub">{peer.role}</span>
                </div>
              </div>

              <button
                type="button"
                className={`btn-widget-action ${peer.isFollowing ? 'following' : ''}`}
                onClick={() => onToggleFollowPeer(peer.id)}
              >
                {peer.isFollowing ? 'Abonné' : 'Suivre'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bannière CTA Communauté */}
      <div className="communaute-cta-banner-card">
        <div className="cta-banner-icon-circle" aria-hidden="true">
          👥
        </div>
        <h3 className="cta-banner-title">Rejoignez notre communauté</h3>
        <p className="cta-banner-desc">
          Échangez avec des milliers d’étudiants et d’enseignants du Sénégal.
        </p>
        <button
          type="button"
          className="btn-cta-banner-join"
          onClick={() => onOpenAuth('register')}
        >
          Rejoindre maintenant
        </button>
      </div>
    </aside>
  );
};
