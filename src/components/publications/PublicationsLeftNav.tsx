'use client';

import React from 'react';

export type PublicationFilterType =
  | 'all'
  | 'subscriptions'
  | 'saved'
  | 'my-posts'
  | 'maths'
  | 'pc'
  | 'concours'
  | 'lettres';

interface PublicationsLeftNavProps {
  activeFilter: PublicationFilterType;
  onSelectFilter: (filter: PublicationFilterType) => void;
  savedCount?: number;
}

export const PublicationsLeftNav: React.FC<PublicationsLeftNavProps> = ({
  activeFilter,
  onSelectFilter,
  savedCount = 0,
}) => {
  const mainNavItems = [
    { id: 'all', label: 'Fil principal', icon: '🏠' },
    { id: 'subscriptions', label: 'Mes abonnements', icon: '👥' },
    { id: 'saved', label: 'Enregistrés', icon: '🔖', badge: savedCount > 0 ? savedCount : undefined },
    { id: 'my-posts', label: 'Mes publications', icon: '✍️' },
  ];

  const topicsItems = [
    { id: 'maths', label: 'Mathématiques', icon: '📐' },
    { id: 'pc', label: 'Physique-Chimie', icon: '⚡' },
    { id: 'concours', label: 'Concours (FASTEF, ENA)', icon: '🏛️' },
    { id: 'lettres', label: 'Lettres & Philosophie', icon: '📖' },
  ];

  return (
    <aside className="pub-left-sidebar" aria-label="Navigation des publications">
      {/* 1. Navigation Principale */}
      <nav className="pub-sidebar-block">
        <h2 className="pub-sidebar-heading">Découvrir</h2>
        <ul className="pub-nav-list">
          {mainNavItems.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`pub-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectFilter(item.id as PublicationFilterType)}
                >
                  <span className="pub-nav-item-icon" aria-hidden="true">{item.icon}</span>
                  <span className="pub-nav-item-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="pub-nav-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 2. Filtres par matières & concours */}
      <div className="pub-sidebar-block pub-topics-block">
        <h2 className="pub-sidebar-heading">Thématiques</h2>
        <ul className="pub-nav-list">
          {topicsItems.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`pub-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectFilter(item.id as PublicationFilterType)}
                >
                  <span className="pub-nav-item-icon" aria-hidden="true">{item.icon}</span>
                  <span className="pub-nav-item-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Carte d'information plateforme */}
      <div className="pub-info-mini-card">
        <div className="pub-info-mini-icon" aria-hidden="true">💡</div>
        <p className="pub-info-mini-text">
          Partagez vos résumés, fiches et questions pour progresser ensemble sur Sunubiblio.
        </p>
      </div>
    </aside>
  );
};
