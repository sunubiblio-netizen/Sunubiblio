'use client';

import React from 'react';
import Link from 'next/link';
import { AIMode } from '@/types/ai';

interface IASidebarDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectToolMode?: (mode: AIMode) => void;
}

export const IASidebarDrawer: React.FC<IASidebarDrawerProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  onSelectToolMode,
}) => {
  const tools = [
    { id: 'resumer', mode: 'resumer' as AIMode, label: 'Résumer un document', icon: '📋' },
    { id: 'expliquer', mode: 'expliquer' as AIMode, label: 'Expliquer un cours', icon: '💡' },
    { id: 'qcm', mode: 'qcm' as AIMode, label: 'Générateur de QCM', icon: '📝' },
    { id: 'exercices', mode: 'exercices' as AIMode, label: 'Créer des exercices', icon: '🎯' },
    { id: 'corriger', mode: 'corriger' as AIMode, label: 'Corriger un devoir', icon: '✍️' },
    { id: 'antiplagiat', mode: 'antiplagiat' as AIMode, label: 'Vérification Antiplagiat', icon: '🔎' },
  ];

  const recentChats = [
    { id: 'chat-1', title: 'Synthèse Algèbre & Fonctions', date: 'Aujourd’hui' },
    { id: 'chat-2', title: 'QCM Histoire-Géographie Bac', date: 'Hier' },
    { id: 'chat-3', title: 'Explication Physique — Électrostatique', date: 'Il y a 3 jours' },
    { id: 'chat-4', title: 'Correction Dissertation Philosophie', date: 'Cette semaine' },
  ];

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
            <span>Nouvelle discussion</span>
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

          {/* Section 2 : Discussions & Révisions récentes */}
          <div className="sidebar-section-block">
            <span className="sidebar-section-heading">Discussions Récentes</span>
            <div className="sidebar-recents-list">
              {recentChats.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={onNewChat}
                  className="sidebar-recent-item"
                  title={c.title}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="recent-title">{c.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pied de Sidebar */}
        <div className="sidebar-footer">
          <div className="sidebar-user-pill">
            <div className="user-avatar-dot">S</div>
            <div className="user-info">
              <span className="user-name">SunuIA Assistant</span>
              <span className="user-tier">Modèle Éducatif v2.4</span>
            </div>
          </div>
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
          background: #ffffff;
          border-right: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 2px 0 16px rgba(15, 23, 42, 0.04);
          z-index: 999;
          display: flex;
          flex-direction: column;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
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
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-section-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-section-heading {
          font-size: 10.5px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0 6px 4px 6px;
        }

        .sidebar-tools-list,
        .sidebar-recents-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sidebar-tool-link-btn,
        .sidebar-recent-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
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

        .sidebar-tool-link-btn:hover,
        .sidebar-recent-item:hover {
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

        .recent-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid rgba(241, 245, 249, 0.95);
          background: #fbfcfe;
        }

        .sidebar-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          border-radius: 10px;
        }

        .user-avatar-dot {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .user-tier {
          font-size: 10px;
          color: #64748b;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

