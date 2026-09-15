'use client';

import React, { useRef, useEffect } from 'react';

/**
 * SYSTÈME D'ANIMATION DES SECTIONS REPLIABLES
 * ─────────────────────────────────────────────
 * Technique : transition CSS sur `height` avec mesure de la hauteur réelle.
 *
 * Principes clés pour une vitesse perçue CONSTANTE quelle que soit la hauteur :
 *
 * 1. Mesurer scrollHeight AVANT de masquer le contenu (pas pendant l'animation).
 * 2. Utiliser `transitionend` plutôt qu'un timer fixe pour passer à `height:auto`.
 * 3. Pas de `will-change` (perturbe le calcul de layout sur certains moteurs).
 * 4. Respecter prefers-reduced-motion.
 * 5. Un seul RAF après le flush offsetHeight (pattern le plus stable cross-platform).
 */

const TRANSITION_MS = 500;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Vérifie si l'utilisateur a activé "Réduire les animations" au niveau OS. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface CollapsibleSectionProps {
  id: string;
  stepNumber: number | string;
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  stepNumber,
  title,
  subtitle,
  badge,
  accentColor = '#4f46e5',
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  const contentId = `collapsible-content-${id}`;
  const headerId = `collapsible-header-${id}`;

  const bodyRef = useRef<HTMLDivElement>(null);
  /** Dernière valeur connue — évite les effets de bord au premier rendu (StrictMode). */
  const prevOpenRef = useRef<boolean>(isOpen);
  /** RAF handle — annulable si un toggle arrive pendant l'animation. */
  const rafRef = useRef<number | null>(null);
  /** Ref vers le handler transitionend pour pouvoir le retirer proprement. */
  const transitionEndRef = useRef<((e: TransitionEvent) => void) | null>(null);

  /* ─── INITIALISATION sans animation au premier rendu ─────── */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.height = 'auto';
      el.style.overflow = 'visible';
    } else {
      el.style.height = '0px';
      el.style.overflow = 'hidden';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── ANIMATION à chaque changement de isOpen ────────────────
   * Compatible : Chrome, Firefox, Edge, Safari desktop
   *            + iOS Safari, Android Chrome, Samsung Internet
   *
   * CORRECTION PRINCIPALE DU BUG DE VITESSE VARIABLE :
   * → scrollHeight est toujours mesuré AVANT d'appliquer height:0
   *   ou de désactiver overflow, car `scrollHeight` retourne la
   *   hauteur réelle du contenu même avec overflow:hidden.
   *   Mesurer DANS le RAF (comme avant) revenait à mesurer après
   *   que certains éléments n'étaient pas encore peints par React,
   *   produisant une hauteur sous-estimée sur les grandes sections.
   ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (prevOpenRef.current === isOpen) return;
    prevOpenRef.current = isOpen;

    // Annuler toute animation en cours
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (transitionEndRef.current) {
      el.removeEventListener('transitionend', transitionEndRef.current);
      transitionEndRef.current = null;
    }

    /* Mode accessibilité : pas d'animation */
    if (prefersReducedMotion()) {
      el.style.transition = 'none';
      el.style.height = isOpen ? 'auto' : '0px';
      el.style.overflow = isOpen ? 'visible' : 'hidden';
      return;
    }

    const TRANSITION = `height ${TRANSITION_MS}ms ${EASING}`;

    if (isOpen) {
      /* ══ OUVERTURE ════════════════════════════════════════════
       * 1. Mesurer la hauteur cible MAINTENANT (contenu déjà
       *    rendu dans le DOM, overflow:hidden n'empêche pas
       *    scrollHeight de retourner la vraie hauteur).
       * 2. Mettre height:0 + flush offsetHeight
       * 3. RAF : activer transition → hauteur mesurée
       * 4. transitionend → height:auto (pas de timer fixe)
       */
      const targetHeight = el.scrollHeight; // ← clef : mesure avant toute modification

      el.style.transition = 'none';
      el.style.overflow = 'hidden';
      el.style.height = '0px';

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      void el.offsetHeight; // flush synchrone

      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'height') return;
        el.removeEventListener('transitionend', onEnd);
        transitionEndRef.current = null;
        if (prevOpenRef.current) {
          el.style.transition = 'none';
          el.style.height = 'auto';
          el.style.overflow = 'visible';
        }
      };
      transitionEndRef.current = onEnd;
      el.addEventListener('transitionend', onEnd);

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!bodyRef.current) return;
        bodyRef.current.style.transition = TRANSITION;
        bodyRef.current.style.height = `${targetHeight}px`;
      });

    } else {
      /* ══ FERMETURE (sur place, sans scroll) ═══════════════════
       * 1. Mesurer scrollHeight MAINTENANT depuis height:auto
       * 2. Fixer en px + flush offsetHeight
       * 3. RAF : activer transition → 0px
       *    (pas de transitionend nécessaire — height:0 est final)
       */
      const currentHeight = el.scrollHeight; // ← mesure depuis height:auto

      el.style.transition = 'none';
      el.style.overflow = 'hidden';
      el.style.height = `${currentHeight}px`;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      void el.offsetHeight; // flush synchrone

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!bodyRef.current) return;
        bodyRef.current.style.transition = TRANSITION;
        bodyRef.current.style.height = '0px';
      });
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (transitionEndRef.current) {
        el.removeEventListener('transitionend', transitionEndRef.current);
        transitionEndRef.current = null;
      }
    };
  }, [isOpen]);

  /* ─── RESIZE OBSERVER ─────────────────────────────────────────
   * Corrige la hauteur si la fenêtre est redimensionnée pendant
   * qu'une section est figée en px (en cours d'animation).
   * Dès que l'animation est terminée (height:auto), plus de souci.
   ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = bodyRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (
        prevOpenRef.current &&
        el.style.height !== 'auto' &&
        el.style.height !== '0px'
      ) {
        // Section ouverte mais figée en px → corriger en auto
        el.style.transition = 'none';
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      }
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);



  return (
    <section
      id={id}
      className={`collapsible-section-wrapper ${isOpen ? 'is-open' : 'is-closed'} ${className}`}
      aria-labelledby={headerId}
    >
      {/* En-tête cliquable sur toute la largeur */}
      <div className="collapsible-header-card">
        <button
          id={headerId}
          type="button"
          className="collapsible-trigger-btn"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          title={isOpen ? `Replier la section : ${title}` : `Déplier la section : ${title}`}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="trigger-left-content">
            <div
              className="step-badge"
              style={{
                backgroundColor: accentColor,
              }}
              aria-hidden="true"
            >
              <span>{stepNumber}</span>
            </div>

            <div className="trigger-texts">
              <div className="title-row">
                <h2 className="trigger-title">{title}</h2>
                {badge && <span className="trigger-pill-badge">{badge}</span>}
              </div>
              {subtitle && <p className="trigger-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="trigger-right-actions">
            <span className="toggle-status-badge" aria-hidden="true">
              {isOpen ? 'Replier' : 'Déplier'}
            </span>

            <div className={`chevron-circle ${isOpen ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Corps — toujours dans le DOM, hauteur animée en JS */}
      <div
        ref={bodyRef}
        id={contentId}
        className="collapsible-body"
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
      >
        {children}

        {/* Bouton Replier — bas de section */}
        <div className="collapsible-footer">
          <button
            type="button"
            className="collapsible-footer-btn"
            onClick={onToggle}
            tabIndex={isOpen ? 0 : -1}
            aria-label={`Replier la section : ${title}`}
            style={{ touchAction: 'manipulation' }}
          >
            <svg
              width="16"
              height="16"
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
            <span>Replier</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .collapsible-section-wrapper {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.85);
          border-radius: 20px;
          margin-bottom: 22px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          scroll-margin-top: 90px;
        }

        .collapsible-section-wrapper:hover {
          border-color: rgba(99, 102, 241, 0.3);
        }

        .collapsible-section-wrapper.is-open {
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 10px 30px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .collapsible-header-card {
          width: 100%;
          background: #ffffff;
          transition: background-color 0.15s ease;
        }

        .collapsible-section-wrapper.is-closed .collapsible-header-card:hover {
          background: #fafaff;
        }

        .collapsible-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 16px;
          outline: none;
          transition: all 0.15s ease;
        }

        .collapsible-trigger-btn:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px #4f46e5;
          background: #fafaff;
        }

        .trigger-left-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .step-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
        }

        .trigger-texts {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .trigger-title {
          font-size: clamp(17px, 2.2vw, 20px);
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .trigger-pill-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 9px;
          border-radius: 9999px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .trigger-subtitle {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trigger-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .toggle-status-badge {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          background: #f1f5f9;
          padding: 5px 12px;
          border-radius: 9999px;
          transition: all 0.18s ease;
        }

        .collapsible-trigger-btn:hover .toggle-status-badge {
          background: #eef2ff;
          color: #4f46e5;
        }

        .chevron-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Rotation syncée avec la transition height (500ms même easing) */
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1),
            background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .collapsible-trigger-btn:hover .chevron-circle {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        .chevron-circle.is-rotated {
          transform: rotate(180deg);
          background: #eef2ff;
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
        }

        /* Corps : overflow et height pilotés en JS pour l'animation */
        .collapsible-body {
          overflow: hidden;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
          padding: 6px 24px 0 24px;
        }

        .collapsible-footer {
          display: flex;
          justify-content: center;
          padding: 20px 0 24px 0;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
          margin-top: 24px;
        }

        .collapsible-footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          color: #6366f1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          outline: none;
        }

        .collapsible-footer-btn:hover {
          background: #eef2ff;
          border-color: rgba(99, 102, 241, 0.4);
          color: #4f46e5;
          box-shadow: 0 2px 8px -2px rgba(99, 102, 241, 0.2);
        }

        .collapsible-footer-btn:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }


        @media (max-width: 768px) {
          .collapsible-section-wrapper {
            border-radius: 16px;
            margin-bottom: 16px;
          }

          .collapsible-trigger-btn {
            padding: 16px;
            gap: 12px;
          }

          .step-badge {
            width: 32px;
            height: 32px;
            font-size: 13.5px;
            border-radius: 9px;
          }

          .toggle-status-badge {
            display: none;
          }

          .trigger-subtitle {
            display: none; /* Sur mobile : titre épuré pour éviter l'encombrement */
          }

          .collapsible-body {
            padding: 4px 16px 0 16px;
          }

          .collapsible-footer {
            padding: 16px 0 20px 0;
            margin-top: 16px;
          }

          .collapsible-footer-btn {
            font-size: 12px;
            padding: 8px 18px;
            gap: 6px;
          }
        }
      `}</style>
    </section>
  );
};
