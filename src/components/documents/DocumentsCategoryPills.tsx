'use client';

import React from 'react';
import { DocumentCategory, DocumentCategoryInfo } from '@/types/document';

interface DocumentsCategoryPillsProps {
  categories: DocumentCategoryInfo[];
  selectedCategory: DocumentCategory;
  onSelectCategory: (cat: DocumentCategory) => void;
  categoryCounts: Record<string, number>;
}

export const DocumentsCategoryPills: React.FC<DocumentsCategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="doc-category-pills-container">
      <div className="doc-pills-scroll-track">
        {/* "Tous" Pill */}
        <button
          type="button"
          className={`doc-pill-item ${selectedCategory === 'all' ? 'is-active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <span className="doc-pill-label">Tous les documents</span>
          {categoryCounts['all'] !== undefined && (
            <span className="doc-pill-counter">{categoryCounts['all']}</span>
          )}
        </button>

        {/* Categories Pills */}
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              className={`doc-pill-item ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="doc-pill-label">{cat.label}</span>
              {count > 0 && <span className="doc-pill-counter">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
