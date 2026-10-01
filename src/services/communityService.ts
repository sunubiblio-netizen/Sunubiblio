/**
 * Sunubiblio — Service Communautaire
 * Couche d'accès aux données modulaire, prête pour PostgreSQL / Supabase / Prisma
 * avec persistance locale réactive en fallback.
 */

import {
  Community,
  StudyGroup,
  CommunityActivityPost,
  PeerUser,
  DiscussionTopic,
  CreateCommunityInput,
  CreateGroupInput,
  CreateDiscussionInput,
  CommunityComment,
} from '@/types/community';
import {
  MOCK_COMMUNITIES,
  MOCK_STUDY_GROUPS,
  MOCK_FEED_POSTS,
  MOCK_PEER_USERS,
  MOCK_DISCUSSIONS,
} from '@/data/mockCommunityData';

const STORAGE_KEYS = {
  COMMUNITIES: 'sunubiblio_communities_data',
  GROUPS: 'sunubiblio_groups_data',
  POSTS: 'sunubiblio_community_posts_data',
  PEERS: 'sunubiblio_peers_data',
  DISCUSSIONS: 'sunubiblio_discussions_data',
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[CommunityService] Erreur lecture ${key}`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[CommunityService] Erreur sauvegarde ${key}`, err);
  }
}

export class CommunityService {
  /**
   * Récupère la liste des communautés
   */
  static getCommunities(): Community[] {
    return getFromStorage<Community[]>(STORAGE_KEYS.COMMUNITIES, MOCK_COMMUNITIES);
  }

  /**
   * Récupère la liste des groupes d'études
   */
  static getStudyGroups(): StudyGroup[] {
    return getFromStorage<StudyGroup[]>(STORAGE_KEYS.GROUPS, MOCK_STUDY_GROUPS);
  }

  /**
   * Récupère les publications du fil communautaire
   */
  static getFeedPosts(): CommunityActivityPost[] {
    return getFromStorage<CommunityActivityPost[]>(STORAGE_KEYS.POSTS, MOCK_FEED_POSTS);
  }

  /**
   * Récupère les pairs à découvrir
   */
  static getPeers(): PeerUser[] {
    return getFromStorage<PeerUser[]>(STORAGE_KEYS.PEERS, MOCK_PEER_USERS);
  }

  /**
   * Récupère les discussions & débats
   */
  static getDiscussions(): DiscussionTopic[] {
    return getFromStorage<DiscussionTopic[]>(STORAGE_KEYS.DISCUSSIONS, MOCK_DISCUSSIONS);
  }

  /**
   * Crée une nouvelle communauté
   */
  static createCommunity(input: CreateCommunityInput, currentUserId = 'user-current'): Community {
    const existing = this.getCommunities();
    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: input.name,
      slug: slug || `comm-${Date.now()}`,
      description: input.description,
      image: input.image || '/profil_cover.jpg',
      icon: input.icon || '👥',
      category: input.category,
      visibility: input.visibility,
      rules: input.rules,
      requireApproval: input.requireApproval,
      ownerId: currentUserId,
      memberCount: 1,
      isOfficial: false,
      isJoined: true,
      userRole: 'owner',
      createdAt: new Date().toISOString(),
    };

