'use client';

import React from 'react';
import { ReligionBranch, ReligionBranchId } from '@/types/religion';

interface IslamSenegalSectionProps {
  branches: ReligionBranch[];
  selectedBranchId: ReligionBranchId | null;
  onSelectBranch: (branchId: ReligionBranchId) => void;
}

export const IslamSenegalSection: React.FC<IslamSenegalSectionProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  const islamBranches = branches.filter((b) => b.traditionId === 'islam');

  return (
    <section className="islam-senegal-section" id="islam-senegal">
      <div className="container">
        <div className="islam-senegal-header">
          <div className="senegal-priority-badge">
            <span className="senegal-flag">🇸🇳</span>
            <span>Patrimoine Spirituel National</span>
          </div>
          <h2 className="islam-senegal-title">Islam au Sénégal</h2>
          <p className="islam-senegal-subtitle">
            Explorez l'héritage vivant et les écrits majeurs des grandes confréries et figures spirituelles du Sénégal.
          </p>
        </div>

        <div className="islam-branches-grid">
          {islamBranches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                className={`islam-branch-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectBranch(branch.id)}
                style={{
                  '--branch-accent': branch.accentColor,
                  '--branch-bg': branch.bgLight,
                } as React.CSSProperties}
              >
                <div className="branch-card-top-row">
                  <div className="branch-icon-indicator" style={{ backgroundColor: branch.bgLight, color: branch.accentColor }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </div>
                  {branch.badge && (
                    <span
                      className="branch-badge-pill"
                      style={{
                        backgroundColor: branch.bgLight,
                        color: branch.accentColor,
                        borderColor: branch.borderColor,
                      }}
                    >
                      {branch.badge}
                    </span>
                  )}
                </div>

                <h3 className="islam-branch-name">{branch.title}</h3>
                {branch.location && (
                  <span className="islam-branch-location">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{branch.location}</span>
                  </span>
                )}
                <p className="islam-branch-desc">{branch.description}</p>

                <div className="islam-branch-bottom">
                  <span className="islam-branch-count">
                    {branch.resourceCount} œuvre{branch.resourceCount > 1 ? 's' : ''} disponible{branch.resourceCount > 1 ? 's' : ''}
                  </span>
                  <span className="islam-branch-action" style={{ color: branch.accentColor }}>
                    {isSelected ? 'Sélectionné ✓' : 'Accéder au courant →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
