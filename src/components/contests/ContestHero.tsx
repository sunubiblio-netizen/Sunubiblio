'use client';

import React, { useState } from 'react';
import { POPULAR_CONTEST_TAGS } from '@/data/mockContests';

interface ContestHeroProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

export const ContestHero: React.FC<ContestHeroProps> = ({
  initialQuery = '',
  onSearch,
  onTagClick,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <section className="contest-hero-wrapper">
      {/* Background ambient lighting */}
      <div className="contest-hero-ambient" aria-hidden="true">
        <div className="ambient-spot spot-blue" />
        <div className="ambient-spot spot-purple" />
        <div className="ambient-spot spot-pink" />
      </div>

      <div className="container contest-hero-container">
        {/* Left Column: Messaging & Search */}
        <div className="contest-hero-left">
          {/* Pill Badge */}
          <div className="badge-pill contest-badge">
            <span className="badge-dot" />
            <span>Portail National de Préparation aux Concours</span>
          </div>

          {/* Monumental Title */}
          <h1 className="contest-hero-title">
            Préparez vos concours avec méthode.
            <span className="contest-hero-accent">
              Révisez. Entraînez-vous. Réussissez.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="contest-hero-subtitle">
            Retrouvez les programmes officiels, sujets d’annales, corrections détaillées,
            fascicules méthodologiques et QCM interactifs pour réussir vos concours au Sénégal.
          </p>

          {/* Search Capsule */}
          <form onSubmit={handleSubmit} className="contest-search-capsule">
            <div className="search-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="contest-search-input"
              placeholder="Rechercher un concours (ex: FASTEF, ENA, Police, Douanes, CREM)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher un concours"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('');
                  onSearch('');
                }}
                aria-label="Effacer la recherche"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className="btn-primary contest-search-btn">
              <span>Rechercher</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Popular Contests Tags */}
          <div className="popular-contests-row">
            <span className="popular-label">Concours populaires :</span>
            <div className="popular-tags-list">
              {POPULAR_CONTEST_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="popular-contest-chip"
                  onClick={() => {
                    setQuery(tag);
                    onTagClick(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Abstract Preparation Emblem (NO PERSON) */}
        <div className="contest-hero-right desktop-only">
          <div className="emblem-card-stack">
            {/* Top Badge Card: Trophy & Success */}
            <div className="floating-badge-box badge-trophy float-anim-slow">
              <div className="icon-circle trophy-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                  <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                </svg>
              </div>
              <div className="badge-texts">
                <span className="badge-strong">94% d’admission</span>
                <span className="badge-sub">avec notre méthode</span>
              </div>
            </div>

            {/* The Geometric 4-Petal Signature Graphic (Identique à la page d'accueil) */}
            <div className="petal-composition">
              <svg
                className="petal-svg"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="contestPetalTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="40%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>

                  <linearGradient id="contestPetalRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="60%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>

                  <linearGradient id="contestPetalBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#4338CA" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </linearGradient>

                  <linearGradient id="contestPetalLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="50%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>

                  <filter id="contestPetalShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#4f46e5" floodOpacity="0.22" />
                  </filter>
                </defs>

                <g filter="url(#contestPetalShadow)" transform="translate(200, 200)">
                  <path
                    d="M 0,-16 C 50,-120 120,-150 150,-120 C 180,-90 150,-20 60,0 Z"
                    fill="url(#contestPetalTop)"
                  />
                  <path
                    d="M 16,0 C 120,50 150,120 120,150 C 90,180 20,150 0,60 Z"
                    fill="url(#contestPetalRight)"
                  />
                  <path
                    d="M 0,16 C -50,120 -120,150 -150,120 C -180,90 -150,20 -60,0 Z"
                    fill="url(#contestPetalBottom)"
                  />
                  <path
                    d="M -16,0 C -120,-50 -150,-120 -120,-150 C -90,-180 -20,-150 0,-60 Z"
                    fill="url(#contestPetalLeft)"
                  />
                </g>
              </svg>
            </div>

            {/* Bottom Progress Card */}
            <div className="floating-badge-box badge-progress float-anim-fast">
              <div className="progress-texts">
                <div className="progress-top">
                  <span className="p-title">Programme validé</span>
                  <span className="p-percent">82%</span>
                </div>
                <div className="p-bar-bg">
                  <div className="p-bar-fill" style={{ width: '82%' }} />
                </div>
              </div>
              <div className="check-done-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contest-hero-wrapper {
          position: relative;
          padding: 56px 0 40px 0;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(250, 248, 255, 0.95) 0%, #faf8ff 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .contest-hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .ambient-spot {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.4;
        }

        .spot-blue {
          width: 420px;
          height: 420px;
          top: -140px;
          left: 5%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
        }

        .spot-purple {
          width: 480px;
          height: 480px;
          top: -80px;
          right: 5%;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%);
        }

        .spot-pink {
          width: 320px;
          height: 320px;
          bottom: -40px;
          left: 45%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
        }

        .contest-hero-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .contest-hero-left {
          flex: 1;
          max-width: 680px;
        }

        .contest-badge {
          margin-bottom: 18px;
        }

        .contest-hero-title {
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.16;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .contest-hero-accent {
          display: block;
          margin-top: 6px;
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 45%, #ec4899 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contest-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        /* Search Capsule */
        .contest-search-capsule {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          padding: 8px 10px 8px 18px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 36px -6px rgba(79, 70, 229, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all var(--transition-normal);
          margin-bottom: 24px;
        }

        .contest-search-capsule:focus-within {
          border-color: #6366f1;
          box-shadow: 0 16px 40px -4px rgba(99, 102, 241, 0.22), 0 0 0 3px rgba(99, 102, 241, 0.15);
          transform: translateY(-1px);
        }

        .search-icon-wrap {
          color: #6366f1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contest-search-input {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          min-width: 0;
        }

        .contest-search-input::placeholder {
          color: #94a3b8;
        }

        .search-clear-btn {
          color: #94a3b8;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-clear-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .contest-search-btn {
          padding: 10px 22px;
          font-size: 14px;
          flex-shrink: 0;
        }

        /* Popular tags */
        .popular-contests-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .popular-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #475569;
        }

        .popular-tags-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .popular-contest-chip {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          padding: 5px 13px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .popular-contest-chip:hover {
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
        }

        /* Right abstract graphic */
        .contest-hero-right {
          width: 380px;
          position: relative;
          display: flex;
          justify-content: center;
        }

        .emblem-card-stack {
          position: relative;
          width: 340px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-badge-box {
          position: absolute;
          z-index: 10;
          background: #ffffff;
          border-radius: 16px;
          padding: 10px 16px;
          box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.12);
          border: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .badge-trophy {
          top: 10px;
          right: -10px;
        }

        .icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trophy-circle {
          background: rgba(245, 158, 11, 0.12);
        }

        .badge-texts {
          display: flex;
          flex-direction: column;
        }

        .badge-strong {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .badge-sub {
          font-size: 11.5px;
          color: #64748b;
        }

        .badge-progress {
          bottom: 12px;
          left: -15px;
          width: 220px;
          justify-content: space-between;
        }

        .progress-texts {
          flex: 1;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #1e293b;
        }

        .p-percent {
          color: #10b981;
        }

        .p-bar-bg {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .p-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #3b82f6, #10b981);
        }

        .check-done-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 860px) {
          .contest-hero-wrapper {
            padding: 32px 0 24px 0;
          }

          .contest-search-btn span {
            display: none;
          }

          .contest-search-btn {
            padding: 10px 12px;
            border-radius: 50%;
          }
        }
      `}</style>
    </section>
  );
};
