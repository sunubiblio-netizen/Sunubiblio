'use client';

import React, { useState, useEffect, useCallback } from 'react';

export const FloatingQuickNav: React.FC = () => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  // Écouteur de scroll hautement optimisé avec requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          // Seuil haut : afficher le bouton "Haut" après 280px de défilement
          setCanScrollUp(scrollY > 280);

          // Seuil bas : masquer le bouton "Bas" quand on est à moins de 250px du bas réel
          const distanceToBottom = fullHeight - (scrollY + windowHeight);
          setCanScrollDown(distanceToBottom > 250);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Évaluation initiale

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleScrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  // Si aucun bouton n'est pertinent (page très courte), ne rien afficher
  if (!canScrollUp && !canScrollDown) {
    return null;
  }

  return (
    <aside aria-label="Navigation rapide haut et bas" className="floating-quick-nav">
      <div className="floating-nav-card">
        {/* Bouton Revenir en haut */}
        <button
          type="button"
          className={`quick-nav-btn ${!canScrollUp ? 'is-disabled' : ''}`}
          onClick={handleScrollToTop}
          disabled={!canScrollUp}
          aria-label="Revenir en haut de la page"
          title="Revenir en haut"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className="sr-only">Haut</span>
        </button>

        <div className="nav-divider" />

        {/* Bouton Aller en bas */}
        <button
          type="button"
          className={`quick-nav-btn ${!canScrollDown ? 'is-disabled' : ''}`}
          onClick={handleScrollToBottom}
          disabled={!canScrollDown}
          aria-label="Aller en bas de la page"
          title="Aller en bas"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="sr-only">Bas</span>
        </button>
      </div>

      <style jsx>{`
        .floating-quick-nav {
          position: fixed;
          right: 28px;
          bottom: 40px;
          z-index: 100;
          animation: fade-in-float 0.25s ease-out;
        }

        .floating-nav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 4px;
          box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.16), 0 4px 10px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .floating-nav-card:hover {
          box-shadow: 0 16px 36px -4px rgba(79, 70, 229, 0.22), 0 6px 14px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .quick-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .quick-nav-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        .quick-nav-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
        }

        .quick-nav-btn.is-disabled {
          opacity: 0.25;
          cursor: not-allowed;
          pointer-events: none;
        }

        .nav-divider {
          width: 22px;
          height: 1px;
          background: rgba(226, 232, 240, 0.85);
          margin: 1px 0;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @keyframes fade-in-float {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Responsive Mobile : compact & positionné strictement AU-DESSUS de la nav mobile globale (72px) */
        @media (max-width: 768px) {
          .floating-quick-nav {
            right: 14px;
            bottom: calc(76px + env(safe-area-inset-bottom, 0px));
          }

          .quick-nav-btn {
            width: 36px;
            height: 36px;
          }

          .quick-nav-btn svg {
            width: 16px;
            height: 16px;
          }

          .nav-divider {
            width: 18px;
          }
        }
      `}</style>
    </aside>
  );
};
