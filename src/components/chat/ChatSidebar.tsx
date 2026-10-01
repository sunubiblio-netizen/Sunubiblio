'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChatUser, ChatGroup } from '@/types/chat';

interface ChatSidebarProps {
  onlineUsers: ChatUser[];
  offlineUsers: ChatUser[];
  groups: ChatGroup[];
  selectedUserId: string;
  onSelectUser: (user: ChatUser) => void;
  onSelectGroup?: (group: ChatGroup) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onlineUsers,
  offlineUsers,
  groups,
  selectedUserId,
  onSelectUser,
  onSelectGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'amis' | 'groupes'>('amis');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfflineOpen, setIsOfflineOpen] = useState(true);

  const filteredOnline = onlineUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOffline = offlineUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="chat-sidebar-root" aria-label="Liste des contacts et groupes">
      {/* 1. Onglets en haut : Amis vs Groupes */}
      <div className="chat-sidebar-nav-tabs">
        <button
          type="button"
          className={`chat-sidebar-tab-btn ${activeTab === 'amis' ? 'active' : ''}`}
          onClick={() => setActiveTab('amis')}
        >
          <span className="chat-tab-icon">👥</span>
          <span>Amis</span>
        </button>

        <button
          type="button"
          className={`chat-sidebar-tab-btn ${activeTab === 'groupes' ? 'active' : ''}`}
          onClick={() => setActiveTab('groupes')}
        >
          <span className="chat-tab-icon">👥</span>
          <span>Groupes</span>
          {groups.length > 0 && (
            <span className="chat-tab-badge">{groups.length}</span>
          )}
        </button>
      </div>

      {/* 2. Champ de recherche */}
      <div className="chat-sidebar-search-wrap">
        <svg className="chat-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder={activeTab === 'amis' ? 'Rechercher un ami...' : 'Rechercher un groupe...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chat-sidebar-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="chat-search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Contenu de la liste selon l'onglet actif */}
      <div className="chat-sidebar-scrollable-area">
        {activeTab === 'amis' ? (
          <>
            {/* Section En ligne */}
            <div className="chat-section-header">
              <span className="chat-section-status-dot online" />
              <span className="chat-section-title">En ligne ({filteredOnline.length})</span>
            </div>

            <div className="chat-contacts-list">
              {filteredOnline.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <button
                    key={user.id}
                    type="button"
                    className={`chat-contact-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="chat-contact-avatar-wrap">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={42}
                        height={42}
                        className="chat-contact-avatar-img"
                      />
                      <span className="chat-contact-status-badge online" />
                    </div>

                    <div className="chat-contact-info">
                      <div className="chat-contact-top-row">
                        <span className="chat-contact-name">{user.name}</span>
                        <span className="chat-contact-time">{user.time}</span>
                      </div>
                      <div className="chat-contact-msg-row">
                        <p className="chat-contact-last-msg">{user.lastMessage}</p>
                        {user.unreadCount && user.unreadCount > 0 ? (
                          <span className="chat-contact-unread-pill">{user.unreadCount}</span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Section Hors ligne (repliable) */}
            <div className="chat-offline-accordion">
              <button
                type="button"
                className="chat-section-header accordion-toggle"
                onClick={() => setIsOfflineOpen(!isOfflineOpen)}
              >
                <span className="chat-section-title">Hors ligne ({filteredOffline.length})</span>
                <svg
                  className={`chat-chevron-icon ${isOfflineOpen ? 'open' : ''}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isOfflineOpen && (
                <div className="chat-contacts-list">
                  {filteredOffline.map((user) => {
                    const isSelected = user.id === selectedUserId;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        className={`chat-contact-item is-offline ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => onSelectUser(user)}
                      >
                        <div className="chat-contact-avatar-wrap">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={42}
                            height={42}
                            className="chat-contact-avatar-img"
                          />
                        </div>

                        <div className="chat-contact-info">
                          <div className="chat-contact-top-row">
                            <span className="chat-contact-name">{user.name}</span>
                            <span className="chat-contact-time">{user.time}</span>
                          </div>
                          <p className="chat-contact-last-msg">{user.lastSeen || user.lastMessage}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Onglet Groupes */
          <div className="chat-groups-section">
            <div className="chat-section-header">
              <span className="chat-section-title">Groupes d'étude ({filteredGroups.length})</span>
            </div>

            <div className="chat-contacts-list">
              {filteredGroups.map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  className="chat-contact-item"
                  onClick={() => onSelectGroup?.(grp)}
                >
                  <div className="chat-contact-avatar-wrap">
                    <Image
                      src={grp.avatar}
                      alt={grp.name}
                      width={42}
                      height={42}
                      className="chat-contact-avatar-img group-img"
                    />
                  </div>

                  <div className="chat-contact-info">
                    <div className="chat-contact-top-row">
                      <span className="chat-contact-name">{grp.name}</span>
                      <span className="chat-contact-time">{grp.time}</span>
                    </div>
                    <div className="chat-contact-msg-row">
                      <p className="chat-contact-last-msg">{grp.lastMessage}</p>
                      {grp.unreadCount && (
                        <span className="chat-contact-unread-pill">{grp.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
