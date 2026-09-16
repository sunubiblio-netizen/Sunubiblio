'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  APP_LAUNCHER_CATEGORIES,
  APP_LAUNCHER_ITEMS,
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
  // Regroupement optimisé des applications par catégorie
  const categoriesWithApps = useMemo(() => {
    return APP_LAUNCHER_CATEGORIES.map((cat) => {
      const categoryApps = APP_LAUNCHER_ITEMS.filter(
        (item) => item.category === cat.key && item.enabled
      ).sort((a, b) => a.order - b.order);

      return {
        category: cat,
        apps: categoryApps,
      };
    }).filter((group) => group.apps.length > 0);
  }, []);

  return (
    <div
      className="app-launcher-dropdown"
      role="dialog"
      aria-modal="true"
      aria-label="Centre d'applications Sunubiblio"
    >
      {/* 1. En-tête officiel du Panneau */}
      <div className="launcher-header">
        <div className="launcher-title-row">
          <div className="launcher-title-tag">
            <span className="sparkle-dot" aria-hidden="true" />
            <h2 className="launcher-main-heading">Applications Sunubiblio</h2>
          </div>

          <button
            type="button"
            className="launcher-close-btn"
            onClick={onClose}
            aria-label="Fermer le menu des applications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Corps Défilable avec les 7 Catégories structurées */}
      <div className="launcher-body-scroll" tabIndex={0}>
        {categoriesWithApps.map(({ category, apps }) => (
          <AppLauncherCategory
            key={category.key}
            category={category}
            apps={apps}
            currentPathname={currentPathname}
            onSelectApp={onClose}
          />
        ))}
      </div>

      {/* 3. Pied de page épuré avec accès secondaires */}
      <div className="launcher-footer">
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
