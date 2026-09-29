'use client';

import React from 'react';
import Link from 'next/link';
import { Community, StudyGroup, CommunityTab } from '@/types/community';

interface CommunityLeftSidebarProps {
  activeTab: CommunityTab;
  onSelectTab: (tab: CommunityTab) => void;
  communities: Community[];
  groups: StudyGroup[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCommunity?: (c: Community) => void;
  onSelectGroup?: (g: StudyGroup) => void;
}

export const CommunityLeftSidebar: React.FC<CommunityLeftSidebarProps> = ({
  activeTab,
  onSelectTab,
  communities,
  groups,
  searchQuery,
  onSearchChange,
  onSelectCommunity,
  onSelectGroup,
}) => {
  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace('.', ',')}K membres`;
    }
    return `${count} membres`;
  };

  return (
    <aside className="communaute-left-sidebar" aria-label="Menu latéral communauté">
      {/* 1. Recherche */}
      <div className="communaute-search-box">
        <svg
          className="communaute-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher dans la communauté..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 2. Menu de Navigation */}
      <nav className="communaute-nav-card" aria-label="Sections principales">
        <button
          type="button"
          className={`communaute-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => onSelectTab('feed')}
        >
          <span className="communaute-nav-icon">🏠</span>
          <span>Accueil</span>
        </button>

        <Link
          href="/groupes"
          className="communaute-nav-item"
        >
          <span className="communaute-nav-icon">👥</span>
          <span>Groupes d’études</span>
        </Link>

        <button
          type="button"
          className={`communaute-nav-item ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => onSelectTab('discussions')}
        >
          <span className="communaute-nav-icon">💬</span>
          <span>Discussions & Débats</span>
        </button>

        <button
          type="button"
          className={`communaute-nav-item ${activeTab === 'peers' ? 'active' : ''}`}
          onClick={() => onSelectTab('peers')}
        >
          <span className="communaute-nav-icon">👥</span>
          <span>Trouver des pairs</span>
        </button>
      </nav>

      {/* 3. Bloc Communautés */}
      <div className="communaute-sidebar-block">
        <div className="communaute-sidebar-block-header">
          <h2 className="communaute-sidebar-block-title">Communautés</h2>
          <button
            type="button"
            className="communaute-sidebar-see-all"
            onClick={() => onSelectTab('feed')}
          >
            Voir tout
          </button>
        </div>

        <div className="communaute-mini-list">
          {communities.slice(0, 5).map((comm) => (
            <div
              key={comm.id}
              className="communaute-mini-row"
              onClick={() => onSelectCommunity?.(comm)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCommunity?.(comm)}
            >
              <div className="communaute-mini-avatar">
                {comm.icon || '🌸'}
              </div>
              <div className="communaute-mini-info">
                <span className="communaute-mini-name">{comm.name}</span>
                <span className="communaute-mini-members">{formatMembers(comm.memberCount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bloc Mes Groupes */}
      <div className="communaute-sidebar-block">
        <div className="communaute-sidebar-block-header">
          <h2 className="communaute-sidebar-block-title">Mes groupes</h2>
          <button
            type="button"
            className="communaute-sidebar-see-all"
            onClick={() => onSelectTab('groups')}
          >
            Voir tout
          </button>
        </div>

        <div className="communaute-mini-list">
          {groups
            .filter((g) => g.isJoined)
            .slice(0, 4)
            .map((grp) => (
              <div
                key={grp.id}
                className="communaute-mini-row"
                onClick={() => onSelectGroup?.(grp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectGroup?.(grp)}
              >
                <div className="communaute-mini-avatar">
                  {grp.icon || '📚'}
                </div>
                <div className="communaute-mini-info">
                  <span className="communaute-mini-name">{grp.name}</span>
                  <span className="communaute-mini-members">{formatMembers(grp.memberCount)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
};
