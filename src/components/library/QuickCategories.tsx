'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag-to-scroll fluid state
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Exclure "Toutes les ressources" comme demandé par l'utilisateur
  const visibleCategories = QUICK_CATEGORIES.filter((c) => c.id !== 'all');

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  // Fluid Mouse Drag-to-Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handlePillClick = (catId: string) => {
    // Si on vient de glisser à la souris, ne pas déclencher le clic
    if (hasDraggedRef.current) return;
    // Si la catégorie cliquée est déjà active, on peut désélectionner (retour à 'all')
    if (activeCategory === catId) {
      onSelectCategory('all');
    } else {
      onSelectCategory(catId);
    }
  };

  return (
    <div className="quick-cats-wrapper">
      <div className="container quick-cats-container">
        {/* Flèche gauche fluide */}
        {canScrollLeft && (
          <button
            type="button"
            className="scroll-btn left"
            onClick={() => handleScroll('left')}
            aria-label="Faire défiler vers la gauche"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Défileur fluide avec support drag tactile/souris */}
        <div
          ref={scrollRef}
          className="cats-scroller"
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => handlePillClick(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Flèche droite fluide */}
        {canScrollRight && (
          <button
            type="button"
            className="scroll-btn right"
            onClick={() => handleScroll('right')}
            aria-label="Faire défiler vers la droite"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Bouton '+' transparent pour ouvrir et voir toutes les catégories */}
        <div className="cats-plus-wrapper">
          <button
            type="button"
            className={`cats-plus-btn ${isDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-label="Afficher plus de catégories"
            title="Voir toutes les catégories"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Menu déroulant de toutes les catégories */}
          {isDropdownOpen && (
            <>
              <div
                className="cats-dropdown-backdrop"
                onClick={() => setIsDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="cats-dropdown-card" role="dialog" aria-label="Toutes les catégories">
                <div className="cats-dropdown-header">
                  <span className="cats-dropdown-title">Catégories de ressources</span>
                  <button
                    type="button"
                    className="cats-dropdown-close"
                    onClick={() => setIsDropdownOpen(false)}
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                </div>
                <div className="cats-dropdown-list">
                  {visibleCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`cats-dropdown-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          onSelectCategory(isActive ? 'all' : cat.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="item-dot" />
                        <span className="item-label">{cat.label}</span>
                        {isActive && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .quick-cats-wrapper {
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          background: #ffffff;
          padding: 10px 0;
          position: sticky;
          top: 72px;
          z-index: 40;
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.02);
        }

        .quick-cats-container {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          max-width: 1240px;
          margin: 0 auto;
        }

        .scroll-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #64748b;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          transition: all 0.18s ease;
          flex-shrink: 0;
          cursor: pointer;
        }

        .scroll-btn:hover {
          background: #fffdf5;
          color: #854d0e;
          border-color: rgba(234, 179, 8, 0.45);
          transform: scale(1.04);
        }

        .cats-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 2px;
          scroll-behavior: smooth;
          cursor: grab;
          user-select: none;
          flex: 1;
        }

        .cats-scroller:active {
          cursor: grabbing;
        }

        .cats-scroller::-webkit-scrollbar {
          display: none;
        }

        .cat-pill {
          padding: 7px 16px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          transition: all 0.18s ease;
          flex-shrink: 0;
          cursor: pointer;
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
          box-shadow: 0 3px 10px -2px rgba(234, 179, 8, 0.3);
        }

        /* Bouton '+' transparent discret */
        .cats-plus-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .cats-plus-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1.5px dashed rgba(203, 213, 225, 0.9);
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cats-plus-btn:hover,
        .cats-plus-btn.active {
          background: #fffdf5;
          border-color: #eab308;
          color: #854d0e;
          border-style: solid;
          transform: rotate(90deg);
          box-shadow: 0 2px 8px rgba(234, 179, 8, 0.15);
        }

        /* Menu déroulant des catégories */
        .cats-dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: 490;
          background: rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(1px);
        }

        .cats-dropdown-card {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          max-height: 420px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04);
          z-index: 500;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: popoverFade 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cats-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .cats-dropdown-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .cats-dropdown-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .cats-dropdown-close:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .cats-dropdown-list {
          padding: 8px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cats-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }

        .cats-dropdown-item:hover {
          background: #fffdf5;
          color: #854d0e;
        }

        .cats-dropdown-item.active {
          background: #fefce8;
          color: #854d0e;
          font-weight: 700;
        }

        .item-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .cats-dropdown-item.active .item-dot {
          background: #eab308;
          box-shadow: 0 0 6px rgba(234, 179, 8, 0.6);
        }

        .item-label {
          flex: 1;
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
            padding-left: 6px;
            padding-right: 6px;
          }

          .cat-pill {
            font-size: 13px;
            padding: 6px 14px;
          }

          .cats-dropdown-card {
            width: calc(100vw - 32px);
            right: -10px;
          }
        }
      `}</style>
    </div>
  );
};
