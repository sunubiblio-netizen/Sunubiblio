'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AppLauncherPanel } from './app-launcher/AppLauncherPanel';

export const AppLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() || '/';

  // Fermer automatiquement le lanceur lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Gestion de la fermeture au clic extérieur et touche Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerBtnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Empêcher le défilement de l'arrière-plan sur petit écran mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleLauncher = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerBtnRef.current?.focus();
  };

  return (
    <div className="app-launcher-wrapper" ref={launcherRef}>
      {/* Bouton Grille 3x3 (9 points) inspiré de Google Apps avec design Sunubiblio */}
      <button
        ref={triggerBtnRef}
        type="button"
        className={`app-launcher-btn ${isOpen ? 'is-active' : ''}`}
        onClick={toggleLauncher}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "Fermer le centre d'applications" : "Applications et services Sunubiblio"}
        title="Centre d'applications Sunubiblio"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="app-grid-icon"
        >
          {/* Grille 3x3 de 9 points arrondis élégants */}
          <circle cx="4.5" cy="4.5" r="2" />
          <circle cx="12" cy="4.5" r="2" />
          <circle cx="19.5" cy="4.5" r="2" />
          <circle cx="4.5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19.5" cy="12" r="2" />
          <circle cx="4.5" cy="19.5" r="2" />
          <circle cx="12" cy="19.5" r="2" />
          <circle cx="19.5" cy="19.5" r="2" />
        </svg>
      </button>

      {/* Panneau Flottant Déroulant (Desktop) & Bottom Sheet Déroulant (Mobile) */}
      {isOpen && (
        <>
          {/* Backdrop mobile pour fermeture au clic */}
          <div
            className="launcher-mobile-backdrop"
            onClick={handleClose}
            aria-hidden="true"
          />

          <AppLauncherPanel
            currentPathname={pathname}
            onClose={handleClose}
          />
        </>
      )}
    </div>
  );
};

