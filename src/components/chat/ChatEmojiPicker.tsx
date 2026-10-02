'use client';

import React, { useState, useMemo } from 'react';

export interface ChatEmojiPickerProps {
  isOpen: boolean;
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'people',
    name: 'Emojis et personnes',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '🥲', '☺️', '😊',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
      '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏',
      '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺',
      '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
      '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫', '🫠',
      '🤥', '😶', '😐', '😑', '😬', '🫨', '😯', '😦', '😧', '😮', '😲', '🥱',
      '😴', '🤤', '😪', '😵', '😵‍💫', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧', '😷',
      '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀',
      '👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏',
      '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️',
      '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝',
      '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
      '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦', '👶', '🧒',
      '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🧑‍🎓', '👨‍🎓',
      '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔬', '👨‍🔬', '👩‍🔬',
    ],
  },
  {
    id: 'nature',
    name: 'Animaux et nature',
    icon: '🐶',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁',
      '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦',
      '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝',
      '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷️',
      '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡',
      '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧',
      '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄',
      '🌲', '🌳', '🌴', '🪵', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🍃', '🍂',
      '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞',
    ],
  },
  {
    id: 'food',
    name: 'Nourriture et boissons',
    icon: '☕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
      '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️',
      '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖',
      '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴',
      '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗',
      '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤',
      '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧',
      '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
      '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻',
    ],
  },
  {
    id: 'activity',
    name: 'Activités et sports',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓',
      '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
      '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂',
      '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽',
      '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️',
      '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹',
    ],
  },
  {
    id: 'travel',
    name: 'Voyages et lieux',
    icon: '🚗',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚',
      '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🚏', '🛣️', '🛤️', '🛢️', '⛽',
      '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '🛟', '⛵', '🛶', '🚤', '🛳️', '⛴️',
      '🚢', '✈️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀',
      '🛸', '🪐', '🌠', '🌌', '🌍', '🌎', '🌏', '🗺️', '🗾', '🧭', '🏔️', '⛰️',
      '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏠',
      '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭',
      '🏯', '🏰', '💒', '🗼', '🗽', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺',
    ],
  },
  {
    id: 'objects',
    name: 'Objets et technologie',
    icon: '💡',
    emojis: [
      '💡', '🔦', '🏮', '🪔', '🕯️', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋',
      '🪫', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀',
      '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '📟', '📠', '📺', '📻', '🎙️',
      '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌',
      '📖', '📕', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰',
      '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾',
      '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮',
      '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️',
    ],
  },
  {
    id: 'symbols',
    name: 'Symboles',
    icon: '🔣',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️',
      '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊',
      '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑',
      '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '♨️', '💯',
      '✨', '⭐', '🌟', '💫', '⚡', '☄️', '💥', '🔥', '☀️', '⛅', '☁️', '🌧️',
      '✅', '❌', '❓', '❗', '❕', '❔', '‼️', '⁉️', '⚠️', '🚸', '⛔', '🚫',
    ],
  },
  {
    id: 'flags',
    name: 'Drapeaux',
    icon: '🚩',
    emojis: [
      '🚩', '🏁', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇸🇳', '🇫🇷', '🇲🇱', '🇨🇮',
      '🇬🇳', '🇲🇷', '🇧🇯', '🇹🇬', '🇳🇪', '🇧🇫', '🇬🇭', '🇳🇬', '🇨🇲', '🇬🇦', '🇨🇬', '🇨🇩',
      '🇲🇦', '🇩🇿', '🇹🇳', '🇪🇬', '🇿🇦', '🇰🇪', '🇪🇸', '🇮🇹', '🇩🇪', '🇬🇧', '🇺🇸', '🇨🇦',
      '🇧🇷', '🇨🇳', '🇯🇵', '🇰🇷', '🇮🇳', '🇸🇦', '🇦🇪', '🇹🇷', '🇵🇸', '🇺🇳', '🇪🇺', '🌐',
    ],
  },
];

const DEFAULT_RECENTS = ['😊', '📚', '🚀', '✨', '👍', '❤️', '💡', '🙏', '🎓', '📝', '🔥', '👏'];

