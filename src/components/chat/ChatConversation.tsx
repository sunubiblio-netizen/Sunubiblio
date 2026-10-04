'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChatUser, ChatMessage, EphemeralDuration } from '@/types/chat';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { ChatEmojiPicker } from './ChatEmojiPicker';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface ChatConversationProps {
  activeUser: ChatUser;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendVoiceNote: (duration?: string, audioUrl?: string) => void;
  onSendDocument: (file: File) => void;
  onSendImage: (file: File) => void;
  onStartCall: (type: 'vocal' | 'video' | 'screen') => void;
  onAskAI: (topic: string) => void;
  onToggleSharedSidebar: () => void;
  isSharedSidebarOpen: boolean;
  onBackMobile?: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  activeUser,
  messages,
  onSendMessage,
  onSendVoiceNote,
  onSendDocument,
  onSendImage,
  onStartCall,
  onAskAI,
  onToggleSharedSidebar,
  isSharedSidebarOpen,
  onBackMobile,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);

  // Nouvelles fonctionnalités WhatsApp & Infos du contact
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalView, setContactModalView] = useState<'main' | 'ephemeral'>('main');
  const [activeMediaTab, setActiveMediaTab] = useState<'media' | 'docs' | 'links'>('media');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [ephemeralDuration, setEphemeralDuration] = useState<EphemeralDuration>('off');
  const [showPhoneToggle, setShowPhoneToggle] = useState<boolean>(!!activeUser.showPhone);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  // Système Audio Player réel et Waveform interactif
  const {
    activeAudioId,
    isPlaying: isAudioPlaying,
    progress: audioProgressVal,
    currentTime: audioCurrentTime,
    duration: audioDurationVal,
    togglePlayAudio,
    seekAudio,
  } = useAudioPlayer();

  // Système WhatsApp Voice Recorder réel avec MediaRecorder, gestes tactiles & cadenas
  const {
    isRecording: isRecordingVoice,
    isHolding: isHoldingVoice,
    isLocked: isLockedVoice,
    isPaused: isPausedRecording,
    recordingSeconds,
    formattedTimer: formattedVoiceTimer,
    dragOffsetX,
    dragOffsetY,
    isNearCancel,
    liveVolume,
    startRecording: startVoiceRecording,
    lockRecording,
    togglePause: togglePauseVoiceRecording,
    cancelRecording: cancelVoiceRecording,
    stopAndSend: stopAndSendVoiceRecording,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useVoiceRecorder({
    onSendAudio: (result) => {
      onSendVoiceNote(result.duration, result.audioUrl);
    },
    onError: (msg) => {
      showChatToast(msg);
    },
  });

  const handleSelectEmoji = (emoji: string) => {
    if (editableRef.current) {
      editableRef.current.innerText += emoji;
      setInputText(editableRef.current.innerText);
    } else {
      setInputText((prev) => prev + emoji);
    }
  };

  // Verrouillage propre du défilement d'arrière-plan sans aucun saut
  useLockBodyScroll(isContactModalOpen || !!previewImage);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowPhoneToggle(!!activeUser.showPhone);
  }, [activeUser]);

  const showChatToast = (msg: string) => {
    setChatToast(msg);
    setTimeout(() => setChatToast(null), 3000);
  };

  const handleSetEphemeral = (duration: EphemeralDuration) => {
    setEphemeralDuration(duration);
    const labels: Record<EphemeralDuration, string> = {
      off: 'Messages éphémères désactivés',
      '24h': 'Messages éphémères définis sur 24 heures',
      '7d': 'Messages éphémères définis sur 7 jours',
      '90d': 'Messages éphémères définis sur 90 jours',
    };
    showChatToast(labels[duration]);
  };

  // Exemples réalistes de médias, documents PDF et liens partagés
  const contactMediaItems = [
    { id: 'm-1', title: 'Schéma Intégrales & Analyse L3', src: '/math_bac_s1.jpg', date: 'Hier, 14:20' },
    { id: 'm-2', title: 'Exercices Suites & Continuité', src: '/vid_fonctions.jpg', date: 'Hier, 11:05' },
    { id: 'm-3', title: 'Fiche Méthodologie Dissertation', src: '/livre_philosophie.jpg', date: '28 Sept' },
    { id: 'm-4', title: 'Algorithmique & Structures de Données', src: '/vid_python.jpg', date: '24 Sept' },
  ];

  const contactPdfItems = [
    { id: 'pdf-1', title: 'Synthese_Algebre_Lineaire_L3.pdf', pages: '28 pages', size: '2.4 Mo', date: 'Hier', downloads: 14 },
    { id: 'pdf-2', title: 'Concours_ENA_2025_Epreuve_Culture.pdf', pages: '12 pages', size: '1.8 Mo', date: '29 Sept', downloads: 38 },
    { id: 'pdf-3', title: 'Fascicule_Physique_Mecanique_BacS.pdf', pages: '45 pages', size: '4.1 Mo', date: '22 Sept', downloads: 52 },
    { id: 'pdf-4', title: 'Guide_Methodologie_Recherche_Sunubiblio.pdf', pages: '16 pages', size: '980 Ko', date: '15 Sept', downloads: 89 },
  ];

  const contactLinksItems = [
    { id: 'lnk-1', title: 'Sunubiblio • Cours Algèbre Linéaire Avancée', url: 'https://sunubiblio.sn/bibliotheque/livres/algebre-avancee', domain: 'sunubiblio.sn' },
    { id: 'lnk-2', title: 'Annales & Conseils Officiels Concours ENA 2026', url: 'https://sunubiblio.sn/concours/ena-senegal-2025', domain: 'sunubiblio.sn' },
    { id: 'lnk-3', title: 'Club Académique Sciences & Mathématiques Sunubiblio', url: 'https://sunubiblio.sn/communaute/club-mathematiques', domain: 'sunubiblio.sn' },
  ];

  const scrollToBottom = (smooth = true) => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
      inline: 'nearest',
    });
  };



  // Auto-scroll au dernier message (immédiat puis différé pour laisser le rendu DOM s'ajuster)
  useEffect(() => {
    scrollToBottom(false);
    const timer = setTimeout(() => scrollToBottom(true), 80);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = (editableRef.current ? editableRef.current.innerText : inputText).trim();
    if (!text) return;
    onSendMessage(text);
    setInputText('');
    if (editableRef.current) {
      editableRef.current.innerHTML = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    // Quand le clavier virtuel mobile s'ouvre, scroller au dernier message
    setTimeout(() => {
      scrollToBottom(true);
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }, 160);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendDocument(file);
      setIsAttachMenuOpen(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendImage(file);
      setIsAttachMenuOpen(false);
    }
  };

  // Filtrage des messages si recherche active
  const displayedMessages = searchQuery.trim()
    ? messages.filter((m) => m.text?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <section className="chat-conversation-root" aria-label="Conversation active">
      {/* 1. En-tête de la conversation façon WhatsApp */}
      <div className="chat-conv-header">
        <div className="chat-conv-header-left" onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>
          {onBackMobile && (
            <button
              type="button"
              className="chat-back-mobile-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBackMobile();
              }}
              aria-label="Retour aux discussions"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className="chat-conv-user-avatar-wrap">
            <Image
              src={activeUser.avatar}
              alt={activeUser.name}
              width={46}
              height={46}
              className="chat-conv-avatar-img"
            />
            {activeUser.isOnline && <span className="chat-conv-online-dot" />}
          </div>

          <div className="chat-conv-user-info">
            <h2 className="chat-conv-user-name">
              <span>{activeUser.name}</span>
              {isMuted && <span className="chat-mute-icon" title="Notifications en sourdine"> 🔇</span>}
            </h2>
            <span className="chat-conv-status-text">
              {ephemeralDuration !== 'off' ? (
                <span className="chat-ephemeral-header-badge">
                  ⏱️ {ephemeralDuration === '24h' ? '24h' : ephemeralDuration === '7d' ? '7j' : '90j'}
                </span>
              ) : activeUser.isOnline ? (
                'En ligne'
              ) : (
                activeUser.lastSeen || 'Hors ligne'
              )}
            </span>
          </div>
        </div>

        {/* Actions d'en-tête WhatsApp : Appel vidéo, Appel vocal, Menu 3 points ⋮ */}
        <div className="chat-conv-header-actions">
          {/* Appel vidéo */}
          <button
            type="button"
            className="chat-wa-header-icon-btn"
            onClick={() => onStartCall('video')}
            title="Appel vidéo"
            aria-label="Appel vidéo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
          </button>

          {/* Appel vocal */}
          <button
            type="button"
            className="chat-wa-header-icon-btn"
            onClick={() => onStartCall('vocal')}
            title="Appel vocal"
            aria-label="Appel vocal"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>

          {/* Menu 3 points verticaux ⋮ */}
          <div className="chat-dots-menu-container">
            <button
              type="button"
              className={`chat-wa-header-icon-btn chat-dots-trigger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Options"
              aria-label="Options"
              aria-expanded={isMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {/* Menu contextuel déroulant façon WhatsApp */}
            {isMenuOpen && (
              <>
                <div
                  className="chat-dots-menu-backdrop"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="chat-dots-dropdown-menu">


                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsContactModalOpen(true);
                    }}
                  >
                    <span>Afficher le contact</span>
                  </button>

                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                  >
                    <span>Rechercher</span>
                  </button>

                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleSharedSidebar();
                    }}
                  >
                    <span>Médias, liens et documents</span>
                  </button>

                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onStartCall('screen');
                    }}
                  >
                    <span>Partager l'écran</span>
                  </button>

                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMuted(!isMuted);
                      showChatToast(!isMuted ? 'Notifications en sourdine' : 'Notifications rétablies');
                    }}
                  >
                    <span>{isMuted ? 'Rétablir les notifications' : 'Mode silencieux'}</span>
                  </button>

                  <button
                    type="button"
                    className="chat-dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setContactModalView('ephemeral');
                      setIsContactModalOpen(true);
                    }}
                  >
                    <span>Messages éphémères ({ephemeralDuration === 'off' ? 'Désactivé' : ephemeralDuration})</span>
                  </button>

                  <div className="chat-dropdown-divider" />

                  <button
                    type="button"
                    className="chat-dropdown-item danger"
                    onClick={() => {
                      setIsMenuOpen(false);
                      showChatToast('Historique des messages synchronisé.');
                    }}
                  >
                    <span>Vider la discussion</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche interne à la discussion */}
      {isSearchOpen && (
        <div className="chat-in-conv-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher dans la discussion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-in-conv-search-input"
            autoFocus
          />
          {searchQuery && (
            <span className="chat-search-match-count">
              {displayedMessages.length} trouvé{displayedMessages.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            type="button"
            className="chat-in-conv-search-close"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            title="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notification Toast interne au chat */}
      {chatToast && (
        <div className="chat-internal-toast">
          <span>🔔 {chatToast}</span>
        </div>
      )}

      {/* 2. Fil des messages */}
      <div className="chat-messages-container">
        {/* Séparateur de date */}
        <div className="chat-date-separator">
          <span>Aujourd'hui</span>
        </div>

        {ephemeralDuration !== 'off' && (
          <div className="chat-ephemeral-banner-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              Messages éphémères activés ({ephemeralDuration === '24h' ? '24 heures' : ephemeralDuration === '7d' ? '7 jours' : '90 jours'}). Les nouveaux messages disparaîtront automatiquement de cette discussion.
            </span>
          </div>
        )}

        {displayedMessages.length === 0 && searchQuery.trim() && (
          <div className="chat-search-empty-state">
            <p>Aucun message trouvé pour &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {displayedMessages.map((msg) => {
          const isMine = msg.isMine;

          return (
            <div
              key={msg.id}
              className={`chat-message-row ${isMine ? 'is-mine' : 'is-other'} ${msg.type === 'ai_card' ? 'is-ai' : ''}`}
            >
              {!isMine && msg.type !== 'ai_card' && (
                <div className="chat-msg-avatar-slot">
                  <Image
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    width={32}
                    height={32}
                    className="chat-msg-author-avatar"
                  />
                </div>
              )}

              {/* Message Texte classique */}
              {msg.type === 'text' && (
                <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>
                  <p className="chat-bubble-text">{msg.text}</p>
                  <div className="chat-bubble-meta">
                    <span className="chat-bubble-time">{msg.time}</span>
                    {isMine && (
                      <span className="chat-read-checks" title="Lu">✓✓</span>
                    )}
                  </div>
                </div>
              )}

              {/* Message Pièce jointe / Document */}
              {msg.type === 'document' && msg.attachment && (
                <div className={`chat-bubble doc-bubble ${isMine ? 'mine' : 'other'}`}>
                  <div className="chat-doc-card">
                    <div className="chat-doc-icon-badge">
                      <span className="pdf-tag">PDF</span>
                    </div>
                    <div className="chat-doc-info">
                      <span className="chat-doc-name">{msg.attachment.name}</span>
                      <span className="chat-doc-size">{msg.attachment.size}</span>
                    </div>
                    <a
                      href={msg.attachment.url || '#'}
                      className="chat-doc-download-link"
                      title="Télécharger le document"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  </div>
                  <div className="chat-bubble-meta">
                    <span className="chat-bubble-time">{msg.time}</span>
                    {isMine && <span className="chat-read-checks">✓✓</span>}
                  </div>
                </div>
              )}

              {/* Message Note vocale avec Waveform interactif et vrai son */}
              {msg.type === 'audio' && (
                <div className={`chat-bubble audio-bubble ${isMine ? 'mine' : 'other'}`}>
                  <div className="chat-audio-player">
                    <button
                      type="button"
                      className="chat-audio-play-btn"
                      onClick={() => togglePlayAudio(msg.id, msg.attachment?.url, msg.attachment?.duration)}
                      aria-label={activeAudioId === msg.id && isAudioPlaying ? 'Mettre en pause' : 'Écouter la note vocale'}
                    >
                      {activeAudioId === msg.id && isAudioPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    {/* Onde sonore animée et interactive (waveform) */}
                    <div className="chat-waveform-bars" role="progressbar" aria-label="Progression audio">
                      {[40, 65, 80, 50, 95, 70, 45, 85, 60, 40, 75, 90, 55, 35, 70, 50, 60, 40, 30].map(
                        (h, idx, arr) => {
                          const isThisAudio = activeAudioId === msg.id;
                          const barPct = (idx / arr.length) * 100;
                          const isPlayed = isThisAudio && barPct <= audioProgressVal;
                          const isAnimating = isThisAudio && isAudioPlaying;

                          return (
                            <span
                              key={idx}
                              className={`waveform-bar ${isPlayed ? 'played' : ''} ${isAnimating ? 'animating' : ''}`}
                              style={{ height: `${h}%` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isThisAudio) {
                                  seekAudio(barPct);
                                } else {
                                  togglePlayAudio(msg.id, msg.attachment?.url, msg.attachment?.duration);
                                }
                              }}
                            />
                          );
                        }
                      )}
                    </div>

                    <span className="chat-audio-duration">
                      {activeAudioId === msg.id && isAudioPlaying
                        ? `${Math.floor(audioCurrentTime / 60)}:${(audioCurrentTime % 60).toString().padStart(2, '0')}`
                        : (msg.attachment?.duration || '0:15')}
                    </span>
                  </div>

                  <div className="chat-bubble-meta">
                    <span className="chat-bubble-time">{msg.time}</span>
                    {isMine && <span className="chat-read-checks">✓✓</span>}
                  </div>
                </div>
              )}

              {/* Suggestion contextuelle Sunubiblio IA */}
              {msg.type === 'ai_card' && msg.aiPrompt && (
                <div className="chat-ai-suggestion-box">
                  <div className="chat-ai-card-content">
                    <div className="chat-ai-header-row">
                      <div className="chat-ai-brand">
                        <span className="chat-ai-sparkle-icon">✨</span>
                        <span className="chat-ai-title">{msg.aiPrompt.title}</span>
                      </div>
                      <button
                        type="button"
                        className="chat-ai-dismiss-btn"
                        title="Masquer la suggestion"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="chat-ai-text">{msg.aiPrompt.text}</p>

                    <button
                      type="button"
                      className="chat-ai-action-btn"
                      onClick={() => onAskAI('Explication des fonctions mathématiques')}
                    >
                      <span>{msg.aiPrompt.actionLabel}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ height: '24px', flexShrink: 0 }} aria-hidden="true" />
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Barre de saisie en bas — Disposition exacte WhatsApp */}
      <div className={`chat-input-bar-wrap ${isInputFocused ? 'is-focused-floating' : ''} ${isContactModalOpen ? 'is-hidden-by-modal' : ''}`}>
        {/* Menu pièces jointes popover façon WhatsApp */}
        {isAttachMenuOpen && (
          <>
            <div
              className="chat-attach-backdrop"
              onClick={() => setIsAttachMenuOpen(false)}
            />
            <div className="chat-wa-attach-popover">
              <button
                type="button"
                className="chat-wa-attach-grid-item"
                onClick={() => {
                  setIsAttachMenuOpen(false);
                  fileInputRef.current?.click();
                }}
              >
                <div className="chat-wa-attach-circle attach-doc">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span>Document</span>
              </button>

              <button
                type="button"
                className="chat-wa-attach-grid-item"
                onClick={() => {
                  setIsAttachMenuOpen(false);
                  cameraInputRef.current?.click();
                }}
              >
                <div className="chat-wa-attach-circle attach-camera">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <span>Caméra</span>
              </button>

              <button
                type="button"
                className="chat-wa-attach-grid-item"
                onClick={() => {
                  setIsAttachMenuOpen(false);
                  imageInputRef.current?.click();
                }}
              >
                <div className="chat-wa-attach-circle attach-gallery">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <span>Galerie</span>
              </button>

              <button
                type="button"
                className="chat-wa-attach-grid-item"
                onClick={() => {
                  setIsAttachMenuOpen(false);
                  startVoiceRecording();
                  lockRecording();
                }}
              >
                <div className="chat-wa-attach-circle attach-audio">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <span>Audio</span>
              </button>

              <button
                type="button"
                className="chat-wa-attach-grid-item"
                onClick={() => {
                  setIsAttachMenuOpen(false);
                  onSendMessage("🤖 Peux-tu m'expliquer ce cours étape par étape ?");
                }}
              >
                <div className="chat-wa-attach-circle attach-ai">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <span>Sunu IA</span>
              </button>
            </div>
          </>
        )}

        {/* Inputs cachés */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        {/* Sélecteur d'émojis WhatsApp (Image 3) */}
        <ChatEmojiPicker
          isOpen={isEmojiPickerOpen}
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setIsEmojiPickerOpen(false)}
        />

        {/* 1. Cadenas flottant vertical WhatsApp au-dessus du micro (Visible lors du maintien tactile / Pointer) */}
        {isHoldingVoice && !isLockedVoice && (
          <div
            className="chat-wa-lock-capsule-wrapper"
            title="Glisser vers le haut pour verrouiller"
          >
            <div className={`chat-wa-lock-capsule ${dragOffsetY > 38 ? 'snapping' : ''}`}>
              <div
                className="chat-wa-lock-chevron"
                style={{
                  transform: `translateY(-${Math.min(8, dragOffsetY * 0.2)}px)`,
                  opacity: Math.max(0.3, 1 - (dragOffsetY / 65) * 0.6),
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>
              <div
                className="chat-wa-lock-icon"
                style={{
                  transform: dragOffsetY > 45 ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d={dragOffsetY > 45 ? "M7 11V7a5 5 0 0 1 10 0v4" : "M7 11V7a5 5 0 0 1 9.5-1.5"} />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 2. Barre d'entrée principale WhatsApp */}
        <div className="chat-wa-input-row">
          {isLockedVoice ? (
            /* A. Mode Verrouillé (Mains libres avec Corbeille, Timer, Waveform micro dynamique, Pause, Envoi) */
            <div className="chat-wa-voice-recording-pill">
              <button
                type="button"
                className="chat-wa-voice-trash-btn"
                onClick={cancelVoiceRecording}
                title="Supprimer la note vocale"
                aria-label="Supprimer la note vocale"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>

              <div className="chat-wa-voice-center-track">
                <span className={`chat-wa-voice-rec-dot ${isPausedRecording ? 'is-paused' : ''}`} />
                <span className="chat-wa-voice-timer">{formattedVoiceTimer}</span>

                {/* Ondes audio qui réagissent en temps réel au son du microphone */}
                <div className="chat-wa-voice-live-waves">
                  {[25, 50, 75, 40, 90, 65, 35, 80, 100, 70, 45, 85, 75, 45, 80, 60, 35, 70, 95, 50, 70, 40, 25].map(
                    (baseH, idx) => {
                      const dynamicHeight = isPausedRecording
                        ? 14
                        : Math.min(100, Math.max(12, baseH * liveVolume * 1.6));
                      return (
                        <span
                          key={idx}
                          className={`chat-wa-wave-bar ${!isPausedRecording ? 'animating' : ''}`}
                          style={{ height: `${dynamicHeight}%` }}
                        />
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  className="chat-wa-voice-pause-btn"
                  onClick={togglePauseVoiceRecording}
                  title={isPausedRecording ? 'Reprendre' : 'Mettre en pause'}
                  aria-label={isPausedRecording ? 'Reprendre' : 'Mettre en pause'}
                >
                  {isPausedRecording ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Bouton Envoi Vert Circulaire WhatsApp (➤) */}
              <button
                type="button"
                className="chat-wa-voice-send-btn"
                onClick={() => stopAndSendVoiceRecording()}
                title="Envoyer la note vocale"
                aria-label="Envoyer"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              {isHoldingVoice ? (
                /* B. Mode Maintien Tactile Mobile (Barre sombre WhatsApp + micro rouge + ondes + slide pour annuler) */
                <div className="chat-wa-holding-bar">
                  <div className="chat-wa-holding-left">
                    <div className="chat-wa-rec-indicator">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <line x1="12" y1="19" x2="12" y2="22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="chat-wa-digital-timer">{formattedVoiceTimer}</span>

                    {/* Ondes réactives au volume vocal en direct */}
                    <div className="chat-wa-holding-waves">
                      {[30, 60, 95, 45, 85, 55, 75, 40].map((baseH, idx) => (
                        <span
                          key={idx}
                          className="chat-wa-wave-bar animating"
                          style={{ height: `${Math.min(100, Math.max(16, baseH * liveVolume * 1.5))}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className={`chat-wa-slide-cancel ${isNearCancel ? 'near-cancel' : ''}`}
                    style={{ transform: `translateX(${dragOffsetX}px)` }}
                  >
                    <span className="chat-wa-slide-chevron">‹</span>
                    <span className="chat-wa-slide-text">
                      {isNearCancel ? 'Relâcher pour annuler' : 'Faire glisser pour annuler'}
                    </span>
                  </div>
                </div>
              ) : (
                /* C. Mode Normal : Pilule de saisie (Émojis, Input, Fichier, Caméra) */
                <div className="chat-wa-input-pill">
                  <button
                    type="button"
                    className={`chat-wa-pill-btn chat-wa-emoji-btn ${isEmojiPickerOpen ? 'active' : ''}`}
                    title="Émojis"
                    aria-label="Choisir un émoji"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
                    </svg>
                  </button>

                  <div
                    ref={editableRef}
                    role="textbox"
                    contentEditable={true}
                    aria-multiline={true}
                    aria-label="Message"
                    className="chat-wa-text-input chat-wa-editable-input"
                    data-placeholder="Message"
                    onInput={(e) => {
                      const text = e.currentTarget.innerText || '';
                      if (!text.trim() && e.currentTarget.innerHTML !== '') {
                        e.currentTarget.innerHTML = '';
                      }
                      setInputText(text);
                    }}
                    onKeyDown={handleKeyPress}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="sentences"
                    suppressContentEditableWarning={true}
                  />

                  <button
                    type="button"
                    className="chat-wa-pill-btn chat-wa-clip-btn"
                    title="Joindre un fichier"
                    aria-label="Joindre un fichier"
                    onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="chat-wa-pill-btn chat-wa-cam-btn"
                    title="Prendre une photo"
                    aria-label="Prendre une photo ou vidéo"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Bouton d'action stable à droite : Envoi si texte, Micro si vide ou maintien */}
              {inputText.trim() && !isHoldingVoice ? (
                <button
                  type="button"
                  className="chat-wa-action-btn chat-send-active"
                  onClick={() => handleSend()}
                  title="Envoyer le message"
                  aria-label="Envoyer le message"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className={`chat-wa-action-btn chat-mic-active ${isHoldingVoice ? 'recording-holding' : ''}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    ...(isHoldingVoice
                      ? {
                          transform: `translate3d(0, -${dragOffsetY}px, 0) scale(${1.22 + (dragOffsetY / 120) * 0.08})`,
                          boxShadow: `0 ${Math.max(2, Math.round(dragOffsetY * 0.35))}px ${16 + Math.round(dragOffsetY * 0.35)}px rgba(0, 168, 132, ${Math.min(0.95, 0.75 + (dragOffsetY / 60) * 0.2)})`,
                          transition:
                            dragOffsetY === 0
                              ? 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                              : 'transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.1), box-shadow 0.15s ease',
                        }
                      : {}),
                  }}
                  title="Message vocal (Maintenir pour parler, glisser à gauche pour annuler, glisser en haut pour verrouiller)"
                  aria-label="Enregistrer un message vocal"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 4. Modal "Infos du contact" repensée façon WhatsApp x Sunubiblio Haute Définition */}
      {isContactModalOpen && (
        <div className="chat-contact-modal-overlay" onClick={() => setIsContactModalOpen(false)}>
          <div className="chat-contact-modal-sheet" onClick={(e) => e.stopPropagation()}>
            
            {/* VUE 1 : Fiche principale d'infos du contact */}
            {contactModalView === 'main' && (
              <>
                <div className="chat-contact-modal-header">
                  <button
                    type="button"
                    className="chat-contact-close-btn"
                    onClick={() => setIsContactModalOpen(false)}
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                  <h3 className="chat-contact-modal-title">Infos du contact</h3>
                  <button
                    type="button"
                    className="chat-contact-header-share-btn"
                    onClick={() => showChatToast('Lien du profil étudiant copié !')}
                    title="Partager le contact"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </button>
                </div>

                <div className="chat-contact-scroll-body">
                  {/* Hero Profil avec Bannière décorative */}
                  <div className="chat-contact-profile-hero">
                    <div className="chat-contact-avatar-wrapper">
                      <div className="chat-contact-avatar-large">
                        <Image
                          src={activeUser.avatar}
                          alt={activeUser.name}
                          width={104}
                          height={104}
                          className="chat-contact-avatar-img"
                        />
                        <span className={`chat-contact-status-dot ${activeUser.isOnline ? 'online' : 'offline'}`} />
                      </div>
                    </div>

                    <div className="chat-contact-name-row">
                      <h2 className="chat-contact-name-title">{activeUser.name}</h2>
                      <span className="chat-contact-verified-badge" title="Profil vérifié Sunubiblio">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0284c7">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </span>
                    </div>

                    {/* Rôle et affiliation académique Sunubiblio */}
                    <div className="chat-contact-role-container">
                      <span className="chat-contact-academic-role">
                        {activeUser.role || 'Étudiant certifié'}
                      </span>
                      {activeUser.institution && (
                        <span className="chat-contact-inst-badge">
                          🏛️ {activeUser.institution}
                        </span>
                      )}
                    </div>

                    {/* Numéro de téléphone conditionnel selon le souhait de l'utilisateur */}
                    {activeUser.phone && showPhoneToggle ? (
                      <div className="chat-contact-phone-active-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span className="chat-contact-phone-number">{activeUser.phone}</span>
                      </div>
                    ) : (
                      <div className="chat-contact-privacy-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Numéro masqué • Respect de la vie privée</span>
                      </div>
                    )}

                    <span className={`chat-contact-presence-badge ${activeUser.isOnline ? 'online' : 'offline'}`}>
                      {activeUser.isOnline ? 'En ligne actuellement' : `Vu à ${activeUser.lastSeen || '10:00'}`}
                    </span>
                  </div>

                  {/* Actions Rapides Stylisées */}
                  <div className="chat-contact-quick-actions">
                    <button
                      type="button"
                      className="chat-contact-act-btn"
                      onClick={() => {
                        setIsContactModalOpen(false);
                        onStartCall('vocal');
                      }}
                    >
                      <div className="chat-act-icon-wrap vocal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <span>Appel</span>
                    </button>

                    <button
                      type="button"
                      className="chat-contact-act-btn"
                      onClick={() => {
                        setIsContactModalOpen(false);
                        onStartCall('video');
                      }}
                    >
                      <div className="chat-act-icon-wrap video">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                          <rect x="2" y="6" width="14" height="12" rx="2" />
                        </svg>
                      </div>
                      <span>Vidéo</span>
                    </button>

                    <button
                      type="button"
                      className="chat-contact-act-btn"
                      onClick={() => {
                        setIsContactModalOpen(false);
                        setIsSearchOpen(true);
                      }}
                    >
                      <div className="chat-act-icon-wrap search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                      <span>Rechercher</span>
                    </button>

                    <button
                      type="button"
                      className="chat-contact-act-btn"
                      onClick={() => showChatToast('Contact partagé avec votre groupe de révision !')}
                    >
                      <div className="chat-act-icon-wrap forward">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </div>
                      <span>Partager</span>
                    </button>
                  </div>

                  {/* Section 1 : Statut & À propos académique */}
                  <div className="chat-contact-card">
                    <div className="chat-contact-card-header">
                      <span className="chat-contact-card-label">Statut & Biographie</span>
                    </div>
                    <p className="chat-contact-bio-quote">
                      {activeUser.bio || 'Passionné de savoir, d’échanges académiques et d’entraide sur la plateforme Sunubiblio 📚🚀'}
                    </p>
                    
                    <div className="chat-contact-meta-footer">
                      <span className="chat-contact-meta-item">
                        🗓️ {activeUser.memberSince ? `Membre depuis ${activeUser.memberSince}` : 'Membre certifié Sunubiblio'}
                      </span>
                      {activeUser.badges && activeUser.badges.length > 0 && (
                        <div className="chat-contact-badges-row">
                          {activeUser.badges.map((b, idx) => (
                            <span key={idx} className="chat-contact-badge-chip">
                              ✨ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2 : Médias, Documents PDF et Liens Réels */}
                  <div className="chat-contact-card">
                    <div className="chat-contact-card-header flex-between">
                      <span className="chat-contact-card-label">Médias, Liens & Documents</span>
                      <span className="chat-contact-count-chip">
                        {activeMediaTab === 'media' ? `${contactMediaItems.length} photos` : activeMediaTab === 'docs' ? `${contactPdfItems.length} PDFs` : `${contactLinksItems.length} liens`}
                      </span>
                    </div>

                    {/* Onglets de sélection */}
                    <div className="chat-contact-tabs-bar">
                      <button
                        type="button"
                        className={`chat-contact-tab-btn ${activeMediaTab === 'media' ? 'active' : ''}`}
                        onClick={() => setActiveMediaTab('media')}
                      >
                        🖼️ Médias ({contactMediaItems.length})
                      </button>
                      <button
                        type="button"
                        className={`chat-contact-tab-btn ${activeMediaTab === 'docs' ? 'active' : ''}`}
                        onClick={() => setActiveMediaTab('docs')}
                      >
                        📄 Documents ({contactPdfItems.length})
                      </button>
                      <button
                        type="button"
                        className={`chat-contact-tab-btn ${activeMediaTab === 'links' ? 'active' : ''}`}
                        onClick={() => setActiveMediaTab('links')}
                      >
                        🔗 Liens ({contactLinksItems.length})
                      </button>
                    </div>

                    {/* Onglet 1 : Médias (Photos / Schémas réels) */}
                    {activeMediaTab === 'media' && (
                      <div className="chat-contact-media-grid">
                        {contactMediaItems.map((item) => (
                          <div
                            key={item.id}
                            className="chat-contact-media-cell"
                            onClick={() => setPreviewImage(item.src)}
                            title="Cliquez pour agrandir"
                          >
                            <Image
                              src={item.src}
                              alt={item.title}
                              fill
                              sizes="(max-width: 480px) 50vw, 120px"
                              className="chat-contact-media-img"
                            />
                            <div className="chat-contact-media-overlay">
                              <span className="chat-contact-media-date">{item.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Onglet 2 : Documents PDF Réalistes */}
                    {activeMediaTab === 'docs' && (
                      <div className="chat-contact-docs-list">
                        {contactPdfItems.map((doc) => (
                          <div key={doc.id} className="chat-contact-doc-item">
                            <div className="chat-contact-doc-icon-badge">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" fill="#fca5a5" />
                                <line x1="16" y1="13" x2="8" y2="13" stroke="#fff" strokeWidth="2" />
                                <line x1="16" y1="17" x2="8" y2="17" stroke="#fff" strokeWidth="2" />
                                <polyline points="10 9 9 9 8 9" stroke="#fff" strokeWidth="2" />
                              </svg>
                            </div>
                            <div className="chat-contact-doc-info">
                              <h4 className="chat-contact-doc-title">{doc.title}</h4>
                              <p className="chat-contact-doc-sub">
                                {doc.pages} • {doc.size} • {doc.date}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="chat-contact-doc-download-btn"
                              onClick={() => showChatToast(`Téléchargement de ${doc.title}...`)}
                              title="Télécharger le document"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Onglet 3 : Liens partagés */}
                    {activeMediaTab === 'links' && (
                      <div className="chat-contact-links-list">
                        {contactLinksItems.map((lnk) => (
                          <div key={lnk.id} className="chat-contact-link-item">
                            <div className="chat-contact-link-icon">
                              🔗
                            </div>
                            <div className="chat-contact-link-content">
                              <h4 className="chat-contact-link-title">{lnk.title}</h4>
                              <span className="chat-contact-link-url">{lnk.domain}</span>
                            </div>
                            <button
                              type="button"
                              className="chat-contact-link-btn"
                              onClick={() => showChatToast('Lien de la ressource ouvert dans la bibliothèque')}
                            >
                              ↗
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 3 : Confidentialité & Paramètres WhatsApp interactifs */}
                  <div className="chat-contact-card">
                    <div className="chat-contact-card-header">
                      <span className="chat-contact-card-label">Confidentialité & Paramètres</span>
                    </div>

                    {/* Messages éphémères cliquables (Ouvre la sous-vue) */}
                    <div
                      className="chat-contact-interactive-row"
                      onClick={() => setContactModalView('ephemeral')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chat-row-left">
                        <div className="chat-row-icon-pill">
                          ⏱️
                        </div>
                        <div className="chat-row-text">
                          <span className="chat-row-title">Messages éphémères</span>
                          <span className="chat-row-desc">
                            {ephemeralDuration === 'off'
                              ? 'Désactivé'
                              : ephemeralDuration === '24h'
                              ? 'Délai : 24 heures'
                              : ephemeralDuration === '7d'
                              ? 'Délai : 7 jours'
                              : 'Délai : 90 jours'}
                          </span>
                        </div>
                      </div>
                      <div className="chat-row-right">
                        <span className={`chat-duration-pill ${ephemeralDuration !== 'off' ? 'active' : ''}`}>
                          {ephemeralDuration === 'off' ? 'Désactivé' : ephemeralDuration}
                        </span>
                        <span className="chat-chevron-arrow">›</span>
                      </div>
                    </div>

                    {/* Mode silencieux */}
                    <div className="chat-contact-switch-row">
                      <div className="chat-row-left">
                        <div className="chat-row-icon-pill">
                          🔔
                        </div>
                        <div className="chat-row-text">
                          <span className="chat-row-title">Mode silencieux</span>
                          <span className="chat-row-desc">Désactiver les alertes sonores pour cette discussion</span>
                        </div>
                      </div>
                      <label className="chat-ios-switch">
                        <input
                          type="checkbox"
                          checked={isMuted}
                          onChange={(e) => {
                            setIsMuted(e.target.checked);
                            showChatToast(e.target.checked ? 'Discussion mise en sourdine' : 'Notifications activées');
                          }}
                        />
                        <span className="chat-ios-slider" />
                      </label>
                    </div>

                    {/* Partage du numéro (À la condition du souhait de l'utilisateur) */}
                    <div className="chat-contact-switch-row">
                      <div className="chat-row-left">
                        <div className="chat-row-icon-pill">
                          📱
                        </div>
                        <div className="chat-row-text">
                          <span className="chat-row-title">Afficher le numéro de téléphone</span>
                          <span className="chat-row-desc">
                            {showPhoneToggle ? 'Le numéro est visible par ce contact' : 'Numéro gardé confidentiel'}
                          </span>
                        </div>
                      </div>
                      <label className="chat-ios-switch">
                        <input
                          type="checkbox"
                          checked={showPhoneToggle}
                          onChange={(e) => {
                            setShowPhoneToggle(e.target.checked);
                            showChatToast(e.target.checked ? 'Numéro de téléphone rendu visible' : 'Numéro de téléphone masqué');
                          }}
                        />
                        <span className="chat-ios-slider" />
                      </label>
                    </div>

                    {/* Chiffrement de bout en bout */}
                    <div className="chat-contact-security-row">
                      <div className="chat-sec-icon">🔒</div>
                      <div className="chat-sec-text">
                        <strong>Chiffrement de bout en bout</strong>
                        <p>Les messages et les appels personnels sont protégés selon le protocole de confidentialité Sunubiblio.</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions de blocage / signalement */}
                  <div className="chat-contact-card danger-card">
                    <button
                      type="button"
                      className="chat-contact-danger-btn"
                      onClick={() => showChatToast(`Contact ${activeUser.name} bloqué.`)}
                    >
                      🚫 Bloquer {activeUser.name}
                    </button>
                    <button
                      type="button"
                      className="chat-contact-danger-btn report"
                      onClick={() => showChatToast('Signalement transmis à l’équipe de modération Sunubiblio.')}
                    >
                      ⚠️ Signaler le contact
                    </button>
                  </div>
                </div>

                <div className="chat-contact-modal-footer">
                  <button
                    type="button"
                    className="chat-contact-modal-done-btn"
                    onClick={() => setIsContactModalOpen(false)}
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}

            {/* VUE 2 : Sélecteur de Messages Éphémères (24h / 7 jours / 90 jours / Non) */}
            {contactModalView === 'ephemeral' && (
              <div className="chat-ephemeral-subview">
                <div className="chat-contact-modal-header">
                  <button
                    type="button"
                    className="chat-contact-back-btn"
                    onClick={() => setContactModalView('main')}
                    aria-label="Retour"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <h3 className="chat-contact-modal-title">Messages éphémères</h3>
                  <button
                    type="button"
                    className="chat-contact-close-btn"
                    onClick={() => setIsContactModalOpen(false)}
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                </div>

                <div className="chat-contact-scroll-body">
                  <div className="chat-ephemeral-hero-banner">
                    <div className="chat-ephemeral-hero-icon-ring">
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <h3 className="chat-ephemeral-hero-title">Faites disparaître les messages</h3>
                    <p className="chat-ephemeral-hero-desc">
                      Pour plus de confidentialité, les nouveaux messages envoyés dans cette discussion disparaîtront pour tout le monde après la durée sélectionnée.
                    </p>
                  </div>

                  <div className="chat-ephemeral-options-group">
                    <div className="chat-ephemeral-section-subtitle">Délai avant disparition :</div>

                    {/* Option 1 : 24 heures */}
                    <div
                      className={`chat-ephemeral-choice-card ${ephemeralDuration === '24h' ? 'selected' : ''}`}
                      onClick={() => handleSetEphemeral('24h')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chat-choice-content">
                        <div className="chat-choice-title">
                          <strong>24 heures</strong>
                          <span className="chat-choice-badge">Rapide & Éphémère</span>
                        </div>
                        <p className="chat-choice-desc">Les messages s'effacent automatiquement 24h après leur émission.</p>
                      </div>
                      <div className="chat-choice-radio">
                        {ephemeralDuration === '24h' && <span className="chat-radio-checked-dot" />}
                      </div>
                    </div>

                    {/* Option 2 : 7 jours */}
                    <div
                      className={`chat-ephemeral-choice-card ${ephemeralDuration === '7d' ? 'selected' : ''}`}
                      onClick={() => handleSetEphemeral('7d')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chat-choice-content">
                        <div className="chat-choice-title">
                          <strong>7 jours</strong>
                          <span className="chat-choice-badge recommend">Recommandé Études</span>
                        </div>
                        <p className="chat-choice-desc">Idéal pour le travail hebdomadaire, les devoirs et exercices de la semaine.</p>
                      </div>
                      <div className="chat-choice-radio">
                        {ephemeralDuration === '7d' && <span className="chat-radio-checked-dot" />}
                      </div>
                    </div>

                    {/* Option 3 : 90 jours */}
                    <div
                      className={`chat-ephemeral-choice-card ${ephemeralDuration === '90d' ? 'selected' : ''}`}
                      onClick={() => handleSetEphemeral('90d')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chat-choice-content">
                        <div className="chat-choice-title">
                          <strong>90 jours</strong>
                          <span className="chat-choice-badge">Semestre complet</span>
                        </div>
                        <p className="chat-choice-desc">Conserve les échanges et les fichiers pendant toute la durée d'un trimestre.</p>
                      </div>
                      <div className="chat-choice-radio">
                        {ephemeralDuration === '90d' && <span className="chat-radio-checked-dot" />}
                      </div>
                    </div>

                    {/* Option 4 : Désactivé (Non) */}
                    <div
                      className={`chat-ephemeral-choice-card ${ephemeralDuration === 'off' ? 'selected' : ''}`}
                      onClick={() => handleSetEphemeral('off')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chat-choice-content">
                        <div className="chat-choice-title">
                          <strong>Désactivé (Non)</strong>
                        </div>
                        <p className="chat-choice-desc">Les messages restent indéfiniment disponibles dans cette discussion.</p>
                      </div>
                      <div className="chat-choice-radio">
                        {ephemeralDuration === 'off' && <span className="chat-radio-checked-dot" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chat-contact-modal-footer">
                  <button
                    type="button"
                    className="chat-ephemeral-apply-btn"
                    onClick={() => setContactModalView('main')}
                  >
                    Valider & Revenir aux infos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Lightbox / Aperçu d'image en grand format */}
      {previewImage && (
        <div className="chat-lightbox-overlay" onClick={() => setPreviewImage(null)}>
          <div className="chat-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="chat-lightbox-close-btn"
              onClick={() => setPreviewImage(null)}
              aria-label="Fermer la prévisualisation"
            >
              ✕
            </button>
            <div className="chat-lightbox-img-wrap">
              <Image
                src={previewImage}
                alt="Aperçu du média"
                width={800}
                height={600}
                className="chat-lightbox-img"
              />
            </div>
            <div className="chat-lightbox-footer">
              <span>Ressource pédagogique partagée par {activeUser.name}</span>
              <button
                type="button"
                className="chat-lightbox-action-btn"
                onClick={() => {
                  showChatToast('Image enregistrée dans vos téléchargements');
                  setPreviewImage(null);
                }}
              >
                📥 Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
