'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActiveFilterItem } from './ActiveFilterChips';
import { FilterChip } from './FilterChip';
import { FilterAccordion } from './FilterAccordion';

export interface FilterGlassOption {
  id?: string;
  value?: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export interface FilterGlassSection {
  id: string;
  title: string;
  options: FilterGlassOption[];
  selectedValue: string;
  onSelect: (val: string) => void;
  icon?: React.ReactNode;
}

export interface FilterGlassPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sections: FilterGlassSection[];
  onReset?: () => void;
  onResetAll?: () => void;
  totalResults?: number;
  resultsUnit?: string;
  resultsUnitPlural?: string;
  activeCount?: number;
  activeChips?: ActiveFilterItem[];
  title?: string;
}

export const FilterGlassPanel: React.FC<FilterGlassPanelProps> = ({
  isOpen,
  onClose,
  sections,
  onReset,
  onResetAll,
  totalResults,
  resultsUnit = 'résultat',
  resultsUnitPlural = 'résultats',
  activeCount = 0,
  activeChips = [],
  title = 'Filtres',
}) => {
  const handleReset = onResetAll || onReset || (() => {});
  const [mounted, setMounted] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Reset open section when panel is closed or reopened
  useEffect(() => {
    if (!isOpen) {
      setOpenSectionId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verrouillage 100% immobile de l'arrière-plan sans aucun saut ni déplacement
  useEffect(() => {
    if (!isOpen) return;

    // 1. Sauvegarder la position exacte du scroll avant ouverture
    const initialScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    // 2. Sauvegarder le comportement de scroll existant
    const originalHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const originalBodyScrollBehavior = document.body.style.scrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Désactiver tout smooth scrolling pour éviter les transitions parasites
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.overscrollBehavior = 'none';

    // 3. Interception intelligente des gestes tactiles sans toucher à la position du body
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollBody = target?.closest('.glass-panel-scroll-body') as HTMLElement | null;

      // Si le geste n'est pas dans le corps scrollable du filtre, l'annuler
      if (!scrollBody) {
        if (e.cancelable) {
          e.preventDefault();
        }
        return;
      }

      // Si dans le corps scrollable, empêcher la propagation du rebond aux limites haut et bas
      if (e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const isPullingDown = currentY > touchStartY;
        const isPushingUp = currentY < touchStartY;

        const isAtTop = scrollBody.scrollTop <= 0;
        const isAtBottom = scrollBody.scrollTop + scrollBody.clientHeight >= scrollBody.scrollHeight - 1;

        if ((isAtTop && isPullingDown) || (isAtBottom && isPushingUp)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollBody = target?.closest('.glass-panel-scroll-body');
      if (!scrollBody) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const target = e.target as HTMLElement | null;
      const isInsideScrollable = target && target.closest('.glass-panel-scroll-body');
      if (!isInsideScrollable) {
        if (['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
          e.preventDefault();
        }
      }
    };

    // Verrouillage absolu du scroll de la fenêtre : ancrage strict sur la position initiale
    const handleWindowScroll = () => {
      if (window.scrollY !== initialScrollY) {
        window.scrollTo({ top: initialScrollY, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);

      // Restauration invisible de la position exacte sans le moindre saut
      window.scrollTo({ top: initialScrollY, left: 0, behavior: 'instant' as ScrollBehavior });

      // Restaurer le comportement de scroll au tick suivant pour éviter tout conflit d'animation
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = originalHtmlScrollBehavior;
        document.body.style.scrollBehavior = originalBodyScrollBehavior;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        ref={overlayRef}
        className="sunu-glass-panel-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ zIndex: 999990 }}
      >
        <div
          className="sunu-glass-floating-panel"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête Glassmorphism */}
          <div className="glass-panel-header">
          <div className="header-title-box">
            <span className="header-sparkle-dot" aria-hidden="true" />
            <h2 className="header-heading">{title}</h2>
            {activeCount > 0 && (
              <span className="header-active-count">{activeCount}</span>
            )}
          </div>

          <button
            type="button"
            className="glass-close-btn"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Bandeau des filtres actifs si présents */}
        {activeChips.length > 0 && (
          <div className="glass-active-chips-strip">
            {activeChips.map((chip) => (
              <FilterChip
                key={chip.id}
                label={chip.label}
                onRemove={chip.onRemove}
                ariaLabel={`Retirer ${chip.label}`}
              />
            ))}
          </div>
        )}

        {/* Corps défilable : Sections de filtres organisées en accordéons compacts */}
        <div className="glass-panel-scroll-body" tabIndex={0}>
          <div className="glass-accordions-stack">
            {sections.map((section) => (
              <FilterAccordion
                key={section.id}
                id={section.id}
                title={section.title}
                options={section.options}
                selectedValue={section.selectedValue}
                onSelect={(val) => {
                  section.onSelect(val);
                  setOpenSectionId(null);
                }}
                isOpen={openSectionId === section.id}
                onToggle={() =>
                  setOpenSectionId((prev) => (prev === section.id ? null : section.id))
                }
                icon={section.icon}
              />
            ))}
          </div>
        </div>

        {/* Pied de page fixe : Réinitialiser & Voir les X résultats */}
        <div className="glass-panel-footer">
          <button
            type="button"
            className="glass-reset-btn"
            onClick={handleReset}
            disabled={activeCount === 0}
          >
            Réinitialiser
          </button>

          <button
            type="button"
            className="glass-apply-btn"
            onClick={onClose}
          >
            {totalResults !== undefined
              ? `Voir ${totalResults} ${totalResults > 1 ? resultsUnitPlural : resultsUnit}`
              : 'Appliquer les filtres'}
          </button>
        </div>
      </div>
    </div>

    {/* ── BORDURE 4 CÔTÉS INDÉPENDANTS DU VIEWPORT (COUCHE SUPÉRIEURE, 100% VISIBLE AU-DESSUS DE L'OVERLAY) ── */}
    <div
      className="sunu-mobile-independent-frame"
      aria-hidden="true"
      style={{ zIndex: 99999999, pointerEvents: 'none' }}
    >
      {/* 1. TOP : Mouvement horizontal indépendant (gauche -> droite), Bleu -> Violet */}
      <div className="sunu-edge-bar sunu-edge-top">
        <div className="sunu-edge-track" />
        <div className="sunu-edge-beam-top" />
      </div>

      {/* 2. RIGHT : Mouvement vertical indépendant (haut -> bas), Violet -> Rose */}
      <div className="sunu-edge-bar sunu-edge-right">
        <div className="sunu-edge-track" />
        <div className="sunu-edge-beam-right" />
      </div>

      {/* 3. BOTTOM : Mouvement horizontal indépendant (droite -> gauche), Rose -> Magenta -> Violet */}
      <div className="sunu-edge-bar sunu-edge-bottom">
        <div className="sunu-edge-track" />
        <div className="sunu-edge-beam-bottom" />
      </div>

      {/* 4. LEFT : Mouvement vertical indépendant (bas -> haut), Violet -> Bleu */}
      <div className="sunu-edge-bar sunu-edge-left">
        <div className="sunu-edge-track" />
        <div className="sunu-edge-beam-left" />
      </div>
    </div>

      <style jsx>{`
        .sunu-glass-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(14px, env(safe-area-inset-top, 14px)) 14px max(14px, env(safe-area-inset-bottom, 14px)) 14px;
          animation: overlayFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          touch-action: none;
          overscroll-behavior: none;
        }

        @keyframes overlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .sunu-glass-floating-panel {
          position: relative;
          width: 100%;
          max-width: 440px;
          max-height: min(720px, calc(100dvh - 28px));
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          box-shadow: 0 24px 55px -12px rgba(15, 23, 42, 0.28),
            0 0 0 1px rgba(99, 102, 241, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          overscroll-behavior: contain;
          touch-action: none;
          user-select: none;
          animation: glassPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ── BORDURE MOBILE 4 CÔTÉS INDÉPENDANTS (ACTIVE UNIQUEMENT QUAND LE FILTRE EST OUVERT) ── */
        .sunu-mobile-independent-frame {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100dvh;
          pointer-events: none;
          z-index: 99999999;
          overflow: hidden;
        }

        .sunu-edge-bar {
          position: absolute;
          pointer-events: none;
          overflow: hidden;
        }

        .sunu-edge-track {
          position: absolute;
          inset: 0;
          background: rgba(99, 102, 241, 0.22);
        }

        /* ── 1. CÔTÉ TOP (Horizontal, Gauche -> Droite, Bleu -> Violet) ── */
        .sunu-edge-top {
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
        }

        .sunu-edge-beam-top {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 42%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #3b82f6 20%,
            #6366f1 60%,
            #8b5cf6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.95), 0 1px 5px rgba(99, 102, 241, 0.9);
          animation: beamMoveTop 2.8s linear infinite;
        }

        @keyframes beamMoveTop {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        /* ── 2. CÔTÉ RIGHT (Vertical, Haut -> Bas, Violet -> Rose) ── */
        .sunu-edge-right {
          top: 0;
          right: 0;
          bottom: 0;
          width: 2.5px;
        }

        .sunu-edge-beam-right {
          position: absolute;
          left: 0;
          right: 0;
          height: 42%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            #8b5cf6 20%,
            #a855f7 60%,
            #ec4899 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.95), -1px 0 5px rgba(168, 85, 247, 0.9);
          animation: beamMoveRight 2.8s linear infinite;
          animation-delay: 0.7s;
        }

        @keyframes beamMoveRight {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(250%);
          }
        }

        /* ── 3. CÔTÉ BOTTOM (Horizontal, Droite -> Gauche, Rose -> Magenta -> Violet) ── */
        .sunu-edge-bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: 2.5px;
        }

        .sunu-edge-beam-bottom {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 42%;
          background: linear-gradient(
            270deg,
            transparent 0%,
            #ec4899 20%,
            #d946ef 55%,
            #8b5cf6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(217, 70, 239, 0.95), 0 -1px 5px rgba(236, 72, 153, 0.9);
          animation: beamMoveBottom 2.8s linear infinite;
          animation-delay: 1.4s;
        }

        @keyframes beamMoveBottom {
          0% {
            transform: translateX(250%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        /* ── 4. CÔTÉ LEFT (Vertical, Bas -> Haut, Violet -> Bleu) ── */
        .sunu-edge-left {
          top: 0;
          left: 0;
          bottom: 0;
          width: 2.5px;
        }

        .sunu-edge-beam-left {
          position: absolute;
          left: 0;
          right: 0;
          height: 42%;
          background: linear-gradient(
            0deg,
            transparent 0%,
            #a855f7 20%,
            #6366f1 60%,
            #3b82f6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.95), 1px 0 5px rgba(59, 130, 246, 0.9);
          animation: beamMoveLeft 2.8s linear infinite;
          animation-delay: 2.1s;
        }

        @keyframes beamMoveLeft {
          0% {
            transform: translateY(250%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        /* Accessibilité prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .sunu-edge-beam-top,
          .sunu-edge-beam-right,
          .sunu-edge-beam-bottom,
          .sunu-edge-beam-left {
            animation: none;
            opacity: 0.5;
            box-shadow: none;
          }
        }

        @keyframes glassPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .glass-panel-header {
          position: relative;
          z-index: 2;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
          background: rgba(248, 250, 255, 0.65);
          display: flex;
          align-items: center;
          justify-content: space-between;
          touch-action: none;
          user-select: none;
        }

        .header-title-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-sparkle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
        }

        .header-heading {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .header-active-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 19px;
          height: 19px;
          padding: 0 6px;
          border-radius: 9999px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 10.5px;
          font-weight: 700;
        }

        .glass-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: rgba(241, 245, 249, 0.85);
          color: #64748b;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glass-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .glass-active-chips-strip {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(248, 250, 252, 0.7);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          overflow-x: auto;
          white-space: nowrap;
          touch-action: pan-x;
          overscroll-behavior: contain;
        }

        .glass-panel-scroll-body {
          position: relative;
          z-index: 1;
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          touch-action: pan-y;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .glass-panel-scroll-body::-webkit-scrollbar {
          width: 5px;
        }

        .glass-panel-scroll-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .glass-accordions-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .glass-panel-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px max(14px, env(safe-area-inset-bottom, 14px)) 18px;
          background: rgba(255, 255, 255, 0.85);
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          touch-action: none;
          user-select: none;
        }

        .glass-reset-btn {
          flex: 1;
          height: 42px;
          border-radius: 12px;
          background: #f1f5f9;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glass-reset-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .glass-reset-btn:hover:not(:disabled) {
          background: #fee2e2;
          color: #ef4444;
        }

        .glass-apply-btn {
          flex: 2;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
        }

        .glass-apply-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
      `}</style>
    </>,
    document.body
  );
};
