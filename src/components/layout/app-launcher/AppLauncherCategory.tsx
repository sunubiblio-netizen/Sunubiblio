'use client';

import React from 'react';
import { AppCategoryData, AppLauncherItemData } from '@/config/appLauncher.config';
import { AppLauncherItem } from './AppLauncherItem';

interface AppLauncherCategoryProps {
  category: AppCategoryData;
  apps: AppLauncherItemData[];
  currentPathname: string;
  onSelectApp: () => void;
}

export const AppLauncherCategory: React.FC<AppLauncherCategoryProps> = ({
  category,
  apps,
  currentPathname,
  onSelectApp,
}) => {
  if (apps.length === 0) return null;

  const isServicesCategory = category.key === 'services';

  return (
    <section className={`app-launcher-category-section ${isServicesCategory ? 'section-services' : ''}`} aria-labelledby={`cat-title-${category.key}`}>
      <div className="category-header-wrap">
        <h3 id={`cat-title-${category.key}`} className="category-title">
          {category.title}
        </h3>
        {category.description && (
          <p className="category-desc">{category.description}</p>
        )}
      </div>

      {isServicesCategory ? (
        <div className="category-services-list" role="list">
          {apps.map((app) => (
            <div key={app.id} role="listitem">
              <AppLauncherItem
                app={app}
                isActive={false}
                onSelectApp={onSelectApp}
                variant="service-row"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="category-apps-grid" role="list">
          {apps.map((app) => (
            <div key={app.id} role="listitem">
              <AppLauncherItem
                app={app}
                isActive={false}
                onSelectApp={onSelectApp}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
