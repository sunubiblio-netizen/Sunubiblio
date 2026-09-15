'use client';

import React, { useState, useMemo } from 'react';
import { ReligionPedagogicalData, ReligionResource, ReligionFilterState, ReligionThemeCategoryId, ReligionBranchId } from '@/types/religion';
import { RELIGION_TRADITIONS, RELIGION_BRANCHES, RELIGION_THEME_CATEGORIES } from '@/data/mockReligion';
import { religionService } from '@/services/religionService';
import { PedagogyLibrarySection } from '@/components/religion/pedagogy/PedagogyLibrarySection';
import { MobileReligionFilterDrawer } from '@/components/religion/MobileReligionFilterDrawer';
import { PedagogyHero } from '@/components/religion/pedagogy/PedagogyHero';
import { CollapsibleSection } from '@/components/religion/pedagogy/CollapsibleSection';
import { PedagogyIntroSection } from '@/components/religion/pedagogy/PedagogyIntroSection';
import { PedagogyKeyFigureSection } from '@/components/religion/pedagogy/PedagogyKeyFigureSection';
import { PedagogySacredTextsSection } from '@/components/religion/pedagogy/PedagogySacredTextsSection';
import { PedagogyPracticesSection } from '@/components/religion/pedagogy/PedagogyPracticesSection';
import { PedagogyHistorySection } from '@/components/religion/pedagogy/PedagogyHistorySection';
import { PedagogyCurrentsSection } from '@/components/religion/pedagogy/PedagogyCurrentsSection';
import { PedagogyDeepenSection } from '@/components/religion/pedagogy/PedagogyDeepenSection';

import { ReligionResourceModal } from '@/components/religion/ReligionResourceModal';

interface PedagogyClientViewProps {
  data: ReligionPedagogicalData;
  resources: ReligionResource[];
}

