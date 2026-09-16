'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  sellerName: string;
  sellerGrade: string;
  priceFcfa: number;
  pagesCount: number;
  rating: number;
  downloadsCount: number;
  description: string;
  badge?: string;
  format: 'PDF' | 'DOCX';
}

const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'Pack Fiches de Synthèse — FASTEF Épreuve de Didactique 2020-2025',
    category: 'Concours',
    sellerName: 'Amadou K. Ba',
    sellerGrade: 'Major FASTEF 2023',
    priceFcfa: 2500,
    pagesCount: 48,
    rating: 4.9,
    downloadsCount: 142,
    description: 'Résumés méthodologiques, tableaux synoptiques des théories didactiques et exemples de situations d’apprentissage.',
    badge: 'Coup de cœur',
    format: 'PDF',
  },
  {
    id: 'm2',
    title: 'Guide Pratique des 150 Cas Cliniques Corrigés — Internat en Médecine',
    category: 'Santé & Médecine',
    sellerName: 'Dr. Fatou Diallo',
    sellerGrade: 'Interne des Hôpitaux UCAD',
    priceFcfa: 5000,
    pagesCount: 112,
    rating: 5.0,
    downloadsCount: 89,
    description: 'Dossiers progressifs avec grilles de notation officielles et pièges diagnostiques fréquents.',
    badge: 'Vérifié',
    format: 'PDF',
  },
  {
    id: 'm3',
    title: 'Recueil d’Exercices Résolus — Algèbre Linéaire & Analyse L2/L3',
    category: 'Université',
    sellerName: 'Pr. M. Ndiaye',
    sellerGrade: 'Enseignant UGB',
    priceFcfa: 3000,
    pagesCount: 76,
    rating: 4.8,
    downloadsCount: 205,
    description: 'Démonstrations détaillées pas à pas avec rappels de cours synthétiques et théorèmes fondamentaux.',
    format: 'PDF',
  },
];

export default function MarketplacePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'my-sales'>('buy');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="marketplace-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="marketplace" />

      <main className="marketplace-main-content">
        {/* Hero Section Marketplace */}
        <section className="marketplace-hero-section">
          <div className="container">
            <div className="marketplace-hero-card">
              <div className="hero-tag-badge">
                <span>🛒 Place de Marché Pédagogique</span>
              </div>
              <h1 className="hero-main-heading">
                Achetez et Vendez des Ressources Éducatives Certifiées
              </h1>
              <p className="hero-subtext">
                Accédez à des fiches de synthèse, annales corrigées et mémoires rédigés par les meilleurs étudiants, majors de concours et enseignants certifiés du Sénégal.
              </p>

              <div className="hero-tab-toggle-row">
                <button
                  type="button"
                  className={`tab-toggle-btn ${activeTab === 'buy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('buy')}
                >
                  Explorer & Acheter
                </button>
                <button
                  type="button"
                  className={`tab-toggle-btn ${activeTab === 'sell' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sell')}
                >
                  Vendre une ressource
                </button>
                <button
                  type="button"
                  className={`tab-toggle-btn ${activeTab === 'my-sales' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-sales')}
                >
                  Mes Ventes & Revenus
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu de la Tab Explorer / Acheter */}
        {activeTab === 'buy' && (
          <section className="marketplace-catalog-section" id="acheter">
            <div className="container">
              {/* Barre de recherche locale spécialisée */}
              <div className="marketplace-search-row">
                <div className="marketplace-search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher une fiche, annale, auteur ou concours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="market-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grille des produits */}
              <div className="marketplace-grid">
                {filteredItems.map((item) => (
                  <article key={item.id} className="market-item-card">
                    <div className="item-card-top">
                      <div className="category-pill">{item.category}</div>
                      {item.badge && <span className="market-badge">{item.badge}</span>}
                    </div>

                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-desc">{item.description}</p>

                    <div className="item-seller-row">
                      <div className="seller-avatar-circle">
                        {item.sellerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="seller-info">
                        <strong className="seller-name">{item.sellerName}</strong>
                        <span className="seller-grade">{item.sellerGrade}</span>
                      </div>
                    </div>

                    <div className="item-specs-row">
                      <span>📄 {item.pagesCount} pages</span>
                      <span>⭐ {item.rating} / 5</span>
                      <span>📥 {item.downloadsCount} ventes</span>
                    </div>

                    <div className="item-price-cta-row">
                      <div className="price-block">
                        <span className="price-amount">{item.priceFcfa.toLocaleString('fr-FR')}</span>
                        <span className="price-currency">FCFA</span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary buy-btn"
                        onClick={() => handleOpenAuth('login')}
                      >
                        Acheter maintenant
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tab Vendre une ressource */}
        {activeTab === 'sell' && (
          <section className="marketplace-sell-section" id="vendre">
            <div className="container">
              <div className="sell-onboarding-card">
                <div className="sell-header">
                  <span className="sell-badge">Programme Créateurs Sunubiblio</span>
                  <h2>Publiez et Monétisez Vos Meilleures Fiches</h2>
                  <p>
                    Rejoignez les étudiants majors et enseignants qui partagent leur savoir et perçoivent des revenus sécurisés directement via Wave ou Orange Money.
                  </p>
                </div>

                <div className="sell-steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h4>Déposez votre document</h4>
                    <p>Format PDF ou Word. Notre équipe vérifie la qualité pédagogique et l'absence de plagiat.</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h4>Fixez votre prix</h4>
                    <p>De 1 000 à 15 000 FCFA selon la valeur de la ressource. Vous conservez 85% de chaque vente.</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h4>Recevez vos gains</h4>
                    <p>Paiements automatiques et instantanés sur votre compte Mobile Money dès chaque achat validé.</p>
                  </div>
                </div>

                <div className="sell-cta-box">
                  <button
                    type="button"
                    className="btn-primary start-sell-btn"
                    onClick={() => handleOpenAuth('login')}
                  >
                    Créer mon profil vendeur certifié
                  </button>
                  <span className="sell-terms-notice">
                    Vérification d’identité et conformité aux droits d’auteur obligatoires.
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab Mes Ventes & Revenus */}
        {activeTab === 'my-sales' && (
          <section className="marketplace-my-sales-section" id="mes-ventes">
            <div className="container">
              <div className="my-sales-dashboard-card">
                <h3>Tableau de bord Vendeur</h3>
                <div className="sales-kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">Revenus du mois</span>
                    <strong className="kpi-value">0 FCFA</strong>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">Ressources en ligne</span>
                    <strong className="kpi-value">0 document</strong>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">Total téléchargements</span>
                    <strong className="kpi-value">0 vente</strong>
                  </div>
                </div>

                <div className="my-sales-empty">
                  <p>Vous n'avez pas encore publié de ressource à vendre.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab('sell')}
                  >
                    Publier ma première ressource
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
