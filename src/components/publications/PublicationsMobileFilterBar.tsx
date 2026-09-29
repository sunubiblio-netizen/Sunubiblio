'use client';

import React from 'react';
import { PublicationFilterType } from './PublicationsLeftNav';

interface PublicationsMobileFilterBarProps {
  activeFilter: PublicationFilterType;
  onSelectFilter: (filter: PublicationFilterType) => void;
  savedCount?: number;
  mobileView?: 'feed' | 'recommendations';
  onChangeMobileView?: (view: 'feed' | 'recommendations') => void;
}

export const PublicationsMobileFilterBar: React.FC<PublicationsMobileFilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  savedCount = 0,
}) => {
  const filterChips: { id: PublicationFilterType; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'Fil principal', icon: '🌐' },
    { id: 'subscriptions', label: 'Abonnements', icon: '👥' },
    { id: 'saved', label: 'Enregistrés', icon: '🔖', count: savedCount },
    { id: 'my-posts', label: 'Mes publications', icon: '✍️' },
    { id: 'maths', label: 'Maths', icon: '📐' },
    { id: 'pc', label: 'Physique-Chimie', icon: '⚡' },
    { id: 'concours', label: 'Concours', icon: '🏛️' },
    { id: 'lettres', label: 'Lettres & Philo', icon: '📖' },
  ];

  return (
    <div className="pub-mobile-controls-wrapper">
      {/* Puces de filtres défilables simples et ergonomiques */}
      <div className="pub-mobile-filters-scroll" role="region" aria-label="Filtres thématiques">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              className={`pub-mobile-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(chip.id)}
            >
              <span className="pub-chip-icon" aria-hidden="true">{chip.icon}</span>
              <span className="pub-chip-label">{chip.label}</span>
              {chip.count !== undefined && chip.count > 0 && (
                <span className="pub-chip-badge">{chip.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
