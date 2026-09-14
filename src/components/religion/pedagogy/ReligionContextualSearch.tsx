'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ReligionResource } from '@/types/religion';

interface ReligionContextualSearchProps {
  traditionSlug: string;
  traditionTitle: string;
  activeBranchTitle?: string | null;
  activeBranchId?: string | null;
  onSelectResource: (resource: ReligionResource) => void;
  onSelectBranch: (branchId: string) => void;
  onNavigateToSection: (sectionId: string) => void;
  onApplyGlobalSearch: (query: string) => void;
}

export const ReligionContextualSearch: React.FC<ReligionContextualSearchProps> = ({
  traditionSlug,
  traditionTitle,
  activeBranchTitle,
  activeBranchId,
  onSelectResource,
  onSelectBranch,
  onNavigateToSection,
  onApplyGlobalSearch,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    total: number;
    resources: ReligionResource[];
    matchingSacredTexts: { name: string; subtitle: string }[];
    matchingBranches: { id: string; title: string; subtitle: string }[];
    suggestions: string[];
  }>({
    total: 0,
    resources: [],
    matchingSacredTexts: [],
    matchingBranches: [],
    suggestions: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions spécifiques par tradition
  const TRADITION_SUGGESTIONS: Record<string, string[]> = {
    islam: [
      'Coran',
      'Khassaid',
      'Tafsir',
      'Hadith',
      'Mouridisme',
      'Touba',
      'Ahmadou Bamba',
      'Tivaouane',
      'Niassène',
      'Layène',
    ],
    christianisme: [
      'Bible',
      'Évangile',
      'Ancien Testament',
      'Nouveau Testament',
      'Jésus-Christ',
      'Saint Augustin',
      'Popenguine',
    ],
    judaisme: ['Torah', 'Tanakh', 'Talmud', 'Moïse', 'Maïmonide', 'Shabbat'],
    hindouisme: ['Vedas', 'Bhagavad-Gita', 'Upanishads', 'Yoga', 'Dharma', 'Krishna'],
    bouddhisme: ['Dhammapada', 'Bouddha', 'Méditation', 'Soutras', 'Quatre Nobles Vérités'],
    sikhisme: ['Guru Granth Sahib', 'Guru Nanak', 'Langar', 'Seva', 'Khalsa'],
    taoisme: ['Daodejing', 'Lao Tseu', 'Tao', 'Wu Wei', 'Zhuangzi'],
    'spiritualites-africaines': [
      'Cosmogonies',
      'Tradition orale',
      'Ancêtres',
      'Force vitale',
      'Amadou Hampâté Bâ',
      'Cheikh Anta Diop',
    ],
  };

  const suggestionChips = TRADITION_SUGGESTIONS[traditionSlug] || [
    'Textes',
    'Enseignements',
    'Histoire',
    'Figures',
  ];

  // Placeholder dynamique
  const searchPlaceholder = activeBranchTitle
    ? `Rechercher dans ${activeBranchTitle}…`
    : `Rechercher dans ${traditionTitle}…`;

  // Fermer le menu si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Déclencher la recherche serveur avec debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({
        total: 0,
        resources: [],
        matchingSacredTexts: [],
        matchingBranches: [],
        suggestions: [],
      });
      setIsLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const branchParam = activeBranchId ? `&branch=${encodeURIComponent(activeBranchId)}` : '';
        const res = await fetch(
          `/api/religion/search?tradition=${encodeURIComponent(
            traditionSlug
          )}${branchParam}&q=${encodeURIComponent(query.trim())}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsOpen(true);
        }
      } catch {
        // En cas d'erreur silencieuse
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, traditionSlug, activeBranchId]);

  const handleChipClick = (term: string) => {
    setQuery(term);
    onApplyGlobalSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      onApplyGlobalSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const hasAnyResult =
    searchResults.matchingSacredTexts.length > 0 ||
    searchResults.matchingBranches.length > 0 ||
    searchResults.resources.length > 0;

  return (
    <div className="religion-search-root" ref={wrapperRef}>
      {/* Barre de recherche principale */}
      <div className="search-bar-capsule">
        <div className="search-icon-box">
          {isLoading ? (
            <div className="search-spinner" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </div>

        <input
          type="text"
          className="search-input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label={searchPlaceholder}
        />

        {query && (
          <button
            type="button"
            className="clear-button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          className="search-action-btn"
          onClick={() => {
            setIsOpen(false);
            onApplyGlobalSearch(query);
          }}
        >
          <span>Rechercher</span>
        </button>
      </div>

      {/* Puces de suggestions rapides contextuelles */}
      <div className="suggestions-row">
        <span className="suggestions-label">Suggestions :</span>
        <div className="suggestions-scroller">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="suggestion-pill"
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Menu déroulant des résultats instantanés (Live Dropdown) */}
      {isOpen && query.trim().length > 0 && (
        <div className="live-dropdown-panel">
          {hasAnyResult ? (
            <div className="dropdown-sections">
              {/* 1. Textes Sacrés Associés */}
              {searchResults.matchingSacredTexts.length > 0 && (
                <div className="dropdown-section">
                  <div className="section-mini-header">
                    <span className="section-mini-icon">📖</span>
                    <span>Textes Sacrés Fondamentaux</span>
                  </div>
                  <div className="section-items-list">
                    {searchResults.matchingSacredTexts.map((text, idx) => (
                      <div
                        key={idx}
                        className="dropdown-item sacred-text-item"
                        onClick={() => {
                          setIsOpen(false);
                          onNavigateToSection('textes');
                        }}
                      >
                        <div className="item-main">
                          <span className="item-title">{text.name}</span>
                          <span className="item-subtitle">{text.subtitle}</span>
                        </div>
                        <span className="item-action-badge">Consulter les textes →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Courants / Confréries */}
              {searchResults.matchingBranches.length > 0 && (
                <div className="dropdown-section">
                  <div className="section-mini-header">
                    <span className="section-mini-icon">🌿</span>
                    <span>Courants & Confréries</span>
                  </div>
                  <div className="section-items-list">
                    {searchResults.matchingBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="dropdown-item branch-item"
                        onClick={() => {
                          setIsOpen(false);
                          onSelectBranch(branch.id);
                        }}
                      >
                        <div className="item-main">
                          <span className="item-title">{branch.title}</span>
                          <span className="item-subtitle">{branch.subtitle}</span>
                        </div>
                        <span className="item-action-badge">Filtrer ce courant →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Livres & Documents */}
              {searchResults.resources.length > 0 && (
                <div className="dropdown-section">
                  <div className="section-mini-header">
                    <span className="section-mini-icon">📄</span>
                    <span>Ouvrages & Documents ({searchResults.resources.length})</span>
                  </div>
                  <div className="section-items-list">
                    {searchResults.resources.map((res) => (
                      <div
                        key={res.id}
                        className="dropdown-item resource-item"
                        onClick={() => {
                          setIsOpen(false);
                          onSelectResource(res);
                        }}
                      >
                        <div className="item-main">
                          <span className="item-title">{res.titre}</span>
                          <span className="item-author">
                            {res.auteur} • <span className="item-tag">{res.contentType}</span>
                          </span>
                        </div>
                        <span className="item-plan-badge">
                          {res.requiredPlan === 'gratuit' ? 'Gratuit' : 'Accès Membre'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="dropdown-footer">
                <button
                  type="button"
                  className="dropdown-view-all-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onApplyGlobalSearch(query);
                  }}
                >
                  <span>
                    Explorer tous les résultats pour « {query} » dans la bibliothèque
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="dropdown-empty-state">
              <p className="empty-text">
                Aucun résultat trouvé dans <strong>{traditionTitle}</strong> pour « {query} ».
              </p>
              <span className="empty-hint">
                Essayez un autre mot-clé ou consultez les suggestions ci-dessus.
              </span>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .religion-search-root {
          position: relative;
          width: 100%;
          max-width: 860px;
          margin: 0 auto 28px auto;
          z-index: 20;
        }

        .search-bar-capsule {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 6px 8px 6px 18px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
          transition: all 0.2s ease;
        }

        .search-bar-capsule:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 6px 24px -2px rgba(79, 70, 229, 0.15);
        }

        .search-icon-box {
          display: flex;
          align-items: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .search-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #94a3b8;
          font-size: 14.5px;
        }

        .clear-button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 50%;
          transition: color 0.15s;
        }

        .clear-button:hover {
          color: #0f172a;
        }

        .search-action-btn {
          background: #1e1b4b;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 10px 22px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(30, 27, 75, 0.15);
        }

        .search-action-btn:hover {
          background: #312e81;
          transform: translateY(-1px);
        }

        /* Suggestions */
        .suggestions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding: 0 4px;
        }

        .suggestions-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          white-space: nowrap;
        }

        .suggestions-scroller {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .suggestions-scroller::-webkit-scrollbar {
          display: none;
        }

        .suggestion-pill {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .suggestion-pill:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        /* Live Dropdown Panel */
        .live-dropdown-panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.14);
          overflow: hidden;
          z-index: 50;
        }

        .dropdown-sections {
          display: flex;
          flex-direction: column;
        }

        .dropdown-section {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .dropdown-section:last-child {
          border-bottom: none;
        }

        .section-mini-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 8px;
        }

        .section-items-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .item-main {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .item-subtitle,
        .item-author {
          font-size: 12px;
          color: #64748b;
        }

        .item-tag {
          text-transform: capitalize;
          color: #4f46e5;
          font-weight: 600;
        }

        .item-action-badge {
          font-size: 11.5px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .item-plan-badge {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .dropdown-footer {
          background: #f8fafc;
          padding: 10px 16px;
          border-top: 1px solid #f1f5f9;
        }

        .dropdown-view-all-btn {
          width: 100%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #4f46e5;
          cursor: pointer;
          padding: 6px;
          transition: color 0.15s;
        }

        .dropdown-view-all-btn:hover {
          color: #312e81;
        }

        .dropdown-empty-state {
          padding: 28px 20px;
          text-align: center;
        }

        .empty-text {
          font-size: 14px;
          color: #334155;
          margin-bottom: 4px;
        }

        .empty-hint {
          font-size: 12px;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .search-bar-capsule {
            padding: 5px 6px 5px 14px;
          }

          .search-input {
            font-size: 13.5px;
          }

          .search-action-btn {
            padding: 8px 14px;
            font-size: 12.5px;
          }
        }
      `}</style>
    </div>
  );
};
