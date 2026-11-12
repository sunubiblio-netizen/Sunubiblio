'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AIMode, AIMessage } from '@/types/ai';

export interface IAChatThread {
  id: string;
  title: string;
  messages: AIMessage[];
  isPinned?: boolean;
  isLocked?: boolean;
  date: string;
}

interface IASidebarDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectToolMode?: (mode: AIMode) => void;
  threads?: IAChatThread[];
  activeThreadId?: string | null;
  onSelectThread?: (threadId: string) => void;
  onRenameThread?: (threadId: string, newTitle: string) => void;
  onTogglePinThread?: (threadId: string) => void;
  onToggleLockThread?: (threadId: string) => void;
  onDeleteThread?: (threadId: string) => void;
  onArchiveThread?: (threadId: string) => void;
}

export const IASidebarDrawer: React.FC<IASidebarDrawerProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  onSelectToolMode,
  threads = [],
  activeThreadId,
  onSelectThread,
  onRenameThread,
  onTogglePinThread,
  onToggleLockThread,
  onDeleteThread,
  onArchiveThread,
}) => {
  const [menuOpenThreadId, setMenuOpenThreadId] = useState<string | null>(null);
  const [renamingThreadId, setRenamingThreadId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenThreadId(null);
      }
    };
    if (menuOpenThreadId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenThreadId]);

  const tools = [
    { id: 'resumer', mode: 'resumer' as AIMode, label: 'Résumer un document', icon: '📋' },
    { id: 'expliquer', mode: 'expliquer' as AIMode, label: 'Expliquer un cours', icon: '💡' },
    { id: 'qcm', mode: 'qcm' as AIMode, label: 'Générateur de QCM', icon: '📝' },
    { id: 'exercices', mode: 'exercices' as AIMode, label: 'Créer des exercices', icon: '🎯' },
    { id: 'corriger', mode: 'corriger' as AIMode, label: 'Corriger un devoir', icon: '✍️' },
    { id: 'antiplagiat', mode: 'antiplagiat' as AIMode, label: 'Vérification Antiplagiat', icon: '🔎' },
  ];

  const handleStartRename = (thread: IAChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingThreadId(thread.id);
    setRenameInput(thread.title);
    setMenuOpenThreadId(null);
  };

  const handleSaveRename = (threadId: string) => {
    if (renameInput.trim() && onRenameThread) {
      onRenameThread(threadId, renameInput.trim());
    }
    setRenamingThreadId(null);
  };

  const handleShare = (thread: IAChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/ia?chat=${thread.id}`);
      alert(`Lien de partage copié : "${thread.title}"`);
    }
    setMenuOpenThreadId(null);
  };

  // Sort threads: pinned ones first, then maintain original order
  const sortedThreads = [...threads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <>
      {/* Overlay mobile en arrière-plan */}
      {isOpen && (
        <div
          className="sidebar-backdrop mobile-only"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Panneau latéral rétractable */}
      <aside className={`ia-sidebar-drawer ${isOpen ? 'is-open' : 'is-closed'}`} aria-label="Menu de navigation SunuIA">
        {/* En-tête de la Sidebar avec Nouveau Chat & Bouton Fermer */}
        <div className="sidebar-header-row">
          <button
            type="button"
            onClick={onNewChat}
            className="sidebar-new-chat-btn"
            title="Démarrer une nouvelle discussion"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Nouveau chat</span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="sidebar-toggle-btn"
            title="Replier le menu latéral"
            aria-label="Fermer le menu latéral"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>

        {/* Corps défilable de la Sidebar */}
        <div className="sidebar-scrollable-body">
          {/* Section 1 : Outils spécialisés SunuIA */}
          <div className="sidebar-section-block">
            <span className="sidebar-section-heading">Outils Spécialisés</span>
            <div className="sidebar-tools-list">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    if (onSelectToolMode) onSelectToolMode(tool.mode);
                  }}
                  className="sidebar-tool-link-btn"
                >
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-text">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2 : Discussions Récentes avec actions ChatGPT */}
          <div className="sidebar-section-block">
            <span className="sidebar-section-heading">Récents</span>
            <div className="sidebar-recents-list">
              {sortedThreads.map((thread) => {
                const isActive = activeThreadId === thread.id;
                const isMenuOpen = menuOpenThreadId === thread.id;
                const isRenaming = renamingThreadId === thread.id;

                return (
                  <div
                    key={thread.id}
                    className={`sidebar-recent-item-wrap ${isActive ? 'is-active' : ''} ${isMenuOpen ? 'menu-active' : ''}`}
                  >
                    {isRenaming ? (
                      <div className="rename-inline-box" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(thread.id);
                            if (e.key === 'Escape') setRenamingThreadId(null);
                          }}
                          autoFocus
                          className="rename-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(thread.id)}
                          className="rename-btn-check"
                          title="Valider"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          if (onSelectThread) onSelectThread(thread.id);
                        }}
                        className="sidebar-recent-item-btn"
                        title={thread.title}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="recent-title">{thread.title}</span>

                        <div className="thread-badges-right">
                          {thread.isPinned && (
                            <span className="thread-pin-icon" title="Épinglé">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                              </svg>
                            </span>
                          )}

                          {thread.isLocked && (
                            <span className="thread-lock-icon" title="Chat verrouillé">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            </span>
                          )}

                          {/* Bouton d'options ... */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenThreadId(isMenuOpen ? null : thread.id);
                            }}
                            className="thread-options-trigger-btn"
                            title="Plus d'options"
                            aria-label="Options de la discussion"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="19" cy="12" r="2" />
                              <circle cx="5" cy="12" r="2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Menu contextuel déroulant style ChatGPT */}
                    {isMenuOpen && (
                      <div ref={menuRef} className="chat-actions-context-menu" role="menu">
                        <button
                          type="button"
                          className="context-menu-item"
                          onClick={(e) => handleStartRename(thread, e)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          <span>Renommer</span>
                        </button>

                        <button
                          type="button"
                          className="context-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onTogglePinThread) onTogglePinThread(thread.id);
                            setMenuOpenThreadId(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="17" x2="12" y2="22"></line>
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                          </svg>
                          <span>{thread.isPinned ? 'Désépingler' : 'Épingler'}</span>
                        </button>

                        <button
                          type="button"
                          className="context-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleLockThread) onToggleLockThread(thread.id);
                            setMenuOpenThreadId(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <span>{thread.isLocked ? 'Déverrouiller le chat' : 'Verrouiller le chat'}</span>
                        </button>

                        <div className="context-menu-divider" />

                        <button
                          type="button"
                          className="context-menu-item"
                          onClick={(e) => handleShare(thread, e)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          <span>Partager</span>
                        </button>

                        <div className="context-menu-divider" />

                        <button
                          type="button"
                          className="context-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onArchiveThread) onArchiveThread(thread.id);
                            setMenuOpenThreadId(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                            <rect x="1" y="3" width="22" height="5"></rect>
                            <line x1="10" y1="12" x2="14" y2="12"></line>
                          </svg>
                          <span>Archiver</span>
                        </button>

                        <button
                          type="button"
                          className="context-menu-item item-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteThread) onDeleteThread(thread.id);
                            setMenuOpenThreadId(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>Supprimer</span>
                        </button>

                        <div className="context-menu-divider" />

                        <button
                          type="button"
                          className="context-menu-item text-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenThreadId(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>Déplacer vers un projet ›</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied de Sidebar (Exactement comme Image 3 de ChatGPT : Avatar SB + Sunu Biblio Free + Profiter de l'offre) */}
        <div className="sidebar-footer">
          <div className="sidebar-user-pill">
            <div className="user-avatar-sb">SB</div>
            <div className="user-info">
              <span className="user-name">Sunu Biblio</span>
              <span className="user-tier">Free</span>
            </div>
          </div>

          <Link href="/tarifs" className="sidebar-offer-action-btn" title="Profiter de l'offre SunuIA">
            <span className="gift-symbol">🎁</span>
            <span>Profiter de l'offre</span>
          </Link>
        </div>
      </aside>

      <style jsx>{`
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          z-index: 998;
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar-backdrop.mobile-only {
            display: block;
          }
        }

        .ia-sidebar-drawer {
          position: fixed;
          top: 72px; /* Sous la navbar */
          bottom: 0;
          left: 0;
          width: 270px;
          height: calc(100vh - 72px);
          max-height: calc(100vh - 72px);
          background: #ffffff;
          border-right: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 2px 0 16px rgba(15, 23, 42, 0.04);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
        }

        @media (max-width: 768px) {
          .ia-sidebar-drawer {
            top: calc(86px + env(safe-area-inset-top, 0px));
            height: calc(100vh - 86px - env(safe-area-inset-top, 0px));
            max-height: calc(100vh - 86px - env(safe-area-inset-top, 0px));
            width: min(300px, 86vw);
            box-shadow: 4px 0 24px rgba(15, 23, 42, 0.12);
          }
        }

        .ia-sidebar-drawer.is-closed {
          transform: translateX(-100%);
          pointer-events: none;
        }

        .ia-sidebar-drawer.is-open {
          transform: translateX(0);
          pointer-events: auto;
        }

        .sidebar-header-row {
          padding: 14px 14px 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        }

        .sidebar-new-chat-btn {
          flex: 1;
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .sidebar-new-chat-btn:hover {
          background: #ffffff;
          border-color: #f59e0b;
          color: #b45309;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
        }

        .sidebar-toggle-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .sidebar-toggle-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .sidebar-scrollable-body {
          flex: 1 1 0%;
          min-height: 0;
          overflow-y: auto;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sidebar-section-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-section-heading {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0 8px 4px 8px;
        }

        .sidebar-tools-list,
        .sidebar-recents-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-tool-link-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #334155;
          font-size: 12.5px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }

        .sidebar-tool-link-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .tool-icon {
          font-size: 15px;
          flex-shrink: 0;
        }

        .tool-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* -------------------------------------------------------------
           RECENT THREAD ITEM & HOVER ACTIONS (ChatGPT style)
        ------------------------------------------------------------- */
        .sidebar-recent-item-wrap {
          position: relative;
          width: 100%;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .sidebar-recent-item-wrap:hover,
        .sidebar-recent-item-wrap.menu-active {
          background: #f1f5f9;
        }

        .sidebar-recent-item-wrap.is-active {
          background: #fffbeb;
        }

        .sidebar-recent-item-wrap.is-active .recent-title {
          font-weight: 700;
          color: #b45309;
        }

        .sidebar-recent-item-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #1e293b;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          width: 100%;
          gap: 6px;
        }

        .recent-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .thread-badges-right {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .thread-pin-icon {
          color: #f59e0b;
          display: inline-flex;
          align-items: center;
        }

        .thread-lock-icon {
          color: #64748b;
          display: inline-flex;
          align-items: center;
        }

        .thread-options-trigger-btn {
          width: 22px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0;
          transition: all 0.15s ease;
        }

        .sidebar-recent-item-wrap:hover .thread-options-trigger-btn,
        .sidebar-recent-item-wrap.is-active .thread-options-trigger-btn,
        .sidebar-recent-item-wrap.menu-active .thread-options-trigger-btn {
          opacity: 1;
        }

        .thread-options-trigger-btn:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #0f172a;
        }

        /* Inline Rename Input */
        .rename-inline-box {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
          width: 100%;
        }

        .rename-input {
          flex: 1;
          height: 28px;
          padding: 0 8px;
          font-size: 12.5px;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          outline: none;
          background: #ffffff;
        }

        .rename-btn-check {
          width: 26px;
          height: 26px;
          border: none;
          background: #f59e0b;
          color: #ffffff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
        }

        /* Context Menu Dropdown */
        .chat-actions-context-menu {
          position: absolute;
          top: 100%;
          left: 12px;
          width: 210px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
          border-radius: 12px;
          padding: 5px;
          z-index: 1010;
          animation: contextMenuPop 0.15s ease-out;
        }

        .context-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          border-radius: 7px;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s ease;
        }

        .context-menu-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .context-menu-item.item-danger {
          color: #ef4444;
        }

        .context-menu-item.item-danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .context-menu-item.text-muted {
          color: #94a3b8;
          font-size: 12px;
        }

        .context-menu-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 4px 6px;
        }

        @keyframes contextMenuPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* -------------------------------------------------------------
           FOOTER (Avatar SB + Sunu Biblio Free + Profiter de l'offre - Style ChatGPT)
        ------------------------------------------------------------- */
        .sidebar-footer {
          flex-shrink: 0;
          padding: 12px 14px calc(14px + env(safe-area-inset-bottom, 0px)) 14px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
        }

        .sidebar-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 2px;
        }

        .user-avatar-sb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #334155;
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .user-tier {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        /* Bouton "Profiter de l'offre" stylisé exactement comme "Offre gratuite" avec taille réduite */
        :global(.sidebar-offer-action-btn),
        .sidebar-offer-action-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          width: 100% !important;
          height: 34px !important;
          padding: 6px 14px !important;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 9999px !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          color: #475569 !important;
          text-decoration: none !important;
          cursor: pointer !important;
          user-select: none !important;
          transition: all 0.18s ease !important;
          box-sizing: border-box !important;
        }

        :global(.sidebar-offer-action-btn:hover),
        .sidebar-offer-action-btn:hover {
          background: #fffbeb !important;
          border-color: #f59e0b !important;
          color: #b45309 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.14) !important;
        }

        :global(.sidebar-offer-action-btn:hover .gift-symbol),
        .sidebar-offer-action-btn:hover .gift-symbol {
          transform: scale(1.12) rotate(-4deg) !important;
        }

        :global(.gift-symbol),
        .gift-symbol {
          font-size: 13px !important;
          line-height: 1 !important;
          transition: transform 0.2s ease !important;
        }
      `}</style>
    </>
  );
};