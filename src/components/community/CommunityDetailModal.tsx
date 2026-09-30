'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { Community, StudyGroup } from '@/types/community';

interface CommunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  community?: Community | null;
  group?: StudyGroup | null;
  onToggleJoinCommunity?: (id: string) => void;
  onToggleJoinGroup?: (id: string) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  isOpen,
  onClose,
  community,
  group,
  onToggleJoinCommunity,
  onToggleJoinGroup,
}) => {
  useLockBodyScroll(isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || (!community && !group)) return null;

  const item = community || group;
  const isGroup = !!group;
  const isJoined = item?.isJoined;

  return createPortal(
    <div
      className="communaute-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="communaute-modal-panel">
        <div className="communaute-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{item?.icon || '👥'}</span>
            <div>
              <h3 className="communaute-modal-title">{item?.name}</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {isGroup ? 'Groupe d’études' : 'Espace Communautaire'} • {item?.category}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="communaute-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="communaute-modal-body">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="group-type-badge">
              {item?.visibility === 'public' ? '🌐 Public' : '🔒 Privé'}
            </span>
            <span className="group-type-badge">
              👥 {item?.memberCount} membres actifs
            </span>
            {group?.contest && (
              <span className="group-type-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                🏆 {group.contest}
              </span>
            )}
            {group?.subject && (
              <span className="group-type-badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                📚 {group.subject}
              </span>
            )}
          </div>

          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Description & Objectifs
            </h4>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {item?.description}
            </p>
          </div>

          {item?.rules && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                Charte & Règles
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {item.rules}
              </p>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '12.5px',
              color: '#166534',
            }}
          >
            <span>🛡️ Espace modéré par l’équipe pédagogique Sunubiblio</span>
            <strong>Actif</strong>
          </div>
        </div>

        <div className="communaute-modal-footer">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Fermer
          </button>

          <button
            type="button"
            className={`btn-modal-submit ${isJoined ? 'joined' : ''}`}
            onClick={() => {
              if (isGroup && group && onToggleJoinGroup) {
                onToggleJoinGroup(group.id);
              } else if (!isGroup && community && onToggleJoinCommunity) {
                onToggleJoinCommunity(community.id);
              }
            }}
          >
            {isJoined ? 'Quitter cet espace' : 'Rejoindre maintenant'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
