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
      {/* Full-screen fluid ambient aurora mesh */}
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

        {/* Universal Search Capsule */}
        <form onSubmit={handleSubmit} className="hero-search-capsule">
          <div className="search-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .hero-aurora-section {
          position: relative;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* Ambient Mesh / Full-screen Fluid Aurora Gradient */
        .hero-aurora-backdrop {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .aurora-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(95px);
          opacity: 0.65;
          animation: orb-pulse 9s ease-in-out infinite alternate;
        }

        .orb-blue {
          width: 580px;
          height: 440px;
          top: 15%;
          left: 10%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.48) 0%, rgba(99, 102, 241, 0.22) 65%, transparent 100%);
        }

        .orb-violet {
          width: 560px;
          height: 460px;
          top: 18%;
          right: 10%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.44) 0%, rgba(139, 92, 246, 0.2) 65%, transparent 100%);
          animation-delay: -2.5s;
        }

        .orb-magenta {
          width: 520px;
          height: 400px;
          bottom: 12%;
          right: 22%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.38) 0%, rgba(217, 70, 239, 0.16) 70%, transparent 100%);
          animation-delay: -4.5s;
        }

        .orb-cyan {
          width: 480px;
          height: 380px;
          bottom: 15%;
          left: 18%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, transparent 70%);
          animation-delay: -3.5s;
        }

        .aurora-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(250, 248, 255, 0.15) 100%
          );
        }

        @keyframes orb-pulse {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.1) translate(18px, -12px);
          }
          100% {
            transform: scale(0.95) translate(-12px, 14px);
          }
        }

        .hero-center-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 860px;
          padding: 0 16px;
          width: 100%;
        }

        .hero-aurora-title {
          font-size: clamp(26px, 3.8vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin: 0 0 12px 0;
          white-space: nowrap;
        }

        .hero-aurora-subtitle {
          font-size: clamp(14px, 1.8vw, 17px);
          font-weight: 500;
          color: #475569;
          line-height: 1.4;
          margin: 0 0 24px 0;
          white-space: nowrap;
        }

        /* Search Capsule */
        .hero-search-capsule {
          width: 100%;
          max-width: 660px;
          display: flex;
          align-items: center;
          background: #ffffff;
          padding: 8px 10px 8px 22px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          box-shadow:
            0 20px 48px -10px rgba(79, 70, 229, 0.16),
            0 6px 18px -2px rgba(15, 23, 42, 0.05);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-search-capsule:focus-within {
          border-color: #6366f1;
          box-shadow:
            0 24px 54px -10px rgba(99, 102, 241, 0.28),
            0 0 0 4px rgba(99, 102, 241, 0.12);
          transform: translateY(-2px);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 14px;
          flex-shrink: 0;
        }

        .hero-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 16px;
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
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }

        .hero-search-submit:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
        }

        @media (max-width: 640px) {
          .hero-aurora-section {
            padding: 24px 0;
          }

          .hero-aurora-title {
            font-size: 22px;
            white-space: normal;
            letter-spacing: -0.02em;
          }

          .hero-aurora-subtitle {
            font-size: 13px;
            white-space: normal;
            margin-bottom: 24px;
          }

          .hero-search-capsule {
            padding: 6px 8px 6px 16px;
          }

          .hero-search-input {
            font-size: 14px;
          }

          .hero-search-submit {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
};
