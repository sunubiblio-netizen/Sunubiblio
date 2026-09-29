'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CommunityHeaderProps {
  onCreateCommunity: () => void;
  onCreateGroup: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  onCreateCommunity,
  onCreateGroup,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu lors d'un clic extérieur
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="communaute-hero-header">
      <div className="communaute-hero-left">
        <div className="communaute-hero-icon-box" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="communaute-hero-titles">
          <div className="communaute-title-row">
            <h1>Communauté</h1>
            <span className="communaute-hero-badge">Entraide & Savoirs</span>
          </div>
          <p className="communaute-hero-desc">Échangez, posez vos questions et révisez ensemble.</p>
        </div>
      </div>

      <div className="communaute-hero-actions" ref={menuRef}>
        <div className="communaute-create-menu-wrap">
          <button
            type="button"
            className="btn-create-community-primary"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <svg className="create-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="create-btn-text">Créer</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`menu-chevron ${isMenuOpen ? 'rotated' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="communaute-create-dropdown" role="menu">
              <button
                type="button"
                className="create-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onCreateGroup();
                }}
              >
                <div className="create-item-icon group-icon">👥</div>
                <div className="create-item-text">
                  <strong>Créer un groupe d’études</strong>
                  <span>Pour réviser ensemble par matière ou niveau</span>
                </div>
              </button>

              <button
                type="button"
                className="create-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onCreateCommunity();
                }}
              >
                <div className="create-item-icon comm-icon">🏛️</div>
                <div className="create-item-text">
                  <strong>Créer une communauté</strong>
                  <span>Pour une faculté, école ou grand domaine</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
