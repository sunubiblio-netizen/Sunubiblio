'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PeerUser } from '@/types/community';

interface CommunityPeersViewProps {
  peers: PeerUser[];
  onToggleFollow: (id: string) => void;
  onJoinCommonCommunity: () => void;
}

export const CommunityPeersView: React.FC<CommunityPeersViewProps> = ({
  peers,
  onToggleFollow,
  onJoinCommonCommunity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'etudiant' | 'enseignant' | 'concours'>('all');

  const filteredPeers = peers.filter((p) => {
    const matchSearch =
      p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.school && p.school.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.field && p.field.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.interests.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'etudiant'
        ? p.role.toLowerCase().includes('étudiant')
        : roleFilter === 'enseignant'
        ? p.role.toLowerCase().includes('enseignant')
        : p.role.toLowerCase().includes('concours');

    return matchSearch && matchRole;
  });

  return (
    <div className="communaute-center-column">
      {/* En-tête Trouver des pairs */}
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
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Trouver des pairs & Collaborateurs
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Connectez-vous avec des étudiants de votre université, des candidats au même concours ou des professeurs experts.
          </p>
        </div>

        {/* Barre de recherche et filtres de profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Rechercher par nom, établissement (UCAD, UGB) ou matière..."
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

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`communaute-chip ${roleFilter === 'all' ? 'active' : ''}`}
              onClick={() => setRoleFilter('all')}
            >
              Tous
            </button>
            <button
              type="button"
              className={`communaute-chip ${roleFilter === 'etudiant' ? 'active' : ''}`}
              onClick={() => setRoleFilter('etudiant')}
            >
              Étudiants
            </button>
            <button
              type="button"
              className={`communaute-chip ${roleFilter === 'enseignant' ? 'active' : ''}`}
              onClick={() => setRoleFilter('enseignant')}
            >
              Enseignants
            </button>
            <button
              type="button"
              className={`communaute-chip ${roleFilter === 'concours' ? 'active' : ''}`}
              onClick={() => setRoleFilter('concours')}
            >
              Candidats Concours
            </button>
          </div>
        </div>
      </div>

      {/* Grille des pairs */}
      <div className="peers-directory-grid">
        {filteredPeers.length === 0 ? (
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
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>👥</span>
            <p style={{ fontWeight: 600, color: '#1e293b' }}>Aucun profil ne correspond aux critères.</p>
            <p style={{ fontSize: '13px' }}>Essayez d'élargir votre recherche par établissement ou mot-clé.</p>
          </div>
        ) : (
          filteredPeers.map((peer) => (
            <div key={peer.id} className="peer-card">
              <div className="peer-card-header">
                <img
                  src={peer.avatarUrl}
                  alt={peer.displayName}
                  className="peer-card-avatar"
                />
                <div className="peer-card-meta">
                  <h3 className="peer-card-name">{peer.displayName}</h3>
                  <span className="peer-card-role-sub">{peer.role}</span>
                  {peer.school && (
                    <span style={{ fontSize: '11.5px', color: '#475569' }}>
                      📍 {peer.school}
                    </span>
                  )}
                </div>
              </div>

              {peer.field && (
                <div style={{ fontSize: '12.5px', color: '#334155' }}>
                  <strong>Domaine :</strong> {peer.field}
                </div>
              )}

              {/* Centres d'intérêts */}
              <div className="peer-interests-tags">
                {peer.interests.map((interest) => (
                  <span key={interest} className="peer-interest-tag">
                    {interest}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="peer-card-actions">
                <Link
                  href="/profil"
                  className="btn-modal-cancel"
                  style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px' }}
                >
                  Voir le profil
                </Link>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn-widget-action ${peer.isFollowing ? 'following' : ''}`}
                    onClick={() => onToggleFollow(peer.id)}
                  >
                    {peer.isFollowing ? 'Abonné' : 'Suivre'}
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
