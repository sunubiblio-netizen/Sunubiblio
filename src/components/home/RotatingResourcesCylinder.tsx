'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  accent: string;
  icon: React.ReactNode;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'bibliotheque',
    title: 'Bibliothèque',
    subtitle: '12 400+ Ouvrages',
    href: '/bibliotheque',
    accent: '#f97316',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: 'education',
    title: 'Éducation',
    subtitle: 'CI au Doctorat',
    href: '/education',
    accent: '#fb923c',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'concours',
    title: 'Concours',
    subtitle: 'ENA, FASTEF, Police...',
    href: '/concours',
    accent: '#f59e0b',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'religion',
    title: 'Religion',
    subtitle: 'Écrits & Traditions',
    href: '/religion',
    accent: '#ea580c',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10c0-1.8-.5-3.5-1.4-5a7 7 0 1 1-8.6-8.6C12.5 2.1 12.2 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'documents',
    title: 'Documents',
    subtitle: 'Thèses & Rapports',
    href: '/bibliotheque?type=documents',
    accent: '#fdba74',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    id: 'exercices',
    title: 'Exercices',
    subtitle: 'QCM & Évaluations',
    href: '/exercices',
    accent: '#f97316',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'ia',
    title: 'SunuIA',
    subtitle: 'Tuteur Intelligent',
    href: '/ia',
    accent: '#fb923c',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export const RotatingResourcesCylinder: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const hasMovedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCards = RESOURCES.length;
  const anglePerCard = 360 / totalCards;

  // Gentle auto-rotation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev - 0.22) % 360);
    }, 28);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch and Mouse Drag handlers
  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = clientX;
    startAngleRef.current = rotationAngle;
    setIsPaused(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    if (Math.abs(deltaX) > 3) {
      hasMovedRef.current = true;
    }
    // Convert drag pixels to rotation degrees
    const sensitivity = 0.45;
    setRotationAngle(startAngleRef.current + deltaX * sensitivity);
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
    // Resume auto-rotation after 1.8s
    setTimeout(() => {
      setIsPaused(false);
    }, 1800);
  };

  return (
    <div
      className="cylinder-carousel-root"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDraggingRef.current) setIsPaused(false);
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      aria-label="Carrousel rotatif des ressources Sunubiblio"
    >
      {/* 3D Scene viewport */}
      <div className="cylinder-viewport">
        <div
          className="cylinder-track"
          style={{
            transform: `rotateY(${rotationAngle}deg)`,
          }}
        >
          {RESOURCES.map((item, index) => {
            const cardAngle = index * anglePerCard;
            // Calculate effective orientation relative to front to soften rear cards
            const currentEffectiveAngle = ((cardAngle + rotationAngle) % 360 + 360) % 360;
            const isFacingFront = currentEffectiveAngle < 90 || currentEffectiveAngle > 270;
            const opacity = isFacingFront ? 1 : 0.25;

            return (
              <div
                key={item.id}
                className="cylinder-card-slot"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(var(--cylinder-radius))`,
                  opacity,
                  pointerEvents: isFacingFront ? 'auto' : 'none',
                }}
              >
                <Link
                  href={item.href}
                  className="glass-resource-card"
                  onClick={(e) => {
                    // Prevent navigation if user dragged
                    if (hasMovedRef.current) {
                      e.preventDefault();
                    }
                  }}
                  title={item.title}
                >
                  {/* Subtle top specular glass glare */}
                  <span className="card-glass-specular" />

                  {/* Icon circle */}
                  <div className="card-icon-bubble" style={{ color: item.accent }}>
                    {item.icon}
                  </div>

                  {/* Title and subtitle */}
                  <div className="card-meta">
                    <span className="card-title">{item.title}</span>
                    <span className="card-subtitle">{item.subtitle}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cylinder-carousel-root {
          width: 100%;
          max-width: 980px;
          margin-top: 26px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          touch-action: pan-y;
        }

        .cylinder-carousel-root:active {
          cursor: grabbing;
        }

        .cylinder-viewport {
          width: 100%;
          height: 145px;
          perspective: 1100px;
          perspective-origin: 50% 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: visible;
        }

        .cylinder-track {
          width: 100%;
          height: 100%;
          position: absolute;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.08s linear;
          will-change: transform;
        }

        :global(:root) {
          --cylinder-radius: 340px;
          --cylinder-card-w: 135px;
          --cylinder-card-h: 120px;
        }

        @media (max-width: 768px) {
          :global(:root) {
            --cylinder-radius: 240px;
            --cylinder-card-w: 110px;
            --cylinder-card-h: 105px;
          }
        }

        @media (max-width: 480px) {
          :global(:root) {
            --cylinder-radius: 195px;
            --cylinder-card-w: 96px;
            --cylinder-card-h: 96px;
          }
        }

        .cylinder-card-slot {
          position: absolute;
          width: var(--cylinder-card-w);
          height: var(--cylinder-card-h);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
          backface-visibility: hidden;
        }

        /* Glassmorphism Frosted Glass Surface (style Image 2) */
        .glass-resource-card {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 10px 8px;
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(30, 22, 18, 0.72) 40%,
            rgba(20, 15, 12, 0.85) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1.2px solid rgba(255, 255, 255, 0.2);
          box-shadow:
            0 14px 30px -4px rgba(0, 0, 0, 0.65),
            0 0 1px 1px rgba(234, 88, 12, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.35);
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .glass-resource-card:hover {
          transform: translateY(-5px) scale(1.05);
          border-color: rgba(249, 115, 22, 0.75);
          box-shadow:
            0 18px 36px -4px rgba(234, 88, 12, 0.45),
            0 0 20px rgba(249, 115, 22, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .card-glass-specular {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          pointer-events: none;
        }

        .card-icon-bubble {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .glass-resource-card:hover .card-icon-bubble {
          transform: scale(1.1);
          background: rgba(249, 115, 22, 0.15);
          border-color: rgba(249, 115, 22, 0.35);
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 100%;
        }

        .card-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .card-subtitle {
          font-size: 10px;
          font-weight: 450;
          color: #a1a1aa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        @media (max-width: 480px) {
          .cylinder-viewport {
            height: 120px;
          }

          .card-icon-bubble {
            width: 30px;
            height: 30px;
            margin-bottom: 4px;
          }

          .card-icon-bubble :global(svg) {
            width: 17px;
            height: 17px;
          }

          .card-title {
            font-size: 11px;
          }

          .card-subtitle {
            font-size: 9px;
          }

          .cylinder-carousel-root {
            margin-top: 14px;
          }
        }
      `}</style>
    </div>
  );
};
