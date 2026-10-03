'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import { ChatUser, ChatGroup, ChatMessage, SharedItem } from '@/types/chat';
import {
  MOCK_ONLINE_USERS,
  MOCK_OFFLINE_USERS,
  MOCK_GROUPS,
  MOCK_MAMADOU_MESSAGES,
  MOCK_SHARED_ITEMS,
} from '@/data/mockChatData';

import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatConversation } from '@/components/chat/ChatConversation';
import { ChatSharedMediaSidebar } from '@/components/chat/ChatSharedMediaSidebar';
import { ChatCallModal } from '@/components/chat/ChatCallModal';

import './discussions.css';

export default function DiscussionsPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Contacts et groupes
  const [onlineUsers] = useState<ChatUser[]>(MOCK_ONLINE_USERS);
  const [offlineUsers] = useState<ChatUser[]>(MOCK_OFFLINE_USERS);
  const [groups] = useState<ChatGroup[]>(MOCK_GROUPS);

  // Utilisateur actuellement sélectionné
  const [activeUser, setActiveUser] = useState<ChatUser>(MOCK_ONLINE_USERS[0]);

  // Messages de la conversation active
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MAMADOU_MESSAGES);

  // Médias et documents partagés
  const [sharedItems, setSharedItems] = useState<SharedItem[]>(MOCK_SHARED_ITEMS);

  // État d'affichage du volet droit « Partagés »
  const [isSharedSidebarOpen, setIsSharedSidebarOpen] = useState(true);

  // État mobile (si sur smartphone, basculer entre la liste et le chat)
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  // Synchroniser la classe sur le body et le html pour verrouiller la page en mode conversation statique
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMobileChatActive) {
        document.body.classList.add('chat-conversation-active');
        document.documentElement.classList.add('chat-conversation-active-html');
      } else {
        document.body.classList.remove('chat-conversation-active');
        document.documentElement.classList.remove('chat-conversation-active-html');
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('chat-conversation-active');
        document.documentElement.classList.remove('chat-conversation-active-html');
      }
    };
  }, [isMobileChatActive]);



  // Modale d'appel
  const [callState, setCallState] = useState<{
    isOpen: boolean;
    type: 'vocal' | 'video' | 'screen';
  }>({
    isOpen: false,
    type: 'vocal',
  });

  // Toast IA ou message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Sélection d'un contact
  const handleSelectUser = (user: ChatUser) => {
    setActiveUser(user);
    setIsMobileChatActive(true);

    if (user.id !== 'user-mamadou') {
      // Nouvelle conversation simulée avec le contact choisi
      setMessages([
        {
          id: `msg-welcome-${user.id}`,
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          text: `Bonjour ! Content de discuter avec toi sur Sunubiblio. Comment avancent tes révisions ?`,
          time: 'À l’instant',
          isMine: false,
          type: 'text',
        },
      ]);
    } else {
      setMessages(MOCK_MAMADOU_MESSAGES);
    }
  };

  // Sélection d'un groupe
  const handleSelectGroup = (group: ChatGroup) => {
    setActiveUser({
      id: group.id,
      name: group.name,
      avatar: group.avatar,
      isOnline: true,
      lastMessage: group.lastMessage,
      time: group.time,
      role: `${group.memberCount} membres`,
    });
    setIsMobileChatActive(true);

    setMessages([
      {
        id: `msg-grp-1`,
        senderId: 'sys-group',
        senderName: group.name,
        senderAvatar: group.avatar,
        text: `Bienvenue dans le salon d'étude de ${group.name} ! Échangez vos questions, corrigés et méthodologies en direct.`,
        time: '10:00',
        isMine: false,
        type: 'text',
      },
    ]);
  };

  // Envoyer un message texte
  const handleSendMessage = (text: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: '/avatar_mamadou.jpg',
      text,
      time: timeStr,
      isMine: true,
      status: 'delivered',
      type: 'text',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Réponse automatique simulée
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderAvatar: activeUser.avatar,
        text: `Bien reçu ! Je regarde ça tout de suite et je te fais un retour sur Sunubiblio.`,
        time: timeStr,
        isMine: false,
        type: 'text',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1400);
  };

  // Envoyer une note vocale avec durée réelle et fichier audio réel
  const handleSendVoiceNote = (duration?: string, audioUrl?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const audioMsg: ChatMessage = {
      id: `audio-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: '/avatar_mamadou.jpg',
      time: timeStr,
      isMine: true,
      status: 'delivered',
      type: 'audio',
      attachment: {
        name: 'Note vocale',
        duration: duration || '0:15',
        url: audioUrl || '#',
        fileType: 'audio',
      },
    };

    setMessages((prev) => [...prev, audioMsg]);
    showToast('Note vocale envoyée avec succès !');
  };

  // Envoyer un document
  const handleSendDocument = (file: File) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} Mo`;

    const docMsg: ChatMessage = {
      id: `doc-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: '/avatar_mamadou.jpg',
      time: timeStr,
      isMine: true,
      status: 'delivered',
      type: 'document',
      attachment: {
        name: file.name,
        size: sizeStr,
        fileType: file.name.endsWith('.docx') ? 'docx' : 'pdf',
      },
    };

    setMessages((prev) => [...prev, docMsg]);

    // Ajouter aux partagés
    setSharedItems((prev) => [
      {
        id: `file-${Date.now()}`,
        type: 'file',
        title: file.name,
        size: sizeStr,
        url: '#',
        time: timeStr,
        extension: file.name.endsWith('.docx') ? 'docx' : 'pdf',
      },
      ...prev,
    ]);

    showToast(`Document "${file.name}" partagé !`);
  };

  // Envoyer une image
  const handleSendImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const imgMsg: ChatMessage = {
        id: `img-${Date.now()}`,
        senderId: 'me',
        senderName: 'Moi',
        senderAvatar: '/avatar_mamadou.jpg',
        time: timeStr,
        isMine: true,
        status: 'delivered',
        type: 'image',
        attachment: {
          name: file.name,
          url: dataUrl,
          fileType: 'image',
        },
      };

      setMessages((prev) => [...prev, imgMsg]);

      setSharedItems((prev) => [
        {
          id: `img-${Date.now()}`,
          type: 'image',
          title: file.name,
          url: dataUrl,
          time: timeStr,
        },
        ...prev,
      ]);

      showToast('Image partagée dans la conversation !');
    };
    reader.readAsDataURL(file);
  };

  // Demander à Sunubiblio IA
  const handleAskAI = (topic: string) => {
    showToast(`Sunubiblio IA : Analyse pédagogique de "${topic}" en cours...`);
    setTimeout(() => {
      const aiResponseMsg: ChatMessage = {
        id: `ai-resp-${Date.now()}`,
        senderId: 'system-ia',
        senderName: 'Sunubiblio IA',
        senderAvatar: '/logo_sunubiblio.png',
        text: `📚 Explication de Sunubiblio IA sur les fonctions :\nUne fonction f: E → F associe à chaque élément de E au plus une image dans F. Pour étudier une fonction au Bac S1, suivez toujours ces 4 étapes :\n1. Ensemble de définition & parité/périodicité\n2. Limites aux bornes et asymptotes\n3. Calcul de f'(x), signe de la dérivée et tableau de variations\n4. Tracé précis de la courbe représentative.`,
        time: 'À l’instant',
        isMine: false,
        type: 'text',
      };
      setMessages((prev) => [...prev, aiResponseMsg]);
    }, 1500);
  };

  // Lancer un appel
  const handleStartCall = (type: 'vocal' | 'video' | 'screen') => {
    setCallState({
      isOpen: true,
      type,
    });
  };

  return (
    <div className={`discussions-page-root ${isMobileChatActive ? 'in-chat-mobile' : ''}`}>
      <Navbar
        activePage="discussions"
        hideOnMobile={isMobileChatActive}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* 1. EN-TÊTE PRINCIPAL : TITRE « DISCUSSIONS » & RECHERCHE GLOBALE */}
      <header className={`discussions-header-bar ${isMobileChatActive ? 'mobile-hidden' : ''}`}>
        <div className="discussions-header-left">
          <h1 className="discussions-page-title">Discussions</h1>
        </div>

        {/* Barre de recherche centrale Ctrl + K */}
        <div className="discussions-global-search">
          <svg className="discussions-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="discussions-global-search-input"
            placeholder="Rechercher une discussion, un ami, un groupe..."
          />
          <kbd className="discussions-search-kbd">Ctrl + K</kbd>
        </div>

        {/* Notifications & Profil */}
        <div className="discussions-header-right">
          <button
            type="button"
            className="discussions-notif-btn"
            title="Notifications"
            aria-label="2 notifications non lues"
          >
            <span>🔔</span>
            <span className="discussions-notif-badge">2</span>
          </button>
        </div>
      </header>

      {/* 2. DISPOSITION MAJEURE EN 3 COLONNES CONFORME À LA MAQUETTE */}
      <main className={`discussions-main-layout ${isMobileChatActive ? 'in-chat-mobile' : ''}`}>
        {/* Colonne Gauche : Amis & Groupes */}
        <div className={`chat-col-left ${isMobileChatActive ? 'mobile-hidden' : ''}`}>
          <ChatSidebar
            onlineUsers={onlineUsers}
            offlineUsers={offlineUsers}
            groups={groups}
            selectedUserId={activeUser.id}
            onSelectUser={handleSelectUser}
            onSelectGroup={handleSelectGroup}
          />
        </div>

        {/* Colonne Centrale : Conversation active */}
        <div className={`chat-col-center ${!isMobileChatActive ? 'mobile-hidden' : ''}`}>
          <ChatConversation
            activeUser={activeUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendVoiceNote={handleSendVoiceNote}
            onSendDocument={handleSendDocument}
            onSendImage={handleSendImage}
            onStartCall={handleStartCall}
            onAskAI={handleAskAI}
            onToggleSharedSidebar={() => setIsSharedSidebarOpen(!isSharedSidebarOpen)}
            isSharedSidebarOpen={isSharedSidebarOpen}
            onBackMobile={() => setIsMobileChatActive(false)}
          />
        </div>

        {/* Colonne Droite : Médias & Documents Partagés */}
        {isSharedSidebarOpen && (
          <div className="chat-col-right">
            <ChatSharedMediaSidebar
              items={sharedItems}
              onClose={() => setIsSharedSidebarOpen(false)}
              onOpenItem={(item) => showToast(`Ouverture de ${item.title}`)}
            />
          </div>
        )}
      </main>

      {/* Modale d'appel interactif simulé */}
      {callState.isOpen && (
        <ChatCallModal
          isOpen={callState.isOpen}
          type={callState.type}
          user={activeUser}
          onClose={() => setCallState({ isOpen: false, type: 'vocal' })}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '999px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 99999,
            fontSize: '0.86rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'pubFadeIn 0.2s ease',
          }}
          role="status"
        >
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Footer institutionnel : affiché statiquement en bas de page sur desktop et sur la liste des contacts mobile */}
      {!isMobileChatActive && <Footer />}
    </div>
  );
}
