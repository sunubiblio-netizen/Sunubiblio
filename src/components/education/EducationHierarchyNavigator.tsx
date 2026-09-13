'use client';

import React, { useState, useMemo } from 'react';
import {
  EducationCycleId,
  EducationDomain,
  EducationFiliere,
  EducationHierarchySubject,
  EducationResource,
  EducationResourceType,
} from '@/types/education';
import {
  EDUCATION_DOMAINS,
  EDUCATION_FILIERES,
  EDUCATION_HIERARCHY_SUBJECTS,
  EDUCATION_LEVELS,
  INITIAL_EDUCATION_RESOURCES,
} from '@/data/educationData';

interface EducationHierarchyNavigatorProps {
  initialCycle?: EducationCycleId;
  onSelectResource?: (resource: EducationResource) => void;
  onFilterSync?: (cycleId: EducationCycleId, domainId?: string, filiereId?: string, subjectId?: string) => void;
}

export const EducationHierarchyNavigator: React.FC<EducationHierarchyNavigatorProps> = ({
  initialCycle = 'universite',
  onSelectResource,
  onFilterSync,
}) => {
  // Navigation State
  const [activeCycle, setActiveCycle] = useState<EducationCycleId>(initialCycle);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedFiliereId, setSelectedFiliereId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<EducationResourceType | 'all'>('all');

  // Resolved entities
  const activeCycleData = useMemo(() => {
    return EDUCATION_LEVELS.find((l) => l.id === activeCycle) || EDUCATION_LEVELS[4]; // Default Université
  }, [activeCycle]);

  const availableDomains = useMemo(() => {
    return EDUCATION_DOMAINS.filter((d) => d.cycleId === activeCycle);
  }, [activeCycle]);

  const selectedDomain = useMemo(() => {
    if (!selectedDomainId) return null;
    return EDUCATION_DOMAINS.find((d) => d.id === selectedDomainId) || null;
  }, [selectedDomainId]);

  const availableFilieres = useMemo(() => {
    if (!selectedDomainId) return [];
    return EDUCATION_FILIERES.filter((f) => f.domainId === selectedDomainId);
  }, [selectedDomainId]);

  const selectedFiliere = useMemo(() => {
    if (!selectedFiliereId) return null;
    return EDUCATION_FILIERES.find((f) => f.id === selectedFiliereId) || null;
  }, [selectedFiliereId]);

  const availableSubjects = useMemo(() => {
    if (!selectedFiliereId) return [];
    return EDUCATION_HIERARCHY_SUBJECTS.filter((s) => s.filiereId === selectedFiliereId);
  }, [selectedFiliereId]);

  const selectedSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return EDUCATION_HIERARCHY_SUBJECTS.find((s) => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  // Filtered resources for Step 4
  const hierarchyResources = useMemo(() => {
    return INITIAL_EDUCATION_RESOURCES.filter((res) => {
      if (res.level !== activeCycle) return false;
      if (selectedDomainId && res.domainId !== selectedDomainId) return false;
      if (selectedFiliereId && res.filiereId !== selectedFiliereId) return false;
      if (selectedSubjectId && res.subjectId !== selectedSubjectId) return false;
      if (selectedResourceType !== 'all' && res.type !== selectedResourceType) return false;
      return true;
    });
  }, [activeCycle, selectedDomainId, selectedFiliereId, selectedSubjectId, selectedResourceType]);

  // Handlers for step selection
  const handleCycleChange = (newCycle: EducationCycleId) => {
    setActiveCycle(newCycle);
    setSelectedDomainId(null);
    setSelectedFiliereId(null);
    setSelectedSubjectId(null);
    setSelectedResourceType('all');
    if (onFilterSync) onFilterSync(newCycle);
  };

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomainId(domainId);
    setSelectedFiliereId(null);
    setSelectedSubjectId(null);
    setSelectedResourceType('all');
    if (onFilterSync) onFilterSync(activeCycle, domainId);
  };

  const handleFiliereSelect = (filiereId: string) => {
    setSelectedFiliereId(filiereId);
    setSelectedSubjectId(null);
    setSelectedResourceType('all');
    if (onFilterSync) onFilterSync(activeCycle, selectedDomainId || undefined, filiereId);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedResourceType('all');
    if (onFilterSync) onFilterSync(activeCycle, selectedDomainId || undefined, selectedFiliereId || undefined, subjectId);
  };

  const handleResetBreadcrumb = () => {
    setSelectedDomainId(null);
    setSelectedFiliereId(null);
    setSelectedSubjectId(null);
    setSelectedResourceType('all');
    if (onFilterSync) onFilterSync(activeCycle);
  };

  // Determine current step (1: Domain, 2: Filiere, 3: Subject, 4: Resources)
  const currentStep = useMemo(() => {
    if (selectedSubjectId) return 4;
    if (selectedFiliereId) return 3;
    if (selectedDomainId) return 2;
    return 1;
  }, [selectedDomainId, selectedFiliereId, selectedSubjectId]);

  return (
    <section className="hierarchy-navigator-section" id="parcours-universite">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <div className="badge-pill section-badge">
            <span className="badge-dot" />
            <span>Navigation Hiérarchique Structurée</span>
          </div>
          <h2 className="section-title">
            Parcours officiel du Savoir :{' '}
            <span className="gradient-hero-text">Niveau → Domaine → Filière → Matière</span>
          </h2>
          <p className="section-subtitle">
            Explorez les 9 grands domaines universitaires sénégalais ou les cycles scolaires pas-à-pas
            pour accéder directement aux cours, exercices, annales et livres recommandés.
          </p>
        </div>

        {/* Cycle Switcher Tabs */}
        <div className="cycle-tabs-container" role="tablist" aria-label="Cycles d'études">
          {EDUCATION_LEVELS.map((level) => {
            const isActive = level.id === activeCycle;
            return (
              <button
                key={level.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`cycle-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleCycleChange(level.id)}
              >
                <span className="tab-icon-dot" style={{ backgroundColor: level.iconColor }} />
                <span className="tab-title">{level.title}</span>
                {level.id === 'universite' && <span className="tab-badge-gold">9 Domaines</span>}
              </button>
            );
          })}
        </div>

        {/* Interactive Breadcrumb Bar (Fil d'Ariane) */}
        <nav className="hierarchy-breadcrumb-bar" aria-label="Fil d'Ariane hiérarchique">
          <div className="breadcrumb-items-wrapper">
            {/* Step 0: Cycle */}
            <button
              type="button"
              className="breadcrumb-step-btn"
              onClick={handleResetBreadcrumb}
              title="Retour au choix du domaine"
            >
              <span className="step-num">Cycle</span>
              <span className="step-label">{activeCycleData.title}</span>
            </button>

            {/* Separator 1 */}
            <span className="breadcrumb-arrow" aria-hidden="true">›</span>

            {/* Step 1: Domaine */}
            {selectedDomain ? (
              <button
                type="button"
                className="breadcrumb-step-btn"
                onClick={() => {
                  setSelectedFiliereId(null);
                  setSelectedSubjectId(null);
                }}
                title="Retour aux filières du domaine"
              >
                <span className="step-num">Domaine</span>
                <span className="step-label">{selectedDomain.title}</span>
              </button>
            ) : (
              <span className="breadcrumb-step-current">
                <span className="step-num">Étape 1</span>
                <span className="step-label">Choisir un Domaine ({availableDomains.length})</span>
              </span>
            )}

            {/* Separator 2 */}
            {selectedDomain && (
              <>
                <span className="breadcrumb-arrow" aria-hidden="true">›</span>
                {selectedFiliere ? (
                  <button
                    type="button"
                    className="breadcrumb-step-btn"
                    onClick={() => setSelectedSubjectId(null)}
                    title="Retour aux matières de la filière"
                  >
                    <span className="step-num">Filière</span>
                    <span className="step-label">{selectedFiliere.title}</span>
                  </button>
                ) : (
                  <span className="breadcrumb-step-current">
                    <span className="step-num">Étape 2</span>
                    <span className="step-label">Choisir une Filière</span>
                  </span>
                )}
              </>
            )}

            {/* Separator 3 */}
            {selectedFiliere && (
              <>
                <span className="breadcrumb-arrow" aria-hidden="true">›</span>
                {selectedSubject ? (
                  <span className="breadcrumb-step-current active-leaf">
                    <span className="step-num">Matière</span>
                    <span className="step-label">{selectedSubject.name}</span>
                  </span>
                ) : (
                  <span className="breadcrumb-step-current">
                    <span className="step-num">Étape 3</span>
                    <span className="step-label">Choisir une Matière</span>
                  </span>
                )}
              </>
            )}
          </div>

          {/* Reset button */}
          {(selectedDomainId || selectedFiliereId || selectedSubjectId) && (
            <button
              type="button"
              className="breadcrumb-reset-btn"
              onClick={handleResetBreadcrumb}
              title="Réinitialiser le parcours"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Réinitialiser</span>
            </button>
          )}
        </nav>

        {/* STEP 1: DOMAIN SELECTION */}
        {currentStep === 1 && (
          <div className="navigator-step-content animate-fade-in">
            <div className="step-intro">
              <h3 className="step-heading">
                Sélectionnez un grand domaine d’études — {activeCycleData.title}
              </h3>
              <p className="step-description">
                Choisissez votre domaine académique pour accéder aux filières et spécialités officielles.
              </p>
            </div>

            <div className="domains-grid">
              {availableDomains.map((domain, index) => (
                <div
                  key={domain.id}
                  className="domain-card"
                  onClick={() => handleDomainSelect(domain.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDomainSelect(domain.id);
                    }
                  }}
                >
                  <div className="domain-card-header">
                    <div
                      className="domain-icon-circle"
                      style={{ backgroundColor: domain.bgColor, color: domain.color }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        {domain.iconName === 'laptop' && (
                          <>
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="2" y1="20" x2="22" y2="20" />
                          </>
                        )}
                        {domain.iconName === 'atom' && (
                          <>
                            <circle cx="12" cy="12" r="2" />
                            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2Z" />
                          </>
                        )}
                        {domain.iconName === 'trending-up' && (
                          <>
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                          </>
                        )}
                        {domain.iconName === 'scale' && (
                          <>
                            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                            <path d="M7 21h10" />
                            <path d="M12 3v18" />
                            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                          </>
                        )}
                        {domain.iconName === 'landmark' && (
                          <>
                            <line x1="2" y1="22" x2="22" y2="22" />
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <path d="m3 7 9-5 9 5v3H3V7Z" />
                            <path d="M6 10v9M10 10v9M14 10v9M18 10v9" />
                          </>
                        )}
                        {domain.iconName === 'heart-pulse' && (
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        )}
                        {domain.iconName === 'cpu' && (
                          <>
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                          </>
                        )}
                        {domain.iconName === 'sprout' && (
                          <>
                            <path d="M7 20h10" />
                            <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                            <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8Z" />
                            <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.3 1.1-4.9 2Z" />
                          </>
                        )}
                        {domain.iconName === 'book-open' && (
                          <>
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </>
                        )}
                      </svg>
                    </div>
                    <span className="domain-index-badge">0{index + 1}</span>
                  </div>

                  <h4 className="domain-card-title">{domain.title}</h4>
                  <p className="domain-card-desc">{domain.description}</p>

                  <div className="domain-card-footer">
                    <span className="footer-filiere-count">
                      {EDUCATION_FILIERES.filter((f) => f.domainId === domain.id).length || 1}{' '}
                      filière(s) disponible(s)
                    </span>
                    <span className="footer-action-link">
                      Choisir →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FILIERE SELECTION */}
        {currentStep === 2 && selectedDomain && (
          <div className="navigator-step-content animate-fade-in">
            <div className="step-intro-with-back">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => setSelectedDomainId(null)}
              >
                ← Revenir aux domaines
              </button>
              <div>
                <h3 className="step-heading">
                  Filières & Spécialités — <span style={{ color: selectedDomain.color }}>{selectedDomain.title}</span>
                </h3>
                <p className="step-description">
                  Sélectionnez votre filière pour consulter les matières et ressources du programme.
                </p>
              </div>
            </div>

            <div className="filieres-grid">
              {availableFilieres.map((filiere) => {
                const subCount = EDUCATION_HIERARCHY_SUBJECTS.filter((s) => s.filiereId === filiere.id).length;
                return (
                  <div
                    key={filiere.id}
                    className="filiere-card"
                    onClick={() => handleFiliereSelect(filiere.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFiliereSelect(filiere.id);
                      }
                    }}
                  >
                    <div className="filiere-header">
                      {filiere.degreeLevel && (
                        <span className="degree-badge">{filiere.degreeLevel}</span>
                      )}
                      <span className="subject-count-pill">{subCount || 1} matière(s)</span>
                    </div>

                    <h4 className="filiere-title">{filiere.title}</h4>
                    <p className="filiere-desc">{filiere.description}</p>

                    <div className="filiere-card-action">
                      <span>Voir les matières & cours</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SUBJECT SELECTION */}
        {currentStep === 3 && selectedDomain && selectedFiliere && (
          <div className="navigator-step-content animate-fade-in">
            <div className="step-intro-with-back">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => setSelectedFiliereId(null)}
              >
                ← Revenir aux filières
              </button>
              <div>
                <h3 className="step-heading">
                  Matières au programme — <span className="highlighted-filiere-text">{selectedFiliere.title}</span>
                </h3>
                <p className="step-description">
                  Sélectionnez une matière pour afficher l’ensemble des cours magistraux, exercices corrigés, annales et manuels.
                </p>
              </div>
            </div>

            <div className="subjects-hierarchy-grid">
              {availableSubjects.map((subject) => {
                const resCount = INITIAL_EDUCATION_RESOURCES.filter(
                  (r) => r.subjectId === subject.id || r.subjectSlug === subject.slug
                ).length;
                return (
                  <div
                    key={subject.id}
                    className="subject-hierarchy-card"
                    onClick={() => handleSubjectSelect(subject.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSubjectSelect(subject.id);
                      }
                    }}
                  >
                    <div className="subject-code-row">
                      {subject.code && <span className="subject-code-badge">{subject.code}</span>}
                      <span className="res-badge-tag">{resCount} document(s)</span>
                    </div>

                    <h4 className="subject-hierarchy-title">{subject.name}</h4>
                    <p className="subject-hierarchy-desc">{subject.description}</p>

                    <div className="subject-footer-action">
                      <span className="action-pill-btn">Explorer les ressources →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: RESOURCES VIEW */}
        {currentStep === 4 && selectedDomain && selectedFiliere && selectedSubject && (
          <div className="navigator-step-content animate-fade-in">
            <div className="step-intro-with-back">
              <button
                type="button"
                className="step-back-btn"
                onClick={() => setSelectedSubjectId(null)}
              >
                ← Revenir aux matières
              </button>
              <div>
                <h3 className="step-heading">
                  Ressources pour : <span className="highlighted-filiere-text">{selectedSubject.name}</span>
                </h3>
                <p className="step-description">
                  Filière : {selectedFiliere.title} • {selectedDomain.title}
                </p>
              </div>
            </div>

            {/* Resource Type Filter Sub-Tabs */}
            <div className="resource-subtabs-bar">
              <span className="filter-label-prefix">Filtrer par type :</span>
              {[
                { id: 'all', label: 'Toutes les ressources' },
                { id: 'cours', label: 'Cours structurés' },
                { id: 'exercice', label: 'Exercices corrigés' },
                { id: 'annale', label: 'Annales d’examens' },
                { id: 'livre', label: 'Livres & Manuels' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`subtab-pill ${selectedResourceType === tab.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedResourceType(tab.id as EducationResourceType | 'all')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {hierarchyResources.length > 0 ? (
              <div className="hierarchy-resource-cards-grid">
                {hierarchyResources.map((resource) => (
                  <div key={resource.id} className="h-resource-card">
                    {/* Visual Banner */}
                    <div
                      className="h-card-cover"
                      style={{ background: resource.coverGradient }}
                    >
                      <span className="h-card-type-tag">{resource.typeLabel}</span>
                      <span className={`h-card-access-tag tag-${resource.accessStatus}`}>
                        {resource.accessStatus === 'gratuit' ? 'Gratuit' : resource.accessStatus === 'gold' ? 'Gold' : 'Abonnement'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="h-card-body">
                      <div className="h-card-meta-top">
                        <span className="meta-grade">{resource.grade || activeCycleData.title}</span>
                        {resource.year && <span className="meta-year">• {resource.year}</span>}
                      </div>

                      <h4 className="h-card-title">{resource.title}</h4>
                      <p className="h-card-desc">{resource.description}</p>

                      <div className="h-card-footer">
                        <div className="h-card-stats">
                          {resource.pagesCount && (
                            <span className="stat-item">📄 {resource.pagesCount} pages</span>
                          )}
                          {resource.downloadsCount && (
                            <span className="stat-item">📥 {resource.downloadsCount}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="h-card-action-btn"
                          onClick={() => onSelectResource && onSelectResource(resource)}
                        >
                          Consulter →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-hierarchy-state">
                <div className="empty-icon-box">📚</div>
                <h4>Ressources en cours de numérisation</h4>
                <p>
                  Les fascicules et annales officielles pour <strong>{selectedSubject.name}</strong> sont en cours de validation pédagogique par notre équipe.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedResourceType('all')}
                >
                  Voir tous les types de ressources
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .hierarchy-navigator-section {
          padding: 60px 0 70px 0;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header-centered {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 36px auto;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.2);
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #4338ca;
          margin-bottom: 14px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: 15.5px;
          line-height: 1.6;
          color: #475569;
        }

        /* Cycle Switcher Tabs */
        .cycle-tabs-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .cycle-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .cycle-tab-btn:hover {
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-1px);
        }

        .cycle-tab-btn.is-active {
          background: #1e3a8a;
          color: #ffffff;
          border-color: #1e3a8a;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25);
        }

        .tab-icon-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .tab-badge-gold {
          padding: 2px 7px;
          background: #fef08a;
          color: #854d0e;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Breadcrumb Bar */
        .hierarchy-breadcrumb-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          flex-wrap: wrap;
          gap: 12px;
        }

        .breadcrumb-items-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .breadcrumb-step-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          color: #1e3a8a;
          font-size: 13.5px;
          font-weight: 600;
          transition: background 0.15s;
        }

        .breadcrumb-step-btn:hover {
          background: #eff6ff;
        }

        .step-num {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          font-weight: 700;
        }

        .breadcrumb-arrow {
          color: #94a3b8;
          font-size: 16px;
          font-weight: bold;
        }

        .breadcrumb-step-current {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          padding: 4px 8px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px dashed #cbd5e1;
        }

        .breadcrumb-step-current.active-leaf {
          background: #e0e7ff;
          color: #3730a3;
          border-style: solid;
          border-color: #c7d2fe;
        }

        .breadcrumb-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .breadcrumb-reset-btn:hover {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fca5a5;
        }

        /* Step intro & controls */
        .step-intro {
          margin-bottom: 24px;
        }

        .step-intro-with-back {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .step-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .step-back-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .step-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .step-description {
          font-size: 14px;
          color: #64748b;
        }

        .highlighted-filiere-text {
          color: #4338ca;
        }

        /* STEP 1: DOMAINS GRID */
        .domains-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .domain-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
        }

        .domain-card:hover, .domain-card:focus {
          border-color: #3b82f6;
          box-shadow: 0 10px 24px -4px rgba(59, 130, 246, 0.15);
          transform: translateY(-3px);
          outline: none;
        }

        .domain-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .domain-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .domain-index-badge {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .domain-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .domain-card-desc {
          font-size: 13px;
          line-height: 1.55;
          color: #64748b;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .domain-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          font-size: 12.5px;
        }

        .footer-filiere-count {
          color: #64748b;
          font-weight: 500;
        }

        .footer-action-link {
          color: #2563eb;
          font-weight: 700;
        }

        /* STEP 2: FILIERES GRID */
        .filieres-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .filiere-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
        }

        .filiere-card:hover, .filiere-card:focus {
          border-color: #4f46e5;
          box-shadow: 0 10px 24px -4px rgba(79, 70, 229, 0.15);
          transform: translateY(-3px);
          outline: none;
        }

        .filiere-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .degree-badge {
          padding: 4px 10px;
          background: rgba(79, 70, 229, 0.08);
          color: #4338ca;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
        }

        .subject-count-pill {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .filiere-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .filiere-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #64748b;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .filiere-card-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #4338ca;
        }

        /* STEP 3: SUBJECTS GRID */
        .subjects-hierarchy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        .subject-hierarchy-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .subject-hierarchy-card:hover, .subject-hierarchy-card:focus {
          border-color: #0284c7;
          box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.15);
          transform: translateY(-2px);
          outline: none;
        }

        .subject-code-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .subject-code-badge {
          padding: 2px 8px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }

        .res-badge-tag {
          font-size: 11.5px;
          font-weight: 600;
          color: #0284c7;
        }

        .subject-hierarchy-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .subject-hierarchy-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #64748b;
          margin-bottom: 14px;
          flex-grow: 1;
        }

        .action-pill-btn {
          font-size: 12.5px;
          font-weight: 700;
          color: #0284c7;
        }

        /* STEP 4: RESOURCE SUBTABS & CARDS */
        .resource-subtabs-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-label-prefix {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          margin-right: 4px;
        }

        .subtab-pill {
          padding: 6px 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }

        .subtab-pill:hover {
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .subtab-pill.is-active {
          background: #1e3a8a;
          border-color: #1e3a8a;
          color: #ffffff;
        }

        .hierarchy-resource-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .h-resource-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .h-resource-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.1);
        }

        .h-card-cover {
          height: 100px;
          position: relative;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .h-card-type-tag {
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
        }

        .h-card-access-tag {
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .tag-gratuit {
          background: #dcfce7;
          color: #166534;
        }

        .tag-abonnement {
          background: #e0e7ff;
          color: #3730a3;
        }

        .tag-gold {
          background: #fef08a;
          color: #854d0e;
        }

        .h-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .h-card-meta-top {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .h-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1.35;
        }

        .h-card-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 14px;
          flex-grow: 1;
        }

        .h-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .h-card-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          color: #64748b;
        }

        .h-card-action-btn {
          padding: 6px 12px;
          background: #1e3a8a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }

        .h-card-action-btn:hover {
          background: #1d4ed8;
        }

        .empty-hierarchy-state {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon-box {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .empty-hierarchy-state h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .empty-hierarchy-state p {
          font-size: 13.5px;
          color: #64748b;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .animate-fade-in {
          animation: fadeIn 0.25s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hierarchy-navigator-section {
            padding: 40px 0 50px 0;
          }

          .section-title {
            font-size: 24px;
          }

          .cycle-tab-btn {
            padding: 8px 14px;
            font-size: 13px;
          }

          .hierarchy-breadcrumb-bar {
            padding: 10px 14px;
          }

          .domains-grid, .filieres-grid, .subjects-hierarchy-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
