'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IAHeroCentered } from '@/components/ia/IAHeroCentered';
import { AIComposer } from '@/components/ia/composer/AIComposer';
import { AISuggestions } from '@/components/ia/AISuggestions';
import { AIToolShortcuts } from '@/components/ia/AIToolShortcuts';
import { AIConversationView } from '@/components/ia/conversation/AIConversationView';
import { IADocumentsSection } from '@/components/ia/IADocumentsSection';
import { IAHistory } from '@/components/ia/IAHistory';
import { AIMessage, AIMode, AIAttachment } from '@/types/ai';
import { AIService } from '@/services/aiService';

export default function IAPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode>('assistant');
  const [composerKey, setComposerKey] = useState(0); // to reset or prefill composer

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

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call AIService
      const aiResponse = await AIService.processRequest({
        content: payload.content,
        mode: payload.mode,
        attachments: payload.attachments,
        isWebSearch: payload.isWebSearch,
      });

      setMessages((prev) => [...prev, aiResponse]);
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

  // Handle suggestion chip click: prefill composer with prompt and mode
  const handleSelectSuggestion = (suggestion: { prompt: string; mode: AIMode }) => {
    setActiveMode(suggestion.mode);
    // Send directly or prefill
    handleSendMessage({
      content: suggestion.prompt,
      mode: suggestion.mode,
      attachments: [],
      isWebSearch: false
    });
  };

  // Reset conversation to initial state
  const handleResetChat = () => {
    setMessages([]);
    setIsLoading(false);
    setActiveMode('assistant');
    setComposerKey((prev) => prev + 1);
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
    <div className="ia-page-wrapper">
      <Navbar />

      <main className="ia-main-content">
        {/* En-tête avec titre STRICTEMENT CENTRÉ sur tous les écrans */}
        <IAHeroCentered
          onNewChat={handleResetChat}
          isConversationActive={isConversationActive}
        />

        {!isConversationActive ? (
          /* Vue d'accueil IA : Composer centralisé, Suggestions, Outils et Documents */
          <div className="ia-home-workspace">
            <section className="composer-hero-section">
              <div className="container">
                <div className="composer-container-block">
                  <AIComposer
                    key={composerKey}
                    onSendMessage={handleSendMessage}
                    initialMode={activeMode}
                    placeholder="Posez une question, collez un cours ou demandez un résumé à l'IA..."
                  />

                  {/* Suggestions sous la barre */}
                  <AISuggestions onSelectSuggestion={handleSelectSuggestion} />
                </div>
              </div>
            </section>

            {/* Outils IA Spécialisés présentés sous forme de raccourcis élégants */}
            <AIToolShortcuts />

            {/* Section documents Sunubiblio */}
            <IADocumentsSection />

            {/* Historique et activité */}
            <IAHistory />
          </div>
        ) : (
          /* Vue conversationnelle active */
          <AIConversationView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onResetChat={handleResetChat}
            onRetryLast={handleRetryLast}
          />
        )}
      </main>

      {/* Le footer classique ne s'affiche que sur la page d'accueil IA pour ne pas polluer l'espace conversationnel */}
      {!isConversationActive && <Footer />}

      <style jsx>{`
        .ia-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .ia-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ia-home-workspace {
          display: flex;
          flex-direction: column;
        }

        .composer-hero-section {
          padding: 10px 0 40px 0;
          position: relative;
        }

        .composer-container-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 860px) {
          .composer-hero-section {
            padding-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
}
