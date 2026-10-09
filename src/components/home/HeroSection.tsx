'use client';

import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

const DESCRIPTION_PHRASES = [
  'Première bibliothèque numérique du Sénégal',
  'Des milliers d’ouvrages, cours et annales',
  'Apprenez, révisez et progressez chaque jour',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect on the description / subtitle
  useEffect(() => {
    const currentPhrase = DESCRIPTION_PHRASES[phraseIndex % DESCRIPTION_PHRASES.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentPhrase) {
      // Pause at full phrase for comfortable reading
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2100);
    } else if (isDeleting && displayText === '') {
      // Pause when empty before next phrase
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % DESCRIPTION_PHRASES.length);
      }, 400);
    } else {
      // Typing or deleting speed
      const speed = isDeleting ? 30 : 60;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.substring(0, displayText.length - 1)
          : currentPhrase.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

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
      {/* Full-screen fluid ambient mesh (Bleu Éclatant, Jaune Très Clair & Blanc) */}
      <div className="hero-aurora-backdrop" aria-hidden="true">
        <div className="aurora-orb orb-blue-left" />
        <div className="aurora-orb orb-blue-right" />
        <div className="aurora-orb orb-soft-yellow-bottom" />
        <div className="aurora-orb orb-pale-yellow-accent" />
        <div className="aurora-center-spotlight" />
      </div>

      <div className="container hero-center-container">
        {/* Title — Ultra short, cursive Courgette styling matching reference */}
        <h1 className="hero-aurora-title">
          Explorez le savoir
        </h1>

        {/* Subtitle / Description (Titre 2) — Animated Typewriter effect */}
        <p className="hero-aurora-subtitle">
          <span>{displayText}</span>
          <span className="typewriter-cursor" aria-hidden="true">|</span>
        </p>

        {/* Universal Search Capsule with clean static placeholder */}
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
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher"
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

        /* Ambient Mesh / Full-screen Fluid Blue Wings, Soft Pale Yellow & Pure White (Style Image 2) */
        .hero-aurora-backdrop {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #ffffff;
        }

        .aurora-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(85px);
          animation: orb-drift 10s ease-in-out infinite alternate;
          will-change: transform;
        }

        /* Top-Left: Intense Vibrant Royal Blue Wing (Image 2 style) */
        .orb-blue-left {
          width: 720px;
          height: 540px;
          top: -8%;
          left: -8%;
          background: radial-gradient(circle at 20% 20%, rgba(29, 78, 216, 0.85) 0%, rgba(37, 99, 235, 0.62) 35%, rgba(59, 130, 246, 0.35) 60%, transparent 85%);
          opacity: 0.82;
        }

        /* Top-Right: Intense Vibrant Royal Blue Wing (Image 2 style) */
        .orb-blue-right {
          width: 700px;
          height: 520px;
          top: -6%;
          right: -8%;
          background: radial-gradient(circle at 80% 20%, rgba(29, 78, 216, 0.82) 0%, rgba(37, 99, 235, 0.58) 35%, rgba(96, 165, 250, 0.32) 60%, transparent 85%);
          opacity: 0.8;
          animation-delay: -3s;
        }

        /* Bottom: Soft Sunny Pale Yellow Sweep (remplaçant le magenta de l'image 2) */
        .orb-soft-yellow-bottom {
          width: 105vw;
          height: 520px;
          bottom: -12%;
          left: -2.5vw;
          background: radial-gradient(ellipse 85% 70% at 50% 100%, rgba(254, 240, 138, 0.75) 0%, rgba(254, 249, 195, 0.5) 35%, rgba(255, 255, 255, 0.3) 65%, transparent 95%);
          opacity: 0.78;
          animation-delay: -5s;
        }

        /* Subtle Pale Yellow / Warm Light Accent */
        .orb-pale-yellow-accent {
          width: 520px;
          height: 420px;
          bottom: 6%;
          right: 10%;
          background: radial-gradient(circle, rgba(253, 224, 71, 0.45) 0%, rgba(254, 240, 138, 0.25) 50%, transparent 75%);
          opacity: 0.7;
          animation-delay: -2s;
        }

        /* Pure White Luminous Spotlight Center (Exactement comme Image 2 Lovable sous le texte) */
        .aurora-center-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 70% 60% at 50% 36%,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.82) 35%,
            rgba(255, 255, 255, 0.4) 65%,
            transparent 85%
          );
        }

        @keyframes orb-drift {
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
          min-height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .typewriter-cursor {
          display: inline-block;
          font-weight: 300;
          color: #3b82f6;
          opacity: 1;
          animation: cursor-blink 0.9s infinite;
          margin-left: 1px;
        }

        @keyframes cursor-blink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        /* Search Capsule */
        .hero-search-capsule {
          width: 100%;
          max-width: 660px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 8px 10px 8px 22px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 20px 48px -10px rgba(37, 99, 235, 0.15),
            0 8px 24px -4px rgba(250, 204, 21, 0.1),
            0 2px 6px rgba(15, 23, 42, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-search-capsule:focus-within {
          background: rgba(255, 255, 255, 0.92);
          border-color: #3b82f6;
          box-shadow:
            0 24px 54px -10px rgba(37, 99, 235, 0.25),
            0 0 0 4px rgba(59, 130, 246, 0.12);
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
          font-size: 15.5px;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          min-width: 0;
          width: 100%;
        }

        .hero-search-input::placeholder {
          color: #94a3b8;
          font-weight: 450;
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
          /* Subtle crystal glass with sky-blue and soft pale yellow reflection */
          background: radial-gradient(
            circle at 30% 24%,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(219, 234, 254, 0.28) 25%,
            rgba(254, 249, 195, 0.18) 55%,
            rgba(147, 197, 253, 0.16) 82%,
            rgba(100, 116, 139, 0.22) 100%
          );
          border: 1.5px solid rgba(219, 234, 254, 0.9);
          box-shadow:
            0 3px 10px rgba(37, 99, 235, 0.12),
            0 1px 3px rgba(250, 204, 21, 0.08),
            inset -2px -3px 6px rgba(100, 116, 139, 0.2),
            inset 1.5px 2px 4px rgba(255, 255, 255, 0.95);
          overflow: hidden;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .hero-orb-button:hover .orb-glass-body {
          border-color: rgba(59, 130, 246, 0.7);
          box-shadow:
            0 5px 14px rgba(37, 99, 235, 0.2),
            0 0 12px rgba(96, 165, 250, 0.25),
            inset -2px -3px 6px rgba(100, 116, 139, 0.25),
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
            padding: 14px 0;
          }

          .hero-center-container {
            padding: 0 16px;
            width: 100%;
            max-width: 100%;
          }

          .hero-aurora-title {
            font-size: clamp(24px, 7vw, 32px);
            white-space: nowrap;
            letter-spacing: -0.01em;
            margin-bottom: 8px;
          }

          .hero-aurora-subtitle {
            font-size: clamp(11.5px, 3.6vw, 13.5px);
            white-space: nowrap;
            margin-bottom: 18px;
            min-height: 22px;
          }

          .hero-search-capsule {
            width: 100%;
            max-width: 100%;
            padding: 5px 6px 5px 14px;
            border-radius: var(--radius-full);
            box-shadow:
              0 14px 34px -8px rgba(37, 99, 235, 0.14),
              0 4px 12px rgba(15, 23, 42, 0.04);
          }

          .search-icon-wrap {
            margin-right: 8px;
            flex-shrink: 0;
          }

          .search-icon-wrap svg {
            width: 18px;
            height: 18px;
          }

          .hero-search-input {
            font-size: 13.5px;
            min-width: 0;
            width: 100%;
            flex: 1;
            padding-right: 4px;
          }

          .hero-search-input::placeholder {
            font-size: 13px;
            letter-spacing: -0.01em;
          }

          .hero-orb-button {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            margin-left: 4px;
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
