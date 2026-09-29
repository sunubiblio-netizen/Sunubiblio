'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { StudyGroup, CreateGroupInput } from '@/types/community';
import { CommunityService } from '@/services/communityService';
import { CreateGroupModal } from '@/components/community/CreateGroupModal';
import './groupes.css';

export type GroupFilterType = 'all' | 'Lycée' | 'Université' | 'Concours' | 'Collège' | 'public' | 'private';

export default function GroupesDirectoryPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Données
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  // Filtre actif (comme sur la page Publications)
  const [activeFilter, setActiveFilter] = useState<GroupFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Charger les groupes
  useEffect(() => {
    const loaded = CommunityService.getStudyGroups();
    setGroups(loaded);
  }, []);

  // Basculer l'adhésion d'un groupe
  const handleToggleJoin = (groupId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = CommunityService.toggleJoinGroup(groupId);
    setGroups(updated);
  };

  // Création d'un groupe
  const handleCreateGroup = (input: CreateGroupInput) => {
    const created = CommunityService.createGroup(input);
    const updatedList = CommunityService.getStudyGroups();
    setGroups(updatedList);
    setIsCreateModalOpen(false);
  };

  // Puces de filtres horizontales défilables (identiques à la page Publications)
  const filterChips: { id: GroupFilterType; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'Tous les groupes', icon: '🌐', count: groups.length },
    { id: 'Lycée', label: 'Lycée & Bac', icon: '🎓' },
    { id: 'Université', label: 'Université & Supérieur', icon: '🏛️' },
    { id: 'Concours', label: 'Concours direct', icon: '🏆' },
    { id: 'Collège', label: 'Collège', icon: '📖' },
    { id: 'public', label: 'Publics', icon: '🌐' },
    { id: 'private', label: 'Sur validation', icon: '🔒' },
  ];

  // Mes groupes rejoints
  const myJoinedGroups = useMemo(() => {
    return groups.filter((g) => g.isJoined);
  }, [groups]);

  // Groupes les plus populaires
  const popularGroups = useMemo(() => {
    return [...groups].sort((a, b) => b.memberCount - a.memberCount).slice(0, 4);
  }, [groups]);

  // Groupes filtrés pour la découverte
  const discoverGroups = useMemo(() => {
    return groups.filter((g) => {
      // 1. Recherche texte
      const matchSearch =
        !searchTerm.trim() ||
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.subject && g.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.contest && g.contest.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Filtre actif (style Publication)
      let matchFilter = true;
      if (activeFilter === 'Lycée') {
        matchFilter = g.category === 'Lycée';
      } else if (activeFilter === 'Université') {
        matchFilter = g.category === 'Université';
      } else if (activeFilter === 'Concours') {
        matchFilter = g.category === 'Concours' || !!g.contest;
      } else if (activeFilter === 'Collège') {
        matchFilter = g.category === 'Collège';
      } else if (activeFilter === 'public') {
        matchFilter = g.visibility === 'public';
      } else if (activeFilter === 'private') {
        matchFilter = g.visibility === 'private';
      }

      return matchSearch && matchFilter;
    });
  }, [groups, searchTerm, activeFilter]);

  return (
    <div className="groupes-page-container">
      <Navbar
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <main className="groupes-main-content">
        {/* 1. Titre & Barre d'action supérieure */}
        <div className="groupes-header-row">
          <div className="groupes-header-left">
            <h1 className="groupes-page-title">
              <span>👥</span>
              <span>Groupes</span>
            </h1>
            <p className="groupes-page-subtitle">
              Collaborez, révisez et préparez vos examens et concours avec vos pairs
            </p>
          </div>

          {/* Bouton Créer Desktop */}
          <button
            type="button"
            className="groupes-btn-create-desktop"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span>+</span>
            <span>Créer un groupe</span>
          </button>

          {/* Bouton Créer Mobile (+) */}
          <button
            type="button"
            className="groupes-btn-create-mobile-fab"
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Créer un groupe"
          >
            <span aria-hidden="true" style={{ display: 'inline-block', lineHeight: 1, marginTop: '-2px' }}>+</span>
          </button>
        </div>

        {/* 2. Barre de recherche compacte */}
        <div className="groupes-search-bar-wrap">
          <div className="groupes-search-box">
            <svg
              className="groupes-search-icon-svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par matière, concours (ENA, FASTEF), niveau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher un groupe"
            />
          </div>
        </div>

        {/* 3. Puces de filtres horizontales défilables (comme sur la page Publications) */}
        <div className="groupes-filters-scroll-wrap" role="region" aria-label="Filtres thématiques">
          <div className="groupes-filters-scroll">
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={`groupes-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFilter(chip.id)}
                >
                  <span className="groupes-chip-icon" aria-hidden="true">{chip.icon}</span>
                  <span className="groupes-chip-label">{chip.label}</span>
                  {chip.count !== undefined && chip.count > 0 && (
                    <span className="groupes-chip-badge">{chip.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Disposition Principale (Contenu + Sidebar) */}
        <div className="groupes-layout-grid">
          {/* Colonne Principale */}
          <div className="groupes-main-column">
            {/* SECTION A : « MES GROUPES » (Si l'utilisateur en a rejoint) */}
            {myJoinedGroups.length > 0 && (
              <section aria-labelledby="mes-groupes-title">
                <div className="groupes-section-header">
                  <h2 id="mes-groupes-title" className="groupes-section-title">
                    <span>🌟</span>
                    <span>Mes groupes</span>
                    <span className="groupes-count-badge">{myJoinedGroups.length}</span>
                  </h2>
                </div>

                <div className="groupes-my-groups-scroll">
                  {myJoinedGroups.map((group) => (
                    <div key={`my-${group.id}`} className="group-card-item">
                      <div>
                        <div className="group-card-top-row">
                          <div className="group-card-icon-box">{group.icon || '📚'}</div>
                          <div className="group-card-title-box">
                            <Link href={`/groupes/${group.id}`} className="group-card-heading">
                              {group.name}
                            </Link>
                            <div className="group-badges-cluster">
                              <span className="group-pill-badge">{group.category}</span>
                              {group.contest && (
                                <span className="group-pill-badge contest">{group.contest}</span>
                              )}
                              {group.visibility === 'private' && (
                                <span className="group-pill-badge private">🔒 Privé</span>
                              )}
                              <span className="group-pill-badge role">
                                {group.userRole === 'owner' ? '👑 Admin' : '✓ Membre'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="group-card-text">{group.description}</p>
                      </div>

                      <div className="group-card-actions-row">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                          👥 {group.memberCount} membres
                        </span>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link href={`/groupes/${group.id}`} className="group-card-btn-open">
                            Ouvrir →
                          </Link>
                          <button
                            type="button"
                            className="group-card-btn-join joined"
                            onClick={(e) => handleToggleJoin(group.id, e)}
                          >
                            ✓ Membre
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION B : « DÉCOUVRIR DES GROUPES » */}
            <section aria-labelledby="decouvrir-groupes-title">
              <div className="groupes-section-header">
                <h2 id="decouvrir-groupes-title" className="groupes-section-title">
                  <span>🧭</span>
                  <span>Découvrir des groupes</span>
                  <span className="groupes-count-badge">{discoverGroups.length}</span>
                </h2>
              </div>

              {discoverGroups.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                  }}
                >
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.85rem' }}>🔍</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    Aucun groupe ne correspond à votre recherche
                  </h3>
                  <p style={{ fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
                    Essayez de sélectionner un autre filtre ou créez votre propre groupe d'entraide.
                  </p>
                  <button
                    type="button"
                    className="groupes-btn-create-desktop"
                    style={{ display: 'inline-flex', margin: '0 auto' }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    + Créer ce groupe
                  </button>
                </div>
              ) : (
                <div className="groupes-discover-grid">
                  {discoverGroups.map((group) => (
                    <div key={group.id} className="group-card-item">
                      <div>
                        <div className="group-card-top-row">
                          <div className="group-card-icon-box">{group.icon || '📚'}</div>
                          <div className="group-card-title-box">
                            <Link href={`/groupes/${group.id}`} className="group-card-heading">
                              {group.name}
                            </Link>
                            <div className="group-badges-cluster">
                              <span className="group-pill-badge">{group.category}</span>
                              {group.contest && (
                                <span className="group-pill-badge contest">{group.contest}</span>
                              )}
                              {group.visibility === 'private' && (
                                <span className="group-pill-badge private">🔒 Privé</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="group-card-text">{group.description}</p>

                        {group.subject && (
                          <div className="group-card-meta-line">
                            <span>🎯 Matière :</span>
                            <strong style={{ color: '#1e293b' }}>{group.subject}</strong>
                          </div>
                        )}
                      </div>

                      <div className="group-card-actions-row">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                          👥 {group.memberCount} membres
                        </span>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link href={`/groupes/${group.id}`} className="group-card-btn-open">
                            Ouvrir →
                          </Link>
                          <button
                            type="button"
                            className={`group-card-btn-join ${group.isJoined ? 'joined' : ''}`}
                            onClick={(e) => handleToggleJoin(group.id, e)}
                          >
                            {group.isJoined ? '✓ Membre' : 'Rejoindre'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Colonne Latérale (Sidebar) */}
          <aside className="groupes-sidebar-column">
            {/* Groupes populaires */}
            <div className="groupes-sidebar-card">
              <h3 className="groupes-sidebar-title">
                <span>🔥</span>
                <span>Groupes populaires</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {popularGroups.map((grp) => (
                  <div key={`pop-${grp.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '1.25rem' }}>{grp.icon || '📚'}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <Link href={`/groupes/${grp.id}`} style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {grp.name}
                        </Link>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          👥 {grp.memberCount} membres
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`group-card-btn-join ${grp.isJoined ? 'joined' : ''}`}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', flexShrink: 0 }}
                      onClick={(e) => handleToggleJoin(grp.id, e)}
                    >
                      {grp.isJoined ? 'Membre' : 'Rejoindre'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Catégories populaires */}
            <div className="groupes-sidebar-card">
              <h3 className="groupes-sidebar-title">
                <span>📚</span>
                <span>Filières & Catégories</span>
              </h3>
              <div className="groupes-category-list">
                {[
                  { id: 'all' as GroupFilterType, label: 'Toutes les filières', icon: '🌐' },
                  { id: 'Lycée' as GroupFilterType, label: 'Lycée & Baccalauréat', icon: '🎓' },
                  { id: 'Université' as GroupFilterType, label: 'Université & Supérieur', icon: '🏛️' },
                  { id: 'Concours' as GroupFilterType, label: 'Concours direct & Pro', icon: '🏆' },
                  { id: 'Collège' as GroupFilterType, label: 'Collège & Brevet', icon: '📖' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`groupes-category-item ${activeFilter === item.id ? 'active' : ''}`}
                    onClick={() => setActiveFilter(item.id)}
                  >
                    <span>{item.icon} {item.label}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Règles et Esprit Sunubiblio */}
            <div className="groupes-sidebar-card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', borderColor: '#dbeafe' }}>
              <h3 className="groupes-sidebar-title" style={{ color: '#1e3a8a' }}>
                <span>🤝</span>
                <span>Esprit de Communauté</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Chaque groupe d’études est un espace d’entraide mutuelle et d’excellence. Partagez loyalement vos démarches, posez vos questions et progressez ensemble vers la réussite.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Modale de création de groupe */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

      {/* Modale d'authentification */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <Footer />
    </div>
  );
}