export const PedagogyClientView: React.FC<PedagogyClientViewProps> = ({
  data,
  resources,
}) => {
  const [activeSection, setActiveSection] = useState<string>('comprendre');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalResource, setActiveModalResource] = useState<ReligionResource | null>(null);

  // === ETATS BIBLIOTHEQUE ===
  const [filters, setFilters] = useState<ReligionFilterState>({
    searchQuery: '',
    traditionId: data.traditionId,
    branchId: 'all',
    themeCategoryId: 'all',
    contentType: 'all',
    author: 'all',
    year: 'all',
    requiredPlan: 'all',
    sortBy: 'pertinence',
    page: 1,
    perPage: 9,
  });

  const [libraryResources, setLibraryResources] = useState<ReligionResource[]>(resources);
  const [popularResources, setPopularResources] = useState<ReligionResource[]>([]);
  const [totalResources, setTotalResources] = useState(resources.length);
  const [totalPages, setTotalPages] = useState(1);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Charger les ressources filtrées
  React.useEffect(() => {
    let isMounted = true;
    const fetchResources = async () => {
      setIsLibraryLoading(true);
      try {
        const result = await religionService.getResources(filters);
        const popular = await religionService.getPopularResources(filters.traditionId, filters.branchId);
        
        if (isMounted) {
          setLibraryResources(result.resources);
          setTotalResources(result.total);
          setTotalPages(result.totalPages);
          setPopularResources(popular);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsLibraryLoading(false);
      }
    };
    fetchResources();
    return () => { isMounted = false; };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ReligionFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      branchId: 'all',
      themeCategoryId: 'all',
      contentType: 'all',
      author: 'all',
      year: 'all',
      requiredPlan: 'all',
      sortBy: 'pertinence',
      page: 1,
    }));
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.branchId !== 'all') count++;
    if (filters.themeCategoryId !== 'all') count++;
    if (filters.contentType !== 'all') count++;
    if (filters.author !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.requiredPlan !== 'all') count++;
    return count;
  }, [filters]);
  // === FIN ETATS BIBLIOTHEQUE ===

  // État d'ouverture indépendant pour chacune des 7 grandes sections
  // Section 1 ("Comprendre") est ouverte par défaut pour débuter l'apprentissage
  // Les autres sont fermées pour alléger visuellement la page et éliminer la fatigue de défilement
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    comprendre: true,
    figures: false,
    textes: false,
    pratiques: false,
    histoire: false,
    courants: false,
    approfondir: false,
  });

  const traditionTitle = useMemo(() => {
    return data.hero.title.replace('Découvrir ', '');
  }, [data.hero.title]);

  const activeBranch = data.currentsAndBranches.find((b) => b.id === selectedBranchFilter);
  const activeBranchTitle = activeBranch ? activeBranch.title : null;

  // Toggle d'une section individuelle (permet de garder plusieurs sections ouvertes en parallèle)
  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Actions globales Tout ouvrir / Tout fermer
  const handleOpenAllSections = () => {
    setOpenSections({
      comprendre: true,
      figures: true,
      textes: true,
      pratiques: true,
      histoire: true,
      courants: true,
      approfondir: true,
    });
  };

  const handleCloseAllSections = () => {
    setOpenSections({
      comprendre: false,
      figures: false,
      textes: false,
      pratiques: false,
      histoire: false,
      courants: false,
      approfondir: false,
    });
  };

  // Clic depuis le Sommaire : Ouvre automatiquement la section cible et fait défiler en douceur
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    // 1. Déplier automatiquement la section si elle est fermée
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));

    // 2. Défilement fluide vers l'en-tête de la section
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -90; // Décalage pour lecture confortable sous la barre d'onglets
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 40);
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchFilter(branchId);
    scrollToSection('approfondir');
  };

  const handleExploreTextResources = (textName: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: textName, page: 1 }));
    const el = document.getElementById('bibliotheque');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleApplySearch = (q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q, page: 1 }));
    const el = document.getElementById('bibliotheque');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Compteur de sections ouvertes pour la barre d'outils secondaire
  const openCount = useMemo(() => {
    return Object.values(openSections).filter(Boolean).length;
  }, [openSections]);

  const mainFigure = data.keyFigures && data.keyFigures.length > 0 ? data.keyFigures[0] : null;

  return (
    <div className="pedagogy-page-root">
      {/* 1. Hero avec Fil d'Ariane, Recherche Contextuelle et Sommaire rapide */}
      <PedagogyHero
        hero={data.hero}
        traditionSlug={data.slug}
        activeBranchTitle={activeBranchTitle}
        activeBranchId={selectedBranchFilter !== 'all' ? selectedBranchFilter : null}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        onSelectResource={(res) => setActiveModalResource(res)}
        onSelectBranch={handleSelectBranch}
        onApplyGlobalSearch={handleApplySearch}
        onOpenAllSections={handleOpenAllSections}
        onCloseAllSections={handleCloseAllSections}
      />

      {/* 2. ESPACE BIBLIOTHÈQUE NUMÉRIQUE (Nouveau) */}
      <PedagogyLibrarySection
        filters={filters}
        traditions={RELIGION_TRADITIONS.filter((t) => t.id === data.traditionId)}
        branches={RELIGION_BRANCHES.filter((b) => b.traditionId === data.traditionId)}
        themeCategories={RELIGION_THEME_CATEGORIES}
        resources={libraryResources}
        popularResources={popularResources}
        totalResources={totalResources}
        totalPages={totalPages}
        isLoading={isLibraryLoading}
        activeFiltersCount={activeFiltersCount}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        onConsultResource={(res) => setActiveModalResource(res)}
      />

      <main className="pedagogy-main-container">
        <div className="container">
          {/* Barre d'outils discrète de gestion des sections repliables */}
          <div className="pedagogy-sections-toolbar">
            <div className="toolbar-info">
              <span className="toolbar-dot" />
              <span className="toolbar-count-text">
                {openCount} sur 7 section{openCount > 1 ? 's' : ''} ouverte{openCount > 1 ? 's' : ''}
              </span>
            </div>

            <div className="toolbar-actions">
              <button
                type="button"
                className="toolbar-btn"
                onClick={handleOpenAllSections}
                title="Déplier l'ensemble des 7 sections"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="7 11 12 6 17 11" />
                  <polyline points="7 18 12 13 17 18" />
                </svg>
                <span>Tout ouvrir</span>
              </button>

              <span className="toolbar-sep">|</span>

              <button
                type="button"
                className="toolbar-btn"
                onClick={handleCloseAllSections}
                title="Replier l'ensemble des sections"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="7 13 12 18 17 13" />
                  <polyline points="7 6 12 11 17 6" />
                </svg>
                <span>Tout fermer</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              1. COMPRENDRE (Qu'est-ce que [Tradition] ? & Croyances fondamentales)
             ========================================================================= */}
          <CollapsibleSection
            id="comprendre"
            stepNumber={1}
            title={`Comprendre ${traditionTitle}`}
            subtitle="Définition, genèse historique, raison d'être et fondements spirituels indispensables."
            badge="Essentiel"
            accentColor={data.hero.accentColor}
            isOpen={openSections.comprendre}
            onToggle={() => toggleSection('comprendre')}
          >
            <PedagogyIntroSection
              traditionTitle={traditionTitle}
              intro={data.introduction}
              coreBeliefs={data.coreBeliefs}
              accentColor={data.hero.accentColor}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              2. FIGURES MAJEURES & PROPHÈTES
             ========================================================================= */}
          <CollapsibleSection
            id="figures"
            stepNumber={2}
            title={mainFigure ? `Figure Majeure : ${mainFigure.name}` : 'Figures Majeures'}
            subtitle={mainFigure ? `${mainFigure.title} — Rôle, mission prophétique et jalons biographiques.` : 'Grandes personnalités et maîtres spirituels.'}
            badge="Patrimoine"
            accentColor={data.hero.accentColor}
            isOpen={openSections.figures}
            onToggle={() => toggleSection('figures')}
          >
            <PedagogyKeyFigureSection
              figures={data.keyFigures}
              accentColor={data.hero.accentColor}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              3. TEXTES SACRÉS & FONDAMENTAUX
             ========================================================================= */}
          <CollapsibleSection
            id="textes"
            stepNumber={3}
            title="Les Textes Fondamentaux"
            subtitle="Écritures sacrées, corpus normatifs et transmission scripturaire."
            badge="Canonique"
            accentColor={data.hero.accentColor}
            isOpen={openSections.textes}
            onToggle={() => toggleSection('textes')}
          >
            <PedagogySacredTextsSection
              texts={data.sacredTexts}
              accentColor={data.hero.accentColor}
              onExploreTextResources={handleExploreTextResources}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              4. PRATIQUES, PILIERS & SPIRITUALITÉ
             ========================================================================= */}
          <CollapsibleSection
            id="pratiques"
            stepNumber={4}
            title="Pratiques, Piliers & Spiritualité"
            subtitle="Piliers d'action, rituels quotidiens et dimension intérieure de purification."
            badge="Vocation"
            accentColor={data.hero.accentColor}
            isOpen={openSections.pratiques}
            onToggle={() => toggleSection('pratiques')}
          >
            <PedagogyPracticesSection
              practices={data.practices}
              accentColor={data.hero.accentColor}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              5. HISTOIRE & RAYONNEMENT MONDIAL
             ========================================================================= */}
          <CollapsibleSection
            id="histoire"
            stepNumber={5}
            title="Histoire & Rayonnement"
            subtitle="Grandes époques historiques, essor des civilisations et diffusion géographique."
            badge="Chronologie"
            accentColor={data.hero.accentColor}
            isOpen={openSections.histoire}
            onToggle={() => toggleSection('histoire')}
          >
            <PedagogyHistorySection
              milestones={data.historyMilestones}
              accentColor={data.hero.accentColor}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              6. COURANTS, CONFRÉRIES & TRADITIONS
             ========================================================================= */}
          <CollapsibleSection
            id="courants"
            stepNumber={6}
            title="Courants, Confréries & Traditions"
            subtitle="Diversité des expressions spirituelles, enracinement local et grandes écoles de pensée."
            badge="Diversité"
            accentColor={data.hero.accentColor}
            isOpen={openSections.courants}
            onToggle={() => toggleSection('courants')}
          >
            <PedagogyCurrentsSection
              currents={data.currentsAndBranches}
              accentColor={data.hero.accentColor}
              onSelectCurrent={handleSelectBranch}
              hideHeader={true}
            />
          </CollapsibleSection>

          {/* =========================================================================
              7. APPROFONDIR / RESSOURCES & BIBLIOTHÈQUE SPÉCIALISÉE CONNECTÉE
             ========================================================================= */}
          <CollapsibleSection
            id="approfondir"
            stepNumber={7}
            title="Approfondir avec les Ressources"
            subtitle={data.furtherReadingSummary.description}
            badge="Bibliothèque"
            accentColor={data.hero.accentColor}
            isOpen={openSections.approfondir}
            onToggle={() => toggleSection('approfondir')}
          >
            <PedagogyDeepenSection
              traditionTitle={traditionTitle}
              summary={data.furtherReadingSummary}
              resources={resources}
              accentColor={data.hero.accentColor}
              selectedBranchId={selectedBranchFilter}
              externalSearchQuery={searchQuery}
              onClearBranchFilter={() => setSelectedBranchFilter('all')}
              hideHeader={true}
            />
          </CollapsibleSection>
        </div>
      </main>

      {/* Modal pour afficher les détails et lire la ressource sélectionnée */}
      {/* Modal de consultation */}
      <ReligionResourceModal
        resource={activeModalResource}
        onClose={() => setActiveModalResource(null)}
        tradition={RELIGION_TRADITIONS.find(t => t.id === data.traditionId) || null}
        branch={RELIGION_BRANCHES.find(b => b.id === (activeModalResource?.branchId || filters.branchId)) || null}
        onOpenAuth={() => console.log('Ouvrir auth modal')}
      />

      {/* Tiroir mobile de filtres de la bibliothèque */}
      <MobileReligionFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        traditions={RELIGION_TRADITIONS.filter((t) => t.id === data.traditionId)}
        branches={RELIGION_BRANCHES.filter((b) => b.traditionId === data.traditionId)}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={totalResources}
      />

      <style jsx>{`
        .pedagogy-page-root {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          overflow-x: hidden;
          position: relative;
        }

        .pedagogy-main-container {
          padding-top: 24px;
          padding-bottom: 90px;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Barre d'outils secondaire en tête des sections */
        .pedagogy-sections-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          margin-bottom: 20px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .toolbar-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .toolbar-count-text {
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #475569;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .toolbar-btn:hover {
          background: #eef2ff;
          color: #4f46e5;
        }

        .toolbar-sep {
          color: #cbd5e1;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 14px;
          }

          .pedagogy-sections-toolbar {
            padding: 8px 12px;
            margin-bottom: 14px;
          }

          .toolbar-count-text {
            font-size: 11.5px;
          }

          .toolbar-btn {
            font-size: 11.5px;
            padding: 3px 6px;
          }
        }
      `}</style>
    </div>
  );
};
