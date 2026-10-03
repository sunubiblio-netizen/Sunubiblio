/**
 * Types stricts pour la messagerie & discussions Sunubiblio
 */

export type EphemeralDuration = 'off' | '24h' | '7d' | '90d';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  role?: string;
  phone?: string;
  showPhone?: boolean;
  bio?: string;
  faculty?: string;
  institution?: string;
  memberSince?: string;
  badges?: string[];
}

export interface ChatGroup {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

export type MessageType = 'text' | 'document' | 'audio' | 'image' | 'video' | 'ai_card';

export interface ChatAttachment {
  name: string;
  size?: string;
  url?: string;
  fileType?: 'pdf' | 'docx' | 'epub' | 'image' | 'video' | 'audio';
  duration?: string;
  audioBlobUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text?: string;
  time: string;
  isMine: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type: MessageType;
  attachment?: ChatAttachment;
  aiPrompt?: {
    title: string;
    text: string;
    actionLabel: string;
  };
}

export interface SharedItem {
  id: string;
  type: 'image' | 'video' | 'file';
  title: string;
  size?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  time: string;
  extension?: string;
}
