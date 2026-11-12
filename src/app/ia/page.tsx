'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { IAHeroCentered } from '@/components/ia/IAHeroCentered';
import { AIComposer } from '@/components/ia/composer/AIComposer';
import { AIConversationView } from '@/components/ia/conversation/AIConversationView';
import { IASidebarDrawer, IAChatThread } from '@/components/ia/IASidebarDrawer';
import { AIMessage, AIMode, AIAttachment } from '@/types/ai';
import { AIService } from '@/services/aiService';

export default function IAPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode>('assistant');
  const [composerKey, setComposerKey] = useState(0); // to reset or prefill composer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubscriber] = useState(false); // Mode d'abonnement (false = Offre gratuite, true = SunuIA Pro)

  // Liste des conversations enregistrées (Exactement comme Image 1 de ChatGPT)
  const [threads, setThreads] = useState<IAChatThread[]>([
    {
      id: 'chat-salutation-fr',
      title: 'Salutation en français',
      date: 'Aujourd’hui',
      isPinned: true,
      messages: [
        { id: 'm-1', role: 'user', content: 'bonjour', timestamp: '15:52' },
        { id: 'm-2', role: 'assistant', content: "Bonjour ! 😊 J'espère que vous allez bien.\n\nComment se passe votre journée ? Ravi de vous retrouver !", timestamp: '15:52' },
        { id: 'm-3', role: 'user', content: 'salut', timestamp: '15:53' },
        { id: 'm-4', role: 'assistant', content: "Salut ! 😁 Ravi de vous retrouver. Comment allez-vous aujourd'hui ? On travaille sur Hampathé ou vous avez un nouveau projet en tête ?", timestamp: '15:53' }
      ]
    },
    { id: 'chat-salutation-soir', title: 'Salutation du soir', date: 'Aujourd’hui', messages: [] },
    { id: 'chat-saas', title: 'Changer le nom SaaS', date: 'Hier', messages: [] },
    { id: 'chat-dashboard', title: 'Créer un tableau de bord intelligent', date: 'Il y a 3 jours', messages: [] },
    { id: 'chat-hampathe', title: 'Styliser Hampathé', date: 'Cette semaine', messages: [] },
    { id: 'chat-logo', title: 'Remplacement de nom logo', date: 'Cette semaine', messages: [] },
    { id: 'chat-reussite', title: 'Attestation de réussite', date: 'Cette semaine', messages: [] },
    { id: 'chat-pc-lent', title: 'Diagnostiquer PC Lent', date: 'Cette semaine', messages: [] },
    { id: 'chat-galerie', title: 'Galerie GPT6 interactive', date: 'Cette semaine', messages: [] },
    { id: 'chat-vert', title: 'Confirmer le design vert', date: 'Cette semaine', messages: [] },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const isConversationActive = messages.length > 0;

  // Handle message submission from Composer
  const handleSendMessage = async (payload: {
    content: string;
    mode: AIMode;
    attachments: AIAttachment[];
    isWebSearch: boolean;
  }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    const userMsg: AIMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: payload.content,
      timestamp,
      mode: payload.mode,
      attachments: payload.attachments,
      isWebSearch: payload.isWebSearch,
      status: 'complete',
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // 2. Gestion de l'historique dans la barre latérale (Image 1)
    let currentThreadId = activeThreadId;
    if (!currentThreadId) {
      // Nouvelle discussion : on génère un titre à partir du premier échange
      const rawText = payload.content.trim().replace(/\n+/g, ' ');
      const title = rawText.length > 28 ? rawText.slice(0, 28) + '...' : (rawText.charAt(0).toUpperCase() + rawText.slice(1));
      const newThreadId = 'chat-' + Date.now();
      currentThreadId = newThreadId;
      setActiveThreadId(newThreadId);

      const newThread: IAChatThread = {
        id: newThreadId,
        title: title || 'Nouvelle discussion',
        date: 'Aujourd’hui',
        messages: [userMsg]
      };
      setThreads((prev) => [newThread, ...prev]);
    } else {
      // Mise à jour du fil existant
      setThreads((prev) =>
        prev.map((t) => (t.id === currentThreadId ? { ...t, messages: [...t.messages, userMsg] } : t))
      );
    }

    try {
      // 3. Call AIService
      const aiResponse = await AIService.processRequest({
        content: payload.content,
        mode: payload.mode,
        attachments: payload.attachments,
        isWebSearch: payload.isWebSearch,
      });

      setMessages((prev) => [...prev, aiResponse]);
      setThreads((prev) =>
        prev.map((t) => (t.id === currentThreadId ? { ...t, messages: [...t.messages, aiResponse] } : t))
      );
    } catch {
      const errorMsg: AIMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: "Une erreur temporaire est survenue lors de la communication avec le service IA. Veuillez vérifier votre connexion et réessayer.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sélectionner un thread existant depuis la sidebar
  const handleSelectThread = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      setActiveThreadId(thread.id);
      setMessages(thread.messages || []);
      setIsSidebarOpen(false);
    }
  };

  // Renommer un thread
  const handleRenameThread = (threadId: string, newTitle: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, title: newTitle } : t))
    );
  };

  // Épingler / Désépingler un thread
  const handleTogglePinThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  // Verrouiller / Déverrouiller un thread
  const handleToggleLockThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, isLocked: !t.isLocked } : t))
    );
  };

  // Supprimer un thread
  const handleDeleteThread = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThreadId === threadId) {
      handleResetChat();
    }
  };

  // Archiver un thread
  const handleArchiveThread = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThreadId === threadId) {
      handleResetChat();
    }
  };

  // Reset conversation to initial state
  const handleResetChat = () => {
    setMessages([]);
    setActiveThreadId(null);
    setIsLoading(false);
    setActiveMode('assistant');
    setComposerKey((prev) => prev + 1);
    setIsSidebarOpen(false);
  };

  // Select tool from sidebar
  const handleSelectToolFromSidebar = (mode: AIMode) => {
    setActiveMode(mode);
    setIsSidebarOpen(false);
    const promptsMap: Record<string, string> = {
      resumer: 'Fais-moi un résumé clair et concis en extrayant les points clés de ce cours.',
      expliquer: 'Explique-moi ce concept pas à pas avec des exemples simples et concrets.',
      qcm: 'Génère 10 questions à choix multiples (QCM) avec correction détaillée pour m’évaluer.',
      exercices: 'Donne-moi 3 exercices d’entraînement progressifs conformes au programme.',
      corriger: 'Analyse et corrige ce devoir en m’indiquant les points forts et erreurs.',
      antiplagiat: 'Vérifie si ce texte présente des passages similaires au fonds documentaire.',
    };

    if (promptsMap[mode]) {
      handleSendMessage({
        content: promptsMap[mode],
        mode,
        attachments: [],
        isWebSearch: false,
      });
    }
  };

  // Retry last assistant message
  const handleRetryLast = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage({
        content: lastUserMsg.content,
        mode: lastUserMsg.mode || 'assistant',
        attachments: lastUserMsg.attachments || [],
        isWebSearch: !!lastUserMsg.isWebSearch,
      });
    }
  };

  return (
    <div className={`ia-page-wrapper ${isSidebarOpen ? 'has-sidebar-open' : ''} ${isConversationActive ? 'in-conversation' : ''}`}>
      <Navbar />

      {/* Menu Déroulant / Volet latéral rétractable comme ChatGPT */}
      <IASidebarDrawer
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onNewChat={handleResetChat}
        onSelectToolMode={handleSelectToolFromSidebar}
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onRenameThread={handleRenameThread}
        onTogglePinThread={handleTogglePinThread}
        onToggleLockThread={handleToggleLockThread}
        onDeleteThread={handleDeleteThread}
        onArchiveThread={handleArchiveThread}
      />

      {/* Topbar Permanente Fixe (Toujours intacte et visible au même endroit, comme ChatGPT) */}
      <header className="ia-top-toolbar-bar" aria-label="En-tête de session SunuIA">
        <div className="toolbar-left-group">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`sidebar-floating-toggle-btn ${isSidebarOpen ? 'active' : ''}`}
            title={isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu latéral'}
            aria-label="Ouvrir le menu latéral"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
            <span className="toggle-label desktop-only">Menu SunuIA</span>
          </button>
        </div>

        {/* Badge d'offre sobre sans chiffre visible (quota généreux automatique) */}
        <div className="toolbar-right-group">
          {isSubscriber ? (
            <div className="top-subscription-badge pro" title="Formule illimitée active">
              <span className="star-icon">★</span>
              <span>SunuIA Pro</span>
            </div>
          ) : (
            <div className="top-subscription-badge free" title="Formule gratuite active">
              <span className="gift-icon">🎁</span>
              <span>Offre gratuite</span>
            </div>
          )}
        </div>
      </header>

      <main className="ia-main-content">
        {/* En-tête de bienvenue (Masqué automatiquement dès que la discussion commence) */}
        {!isConversationActive && (
          <IAHeroCentered
            onNewChat={handleResetChat}
            isConversationActive={isConversationActive}
            onSelectOption={(mode) => handleSelectToolFromSidebar(mode)}
            isSubscriber={isSubscriber}
          />
        )}

        {!isConversationActive ? (
          /* Vue d'accueil IA épurée style ChatGPT : Composer positionné bas et centré */
          <div className="ia-home-workspace">
            <section className="composer-hero-section">
              <div className="container">
                <div className="composer-container-block">
                  <AIComposer
                    key={composerKey}
                    onSendMessage={handleSendMessage}
                    initialMode={activeMode}
                    placeholder="Demander à SunuIA..."
                  />
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Vue conversationnelle active 100% immersive comme ChatGPT */
          <div className="ia-active-chat-wrapper">
            <AIConversationView
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onResetChat={handleResetChat}
              onRetryLast={handleRetryLast}
            />
          </div>
        )}
      </main>

      <style jsx>{`
        .ia-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff !important;
          position: relative;
        }

        /* Fixe l'écran pendant la discussion : Seul le fil de conversation défile */
        .ia-page-wrapper.in-conversation {
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
        }

        .ia-page-wrapper.in-conversation .ia-main-content {
          height: calc(100vh - 120px);
          overflow: hidden;
          padding-bottom: 0;
        }

        @media (max-width: 768px) {
          .ia-page-wrapper.in-conversation .ia-main-content {
            height: calc(100vh - 134px);
          }
        }

        /* Topbar Permanente Fixe (Menu SunuIA à gauche, Offre à droite, toujours intacte) */
        .ia-top-toolbar-bar {
          position: sticky;
          top: 72px; /* Sous la navbar desktop */
          z-index: 95;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px;
          min-height: 48px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(241, 245, 249, 0.95);
        }

        .toolbar-left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toolbar-right-group {
          display: flex;
          align-items: center;
        }

        .top-subscription-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          user-select: none;
          transition: all 0.18s ease;
        }

        .top-subscription-badge.free {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .top-subscription-badge.free:hover {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
        }

        .top-subscription-badge.pro {
          background: #fffbeb;
          border: 1.5px solid #f59e0b;
          color: #b45309;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
        }

        .star-icon {
          color: #f59e0b;
          font-size: 13px;
        }

        .gift-icon {
          font-size: 13px;
        }

        .sidebar-floating-toggle-btn {
          height: 36px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 10px;
          color: #475569;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: all 0.18s ease;
        }

        .sidebar-floating-toggle-btn:hover,
        .sidebar-floating-toggle-btn.active {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
          box-shadow: 0 3px 10px rgba(245, 158, 11, 0.15);
        }

        .desktop-only {
          display: inline-block;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .ia-top-toolbar-bar {
            top: calc(86px + env(safe-area-inset-top, 0px));
            padding: 6px 14px;
            min-height: 46px;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          }
          .sidebar-floating-toggle-btn {
            height: 34px;
            width: 36px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .top-subscription-badge {
            padding: 5px 12px;
            font-size: 12px;
          }
        }

        .ia-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 24px;
        }

        .ia-home-workspace {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .composer-hero-section {
          padding: 8px 0 16px 0;
          position: relative;
          width: 100%;
        }

        .composer-container-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .ia-active-chat-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 860px) {
          .ia-main-content {
            padding-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
