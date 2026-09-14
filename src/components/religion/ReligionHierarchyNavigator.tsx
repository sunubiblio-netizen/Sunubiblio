'use client';

import React from 'react';
import {
  ReligionTradition,
  ReligionBranch,
  ReligionThemeCategory,
  ReligionResource,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionThemeCategoryId,
} from '@/types/religion';
import { ReligionResourceCard } from './ReligionResourceCard';
import { ReligionEmptyState } from './ReligionEmptyState';

interface ReligionHierarchyNavigatorProps {
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  themeCategories: ReligionThemeCategory[];
  resources: ReligionResource[];
  selectedTraditionId: ReligionTraditionId | null;
  selectedBranchId: ReligionBranchId | null;
  selectedThemeCategoryId: ReligionThemeCategoryId | 'all';
  onSelectTradition: (traditionId: ReligionTraditionId) => void;
  onSelectBranch: (branchId: ReligionBranchId) => void;
  onSelectThemeCategory: (themeId: ReligionThemeCategoryId | 'all') => void;
  onConsultResource: (resource: ReligionResource) => void;
  onResetNavigation: () => void;
  isLoading: boolean;
}

export const ReligionHierarchyNavigator: React.FC<ReligionHierarchyNavigatorProps> = ({
  traditions,
  branches,
  themeCategories,
  resources,
  selectedTraditionId,
  selectedBranchId,
  selectedThemeCategoryId,
  onSelectTradition,
  onSelectBranch,
  onSelectThemeCategory,
  onConsultResource,
  onResetNavigation,
  isLoading,
}) => {
  // Entités sélectionnées
  const currentTradition = traditions.find((t) => t.id === selectedTraditionId) || null;
  const currentBranch = branches.find((b) => b.id === selectedBranchId) || null;
  const currentTheme =
    selectedThemeCategoryId !== 'all'
      ? themeCategories.find((th) => th.id === selectedThemeCategoryId) || null
      : null;

  // Branches filtrées pour la tradition courante
  const availableBranches = selectedTraditionId
    ? branches.filter((b) => b.traditionId === selectedTraditionId)
    : [];

  // Helper pour les icônes de tradition
  const renderTraditionIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'crescent':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        );
      case 'cross':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="6" y1="8" x2="18" y2="8" />
          </svg>
        );
      case 'compass':
      default:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
    }
  };

  return (
    <section className="religion-hierarchy-section" id="hierarchie-religion">
      <div className="container">
        {/* =========================================================================
            NIVEAU 1 : CHOIX DE LA TRADITION (Si aucune tradition n'est sélectionnée)
           ========================================================================= */}
        {!selectedTraditionId && (
          <div className="hierarchy-step-container">
            <div className="religion-section-header">
              <div className="section-pill-tag">Étape 1 sur 3 — Grande Tradition</div>
              <h2 className="religion-section-title">Choisissez une tradition spirituelle</h2>
              <p className="religion-section-subtitle">
                Accédez aux enseignements, écrits fondamentaux et patrimoines classés par courant et confrérie.
              </p>
            </div>

            <div className="traditions-selection-grid">
              {traditions.map((trad) => (
                <button
                  key={trad.id}
                  type="button"
                  className="tradition-selection-card"
                  onClick={() => onSelectTradition(trad.id)}
                  style={{ '--trad-accent': trad.accentColor } as React.CSSProperties}
                >
                  <div className="tradition-card-top">
                    <div
                      className="tradition-icon-box"
                      style={{ backgroundColor: trad.bgLight, color: trad.accentColor }}
                    >
                      {renderTraditionIcon(trad.iconName, trad.accentColor)}
                    </div>
                    <span
                      className="tradition-badge-pill"
                      style={{
                        backgroundColor: trad.bgLight,
                        color: trad.accentColor,
                        borderColor: trad.borderColor,
                      }}
                    >
                      {trad.badge}
                    </span>
                  </div>

                  <h3 className="tradition-card-title">{trad.title}</h3>
                  <p className="tradition-card-subtitle">{trad.subtitle}</p>
                  <p className="tradition-card-desc">{trad.description}</p>

                  <div className="tradition-card-footer">
                    <span className="tradition-count-info">
                      {trad.branchesCount} courant{trad.branchesCount > 1 ? 's' : ''} &bull; {trad.resourceCount} œuvres
                    </span>
                    <span className="tradition-cta-link" style={{ color: trad.accentColor }}>
                      Explorer cette tradition &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            NIVEAU 2 : CHOIX DU COURANT / BRANCHE (Tradition choisie, sans branche)
           ========================================================================= */}
        {selectedTraditionId && !selectedBranchId && currentTradition && (
          <div className="hierarchy-step-container">
            <div className="step-back-banner">
              <button
                type="button"
                className="step-back-btn"
                onClick={onResetNavigation}
              >
                &larr; Revenir au choix des traditions
              </button>
              <div className="current-tradition-tag" style={{ color: currentTradition.accentColor }}>
                Tradition : <strong>{currentTradition.title}</strong>
              </div>
            </div>

            <div className="religion-section-header">
              <div className="section-pill-tag">Étape 2 sur 3 — Courant &amp; Confrérie</div>
              <h2 className="religion-section-title">
                {currentTradition.id === 'islam'
                  ? 'Grandes Confréries & Courants de l’Islam'
                  : `Courants & Domaines : ${currentTradition.title}`}
              </h2>
              <p className="religion-section-subtitle">
                Sélectionnez un sous-domaine pour explorer ses livres, enseignements, figures et textes de référence.
              </p>
            </div>

            <div className="branches-selection-grid">
              {availableBranches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  className="branch-selection-card"
                  onClick={() => onSelectBranch(branch.id)}
                  style={{ '--branch-accent': branch.accentColor } as React.CSSProperties}
                >
                  <div className="branch-card-header">
                    <div>
                      <h3 className="branch-card-title">{branch.title}</h3>
                      {branch.location && (
                        <span className="branch-card-location">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{branch.location}</span>
                        </span>
                      )}
                    </div>
                    {branch.badge && (
                      <span
                        className="branch-card-badge"
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

                  <p className="branch-card-subtitle">{branch.subtitle}</p>
                  <p className="branch-card-desc">{branch.description}</p>

                  <div className="branch-card-footer">
                    <span className="branch-res-count">
                      {branch.resourceCount} ressource{branch.resourceCount > 1 ? 's' : ''} disponible{branch.resourceCount > 1 ? 's' : ''}
                    </span>
                    <span className="branch-cta-arrow" style={{ color: branch.accentColor }}>
                      Voir les catégories &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            NIVEAU 3 & 4 : COURANT CHOISI -> ONGLETS THÉMATIQUES & GRILLE DES RESSOURCES
           ========================================================================= */}
        {selectedTraditionId && selectedBranchId && currentBranch && (
          <div className="hierarchy-step-container">
            {/* Header du courant sélectionné */}
            <div className="branch-active-banner">
              <div className="branch-active-left">
                <button
                  type="button"
                  className="branch-back-btn"
                  onClick={() => onSelectBranch(null as any)}
                  title="Changer de courant"
                >
                  &larr; Autres courants ({currentTradition?.title})
                </button>
                <div className="branch-title-wrap">
                  <h2 className="branch-active-title">{currentBranch.title}</h2>
                  {currentBranch.location && (
                    <span className="branch-active-location">({currentBranch.location})</span>
                  )}
                </div>
              </div>

              <div className="branch-active-badge-pill" style={{ color: currentBranch.accentColor, backgroundColor: currentBranch.bgLight }}>
                {currentBranch.badge || 'Tradition'}
              </div>
            </div>

            <p className="branch-active-description">{currentBranch.description}</p>

            {/* Barre des 8 Catégories Thématiques Universelles */}
            <div className="theme-categories-bar-wrap">
              <div className="theme-categories-scroll">
                <button
                  type="button"
                  className={`theme-tab-btn ${selectedThemeCategoryId === 'all' ? 'active' : ''}`}
                  onClick={() => onSelectThemeCategory('all')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>Toutes les catégories</span>
                </button>

                {themeCategories.map((theme) => {
                  const isActive = selectedThemeCategoryId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      className={`theme-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => onSelectThemeCategory(theme.id)}
                      title={theme.description}
                    >
                      <span>{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* En-tête de la liste des ressources filtrées */}
            <div className="branch-resources-header">
              <div>
                <h3 className="resources-list-heading">
                  {currentTheme ? currentTheme.label : 'Toutes les ressources'} — {currentBranch.title}
                </h3>
                <p className="resources-list-sub">
                  {currentTheme
                    ? currentTheme.description
                    : 'Consultez les traités, textes, enseignements et ouvrages authentiques répertoriés.'}
                </p>
              </div>

              <div className="resources-count-badge">
                <span className="count-num">{resources.length}</span>
                <span className="count-txt">ressource{resources.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Grille de ressources ou État vide */}
            {isLoading ? (
              <div className="religion-loading-state">
                <div className="loading-spinner" />
                <p>Chargement des ressources en cours...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="religion-cards-grid">
                {resources.map((res) => (
                  <ReligionResourceCard
                    key={res.id}
                    resource={res}
                    onConsult={onConsultResource}
                  />
                ))}
              </div>
            ) : (
              <ReligionEmptyState
                message="Aucune ressource disponible pour le moment."
                onReset={() => onSelectThemeCategory('all')}
                hasFilter={selectedThemeCategoryId !== 'all'}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
