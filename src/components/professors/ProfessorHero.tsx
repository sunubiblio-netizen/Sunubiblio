'use client';

import React from 'react';

interface ProfessorHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenBecomeTeacher: () => void;
  totalTeachersCount: number;
}

export const ProfessorHero: React.FC<ProfessorHeroProps> = ({
  searchQuery,
  onSearchChange,
  onOpenBecomeTeacher,
  totalTeachersCount,
}) => {
  const quickTags = [
    'Mathématiques',
    'Physique-Chimie',
    'Concours FASTEF',
    'Philosophie',
    'Baccalauréat',
    'Informatique',
    'Anglais',
    'Côte d’Ivoire',
    'France',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultsElem = document.getElementById('professeurs-catalogue');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="professors-hero-section">
      <div className="container professors-hero-container">
        {/* Badge d'en-tête */}
        <div className="professors-hero-badge-wrap">
          <span className="professors-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Enseignants certifiés & Formateurs qualifiés • Sénégal & International
          </span>
        </div>

        {/* Titre & Sous-titre officiels */}
        <h1 className="professors-hero-title">
          Trouver un professeur
        </h1>
        <p className="professors-hero-subtitle">
          Trouvez un enseignant ou formateur selon votre matière, votre niveau et votre mode d’apprentissage.
        </p>

        {/* Grande barre de recherche */}
        <div className="professors-search-box-wrap">
          <form className="professors-search-box" onSubmit={handleSearchSubmit} role="search">
            <div className="professors-search-leading-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="professors-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher une matière, un professeur, une ville ou un pays..."
              aria-label="Rechercher une matière, un professeur, une ville ou un pays"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                aria-label="Effacer la recherche"
                title="Effacer le texte"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="professors-search-submit-btn"
              aria-label="Lancer la recherche"
            >
              <span>Rechercher</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>

        {/* Suggestions rapides & CTA Enseignant */}
        <div className="professors-hero-footer">
          <div className="quick-tags-group">
            <span className="quick-tags-label">Recherches fréquentes :</span>
            <div className="quick-tags-list">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`quick-tag-chip ${searchQuery.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                  onClick={() => onSearchChange(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="become-teacher-link-btn"
            onClick={onOpenBecomeTeacher}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Devenir enseignant / formateur</span>
          </button>
        </div>
      </div>
    </section>
  );
};
