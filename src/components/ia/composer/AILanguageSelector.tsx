'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  shortLabel: string;
}

export const WORLD_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', shortLabel: 'FR' },
  { code: 'en', name: 'Anglais', nativeName: 'English', flag: '🇬🇧', shortLabel: 'EN' },
  { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸', shortLabel: 'ES' },
  { code: 'pt', name: 'Portugais', nativeName: 'Português', flag: '🇵🇹', shortLabel: 'PT' },
  { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪', shortLabel: 'DE' },
  { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦', shortLabel: 'AR' },
  { code: 'zh', name: 'Chinois Mandarin', nativeName: '中文', flag: '🇨🇳', shortLabel: 'ZH' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', shortLabel: 'HI' },
  { code: 'ru', name: 'Russe', nativeName: 'Русский', flag: '🇷🇺', shortLabel: 'RU' },
  { code: 'ja', name: 'Japonais', nativeName: '日本語', flag: '🇯🇵', shortLabel: 'JA' },
  { code: 'it', name: 'Italien', nativeName: 'Italiano', flag: '🇮🇹', shortLabel: 'IT' },
  { code: 'tr', name: 'Turc', nativeName: 'Türkçe', flag: '🇹🇷', shortLabel: 'TR' },
  { code: 'ko', name: 'Coréen', nativeName: '한국어', flag: '🇰🇷', shortLabel: 'KO' },
  { code: 'nl', name: 'Néerlandais', nativeName: 'Nederlands', flag: '🇳🇱', shortLabel: 'NL' },
  { code: 'id', name: 'Indonésien', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', shortLabel: 'ID' },
  { code: 'pl', name: 'Polonais', nativeName: 'Polski', flag: '🇵🇱', shortLabel: 'PL' },
  { code: 'vi', name: 'Vietnamien', nativeName: 'Tiếng Việt', flag: '🇻🇳', shortLabel: 'VI' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🌍', shortLabel: 'SW' },
  { code: 'fa', name: 'Persan', nativeName: 'فارسی', flag: '🇮🇷', shortLabel: 'FA' },
  { code: 'sv', name: 'Suédois', nativeName: 'Svenska', flag: '🇸🇪', shortLabel: 'SV' }
];

interface AILanguageSelectorProps {
  currentLanguage: string;
  onSelectLanguage: (langCode: string) => void;
}

export const AILanguageSelector: React.FC<AILanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = WORLD_LANGUAGES.find((l) => l.code === currentLanguage) || WORLD_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    setIsOpen(false);
    setSearch('');
  };

  const filteredLanguages = WORLD_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="language-selector-root" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`language-btn-trigger ${isOpen ? 'active' : ''}`}
        aria-label={`Langue actuelle : ${activeLang.name}. Cliquez pour changer de langue.`}
        aria-expanded={isOpen}
        title="Changer la langue de réponse de l'IA"
      >
        <span className="lang-flag">{activeLang.flag}</span>
        <span className="lang-label">{activeLang.name}</span>
        <span className="lang-pill">{activeLang.shortLabel}</span>
        <svg 
          width="13" 
          height="13" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="chevron-icon"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="language-menu-popover">
          <div className="menu-header">
            <span>Langue de réponse de l'IA (20 langues)</span>
          </div>

          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Rechercher une langue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="lang-search-input"
              autoFocus
            />
          </div>

          <div className="languages-scroll-list">
            {filteredLanguages.map((option) => {
              const isSelected = option.code === currentLanguage;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleSelect(option.code)}
                  className={`lang-item ${isSelected ? 'selected' : ''}`}
                >
                  <span className="item-flag">{option.flag}</span>
                  <div className="item-info">
                    <span className="item-name">{option.name}</span>
                    <span className="item-native">{option.nativeName}</span>
                  </div>
                  <span className="item-code-tag">{option.shortLabel}</span>
                  {isSelected && (
                    <span className="check-mark">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .language-selector-root {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .language-btn-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 11px;
          background: rgba(241, 245, 249, 0.9);
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .language-btn-trigger:hover,
        .language-btn-trigger.active {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .lang-flag {
          font-size: 14px;
          line-height: 1;
        }

        .lang-label {
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lang-pill {
          font-size: 10px;
          font-weight: 800;
          background: #e2e8f0;
          color: #475569;
          padding: 1px 5px;
          border-radius: 6px;
        }

        .chevron-icon {
          color: #64748b;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .language-btn-trigger.active .chevron-icon {
          transform: rotate(180deg);
        }

        .language-menu-popover {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 0;
          width: 290px;
          max-width: 90vw;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 45px -8px rgba(15, 23, 42, 0.16), 0 4px 14px rgba(0, 0, 0, 0.04);
          padding: 8px 6px;
          z-index: 1000;
          animation: popoverFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-header {
          padding: 8px 12px 6px 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          border-bottom: 1px solid #f1f5f9;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 6px 6px 4px 6px;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .lang-search-input {
          border: none;
          background: transparent;
          font-size: 12px;
          color: #0f172a;
          width: 100%;
          outline: none;
        }

        .languages-scroll-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .languages-scroll-list::-webkit-scrollbar {
          width: 5px;
        }

        .languages-scroll-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .lang-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background 0.15s ease;
        }

        .lang-item:hover {
          background: #f1f5f9;
        }

        .lang-item.selected {
          background: #eef2ff;
        }

        .item-flag {
          font-size: 16px;
          line-height: 1;
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .item-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .item-native {
          font-size: 10.5px;
          color: #64748b;
        }

        .item-code-tag {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          background: #e2e8f0;
          padding: 1px 6px;
          border-radius: 6px;
        }

        .check-mark {
          color: #4f46e5;
          display: flex;
          align-items: center;
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
