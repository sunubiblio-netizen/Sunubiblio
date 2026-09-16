'use client';

import React from 'react';
import Link from 'next/link';
import { AppLauncherItemData } from '@/config/appLauncher.config';
import { getAppLauncherIcon } from './AppLauncherIcons';

interface AppLauncherItemProps {
  app: AppLauncherItemData;
  isActive?: boolean;
  onSelectApp: () => void;
  variant?: 'grid' | 'service-row';
}

export const AppLauncherItem: React.FC<AppLauncherItemProps> = ({
  app,
  isActive = false,
  onSelectApp,
  variant = 'grid',
}) => {
  const IconComponent = getAppLauncherIcon(app.iconId);

  // Variante élégante en ligne compacte pour "MON COMPTE & SERVICES"
  if (variant === 'service-row') {
    return (
      <Link
        href={app.href}
        onClick={onSelectApp}
        className={`app-launcher-service-card ${isActive ? 'is-active-service' : ''}`}
        title={app.shortDescription || app.name}
        aria-label={`${app.name}${app.badge ? ` (${app.badge.text})` : ''} — ${app.shortDescription || ''}`}
      >
        <div className="service-icon-wrap">
          <IconComponent size={32} className="service-vector-icon" />
        </div>
        <div className="service-meta">
          <div className="service-title-row">
            <span className="service-label">{app.name}</span>
            {app.badge && (
              <span className={`service-micro-badge badge-${app.badge.variant}`}>
                {app.badge.text}
              </span>
            )}
          </div>
          {app.shortDescription && (
            <span className="service-desc">{app.shortDescription}</span>
          )}
        </div>
        <div className="service-chevron" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </Link>
    );
  }

  // Variante classique en tuile pour la grille des applications (3 cols desktop, 2 cols mobile)
  return (
    <Link
      href={app.href}
      onClick={onSelectApp}
      className={`app-launcher-tile ${isActive ? 'is-active-tile' : ''}`}
      title={app.shortDescription || app.name}
      aria-label={`${app.name}${app.badge ? ` (${app.badge.text})` : ''}`}
    >
      <div className="tile-icon-container">
        <IconComponent size={34} className="tile-vector-icon" />
        {app.badge && (
          <span className={`tile-micro-badge badge-${app.badge.variant}`}>
            {app.badge.text}
          </span>
        )}
      </div>
      <span className="tile-label">{app.name}</span>
    </Link>
  );
};
