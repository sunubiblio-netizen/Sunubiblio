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
  savedCount = 1,
}) => {
  return (
    <aside className="pub-left-sidebar" aria-label="Navigation des publications">
      {/* 1. Carte Menu Principal */}
      <div className="pub-sidebar-card">
        <ul className="pub-nav-list">
          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => onSelectFilter('all')}
            >
              <svg className="pub-nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="pub-nav-item-label">Accueil</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'subscriptions' ? 'active' : ''}`}
              onClick={() => onSelectFilter('subscriptions')}
            >
              <svg className="pub-nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span className="pub-nav-item-label">Mes abonnements</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'saved' ? 'active' : ''}`}
              onClick={() => onSelectFilter('saved')}
            >
              <svg className="pub-nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              <span className="pub-nav-item-label">Enregistrés</span>
              {savedCount > 0 && (
                <span className="pub-nav-badge-pill">{savedCount}</span>
              )}
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'my-posts' ? 'active' : ''}`}
              onClick={() => onSelectFilter('my-posts')}
            >
              <svg className="pub-nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span className="pub-nav-item-label">Mes publications</span>
            </button>
          </li>
        </ul>
      </div>

      {/* 2. Carte Thématiques */}
      <div className="pub-sidebar-card pub-topics-card">
        <h3 className="pub-sidebar-section-title">THÉMATIQUES</h3>
        <ul className="pub-nav-list">
          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'maths' ? 'active' : ''}`}
              onClick={() => onSelectFilter('maths')}
            >
              <span className="pub-nav-topic-icon" style={{ color: '#eab308' }}>📐</span>
              <span className="pub-nav-item-label">Mathématiques</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'pc' ? 'active' : ''}`}
              onClick={() => onSelectFilter('pc')}
            >
              <span className="pub-nav-topic-icon" style={{ color: '#f59e0b' }}>⚡</span>
              <span className="pub-nav-item-label">Physique-Chimie</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'concours' ? 'active' : ''}`}
              onClick={() => onSelectFilter('concours')}
            >
              <span className="pub-nav-topic-icon" style={{ color: '#6366f1' }}>🏛️</span>
              <span className="pub-nav-item-label">Concours (FASTEP, E...</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`pub-nav-item ${activeFilter === 'lettres' ? 'active' : ''}`}
              onClick={() => onSelectFilter('lettres')}
            >
              <span className="pub-nav-topic-icon" style={{ color: '#0ea5e9' }}>📖</span>
              <span className="pub-nav-item-label">Lettres & Philosophie</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
