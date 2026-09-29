/**
 * Sunubiblio — Types stricts du module Communauté (/communaute)
 * Architecture alignée avec PostgreSQL / Prisma / Supabase
 */

export type CommunityTab = 'feed' | 'groups' | 'discussions' | 'peers';

export type CommunityVisibility = 'public' | 'private';

export type CommunityMemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export type CommunityMemberStatus = 'active' | 'pending' | 'banned';

export type DiscussionStatus = 'active' | 'closed' | 'pinned';

export type CommunityActivityType =
  | 'publication'
  | 'discussion'
  | 'ressource'
  | 'image'
  | 'video'
  | 'question';

export type FeedFilterChip = 'tout' | 'publications' | 'images' | 'videos' | 'ressources';

export type FeedSortOption = 'recent' | 'populaire' | 'pertinent';

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  bannerUrl?: string;
  category: string;
  visibility: CommunityVisibility;
  rules?: string;
  requireApproval: boolean;
  ownerId: string;
  memberCount: number;
  isOfficial?: boolean;
  isJoined?: boolean;
  userRole?: CommunityMemberRole;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityMember {
  communityId: string;
  userId: string;
  role: CommunityMemberRole;
  status: CommunityMemberStatus;
  joinedAt: string;
}

export interface StudyGroup {
  id: string;
  communityId?: string;
  communityName?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  category: string;
  subject?: string;
  contest?: string;
  level?: string;
  school?: string;
  zone?: string;
  visibility: CommunityVisibility;
  requireApproval: boolean;
  rules?: string;
  ownerId: string;
  memberCount: number;
  isJoined?: boolean;
  isPending?: boolean;
  userRole?: CommunityMemberRole;
  createdAt: string;
  updatedAt?: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: CommunityMemberRole;
  status: CommunityMemberStatus;
  joinedAt: string;
}

export interface DiscussionTopic {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  communityId?: string;
  communityName?: string;
  groupId?: string;
  groupName?: string;
  title: string;
  content: string;
  tags: string[];
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
  status: DiscussionStatus;
  lastActivityAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timeAgo: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface CommunityActivityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  timeAgo: string;
  locationTag: string; // ex: "Dans Préparation Bac S1 2027"
  communityId?: string;
  groupId?: string;
  type: CommunityActivityType;
  content: string;
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
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  comments?: CommunityComment[];
  createdAt: string;
}

export interface PeerUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  role: string;
  badgeLabel?: string;
  school?: string;
  field?: string;
  level?: string;
  contest?: string;
  city?: string;
  followersCount: string | number;
  isFollowing: boolean;
  commonCommunitiesCount?: number;
  interests: string[];
}

export interface CreateCommunityInput {
  name: string;
  description: string;
  image?: string;
  icon?: string;
  category: string;
  domainTheme?: string;
  visibility: CommunityVisibility;
  rules?: string;
  requireApproval: boolean;
}

export interface CreateGroupInput {
  name: string;
  description: string;
  image?: string;
  icon?: string;
  category: string;
  contest?: string;
  subject?: string;
  level?: string;
  school?: string;
  zone?: string;
  visibility: CommunityVisibility;
  rules?: string;
  requireApproval: boolean;
}

export interface CreateDiscussionInput {
  title: string;
  content: string;
  categoryTheme?: string;
  communityId?: string;
  groupId?: string;
  tags?: string[];
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: CommunityMemberRole;
  content: string;
  mediaUrl?: string;
  sharedResource?: {
    title: string;
    type: 'cours' | 'concours' | 'livre' | 'fiche' | 'exercice';
    href: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface GroupResource {
  id: string;
  groupId: string;
  title: string;
  type: string;
  fileSize?: string;
  authorName: string;
  authorAvatar?: string;
  downloadUrl: string;
  downloadsCount: number;
  createdAt: string;
}

