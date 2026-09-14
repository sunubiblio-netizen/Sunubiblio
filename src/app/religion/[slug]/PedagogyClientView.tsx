'use client';

import React, { useState } from 'react';
import { ReligionPedagogicalData, ReligionResource } from '@/types/religion';
import { PedagogyHero } from '@/components/religion/pedagogy/PedagogyHero';
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

  const activeBranch = data.currentsAndBranches.find((b) => b.id === selectedBranchFilter);
  const activeBranchTitle = activeBranch ? activeBranch.title : null;

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // offset for sticky navigation
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchFilter(branchId);
    scrollToSection('approfondir');
  };

  const handleExploreTextResources = (textName: string) => {
    setSearchQuery(textName);
    scrollToSection('approfondir');
  };

  const handleApplySearch = (q: string) => {
    setSearchQuery(q);
    scrollToSection('approfondir');
  };

  return (
    <div className="pedagogy-page-root">
      {/* 1. Hero with Breadcrumb, Contextual Search Bar, and Floating TOC */}
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
      />

      <main className="pedagogy-main-container">
        <div className="container">
          {/* 2. Section 1: Qu'est-ce que [Tradition] ? & Croyances fondamentales */}
          <PedagogyIntroSection
            traditionTitle={data.hero.title.replace('Découvrir ', '')}
            intro={data.introduction}
            coreBeliefs={data.coreBeliefs}
            accentColor={data.hero.accentColor}
          />

          {/* 3. Section 2: Figure Centrale */}
          <PedagogyKeyFigureSection
            figures={data.keyFigures}
            accentColor={data.hero.accentColor}
          />

          {/* 4. Section 3: Textes Fondamentaux */}
          <PedagogySacredTextsSection
            texts={data.sacredTexts}
            accentColor={data.hero.accentColor}
            onExploreTextResources={handleExploreTextResources}
          />

          {/* 5. Section 4: Pratiques & Spiritualité */}
          <PedagogyPracticesSection
            practices={data.practices}
            accentColor={data.hero.accentColor}
          />

          {/* 6. Section 5: Histoire & Rayonnement Mondial */}
          <PedagogyHistorySection
            milestones={data.historyMilestones}
            accentColor={data.hero.accentColor}
          />

          {/* 7. Section 6: Courants, Confréries & Traditions */}
          <PedagogyCurrentsSection
            currents={data.currentsAndBranches}
            accentColor={data.hero.accentColor}
            onSelectCurrent={handleSelectBranch}
          />

          {/* 8. Section 7: « Approfondir » / Bibliothèque spécialisée connectée */}
          <PedagogyDeepenSection
            traditionTitle={data.hero.title.replace('Découvrir ', '')}
            summary={data.furtherReadingSummary}
            resources={resources}
            accentColor={data.hero.accentColor}
            selectedBranchId={selectedBranchFilter}
            externalSearchQuery={searchQuery}
            onClearBranchFilter={() => setSelectedBranchFilter('all')}
          />
        </div>
      </main>

      {/* Modal pour afficher les détails et lire la ressource sélectionnée */}
      {activeModalResource && (
        <ReligionResourceModal
          resource={activeModalResource}
          onClose={() => setActiveModalResource(null)}
        />
      )}

      <style jsx>{`
        .pedagogy-page-root {
          min-height: 100vh;
          background: #ffffff;
          color: #0f172a;
          overflow-x: hidden;
        }

        .pedagogy-main-container {
          padding-bottom: 80px;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (max-width: 640px) {
          .container {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
};
