/**
 * Sunubiblio — Types stricts du Profil Utilisateur & Social
 */

export type ProfileTab = 'publications' | 'images' | 'videos' | 'ressources' | 'apropos';

export interface ProfileGalleryImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
  category?: 'Schéma' | 'Fiche' | 'Tableau' | 'Exercice' | 'Autre';
  date: string;
  viewsCount: number;
  likesCount: number;
  size?: number;
}

export type VideoCategory = 
  | 'Cours' 
  | 'Conseils' 
  | 'Exercices' 
  | 'Présentation' 
  | 'Technologie' 
  | 'Motivation';

export type VideoCategoryFilter = 
  | 'tout' 
  | 'cours' 
  | 'conseils' 
  | 'exercices' 
  | 'presentation';

export type VideoSortOption = 'recent' | 'populaire' | 'vues';

export interface ProfileUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  isVerified: boolean;
  badgeLabel: string;
  bio: string;
  city: string;
  country: string;
  school: string;
  subject: string;
  level: string;
  role: string;
  memberSince: string;
  isFollowing: boolean;
  publicationsCount: number;
  followersCount: number;
  followingCount: number;
  isGoldMember: boolean;
  interests: string[];
}

export interface ProfileVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: VideoCategory;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  thumbnailUrl: string;
  videoUrl?: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  isFeatured?: boolean;
}

export interface ProfilePostImage {
  id: string;
  url: string;
  caption?: string;
  name?: string;
  size?: number;
}

export interface ProfilePost {
  id: string;
  authorName: string;
  authorGrade: string;
  authorAvatar: string;
  timeAgo: string;
  groupTag?: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  images?: ProfilePostImage[];
  sharedResource?: {
    title: string;
    type: 'cours' | 'concours' | 'livre' | 'fiche' | 'exercice';
    href: string;
  };
}

export interface ProfileResource {
  id: string;
  title: string;
  type: 'Cours' | 'Exercices' | 'Livre' | 'Document' | 'QCM';
  subject: string;
  level: string;
  isPremium: boolean;
  viewsCount: number;
  downloadCount: number;
  fileFormat: 'PDF' | 'DOCX' | 'EPUB';
  pagesCount: number;
  href: string;
}

export interface ProfileSuggestion {
  id: string;
  name: string;
  role: string;
  followersCount: string;
  avatarUrl: string;
  isFollowing: boolean;
}

export type StoryContentType = 'publication' | 'image' | 'video' | 'ressource';

export type StoryPrivacy = 'public' | 'abonnes' | 'prive';

export interface StoryTargetPayload {
  contentType: StoryContentType;
  contentId: string;
  title: string;
  subtitle?: string;
  description?: string;
  mediaUrl?: string;
  badge?: string;
  metaText?: string;
  authorName: string;
  authorAvatar: string;
  sharedHref?: string;
}

export interface ProfileStoryItem {
  id: string;
  contentType: StoryContentType;
  contentId: string;
  caption?: string;
  privacy: StoryPrivacy;
  createdAt: string;
  expiresAt: string;
  authorName: string;
  authorAvatar: string;
  payload: StoryTargetPayload;
}
