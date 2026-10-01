'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const PublicationsRightSidebar: React.FC = () => {
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({});
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({});
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});

  const toggleCommunity = (id: string) => {
    setJoinedCommunities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGroup = (id: string) => {
    setJoinedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFollow = (id: string) => {
    setFollowedUsers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const communities = [
    {
      id: 'comm-1',
      name: 'Prépa Bac S Sénégal',
      members: '12,4k membres',
      iconType: 'badge',
      badgeColor: '#fef3c7',
      iconChar: '📁',
    },
    {
      id: 'comm-2',
      name: 'Concours FASTEF',
      members: '45k membres',
      iconType: 'badge',
      badgeColor: '#f1f5f9',
      iconChar: '🏛️',
    },
    {
      id: 'comm-3',
      name: 'Étudiants UCAD',
      members: '9,0k membres',
      iconType: 'avatar',
      avatar: '/avatar_mamadou.jpg',
    },
  ];

  const groups = [
    {
      id: 'grp-1',
      name: 'Maths Sup Dakar',
      members: '450 membres',
      iconType: 'badge',
      badgeColor: '#fef3c7',
      iconChar: '🏛️',
    },
    {
      id: 'grp-2',
      name: 'Chimie Organique',
      members: '320 membres',
      iconType: 'avatar',
      avatar: '/avatar_ibrahima.jpg',
    },
  ];

  const suggestedUsers = [
    {
      id: 'user-1',
      name: 'Dr. Ibrahime Seck',
      role: 'Professeur',
      avatar: '/avatar_ibrahima.jpg',
    },
    {
      id: 'user-2',
      name: 'Awa Diop',
      role: 'Étudiante',
      avatar: '/avatar_fatou.jpg',
    },
    {
      id: 'user-3',
      name: 'Cheikh Ndiaye',
      role: 'Étudiant',
      avatar: '/avatar_mamadou.jpg',
    },
  ];

  return (
    <aside className="pub-right-sidebar" aria-label="Suggestions et recommandations">
      {/* 1. Communautés recommandées */}
      <section className="pub-sidebar-card">
        <h3 className="pub-sidebar-title">Communautés recommandées</h3>
        <div className="pub-suggested-list">
          {communities.map((comm) => {
            const isJoined = joinedCommunities[comm.id];
            return (
              <div key={comm.id} className="pub-suggested-item">
                {comm.iconType === 'avatar' && comm.avatar ? (
                  <div className="pub-suggested-avatar-wrap">
                    <Image
                      src={comm.avatar}
                      alt={comm.name}
                      width={36}
                      height={36}
                      className="pub-suggested-avatar-img"
                    />
                  </div>
                ) : (
                  <div
                    className="pub-suggested-badge-icon"
                    style={{ backgroundColor: comm.badgeColor }}
                  >
                    <span>{comm.iconChar}</span>
                  </div>
                )}

                <div className="pub-suggested-info">
                  <span className="pub-suggested-title">{comm.name}</span>
                  <span className="pub-suggested-sub">{comm.members}</span>
                </div>

                <button
                  type="button"
                  className={`pub-btn-action-pill ${isJoined ? 'joined' : ''}`}
                  onClick={() => toggleCommunity(comm.id)}
                >
                  {isJoined ? 'Inscrit' : 'Rejoindre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Groupes d'études */}
      <section className="pub-sidebar-card">
        <h3 className="pub-sidebar-title">Groupes d'études</h3>
        <div className="pub-suggested-list">
          {groups.map((grp) => {
            const isJoined = joinedGroups[grp.id];
            return (
              <div key={grp.id} className="pub-suggested-item">
                {grp.iconType === 'avatar' && grp.avatar ? (
                  <div className="pub-suggested-avatar-wrap">
                    <Image
                      src={grp.avatar}
                      alt={grp.name}
                      width={36}
                      height={36}
                      className="pub-suggested-avatar-img"
                    />
                  </div>
                ) : (
                  <div
                    className="pub-suggested-badge-icon"
                    style={{ backgroundColor: grp.badgeColor }}
                  >
                    <span>{grp.iconChar}</span>
                  </div>
                )}

                <div className="pub-suggested-info">
                  <span className="pub-suggested-title">{grp.name}</span>
                  <span className="pub-suggested-sub">{grp.members}</span>
                </div>

                <button
                  type="button"
                  className={`pub-btn-action-pill ${isJoined ? 'joined' : ''}`}
                  onClick={() => toggleGroup(grp.id)}
                >
                  {isJoined ? 'Inscrit' : 'Rejoindre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. À découvrir */}
      <section className="pub-sidebar-card">
        <h3 className="pub-sidebar-title">À découvrir</h3>
        <div className="pub-suggested-list">
          {suggestedUsers.map((u) => {
            const isFollowed = followedUsers[u.id];
            return (
              <div key={u.id} className="pub-suggested-item">
                <div className="pub-suggested-avatar-wrap">
                  <Image
                    src={u.avatar}
                    alt={u.name}
                    width={36}
                    height={36}
                    className="pub-suggested-avatar-img"
                  />
                </div>

                <div className="pub-suggested-info">
                  <span className="pub-suggested-title">{u.name}</span>
                  <span className="pub-suggested-sub">{u.role}</span>
                </div>

                <button
                  type="button"
                  className={`pub-btn-action-pill ${isFollowed ? 'joined' : ''}`}
                  onClick={() => toggleFollow(u.id)}
                >
                  {isFollowed ? 'Abonné' : 'Suivre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
};
