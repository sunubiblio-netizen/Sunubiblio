'use client';

import React from 'react';
import Link from 'next/link';
import { AppLauncherItemData } from '@/config/appLauncher.config';
import { getAppLauncherIcon } from './AppLauncherIcons';

interface AppLauncherItemProps {
  app: AppLauncherItemData;
  isActive?: boolean;
  onSelectApp: () => void;
}

export const AppLauncherItem: React.FC<AppLauncherItemProps> = ({
  app,
  isActive = false,
  onSelectApp,
}) => {
  const IconComponent = getAppLauncherIcon(app.iconId);

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
