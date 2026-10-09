'use client';

import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const triggerOrbSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 950);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerOrbSpin();
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
        {/* Title — Ultra short, cursive Courgette styling matching reference */}
        <h1 className="hero-aurora-title">
          Explorez le savoir
        </h1>

        {/* Subtitle — Short, concise, responsive */}
        <p className="hero-aurora-subtitle">
          Des milliers d’ouvrages, cours et annales
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
            className={`hero-orb-button ${isSpinning ? 'is-spinning' : ''}`}
            onClick={triggerOrbSpin}
            aria-label="Lancer la recherche"
          >
            {/* 3D Glass Sphere Body */}
            <span className="orb-glass-body">
              {/* Specular glare & lighting reflections */}
              <span className="orb-specular-glare" />
              <span className="orb-caustic-ring" />
              <span className="orb-sparkle orb-sparkle-1" />
              <span className="orb-sparkle orb-sparkle-2" />
              <span className="orb-sparkle orb-sparkle-3" />

              {/* Centered fine arrow */}
              <span className="orb-arrow-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </span>
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
          top: 8%;
          left: 10%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.48) 0%, rgba(99, 102, 241, 0.22) 65%, transparent 100%);
        }

        .orb-violet {
          width: 560px;
          height: 460px;
          top: 10%;
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
          font-family: 'Courgette', cursive, sans-serif;
          font-size: clamp(32px, 4.4vw, 52px);
          font-weight: 400;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin: 0 0 10px 0;
          white-space: nowrap;
          text-align: center;
        }

        .hero-aurora-subtitle {
          font-size: clamp(13.5px, 1.5vw, 16px);
          font-weight: 500;
          color: #475569;
          line-height: 1.4;
          margin: 0 0 24px 0;
          white-space: nowrap;
          text-align: center;
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

        /* 3D Glass Sphere Orb Button */
        .hero-orb-button {
          position: relative;
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          border-radius: 50%;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          perspective: 600px;
        }

        .hero-orb-button:hover {
          transform: scale(1.08);
        }

        .hero-orb-button:active {
          transform: scale(0.96);
        }

        /* Volumetric Glass Sphere Body with Specular Highlights & Depth */
        .orb-glass-body {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Rich 3D gradient matching Sunubiblio royal indigo/violet palette */
          background: radial-gradient(circle at 30% 24%, #a855f7 0%, #7c3aed 28%, #4f46e5 58%, #1e1b4b 86%, #0b0f19 100%);
          box-shadow:
            0 8px 22px -2px rgba(79, 70, 229, 0.5),
            0 2px 6px rgba(15, 23, 42, 0.2),
            inset -3px -5px 10px rgba(15, 23, 42, 0.75),
            inset 2px 3px 6px rgba(255, 255, 255, 0.6);
          overflow: hidden;
          transition: box-shadow 0.3s ease, filter 0.3s ease;
        }

        .hero-orb-button:hover .orb-glass-body {
          box-shadow:
            0 12px 28px -2px rgba(99, 102, 241, 0.65),
            0 0 20px rgba(168, 85, 247, 0.45),
            inset -3px -5px 10px rgba(15, 23, 42, 0.75),
            inset 2px 3px 6px rgba(255, 255, 255, 0.8);
        }

        /* Curved Specular Glare on top-left (inspired by crystal orb reflection) */
        .orb-specular-glare {
          position: absolute;
          top: 3px;
          left: 6px;
          width: 20px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.65) 45%, rgba(224, 231, 255, 0.15) 75%, transparent 100%);
          transform: rotate(-32deg);
          pointer-events: none;
          z-index: 2;
        }

        /* Bottom Caustic Reflection */
        .orb-caustic-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 72% 82%, rgba(192, 132, 252, 0.45) 0%, transparent 45%);
          pointer-events: none;
          z-index: 1;
        }

        /* Celestial sparkles inside glass */
        .orb-sparkle {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          pointer-events: none;
          z-index: 2;
          box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.85);
        }

        .orb-sparkle-1 {
          width: 2.5px;
          height: 2.5px;
          top: 58%;
          right: 24%;
          opacity: 0.9;
        }

        .orb-sparkle-2 {
          width: 1.6px;
          height: 1.6px;
          top: 72%;
          right: 32%;
          opacity: 0.75;
        }

        .orb-sparkle-3 {
          width: 2px;
          height: 2px;
          top: 64%;
          right: 17%;
          opacity: 0.8;
        }

        /* Stylized White Arrow inside */
        .orb-arrow-icon {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
          transition: transform 0.2s ease;
        }

        /* Spinning & Color morphing on click */
        .hero-orb-button.is-spinning .orb-glass-body {
          animation: orb-spin-chroma 0.95s cubic-bezier(0.34, 1.25, 0.64, 1) forwards;
        }

        @keyframes orb-spin-chroma {
          0% {
            transform: rotate(0deg) scale(0.96);
            filter: hue-rotate(0deg) brightness(1);
            box-shadow:
              0 8px 22px -2px rgba(79, 70, 229, 0.5),
              0 2px 6px rgba(15, 23, 42, 0.2),
              inset -3px -5px 10px rgba(15, 23, 42, 0.75),
              inset 2px 3px 6px rgba(255, 255, 255, 0.6);
          }
          35% {
            transform: rotate(180deg) scale(1.12);
            filter: hue-rotate(120deg) brightness(1.25);
            box-shadow:
              0 14px 32px 0 rgba(16, 185, 129, 0.55),
              0 0 24px rgba(6, 182, 212, 0.4),
              inset -3px -5px 10px rgba(15, 23, 42, 0.75),
              inset 2px 3px 6px rgba(255, 255, 255, 0.85);
          }
          70% {
            transform: rotate(310deg) scale(1.06);
            filter: hue-rotate(240deg) brightness(1.2);
            box-shadow:
              0 12px 28px 0 rgba(236, 72, 153, 0.5),
              0 0 20px rgba(168, 85, 247, 0.4),
              inset -3px -5px 10px rgba(15, 23, 42, 0.75),
              inset 2px 3px 6px rgba(255, 255, 255, 0.8);
          }
          100% {
            transform: rotate(360deg) scale(1);
            filter: hue-rotate(360deg) brightness(1);
            box-shadow:
              0 8px 22px -2px rgba(79, 70, 229, 0.5),
              0 2px 6px rgba(15, 23, 42, 0.2),
              inset -3px -5px 10px rgba(15, 23, 42, 0.75),
              inset 2px 3px 6px rgba(255, 255, 255, 0.6);
          }
        }

        @media (max-width: 640px) {
          .hero-aurora-section {
            padding: 16px 0;
          }

          .hero-aurora-title {
            font-size: clamp(24px, 7vw, 32px);
            white-space: nowrap;
            letter-spacing: -0.01em;
            margin-bottom: 8px;
          }

          .hero-aurora-subtitle {
            font-size: 13px;
            white-space: nowrap;
            margin-bottom: 20px;
          }

          .hero-search-capsule {
            padding: 6px 8px 6px 16px;
          }

          .hero-search-input {
            font-size: 14px;
          }

          .hero-orb-button {
            width: 40px;
            height: 40px;
          }

          .orb-specular-glare {
            width: 17px;
            height: 10px;
            top: 2.5px;
            left: 5px;
          }
        }
      `}</style>
    </section>
  );
};
