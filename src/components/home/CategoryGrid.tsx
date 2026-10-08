'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES, CategoryItem } from '@/data/categories';

interface CategoryGridProps {
  onSelectCategory?: (category: CategoryItem) => void;
}

const SQUIRCLE_THEMES: Record<string, {
  gradient: string;
  glow: string;
}> = {
  'bibliotheque': {
    gradient: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)',
    glow: 'rgba(37, 99, 235, 0.38)',
  },
  'education': {
    gradient: 'linear-gradient(145deg, #06b6d4 0%, #0284c7 100%)',
    glow: 'rgba(6, 182, 212, 0.38)',
  },
  'concours': {
    gradient: 'linear-gradient(145deg, #f43f5e 0%, #e11d48 100%)',
    glow: 'rgba(244, 63, 94, 0.38)',
  },
  'documents': {
    gradient: 'linear-gradient(145deg, #10b981 0%, #059669 100%)',
    glow: 'rgba(16, 185, 129, 0.38)',
  },
  'religion': {
    gradient: 'linear-gradient(145deg, #f59e0b 0%, #d97706 100%)',
    glow: 'rgba(245, 158, 11, 0.38)',
  },
  'ia-assistant': {
    gradient: 'linear-gradient(145deg, #a855f7 0%, #7c3aed 100%)',
    glow: 'rgba(124, 58, 237, 0.38)',
  },
  'exercices': {
    gradient: 'linear-gradient(145deg, #14b8a6 0%, #0d9488 100%)',
    glow: 'rgba(20, 184, 166, 0.38)',
  },
  'communaute': {
    gradient: 'linear-gradient(145deg, #d946ef 0%, #c026d3 100%)',
    glow: 'rgba(217, 70, 239, 0.38)',
  },
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'school':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
      case 'trophy':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
            <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'home':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'feather':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
            <line x1="16" y1="8" x2="2" y2="22" />
            <line x1="17.5" y1="15" x2="9" y2="15" />
          </svg>
        );
      case 'brain':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" />
          </svg>
        );
      case 'clipboard-check':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <polyline points="9 14 11 16 15 11" />
          </svg>
        );
      case 'users':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="categories-section" id="bibliotheque">
      <div className="container categories-container">
        {/* Modern App Squircles Grid (4 en haut, 4 en bas) */}
        <div className="categories-squircle-grid">
          {CATEGORIES.map((cat) => {
            const theme = SQUIRCLE_THEMES[cat.id] || {
              gradient: 'linear-gradient(145deg, #6366f1 0%, #4f46e5 100%)',
              glow: 'rgba(79, 70, 229, 0.38)',
            };
            return (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className="category-squircle-item"
                title={`${cat.title} — ${cat.subtitle}`}
              >
                <div
                  className="category-squircle-box"
                  style={{
                    background: theme.gradient,
                    boxShadow: `0 10px 22px -4px ${theme.glow}, 0 2px 6px -1px rgba(0, 0, 0, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)`,
                  }}
                >
                  <div className="squircle-glass-highlight" />
                  <div className="squircle-icon-wrap">
                    {renderIcon(cat.icon)}
                  </div>
                </div>
                <span className="category-squircle-label">{cat.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
