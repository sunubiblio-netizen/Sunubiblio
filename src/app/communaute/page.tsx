'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import {
  CommunityTab,
  Community,
  StudyGroup,
  CommunityActivityPost,
  PeerUser,
  DiscussionTopic,
  CreateCommunityInput,
  CreateGroupInput,
  CreateDiscussionInput,
} from '@/types/community';
import { CommunityService } from '@/services/communityService';

import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityNavTabs } from '@/components/community/CommunityNavTabs';
import { CommunityLeftSidebar } from '@/components/community/CommunityLeftSidebar';
import { CommunityRightSidebar } from '@/components/community/CommunityRightSidebar';
import { CommunityFeedView } from '@/components/community/CommunityFeedView';
import { CommunityGroupsView } from '@/components/community/CommunityGroupsView';
import { CommunityDiscussionsView } from '@/components/community/CommunityDiscussionsView';
import { CommunityPeersView } from '@/components/community/CommunityPeersView';
import { CreateCommunityModal } from '@/components/community/CreateCommunityModal';
import { CreateGroupModal } from '@/components/community/CreateGroupModal';
import { NewDiscussionModal } from '@/components/community/NewDiscussionModal';
import { CommunityDetailModal } from '@/components/community/CommunityDetailModal';

import './communaute.css';