export const ChatEmojiPicker: React.FC<ChatEmojiPickerProps> = ({
  isOpen,
  onSelectEmoji,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [recents, setRecents] = useState<string[]>(DEFAULT_RECENTS);
  const [bottomMode, setBottomMode] = useState<'emoji' | 'gif' | 'stickers'>('emoji');

  const handlePick = (emoji: string) => {
    onSelectEmoji(emoji);
    setRecents((prev) => {
      const filtered = prev.filter((e) => e !== emoji);
      return [emoji, ...filtered].slice(0, 24);
    });
  };

  // Filtrage par recherche
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return EMOJI_CATEGORIES;
    }
    const q = searchQuery.toLowerCase();
    return EMOJI_CATEGORIES.map((cat) => ({
      ...cat,
      emojis: cat.emojis.filter((e) => e.includes(q) || cat.name.toLowerCase().includes(q)),
    })).filter((cat) => cat.emojis.length > 0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="chat-wa-emoji-picker-container"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Sélecteur d'émojis WhatsApp"
    >
      {/* 1. Barre supérieure des onglets de catégories avec souligné vert */}
      <div className="chat-wa-emoji-category-tabs">
        <button
          type="button"
          className={`chat-wa-cat-tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('recent');
            const el = document.getElementById('emoji-section-recent');
            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }}
          title="Récents"
          aria-label="Récents"
        >
          <span className="chat-wa-cat-icon">🕒</span>
          {activeTab === 'recent' && <span className="chat-wa-cat-active-line" />}
        </button>

        {EMOJI_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`chat-wa-cat-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(cat.id);
                const el = document.getElementById(`emoji-section-${cat.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              title={cat.name}
              aria-label={cat.name}
            >
              <span className="chat-wa-cat-icon">{cat.icon}</span>
              {isActive && <span className="chat-wa-cat-active-line" />}
            </button>
          );
        })}
      </div>

      {/* 2. Barre de recherche WhatsApp stylisée */}
      <div className="chat-wa-emoji-search-row">
        <div className="chat-wa-emoji-search-input-wrap">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.3"
            className="chat-wa-search-svg"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un emoji"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-wa-emoji-search-input"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="chat-wa-search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Zone de défilement des émojis classés */}
      <div className="chat-wa-emoji-scroll-grid">
        {/* Section Récent (si pas de recherche active) */}
        {!searchQuery.trim() && recents.length > 0 && (
          <div id="emoji-section-recent" className="chat-wa-emoji-section">
            <h4 className="chat-wa-emoji-section-title">Récent</h4>
            <div className="chat-wa-emoji-row-grid">
              {recents.map((emoji, idx) => (
                <button
                  key={`rec-${idx}`}
                  type="button"
                  className="chat-wa-single-emoji-btn"
                  onClick={() => handlePick(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sections par catégorie */}
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            id={`emoji-section-${cat.id}`}
            className="chat-wa-emoji-section"
          >
            <h4 className="chat-wa-emoji-section-title">{cat.name}</h4>
            <div className="chat-wa-emoji-row-grid">
              {cat.emojis.map((emoji, idx) => (
                <button
                  key={`${cat.id}-${idx}`}
                  type="button"
                  className="chat-wa-single-emoji-btn"
                  onClick={() => handlePick(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="chat-wa-emoji-empty">
            <span>🔍 Aucun émoji trouvé pour &quot;{searchQuery}&quot;</span>
          </div>
        )}
      </div>

      {/* 4. Barre de sélection inférieure : [ 😀 Émojis ]  [ GIF ]  [ 🏷️ Stickers ] */}
      <div className="chat-wa-emoji-bottom-bar">
        <div className="chat-wa-emoji-mode-capsule">
          <button
            type="button"
            className={`chat-wa-mode-btn ${bottomMode === 'emoji' ? 'active' : ''}`}
            onClick={() => setBottomMode('emoji')}
            title="Émojis"
          >
            <span className="chat-wa-mode-icon">😀</span>
          </button>
          <button
            type="button"
            className={`chat-wa-mode-btn ${bottomMode === 'gif' ? 'active' : ''}`}
            onClick={() => setBottomMode('gif')}
            title="GIFs animés"
          >
            <span className="chat-wa-mode-text">GIF</span>
          </button>
          <button
            type="button"
            className={`chat-wa-mode-btn ${bottomMode === 'stickers' ? 'active' : ''}`}
            onClick={() => setBottomMode('stickers')}
            title="Stickers"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
              <path d="M15 3v6h6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
