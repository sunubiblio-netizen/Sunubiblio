'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  activePage?: 'accueil' | 'bibliotheque' | 'concours' | 'tarifs' | 'apropos' | 'contact' | string;
  hideOnMobile?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, activePage = 'accueil', hideOnMobile = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  return (
    <header className={`navbar-wrapper ${hideOnMobile ? 'desktop-only-navbar' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo & Name strictly side-by-side with tight spacing */}
        <Link
          href="/"
          className="brand-link"
          style={{
            display: 'inline-flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <div
            className="brand-logo-wrap"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              flexShrink: 0,
              lineHeight: 0,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="6 6 88 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="navPet1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="navPet2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="navPet3" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="navPet4" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <g transform="translate(50,50)">
                <path d="M 0,-6 C 12,-28 28,-36 36,-28 C 44,-20 36,-4 14,0 Z" fill="url(#navPet1)" />
                <path d="M 6,0 C 28,12 36,28 28,36 C 20,44 4,36 0,14 Z" fill="url(#navPet2)" />
                <path d="M 0,6 C -12,28 -28,36 -36,28 C -44,20 -36,4 -14,0 Z" fill="url(#navPet3)" />
                <path d="M -6,0 C -28,-12 -36,-28 -28,-36 C -20,-44 -4,-36 0,-14 Z" fill="url(#navPet4)" />
              </g>
            </svg>
          </div>
          <span
            className="brand-name"
            style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#1e1b4b',
              lineHeight: 1,
              margin: 0,
              padding: 0,
              display: 'inline-block',
            }}
          >
            Sunubiblio
          </span>
        </Link>

        {/* Center Nav Links: fixed navigation items */}
        <nav className="nav-links desktop-only">
          <Link href="/" className={`nav-link ${activePage === 'accueil' ? 'active' : ''}`}>
            Accueil
            {activePage === 'accueil' && <span className="active-indicator" />}
          </Link>
          <Link href="/bibliotheque" className={`nav-link ${activePage === 'bibliotheque' ? 'active' : ''}`}>
            Bibliothèque
            {activePage === 'bibliotheque' && <span className="active-indicator" />}
          </Link>
          <Link href="/education" className={`nav-link ${activePage === 'education' ? 'active' : ''}`}>
            Éducation
            {activePage === 'education' && <span className="active-indicator" />}
          </Link>
          <Link href="/concours" className={`nav-link ${activePage === 'concours' ? 'active' : ''}`}>
            Concours
            {activePage === 'concours' && <span className="active-indicator" />}
          </Link>
          <Link href="/tarifs" className={`nav-link ${activePage === 'tarifs' ? 'active' : ''}`}>
            Tarifs
            {activePage === 'tarifs' && <span className="active-indicator" />}
          </Link>
          <Link href="/a-propos" className={`nav-link ${activePage === 'apropos' ? 'active' : ''}`}>
            À propos
            {activePage === 'apropos' && <span className="active-indicator" />}
          </Link>
        </nav>

        {/* Search Bar in Header */}
        <div className="nav-search desktop-only">
          <svg className="nav-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un livre, document, sujet..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            className="nav-search-input"
          />
        </div>

        {/* Actions (Contact Link + Login + Register) */}
        <div className="nav-actions desktop-only">
          <Link
            href="/contact"
            className={`nav-contact-link ${activePage === 'contact' ? 'is-active' : ''}`}
            title="Assistance & Contact"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Contact</span>
          </Link>
          <button
            type="button"
            className="btn-secondary nav-btn"
            onClick={() => onOpenAuth && onOpenAuth('login')}
          >
            Se connecter
          </button>
          <button
            type="button"
            className="btn-primary nav-btn-cta"
            onClick={() => onOpenAuth && onOpenAuth('register')}
          >
            S'inscrire
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer mobile-only">
          <div className="mobile-search-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un document..."
              className="mobile-search-input"
            />
          </div>
          <div className="mobile-nav-items">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'accueil' ? 'active' : ''}`}>Accueil</Link>
            <Link href="/bibliotheque" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'bibliotheque' ? 'active' : ''}`}>Bibliothèque</Link>
            <Link href="/education" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'education' ? 'active' : ''}`}>Éducation</Link>
            <Link href="/concours" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'concours' ? 'active' : ''}`}>Concours</Link>
            <Link href="/exercices" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'exercices' ? 'active' : ''}`}>Exercices</Link>
            <Link href="/religion" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'religion' ? 'active' : ''}`}>Religion</Link>
            <Link href="/tarifs" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'tarifs' ? 'active' : ''}`}>Tarifs</Link>
            <Link href="/a-propos" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'apropos' ? 'active' : ''}`}>À propos</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item ${activePage === 'contact' ? 'active' : ''}`}>Contact</Link>
          </div>
          <div className="mobile-auth-actions">
            <button
              className="btn-secondary w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth && onOpenAuth('login');
              }}
            >
              Se connecter
            </button>
            <button
              className="btn-primary w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth && onOpenAuth('register');
              }}
            >
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
