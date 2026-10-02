'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChatUser, ChatMessage } from '@/types/chat';

interface ChatConversationProps {
  activeUser: ChatUser;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendVoiceNote: () => void;
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);

  // Nouvelles fonctionnalités WhatsApp
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [chatToast, setChatToast] = useState<string | null>(null);

  // État flottant dynamique et détection du clavier mobile
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showChatToast = (msg: string) => {
    setChatToast(msg);
    setTimeout(() => setChatToast(null), 2800);
  };

  // Synchronisation dynamique en temps réel avec le clavier virtuel et barres d'outils mobiles (Tecno, Samsung, Xiaomi, iPhone)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleViewportChange = () => {
      if (window.innerWidth > 768) {
        setKeyboardOffset(0);
        return;
      }

      if (window.visualViewport) {
        const vv = window.visualViewport;
        const totalHeight = window.innerHeight;
        const offsetBottom = totalHeight - (vv.height + (vv.offsetTop || 0));
        // Si le clavier ou la barre d'outils basse réduit la zone visible
        if (offsetBottom > 15) {
          setKeyboardOffset(Math.round(offsetBottom));
        } else {
          setKeyboardOffset(0);
        }
      }
    };

    handleViewportChange();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  // Auto-scroll au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    // Verrouiller la position et empêcher tout saut de page intempestif
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.visualViewport && window.innerWidth <= 768) {
        const vv = window.visualViewport;
        const totalHeight = window.innerHeight;
        const offsetBottom = totalHeight - (vv.height + (vv.offsetTop || 0));
        if (offsetBottom > 15) {
          setKeyboardOffset(Math.round(offsetBottom));
        }
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }, 120);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const vv = window.visualViewport;
        const totalHeight = window.innerHeight;
        const offsetBottom = totalHeight - (vv.height + (vv.offsetTop || 0));
        if (offsetBottom <= 15) {
          setKeyboardOffset(0);
        }
      }
    }, 150);
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
              {isEphemeral ? '⏱️ Messages éphémères' : activeUser.isOnline ? 'En ligne' : activeUser.lastSeen || 'Hors ligne'}
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
                      setIsEphemeral(!isEphemeral);
                      showChatToast(!isEphemeral ? 'Messages éphémères activés' : 'Messages éphémères désactivés');
                    }}
                  >
                    <span>Messages éphémères</span>
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
      <div
        className="chat-messages-container"
        style={{
          paddingBottom: keyboardOffset > 0 ? `${keyboardOffset + 75}px` : undefined,
        }}
      >
        {/* Séparateur de date */}
        <div className="chat-date-separator">
          <span>Aujourd'hui</span>
        </div>

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

              {/* Message Note vocale avec Waveform interactif */}
              {msg.type === 'audio' && (
                <div className={`chat-bubble audio-bubble ${isMine ? 'mine' : 'other'}`}>
                  <div className="chat-audio-player">
                    <button
                      type="button"
                      className="chat-audio-play-btn"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      aria-label={isPlayingAudio ? 'Mettre en pause' : 'Écouter la note vocale'}
                    >
                      {isPlayingAudio ? (
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

                    {/* Fausse onde sonore animée (waveform) */}
                    <div className="chat-waveform-bars">
                      {[40, 65, 80, 50, 95, 70, 45, 85, 60, 40, 75, 90, 55, 35, 70, 50, 60, 40, 30].map(
                        (h, idx) => (
                          <span
                            key={idx}
                            className={`waveform-bar ${idx < 10 ? 'played' : ''} ${isPlayingAudio ? 'animating' : ''}`}
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>

                    <span className="chat-audio-duration">
                      {msg.attachment?.duration || '0:45'}
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

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Barre de saisie en bas — Disposition exacte WhatsApp */}
      <div
        className={`chat-input-bar-wrap ${isInputFocused ? 'is-focused-floating' : ''}`}
        style={{
          bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : undefined,
        }}
      >
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
                  onSendVoiceNote();
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

        {/* Ligne de saisie WhatsApp : Capsule (Emoji + Message + Pièce jointe + Caméra) + Bouton action rond (Micro / Envoyer) */}
        <form className="chat-wa-input-row" onSubmit={handleSend}>
          <div className="chat-wa-input-pill">
            <button
              type="button"
              className="chat-wa-pill-btn chat-wa-emoji-btn"
              title="Émojis"
              aria-label="Ajouter un émoji"
              onClick={() => setInputText((prev) => prev + ' 😊 ')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
              </svg>
            </button>

            <input
              ref={inputRef}
              type="text"
              size={1}
              className="chat-wa-text-input"
              placeholder="Message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
              autoCorrect="on"
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

          {/* Bouton d'action circulaire WhatsApp : Micro si vide, Envoi si texte */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="chat-wa-action-btn chat-send-active"
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
              className="chat-wa-action-btn chat-mic-active"
              onClick={onSendVoiceNote}
              title="Message vocal"
              aria-label="Enregistrer un message vocal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* 4. Modal "Afficher le contact" façon WhatsApp */}
      {isContactModalOpen && (
        <div className="chat-contact-modal-overlay" onClick={() => setIsContactModalOpen(false)}>
          <div className="chat-contact-modal-sheet" onClick={(e) => e.stopPropagation()}>
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
            </div>

            <div className="chat-contact-profile-hero">
              <div className="chat-contact-avatar-large">
                <Image
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  width={96}
                  height={96}
                  className="chat-contact-avatar-img"
                />
                <span className={`chat-contact-status-dot ${activeUser.isOnline ? 'online' : 'offline'}`} />
              </div>
              <h2 className="chat-contact-name-title">{activeUser.name}</h2>
              <p className="chat-contact-phone-number">+221 77 458 92 10</p>
              <span className="chat-contact-presence-badge">
                {activeUser.isOnline ? 'En ligne' : `Vu à ${activeUser.lastSeen}`}
              </span>
            </div>

            <div className="chat-contact-quick-actions">
              <button
                type="button"
                className="chat-contact-act-btn"
                onClick={() => {
                  setIsContactModalOpen(false);
                  onStartCall('vocal');
                }}
              >
                <div className="chat-act-icon-wrap">
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
                <div className="chat-act-icon-wrap">
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
                <div className="chat-act-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <span>Rechercher</span>
              </button>
            </div>

            <div className="chat-contact-info-section">
              <div className="chat-contact-info-block">
                <span className="chat-info-label">Statut & Biographie</span>
                <p className="chat-info-val">Étudiant passionné • Sunubiblio Club Math & Physique 📚🚀</p>
              </div>

              <div className="chat-contact-info-block">
                <span className="chat-info-label">Médias, liens et documents</span>
                <div className="chat-contact-media-preview-row">
                  <div className="chat-media-preview-tile">📄 4 PDFs</div>
                  <div className="chat-media-preview-tile">🖼️ 12 Photos</div>
                  <div className="chat-media-preview-tile">🔗 3 Liens</div>
                </div>
              </div>

              <div className="chat-contact-info-block toggles">
                <div className="chat-contact-toggle-row">
                  <span>Mode silencieux</span>
                  <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={(e) => {
                      setIsMuted(e.target.checked);
                      showChatToast(e.target.checked ? 'Discussion mise en sourdine' : 'Notifications activées');
                    }}
                  />
                </div>
                <div className="chat-contact-toggle-row">
                  <span>Messages éphémères</span>
                  <input
                    type="checkbox"
                    checked={isEphemeral}
                    onChange={(e) => {
                      setIsEphemeral(e.target.checked);
                      showChatToast(e.target.checked ? 'Messages éphémères activés (24h)' : 'Messages éphémères désactivés');
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="chat-contact-modal-done-btn"
              onClick={() => setIsContactModalOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
