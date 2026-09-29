'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const PublicationsRightSidebar: React.FC = () => {
  // Gestion d'état local des actions Rejoindre / Suivre
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
    { id: 'comm-1', name: 'Prépa Bac S Sénégal', members: '12,4k membres', icon: '📐' },
    { id: 'comm-2', name: 'Concours FASTEF & ENA', members: '7,8k membres', icon: '🏛️' },
    { id: 'comm-3', name: 'Étudiants UCAD & UGB', members: '9,5k membres', icon: '🎓' },
  ];

  const groups = [
    { id: 'grp-1', name: 'Maths Sup Dakar', members: '450 membres', tag: 'Révision' },
    { id: 'grp-2', name: 'Chimie Organique P1', members: '320 membres', tag: 'Exercices' },
  ];

  const suggestedUsers = [
    {
      id: 'user-1',
      name: 'Dr. Ibrahima Seck',
      role: 'Chercheur en Histoire',
      avatar: '/avatar_ibrahima.jpg',
    },
    {
      id: 'user-2',
      name: 'Aïssatou Ndiaye',
      role: 'Major FASTEF Maths',
      avatar: '/avatar_aissatou.jpg',
    },
    {
      id: 'user-3',
      name: 'Cheikh Tidiane Sy',
      role: 'Formateur Concours',
      avatar: '/avatar_mamadou.jpg',
    },
  ];

  return (
    <aside className="pub-right-sidebar" aria-label="Suggestions et recommandations">
      {/* 1. Communautés recommandées */}
      <section className="pub-sidebar-block">
        <div className="pub-block-header">
          <h2 className="pub-sidebar-heading">Communautés recommandées</h2>
        </div>
        <div className="pub-suggested-list">
          {communities.map((comm) => {
            const isJoined = joinedCommunities[comm.id];
            return (
              <div key={comm.id} className="pub-suggested-item">
                <div className="pub-suggested-icon" aria-hidden="true">{comm.icon}</div>
                <div className="pub-suggested-info">
                  <h3 className="pub-suggested-title">{comm.name}</h3>
                  <span className="pub-suggested-sub">{comm.members}</span>
                </div>
                <button
                  type="button"
                  className={`pub-btn-action-small ${isJoined ? 'joined' : ''}`}
                  onClick={() => toggleCommunity(comm.id)}
                >
                  {isJoined ? 'Membre' : 'Rejoindre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Groupes recommandés */}
      <section className="pub-sidebar-block">
        <div className="pub-block-header">
          <h2 className="pub-sidebar-heading">Groupes d'études</h2>
        </div>
        <div className="pub-suggested-list">
          {groups.map((grp) => {
            const isJoined = joinedGroups[grp.id];
            return (
              <div key={grp.id} className="pub-suggested-item">
                <div className="pub-suggested-icon" aria-hidden="true">👥</div>
                <div className="pub-suggested-info">
                  <h3 className="pub-suggested-title">{grp.name}</h3>
                  <span className="pub-suggested-sub">{grp.members}</span>
                </div>
                <button
                  type="button"
                  className={`pub-btn-action-small ${isJoined ? 'joined' : ''}`}
                  onClick={() => toggleGroup(grp.id)}
                >
                  {isJoined ? 'Inscrit' : 'Rejoindre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Utilisateurs à découvrir */}
      <section className="pub-sidebar-block">
        <div className="pub-block-header">
          <h2 className="pub-sidebar-heading">À découvrir</h2>
        </div>
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
                    className="pub-suggested-avatar"
                  />
                </div>
                <div className="pub-suggested-info">
                  <h3 className="pub-suggested-title">{u.name}</h3>
                  <span className="pub-suggested-sub">{u.role}</span>
                </div>
                <button
                  type="button"
                  className={`pub-btn-action-small ${isFollowed ? 'joined' : ''}`}
                  onClick={() => toggleFollow(u.id)}
                >
                  {isFollowed ? 'Suivi' : 'Suivre'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
};
