'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ReligionResource, ReligionResourceType } from '@/types/religion';
import { ReligionResourceCard } from '../ReligionResourceCard';
import { ReligionResourceModal } from '../ReligionResourceModal';
import { ReligionEmptyState } from '../ReligionEmptyState';

interface PedagogyDeepenSectionProps {
  traditionTitle: string;
  summary: {
    title: string;
    description: string;
    recommendedThemes: string[];
  };
  resources: ReligionResource[];
  accentColor: string;
  selectedBranchId?: string;
  externalSearchQuery?: string;
  onClearBranchFilter?: () => void;
}

export const PedagogyDeepenSection: React.FC<PedagogyDeepenSectionProps> = ({
  traditionTitle,
  summary,
  resources,
  accentColor,
  selectedBranchId,
  externalSearchQuery = '',
  onClearBranchFilter,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery);
  const [activeModalResource, setActiveModalResource] = useState<ReligionResource | null>(null);

  // Synchroniser avec la recherche déclenchée depuis le haut
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const formats = [
    { id: 'all', label: 'Tous les formats' },
    { id: 'livre', label: 'Livres' },
    { id: 'cours', label: 'Enseignements' },
    { id: 'conference', label: 'Conférences audio' },
    { id: 'article', label: 'Articles & Manuscrits' },
    { id: 'guide', label: 'Guides spirituels' },
  ];

  // Filtering resources
  const filteredResources = useMemo(() => {
    let result = [...resources];

    if (selectedBranchId && selectedBranchId !== 'all') {
      result = result.filter((r) => r.branchId === selectedBranchId);
    }

    if (selectedFormat !== 'all') {
      result = result.filter((r) => r.contentType === (selectedFormat as ReligionResourceType));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.titre.toLowerCase().includes(q) ||
          r.auteur.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [resources, selectedBranchId, selectedFormat, searchQuery]);

  return (
    <section className="pedagogy-section deepen-section" id="approfondir">
      <div className="section-head">
        <div className="section-num-badge" style={{ backgroundColor: accentColor }}>7</div>
        <div>
          <h2 className="section-title">Approfondir avec les Ressources</h2>
          <p className="section-subtitle">
            {summary.description}
          </p>
        </div>
      </div>

      {/* Recommended Themes Bar */}
      {summary.recommendedThemes && summary.recommendedThemes.length > 0 && (
        <div className="recommended-themes-box">
          <span className="themes-box-label">Thématiques clés recommandées :</span>
          <div className="themes-pills-list">
            {summary.recommendedThemes.map((th, idx) => (
              <span key={idx} className="theme-recom-pill">{th}</span>
            ))}
          </div>
        </div>
      )}

      {/* Internal Filter Bar for Tradition Library */}
      <div className="deepen-filter-bar">
        <div className="deepen-search-capsule">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="deepen-search-input"
            placeholder={`Rechercher dans la bibliothèque ${traditionTitle} (titre, auteur, thème)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Format Chips */}
        <div className="format-chips-scroller">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFormat(f.id)}
              className={`format-chip ${selectedFormat === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Active Branch Notice if user clicked "Voir les ressources" from currents */}
        {selectedBranchId && selectedBranchId !== 'all' && (
          <div className="active-branch-notice">
            <span>Filtre de courant actif : <strong>{selectedBranchId}</strong></span>
            {onClearBranchFilter && (
              <button
                type="button"
                className="clear-branch-filter-btn"
                onClick={onClearBranchFilter}
              >
                Afficher tous les courants
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resources Results Grid */}
      {filteredResources.length > 0 ? (
        <div className="resources-grid-wrapper">
          <div className="resources-count-bar">
            <span className="count-text">
              <strong>{filteredResources.length}</strong> ressource{filteredResources.length > 1 ? 's' : ''} disponible{filteredResources.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="resources-cards-grid">
            {filteredResources.map((res) => (
              <ReligionResourceCard
                key={res.id}
                resource={res}
                onConsult={(resource) => setActiveModalResource(resource)}
              />
            ))}
          </div>
        </div>
      ) : (
        <ReligionEmptyState
          hasFilter={true}
          onReset={() => {
            setSelectedFormat('all');
            setSearchQuery('');
            if (onClearBranchFilter) onClearBranchFilter();
          }}
        />
      )}

      {/* Interactive Detail Modal */}
      {activeModalResource && (
        <ReligionResourceModal
          resource={activeModalResource}
          onClose={() => setActiveModalResource(null)}
        />
      )}

      <style jsx>{`
        .deepen-section {
          padding: 44px 0 60px 0;
          border-bottom: none;
        }

        .section-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .section-num-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          flex-shrink: 0;
        }

        .section-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }

        .section-subtitle {
          font-size: 14.5px;
          color: #64748b;
          font-weight: 500;
        }

        .recommended-themes-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .themes-box-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
        }

        .themes-pills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .theme-recom-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        /* Filter bar */
        .deepen-filter-bar {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }

        .deepen-search-capsule {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 8px 16px;
          transition: all 0.2s ease;
        }

        .deepen-search-capsule:focus-within {
          background: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .deepen-search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          font-weight: 500;
        }

        .deepen-search-input::placeholder {
          color: #94a3b8;
          font-size: 13.5px;
        }

        .clear-search-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 13px;
        }

        .format-chips-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .format-chip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 5px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .format-chip:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .format-chip.active {
          background: #1e1b4b;
          color: #ffffff;
          border-color: #1e1b4b;
          box-shadow: 0 2px 8px rgba(30, 27, 75, 0.18);
        }

        .active-branch-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13px;
          color: #3730a3;
        }

        .clear-branch-filter-btn {
          background: #ffffff;
          border: 1px solid #c7d2fe;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #4338ca;
          cursor: pointer;
        }

        /* Results */
        .resources-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .resources-count-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .count-text {
          font-size: 13.5px;
          color: #64748b;
        }

        .resources-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .resources-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .resources-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
