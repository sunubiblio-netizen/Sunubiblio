'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * GlobalAuroraBackdrop
 *
 * Arrière-plan signature Warm Sunny Gold & Pure White :
 * Blanc pur en symbiose avec de doux halos crème solaire et or pâle
 * (jaune doux / crème ensoleillé), inspiré de la Bibliothèque Sunubiblio.
 */
export const GlobalAuroraBackdrop: React.FC = () => {
  const pathname = usePathname();

  // Ne pas afficher sur la page éducation qui demande un fond blanc pur sans halos
  if (pathname?.startsWith('/education')) {
    return null;
  }

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
            rgba(254, 240, 138, 0.65) 0%,
            rgba(254, 249, 195, 0.42) 40%,
            rgba(255, 255, 255, 0.15) 70%,
            transparent 85%
          );
          opacity: 0.75;
        }

        .orb-sun-top-right {
          width: 700px;
          height: 500px;
          top: -10%;
          right: -8%;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(253, 224, 71, 0.52) 0%,
            rgba(254, 240, 138, 0.38) 40%,
            rgba(255, 255, 255, 0.15) 70%,
            transparent 85%
          );
          opacity: 0.72;
          animation-delay: -3s;
        }

        .orb-sun-bottom {
          width: 110vw;
          height: 580px;
          bottom: -4%;
          left: -5vw;
          background: radial-gradient(
            ellipse 90% 75% at 50% 100%,
            rgba(254, 240, 138, 0.7) 0%,
            rgba(254, 249, 195, 0.48) 38%,
            rgba(255, 255, 255, 0.2) 70%,
            transparent 95%
          );
          opacity: 0.75;
          animation-delay: -5s;
        }

        .orb-sun-accent {
          width: 560px;
          height: 460px;
          bottom: 10%;
          right: 5%;
          background: radial-gradient(
            circle,
            rgba(250, 204, 21, 0.35) 0%,
            rgba(254, 240, 138, 0.2) 50%,
            transparent 75%
          );
          opacity: 0.6;
          animation-delay: -2s;
        }

        .aurora-center-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 72% 62% at 50% 38%,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.88) 35%,
            rgba(255, 255, 255, 0.45) 65%,
            transparent 85%
          );
        }

        @media (max-width: 768px) {
          .orb-sun-top-left {
            width: 580px;
            height: 420px;
            top: -10%;
            left: -20%;
            background: radial-gradient(
              circle at 30% 30%,
              rgba(254, 240, 138, 0.55) 0%,
              rgba(254, 249, 195, 0.35) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 85%
            );
            opacity: 0.6;
            filter: blur(70px);
          }

          .orb-sun-top-right {
            width: 560px;
            height: 400px;
            top: -8%;
            right: -20%;
            background: radial-gradient(
              circle at 70% 30%,
              rgba(253, 224, 71, 0.45) 0%,
              rgba(254, 240, 138, 0.3) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 85%
            );
            opacity: 0.58;
            filter: blur(70px);
          }

          .orb-sun-bottom {
            width: 120vw;
            height: 460px;
            bottom: -4%;
            left: -10vw;
            background: radial-gradient(
              ellipse 90% 75% at 50% 100%,
              rgba(254, 240, 138, 0.55) 0%,
              rgba(254, 249, 195, 0.35) 38%,
              transparent 90%
            );
            opacity: 0.58;
            filter: blur(65px);
          }

          .orb-sun-accent {
            width: 440px;
            height: 360px;
            bottom: 8%;
            right: -10%;
            background: radial-gradient(
              circle,
              rgba(250, 204, 21, 0.28) 0%,
              rgba(254, 240, 138, 0.15) 50%,
              transparent 75%
            );
            opacity: 0.5;
            filter: blur(60px);
          }

          .aurora-center-spotlight {
            background: radial-gradient(
              ellipse 75% 65% at 50% 38%,
              rgba(255, 255, 255, 0.96) 0%,
              rgba(255, 255, 255, 0.85) 40%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 90%
            );
          }
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
