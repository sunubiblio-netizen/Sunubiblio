'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import {
  PublicationItem,
  PublicationStory,
  CreatePublicationInput,
  PublicationFormat,
} from '@/types/publication';
import { PublicationService } from '@/services/publicationService';
import { MOCK_PUBLICATIONS, MOCK_STORIES } from '@/data/mockPublicationsData';

import { PublicationsHeader } from '@/components/publications/PublicationsHeader';
import { PublicationsStoriesBar } from '@/components/publications/PublicationsStoriesBar';
import { PublicationsComposer } from '@/components/publications/PublicationsComposer';
import { PublicationsLeftNav, PublicationFilterType } from '@/components/publications/PublicationsLeftNav';
import { PublicationsRightSidebar } from '@/components/publications/PublicationsRightSidebar';
import { PublicationsMobileFilterBar } from '@/components/publications/PublicationsMobileFilterBar';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { CreatePublicationModal } from '@/components/publications/CreatePublicationModal';
import { AddPublicationStoryModal } from '@/components/publications/AddPublicationStoryModal';
import { PublicationStoryViewer } from '@/components/publications/PublicationStoryViewer';

import './publications.css';

export default function PublicationsPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Données
  const [stories, setStories] = useState<PublicationStory[]>(MOCK_STORIES);
  const [publications, setPublications] = useState<PublicationItem[]>(MOCK_PUBLICATIONS);

  // Filtre actif (colonne gauche)
  const [activeFilter, setActiveFilter] = useState<PublicationFilterType>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialFormat, setCreateInitialFormat] = useState<PublicationFormat>('text');
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Chargement initial des stories actives et des publications
  useEffect(() => {
    const activeStories = PublicationService.getActiveStories();
    const posts = PublicationService.getPublications();
    if (activeStories && activeStories.length > 0) setStories(activeStories);
    if (posts && posts.length > 0) setPublications(posts);
  }, []);

  // Filtrage réactif du fil selon la sélection de la colonne gauche
  const filteredPublications = useMemo(() => {
    switch (activeFilter) {
      case 'subscriptions':
        // Simule les publications des formateurs et professeurs suivis
        return publications.filter((p) => p.authorRole.includes('Professeur') || p.authorRole.includes('Formateur'));
      case 'saved':
        return publications.filter((p) => p.isSaved);
      case 'my-posts':
        return publications.filter((p) => p.authorName === 'Moi' || p.authorName === 'Mamadou Diop');
      case 'maths':
        return publications.filter((p) =>
          p.content.toLowerCase().includes('math') ||
          p.sharedResource?.subject?.toLowerCase().includes('math')
        );
      case 'pc':
        return publications.filter((p) =>
          p.content.toLowerCase().includes('chimie') ||
          p.content.toLowerCase().includes('physique')
        );
      case 'concours':
        return publications.filter((p) =>
          p.content.toLowerCase().includes('concours') ||
          p.content.toLowerCase().includes('fastef') ||
          p.content.toLowerCase().includes('ena')
        );
      case 'lettres':
        return publications.filter((p) =>
          p.content.toLowerCase().includes('histoire') ||
          p.content.toLowerCase().includes('philo') ||
          p.content.toLowerCase().includes('civilisation')
        );
      case 'all':
      default:
        return publications;
    }
  }, [publications, activeFilter]);

  const savedPostsCount = useMemo(() => {
    return publications.filter((p) => p.isSaved).length;
  }, [publications]);

  // 1. Ouvrir modal de création avec format
  const handleOpenCreate = (format: PublicationFormat = 'text') => {
    setCreateInitialFormat(format);
    setIsCreateModalOpen(true);
  };

  // 2. Créer une publication
  const handleCreatePublication = (input: CreatePublicationInput) => {
    const newPost = PublicationService.createPublication(input);
    setPublications((prev) => [newPost, ...prev]);
    showToast('Publication partagée avec succès !');
  };

  // 3. Ajouter une Story (expire après 24h)
  const handleAddStory = (caption: string, mediaUrl: string) => {
    const newStory = PublicationService.addStory(
      'Moi',
      '/avatar_mamadou.jpg',
      caption,
      mediaUrl
    );
    setStories((prev) => [newStory, ...prev]);
    showToast('Votre story a été publiée pour 24 h !');
  };

  // 4. Ouvrir le Story Viewer & marquer comme consultée
  const handleViewStory = (story: PublicationStory, index: number) => {
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, isViewed: true } : s))
    );
    PublicationService.markStoryAsViewed(story.id);
    setViewerStoryIndex(index);
    setIsViewerOpen(true);
  };

  // 5. J'aime (❤️)
  const handleLike = (id: string) => {
    const updated = PublicationService.toggleLike(id);
    setPublications(updated);
  };

  // 6. Enregistrer (🔖)
  const handleSave = (id: string) => {
    const post = publications.find((p) => p.id === id);
    const wasSaved = post?.isSaved;
    const updated = PublicationService.toggleSave(id);
    setPublications(updated);
    showToast(
      wasSaved
        ? 'Publication retirée des enregistrements'
        : 'Publication enregistrée dans vos favoris !'
    );
  };

  // 7. Commenter (💬)
  const handleAddComment = (id: string, text: string) => {
    const updated = PublicationService.addComment(id, text);
    setPublications(updated);
    showToast('Commentaire publié !');
  };

  // 8. Partager (↗) — Supporte l'API native mobile (WhatsApp, etc.) et le presse-papier
  const handleShare = async (publication: PublicationItem) => {
    // Incrémentation dynamique du compteur de partages
    const updated = PublicationService.incrementShare(publication.id);
    setPublications(updated);

    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/publications#publication-${publication.id}`
        : '';
    const shareData = {
      title: `Publication de ${publication.authorName} sur Sunubiblio`,
      text: publication.content.slice(0, 120),
      url,
    };

    if (
      typeof navigator !== 'undefined' &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        showToast('Publication partagée !');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && url) {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Lien de la publication copié dans le presse-papier !');
        return;
      } catch (err) {
        console.warn('Erreur clipboard', err);
      }
    }
    showToast('Lien prêt à être partagé !');
  };

  return (
    <div className="publications-page">
      <Navbar
        activePage="publications"
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <div className="publications-root-wrapper">
        {/* En-tête simple : « Publications » */}
        <PublicationsHeader />

        {/* STRUCTURE 3 COLONNES DESKTOP / FLUIDE TABLETTE & MOBILE */}
        <div className="publications-tri-layout">
          {/* 1. STORIES : RANGÉE 1 DANS LA LARGEUR DU CONTENU CENTRAL (Col 2, Row 1) */}
          <div className="pub-stories-top-slot">
            <PublicationsStoriesBar
              stories={stories}
              onAddStory={() => setIsAddStoryModalOpen(true)}
              onViewStory={handleViewStory}
            />
          </div>

          {/* 2. COLONNE GAUCHE (Découvrir / Filtres / Thématiques) - COMMENCE EN RANGÉE 2 */}
          <PublicationsLeftNav
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            savedCount={savedPostsCount}
          />

          {/* 3. COLONNE CENTRALE (Barre Mobile + Zone de création + Fil) - COMMENCE EN RANGÉE 2 */}
          <main className="pub-center-column">
            {/* Contrôles de navigation mobile (Puces tactiles) */}
            <PublicationsMobileFilterBar
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              savedCount={savedPostsCount}
            />

            {/* Zone de création de publication élégante (Début vertical identique aux sidebars) */}
            <PublicationsComposer
              onOpenCreate={handleOpenCreate}
            />

            {/* Fil des publications */}
            <section className="publications-feed" aria-label="Fil des publications">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((item) => (
                  <PublicationCard
                    key={item.id}
                    publication={item}
                    onLike={handleLike}
                    onSave={handleSave}
                    onAddComment={handleAddComment}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="pub-empty-state-card">
                  <div className="pub-empty-icon" aria-hidden="true">📭</div>
                  <h3 className="pub-empty-title">Aucune publication dans cette rubrique</h3>
                  <p className="pub-empty-desc">
                    Soyez le premier à partager une réflexion ou une ressource dans cette thématique !
                  </p>
                  <button
                    type="button"
                    className="pub-btn-empty-reset"
                    onClick={() => setActiveFilter('all')}
                  >
                    Revenir au fil principal
                  </button>
                </div>
              )}
            </section>
          </main>

          {/* COLONNE DROITE DESKTOP & TABLETTE (Suggestions de Communautés, Groupes & Membres) */}
          <aside className="pub-right-sidebar-desktop-col">
            <PublicationsRightSidebar />
          </aside>
        </div>
      </div>

      {/* Modals & Viewer */}
      <CreatePublicationModal
        isOpen={isCreateModalOpen}
        initialFormat={createInitialFormat}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePublication}
      />

      <AddPublicationStoryModal
        isOpen={isAddStoryModalOpen}
        onClose={() => setIsAddStoryModalOpen(false)}
        onSubmit={handleAddStory}
      />

      <PublicationStoryViewer
        isOpen={isViewerOpen}
        stories={stories}
        initialIndex={viewerStoryIndex}
        onClose={() => setIsViewerOpen(false)}
        onStoryChange={(newIdx) => {
          const s = stories[newIdx];
          if (s) {
            setStories((prev) =>
              prev.map((item) => (item.id === s.id ? { ...item, isViewed: true } : item))
            );
            PublicationService.markStoryAsViewed(s.id);
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="pub-toast" role="status" aria-live="polite">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
