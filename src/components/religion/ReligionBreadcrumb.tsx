'use client';

import React from 'react';
import Link from 'next/link';
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
            {/* Niveau 0 : Accueil */}
            <li className="breadcrumb-item">
              <Link href="/" className="breadcrumb-link">
                Accueil
              </Link>
            </li>

            <li className="breadcrumb-separator" aria-hidden="true">&gt;</li>

            {/* Niveau 1 : Religion */}
            <li className="breadcrumb-item">
              <button
                type="button"
                className={`breadcrumb-link ${!tradition ? 'is-active' : ''}`}
                onClick={onNavigateRoot}
              >
                Religion
              </button>
            </li>

            {/* Niveau 2 : Tradition */}
            {tradition && (
              <>
                <li className="breadcrumb-separator" aria-hidden="true">&gt;</li>
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
                <li className="breadcrumb-separator" aria-hidden="true">&gt;</li>
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

            {/* Niveau 4 : Sous-catégorie thématique */}
            {themeCategory && (
              <>
                <li className="breadcrumb-separator" aria-hidden="true">&gt;</li>
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

      <style jsx>{`
        .religion-breadcrumb-nav {
          padding: 8px 0;
          margin-bottom: 20px;
        }

        .religion-breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .breadcrumb-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #4f46e5;
          font-size: 12.5px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .breadcrumb-back-btn:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
          transform: translateX(-2px);
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
          font-size: 13px;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .breadcrumb-link.is-active {
          color: #059669;
          font-weight: 700;
        }

        .breadcrumb-separator {
          color: #cbd5e1;
          font-size: 11px;
          user-select: none;
        }

        .breadcrumb-current {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          background: #f0fdf4;
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        @media (max-width: 640px) {
          .religion-breadcrumb-container {
            gap: 8px;
          }

          .breadcrumb-list {
            font-size: 12px;
            gap: 4px;
          }

          .breadcrumb-link {
            font-size: 12px;
            padding: 3px 6px;
          }

          .breadcrumb-current {
            font-size: 12px;
          }
        }
      `}</style>
    </nav>
  );
};
