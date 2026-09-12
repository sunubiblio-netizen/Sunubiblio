'use client';

import React, { useState } from 'react';
import { FloatCard } from './FloatCard';
import { POPULAR_TAGS } from '@/data/categories';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onTagClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Messaging & Universal Search */}
        <div className="hero-content">
          {/* Pill Badge */}
          <div className="badge-pill hero-badge">
            <span className="badge-dot" />
            <span>Votre réussite, notre priorité</span>
          </div>

          {/* Monumental Headline with Vibrant Gradient Accent */}
          <h1 className="hero-title">
            La bibliothèque numérique{' '}
            <span className="hero-title-accent">
              pour tous vos objectifs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            Accédez à des milliers de ressources éducatives, de concours,
            d'exercices et de documents pour réussir vos études et atteindre
            vos objectifs professionnels.
          </p>

          {/* Universal Search Capsule Form */}
          <form onSubmit={handleSubmit} className="hero-search-capsule">
            <div className="search-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Rechercher un livre, un cours, une annale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="hero-search-submit"
              aria-label="Lancer la recherche"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Popular Tags Row */}
          <div className="popular-tags-row">
            <span className="popular-label">Populaires :</span>
            <div className="tags-scroller">
              {POPULAR_TAGS.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    if (onTagClick) onTagClick(tag);
                  }}
                  className="popular-tag-chip"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Signature 3D Petal Composition with Ambient Glow and Floating Badges */}
        <div className="hero-visual-col">
          {/* Ambient Glow Orbs */}
          <div className="visual-glow-backdrop" />
          <div className="visual-glow-secondary" />

          {/* Floating Card Top Right */}
          <div className="float-wrapper top-right float-anim-slow">
            <FloatCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              }
              title="Des ressources pour tous les niveaux"
              subtitle="Du primaire au doctorat"
              accentColor="#4f46e5"
            />
          </div>

          {/* Floating Card Center Left */}
          <div className="float-wrapper center-left float-anim-mid">
            <FloatCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              }
              title="Préparez vos concours"
              subtitle="Sénégal et International"
              accentColor="#7c3aed"
            />
          </div>

          {/* Floating Card Bottom Right */}
          <div className="float-wrapper bottom-right float-anim-fast">
            <FloatCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" />
                </svg>
              }
              title="IA intégrée"
              subtitle="Des outils pour mieux apprendre"
              accentColor="#ec4899"
            />
          </div>

          {/* The Geometric 4-Petal Signature Graphic */}
          <div className="petal-composition">
            <svg
              className="petal-svg"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="petalTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="40%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>

                <linearGradient id="petalRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="60%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>

                <linearGradient id="petalBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>

                <linearGradient id="petalLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="50%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>

                <filter id="petalShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#4f46e5" floodOpacity="0.22" />
                </filter>
              </defs>

              <g filter="url(#petalShadow)" transform="translate(200, 200)">
                <path
                  d="M 0,-16 C 50,-120 120,-150 150,-120 C 180,-90 150,-20 60,0 Z"
                  fill="url(#petalTop)"
                />
                <path
                  d="M 16,0 C 120,50 150,120 120,150 C 90,180 20,150 0,60 Z"
                  fill="url(#petalRight)"
                />
                <path
                  d="M 0,16 C -50,120 -120,150 -150,120 C -180,90 -150,20 -60,0 Z"
                  fill="url(#petalBottom)"
                />
                <path
                  d="M -16,0 C -120,-50 -150,-120 -120,-150 C -90,-180 -20,-150 0,-60 Z"
                  fill="url(#petalLeft)"
                />
              </g>
            </svg>
          </div>

          {/* Mobile Showcase Cards (displayed on mobile below the visual) */}
          <div className="mobile-showcase-grid mobile-only">
            <div className="mobile-showcase-pill">
              <div className="mini-icon-box" style={{ color: '#4f46e5' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                </svg>
              </div>
              <div className="mini-texts">
                <span className="mini-title">Tous niveaux</span>
                <span className="mini-desc">Primaire au doctorat</span>
              </div>
            </div>
            <div className="mobile-showcase-pill">
              <div className="mini-icon-box" style={{ color: '#9333ea' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="mini-texts">
                <span className="mini-title">Préparation concours</span>
                <span className="mini-desc">Sénégal & International</span>
              </div>
            </div>
            <div className="mobile-showcase-pill">
              <div className="mini-icon-box" style={{ color: '#ec4899' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
                </svg>
              </div>
              <div className="mini-texts">
                <span className="mini-title">Tuteur IA</span>
                <span className="mini-desc">Outils & exercices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
