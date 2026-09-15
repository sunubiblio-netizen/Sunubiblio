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
      {/* Ambient blobs */}
      <div className="hero-blob-1" />
      <div className="hero-blob-2" style={{ background: `radial-gradient(circle, ${hero.accentColor}18 0%, transparent 70%)` }} />

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

        {/* Hero Main Content — centré et minimaliste */}
        <div className="pedagogy-hero-content">
          <div
            className="hero-badge-pill"
            style={{ backgroundColor: hero.bgLight, color: hero.accentColor, borderColor: hero.borderColor }}
          >
            <span className="badge-dot" style={{ backgroundColor: hero.accentColor }} />
            <span>{hero.badge}</span>
          </div>

          <h1 className="pedagogy-title">{hero.title}</h1>
          <p className="pedagogy-subtitle">{hero.subtitle}</p>
        </div>

        {/* Search */}
        <div className="hero-search-wrapper">
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
        </div>

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
          background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 55%, #f8fafc 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          padding: 22px 0 0 0;
          overflow: hidden;
        }

        .hero-blob-1 {
          position: absolute;
          top: -80px;
          right: -40px;
          width: 500px;
          height: 400px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-blob-2 {
          position: absolute;
          bottom: 20px;
          left: -60px;
          width: 320px;
          height: 260px;
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
          gap: 10px;
          margin-bottom: 18px;
        }

        .pedagogy-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.9);
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
          transition: all 0.2s ease;
          white-space: nowrap;
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

        /* ─── HERO CONTENT — centré ─────────────────────────────── */
        .pedagogy-hero-content {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 20px auto;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1.5px solid;
          border-radius: 9999px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .pedagogy-title {
          font-size: clamp(26px, 5.5vw, 48px);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.08;
          margin-bottom: 12px;
        }

        .pedagogy-subtitle {
          font-size: clamp(14.5px, 2vw, 17px);
          font-weight: 500;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 0;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Search wrapper */
        .hero-search-wrapper {
          margin-bottom: 18px;
        }

        /* Table of Contents Bar */
        .pedagogy-toc-bar {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-bottom: none;
          border-radius: 16px 16px 0 0;
          padding: 11px 18px;
          box-shadow: 0 -2px 10px rgba(15, 23, 42, 0.03);
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
          .pedagogy-hero-wrapper { padding-top: 14px; }
          .container { padding: 0 14px; }

          .pedagogy-top-nav {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            margin-bottom: 14px;
          }

          .pedagogy-back-btn { font-size: 12px; padding: 5px 12px; }

          .pedagogy-hero-content { margin-bottom: 14px; }

          .hero-badge-pill { font-size: 11px; padding: 4px 12px; margin-bottom: 10px; }

          .hero-search-wrapper { margin-bottom: 12px; }

          .pedagogy-toc-bar { padding: 9px 14px; border-radius: 12px 12px 0 0; }
          .toc-title { display: none; }
          .toc-global-actions { display: none; }
          .toc-chip { font-size: 11px; padding: 4px 10px; }
        }

        @media (max-width: 390px) {
          .pedagogy-title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
};
