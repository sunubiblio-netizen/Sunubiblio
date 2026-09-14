import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        <div className="footer-main-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <svg width="34" height="34" viewBox="6 6 88 88" fill="none">
                <path d="M 0,-6 C 12,-28 28,-36 36,-28 C 44,-20 36,-4 14,0 Z" fill="#3B82F6" transform="translate(50,50)" />
                <path d="M 6,0 C 28,12 36,28 28,36 C 20,44 4,36 0,14 Z" fill="#06B6D4" transform="translate(50,50)" />
                <path d="M 0,6 C -12,28 -28,36 -36,28 C -44,20 -36,4 -14,0 Z" fill="#EC4899" transform="translate(50,50)" />
                <path d="M -6,0 C -28,-12 -36,-28 -28,-36 C -20,-44 -4,-36 0,-14 Z" fill="#9333EA" transform="translate(50,50)" />
              </svg>
              <span className="footer-brand-title">Sunubiblio</span>
            </div>
            <p className="footer-brand-desc">
              La plateforme numérique universelle dédiée au savoir, à la lecture et à la réussite académique & professionnelle en Afrique.
            </p>
            <div className="footer-badge-flag">
              <span className="dot-green" /> Fièrement propulsé au Sénégal 🇸🇳
            </div>
          </div>

          {/* Links Col 1: Plateforme */}
          <div className="footer-links-col">
            <h5 className="footer-col-heading">Plateforme</h5>
            <ul className="footer-links-list">
              <li><Link href="#bibliotheque">Bibliothèque numérique</Link></li>
              <li><Link href="#education">Programmes Éducation</Link></li>
              <li><Link href="#concours">Préparation Concours</Link></li>
              <li><Link href="#ia">Tuteur Intelligent IA</Link></li>
              <li><Link href="#exercices">Banque de QCM & Annales</Link></li>
            </ul>
          </div>

          {/* Links Col 2: Univers */}
          <div className="footer-links-col">
            <h5 className="footer-col-heading">Ressources</h5>
            <ul className="footer-links-list">
              <li><Link href="/documents">Documents administratifs</Link></li>
              <li><Link href="/religion">Spiritualité & Philosophie</Link></li>
              <li><Link href="#communaute">Groupes d'entraide</Link></li>
              <li><Link href="#telechargements">Accès hors-ligne</Link></li>
              <li><Link href="#tarifs">Plans & Abonnements</Link></li>
            </ul>
          </div>

          {/* Links Col 3: Support */}
          <div className="footer-links-col">
            <h5 className="footer-col-heading">Support & Légal</h5>
            <ul className="footer-links-list">
              <li><Link href="#aide">Centre d'aide</Link></li>
              <li><Link href="#contact">Nous contacter</Link></li>
              <li><Link href="#confidentialite">Politique de confidentialité</Link></li>
              <li><Link href="#cgu">Conditions Générales (CGU)</Link></li>
              <li><Link href="#faq">Foire aux questions (FAQ)</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} Sunubiblio. Tous droits réservés. L'excellence pour chaque apprenant.
          </p>
          <div className="social-links">
            <span className="social-pill">EdTech Sénégal</span>
            <span className="social-pill">Universal Knowledge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