export default function CommunautePage() {
  const router = useRouter();

  // Redirection immédiate si l'utilisateur arrive avec #groupes ou tab=groups
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAndRedirect = () => {
        if (window.location.hash === '#groupes' || window.location.search.includes('tab=groups')) {
          router.replace('/groupes');
        }
      };
      checkAndRedirect();
      window.addEventListener('hashchange', checkAndRedirect);
      return () => window.removeEventListener('hashchange', checkAndRedirect);
    }
  }, [router]);

  // Onglet actif
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');

  // Recherche rapide
  const [searchQuery, setSearchQuery] = useState('');

  // Données dynamiques avec persistance via CommunityService
  const [communities, setCommunities] = useState<Community[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [posts, setPosts] = useState<CommunityActivityPost[]>([]);
  const [peers, setPeers] = useState<PeerUser[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);

  // Modales d'action
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  // Auth Modal existante
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Chargement initial des données
  useEffect(() => {
    setCommunities(CommunityService.getCommunities());
    setGroups(CommunityService.getStudyGroups());
    setPosts(CommunityService.getFeedPosts());
    setPeers(CommunityService.getPeers());
    setDiscussions(CommunityService.getDiscussions());
  }, []);

  const handleOpenAuth = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  // Actions Communautés & Groupes
  const handleToggleJoinCommunity = useCallback((id: string) => {
    const updated = CommunityService.toggleJoinCommunity(id);
    setCommunities(updated);
    if (selectedCommunity && selectedCommunity.id === id) {
      setSelectedCommunity(updated.find((c) => c.id === id) || null);
    }
  }, [selectedCommunity]);

  const handleToggleJoinGroup = useCallback((id: string) => {
    const updated = CommunityService.toggleJoinGroup(id);
    setGroups(updated);
    if (selectedGroup && selectedGroup.id === id) {
      setSelectedGroup(updated.find((g) => g.id === id) || null);
    }
  }, [selectedGroup]);

  const handleToggleFollowPeer = useCallback((id: string) => {
    const updated = CommunityService.toggleFollowPeer(id);
    setPeers(updated);
  }, []);

  const handleToggleLikePost = useCallback((postId: string) => {
    const updated = CommunityService.toggleLikePost(postId);
    setPosts(updated);
  }, []);

  const handleAddComment = useCallback((postId: string, text: string) => {
    const updated = CommunityService.addCommentToPost(postId, text);
    setPosts(updated);
  }, []);

  const handleCreatePost = useCallback(
    (
      content: string,
      type: 'publication' | 'ressource' | 'image' | 'video' | 'question' = 'publication',
      options?: {
        mediaUrl?: string;
        videoThumbnailUrl?: string;
        videoDuration?: string;
        sharedResource?: {
          title: string;
          type: 'cours' | 'concours' | 'livre' | 'fiche' | 'exercice';
          metaText?: string;
          thumbnailUrl?: string;
          href: string;
        };
        locationTag?: string;
      }
    ) => {
      const updated = CommunityService.createPost(content, type, 'Mamadou Diop', options);
      setPosts(updated);
    },
    []
  );

  const handleCreateCommunitySubmit = useCallback((data: CreateCommunityInput) => {
    const newComm = CommunityService.createCommunity(data);
    setCommunities((prev) => [newComm, ...prev]);
  }, []);

  const handleCreateGroupSubmit = useCallback((data: CreateGroupInput) => {
    const newGroup = CommunityService.createGroup(data);
    setGroups((prev) => [newGroup, ...prev]);
  }, []);

  const handleCreateDiscussionSubmit = useCallback((data: CreateDiscussionInput) => {
    const updated = CommunityService.createDiscussion(data);
    setDiscussions(updated);
    setActiveTab('discussions');
  }, []);

  return (
    <div className="communaute-page-root">
      {/* Navigation globale (intacte) */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="communaute" />

      {/* Contenu principal de la page Communauté */}
      <main className="communaute-main-container">
        {/* 1. En-tête Communauté avec actions de création */}
        <CommunityHeader
          onCreateCommunity={() => setIsCreateCommunityOpen(true)}
          onCreateGroup={() => setIsCreateGroupOpen(true)}
        />

        {/* 2. Navigation par onglets (Fil, Groupes, Discussions, Pairs) */}
        <CommunityNavTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* 3. Grille Desktop 3 Colonnes / Flux unifié Mobile */}
        <div className="communaute-layout-grid">
          {/* Colonne Gauche Desktop */}
          <CommunityLeftSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            communities={communities}
            groups={groups}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectCommunity={setSelectedCommunity}
            onSelectGroup={setSelectedGroup}
          />

          {/* Colonne Centrale Dynamique selon l'onglet actif */}
          <section aria-label="Contenu communautaire principal">
            {activeTab === 'feed' && (
              <CommunityFeedView
                posts={posts}
                onToggleLike={handleToggleLikePost}
                onAddComment={handleAddComment}
                onCreatePost={handleCreatePost}
              />
            )}

            {activeTab === 'groups' && (
              <CommunityGroupsView
                groups={groups}
                onToggleJoinGroup={handleToggleJoinGroup}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                onSelectGroup={setSelectedGroup}
              />
            )}

            {activeTab === 'discussions' && (
              <CommunityDiscussionsView
                discussions={discussions}
                onOpenNewDiscussion={() => setIsNewDiscussionOpen(true)}
              />
            )}

            {activeTab === 'peers' && (
              <CommunityPeersView
                peers={peers}
                onToggleFollow={handleToggleFollowPeer}
                onJoinCommonCommunity={() => setActiveTab('feed')}
              />
            )}
          </section>

          {/* Colonne Droite Desktop */}
          <CommunityRightSidebar
            communities={communities}
            groups={groups}
            peers={peers}
            onToggleJoinCommunity={handleToggleJoinCommunity}
            onToggleJoinGroup={handleToggleJoinGroup}
            onToggleFollowPeer={handleToggleFollowPeer}
            onOpenAuth={handleOpenAuth}
            onSelectTab={setActiveTab}
          />
        </div>
      </main>

      {/* Footer global intact */}
      <Footer />

      {/* Modale Créer une communauté (avec faisceau lumineux sur 4 côtés) */}
      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        onSubmit={handleCreateCommunitySubmit}
      />

      {/* Modale Créer un groupe d'études (avec faisceau lumineux sur 4 côtés) */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSubmit={handleCreateGroupSubmit}
      />

      {/* Modale Nouvelle discussion */}
      <NewDiscussionModal
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleCreateDiscussionSubmit}
      />

      {/* Modale Détail Groupe ou Communauté */}
      <CommunityDetailModal
        isOpen={!!selectedCommunity || !!selectedGroup}
        onClose={() => {
          setSelectedCommunity(null);
          setSelectedGroup(null);
        }}
        community={selectedCommunity}
        group={selectedGroup}
        onToggleJoinCommunity={handleToggleJoinCommunity}
        onToggleJoinGroup={handleToggleJoinGroup}
      />

      {/* Modale Authentification Sunubiblio */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}
