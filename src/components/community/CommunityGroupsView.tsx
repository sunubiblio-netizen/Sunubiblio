'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { StudyGroup } from '@/types/community';

interface CommunityGroupsViewProps {
  groups: StudyGroup[];
  onToggleJoinGroup: (id: string) => void;
  onCreateGroup: () => void;
  onSelectGroup: (group: StudyGroup) => void;
}

export const CommunityGroupsView: React.FC<CommunityGroupsViewProps> = ({
  groups,
  onToggleJoinGroup,
  onCreateGroup,
  onSelectGroup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const visibilityMenuRef = useRef<HTMLDivElement>(null);

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

  const categories = ['all', 'Lycée', 'Université', 'Concours'];

  const filteredGroups = groups.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.subject && g.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.contest && g.contest.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchVisibility = visibilityFilter === 'all' || g.visibility === visibilityFilter;

    return matchSearch && matchCategory && matchVisibility;
  });

  return (
    <div className="communaute-center-column">
      {/* Barre d'outils et de filtres des groupes */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Groupes d’études actifs
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Rejoignez des groupes par concours, matière ou niveau d’études pour réviser à plusieurs.
            </p>
          </div>

          <button
            type="button"
            className="btn-create-group-solid"
            onClick={onCreateGroup}
          >
            + Créer un groupe
          </button>
        </div>

        {/* Barre de recherche et filtres de catégorie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Rechercher un groupe, un concours (ENA, FASTEF) ou une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="communaute-form-input"
              style={{ paddingLeft: '34px' }}
            />
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px',
              }}
            >
              🔍
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`communaute-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Toutes catégories' : cat}
              </button>
            ))}

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
        </div>
      </div>

      {/* Grille des groupes */}
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
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>📚</span>
            <p style={{ fontWeight: 600, color: '#1e293b' }}>Aucun groupe d’études ne correspond à votre recherche.</p>
            <p style={{ fontSize: '13px' }}>Soyez le premier à créer ce groupe d'entraide pour vos camarades !</p>
            <button
              type="button"
              className="btn-create-group-solid"
              onClick={onCreateGroup}
              style={{ marginTop: '12px' }}
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
                  <h3
                    className="group-card-name"
                    onClick={() => onSelectGroup(group)}
                    style={{ cursor: 'pointer' }}
                  >
                    {group.name}
                  </h3>
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
                    style={{ padding: '5px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    Ouvrir →
                  </Link>

                  <button
                    type="button"
                    className={`btn-widget-action ${group.isJoined ? 'joined' : ''}`}
                    onClick={() => onToggleJoinGroup(group.id)}
                  >
                    {group.isJoined ? 'Membre' : 'Rejoindre'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