    const updated = [newComm, ...existing];
    saveToStorage(STORAGE_KEYS.COMMUNITIES, updated);
    return newComm;
  }

  /**
   * Crée un nouveau groupe d'études
   */
  static createGroup(input: CreateGroupInput, currentUserId = 'user-current'): StudyGroup {
    const existing = this.getStudyGroups();
    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const newGroup: StudyGroup = {
      id: `grp-${Date.now()}`,
      name: input.name,
      slug: slug || `grp-${Date.now()}`,
      description: input.description,
      image: input.image || '/vid_math.jpg',
      icon: input.icon || '📚',
      category: input.category,
      contest: input.contest,
      subject: input.subject,
      level: input.level,
      school: input.school,
      zone: input.zone,
      visibility: input.visibility,
      rules: input.rules,
      requireApproval: input.requireApproval,
      ownerId: currentUserId,
      memberCount: 1,
      isJoined: true,
      userRole: 'owner',
      createdAt: new Date().toISOString(),
    };

    const updated = [newGroup, ...existing];
    saveToStorage(STORAGE_KEYS.GROUPS, updated);
    return newGroup;
  }

  /**
   * Bascule l'adhésion à une communauté
   */
  static toggleJoinCommunity(communityId: string): Community[] {
    const list = this.getCommunities().map((c) => {
      if (c.id === communityId) {
        const nextJoined = !c.isJoined;
        return {
          ...c,
          isJoined: nextJoined,
          memberCount: nextJoined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
        };
      }
      return c;
    });
    saveToStorage(STORAGE_KEYS.COMMUNITIES, list);
    return list;
  }

  /**
   * Bascule l'adhésion à un groupe d'études
   */
  static toggleJoinGroup(groupId: string): StudyGroup[] {
    const list = this.getStudyGroups().map((g) => {
      if (g.id === groupId) {
        const nextJoined = !g.isJoined;
        return {
          ...g,
          isJoined: nextJoined,
          memberCount: nextJoined ? g.memberCount + 1 : Math.max(1, g.memberCount - 1),
        };
      }
      return g;
    });
    saveToStorage(STORAGE_KEYS.GROUPS, list);
    return list;
  }

  /**
   * Bascule le statut Suivre / Ne plus suivre un pair
   */
  static toggleFollowPeer(peerId: string): PeerUser[] {
    const list = this.getPeers().map((p) => {
      if (p.id === peerId) {
        return {
          ...p,
          isFollowing: !p.isFollowing,
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.PEERS, list);
    return list;
  }

  /**
   * Bascule le like d'un post du fil
   */
  static toggleLikePost(postId: string): CommunityActivityPost[] {
    const list = this.getFeedPosts().map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.POSTS, list);
    return list;
  }

  /**
   * Ajoute un commentaire à un post
   */
  static addCommentToPost(postId: string, content: string, authorName = 'Moi (Vous)'): CommunityActivityPost[] {
    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: 'user-current',
      authorName,
      authorAvatar: '/avatar_mamadou.jpg',
      authorBadge: 'Membre',
      content,
      timeAgo: 'À l’instant',
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    const list = this.getFeedPosts().map((p) => {
      if (p.id === postId) {
        const currentComments = p.comments || [];
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...currentComments, newComment],
        };
      }
      return p;
    });

    saveToStorage(STORAGE_KEYS.POSTS, list);
    return list;
  }

  /**
   * Crée une nouvelle contribution rapide dans le fil avec support média & ressource
   */
  static createPost(
    content: string,
    type: 'publication' | 'ressource' | 'image' | 'video' | 'question' = 'publication',
    authorName = 'Mamadou Diop',
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
  ): CommunityActivityPost[] {
    const newPost: CommunityActivityPost = {
      id: `post-${Date.now()}`,
      authorId: 'user-current',
      authorName,
      authorAvatar: '/avatar_mamadou.jpg',
      authorBadge: 'Membre actif',
      timeAgo: 'À l’instant',
      locationTag: options?.locationTag || 'Dans Discussion générale',
      type,
      content,
      mediaUrl: options?.mediaUrl,
      videoThumbnailUrl: options?.videoThumbnailUrl,
      videoDuration: options?.videoDuration,
      sharedResource: options?.sharedResource,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...this.getFeedPosts()];
    saveToStorage(STORAGE_KEYS.POSTS, updated);
    return updated;
  }

  /**
   * Crée une nouvelle discussion
   */
  static createDiscussion(input: CreateDiscussionInput, authorName = 'Mamadou Diop'): DiscussionTopic[] {
    const newDisc: DiscussionTopic = {
      id: `disc-${Date.now()}`,
      authorId: 'user-current',
      authorName,
      authorAvatar: '/avatar_mamadou.jpg',
      authorBadge: 'Membre actif',
      title: input.title,
      content: input.content,
      tags: input.tags && input.tags.length > 0 ? input.tags : ['Entraide', 'Discussion'],
      communityId: input.communityId,
      groupId: input.groupId,
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 0,
      isLiked: false,
      status: 'active',
      lastActivityAt: 'À l’instant',
      createdAt: new Date().toISOString(),
    };

    const updated = [newDisc, ...this.getDiscussions()];
    saveToStorage(STORAGE_KEYS.DISCUSSIONS, updated);
    return updated;
  }
}
