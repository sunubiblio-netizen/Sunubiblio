'use client';

import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="hero-aurora-section">
      {/* Background Aurora / Mesh Gradient matching user reference */}
      <div className="hero-aurora-backdrop" aria-hidden="true">
        <div className="aurora-orb orb-blue" />
        <div className="aurora-orb orb-violet" />
        <div className="aurora-orb orb-magenta" />
        <div className="aurora-orb orb-cyan" />
        <div className="aurora-overlay" />
      </div>

      <div className="container hero-center-container">
        {/* Title — Single line, crisp and appealing */}
        <h1 className="hero-aurora-title">
          Êtes-vous prêt à explorer le savoir ?
        </h1>

        {/* Subtitle — Single line, concise and appealing */}
        <p className="hero-aurora-subtitle">
          Des milliers d’ouvrages, cours et annales pour réussir à votre rythme.
        </p>

        {/* Exact Universal Search Capsule from user reference */}
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
            aria-label="Rechercher un livre, un cours, une annale"
          />
          <button
            type="submit"
            className="hero-search-submit"
            aria-label="Lancer la recherche"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .hero-aurora-section {
          position: relative;
          padding: 18px 0 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* Ambient Mesh / Aurora Gradient */
        .hero-aurora-backdrop {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .aurora-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.65;
          animation: orb-pulse 8s ease-in-out infinite alternate;
        }

        .orb-blue {
          width: 500px;
          height: 360px;
          top: -60px;
          left: 10%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.55) 0%, rgba(99, 102, 241, 0.25) 70%, transparent 100%);
        }

        .orb-violet {
          width: 480px;
          height: 380px;
          top: 10px;
          right: 15%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%);
          animation-delay: -2s;
        }

        .orb-magenta {
          width: 520px;
          height: 340px;
          bottom: -40px;
          right: 25%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(217, 70, 239, 0.2) 70%, transparent 100%);
          animation-delay: -4s;
        }

        .orb-cyan {
          width: 380px;
          height: 300px;
          bottom: -20px;
          left: 20%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, transparent 70%);
          animation-delay: -3s;
        }

        .aurora-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(255, 255, 255, 0.8) 100%
          );
        }

        @keyframes orb-pulse {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.08) translate(15px, -10px);
          }
          100% {
            transform: scale(0.96) translate(-10px, 12px);
          }
        }

        .hero-center-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 820px;
          padding: 0 16px;
        }

        .hero-aurora-title {
          font-size: clamp(22px, 3.2vw, 34px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin: 0 0 10px 0;
          white-space: nowrap;
        }

        .hero-aurora-subtitle {
          font-size: clamp(13px, 1.6vw, 15px);
          font-weight: 500;
          color: #475569;
          line-height: 1.4;
          margin: 0 0 20px 0;
          white-space: nowrap;
        }

        /* Search Capsule */
        .hero-search-capsule {
          width: 100%;
          max-width: 640px;
          display: flex;
          align-items: center;
          background: #ffffff;
          padding: 7px 8px 7px 20px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          box-shadow:
            0 16px 40px -10px rgba(79, 70, 229, 0.15),
            0 4px 14px -2px rgba(15, 23, 42, 0.05);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-search-capsule:focus-within {
          border-color: #6366f1;
          box-shadow:
            0 20px 48px -10px rgba(99, 102, 241, 0.25),
            0 0 0 3px rgba(99, 102, 241, 0.12);
          transform: translateY(-2px);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .hero-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          min-width: 0;
        }

        .hero-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .hero-search-submit {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        .hero-search-submit:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
        }

        @media (max-width: 640px) {
          .hero-aurora-section {
            padding: 44px 0 36px;
            min-height: auto;
          }

          .hero-aurora-title {
            font-size: 20px;
            white-space: nowrap;
            letter-spacing: -0.02em;
          }

          .hero-aurora-subtitle {
            font-size: 12.5px;
            white-space: nowrap;
            margin-bottom: 22px;
          }

          .hero-search-capsule {
            padding: 5px 6px 5px 14px;
          }

          .hero-search-input {
            font-size: 13.5px;
          }

          .hero-search-submit {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </section>
  );
};
