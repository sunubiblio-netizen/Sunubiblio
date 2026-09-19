'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import { ProfileTab, StoryTargetPayload, ProfileStoryItem } from '@/types/profile';
import {
  MOCK_PROFILE_USER,
  MOCK_FEATURED_VIDEO,
  MOCK_PROFILE_VIDEOS,
  MOCK_PROFILE_SUGGESTIONS,
  MOCK_PROFILE_PUBLICATIONS,
  MOCK_PROFILE_RESOURCES,
  MOCK_PROFILE_GALLERY_IMAGES,
  MOCK_PROFILE_STORIES,
} from '@/data/mockProfileData';

import { ProfileLeftNav } from '@/components/profile/ProfileLeftNav';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { ProfileVideoSection } from '@/components/profile/ProfileVideoSection';
import { ProfilePublicationsSection } from '@/components/profile/ProfilePublicationsSection';
import { ProfileImagesSection } from '@/components/profile/ProfileImagesSection';
import { ProfileResourcesSection } from '@/components/profile/ProfileResourcesSection';
import { ProfileAboutSection } from '@/components/profile/ProfileAboutSection';
import { ProfileRightSidebar } from '@/components/profile/ProfileRightSidebar';
import { AddToStoryModal } from '@/components/profile/AddToStoryModal';
import { StoryViewerModal } from '@/components/profile/StoryViewerModal';
import './profil.css';

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('publications');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Gestion des Stories (avec persistance locale et expiration automatique 24h)
  const [stories, setStories] = useState<ProfileStoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sunubiblio_profile_stories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return MOCK_PROFILE_STORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sunubiblio_profile_stories', JSON.stringify(stories));
    } catch {
      // ignore
    }
  }, [stories]);

  // Stories encore actives (moins de 24h)
  const activeStories = stories.filter((s) => new Date(s.expiresAt).getTime() > Date.now());

  const [storyTarget, setStoryTarget] = useState<StoryTargetPayload | null>(null);
  const [isAddToStoryModalOpen, setIsAddToStoryModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  const handleOpenAddToStory = (target: StoryTargetPayload) => {
    setStoryTarget(target);
    setIsAddToStoryModalOpen(true);
  };

  const handlePublishStory = (newStory: ProfileStoryItem) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleOpenViewer = (index = 0) => {
    if (activeStories.length === 0) return;
    setViewerInitialIndex(index);
    setIsViewerOpen(true);
  };

  const handleOpenContentFromStory = (story: ProfileStoryItem) => {
    setIsViewerOpen(false);
    if (story.contentType === 'publication') {
      setActiveTab('publications');
    } else if (story.contentType === 'image') {
      setActiveTab('images');
    } else if (story.contentType === 'video') {
      setActiveTab('videos');
    } else if (story.contentType === 'ressource') {
      setActiveTab('ressources');
    }
  };

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Vérification de la position de défilement horizontal des onglets
  const checkTabsScroll = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkTabsScroll();
    const handleResize = () => checkTabsScroll();
    window.addEventListener('resize', handleResize);
    const t1 = setTimeout(checkTabsScroll, 50);
    const t2 = setTimeout(checkTabsScroll, 200);
    const t3 = setTimeout(checkTabsScroll, 500);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [checkTabsScroll]);

  // Défilement fluide vers la gauche ou la droite
  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsContainerRef.current;
    if (!el) return;
    if (direction === 'right') {
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: maxScroll,
        behavior: 'smooth',
      });
    } else {
      el.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
    setTimeout(checkTabsScroll, 80);
    setTimeout(checkTabsScroll, 200);
    setTimeout(checkTabsScroll, 350);
    setTimeout(checkTabsScroll, 500);
  };

  const handleSelectTab = (tabId: ProfileTab) => {
    setActiveTab(tabId);
    setTimeout(checkTabsScroll, 100);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'publications',
      label: 'Publications',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M8 7h6" />
          <path d="M8 11h8" />
        </svg>
      ),
    },
    {
      id: 'images',
      label: 'Images',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      ),
    },
    {
      id: 'videos',
      label: 'Vidéos',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      ),
    },
    {
      id: 'ressources',
      label: 'Ressources',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 6 4 14" />
          <path d="M12 6v14" />
          <path d="M8 8v12" />
          <path d="M4 4v16" />
        </svg>
      ),
    },
    {
      id: 'apropos',
      label: 'À propos',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Navbar globale Sunubiblio inchangée */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="profil" />

      <div className="profil-page-wrapper">
        <main className="profil-main-section">
        <div className="container profil-three-cols-layout">
          {/* Colonne Gauche : Navigation Sociale (Desktop) */}
          <ProfileLeftNav />

          {/* Colonne Centrale : Contenu Principal du Profil */}
          <div className="profile-center-content">
            {/* Carte Header : Couverture, Avatar, Identité, Stats, Actions */}
            <ProfileHeaderCard
              user={MOCK_PROFILE_USER}
              onOpenAuth={handleOpenAuth}
              onEditCover={() => alert('Fonctionnalité de mise à jour de la photo de couverture.')}
              onEditProfile={() => setActiveTab('apropos')}
              hasActiveStory={activeStories.length > 0}
              activeStoriesCount={activeStories.length}
              onViewStories={() => handleOpenViewer(0)}
            />

            {/* Barre de navigation par onglets avec flèches mobiles */}
            <div className="profile-tabs-nav-container">
              {/* Flèche gauche mobile (visible après défilement à droite) */}
              <button
                type="button"
                className={`mobile-tab-scroll-arrow left ${canScrollLeft ? 'is-visible' : ''}`}
                onClick={() => scrollTabs('left')}
                aria-label="Voir les onglets précédents"
                title="Onglets précédents"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div
                ref={tabsContainerRef}
                className="profile-nav-tabs-bar"
                role="tablist"
                onScroll={checkTabsScroll}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`profile-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="profile-tab-icon">{tab.icon}</span>
                    <span className="profile-tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Flèche droite mobile (visible pour indiquer qu'il existe d'autres onglets) */}
              <button
                type="button"
                className={`mobile-tab-scroll-arrow right ${canScrollRight ? 'is-visible' : ''}`}
                onClick={() => scrollTabs('right')}
                aria-label="Voir les onglets suivants"
                title="Onglets suivants"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Contenu selon l'onglet actif */}
            <div className="profile-tab-content-container">
              {activeTab === 'publications' && (
                <ProfilePublicationsSection
                  initialPosts={MOCK_PROFILE_PUBLICATIONS}
                  authorName={MOCK_PROFILE_USER.displayName}
                  authorAvatar={MOCK_PROFILE_USER.avatarUrl}
                  onAddToStory={handleOpenAddToStory}
                />
              )}

              {activeTab === 'images' && (
                <ProfileImagesSection
                  initialImages={MOCK_PROFILE_GALLERY_IMAGES}
                  authorName={MOCK_PROFILE_USER.displayName}
                  authorAvatar={MOCK_PROFILE_USER.avatarUrl}
                  onAddToStory={handleOpenAddToStory}
                />
              )}

              {activeTab === 'videos' && (
                <ProfileVideoSection
                  featuredVideo={MOCK_FEATURED_VIDEO}
                  videos={MOCK_PROFILE_VIDEOS}
                  onAddToStory={handleOpenAddToStory}
                />
              )}

              {activeTab === 'ressources' && (
                <ProfileResourcesSection
                  resources={MOCK_PROFILE_RESOURCES}
                  authorName={MOCK_PROFILE_USER.displayName}
                  authorAvatar={MOCK_PROFILE_USER.avatarUrl}
                  onAddToStory={handleOpenAddToStory}
                />
              )}

              {activeTab === 'apropos' && (
                <ProfileAboutSection
                  user={MOCK_PROFILE_USER}
                />
              )}
            </div>
          </div>

          {/* Colonne Droite : Widgets, Membre Gold, Suggestions */}
          <ProfileRightSidebar
            user={MOCK_PROFILE_USER}
            suggestions={MOCK_PROFILE_SUGGESTIONS}
            onCreatePostClick={() => setActiveTab('publications')}
          />
        </div>
      </main>

      {/* Footer global */}
      <Footer />

      {/* Modale d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      {/* Modale d'ajout à la story (Composant unique 4-en-1) */}
      <AddToStoryModal
        isOpen={isAddToStoryModalOpen}
        onClose={() => setIsAddToStoryModalOpen(false)}
        target={storyTarget}
        authorName={MOCK_PROFILE_USER.displayName}
        authorAvatar={MOCK_PROFILE_USER.avatarUrl}
        onPublishStory={handlePublishStory}
      />

      {/* Visionneuse de story interactive */}
      <StoryViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        stories={activeStories}
        initialIndex={viewerInitialIndex}
        onDeleteStory={handleDeleteStory}
        onOpenContent={handleOpenContentFromStory}
      />
      </div>
    </>
  );
}
