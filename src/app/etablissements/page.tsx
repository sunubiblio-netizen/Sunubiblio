'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { MOCK_ETABLISSEMENTS, EtablissementItem } from '@/data/mockEtablissements';

type FilterType = 'all' | 'universite' | 'ecole' | 'institut' | 'inscriptions' | 'bourses' | 'portes_ouvertes';

export default function EtablissementsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementItem | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const filteredEtablissements = useMemo(() => {
    return MOCK_ETABLISSEMENTS.filter((item) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formations.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'universite') return item.type === 'universite';
      if (activeFilter === 'ecole') return item.type === 'ecole';
      if (activeFilter === 'institut') return item.type === 'institut';
      if (activeFilter === 'inscriptions') return item.inscriptionsStatus === 'ouvertes';
      if (activeFilter === 'bourses') return (item.bourses && item.bourses.length > 0);
      if (activeFilter === 'portes_ouvertes') return !!item.portesOuvertes;

      return true;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="etablissements-page-root">
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="etablissements-main">
        {/* Hero Section */}
        <section className="etab-hero">
          <div className="container">
            <div className="etab-hero-inner">
              <div className="etab-badge">
                <span className="etab-badge-dot" />
                <span>Portail Académique & Institutionnel</span>
              </div>
              <h1 className="etab-title">
                Établissements & <span className="etab-title-gradient">Formations</span>
              </h1>
              <p className="etab-subtitle">
                Explorez les universités, grandes écoles et instituts de formation. Consultez les bourses, inscriptions en cours, portes ouvertes et programmes certifiés.
              </p>

              {/* Barre de recherche */}
              <div className="etab-search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher une école, université, diplôme ou formation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="etab-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la recherche"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 8 Composantes en Barres de Filtres Clés */}
        <section className="etab-filters-section">
          <div className="container">
            <div className="etab-filters-bar">
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Tous les établissements
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'universite' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('universite')}
              >
                🎓 Universités
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'ecole' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('ecole')}
              >
                🏫 Écoles
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'institut' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('institut')}
              >
                📚 Instituts & Centres
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'inscriptions' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('inscriptions')}
              >
                📝 Inscriptions Ouvertes
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'bourses' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('bourses')}
              >
                💰 Bourses & Opportunités
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'portes_ouvertes' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('portes_ouvertes')}
              >
                📅 Portes Ouvertes
              </button>
            </div>
          </div>
        </section>

        {/* Liste des Établissements */}
        <section className="etab-grid-section">
          <div className="container">
            <div className="etab-results-header">
              <span className="results-count">
                <strong>{filteredEtablissements.length}</strong> établissement{filteredEtablissements.length > 1 ? 's' : ''} répertorié{filteredEtablissements.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="etab-cards-grid">
              {filteredEtablissements.map((item) => (
                <article key={item.id} className="etab-card">
                  <div className="etab-card-header">
                    <div className="etab-logo-wrap">
                      <span className="etab-logo-text">{item.logoText}</span>
                    </div>
                    <div className="etab-meta-head">
                      <div className="etab-type-badge">{item.typeLabel}</div>
                      <h2 className="etab-card-title">{item.name}</h2>
                      <p className="etab-location">📍 {item.city}, {item.country}</p>
                    </div>
                  </div>

                  <p className="etab-desc">{item.description}</p>

                  {/* Annonces / Publicités officielles */}
                  {item.annonces && item.annonces.length > 0 && (
                    <div className="etab-annonces-block">
                      <div className="annonce-tag-row">
                        <span className="annonce-chip">📢 {item.annonces[0].badge}</span>
                        <span className="annonce-title">{item.annonces[0].titre}</span>
                      </div>
                    </div>
                  )}

                  {/* Formations Disponibles */}
                  <div className="etab-formations-block">
                    <h3 className="block-label">🎓 Formations & Filières :</h3>
                    <ul className="formations-list">
                      {item.formations.slice(0, 3).map((f, idx) => (
                        <li key={idx}>• {f}</li>
                      ))}
                      {item.formations.length > 3 && (
                        <li className="more-formations">+ {item.formations.length - 3} autres filières</li>
                      )}
                    </ul>
                  </div>

                  {/* Portes Ouvertes & Bourses */}
                  <div className="etab-quick-perks">
                    {item.portesOuvertes && (
                      <div className="perk-pill perk-calendar">
                        <span>📅 Portes ouvertes : {item.portesOuvertes.date}</span>
                      </div>
                    )}
                    {item.bourses && item.bourses.length > 0 && (
                      <div className="perk-pill perk-scholarship">
                        <span>💰 Bourses disponibles</span>
                      </div>
                    )}
                  </div>

                  {/* Bas de carte */}
                  <div className="etab-card-footer">
                    <div className="inscription-status-wrap">
                      {item.inscriptionsStatus === 'ouvertes' ? (
                        <span className="status-badge open">🟢 Inscriptions ouvertes</span>
                      ) : (
                        <span className="status-badge soon">🟡 Inscriptions bientôt</span>
                      )}
                      {item.inscriptionsDeadline && (
                        <span className="deadline-text">Jusqu’au {item.inscriptionsDeadline}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-details"
                      onClick={() => setSelectedEtablissement(item)}
                    >
                      Voir la fiche
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredEtablissements.length === 0 && (
              <div className="etab-empty-state">
                <p>Aucun établissement ne correspond à votre recherche.</p>
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Réinitialiser les critères
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Modal de Détails pour un Établissement */}
        {selectedEtablissement && (
          <div className="modal-backdrop" onClick={() => setSelectedEtablissement(null)}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="etab-type-badge">{selectedEtablissement.typeLabel}</span>
                  <h2 className="modal-title">{selectedEtablissement.name}</h2>
                  <p className="etab-location">📍 {selectedEtablissement.city}, {selectedEtablissement.country}</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedEtablissement(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h3 className="section-title">À propos de l’institution</h3>
                  <p>{selectedEtablissement.description}</p>
                </div>

                <div className="modal-section">
                  <h3 className="section-title">🎓 Toutes les formations disponibles</h3>
                  <ul className="modal-list">
                    {selectedEtablissement.formations.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {selectedEtablissement.bourses && selectedEtablissement.bourses.length > 0 && (
                  <div className="modal-section bourses-section">
                    <h3 className="section-title">💰 Bourses & Opportunités d’études</h3>
                    {selectedEtablissement.bourses.map((b, i) => (
                      <div key={i} className="bourse-card">
                        <strong>{b.titre}</strong>
                        <p className="bourse-type">Montant / Type : {b.montantOuType}</p>
                        <p className="bourse-cond">Conditions : {b.conditions}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedEtablissement.portesOuvertes && (
                  <div className="modal-section">
                    <h3 className="section-title">📅 Prochaines Portes Ouvertes</h3>
                    <p>Date : <strong>{selectedEtablissement.portesOuvertes.date}</strong></p>
                    <p>Lieu : {selectedEtablissement.portesOuvertes.lieu}</p>
                    <p>Format : {selectedEtablissement.portesOuvertes.mode.toUpperCase()}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cta-postuler"
                  onClick={() => {
                    setSelectedEtablissement(null);
                    handleOpenAuth('register');
                  }}
                >
                  Déposer un dossier d'inscription
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <style jsx>{`
        .etablissements-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .etablissements-main {
          flex: 1;
        }

        .etab-hero {
          background: linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 56px 0 40px;
          text-align: center;
        }

        .etab-hero-inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .etab-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .etab-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0284c7;
        }

        .etab-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
        }

        .etab-title-gradient {
          background: linear-gradient(135deg, #2563eb, #0d9488);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .etab-subtitle {
          font-size: 1rem;
          color: #475569;
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .etab-search-box {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 620px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          padding: 8px 18px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
          position: relative;
        }

        .search-icon {
          color: #64748b;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .etab-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.9375rem;
          color: #0f172a;
          background: transparent;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          color: #94a3b8;
          cursor: pointer;
          padding: 0 4px;
        }

        .etab-filters-section {
          padding: 20px 0;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
        }

        .etab-filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .filter-chip {
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.84rem;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          transition: all 0.16s ease;
        }

        .filter-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .filter-chip.is-active {
          background: #1e3a8a;
          color: #ffffff;
          border-color: #1e3a8a;
          box-shadow: 0 2px 8px rgba(30, 58, 138, 0.2);
        }

        .etab-grid-section {
          padding: 36px 0 64px;
        }

        .etab-results-header {
          margin-bottom: 22px;
          color: #64748b;
          font-size: 0.875rem;
        }

        .etab-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 22px;
        }

        .etab-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .etab-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.09);
          border-color: #cbd5e1;
        }

        .etab-card-header {
          display: flex;
          gap: 14px;
        }

        .etab-logo-wrap {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.9375rem;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .etab-meta-head {
          flex: 1;
        }

        .etab-type-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .etab-card-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
          line-height: 1.35;
        }

        .etab-location {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .etab-desc {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .etab-annonces-block {
          background: #eff6ff;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .annonce-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
        }

        .annonce-chip {
          font-weight: 700;
          color: #1d4ed8;
          white-space: nowrap;
        }

        .annonce-title {
          color: #1e293b;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .etab-formations-block {
          background: #f8fafc;
          border-radius: 10px;
          padding: 12px;
          border: 1px solid #f1f5f9;
        }

        .block-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
          margin: 0 0 6px;
        }

        .formations-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.75rem;
          color: #475569;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .more-formations {
          font-weight: 600;
          color: #2563eb;
          margin-top: 2px;
        }

        .etab-quick-perks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .perk-pill {
          font-size: 0.6875rem;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .perk-calendar {
          background: #fef3c7;
          color: #92400e;
        }

        .perk-scholarship {
          background: #ecfdf5;
          color: #065f46;
        }

        .etab-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .inscription-status-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-badge.open {
          color: #15803d;
        }

        .status-badge.soon {
          color: #b45309;
        }

        .deadline-text {
          font-size: 0.6875rem;
          color: #94a3b8;
        }

        .btn-details {
          padding: 7px 14px;
          border-radius: 8px;
          background: #1e3a8a;
          color: #ffffff;
          border: none;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-details:hover {
          background: #1d4ed8;
        }

        .etab-empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .btn-reset-filters {
          margin-top: 14px;
          padding: 8px 18px;
          border-radius: 8px;
          background: #1e3a8a;
          color: #ffffff;
          border: none;
          cursor: pointer;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }

        .modal-window {
          background: #ffffff;
          border-radius: 20px;
          max-width: 640px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 4px 0;
        }

        .modal-close-btn {
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          color: #64748b;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .modal-list {
          padding-left: 20px;
          margin: 0;
          color: #475569;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .bourse-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          font-size: 0.8125rem;
          margin-bottom: 8px;
        }

        .bourse-type {
          color: #0284c7;
          font-weight: 600;
          margin: 4px 0;
        }

        .bourse-cond {
          color: #64748b;
          margin: 0;
        }

        .modal-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
        }

        .btn-cta-postuler {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #ffffff;
          font-weight: 700;
          border: none;
          font-size: 0.9375rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
