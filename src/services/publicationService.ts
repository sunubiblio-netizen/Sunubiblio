import {
  PublicationItem,
  PublicationStory,
  CreatePublicationInput,
  PublicationComment,
} from '@/types/publication';
import { MOCK_PUBLICATIONS, MOCK_STORIES } from '@/data/mockPublicationsData';

const STORAGE_PUBLICATIONS_KEY = 'sunubiblio_publications_list_v2';
const STORAGE_STORIES_KEY = 'sunubiblio_publications_stories_v2';

export class PublicationService {
  /**
   * Récupère la liste des stories actives (moins de 24h)
   */
  static getActiveStories(): PublicationStory[] {
    if (typeof window === 'undefined') {
      return MOCK_STORIES.filter((s) => new Date(s.expiresAt) > new Date());
    }

    try {
      const stored = localStorage.getItem(STORAGE_STORIES_KEY);
      const stories: PublicationStory[] = stored ? JSON.parse(stored) : MOCK_STORIES;
      const now = new Date();
      // Filtrer automatiquement les stories de plus de 24h
      const activeStories = stories.filter((s) => new Date(s.expiresAt) > now);
      return activeStories;
    } catch {
      return MOCK_STORIES;
    }
  }

  /**
   * Ajoute une nouvelle story (expire automatiquement après 24h)
   */
  static addStory(
    authorName = 'Moi',
    authorAvatar = '/avatar_mamadou.jpg',
    caption?: string,
    mediaUrl?: string,
    mediaType: 'image' | 'video' | 'text' | 'resource' = 'image'
  ): PublicationStory {
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 3600 * 1000); // 24 heures

    const newStory: PublicationStory = {
      id: `story-${Date.now()}`,
      authorName: authorName.trim() || 'Moi',
      authorAvatar: authorAvatar || '/avatar_mamadou.jpg',
      mediaType,
      caption: caption?.trim() || undefined,
      mediaUrl: mediaUrl || '/vid_fonctions.jpg',
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      isViewed: false,
      viewsCount: 1,
    };

    if (typeof window !== 'undefined') {
      try {
        const active = this.getActiveStories();
        const updated = [newStory, ...active];
        localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(updated));

        // Envoi au serveur en tâche de fond pour synchronisation
        fetch('/api/publications/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName: newStory.authorName,
            authorAvatar: newStory.authorAvatar,
            caption: newStory.caption,
            mediaUrl: newStory.mediaUrl,
            mediaType: newStory.mediaType,
          }),
        }).catch(() => {});
      } catch (err) {
        console.error('Erreur sauvegarde story locale:', err);
      }
    }

    return newStory;
  }

  /**
   * Marque une story comme vue
   */
  static markStoryAsViewed(storyId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_STORIES_KEY);
      const stories: PublicationStory[] = stored ? JSON.parse(stored) : MOCK_STORIES;
      const updated = stories.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s));
      localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignorer en cas d'erreur de stockage local
    }
  }

  /**
   * Récupère la liste de toutes les publications
   */
  static getPublications(): PublicationItem[] {
    if (typeof window === 'undefined') {
      return MOCK_PUBLICATIONS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_PUBLICATIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(MOCK_PUBLICATIONS));
      return MOCK_PUBLICATIONS;
    } catch {
      return MOCK_PUBLICATIONS;
    }
  }

  /**
   * Crée une nouvelle publication avec validation
   */
  static createPublication(input: CreatePublicationInput): PublicationItem {
    const currentPosts = this.getPublications();

    const mediaList = input.mediaUrls && input.mediaUrls.length > 0
      ? input.mediaUrls.map((url, idx) => ({
          id: `media-${Date.now()}-${idx}`,
          type: (input.format === 'video' ? 'video' : 'image') as 'image' | 'video',
          url,
          caption: input.content.slice(0, 100),
        }))
      : input.mediaUrl
      ? [
          {
            id: `media-${Date.now()}`,
            type: (input.format === 'video' ? 'video' : 'image') as 'image' | 'video',
            url: input.mediaUrl,
            thumbnailUrl: input.format === 'video' ? '/vid_bac.jpg' : undefined,
            caption: input.content.slice(0, 100),
          },
        ]
      : undefined;

    const newPost: PublicationItem = {
      id: `pub-${Date.now()}`,
      authorName: input.authorName || 'Mamadou Diop',
      authorRole: input.authorRole || 'Membre Sunubiblio',
      authorBadge: input.authorBadge || 'Membre Vérifié',
      authorAvatar: '/avatar_mamadou.jpg',
      createdAt: new Date().toISOString(),
      timeAgo: 'À l’instant',
      format: input.format,
      visibility: input.visibility || 'public',
      content: input.content.trim(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
      media: mediaList,
      sharedResource:
        input.format === 'resource' && input.resourceTitle
          ? {
              id: `res-${Date.now()}`,
              title: input.resourceTitle,
              type: input.resourceType || 'cours',
              href: input.resourceHref || '/education',
              badge: 'Document attaché',
              subject: input.category === 'maths' ? 'Mathématiques' : input.category === 'pc' ? 'Physique-Chimie' : input.category === 'concours' ? 'Concours' : input.category === 'lettres' ? 'Lettres & Philosophie' : input.category === 'svt' ? 'Sciences Naturelles' : undefined,
            }
          : undefined,
    };

    const updated = [newPost, ...currentPosts];

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));

        // Envoi au serveur pour validation et persistance backend
        fetch('/api/publications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }).catch(() => {});
      } catch (err) {
        console.error('Erreur sauvegarde publication:', err);
      }
    }

    return newPost;
  }

  /**
   * Bascule l'état J'aime (Like) d'une publication
   */
  static toggleLike(postId: string): PublicationItem[] {
    const posts = this.getPublications();
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
        };
      }
      return post;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Erreur like:', err);
      }
    }

    return updated;
  }

  /**
   * Bascule l'enregistrement (Bookmark) d'une publication
   */
  static toggleSave(postId: string): PublicationItem[] {
    const posts = this.getPublications();
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved,
        };
      }
      return post;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Erreur sauvegarde bookmark:', err);
      }
    }

    return updated;
  }

  /**
   * Incrémente le compteur de partages d'une publication
   */
  static incrementShare(postId: string): PublicationItem[] {
    const posts = this.getPublications();
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          sharesCount: (post.sharesCount || 0) + 1,
        };
      }
      return post;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Erreur sauvegarde partages:', err);
      }
    }

    return updated;
  }

  /**
   * Ajoute un commentaire à une publication
   */
  static addComment(
    postId: string,
    text: string,
    authorName = 'Mamadou Diop',
    authorBadge = 'Membre Vérifié'
  ): PublicationItem[] {
    const posts = this.getPublications();
    const now = new Date();
    const newComment: PublicationComment = {
      id: `comm-${Date.now()}`,
      authorName,
      authorBadge,
      authorAvatar: '/avatar_mamadou.jpg',
      timeAgo: 'À l’instant',
      content: text.trim(),
      createdAt: now.toISOString(),
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const comments = post.comments || [];
        return {
          ...post,
          comments: [...comments, newComment],
          commentsCount: post.commentsCount + 1,
        };
      }
      return post;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Erreur commentaire:', err);
      }
    }

    return updated;
  }
}
