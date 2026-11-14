'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AIAttachmentMenuProps {
  onSelectDocument: () => void;
  onSelectImage: () => void;
  onOpenLibraryPicker: () => void;
  onOpenPasteText: () => void;
  onSelectFile: () => void;
  isWebSearch?: boolean;
  onToggleWebSearch?: () => void;
}

export const AIAttachmentMenu: React.FC<AIAttachmentMenuProps> = ({
  onSelectDocument,
  onSelectImage,
  onOpenLibraryPicker,
  onOpenPasteText,
  onSelectFile,
  isWebSearch = false,
  onToggleWebSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleAction = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <div className="attachment-menu-root" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-plus-trigger ${isOpen ? 'active' : ''} ${isWebSearch ? 'has-web-active' : ''}`}
        aria-label="Ajouter un document, une image ou activer la recherche Web"
        aria-expanded={isOpen}
        title="Ajouter du contenu ou recherche web (+)"
      >
        <svg 
          width="19" 
          height="19" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="plus-icon"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

        {isWebSearch && <span className="web-active-indicator" title="Recherche web activée" />}
      </button>

      {isOpen && (
        <div className="menu-dropdown-popover" role="menu">
          <div className="menu-header">
            <span>Recherche & Ressources IA</span>
          </div>

          {/* Option Recherche Web intégrée dans le menu + */}
          {onToggleWebSearch && (
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={isWebSearch}
              className={`menu-item menu-web-item ${isWebSearch ? 'active' : ''}`}
              onClick={() => {
                onToggleWebSearch();
              }}
            >
              <div className={`item-icon web ${isWebSearch ? 'active' : ''}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div className="item-text">
                <div className="item-title-row">
                  <span className="item-title">Recherche Web</span>
                  <span className={`web-badge ${isWebSearch ? 'on' : 'off'}`}>
                    {isWebSearch ? 'Activé' : 'Désactivé'}
                  </span>
                </div>
                <span className="item-desc">Actualités et données internet en direct</span>
              </div>
              <div className={`toggle-pill ${isWebSearch ? 'checked' : ''}`}>
                <div className="toggle-dot" />
              </div>
            </button>
          )}

          <div className="menu-divider" />

          <button
            type="button"
            role="menuitem"
            className="menu-item"
            onClick={() => handleAction(onSelectDocument)}
          >
            <div className="item-icon doc">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="item-text">
              <span className="item-title">Ajouter un document</span>
              <span className="item-desc">PDF, Word (.docx) ou texte</span>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            className="menu-item"
            onClick={() => handleAction(onSelectImage)}
          >
            <div className="item-icon img">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className="item-text">
              <span className="item-title">Ajouter une image</span>
              <span className="item-desc">Photo, capture d&apos;exercice, schéma</span>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            className="menu-item highlight-item"
            onClick={() => handleAction(onOpenLibraryPicker)}
          >
            <div className="item-icon lib">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="item-text">
              <span className="item-title">Choisir dans la bibliothèque</span>
              <span className="item-desc">Livre, cours, annale BAAT</span>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            className="menu-item"
            onClick={() => handleAction(onOpenPasteText)}
          >
            <div className="item-icon txt">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </div>
            <div className="item-text">
              <span className="item-title">Coller du texte</span>
              <span className="item-desc">Insérer des notes ou extrait de cours</span>
            </div>
          </button>

          <button
            type="button"
            role="menuitem"
            className="menu-item"
            onClick={() => handleAction(onSelectFile)}
          >
            <div className="item-icon file">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </div>
            <div className="item-text">
              <span className="item-title">Ajouter un fichier</span>
              <span className="item-desc">Tous formats autorisés (max 15 Mo)</span>
            </div>
          </button>
        </div>
      )}

      <style jsx>{`
        .attachment-menu-root {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .btn-plus-trigger {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          flex-shrink: 0;
        }

        .btn-plus-trigger:hover,
        .btn-plus-trigger.active {
          background: #fffbeb;
          color: #b45309;
          border-color: #f59e0b;
          transform: scale(1.04);
        }

        .btn-plus-trigger.has-web-active {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #a5b4fc;
        }

        .web-active-indicator {
          position: absolute;
          top: 1px;
          right: 1px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4f46e5;
          border: 2px solid #ffffff;
        }

        .plus-icon {
          transition: transform 0.2s ease;
        }

        .btn-plus-trigger.active .plus-icon {
          transform: rotate(45deg);
        }

        .menu-dropdown-popover {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 0;
          width: 304px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.03);
          padding: 8px;
          z-index: 1000;
          animation: popoverFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-header {
          padding: 8px 12px 6px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .menu-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 6px 4px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .menu-item:hover {
          background: #fffbeb;
        }

        .menu-web-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          margin-bottom: 2px;
        }

        .menu-web-item.active {
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .menu-web-item:hover {
          background: #f1f5f9;
        }

        .menu-web-item.active:hover {
          background: #e0e7ff;
        }

        .item-icon.web {
          background: #e2e8f0;
          color: #64748b;
        }

        .item-icon.web.active {
          background: #4f46e5;
          color: #ffffff;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .web-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .web-badge.on {
          background: #4f46e5;
          color: #ffffff;
        }

        .web-badge.off {
          background: #e2e8f0;
          color: #64748b;
        }

        .toggle-pill {
          width: 34px;
          height: 20px;
          border-radius: 9999px;
          background: #cbd5e1;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: background-color 0.2s ease;
          flex-shrink: 0;
          margin-left: auto;
        }

        .toggle-pill.checked {
          background: #4f46e5;
        }

        .toggle-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }

        .toggle-pill.checked .toggle-dot {
          transform: translateX(14px);
        }

        .menu-item.highlight-item {
          background: rgba(245, 158, 11, 0.06);
        }

        .menu-item.highlight-item:hover {
          background: rgba(245, 158, 11, 0.14);
        }

        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-icon.doc {
          background: #fffbeb;
          color: #d97706;
        }

        .item-icon.img {
          background: #fef2f2;
          color: #e11d48;
        }

        .item-icon.lib {
          background: #fffbeb;
          color: #b45309;
        }

        .item-icon.txt {
          background: #f8fafc;
          color: #0f172a;
        }

        .item-icon.file {
          background: #f1f5f9;
          color: #475569;
        }

        .item-text {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }

        .item-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.2;
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
