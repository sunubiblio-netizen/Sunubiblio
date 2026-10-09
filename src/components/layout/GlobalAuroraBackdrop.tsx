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

  if (isHome) {
    return (
      <div className="global-aurora-backdrop home-aurora" aria-hidden="true">
        <div className="aurora-orb orb-blue-left" />
        <div className="aurora-orb orb-blue-right" />
        <div className="aurora-orb orb-soft-yellow-bottom" />
        <div className="aurora-orb orb-pale-yellow-accent" />
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

          .orb-blue-left {
            width: 720px;
            height: 540px;
            top: -8%;
            left: -8%;
            background: radial-gradient(
              circle at 20% 20%,
              rgba(29, 78, 216, 0.85) 0%,
              rgba(37, 99, 235, 0.62) 35%,
              rgba(59, 130, 246, 0.35) 60%,
              transparent 85%
            );
            opacity: 0.82;
          }

          .orb-blue-right {
            width: 700px;
            height: 520px;
            top: -6%;
            right: -8%;
            background: radial-gradient(
              circle at 80% 20%,
              rgba(29, 78, 216, 0.82) 0%,
              rgba(37, 99, 235, 0.58) 35%,
              rgba(96, 165, 250, 0.32) 60%,
              transparent 85%
            );
            opacity: 0.8;
            animation-delay: -3s;
          }

          .orb-soft-yellow-bottom {
            width: 110vw;
            height: 580px;
            bottom: -2%;
            left: -5vw;
            background: radial-gradient(
              ellipse 90% 75% at 50% 100%,
              rgba(254, 240, 138, 0.82) 0%,
              rgba(254, 249, 195, 0.6) 38%,
              rgba(255, 255, 255, 0.25) 70%,
              transparent 95%
            );
            opacity: 0.85;
            animation-delay: -5s;
          }

          .orb-pale-yellow-accent {
            width: 560px;
            height: 460px;
            bottom: 12%;
            right: 8%;
            background: radial-gradient(
              circle,
              rgba(253, 224, 71, 0.5) 0%,
              rgba(254, 240, 138, 0.3) 50%,
              transparent 75%
            );
            opacity: 0.75;
            animation-delay: -2s;
          }

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
  }

  // Pour TOUTES les autres pages : Blanc pur + Crème solaire doré doux uniquement
  return (
    <div className="global-aurora-backdrop inner-page-backdrop" aria-hidden="true">
      <div className="sun-soft-glow-top" />
      <div className="sun-soft-glow-bottom" />

      <style jsx>{`
        .global-aurora-backdrop {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #ffffff;
        }

        .sun-soft-glow-top {
          position: absolute;
          width: 100vw;
          height: 480px;
          top: -120px;
          left: 0;
          background: radial-gradient(
            ellipse 85% 70% at 50% 30%,
            rgba(254, 249, 195, 0.6) 0%,
            rgba(254, 240, 138, 0.3) 45%,
            rgba(255, 255, 255, 0.8) 75%,
            transparent 100%
          );
          filter: blur(60px);
          opacity: 0.75;
        }

        .sun-soft-glow-bottom {
          position: absolute;
          width: 110vw;
          height: 520px;
          bottom: -80px;
          left: -5vw;
          background: radial-gradient(
            ellipse 90% 75% at 50% 90%,
            rgba(254, 240, 138, 0.55) 0%,
            rgba(254, 249, 195, 0.35) 45%,
            transparent 85%
          );
          filter: blur(70px);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};
