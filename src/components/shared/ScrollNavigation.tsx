'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollNavigation: React.FC = () => {
  const pathname = usePathname() || '';
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  // 1. Pages où la navigation par scroll est formellement exclue (outils, IA, chats, exercices)
  const isExcludedPage =
    pathname.startsWith('/exercices') ||
    pathname.startsWith('/ia') ||
    pathname.startsWith('/sunuai') ||
    pathname.startsWith('/discussions');

  // Gestion du timer d'auto-masquage
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsVisible(false);
      }
    }, 2400);
  }, []);

  // Écouteur de scroll hautement optimisé
  useEffect(() => {
    if (isExcludedPage) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const fullHeight = document.documentElement.scrollHeight;

          // Seuil d'éligibilité : la page doit être assez longue (> 1.4x la hauteur d'écran)
          const isPageLongEnough = fullHeight > windowHeight * 1.4;
          const hasScrolledDownEnough = scrollY > 320;
          const distanceToBottom = fullHeight - (scrollY + windowHeight);

          setCanScrollUp(scrollY > 200);
          setCanScrollDown(distanceToBottom > 200);

          if (isPageLongEnough && hasScrolledDownEnough) {
            setIsVisible(true);
            scheduleHide();
          } else {
            setIsVisible(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [isExcludedPage, scheduleHide]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Disparaît dès qu'on arrive en haut
    setTimeout(() => {
      setIsVisible(false);
    }, 450);
  }, []);

  const handleScrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
    scheduleHide();
  }, [scheduleHide]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Détecter si une modale ou un tiroir verrouille le défilement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkModalState = () => {
      const isLocked =
        document.body.classList.contains('modal-scroll-locked') ||
        document.documentElement.classList.contains('modal-scroll-locked') ||
        document.body.style.position === 'fixed' ||
        document.body.style.overflow === 'hidden';
      setIsModalOpen(isLocked);
    };

    checkModalState();

    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => observer.disconnect();
  }, []);

  // Ne pas monter le composant si page exclue ou modale ouverte
  if (isExcludedPage || isModalOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Navigation rapide haut et bas"
      className={`scroll-navigation-global ${isVisible ? 'is-visible' : ''}`}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        scheduleHide();
      }}
      onTouchStart={() => {
        isHoveredRef.current = true;
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }}
      onTouchEnd={() => {
        isHoveredRef.current = false;
        scheduleHide();
      }}
    >
      <div className="scroll-nav-card">
        {/* Bouton Revenir en haut */}
        <button
          type="button"
          className={`scroll-nav-btn ${!canScrollUp ? 'is-disabled' : ''}`}
          onClick={handleScrollToTop}
          disabled={!canScrollUp}
          aria-label="Monter en haut de la page"
          title="Monter en haut"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className="sr-only">Haut</span>
        </button>

        <div className="nav-divider" />

        {/* Bouton Aller en bas */}
        <button
          type="button"
          className={`scroll-nav-btn ${!canScrollDown ? 'is-disabled' : ''}`}
          onClick={handleScrollToBottom}
          disabled={!canScrollDown}
          aria-label="Descendre en bas de la page"
          title="Descendre en bas"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="sr-only">Bas</span>
        </button>
      </div>

      <style jsx>{`
        :global(body.modal-scroll-locked) .scroll-navigation-global,
        :global(html.modal-scroll-locked) .scroll-navigation-global,
        :global(body[style*="position: fixed"]) .scroll-navigation-global,
        :global(body[style*="overflow: hidden"]) .scroll-navigation-global {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .scroll-navigation-global {
          position: fixed;
          right: 24px;
          bottom: 36px;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(0.85) translateY(10px);
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s;
        }

        .scroll-navigation-global.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }

        .scroll-nav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 4px;
          box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.16), 0 4px 10px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .scroll-nav-card:hover {
          box-shadow: 0 16px 36px -4px rgba(79, 70, 229, 0.22), 0 6px 14px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .scroll-nav-btn {
          width: 38px;
          height: 38px;
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

        .scroll-nav-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        .scroll-nav-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
        }

        .scroll-nav-btn.is-disabled {
          opacity: 0.25;
          cursor: not-allowed;
          pointer-events: none;
        }

        .nav-divider {
          width: 20px;
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

        /* Responsive Mobile : compact & positionné avec élégance sans gêner */
        @media (max-width: 768px) {
          .scroll-navigation-global {
            right: 12px;
            bottom: calc(78px + env(safe-area-inset-bottom, 8px));
          }

          .scroll-nav-card {
            padding: 3px;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-color: rgba(226, 232, 240, 0.9);
            box-shadow: 0 6px 18px -2px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(0, 0, 0, 0.05);
          }

          .scroll-nav-btn {
            width: 32px;
            height: 32px;
          }

          .scroll-nav-btn svg {
            width: 15px;
            height: 15px;
          }

          .nav-divider {
            width: 16px;
          }
        }
      `}</style>
    </aside>
  );
};
