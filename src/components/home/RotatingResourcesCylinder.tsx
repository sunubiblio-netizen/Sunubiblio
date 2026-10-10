'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  accent: string;
  icon: React.ReactNode;
}

const BASE_RESOURCES: ResourceItem[] = [
  {
    id: 'bibliotheque',
    title: 'Bibliothèque',
    subtitle: '12 400+ Ouvrages',
    href: '/bibliotheque',
    accent: '#f97316',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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
    subtitle: 'ENA, FASTEF...',
    href: '/concours',
    accent: '#f59e0b',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
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
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9 9 0 0 0 12 3z" />
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
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
        <path d="m9 11 3 3L22 4" />
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
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
];

// 4 repeated sets to ensure infinite seamless track looping
const LOOP_RESOURCES = [
  ...BASE_RESOURCES,
  ...BASE_RESOURCES,
  ...BASE_RESOURCES,
  ...BASE_RESOURCES,
];

export const RotatingResourcesCylinder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    let animId: number;
    const speed = 0.55; // Pixels per frame for smooth continuous glide

    const update3DTransforms = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const isMobile = window.innerWidth <= 640;
      const cardWidth = isMobile ? 98 : 120;
      const cardGap = isMobile ? 8 : 12;
      const cardStep = cardWidth + cardGap;
      const singleSetWidth = BASE_RESOURCES.length * cardStep; // 7 * step

      // Wrap around for endless looping
      if (offsetRef.current >= singleSetWidth) {
        offsetRef.current -= singleSetWidth;
      } else if (offsetRef.current < 0) {
        offsetRef.current += singleSetWidth;
      }

      const containerWidth = container.offsetWidth;
      const center = containerWidth / 2;
      const currentOffset = offsetRef.current;

      track.style.transform = `translateX(-${currentOffset}px)`;

      // Dynamic 3D panoramic curve: curves cards inward towards the depth at the sides
      const cards = track.children;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const cardLeft = i * cardStep - currentOffset;
        const cardCenter = cardLeft + cardWidth / 2;
        const distFromCenter = cardCenter - center;
        const normDist = distFromCenter / (containerWidth / 2);
        const clampedNorm = Math.max(-1.25, Math.min(1.25, normDist));

        const rotY = -clampedNorm * 20;
        const transZ = -Math.pow(Math.abs(clampedNorm), 1.35) * 35;
        const scale = 1 - Math.abs(clampedNorm) * 0.05;
        const opacity = Math.max(0.45, 1 - Math.pow(Math.abs(clampedNorm), 2) * 0.45);

        card.style.transform = `rotateY(${rotY}deg) translateZ(${transZ}px) scale(${scale})`;
        card.style.opacity = `${opacity}`;
      }
    };

    const loop = () => {
      if (!isPausedRef.current) {
        offsetRef.current += speed;
      }
      update3DTransforms();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Drag and touch interaction handlers
  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = clientX;
    startOffsetRef.current = offsetRef.current;
    isPausedRef.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = startXRef.current - clientX;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    offsetRef.current = startOffsetRef.current + deltaX;
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      isPausedRef.current = false;
    }, 1200);
  };

  return (
    <div
      className="arc-carousel-container"
      ref={containerRef}
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (!isDraggingRef.current) isPausedRef.current = false;
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      aria-label="Carrousel 3D incurvé des 7 ressources Sunubiblio"
    >
      {/* 3D Viewport with side gradient mask */}
      <div className="arc-viewport">
        <div className="arc-track" ref={trackRef}>
          {LOOP_RESOURCES.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.href}
              className="arc-glass-card"
              onClick={(e) => {
                if (hasDraggedRef.current) e.preventDefault();
              }}
              title={item.title}
            >
              {/* Icône rigoureusement centrée dans sa carte */}
              <div
                className="card-icon-wrap"
                style={{ color: item.accent }}
              >
                {item.icon}
              </div>

              {/* Titre & sous-titre rigoureusement centrés */}
              <div className="card-text-group">
                <span className="card-main-title">{item.title}</span>
                <span className="card-sub-info">{item.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

