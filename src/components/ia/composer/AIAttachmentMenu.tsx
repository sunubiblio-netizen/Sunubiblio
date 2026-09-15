'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AIAttachmentMenuProps {
  onSelectDocument: () => void;
  onSelectImage: () => void;
  onOpenLibraryPicker: () => void;
  onOpenPasteText: () => void;
  onSelectFile: () => void;
}

export const AIAttachmentMenu: React.FC<AIAttachmentMenuProps> = ({
  onSelectDocument,
  onSelectImage,
  onOpenLibraryPicker,
  onOpenPasteText,
  onSelectFile,
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
        className={`btn-plus-trigger ${isOpen ? 'active' : ''}`}
        aria-label="Ajouter un document, une image ou une ressource"
        aria-expanded={isOpen}
        title="Ajouter du contenu (+)"
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
      </button>

      {isOpen && (
        <div className="menu-dropdown-popover" role="menu">
          <div className="menu-header">
            <span>Ajouter au contexte IA</span>
          </div>

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
              <span className="item-desc">Photo, capture d'exercice, schéma</span>
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
              <span className="item-desc">Livre, cours, annale Sunubiblio</span>
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
          background: #eef2ff;
          color: #4f46e5;
          border-color: #6366f1;
          transform: scale(1.04);
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
          width: 290px;
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
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
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
          background: #f8faff;
        }

        .menu-item.highlight-item {
          background: rgba(99, 102, 241, 0.04);
        }

        .menu-item.highlight-item:hover {
          background: rgba(99, 102, 241, 0.09);
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
          background: #eff6ff;
          color: #2563eb;
        }

        .item-icon.img {
          background: #fdf2f8;
          color: #ec4899;
        }

        .item-icon.lib {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .item-icon.txt {
          background: #faf5ff;
          color: #9333ea;
        }

        .item-icon.file {
          background: #f1f5f9;
          color: #475569;
        }

        .item-text {
          display: flex;
          flex-direction: column;
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
