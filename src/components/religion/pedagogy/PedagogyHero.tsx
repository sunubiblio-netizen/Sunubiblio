'use client';

import React from 'react';
import Link from 'next/link';
import { ReligionPedagogicalHero, ReligionResource } from '@/types/religion';
import { ReligionContextualSearch } from './ReligionContextualSearch';

interface PedagogyHeroProps {
  hero: ReligionPedagogicalHero;
  traditionSlug: string;
  activeBranchTitle?: string | null;
  activeBranchId?: string | null;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onSelectResource: (resource: ReligionResource) => void;
  onSelectBranch: (branchId: string) => void;
  onApplyGlobalSearch: (query: string) => void;
  onOpenAllSections?: () => void;
  onCloseAllSections?: () => void;
}

export const PedagogyHero: React.FC<PedagogyHeroProps> = ({
  hero,
  traditionSlug,
  activeBranchTitle,
  activeBranchId,
  activeSection,
  onNavigateSection,
  onSelectResource,
  onSelectBranch,
  onApplyGlobalSearch,
  onOpenAllSections,
  onCloseAllSections,
}) => {
  const sections = [
    { id: 'comprendre', label: '1. Comprendre' },
    { id: 'figures', label: '2. Figures majeures' },
    { id: 'textes', label: '3. Textes sacrés' },
    { id: 'pratiques', label: '4. Pratiques' },
    { id: 'histoire', label: '5. Histoire' },
    { id: 'courants', label: '6. Courants' },
    { id: 'approfondir', label: '7. Approfondir (Ressources)' },
  ];

  return (
    <div className="pedagogy-hero-wrapper">
      {/* Ambient background blobs matching Sunubiblio */}
      <div className="hero-ambient-blob" />

      <div className="container">
        {/* Navigation bar & Breadcrumb */}
        <div className="pedagogy-top-nav">
          <Link href="/religion" className="pedagogy-back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Retour à l&apos;espace Religion</span>
          </Link>

          <nav aria-label="Fil d'Ariane" className="pedagogy-breadcrumb-trail">
            <Link href="/" className="trail-link">Accueil</Link>
            <span className="trail-sep">/</span>
            <Link href="/religion" className="trail-link">Religion</Link>
            <span className="trail-sep">/</span>
            <span className="trail-current">{hero.title}</span>
          </nav>
        </div>

        {/* Hero Main Content */}
        <div className="pedagogy-hero-content">
          <div className="hero-badge-pill" style={{ backgroundColor: hero.bgLight, color: hero.accentColor, borderColor: hero.borderColor }}>
            <span className="badge-dot" style={{ backgroundColor: hero.accentColor }} />
            <span>{hero.badge}</span>
          </div>

          <h1 className="pedagogy-title">{hero.title}</h1>
          <p className="pedagogy-subtitle">{hero.subtitle}</p>
          <p className="pedagogy-tagline">{hero.tagline}</p>

          {/* Key Facts Pills */}
          <div className="pedagogy-facts-row">
            <div className="fact-card">
              <span className="fact-label">Présence mondiale</span>
              <span className="fact-value">{hero.keyStat}</span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Origine historique</span>
              <span className="fact-value">{hero.periodOrigin}</span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Berceau géographique</span>
              <span className="fact-value">{hero.geographicOrigin}</span>
            </div>
          </div>
        </div>

        {/* Dedicated Contextual Search for this Religion */}
        <ReligionContextualSearch
          traditionSlug={traditionSlug}
          traditionTitle={hero.title.replace('Découvrir ', '')}
          activeBranchTitle={activeBranchTitle}
          activeBranchId={activeBranchId}
          onSelectResource={onSelectResource}
          onSelectBranch={onSelectBranch}
          onNavigateToSection={onNavigateSection}
          onApplyGlobalSearch={onApplyGlobalSearch}
        />

        {/* Floating Table of Contents Bar */}
        <div className="pedagogy-toc-bar">
          <div className="toc-inner">
            <div className="toc-left">
              <span className="toc-title">Sommaire :</span>
              <div className="toc-scroller">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => onNavigateSection(sec.id)}
                    className={`toc-chip ${activeSection === sec.id ? 'active' : ''}`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {(onOpenAllSections || onCloseAllSections) && (
              <div className="toc-global-actions">
                {onOpenAllSections && (
                  <button
                    type="button"
                    className="toc-action-btn"
                    onClick={onOpenAllSections}
                    title="Déplier toutes les sections"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="7 11 12 6 17 11" />
                      <polyline points="7 18 12 13 17 18" />
                    </svg>
                    <span>Tout ouvrir</span>
                  </button>
                )}
                {onCloseAllSections && (
                  <button
                    type="button"
                    className="toc-action-btn"
                    onClick={onCloseAllSections}
                    title="Replier toutes les sections"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="7 13 12 18 17 13" />
                      <polyline points="7 6 12 11 17 6" />
                    </svg>
                    <span>Tout fermer</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pedagogy-hero-wrapper {
          position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          padding: 32px 0 0 0;
          overflow: hidden;
        }

        .hero-ambient-blob {
          position: absolute;
          top: -40px;
          right: 5%;
          width: 480px;
          height: 380px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .pedagogy-top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .pedagogy-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .pedagogy-back-btn:hover {
          color: #0f172a;
          border-color: #cbd5e1;
          transform: translateX(-2px);
        }

        .pedagogy-breadcrumb-trail {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .trail-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s;
        }

        .trail-link:hover {
          color: #4f46e5;
        }

        .trail-sep {
          color: #cbd5e1;
        }

        .trail-current {
          color: #0f172a;
          font-weight: 700;
        }

        .pedagogy-hero-content {
          max-width: 860px;
          margin-bottom: 36px;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid;
          border-radius: 9999px;
          padding: 5px 14px;
          font-size: 12.5px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .pedagogy-title {
          font-size: 40px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .pedagogy-subtitle {
          font-size: 18px;
          font-weight: 600;
          color: #4338ca;
          margin-bottom: 14px;
          line-height: 1.4;
        }

        .pedagogy-tagline {
          font-size: 15.5px;
          line-height: 1.65;
          color: #475569;
          margin-bottom: 24px;
        }

        .pedagogy-facts-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .fact-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 18px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .fact-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .fact-value {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        /* Table of Contents Bar */
        .pedagogy-toc-bar {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-bottom: none;
          border-radius: 18px 18px 0 0;
          padding: 14px 20px;
          box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.03);
        }

        .toc-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
        }

        .toc-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }

        .toc-global-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .toc-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .toc-action-btn:hover {
          background: #eef2ff;
          border-color: rgba(99, 102, 241, 0.4);
          color: #4f46e5;
          transform: translateY(-1px);
        }

        .toc-title {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
          white-space: nowrap;
        }

        .toc-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .toc-scroller::-webkit-scrollbar {
          display: none;
        }

        .toc-chip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .toc-chip:hover {
          background: #f1f5f9;
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-1px);
        }

        .toc-chip:active {
          transform: scale(0.97);
        }

        .toc-chip.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          border-color: transparent;
          font-weight: 700;
          box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .pedagogy-hero-wrapper {
            padding-top: 20px;
          }

          .pedagogy-title {
            font-size: 28px;
          }

          .pedagogy-subtitle {
            font-size: 16px;
          }

          .pedagogy-facts-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .pedagogy-top-nav {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};
