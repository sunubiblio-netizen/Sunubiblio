'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { StudyGroup, GroupPost, GroupResource, DiscussionTopic } from '@/types/community';
import { CommunityService } from '@/services/communityService';
import { SocialActions } from '@/components/social/SocialActions';
import '../groupes.css';

// Membres simulés pour le groupe
const MOCK_MEMBERS = [
  { id: 'm-1', name: 'Prof. Mamadou Diop', role: 'owner', roleLabel: 'Fondateur & Modérateur', avatar: '/avatar_mamadou.jpg' },
  { id: 'm-2', name: 'Aïssatou Ndiaye', role: 'admin', roleLabel: 'Modératrice Lycée', avatar: '/avatar_aissatou.jpg' },
  { id: 'm-3', name: 'Ibrahima Sène', role: 'member', roleLabel: 'Étudiant Terminale S1', avatar: '/avatar_ibrahima.jpg' },
  { id: 'm-4', name: 'Fatou Bintou Sow', role: 'member', roleLabel: 'Candidate ENA', avatar: '/avatar_fatou.jpg' },
  { id: 'm-5', name: 'Ousmane Ba', role: 'member', roleLabel: 'Étudiant Université', avatar: '/avatar_mamadou.jpg' },
];

// Ressources simulées pour le groupe
const MOCK_RESOURCES: GroupResource[] = [
  {
    id: 'res-g1',
    groupId: '',
    title: 'Annales Corrigées Mathématiques S1 / S2 (2018-2024)',
    type: 'PDF',
    fileSize: '4.2 Mo',
    authorName: 'Prof. Mamadou Diop',
    authorAvatar: '/avatar_mamadou.jpg',
    downloadUrl: '#',
    downloadsCount: 342,
    createdAt: 'Il y a 2 jours',
  },
  {
    id: 'res-g2',
    groupId: '',
    title: 'Fiche Synthèse : Équations Différentielles & Intégrales',
    type: 'Fiche Synthèse',
    fileSize: '1.8 Mo',
    authorName: 'Aïssatou Ndiaye',
    authorAvatar: '/avatar_aissatou.jpg',
    downloadUrl: '#',
    downloadsCount: 215,
    createdAt: 'Il y a 5 jours',
  },
  {
    id: 'res-g3',
    groupId: '',
    title: 'Sujet Concours Blanc ENA / FASTEF — Épreuve 2',
    type: 'Sujet Blanc',
    fileSize: '2.5 Mo',
    authorName: 'Équipe Pédagogique',
    downloadUrl: '#',
    downloadsCount: 189,
    createdAt: 'Il y a 1 semaine',
  },
];

