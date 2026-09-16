'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

interface PostItem {
  id: string;
  authorName: string;
  authorGrade: string;
  timeAgo: string;
  groupTag: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  sharedResource?: {
    title: string;
    type: 'concours' | 'livre' | 'fiche';
    href: string;
  };
}

const MOCK_POSTS: PostItem[] = [
  {
    id: 'p1',
    authorName: 'Moussa Diagne',
    authorGrade: 'Candidat FASTEF Lettres 2026',
    timeAgo: 'Il y a 3h',
    groupTag: 'Prépa Concours FASTEF',
    content: 'Bonjour à tous ! Pour ceux qui préparent l’épreuve de Didactique générale, je partage une synthèse comparative entre le triangle pédagogique de Houssaye et la théorie des situations didactiques de Brousseau. Vos avis sur les pièges fréquents du jury ?',
    likesCount: 28,
    commentsCount: 9,
    sharedResource: {
      title: 'FASTEF — Théorie des Situations Didactiques (Niveau Intermédiaire)',
      type: 'concours',
      href: '/exercices/test-fastef-02-intermediaire',
    },
  },
  {
    id: 'p2',
    authorName: 'Aïssatou Ndiaye',
    authorGrade: 'Terminale S2 — Lycée Lamine Guèye',
    timeAgo: 'Il y a 6h',
    groupTag: 'Baccalauréat Scientifique',
    content: 'Quelqu’un a résolu le problème de probabilités conditionnelles de l’annale Bac 2024 session normale ? J’ai un doute sur l’application de la formule de Bayes pour la question 3-b.',
    likesCount: 17,
    commentsCount: 14,
    sharedResource: {
      title: 'Probabilités : Vocabulaire & Calculs Fondamentaux',
      type: 'livre',
      href: '/exercices',
    },
  },
];

const MOCK_GROUPS = [
  { id: 'g1', name: 'FASTEF Dakar & Régions', members: '1 420 membres', icon: '🎓' },
  { id: 'g2', name: 'Internat & Études Médicales UCAD', members: '980 membres', icon: '🩺' },
  { id: 'g3', name: 'Terminale S1 / S2 — Révisions Bac', members: '3 250 membres', icon: '📐' },
  { id: 'g4', name: 'Concours ENA & Douanes', members: '840 membres', icon: '⚖️' },
];

export default function CommunautePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [postDraft, setPostDraft] = useState('');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="communaute-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="communaute" />

      <main className="communaute-main-content">
        <div className="container communaute-grid-layout">
          {/* Colonne Gauche : Groupes d'études & Navigation sociale */}
          <aside className="communaute-sidebar-left">
            <div className="sidebar-group-card">
              <h3 className="sidebar-card-title">Groupes d’études actifs</h3>
              <div className="groups-list">
                {MOCK_GROUPS.map((g) => (
                  <div key={g.id} className="group-item-row">
                    <span className="group-emoji">{g.icon}</span>
                    <div className="group-texts">
                      <strong className="group-name">{g.name}</strong>
                      <span className="group-members">{g.members}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn-secondary w-full join-group-btn"
                onClick={() => handleOpenAuth('login')}
              >
                Rejoindre un groupe
              </button>
            </div>
          </aside>

          {/* Colonne Centrale : Fil d'actualité & Publications */}
          <section className="communaute-feed-column">
            {/* Boîte de création de publication */}
            <div className="create-post-card">
              <div className="create-post-top">
                <div className="post-author-avatar">SB</div>
                <textarea
                  className="post-textarea"
                  placeholder="Posez une question, partagez une astuce de révision ou une ressource..."
                  value={postDraft}
                  onChange={(e) => setPostDraft(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="create-post-actions-row">
                <div className="post-attachments-types">
                  <span className="attach-tag">📎 Document</span>
                  <span className="attach-tag">🏆 Concours</span>
                  <span className="attach-tag">📝 Test associé</span>
                </div>
                <button
                  type="button"
                  className="btn-primary publish-btn"
                  onClick={() => handleOpenAuth('login')}
                >
                  Publier
                </button>
              </div>
            </div>

            {/* Liste des publications */}
            <div className="feed-posts-list">
              {MOCK_POSTS.map((post) => (
                <article key={post.id} className="feed-post-card">
                  <div className="post-header-row">
                    <div className="author-avatar-circle">
                      {post.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="post-author-meta">
                      <div className="author-name-line">
                        <strong className="author-name">{post.authorName}</strong>
                        <span className="post-group-badge">{post.groupTag}</span>
                      </div>
                      <span className="author-grade-sub">{post.authorGrade} • {post.timeAgo}</span>
                    </div>
                  </div>

                  <p className="post-body-text">{post.content}</p>

                  {post.sharedResource && (
                    <Link href={post.sharedResource.href} className="post-shared-resource-card">
                      <div className="resource-shared-icon">
                        {post.sharedResource.type === 'concours' ? '🏆' : '📚'}
                      </div>
                      <div className="resource-shared-info">
                        <span className="resource-tag-pill">Ressource rattachée</span>
                        <h4 className="resource-shared-title">{post.sharedResource.title}</h4>
                      </div>
                    </Link>
                  )}

                  <div className="post-footer-interactions">
                    <button type="button" className="interaction-btn" onClick={() => handleOpenAuth('login')}>
                      <span>👍</span> <span>{post.likesCount} J'aime</span>
                    </button>
                    <button type="button" className="interaction-btn" onClick={() => handleOpenAuth('login')}>
                      <span>💬</span> <span>{post.commentsCount} Commentaires</span>
                    </button>
                    <button type="button" className="interaction-btn" onClick={() => handleOpenAuth('login')}>
                      <span>↗️</span> <span>Partager</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Colonne Droite : Événements communautaires & Recommandations */}
          <aside className="communaute-sidebar-right">
            <div className="sidebar-group-card">
              <h3 className="sidebar-card-title">Séances d'entraide Visio</h3>
              <p className="sidebar-text-muted">
                Participez aux groupes de révision en direct animés par des tuteurs bénévoles.
              </p>
              <Link href="/visio" className="btn-secondary w-full">
                Voir l'agenda Visio
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
