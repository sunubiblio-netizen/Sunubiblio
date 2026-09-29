'use client';

import React, { useState } from 'react';
import { DiscussionTopic } from '@/types/community';

interface CommunityDiscussionsViewProps {
  discussions: DiscussionTopic[];
  onOpenNewDiscussion: () => void;
}

export const CommunityDiscussionsView: React.FC<CommunityDiscussionsViewProps> = ({
  discussions,
  onOpenNewDiscussion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeDiscussion, setActiveDiscussion] = useState<DiscussionTopic | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'disc-1': [
      {
        author: 'Mamadou Diop',
        text: 'Pour le Bac S1, la fiche par type de problème (ex: étude complète avec bijection, limites indéterminées) est redoutablement efficace pour les révisions de dernière minute.',
        time: 'Il y a 30 min',
      },
    ],
  });

  const allTags = ['all', 'Méthodologie', 'Bac S1', 'Concours ENA', 'Culture Générale', 'SunuIA', 'Sciences Physiques'];

  const filteredDiscussions = discussions.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = selectedTag === 'all' || d.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const handleSendReply = (discId: string) => {
    if (!replyText.trim()) return;
    const newEntry = {
      author: 'Moi (Vous)',
      text: replyText.trim(),
      time: 'À l’instant',
    };
    setReplies((prev) => ({
      ...prev,
      [discId]: [...(prev[discId] || []), newEntry],
    }));
    setReplyText('');
  };

  return (
    <div className="communaute-center-column">
      {/* En-tête et actions discussions */}
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
              Discussions & Débats académiques
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Posez des questions de fond, débattez de méthodes pédagogiques et échangez des conseils d’examens.
            </p>
          </div>

          <button
            type="button"
            className="btn-create-group-solid"
            onClick={onOpenNewDiscussion}
          >
            + Nouvelle discussion
          </button>
        </div>

        {/* Barre de recherche et filtres de tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Rechercher un sujet, une question ou une méthodologie..."
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
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`communaute-chip ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag === 'all' ? 'Tous les thèmes' : tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des discussions */}
      <div className="discussions-directory-list">
        {filteredDiscussions.length === 0 ? (
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
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>💬</span>
            <p style={{ fontWeight: 600, color: '#1e293b' }}>Aucune discussion trouvée.</p>
            <p style={{ fontSize: '13px' }}>Lancez le premier sujet de discussion pour la communauté !</p>
            <button
              type="button"
              className="btn-create-group-solid"
              onClick={onOpenNewDiscussion}
              style={{ marginTop: '12px' }}
            >
              + Poser une question
            </button>
          </div>
        ) : (
          filteredDiscussions.map((disc) => {
            const isSelected = activeDiscussion?.id === disc.id;
            const currentReplies = replies[disc.id] || [];

            return (
              <div key={disc.id} className="discussion-item-card">
                <div className="discussion-item-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {disc.status === 'pinned' && (
                      <span className="discussion-pinned-badge">📌 Épinglé</span>
                    )}
                    {disc.communityName && (
                      <span className="group-type-badge">{disc.communityName}</span>
                    )}
                    {disc.groupName && (
                      <span className="group-type-badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                        {disc.groupName}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Actif {disc.lastActivityAt}
                  </span>
                </div>

                <h3
                  className="discussion-item-title"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveDiscussion(isSelected ? null : disc)}
                >
                  {disc.title}
                </h3>

                <p className="discussion-item-snippet">{disc.content}</p>

                <div className="discussion-item-footer">
                  <div className="discussion-tags-list">
                    {disc.tags.map((t) => (
                      <span key={t} className="peer-interest-tag">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="discussion-stats-line">
                    <span>💬 {disc.repliesCount + currentReplies.length} réponses</span>
                    <span>👁️ {disc.viewsCount} vues</span>
                    <button
                      type="button"
                      className="btn-modal-submit"
                      style={{ padding: '5px 14px', fontSize: '12px' }}
                      onClick={() => setActiveDiscussion(isSelected ? null : disc)}
                    >
                      {isSelected ? 'Fermer le fil' : 'Participer'}
                    </button>
                  </div>
                </div>

                {/* Volet de participation interactif */}
                {isSelected && (
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '14px',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      Réponses à cette discussion :
                    </h4>

                    {currentReplies.length === 0 ? (
                      <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                        Soyez le premier à apporter votre contribution ou réponse !
                      </p>
                    ) : (
                      currentReplies.map((r, i) => (
                        <div
                          key={i}
                          style={{
                            background: '#f8fafc',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            border: '1px solid #e2e8f0',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong style={{ color: '#1e293b' }}>{r.author}</strong>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{r.time}</span>
                          </div>
                          <p style={{ margin: 0, color: '#334155' }}>{r.text}</p>
                        </div>
                      ))
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <input
                        type="text"
                        placeholder="Partager votre point de vue ou votre solution..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply(disc.id)}
                        className="communaute-form-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                      <button
                        type="button"
                        className="btn-modal-submit"
                        onClick={() => handleSendReply(disc.id)}
                        style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
