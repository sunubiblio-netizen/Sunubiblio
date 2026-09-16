'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export const HelpPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="help-popover-wrapper" ref={popoverRef}>
      <button
        type="button"
        className={`header-icon-btn ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Aide et assistance"
        title="Centre d'aide & Contact"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {isOpen && (
        <div className="help-dropdown-card" role="dialog" aria-label="Menu d'assistance">
          <div className="help-card-header">
            <span className="card-heading">Aide & Support</span>
            <span className="help-tag">Sunubiblio Care</span>
          </div>

          <div className="help-links-list">
            <Link
              href="/contact"
              className="help-link-row"
              onClick={() => setIsOpen(false)}
            >
              <div className="help-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="help-link-texts">
                <strong>Contacter l'Assistance</strong>
                <span>Support réactif par formulaire et WhatsApp</span>
              </div>
            </Link>

            <Link
              href="/a-propos#faq"
              className="help-link-row"
              onClick={() => setIsOpen(false)}
            >
              <div className="help-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="help-link-texts">
                <strong>Foire Aux Questions (FAQ)</strong>
                <span>Abonnements, paiements Wave/OM, lecture hors-ligne</span>
              </div>
            </Link>

            <Link
              href="/tarifs"
              className="help-link-row"
              onClick={() => setIsOpen(false)}
            >
              <div className="help-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <div className="help-link-texts">
                <strong>Formules & Tarifs</strong>
                <span>Détails des abonnements Simple et Gold</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
