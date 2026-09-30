'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { DiscussionTopic, CreateDiscussionInput } from '@/types/community';
import { CommunityService } from '@/services/communityService';
import { NewDiscussionModal } from '@/components/community/NewDiscussionModal';
import { useDragScroll } from '@/hooks/useDragScroll';
import './discussions.css';

export type DiscussionTabType = 'all' | 'Méthodologie' | 'Bac S1' | 'Concours ENA' | 'Culture Générale' | 'SunuIA';

export default function DiscussionsPage() {
  const tabsScrollRef = useDragScroll<HTMLDivElement>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Données
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [activeTab, setActiveTab] = useState<DiscussionTabType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modale de création
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);

  // État fil ouvert & réponses en direct
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);
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

  // Charger les discussions
  useEffect(() => {
    const loaded = CommunityService.getDiscussions();
    setDiscussions(loaded);
  }, []);

  // Création d'une discussion
  const handleCreateDiscussion = (input: CreateDiscussionInput) => {
    const updated = CommunityService.createDiscussion(input);
    setDiscussions(updated);
    setIsNewDiscussionOpen(false);
  };

  // Envoi d'une réponse inline
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

  // Discussions filtrées
  const filteredDiscussions = useMemo(() => {
    return discussions.filter((d) => {
      // 1. Onglet actif
      if (activeTab !== 'all' && !d.tags.includes(activeTab)) {
        return false;
      }

      // 2. Recherche texte
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = d.title.toLowerCase().includes(query);
        const matchContent = d.content.toLowerCase().includes(query);
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }

      return true;
    });
  }, [discussions, activeTab, searchTerm]);

  const tabs: { id: DiscussionTabType; label: string; shortLabel: string; icon: string }[] = [
    { id: 'all', label: 'Toutes les discussions', shortLabel: 'Toutes', icon: '💬' },
    { id: 'Méthodologie', label: 'Méthodologie & Révision', shortLabel: 'Méthode', icon: '📝' },
    { id: 'Bac S1', label: 'Baccalauréat S1 / S2', shortLabel: 'Bac', icon: '🎓' },
    { id: 'Concours ENA', label: 'Concours direct (ENA...)', shortLabel: 'Concours', icon: '🏛️' },
    { id: 'Culture Générale', label: 'Culture & Actualités', shortLabel: 'Culture', icon: '📖' },
    { id: 'SunuIA', label: 'SunuIA & Outils', shortLabel: 'IA', icon: '🤖' },
  ];

  return (
    <div className="communaute-page-root discussions-page-root">
      <Navbar
        activePage="communaute"
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="communaute-hero-titles">
              <div className="communaute-title-row">
                <h1>Discussions</h1>
                <span className="communaute-hero-badge">Débats & Savoirs</span>
              </div>
              <p className="communaute-hero-desc">
                Posez des questions de fond, débattez de méthodes pédagogiques et échangez des conseils d’examens.
              </p>
            </div>
          </div>

          <div className="communaute-hero-actions">
            <button
              type="button"
              className="btn-create-community-primary"
              onClick={() => setIsNewDiscussionOpen(true)}
              aria-label="Nouvelle discussion"
            >
              <svg className="create-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="create-btn-text">Nouvelle discussion</span>
            </button>
          </div>
        </header>

        {/* 2. NAVIGATION PAR ONGLETS PILULES — Capsule douce style Communauté */}
        <nav className="communaute-tabs-nav-wrapper" aria-label="Navigation des discussions">
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
          <aside className="communaute-left-sidebar" aria-label="Thématiques de débat">
            <div className="communaute-nav-card">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 12px 2px 12px' }}>
                Thématiques d'échange
              </span>

              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`communaute-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="communaute-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="communaute-sidebar-block">
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title">💡 Conseils de discussion</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Précisez l'exercice, la formule ou la démarche qui vous pose problème afin que les autres membres puissent vous orienter efficacement.
              </p>
            </div>
          </aside>

          {/* Colonne Centrale : Recherche + Liste des discussions */}
          <section className="communaute-center-column" aria-label="Liste des discussions">
            {/* Barre de recherche compacte et moderne */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Rechercher un sujet, une question ou une méthodologie..."
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
            </div>

            {/* Liste fluide des discussions */}
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
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>💬</span>
                  <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Aucune discussion trouvée</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>Lancez le premier sujet de discussion pour la communauté !</p>
                  <button
                    type="button"
                    className="btn-create-community-primary"
                    style={{ margin: '14px auto 0 auto' }}
                    onClick={() => setIsNewDiscussionOpen(true)}
                  >
                    + Poser une question
                  </button>
                </div>
              ) : (
                filteredDiscussions.map((disc) => {
                  const isSelected = activeDiscussionId === disc.id;
                  const currentReplies = replies[disc.id] || [];

                  return (
                    <article key={disc.id} className="discussion-item-card">
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

                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Actif {disc.lastActivityAt}
                        </span>
                      </div>

                      <h3
                        className="discussion-item-title"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveDiscussionId(isSelected ? null : disc.id)}
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
                            className="composer-publish-btn"
                            style={{ padding: '5px 14px', fontSize: '12px' }}
                            onClick={() => setActiveDiscussionId(isSelected ? null : disc.id)}
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
                              Soyez le premier à apporter votre réponse ou votre éclairage !
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
                              placeholder="Partager votre point de vue ou solution..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendReply(disc.id)}
                              className="composer-input-field"
                              style={{ padding: '8px 14px', fontSize: '13px' }}
                            />
                            <button
                              type="button"
                              className="composer-publish-btn"
                              onClick={() => handleSendReply(disc.id)}
                              style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
                            >
                              Répondre
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Colonne Droite Desktop */}
          <aside className="communaute-right-sidebar" aria-label="Conseils méthodologiques">
            <div className="communaute-sidebar-block" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', borderColor: '#dbeafe' }}>
              <div className="communaute-sidebar-block-header">
                <h3 className="communaute-sidebar-block-title" style={{ color: '#1e3a8a' }}>🤝 Esprit d'Entraide</h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Partagez avec bienveillance. Vos retours d'expérience et astuces méthodologiques aident des centaines de camarades à progresser.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Modale nouvelle discussion */}
      <NewDiscussionModal
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleCreateDiscussion}
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
