'use client';

import React, { useRef } from 'react';
import { QUICK_CATEGORIES } from '@/data/mockLibrary';

interface QuickCategoriesProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const QuickCategories: React.FC<QuickCategoriesProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="quick-cats-wrapper">
      <div className="container quick-cats-container">
        {/* Left arrow */}
        <button
          type="button"
          className="scroll-btn left"
          onClick={() => handleScroll('left')}
          aria-label="Faire défiler vers la gauche"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scrollable list */}
        <div ref={scrollRef} className="cats-scroller">
          {QUICK_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          className="scroll-btn right"
          onClick={() => handleScroll('right')}
          aria-label="Faire défiler vers la droite"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .quick-cats-wrapper {
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
          background: #ffffff;
          padding: 12px 0;
          position: sticky;
          top: 72px;
          z-index: 40;
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.02);
        }

        .quick-cats-container {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .scroll-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          color: #475569;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .scroll-btn:hover {
          background: #fefce8;
          color: #854d0e;
          border-color: rgba(234, 179, 8, 0.45);
          transform: scale(1.05);
        }

        .cats-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 4px;
          scroll-behavior: smooth;
        }

        .cats-scroller::-webkit-scrollbar {
          display: none;
        }

        .cat-pill {
          padding: 7px 18px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cat-pill:hover {
          color: #854d0e;
          background: #fefce8;
          border-color: rgba(234, 179, 8, 0.35);
        }

        .cat-pill.active {
          background: linear-gradient(135deg, #fef08a 0%, #facc15 60%, #eab308 100%);
          color: #713f12;
          font-weight: 700;
          border-color: rgba(234, 179, 8, 0.6);
          box-shadow: 0 4px 14px -2px rgba(234, 179, 8, 0.3);
        }

        @media (max-width: 768px) {
          .quick-cats-wrapper {
            top: 72px;
            padding: 8px 0;
          }

          .scroll-btn {
            display: none;
          }

          .cats-scroller {
            padding-left: 8px;
            padding-right: 8px;
          }

          .cat-pill {
            font-size: 13px;
            padding: 6px 14px;
          }
        }
      `}</style>
    </div>
  );
};
