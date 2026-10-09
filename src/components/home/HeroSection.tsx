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
    }, 450);
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
      {/* Full-screen fluid ambient chromatic mesh (Grabient Inspiration) */}
      <div className="hero-aurora-backdrop" aria-hidden="true">
        <div className="grabient-orb orb-coral-heart" />
        <div className="grabient-orb orb-lavender-wave" />
        <div className="grabient-orb orb-sun-glow" />
        <div className="grabient-orb orb-powder-sky" />
        <div className="grabient-orb orb-lemon-corner" />
        <div className="grabient-orb orb-blush-corner" />
        <div className="grabient-overlay" />
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
            {/* 3D Transparent Crystal Glass Sphere */}
            <span className="orb-glass-body">
              {/* Specular glare & lighting reflections */}
              <span className="orb-specular-glare" />
              <span className="orb-caustic-ring" />
              <span className="orb-sparkle orb-sparkle-1" />
              <span className="orb-sparkle orb-sparkle-2" />
              <span className="orb-sparkle orb-sparkle-3" />
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

        /* Ambient Mesh / Full-screen Fluid Grabient Chromatic Watercolor (Coral, Lavender, Butter Sun) */
        .hero-aurora-backdrop {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #ffffff;
        }

        .grabient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(85px);
          animation: grabient-drift 11s ease-in-out infinite alternate;
          will-change: transform;
        }

        /* 1. Core Sunset Coral / Peach Rose (Center-Right heart of Grabient) */
        .orb-coral-heart {
          width: 620px;
          height: 480px;
          top: 16%;
          right: 18%;
          background: radial-gradient(circle, rgba(251, 113, 133, 0.82) 0%, rgba(244, 63, 94, 0.58) 45%, rgba(251, 146, 60, 0.35) 75%, transparent 90%);
          opacity: 0.78;
        }

        /* 2. Dreamy Lavender / Periwinkle Lilac Wave (Top-Center / Left) */
        .orb-lavender-wave {
          width: 680px;
          height: 460px;
          top: 4%;
          left: 20%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.78) 0%, rgba(129, 140, 248, 0.52) 45%, rgba(192, 132, 252, 0.3) 75%, transparent 90%);
          opacity: 0.75;
          animation-delay: -3s;
        }

        /* 3. Luminous Butter Yellow / Sunlight Glow (Bottom-Center / Right) */
        .orb-sun-glow {
          width: 660px;
          height: 460px;
          bottom: 4%;
          left: 28%;
          background: radial-gradient(circle, rgba(253, 224, 71, 0.82) 0%, rgba(250, 204, 21, 0.55) 45%, rgba(254, 240, 138, 0.3) 75%, transparent 90%);
          opacity: 0.78;
          animation-delay: -6s;
        }

        /* 4. Ethereal Powder Blue (Mid-Left cloud) */
        .orb-powder-sky {
          width: 480px;
          height: 420px;
          top: 20%;
          left: 4%;
          background: radial-gradient(circle, rgba(186, 230, 253, 0.82) 0%, rgba(147, 197, 253, 0.52) 50%, transparent 80%);
          opacity: 0.68;
          animation-delay: -4s;
        }

        /* 5. Delicate Lemon Corner (Top-Right) */
        .orb-lemon-corner {
          width: 440px;
          height: 380px;
          top: 2%;
          right: 4%;
          background: radial-gradient(circle, rgba(254, 240, 138, 0.85) 0%, rgba(253, 230, 138, 0.45) 55%, transparent 80%);
          opacity: 0.68;
          animation-delay: -2s;
        }

        /* 6. Soft Blush Blossom (Bottom-Left) */
        .orb-blush-corner {
          width: 420px;
          height: 380px;
          bottom: 6%;
          left: 4%;
          background: radial-gradient(circle, rgba(254, 205, 211, 0.85) 0%, rgba(251, 207, 232, 0.45) 55%, transparent 80%);
          opacity: 0.65;
          animation-delay: -5s;
        }

        /* Grabient Soft Edge Diffuser */
        .grabient-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 85% 75% at 50% 50%,
            transparent 0%,
            rgba(255, 255, 255, 0.12) 60%,
            rgba(255, 255, 255, 0.45) 100%
          );
        }

        @keyframes grabient-drift {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(14px, -12px) scale(1.06);
          }
          100% {
            transform: translate(-12px, 10px) scale(0.96);
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
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 20px 48px -10px rgba(244, 63, 94, 0.12),
            0 8px 24px -4px rgba(129, 140, 248, 0.12),
            0 2px 6px rgba(15, 23, 42, 0.03);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-search-capsule:focus-within {
          border-color: #fb7185;
          box-shadow:
            0 24px 54px -10px rgba(251, 113, 133, 0.25),
            0 0 0 4px rgba(251, 113, 133, 0.12);
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
          width: 36px;
          height: 36px;
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
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          perspective: 600px;
        }

        .hero-orb-button:hover {
          transform: scale(1.1);
        }

        .hero-orb-button:active {
          transform: scale(0.94);
        }

        /* Volumetric Highly-Transparent Crystal Glass Sphere Body */
        .orb-glass-body {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          /* Subtle prismatic crystal with blush & lavender tint */
          background: radial-gradient(
            circle at 30% 24%,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(254, 205, 211, 0.28) 25%,
            rgba(224, 231, 255, 0.18) 55%,
            rgba(254, 240, 138, 0.16) 82%,
            rgba(148, 163, 184, 0.22) 100%
          );
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 3px 10px rgba(244, 63, 94, 0.1),
            0 1px 3px rgba(129, 140, 248, 0.08),
            inset -2px -3px 6px rgba(148, 163, 184, 0.2),
            inset 1.5px 2px 4px rgba(255, 255, 255, 0.95);
          overflow: hidden;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .hero-orb-button:hover .orb-glass-body {
          border-color: rgba(251, 113, 133, 0.7);
          box-shadow:
            0 5px 14px rgba(251, 113, 133, 0.2),
            0 0 12px rgba(167, 139, 250, 0.25),
            inset -2px -3px 6px rgba(148, 163, 184, 0.25),
            inset 1.5px 2px 4px rgba(255, 255, 255, 1);
        }

        /* Curved Specular Glare on top-left */
        .orb-specular-glare {
          position: absolute;
          top: 2px;
          left: 4px;
          width: 16px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.65) 45%, rgba(241, 245, 249, 0.15) 75%, transparent 100%);
          transform: rotate(-32deg);
          pointer-events: none;
          z-index: 2;
        }

        /* Bottom Caustic Reflection */
        .orb-caustic-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 72% 82%, rgba(255, 255, 255, 0.45) 0%, transparent 45%);
          pointer-events: none;
          z-index: 1;
        }

        /* Celestial sparkles inside transparent crystal */
        .orb-sparkle {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          pointer-events: none;
          z-index: 2;
          box-shadow: 0 0 2.5px 1px rgba(255, 255, 255, 0.85);
        }

        .orb-sparkle-1 {
          width: 2px;
          height: 2px;
          top: 58%;
          right: 24%;
          opacity: 0.8;
        }

        .orb-sparkle-2 {
          width: 1.4px;
          height: 1.4px;
          top: 72%;
          right: 32%;
          opacity: 0.65;
        }

        .orb-sparkle-3 {
          width: 1.8px;
          height: 1.8px;
          top: 64%;
          right: 17%;
          opacity: 0.75;
        }

        /* Fast 3D Rotation on click without color change */
        .hero-orb-button.is-spinning .orb-glass-body {
          animation: orb-spin-pure 0.45s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }

        @keyframes orb-spin-pure {
          0% {
            transform: rotate(0deg) scale(0.95);
          }
          45% {
            transform: rotate(190deg) scale(1.08);
          }
          80% {
            transform: rotate(320deg) scale(1.02);
          }
          100% {
            transform: rotate(360deg) scale(1);
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
            width: 32px;
            height: 32px;
          }

          .orb-specular-glare {
            width: 14px;
            height: 8px;
            top: 2px;
            left: 3.5px;
          }
        }
      `}</style>
    </section>
  );
};
