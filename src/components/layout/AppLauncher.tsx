'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  APP_GROUPS,
  ECOSYSTEM_APPS,
  EcosystemApp,
} from '@/config/navigationApps';

export const AppLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const launcherRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fermer automatiquement le lanceur lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fermeture au clic extérieur et touche Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Empêcher le scroll d'arrière-plan sur mobile uniquement
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleLauncher = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setFilterQuery('');
    }
  };

  // Filtrage des applications si l'utilisateur saisit une recherche dans le lanceur
  const getFilteredApps = (groupKey: string) => {
    return ECOSYSTEM_APPS.filter((app) => {
      if (app.group !== groupKey || !app.enabled) return false;
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase().trim();
      return (
        app.label.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q)
      );
    });
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'graduation-cap':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      case 'trophy':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
        );
      case 'pen-tool':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        );
      case 'landmark':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </svg>
        );
      case 'bot':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'calendar':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'video':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        );
      case 'users':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'shopping-bag':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        );
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <div className="app-launcher-wrapper" ref={launcherRef}>
      {/* Bouton Grille 3x3 moderne type Google Apps */}
      <button
        type="button"
        className={`app-launcher-btn ${isOpen ? 'is-active' : ''}`}
        onClick={toggleLauncher}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Applications et services Sunubiblio"
        title="Ouvrir le lanceur d'applications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="app-grid-icon"
        >
          {/* Grille 3x3 de 9 points arrondis élégants */}
          <circle cx="4.5" cy="4.5" r="2" />
          <circle cx="12" cy="4.5" r="2" />
          <circle cx="19.5" cy="4.5" r="2" />
          <circle cx="4.5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19.5" cy="12" r="2" />
          <circle cx="4.5" cy="19.5" r="2" />
          <circle cx="12" cy="19.5" r="2" />
          <circle cx="19.5" cy="19.5" r="2" />
        </svg>
      </button>

      {/* Panneau Flottant (Desktop) & Bottom Sheet (Mobile) */}
      {isOpen && (
        <>
          {/* Backdrop mobile */}
          <div
            className="launcher-mobile-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="app-launcher-dropdown" role="dialog" aria-modal="true" aria-label="Lanceur d'applications">
            {/* Header du lanceur */}
            <div className="launcher-header">
              <div className="launcher-title-row">
                <div className="launcher-title-tag">
                  <span className="sparkle-dot" />
                  <span>Écosystème Sunubiblio</span>
                </div>
                <button
                  type="button"
                  className="launcher-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le lanceur"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Barre de filtre rapide */}
              <div className="launcher-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Trouver un service, cours, concours..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="launcher-search-input"
                  autoFocus
                />
                {filterQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setFilterQuery('')}
                    aria-label="Effacer le filtre"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Corps du lanceur avec les 3 groupes structurés */}
            <div className="launcher-body-scroll">
              {APP_GROUPS.map((group) => {
                const apps = getFilteredApps(group.id);
                if (apps.length === 0) return null;

                return (
                  <div key={group.id} className="launcher-group-section">
                    <div className="group-header-row">
                      <span className="group-title">{group.title}</span>
                      {group.badgeLabel && (
                        <span className="group-badge-label">{group.badgeLabel}</span>
                      )}
                    </div>

                    <div className="launcher-apps-grid">
                      {apps.map((app: EcosystemApp) => {
                        const isActive = pathname === app.href || pathname.startsWith(`${app.href}/`);

                        return (
                          <Link
                            key={app.id}
                            href={app.href}
                            className={`app-item-card ${isActive ? 'is-active-app' : ''}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <div className={`app-icon-badge icon-group-${app.group}`}>
                              {renderIcon(app.iconName)}
                            </div>

                            <div className="app-meta">
                              <div className="app-name-row">
                                <span className="app-label">{app.label}</span>
                                {app.badge && (
                                  <span className={`app-status-badge badge-${app.badge.variant}`}>
                                    {app.badge.text}
                                  </span>
                                )}
                              </div>
                              <span className="app-desc">{app.shortDescription}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pied du lanceur avec accès rapide aux tarifs et à propos */}
            <div className="launcher-footer">
              <Link href="/tarifs" className="footer-quick-link" onClick={() => setIsOpen(false)}>
                ⭐ Offres & Tarifs
              </Link>
              <span className="footer-dot">•</span>
              <Link href="/contact" className="footer-quick-link" onClick={() => setIsOpen(false)}>
                Assistance
              </Link>
              <span className="footer-dot">•</span>
              <Link href="/a-propos" className="footer-quick-link" onClick={() => setIsOpen(false)}>
                À propos
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
