'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { AuthModal } from '@/components/ui/AuthModal';
import { CategoryItem } from '@/data/categories';

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchFeedback(`Recherche en direct pour « ${query} »... Plus de 12 400 documents disponibles.`);
    // Scroll smoothly to the results notification or category grid
    const target = document.getElementById('search-feedback-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat: CategoryItem) => {
    setActiveCategory(cat);
    setSearchFeedback(`Section sélectionnée : ${cat.title} — ${cat.subtitle}`);
  };

  return (
    <div className="page-wrapper">
      {/* Top sticky navigation bar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Page Content */}
      <main>
        {/* Hero Section matching the visual reference */}
        <HeroSection
          onSearch={handleSearch}
          onTagClick={handleSearch}
        />

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

        {/* 8 Categories Grid matching reference */}
        <CategoryGrid onSelectCategory={handleSelectCategory} />
      </main>

      {/* Footer removed as requested - leaving only categories in the lower section */}

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
          background: #ffffff;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0 48px;
          min-height: 0;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        @media (max-height: 680px), (max-width: 640px) {
          .page-wrapper {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
        }

        .feedback-container {
          margin-bottom: 24px;
        }

        .feedback-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid rgba(99, 102, 241, 0.3);
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
