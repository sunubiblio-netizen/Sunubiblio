'use client';

import React, { useState } from 'react';

const SUGGESTIONS = [
  "Explique-moi ce chapitre simplement",
  "Résume ce cours",
  "Génère 10 QCM sur ce sujet",
  "Donne-moi des exercices de niveau Terminale",
  "Corrige ma réponse"
];

export const IAAssistantDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      alert("Mode Démonstration : L'intégration de Gemini sera activée ultérieurement.");
      setInputValue('');
    }
  };

  return (
    <section className="ia-assistant-section" id="assistant">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Assistant IA Sunubiblio</h2>
          <p className="section-subtitle">
            Une interface conversationnelle fluide, conçue pour vous accompagner.
          </p>
        </div>

        <div className="assistant-container">
          <div className="chat-window">
            {/* Header du Chat */}
            <div className="chat-header">
              <div className="bot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="chat-header-info">
                <span className="bot-name">Assistant Sunubiblio</span>
                <span className="bot-status">En ligne</span>
              </div>
            </div>

            {/* Zone de conversation */}
            <div className="chat-history">
              <div className="chat-message bot-message">
                <div className="message-content">
                  Bonjour 👋<br />
                  Je suis l'assistant pédagogique de Sunubiblio. Comment puis-je vous aider aujourd'hui ?
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="chat-suggestions">
              <div className="suggestions-scroll">
                {SUGGESTIONS.map((sug, idx) => (
                  <button 
                    key={idx} 
                    className="suggestion-pill"
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="chat-input-area">
              <form onSubmit={handleSubmit} className="chat-form">
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder="Écrivez votre question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={`chat-submit-btn ${inputValue.trim() ? 'active' : ''}`}
                  disabled={!inputValue.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ia-assistant-section {
          padding: 60px 0;
          background: #ffffff;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .assistant-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .chat-window {
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          height: 600px;
          max-height: 80vh;
        }

        .chat-header {
          background: #ffffff;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header-info {
          display: flex;
          flex-direction: column;
        }

        .bot-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        }

        .bot-status {
          font-size: 12px;
          color: #10b981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bot-status::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        .chat-history {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-message {
          max-width: 80%;
        }

        .bot-message {
          align-self: flex-start;
        }

        .message-content {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 14px 18px;
          border-radius: 20px;
          border-top-left-radius: 4px;
          color: #334155;
          font-size: 14.5px;
          line-height: 1.6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .chat-suggestions {
          padding: 0 24px 16px 24px;
        }

        .suggestions-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }

        .suggestion-pill {
          white-space: nowrap;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-pill:hover {
          background: #eef2ff;
          border-color: #4f46e5;
        }

        .chat-input-area {
          background: #ffffff;
          padding: 16px 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
        }

        .chat-form {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 6px 6px 6px 20px;
          transition: border-color 0.2s ease;
        }

        .chat-form:focus-within {
          border-color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 15px;
          color: #0f172a;
        }

        .chat-input::placeholder {
          color: #94a3b8;
        }

        .chat-submit-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #94a3b8;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: not-allowed;
        }

        .chat-submit-btn.active {
          background: #4f46e5;
          color: #ffffff;
          cursor: pointer;
        }

        .chat-submit-btn.active:hover {
          background: #4338ca;
        }

        @media (max-width: 640px) {
          .chat-window {
            height: calc(100vh - 180px);
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
          
          .assistant-container {
            margin: 0 -20px;
          }
          
          .chat-input-area {
            padding-bottom: env(safe-area-inset-bottom, 24px); /* Evite le masquage par nav */
          }
        }
      `}</style>
    </section>
  );
};
