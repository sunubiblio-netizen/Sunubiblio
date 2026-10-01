/**
 * Sunubiblio — Types stricts du Module Publications (/publications)
 * Prêt pour PostgreSQL / Prisma / Supabase
 */

export type PublicationFormat = 'text' | 'image' | 'video' | 'resource';

export type PublicationVisibility = 'public' | 'abonnes' | 'prive';

export interface PublicationMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  duration?: string;
}

export interface PublicationSharedResource {
  id: string;
  title: string;
  type: 'cours' | 'concours' | 'livre' | 'document' | 'exercice';
  href: string;
  badge?: string;
  thumbnailUrl?: string;
  pagesCount?: number;
  subject?: string;
}

export interface PublicationComment {
  id: string;
  publicationId?: string;
  authorId?: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  timeAgo: string;
  content: string;
  createdAt: string;
}

export interface PublicationItem {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBadge?: string; // Badge professionnel (ex: "Professeur", "Major Concours", "Étudiant ENA")
  createdAt: string;
  updatedAt?: string;
  timeAgo: string;
  content: string;
  format: PublicationFormat;
  visibility: PublicationVisibility;
  media?: PublicationMedia[];
  sharedResource?: PublicationSharedResource;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments?: PublicationComment[];
}

export interface PublicationStory {
  id: string;
  authorId?: string;
  authorName: string;
  authorAvatar: string;
  mediaType?: 'image' | 'video' | 'text' | 'resource';
  mediaUrl?: string;
  caption?: string;
  resourceTitle?: string;
  resourceHref?: string;
  createdAt: string;
  expiresAt: string; // 24 heures après createdAt
  isViewed?: boolean;
  viewsCount?: number;
}

export interface CreatePublicationInput {
  format: PublicationFormat;
  content: string;
  visibility?: PublicationVisibility;
  category?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  resourceTitle?: string;
  resourceType?: 'cours' | 'concours' | 'livre' | 'document' | 'exercice';
  resourceHref?: string;
  authorName?: string;
  authorRole?: string;
  authorBadge?: string;
}

/* ==========================================================================
   Modèles Base de Données (PostgreSQL / Prisma Schema Reference)
   ========================================================================== */

export interface PublicationEntity {
  id: string;
  authorId: string;
  type: PublicationFormat;
  content: string;
  mediaJson?: string;
  resourceId?: string;
  visibility: PublicationVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationLikeEntity {
  id: string;
  publicationId: string;
  userId: string;
  createdAt: string;
}

export interface PublicationCommentEntity {
  id: string;
  publicationId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationShareEntity {
  id: string;
  publicationId: string;
  userId: string;
  target?: string;
  createdAt: string;
}

export interface SavedPublicationEntity {
  id: string;
  publicationId: string;
  userId: string;
  createdAt: string;
}

export interface StoryEntity {
  id: string;
  authorId: string;
  type: 'image' | 'video' | 'text' | 'resource';
  mediaUrl?: string;
  caption?: string;
  resourceId?: string;
  createdAt: string;
  expiresAt: string;
}

export interface StoryViewEntity {
  id: string;
  storyId: string;
  userId: string;
  viewedAt: string;
}
