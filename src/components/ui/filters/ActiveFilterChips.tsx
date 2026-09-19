'use client';

import React from 'react';
import { FilterChip } from './FilterChip';

export interface ActiveFilterItem {
  id: string;
  label: string;
  value?: string;
  categoryLabel?: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  items: ActiveFilterItem[];
  onResetAll?: () => void;
  className?: string;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  items,
  onResetAll,
  className = '',
}) => {
  if (items.length === 0) return null;

  return (
    <div className={`sunu-active-filter-chips-row ${className}`}>
      <div className="chips-list">
        {items.map((item) => (
          <FilterChip
            key={item.id}
            label={item.categoryLabel ? `${item.categoryLabel} : ${item.label}` : item.label}
            onRemove={item.onRemove}
            ariaLabel={`Supprimer le filtre ${item.label}`}
          />
        ))}

        {onResetAll && items.length > 1 && (
          <button
            type="button"
            className="clear-all-chips-btn"
            onClick={onResetAll}
          >
            Tout effacer
          </button>
        )}
      </div>

      <style jsx>{`
        .sunu-active-filter-chips-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
          animation: rowFadeIn 0.2s ease-in-out;
        }

        @keyframes rowFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chips-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .clear-all-chips-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .clear-all-chips-btn:hover {
          color: #ef4444;
          background: #fef2f2;
        }
      `}</style>
    </div>
  );
};
