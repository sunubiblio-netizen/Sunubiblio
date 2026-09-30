'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import {
  PublicationItem,
  CreatePublicationInput,
  PublicationFormat,
} from '@/types/publication';
import { PublicationService } from '@/services/publicationService';
import { MOCK_PUBLICATIONS } from '@/data/mockPublicationsData';

import { CreatePublicationModal } from '@/components/publications/CreatePublicationModal';
import { SocialActions } from '@/components/social/SocialActions';
import { useDragScroll } from '@/hooks/useDragScroll';

import './publications.css';

export type PubTabType = 'all' | 'ressources' | 'questions' | 'examens' | 'saved';

export default function PublicationsPage() {
  const tabsScrollRef = useDragScroll<HTMLDivElement>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Données
  const [publications, setPublications] = useState<PublicationItem[]>(MOCK_PUBLICATIONS);

  // Onglet pilule actif (style Communauté)
  const [activeTab, setActiveTab] = useState<PubTabType>('all');

  // Filtre chip secondaire
  const [activeChip, setActiveChip] = useState<string>('all');

  // Tri
  const [sortOption, setSortOption] = useState<'recent' | 'populaire'>('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Brouillon rapide dans le composer
  const [quickDraft, setQuickDraft] = useState('');
  const [draftType, setDraftType] = useState<PublicationFormat>('text');

  // Modale de création complète
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialFormat, setCreateInitialFormat] = useState<PublicationFormat>('text');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Fermer le menu de tri au clic extérieur
  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  // Chargement initial des publications
  useEffect(() => {
    const posts = PublicationService.getPublications();
    if (posts && posts.length > 0) setPublications(posts);
  }, []);

  // Filtrage des publications
  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      // 1. Filtrage par onglet principal
      if (activeTab === 'saved') {
        if (!p.isSaved) return false;
      } else if (activeTab === 'ressources') {
        if (p.format !== 'resource' && !p.sharedResource) return false;
      } else if (activeTab === 'questions') {
        if (p.format !== 'text' && !p.content.includes('?')) return false;
      } else if (activeTab === 'examens') {
        const c = p.content.toLowerCase();
        if (!c.includes('bac') && !c.includes('concours') && !c.includes('examen') && !c.includes('fastef') && !c.includes('ena')) {
          return false;
        }
      }

      // 2. Filtrage par chip secondaire
      if (activeChip === 'maths') {
        return (
          p.content.toLowerCase().includes('math') ||
          p.sharedResource?.subject?.toLowerCase().includes('math')
        );
      }
      if (activeChip === 'sciences') {
        return (
          p.content.toLowerCase().includes('chimie') ||
          p.content.toLowerCase().includes('physique') ||
          p.content.toLowerCase().includes('svt')
        );
      }
      if (activeChip === 'lettres') {
        return (
          p.content.toLowerCase().includes('philo') ||
          p.content.toLowerCase().includes('histoire') ||
          p.content.toLowerCase().includes('français')
        );
      }

      return true;
    });
  }, [publications, activeTab, activeChip]);

  // Tri des publications
  const sortedPublications = useMemo(() => {
    if (sortOption === 'populaire') {
      return [...filteredPublications].sort((a, b) => (b.likesCount + (b.comments?.length || 0)) - (a.likesCount + (a.comments?.length || 0)));
    }
    return filteredPublications;
  }, [filteredPublications, sortOption]);

  // Actions
  const handleOpenCreateModal = (format: PublicationFormat = 'text') => {
    setCreateInitialFormat(format);
    setIsCreateModalOpen(true);
  };

  const handleQuickPublish = () => {
    if (!quickDraft.trim()) return;
    const newPost = PublicationService.createPublication({
      content: quickDraft.trim(),
      format: draftType,
      visibility: 'public',
      category: 'general',
    });
    setPublications((prev) => [newPost, ...prev]);
    setQuickDraft('');
    setDraftType('text');
    showToast('Publication partagée avec succès !');
  };

  const handleCreateSubmit = (input: CreatePublicationInput) => {
    const newPost = PublicationService.createPublication(input);
    setPublications((prev) => [newPost, ...prev]);
    showToast('Publication partagée avec succès !');
  };

  const handleLike = (id: string) => {
    const updated = PublicationService.toggleLike(id);
    setPublications(updated);
  };

  const handleSave = (id: string) => {
    const post = publications.find((p) => p.id === id);
    const wasSaved = post?.isSaved;
    const updated = PublicationService.toggleSave(id);
    setPublications(updated);
    showToast(
      wasSaved
        ? 'Publication retirée des favoris'
        : 'Publication enregistrée dans vos favoris !'
    );
  };

  const handleAddComment = (id: string, text: string) => {
    const updated = PublicationService.addComment(id, text);
    setPublications(updated);
    showToast('Commentaire publié !');
  };

  const handleShare = async (pub: PublicationItem) => {
    const updated = PublicationService.incrementShare(pub.id);
    setPublications(updated);

    const url = typeof window !== 'undefined' ? `${window.location.origin}/publications#publication-${pub.id}` : '';
    if (typeof navigator !== 'undefined' && navigator.clipboard && url) {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Lien de la publication copié dans le presse-papier !');
        return;
      } catch {
        // ignore
      }
    }
    showToast('Publication partagée !');
  };

  const tabs: { id: PubTabType; label: string; shortLabel: string; icon: string }[] = [
    { id: 'all', label: 'Toutes les publications', shortLabel: 'Tout', icon: '🌐' },
    { id: 'ressources', label: 'Ressources & Cours', shortLabel: 'Ressources', icon: '📚' },
    { id: 'questions', label: 'Questions & Débats', shortLabel: 'Questions', icon: '💬' },
    { id: 'examens', label: 'Bac & Concours', shortLabel: 'Examens', icon: '🎓' },
    { id: 'saved', label: 'Enregistrés', shortLabel: 'Favoris', icon: '🔖' },
  ];

  return (
    <div className="communaute-page-root publications-page-root">
      {/* Navigation globale Sunubiblio */}
      <Navbar
        activePage="publications"
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <main className="communaute-main-container">
        {/* 1. EN-TÊTE ÉPURÉ — Style Communauté */}
        <header className="communaute-hero-header">
          <div className="communaute-hero-left">
            <div className="communaute-hero-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </div>
            <div className="communaute-hero-titles">
              <div className="communaute-title-row">
                <h1>Publications</h1>
                <span className="communaute-hero-badge">Partage & Savoirs</span>
              </div>
              <p className="communaute-hero-desc">Partagez vos réflexions, vos fiches et posez vos questions d'études.</p>
            </div>
          </div>

          <div className="communaute-hero-actions">
            <button
              type="button"
              className="btn-create-community-primary"
              onClick={() => handleOpenCreateModal('text')}
              aria-label="Créer une publication"
            >
              <svg className="create-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="create-btn-text">Créer</span>
            </button>
          </div>
        </header>

        {/* 2. NAVIGATION PAR ONGLETS PILULES — Capsule douce style Communauté */}
        <nav className="communaute-tabs-nav-wrapper" aria-label="Navigation des publications">
          <div className="communaute-tabs-nav" ref={tabsScrollRef} role="tablist">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className={`communaute-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={isActive}
                >
                  <span className="communaute-tab-label-full">{tab.icon} {tab.label}</span>
                  <span className="communaute-tab-label-short">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3. GRILLE DE MISE EN PAGE : 3 colonnes Desktop / 1 colonne fluide Mobile */}
        <div className="communaute-layout-grid">
          {/* Colonne Gauche Desktop */}
          <aside className="communaute-left-sidebar" aria-label="Filtres thématiques">
            <div className="communaute-nav-card">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 12px 2px 12px' }}>
                Filtres & Thématiques
              </span>

              {[
                { id: 'all', label: 'Toutes les matières', icon: '🌐' },
                { id: 'maths', label: 'Mathématiques', icon: '📐' },
                { id: 'sciences', label: 'Physique & Chimie', icon: '🔬' },
                { id: 'lettres', label: 'Lettres & Philosophie', icon: '📖' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`communaute-nav-item ${activeChip === item.id ? 'active' : ''}`}
                  onClick={() => setActiveChip(item.id)}
                >
                  <span className="communaute-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="communaute-sidebar-block">
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title">Ressources en vedette</h3>
              </div>
              <div className="communaute-mini-list">
                <div className="communaute-mini-row" onClick={() => setActiveTab('examens')}>
                  <div className="communaute-mini-avatar">📐</div>
                  <div className="communaute-mini-info">
                    <span className="communaute-mini-name">Bac S1 — Fiche révision</span>
                    <span className="communaute-mini-members">Par Mamadou Diop</span>
                  </div>
                </div>
                <div className="communaute-mini-row" onClick={() => setActiveTab('examens')}>
                  <div className="communaute-mini-avatar">🏛️</div>
                  <div className="communaute-mini-info">
                    <span className="communaute-mini-name">Concours FASTEF 2026</span>
                    <span className="communaute-mini-members">Sujets & Corrigés</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Colonne Centrale : Composer + Barre d'outils + Flux */}
          <section className="communaute-center-column" aria-label="Flux principal des publications">
            {/* Boîte de publication compacte et fluide */}
            <div className="communaute-composer-card">
              <div className="communaute-composer-top">
                <div className="composer-user-avatar">
                  <img
                    src="/avatar_mamadou.jpg"
                    alt="Mamadou Diop"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <input
                  type="text"
                  className="composer-input-field"
                  placeholder="Que voulez-vous partager avec la communauté ?"
                  value={quickDraft}
                  onChange={(e) => setQuickDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickPublish();
                  }}
                />
              </div>

              <div className="communaute-composer-bottom">
                <div className="composer-actions-group">
                  <button
                    type="button"
                    className={`composer-attach-btn ${draftType === 'resource' ? 'active' : ''}`}
                    onClick={() => handleOpenCreateModal('resource')}
                    title="Partager un document ou un cours"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>Document</span>
                  </button>

                  <button
                    type="button"
                    className={`composer-attach-btn ${draftType === 'image' ? 'active' : ''}`}
                    onClick={() => handleOpenCreateModal('image')}
                    title="Ajouter une image"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span>Image</span>
                  </button>

                  <button
                    type="button"
                    className={`composer-attach-btn ${draftType === 'video' ? 'active' : ''}`}
                    onClick={() => handleOpenCreateModal('video')}
                    title="Ajouter une vidéo explicative"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                    <span>Vidéo</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="composer-publish-btn"
                  onClick={quickDraft.trim() ? handleQuickPublish : () => handleOpenCreateModal('text')}
                >
                  <span>Publier</span>
                </button>
              </div>
            </div>

            {/* Barre d'outils unifiée : Filtres + Menu de tri */}
            <div className="communaute-toolbar-row">
              <div className="communaute-filter-chips" role="tablist">
                {[
                  { id: 'all', label: 'Tout' },
                  { id: 'maths', label: '📐 Maths' },
                  { id: 'sciences', label: '🔬 Sciences' },
                  { id: 'lettres', label: '📖 Lettres' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className={`communaute-chip ${activeChip === chip.id ? 'active' : ''}`}
                    onClick={() => setActiveChip(chip.id)}
                    role="tab"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Menu de tri */}
              <div className="communaute-sort-dropdown-wrap" ref={sortMenuRef}>
                <button
                  type="button"
                  className="communaute-sort-pill-trigger"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  aria-expanded={isSortOpen}
                  aria-label="Trier les publications"
                >
                  <span className="sort-pill-icon">⇅</span>
                  <span className="sort-pill-label">
                    {sortOption === 'recent' ? 'Plus récent' : 'Populaire'}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`sort-pill-chevron ${isSortOpen ? 'rotated' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isSortOpen && (
                  <div className="communaute-sort-menu-panel" role="menu">
                    <button
                      type="button"
                      className={`sort-menu-item ${sortOption === 'recent' ? 'active' : ''}`}
                      onClick={() => {
                        setSortOption('recent');
                        setIsSortOpen(false);
                      }}
                      role="menuitem"
                    >
                      <span className="sort-item-icon">⚡</span>
                      <span className="sort-item-text">Plus récent</span>
                      {sortOption === 'recent' && (
                        <svg className="sort-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      className={`sort-menu-item ${sortOption === 'populaire' ? 'active' : ''}`}
                      onClick={() => {
                        setSortOption('populaire');
                        setIsSortOpen(false);
                      }}
                      role="menuitem"
                    >
                      <span className="sort-item-icon">🔥</span>
                      <span className="sort-item-text">Populaire</span>
                      {sortOption === 'populaire' && (
                        <svg className="sort-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Liste fluide des publications (Style exact cartes Communauté) */}
            <div className="communaute-feed-list">
              {sortedPublications.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 20px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                  }}
                >
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>📭</span>
                  <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Aucune publication dans cette rubrique</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>Soyez le premier à partager une ressource ou une question !</p>
                  <button
                    type="button"
                    className="btn-create-community-primary"
                    style={{ margin: '14px auto 0 auto' }}
                    onClick={() => {
                      setActiveTab('all');
                      setActiveChip('all');
                    }}
                  >
                    Revenir au flux principal
                  </button>
                </div>
              ) : (
                sortedPublications.map((item) => (
                  <article key={item.id} className="feed-activity-card">
                    {/* En-tête auteur */}
                    <div className="feed-card-header">
                      <div className="feed-card-author-left">
                        <img
                          src={item.authorAvatar || '/avatar_mamadou.jpg'}
                          alt={item.authorName}
                          className="feed-author-avatar-img"
                        />
                        <div className="feed-author-meta">
                          <div className="feed-author-name-row">
                            <span className="feed-author-name">{item.authorName}</span>
                            <span className="feed-role-badge">
                              {item.authorBadge || (item.authorRole.includes('Professeur') ? 'Professeur' : 'Membre actif')}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {item.timeAgo} • {item.authorRole}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
                        onClick={() => handleShare(item)}
                        title="Partager"
                        aria-label="Options"
                      >
                        •••
                      </button>
                    </div>

                    {/* Contenu textuel */}
                    <p className="feed-post-text">{item.content}</p>

                    {/* Carte ressource attachée si présente */}
                    {item.sharedResource && (
                      <div className="post-attached-resource-card">
                        <div className="resource-thumb-box">
                          <span style={{ fontSize: '20px' }}>📄</span>
                        </div>
                        <div className="resource-meta-info" style={{ minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {item.sharedResource.type?.toUpperCase() || 'RESSOURCE'}
                          </span>
                          <h4 className="resource-meta-title" style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 0 0', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.sharedResource.title}
                          </h4>
                          {item.sharedResource.subject && (
                            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.sharedResource.subject}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Media images si présents */}
                    {item.media && item.media.length > 0 && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        <img
                          src={item.media[0].url}
                          alt="Media"
                          style={{ width: '100%', maxHeight: '320px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Barre d'interaction SocialActions */}
                    <SocialActions
                      likesCount={item.likesCount}
                      commentsCount={item.commentsCount || 0}
                      sharesCount={item.sharesCount || 0}
                      isLiked={item.isLiked}
                      isSaved={item.isSaved}
                      onLike={() => handleLike(item.id)}
                      onSave={() => handleSave(item.id)}
                      onShare={() => handleShare(item)}
                      onComment={() => {
                        const commentText = prompt('Votre commentaire :');
                        if (commentText && commentText.trim()) {
                          handleAddComment(item.id, commentText.trim());
                        }
                      }}
                    />
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Colonne Droite Desktop */}
          <aside className="communaute-right-sidebar" aria-label="Recommandations et liens">
            <div className="communaute-sidebar-block">
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title">Conseils méthodologiques</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Révisez activement : faites une fiche synthétique par chapitre et testez-vous avec nos QCM interactifs.
              </p>
            </div>

            <div className="communaute-sidebar-block" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', borderColor: '#dbeafe' }}>
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title" style={{ color: '#1e3a8a' }}>Sunubiblio Gold</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45, margin: '0 0 10px 0' }}>
                Accédez aux corrections intégrales, aux corrigés d'annales de concours et au tuteur IA.
              </p>
              <a
                href="/tarifs"
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Découvrir l'offre →
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Modale de création complète */}
      <CreatePublicationModal
        isOpen={isCreateModalOpen}
        initialFormat={createInitialFormat}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 999999,
            fontSize: '13px',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          ✨ {toastMessage}
        </div>
      )}

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <Footer />
    </div>
  );
}
