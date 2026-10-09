'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { AuthModal } from '@/components/ui/AuthModal';

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchFeedback(`Recherche en direct pour « ${query} »... Plus de 12 400 documents disponibles.`);
    const target = document.getElementById('search-feedback-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-wrapper">
      {/* Top sticky navigation bar - fully transparent without borders */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Page Content - perfectly centered (title, description, search capsule) */}
      <main>
        {/* Dynamic Search / Feedback Banner if user interacts */}
        {searchFeedback && (
          <div id="search-feedback-anchor" className="container feedback-container">
            <div className="feedback-card">
              <div className="feedback-left">
                <span className="feedback-pulse" />
                <span className="feedback-text">{searchFeedback}</span>
              </div>
              <button
                type="button"
                className="feedback-dismiss"
                onClick={() => setSearchFeedback(null)}
              >
                Effacer
              </button>
            </div>
          </div>
        )}

        {/* Hero Section centered in the dead center of the screen */}
        <HeroSection
          onSearch={handleSearch}
          onTagClick={handleSearch}
        />
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .page-wrapper {
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: #faf8ff;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 0;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        @media (max-height: 580px) {
          .page-wrapper {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
        }

        .feedback-container {
          margin-bottom: 20px;
          max-width: 640px;
          width: 100%;
        }

        .feedback-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 16px;
          padding: 12px 20px;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.08);
          animation: slide-down 0.25s ease-out;
        }

        .feedback-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feedback-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4f46e5;
          box-shadow: 0 0 10px #4f46e5;
        }

        .feedback-text {
          font-size: 14px;
          font-weight: 600;
          color: #1e1b4b;
        }

        .feedback-dismiss {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          padding: 4px 10px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .feedback-dismiss:hover {
          color: #4f46e5;
          background: #f1f5f9;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
