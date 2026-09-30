import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root footer-minimal">
      <div className="container footer-container">
        <div className="footer-minimal-row">
          {/* Gauche : Logo Sunubiblio (+ Slogan sur grand écran) */}
          <div className="footer-left-side">
            <Link href="/" className="footer-logo-link" aria-label="Accueil Sunubiblio">
              <img
                src="/logo.svg"
                alt="Sunubiblio"
                width={22}
                height={22}
                className="footer-logo-img"
              />
              <span className="footer-brand-title">Sunubiblio</span>
            </Link>
            <span className="footer-slogan-desktop desktop-only">
              · La plateforme numérique du savoir et de la réussite.
            </span>
          </div>

          {/* Droite : Copyright & Petit Fall (même couleur discrète) */}
          <div className="footer-right-side">
            <span className="footer-copyright-full desktop-only">
              © 2026 Sunubiblio — Tous droits réservés · Petit Fall
            </span>
            <span className="footer-copyright-mobile mobile-only">
              © 2026 Sunubiblio · Petit Fall
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
