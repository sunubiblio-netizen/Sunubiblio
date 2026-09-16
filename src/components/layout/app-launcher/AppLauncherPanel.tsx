'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  APP_LAUNCHER_CATEGORIES,
  APP_LAUNCHER_ITEMS,
  AppLauncherItemData,
} from '@/config/appLauncher.config';
import { AppLauncherCategory } from './AppLauncherCategory';

interface AppLauncherPanelProps {
  currentPathname: string;
  onClose: () => void;
}

export const AppLauncherPanel: React.FC<AppLauncherPanelProps> = ({
  currentPathname,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage intelligent en temps réel des applications
  const filteredCategoriesWithApps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return APP_LAUNCHER_CATEGORIES.map((cat) => {
      const categoryApps = APP_LAUNCHER_ITEMS.filter((item) => {
        if (item.category !== cat.key || !item.enabled) return false;
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q) ||
          (item.shortDescription && item.shortDescription.toLowerCase().includes(q))
        );
      }).sort((a, b) => a.order - b.order);

      return {
        category: cat,
        apps: categoryApps,
      };
    }).filter((group) => group.apps.length > 0);
  }, [searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategoriesWithApps.reduce((acc, group) => acc + group.apps.length, 0);
  }, [filteredCategoriesWithApps]);

  return (
    <div
      className="app-launcher-dropdown"
      role="dialog"
      aria-modal="true"
      aria-label="Centre d'applications Sunubiblio"
    >
      {/* 1. Header du Panneau */}
      <div className="launcher-header">
        <div className="launcher-title-row">
          <div className="launcher-title-tag">
            <span className="sparkle-dot" aria-hidden="true" />
            <span>Applications Sunubiblio</span>
            <span className="launcher-apps-count">29</span>
          </div>

          <button
            type="button"
            className="launcher-close-btn"
            onClick={onClose}
            aria-label="Fermer le centre d'applications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 2. Barre de Recherche Rapide */}
        <div className="launcher-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une application, un cours, SunuAI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="launcher-search-input"
            aria-label="Filtrer les applications"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Corps Scrollable avec les 7 Catégories */}
      <div className="launcher-body-scroll" tabIndex={0}>
        {totalFilteredCount === 0 ? (
          <div className="launcher-empty-state">
            <div className="empty-icon-pill">🔍</div>
            <p className="empty-title">Aucune application trouvée</p>
            <p className="empty-subtitle">
              Aucun résultat pour « <strong>{searchQuery}</strong> ». Essayez avec un autre mot-clé (ex: « cours », « ia », « doc »).
            </p>
            <button
              type="button"
              className="empty-reset-btn"
              onClick={() => setSearchQuery('')}
            >
              Afficher toutes les applications
            </button>
          </div>
        ) : (
          filteredCategoriesWithApps.map(({ category, apps }) => (
            <AppLauncherCategory
              key={category.key}
              category={category}
              apps={apps}
              currentPathname={currentPathname}
              onSelectApp={onClose}
            />
          ))
        )}
      </div>

      {/* 4. Pied de page épuré avec liens rapides */}
      <div className="launcher-footer">
        <Link href="/tarifs" className="footer-quick-link" onClick={onClose}>
          <span className="footer-link-highlight">⭐</span> Formules & Tarifs
        </Link>
        <span className="footer-dot" aria-hidden="true">•</span>
        <Link href="/contact" className="footer-quick-link" onClick={onClose}>
          Assistance
        </Link>
        <span className="footer-dot" aria-hidden="true">•</span>
        <Link href="/a-propos" className="footer-quick-link" onClick={onClose}>
          À propos
        </Link>
      </div>
    </div>
  );
};
