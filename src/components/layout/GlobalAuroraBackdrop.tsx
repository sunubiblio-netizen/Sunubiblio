'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * GlobalAuroraBackdrop
 *
 * Gère l'arrière-plan avec intelligence :
 * - Page d'accueil ('/') : décor héro unique d'origine (ailes bleu ciel/azur en haut, centre lumineux, halo jaune/crème en bas).
 * - Toutes les autres pages : AUCUN bleu ! Uniquement la couleur de base adorée (crème solaire doux / jaune pâle)
 *   en symbiose avec le blanc pur pour une ambiance sereine, épurée et sans mélange désordonné.
 */
export const GlobalAuroraBackdrop: React.FC = () => {
  const pathname = usePathname() || '/';
  const isHome = pathname === '/' || pathname === '';

  // 1. PAGE D'ACCUEIL : Thème Noir Obsidienne & Arc d'Éclipse Solaire Orange Ardent
  if (isHome) {
    return (
      <div className="global-aurora-backdrop home-eclipse-backdrop" aria-hidden="true">
        {/* Arc d'éclipse lumineux courbé en sourire avec incandescence orange */}
        <div className="eclipse-arc-wrap">
          <div className="eclipse-arc-core" />
          <div className="eclipse-arc-glow-outer" />
          <div className="eclipse-arc-glow-inner" />
        </div>

        {/* Halo volumétrique chaud sous l'arc */}
        <div className="eclipse-ambient-glow" />

        {/* Spot central adouci */}
        <div className="eclipse-center-spotlight" />

        <style jsx>{`
          .global-aurora-backdrop {
            position: fixed;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
            background: #090706;
          }

          .eclipse-arc-wrap {
            position: absolute;
            width: 135vw;
            height: 600px;
            left: 50%;
            top: -40px;
            transform: translateX(-50%);
            border-radius: 50%;
            pointer-events: none;
          }

          .eclipse-arc-core {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border-bottom: 2.8px solid #ff7a18;
            box-shadow:
              0 4px 20px rgba(255, 122, 24, 0.95),
              0 12px 50px rgba(234, 88, 12, 0.85);
          }

          .eclipse-arc-glow-outer {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border-bottom: 14px solid rgba(249, 115, 22, 0.7);
            filter: blur(8px);
          }

          .eclipse-arc-glow-inner {
            position: absolute;
            inset: -22px;
            border-radius: 50%;
            border-bottom: 40px solid rgba(234, 88, 12, 0.42);
            filter: blur(28px);
          }

          .eclipse-ambient-glow {
            position: absolute;
            width: 980px;
            height: 520px;
            top: 26%;
            left: 50%;
            transform: translate(-50%, -30%);
            background: radial-gradient(
              ellipse 70% 50% at 50% 50%,
              rgba(234, 88, 12, 0.24) 0%,
              rgba(194, 65, 12, 0.14) 40%,
              rgba(9, 7, 6, 0) 75%
            );
            filter: blur(55px);
          }

          .eclipse-center-spotlight {
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at 50% 42%,
              rgba(255, 138, 43, 0.05) 0%,
              rgba(9, 7, 6, 0.4) 60%,
              #090706 100%
            );
          }
        `}</style>
      </div>
    );
  }

  // 2. TOUTES LES AUTRES PAGES : Fond blanc pur & crème solaire doré officiel
  return (
    <div className="global-aurora-backdrop" aria-hidden="true">
      <div className="aurora-orb orb-sun-top-left" />
      <div className="aurora-orb orb-sun-top-right" />
      <div className="aurora-orb orb-sun-bottom" />
      <div className="aurora-orb orb-sun-accent" />
      <div className="aurora-center-spotlight" />

      <style jsx>{`
        .global-aurora-backdrop {
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
          animation: global-orb-drift 12s ease-in-out infinite alternate;
          will-change: transform;
        }

        .orb-sun-top-left {
          width: 720px;
          height: 520px;
          top: -12%;
          left: -8%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(254, 240, 138, 0.72) 0%,
            rgba(254, 249, 195, 0.5) 40%,
            rgba(255, 255, 255, 0.2) 70%,
            transparent 85%
          );
          opacity: 0.8;
        }

        .orb-sun-top-right {
          width: 700px;
          height: 500px;
          top: -10%;
          right: -8%;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(253, 224, 71, 0.58) 0%,
            rgba(254, 240, 138, 0.42) 40%,
            rgba(255, 255, 255, 0.2) 70%,
            transparent 85%
          );
          opacity: 0.78;
          animation-delay: -3s;
        }

        .orb-sun-bottom {
          width: 110vw;
          height: 580px;
          bottom: -4%;
          left: -5vw;
          background: radial-gradient(
            ellipse 90% 75% at 50% 100%,
            rgba(254, 240, 138, 0.78) 0%,
            rgba(254, 249, 195, 0.55) 38%,
            rgba(255, 255, 255, 0.25) 70%,
            transparent 95%
          );
          opacity: 0.82;
          animation-delay: -5s;
        }

        .orb-sun-accent {
          width: 560px;
          height: 460px;
          bottom: 10%;
          right: 5%;
          background: radial-gradient(
            circle,
            rgba(250, 204, 21, 0.4) 0%,
            rgba(254, 240, 138, 0.25) 50%,
            transparent 75%
          );
          opacity: 0.7;
          animation-delay: -2s;
        }

        .aurora-center-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 70% 60% at 50% 38%,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.85) 35%,
            rgba(255, 255, 255, 0.45) 65%,
            transparent 85%
          );
        }

        @keyframes global-orb-drift {
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
      `}</style>
    </div>
  );
};