export default function GroupDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'discussions' | 'resources' | 'members'>('posts');

  // Posts du groupe
  const [groupPosts, setGroupPosts] = useState<GroupPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  // Discussions
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscContent, setNewDiscContent] = useState('');
  const [showDiscForm, setShowDiscForm] = useState(false);

  // Charger le groupe
  useEffect(() => {
    if (!id) return;
    const allGroups = CommunityService.getStudyGroups();
    const found = allGroups.find((g) => g.id === id || g.slug === id);

    if (found) {
      setGroup(found);
    } else if (allGroups.length > 0) {
      setGroup(allGroups[0]);
    }
  }, [id]);

  // Initialiser les posts et discussions
  useEffect(() => {
    if (!group) return;

    setGroupPosts([
      {
        id: `gp-1-${group.id}`,
        groupId: group.id,
        authorId: 'prof-mamadou',
        authorName: 'Prof. Mamadou Diop',
        authorAvatar: '/avatar_mamadou.jpg',
        authorRole: 'owner',
        content: `Bienvenue à tous dans le groupe ${group.name} ! Nous débuterons les séances collectives de révision dès ce samedi. N'hésitez pas à partager vos questions et exercices bloquants.`,
        likesCount: 24,
        commentsCount: 6,
        sharesCount: 3,
        isLiked: false,
        createdAt: 'Il y a 3 heures',
      },
      {
        id: `gp-2-${group.id}`,
        groupId: group.id,
        authorId: 'aissatou-n',
        authorName: 'Aïssatou Ndiaye',
        authorAvatar: '/avatar_aissatou.jpg',
        authorRole: 'admin',
        content: 'Voici la fiche récapitulative des formules essentielles à maîtriser absolument pour cette session :',
        sharedResource: {
          title: 'Fiche Synthèse Complète — Sunubiblio 2026',
          type: 'cours',
          href: '/documents',
        },
        likesCount: 42,
        commentsCount: 9,
        sharesCount: 7,
        isLiked: true,
        createdAt: 'Hier à 18:30',
      },
    ]);

    setDiscussions([
      {
        id: `disc-1-${group.id}`,
        authorId: 'ibrahima-s',
        authorName: 'Ibrahima Sène',
        authorAvatar: '/avatar_ibrahima.jpg',
        authorBadge: 'Membre',
        groupId: group.id,
        groupName: group.name,
        title: 'Méthode pour résoudre les intégrales par parties complexes ?',
        content: 'Quelqu’un a une astuce mnémotechnique fiable pour choisir u(x) et v’(x) sans se tromper ?',
        tags: [group.category, 'Méthode'],
        repliesCount: 8,
        viewsCount: 64,
        likesCount: 12,
        isLiked: false,
        status: 'active',
        lastActivityAt: 'Il y a 45 min',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [group]);

  // Basculer l'adhésion au groupe
  const handleToggleJoin = () => {
    if (!group) return;
    const updatedList = CommunityService.toggleJoinGroup(group.id);
    const updated = updatedList.find((g) => g.id === group.id);
    if (updated) setGroup(updated);
  };

  // Publier un nouveau message dans le groupe
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !group) return;

    const newPost: GroupPost = {
      id: `gp-${Date.now()}`,
      groupId: group.id,
      authorId: 'user-current',
      authorName: 'Moi (Vous)',
      authorAvatar: '/avatar_mamadou.jpg',
      authorRole: group.userRole || 'member',
      content: newPostContent.trim(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      createdAt: 'À l’instant',
    };

    setGroupPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
  };

  // Liker un post
  const handleLikePost = (postId: string) => {
    setGroupPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  // Poser une question dans les discussions
  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscTitle.trim() || !newDiscContent.trim() || !group) return;

    const newDisc: DiscussionTopic = {
      id: `disc-${Date.now()}`,
      authorId: 'user-current',
      authorName: 'Moi (Vous)',
      authorAvatar: '/avatar_mamadou.jpg',
      authorBadge: 'Membre',
      groupId: group.id,
      groupName: group.name,
      title: newDiscTitle.trim(),
      content: newDiscContent.trim(),
      tags: [group.category, 'Question'],
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 0,
      status: 'active',
      lastActivityAt: 'À l’instant',
      createdAt: new Date().toISOString(),
    };

    setDiscussions((prev) => [newDisc, ...prev]);
    setNewDiscTitle('');
    setNewDiscContent('');
    setShowDiscForm(false);
  };

  if (!group) {
    return (
      <div className="groupes-page-container">
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
        <main className="groupes-main-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p>Chargement du groupe d'études...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isPrivateAndLocked = group.visibility === 'private' && !group.isJoined;

  return (
    <div className="groupes-page-container">
      <Navbar
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <main className="groupes-main-content">
        <div className="group-detail-container">
          {/* Lien retour */}
          <Link href="/groupes" className="group-detail-back-link">
            ← Retour à tous les groupes
          </Link>

          {/* Bannière + Identité du groupe */}
          <div className="group-detail-banner-card">
            <div className="group-detail-banner-cover" />
            <div className="group-detail-header-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1 }}>
                <div className="group-detail-avatar-wrap">{group.icon || '📚'}</div>

                <div className="group-detail-main-info">
                  <h1 className="group-detail-title">{group.name}</h1>
                  <div className="group-badges-cluster">
                    <span className="group-pill-badge">{group.category}</span>
                    {group.contest && <span className="group-pill-badge contest">{group.contest}</span>}
                    {group.subject && <span className="group-pill-badge">🎯 {group.subject}</span>}
                    <span className="group-pill-badge">
                      {group.visibility === 'public' ? '🌐 Public' : '🔒 Sur validation'}
                    </span>
                    <span className="group-pill-badge">👥 {group.memberCount} membres</span>
                    {group.isJoined && (
                      <span className="group-pill-badge role">
                        {group.userRole === 'owner' ? '👑 Admin' : '✓ Membre'}
                      </span>
                    )}
                  </div>
                  <p className="group-detail-desc">{group.description}</p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className={`group-card-btn-join ${group.isJoined ? 'joined' : ''}`}
                  onClick={handleToggleJoin}
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
                >
                  {group.isJoined ? '✓ Vous êtes membre (Quitter)' : 'Rejoindre ce groupe'}
                </button>
              </div>
            </div>
          </div>

          {/* Onglets du Groupe */}
          <div className="group-detail-nav-tabs" role="tablist">
            <button
              type="button"
              className={`group-detail-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              📝 Publications ({groupPosts.length})
            </button>
            <button
              type="button"
              className={`group-detail-tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              💬 Discussions ({discussions.length})
            </button>
            <button
              type="button"
              className={`group-detail-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              📚 Ressources ({MOCK_RESOURCES.length})
            </button>
            <button
              type="button"
              className={`group-detail-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              👥 Membres ({MOCK_MEMBERS.length})
            </button>
          </div>

          {/* SI GROUPE PRIVÉ ET NON REJOINT */}
          {isPrivateAndLocked ? (
            <div className="group-private-lock-banner">
              <span className="group-lock-icon" aria-hidden="true">🔒</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Ce groupe d’études est privé
              </h3>
              <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                Rejoignez le groupe pour accéder aux publications exclusives, aux corrigés d'annales, aux ressources et aux sessions d'entraide entre étudiants.
              </p>
              <button
                type="button"
                className="group-card-btn-join"
                onClick={handleToggleJoin}
                style={{ margin: '0 auto', padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}
              >
                Envoyer une demande d’adhésion
              </button>
            </div>
          ) : (
            <>
              {/* 1. Onglet Publications */}
              {activeTab === 'posts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Compositeur de publication dans le groupe */}
                  {group.isJoined && (
                    <form onSubmit={handleCreatePost} className="group-post-composer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Image
                          src="/avatar_mamadou.jpg"
                          alt="Votre avatar"
                          width={38}
                          height={38}
                          style={{ borderRadius: '50%' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          Publier dans {group.name}
                        </span>
                      </div>
                      <textarea
                        className="group-composer-textarea"
                        placeholder="Partagez un conseil, posez une question ou proposez un sujet de révision..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        required
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="submit"
                          className="groupes-btn-create-desktop"
                          style={{ display: 'inline-flex', padding: '0.55rem 1.1rem' }}
                        >
                          Publier
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Fil des publications */}
                  {groupPosts.map((post) => (
                    <article key={post.id} className="group-feed-post-card">
                      <div className="group-post-author-row">
                        <Image
                          src={post.authorAvatar}
                          alt={post.authorName}
                          width={42}
                          height={42}
                          className="group-post-avatar"
                        />
                        <div>
                          <div className="group-post-author-name">{post.authorName}</div>
                          <div className="group-post-author-meta">
                            {post.authorRole === 'owner' ? '👑 Admin' : 'Membre'} • {post.createdAt}
                          </div>
                        </div>
                      </div>

                      <p className="group-post-body-text">{post.content}</p>

                      {post.sharedResource && (
                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '12px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>📄</span>
                          <div>
                            <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>
                              {post.sharedResource.title}
                            </strong>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {post.sharedResource.type.toUpperCase()} • Sunubiblio
                            </div>
                          </div>
                        </div>
                      )}

                      <SocialActions
                        likesCount={post.likesCount}
                        commentsCount={post.commentsCount}
                        sharesCount={post.sharesCount}
                        isLiked={post.isLiked}
                        onLike={() => handleLikePost(post.id)}
                        onComment={() => {}}
                        onShare={() => {}}
                        onSave={() => {}}
                      />
                    </article>
                  ))}
                </div>
              )}

              {/* 2. Onglet Discussions */}
              {activeTab === 'discussions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Discussions & Entraide
                    </h3>
                    {group.isJoined && (
                      <button
                        type="button"
                        className="group-card-btn-join"
                        onClick={() => setShowDiscForm((prev) => !prev)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                      >
                        {showDiscForm ? 'Fermer' : '+ Poser une question'}
                      </button>
                    )}
                  </div>

                  {showDiscForm && (
                    <form
                      onSubmit={handleCreateDiscussion}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #3b82f6',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Titre de votre question..."
                        value={newDiscTitle}
                        onChange={(e) => setNewDiscTitle(e.target.value)}
                        className="groupes-search-input"
                        style={{ paddingLeft: '1rem' }}
                        required
                      />
                      <textarea
                        placeholder="Détaillez votre question ou problème rencontré..."
                        value={newDiscContent}
                        onChange={(e) => setNewDiscContent(e.target.value)}
                        className="groupes-search-input"
                        style={{ minHeight: '80px', paddingLeft: '1rem' }}
                        required
                      />
                      <button
                        type="submit"
                        className="group-card-btn-join"
                        style={{ width: 'fit-content', padding: '0.6rem 1.25rem' }}
                      >
                        Publier
                      </button>
                    </form>
                  )}

                  {discussions.map((d) => (
                    <div key={d.id} className="group-discussion-item">
                      <div>
                        <h4 className="group-disc-title">{d.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.4rem 0' }}>
                          {d.content}
                        </p>
                        <div className="group-disc-author">
                          Par <strong>{d.authorName}</strong> • {d.lastActivityAt}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>
                          💬 {d.repliesCount} réponses
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Onglet Ressources */}
              {activeTab === 'resources' && (
                <div className="group-resources-grid">
                  {MOCK_RESOURCES.map((r) => (
                    <div key={r.id} className="group-resource-card">
                      <div className="group-res-icon">📄</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                          {r.title}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
                          {r.type} ({r.fileSize}) • {r.authorName} • {r.createdAt}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                            ⬇️ {r.downloadsCount} téléchargements
                          </span>
                          <button
                            type="button"
                            className="group-card-btn-open"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          >
                            Télécharger
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Onglet Membres */}
              {activeTab === 'members' && (
                <div className="group-members-list-grid">
                  {MOCK_MEMBERS.map((m) => (
                    <div key={m.id} className="group-member-item-card">
                      <Image
                        src={m.avatar}
                        alt={m.name}
                        width={44}
                        height={44}
                        className="group-member-avatar"
                      />
                      <div>
                        <div className="group-member-name">{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.roleLabel}</div>
                        <span className={`group-member-role-badge ${m.role}`}>
                          {m.role === 'owner' ? '👑 Propriétaire' : m.role === 'admin' ? '🛡️ Modérateur' : '🎓 Membre'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
