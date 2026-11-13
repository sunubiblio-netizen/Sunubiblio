import React from 'react';
import Link from 'next/link';
import { BaatWordmark } from '@/components/ui/BaatWordmark';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root footer-minimal">
      <div className="container footer-container">
        <div className="footer-minimal-row">
          {/* Gauche : Logo BAAT (+ Slogan sur grand écran) */}
          <div className="footer-left-side">
            <Link href="/" className="footer-logo-link" aria-label="Accueil BAAT">
              <img
                src="/logo.svg"
                alt="BAAT"
                width={22}
                height={22}
                className="footer-logo-img"
              />
              <BaatWordmark height={17} color="#0f172a" className="footer-brand-wordmark" />
            </Link>
            <span className="footer-slogan-desktop desktop-only">
              · La plateforme numérique du savoir et de la réussite.
            </span>
          </div>

          {/* Droite : Copyright & Petit Fall (même couleur discrète) */}
          <div className="footer-right-side">
            <span className="footer-copyright-full desktop-only">
              © 2026 BAAT — Tous droits réservés · Petit Fall
            </span>
            <span className="footer-copyright-mobile mobile-only">
              © 2026 BAAT · Petit Fall
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
