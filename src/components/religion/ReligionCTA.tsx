'use client';

import React from 'react';
import Link from 'next/link';

export const ReligionCTA: React.FC = () => {
  return (
    <section className="religion-cta-section">
      <div className="container">
        <div className="religion-cta-box">
          <div className="cta-left-content">
            <span className="cta-badge">Catalogue Global</span>
            <h3 className="cta-heading">
              Vous recherchez d'autres disciplines académiques ou scolaires ?
            </h3>
            <p className="cta-paragraph">
              Accédez à des milliers d'annales de concours officiels, programmes scolaires du primaire au doctorat, cours universitaires et manuels certifiés sur Sunubiblio.
            </p>
          </div>

          <div className="cta-action-wrap">
            <Link href="/bibliotheque" className="btn-primary cta-main-btn">
              <span>Explorer la bibliothèque générale</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
