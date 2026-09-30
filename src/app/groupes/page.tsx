'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { StudyGroup, CreateGroupInput } from '@/types/community';
import { CommunityService } from '@/services/communityService';
import { CreateGroupModal } from '@/components/community/CreateGroupModal';
import { useDragScroll } from '@/hooks/useDragScroll';
import './groupes.css';

export type GroupTabType = 'all' | 'Lycée' | 'Université' | 'Concours' | 'my-groups';

export default function GroupesDirectoryPage() {
  const tabsScrollRef = useDragScroll<HTMLDivElement>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Données
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  // Onglet pilule actif
  const [activeTab, setActiveTab] = useState<GroupTabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const visibilityMenuRef = useRef<HTMLDivElement>(null);

  // Modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fermer le menu de visibilité au clic extérieur
  useEffect(() => {
    if (!isVisibilityOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (visibilityMenuRef.current && !visibilityMenuRef.current.contains(e.target as Node)) {
        setIsVisibilityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisibilityOpen]);

  // Charger les groupes
  useEffect(() => {
    const loaded = CommunityService.getStudyGroups();
    setGroups(loaded);
  }, []);

  // Basculer l'adhésion d'un groupe
  const handleToggleJoin = (groupId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = CommunityService.toggleJoinGroup(groupId);
    setGroups(updated);
  };

  // Création d'un groupe
  const handleCreateGroup = (input: CreateGroupInput) => {
    CommunityService.createGroup(input);
    const updatedList = CommunityService.getStudyGroups();
    setGroups(updatedList);
    setIsCreateModalOpen(false);
  };

  // Groupes filtrés
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      // 1. Onglet actif
      if (activeTab === 'my-groups') {
        if (!g.isJoined) return false;
      } else if (activeTab === 'Lycée') {
        if (g.category !== 'Lycée') return false;
      } else if (activeTab === 'Université') {
        if (g.category !== 'Université') return false;
      } else if (activeTab === 'Concours') {
        if (g.category !== 'Concours' && !g.contest) return false;
      }

      // 2. Visibilité
      if (visibilityFilter !== 'all' && g.visibility !== visibilityFilter) {
        return false;
      }

      // 3. Recherche texte
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = g.name.toLowerCase().includes(query);
        const matchDesc = g.description.toLowerCase().includes(query);
        const matchSubj = g.subject ? g.subject.toLowerCase().includes(query) : false;
        const matchContest = g.contest ? g.contest.toLowerCase().includes(query) : false;
        if (!matchName && !matchDesc && !matchSubj && !matchContest) return false;
      }

      return true;
    });
  }, [groups, activeTab, visibilityFilter, searchTerm]);

  // Groupes populaires pour la colonne latérale
  const popularGroups = useMemo(() => {
    return [...groups].sort((a, b) => b.memberCount - a.memberCount).slice(0, 4);
  }, [groups]);

  const tabs: { id: GroupTabType; label: string; shortLabel: string; icon: string }[] = [
    { id: 'all', label: 'Tous les groupes', shortLabel: 'Tous', icon: '🌐' },
    { id: 'Lycée', label: 'Lycée & Bac', shortLabel: 'Lycée', icon: '🎓' },
    { id: 'Université', label: 'Université & Sup.', shortLabel: 'Supérieur', icon: '🏛️' },
    { id: 'Concours', label: 'Concours direct', shortLabel: 'Concours', icon: '🏆' },
    { id: 'my-groups', label: 'Mes groupes', shortLabel: 'Mes groupes', icon: '🌟' },
  ];

  return (
    <div className="communaute-page-root groupes-page-root">
      <Navbar
        activePage="groupes"
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="communaute-hero-titles">
              <div className="communaute-title-row">
                <h1>Groupes</h1>
                <span className="communaute-hero-badge">Entraide & Savoirs</span>
              </div>
              <p className="communaute-hero-desc">
                Rejoignez des groupes d'études par concours, matière ou niveau pour réviser à plusieurs.
              </p>
            </div>
          </div>

          <div className="communaute-hero-actions">
            <button
              type="button"
              className="btn-create-community-primary"
              onClick={() => setIsCreateModalOpen(true)}
              aria-label="Créer un groupe"
            >
              <svg className="create-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="create-btn-text">Créer un groupe</span>
            </button>
          </div>
        </header>

        {/* 2. NAVIGATION PAR ONGLETS PILULES — Capsule douce style Communauté */}
        <nav className="communaute-tabs-nav-wrapper" aria-label="Navigation des groupes">
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
          <aside className="communaute-left-sidebar" aria-label="Filières et filtres">
            <div className="communaute-nav-card">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 12px 2px 12px' }}>
                Filières d'études
              </span>

              {[
                { id: 'all', label: 'Toutes les filières', icon: '🌐' },
                { id: 'Lycée', label: 'Lycée & Baccalauréat', icon: '🎓' },
                { id: 'Université', label: 'Université & Supérieur', icon: '🏛️' },
                { id: 'Concours', label: 'Concours direct (ENA...)', icon: '🏆' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`communaute-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id as GroupTabType)}
                >
                  <span className="communaute-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="communaute-sidebar-block">
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title">Populaires en ce moment</h3>
              </div>
              <div className="communaute-mini-list">
                {popularGroups.map((grp) => (
                  <div
                    key={`pop-${grp.id}`}
                    className="communaute-mini-row"
                    onClick={() => {
                      setActiveTab(grp.category === 'Lycée' ? 'Lycée' : grp.category === 'Université' ? 'Université' : 'Concours');
                    }}
                  >
                    <div className="communaute-mini-avatar">{grp.icon || '📚'}</div>
                    <div className="communaute-mini-info">
                      <span className="communaute-mini-name">{grp.name}</span>
                      <span className="communaute-mini-members">👥 {grp.memberCount} membres</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Colonne Centrale : Barre de recherche + Cartes de Groupes */}
          <section className="communaute-center-column" aria-label="Liste des groupes">
            {/* Barre d'outils unifiée : Recherche + Sélecteur d'accès */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Rechercher par matière, concours (ENA, FASTEF), niveau..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="composer-input-field search-input-with-icon"
                  style={{ width: '100%', paddingLeft: '38px', height: '38px', borderRadius: '12px' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '14px',
                    pointerEvents: 'none',
                  }}
                >
                  🔍
                </span>
              </div>

              {/* Menu déroulant de visibilité */}
              <div className="communaute-sort-dropdown-wrap" ref={visibilityMenuRef}>
                <button
                  type="button"
                  className="communaute-sort-pill-trigger"
                  onClick={() => setIsVisibilityOpen((prev) => !prev)}
                  aria-expanded={isVisibilityOpen}
                  aria-label="Filtrer par type d'accès"
                >
                  <span className="sort-pill-icon">
                    {visibilityFilter === 'all' && '🌐'}
                    {visibilityFilter === 'public' && '🌐'}
                    {visibilityFilter === 'private' && '🔒'}
                  </span>
                  <span className="sort-pill-label">
                    {visibilityFilter === 'all' && 'Tous accès'}
                    {visibilityFilter === 'public' && 'Publics'}
                    {visibilityFilter === 'private' && 'Sur validation'}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`sort-pill-chevron ${isVisibilityOpen ? 'rotated' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isVisibilityOpen && (
                  <div className="communaute-sort-menu-panel" role="menu">
                    {[
                      { value: 'all', label: 'Tous accès', icon: '🌐' },
                      { value: 'public', label: 'Publics', icon: '🌐' },
                      { value: 'private', label: 'Sur validation', icon: '🔒' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`sort-menu-item ${visibilityFilter === opt.value ? 'active' : ''}`}
                        onClick={() => {
                          setVisibilityFilter(opt.value as any);
                          setIsVisibilityOpen(false);
                        }}
                        role="menuitem"
                      >
                        <span className="sort-item-icon">{opt.icon}</span>
                        <span className="sort-item-text">{opt.label}</span>
                        {visibilityFilter === opt.value && (
                          <svg className="sort-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grille fluide des groupes (exact style Communauté) */}
            <div className="groups-directory-grid">
              {filteredGroups.length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '48px 20px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                  }}
                >
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>🔍</span>
                  <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Aucun groupe ne correspond à votre recherche</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>Créez votre propre groupe d'études pour réviser avec vos camarades !</p>
                  <button
                    type="button"
                    className="btn-create-community-primary"
                    style={{ margin: '14px auto 0 auto' }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    + Créer ce groupe
                  </button>
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.id} className="group-directory-card">
                    <div className="group-card-top">
                      <div className="group-card-icon">{group.icon || '📚'}</div>
                      <div className="group-card-info">
                        <Link href={`/groupes/${group.id}`} style={{ textDecoration: 'none' }}>
                          <h3 className="group-card-name">{group.name}</h3>
                        </Link>
                        <div className="group-card-badge-row">
                          <span className="group-type-badge">{group.category}</span>
                          {group.contest && (
                            <span className="group-type-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                              {group.contest}
                            </span>
                          )}
                          {group.visibility === 'private' && (
                            <span className="group-type-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              🔒 Privé
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="group-card-desc">{group.description}</p>

                    {group.subject && (
                      <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎯 Matière :</span>
                        <strong>{group.subject}</strong>
                      </div>
                    )}

                    <div className="group-card-footer">
                      <span className="group-members-count-pill">
                        👥 {group.memberCount} membres
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/groupes/${group.id}`}
                          className="btn-modal-cancel"
                          style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                        >
                          Ouvrir →
                        </Link>

                        <button
                          type="button"
                          className={`btn-widget-action ${group.isJoined ? 'joined' : ''}`}
                          onClick={() => handleToggleJoin(group.id)}
                        >
                          {group.isJoined ? '✓ Membre' : 'Rejoindre'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Colonne Droite Desktop */}
          <aside className="communaute-right-sidebar" aria-label="Conseils d'entraide">
            <div className="communaute-sidebar-block" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', borderColor: '#dbeafe' }}>
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title" style={{ color: '#1e3a8a' }}>🤝 Esprit d'Entraide</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Chaque groupe d’études est un espace de partage loyal et d’émulation mutuelle. Posez vos questions sans hésiter et progressez ensemble !
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Modale de création d'un groupe */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

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
