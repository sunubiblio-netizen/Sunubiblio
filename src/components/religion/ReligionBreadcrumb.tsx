'use client';

import React from 'react';
import {
  ReligionTradition,
  ReligionBranch,
  ReligionThemeCategory,
} from '@/types/religion';

interface ReligionBreadcrumbProps {
  tradition: ReligionTradition | null;
  branch: ReligionBranch | null;
  themeCategory: ReligionThemeCategory | null;
  onNavigateRoot: () => void;
  onNavigateTradition: () => void;
  onNavigateBranch: () => void;
}

export const ReligionBreadcrumb: React.FC<ReligionBreadcrumbProps> = ({
  tradition,
  branch,
  themeCategory,
  onNavigateRoot,
  onNavigateTradition,
  onNavigateBranch,
}) => {
  return (
    <nav className="religion-breadcrumb-nav" aria-label="Fil d'Ariane Religion">
      <div className="container">
        <div className="religion-breadcrumb-container">
          {/* Bouton retour contextuel */}
          {(tradition || branch) && (
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={() => {
                if (themeCategory && branch) {
                  onNavigateBranch();
                } else if (branch) {
                  onNavigateTradition();
                } else if (tradition) {
                  onNavigateRoot();
                }
              }}
              title="Revenir au niveau précédent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
          )}

          <ol className="breadcrumb-list">
            {/* Niveau 1 : Religion */}
            <li className="breadcrumb-item">
              <button
                type="button"
                className={`breadcrumb-link ${!tradition ? 'is-active' : ''}`}
                onClick={onNavigateRoot}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>Religion</span>
              </button>
            </li>

            {/* Niveau 2 : Tradition */}
            {tradition && (
              <>
                <li className="breadcrumb-separator" aria-hidden="true">/</li>
                <li className="breadcrumb-item">
                  <button
                    type="button"
                    className={`breadcrumb-link ${!branch ? 'is-active' : ''}`}
                    onClick={onNavigateTradition}
                  >
                    <span>{tradition.title}</span>
                  </button>
                </li>
              </>
            )}

            {/* Niveau 3 : Courant / Branche */}
            {branch && (
              <>
                <li className="breadcrumb-separator" aria-hidden="true">/</li>
                <li className="breadcrumb-item">
                  <button
                    type="button"
                    className={`breadcrumb-link ${!themeCategory ? 'is-active' : ''}`}
                    onClick={onNavigateBranch}
                  >
                    <span>{branch.title}</span>
                  </button>
                </li>
              </>
            )}

            {/* Niveau 4 : Thème de ressource */}
            {themeCategory && (
              <>
                <li className="breadcrumb-separator" aria-hidden="true">/</li>
                <li className="breadcrumb-item">
                  <span className="breadcrumb-current" aria-current="page">
                    {themeCategory.label}
                  </span>
                </li>
              </>
            )}
          </ol>
        </div>
      </div>
    </nav>
  );
};
