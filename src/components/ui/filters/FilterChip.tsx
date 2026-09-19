'use client';

import React from 'react';

export interface FilterChipProps {
  id?: string;
  label: string;
  isActive?: boolean;
  isOpen?: boolean;
  countBadge?: number;
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary' | 'neutral' | string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive = false,
  isOpen = false,
  countBadge,
  icon,
  onRemove,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
}) => {
  // Mode Removable Chip (ex: "Mathématiques ×")
  if (onRemove) {
    return (
      <span className={`sunu-filter-removable-chip ${className}`}>
        {icon && <span className="chip-icon">{icon}</span>}
        <span className="chip-label" onClick={onClick}>
          {label}
        </span>
        <button
          type="button"
          className="chip-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={ariaLabel || `Supprimer le filtre ${label}`}
          title="Supprimer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <style jsx>{`
          .sunu-filter-removable-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            background: #eef2ff;
            border: 1px solid #c7d2fe;
            border-radius: 9999px;
            font-size: 12.5px;
            font-weight: 600;
            color: #3730a3;
            transition: all 0.15s ease;
            user-select: none;
            animation: chipFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes chipFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .sunu-filter-removable-chip:hover {
            border-color: #818cf8;
            background: #e0e7ff;
          }

          .chip-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #4f46e5;
          }

          .chip-label {
            cursor: pointer;
            white-space: nowrap;
          }

          .chip-remove-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            background: rgba(79, 70, 229, 0.12);
            color: #4338ca;
            border: none;
            cursor: pointer;
            transition: all 0.12s ease;
            margin-left: 2px;
            padding: 0;
          }

          .chip-remove-btn:hover {
            background: #ef4444;
            color: #ffffff;
            transform: scale(1.1);
          }
        `}</style>
      </span>
    );
  }

  // Mode Trigger Chip (ex: [Matière ⌄], [+ Filtres (2)])
  return (
    <button
      type="button"
      className={`sunu-filter-trigger-chip ${isActive ? 'is-active' : ''} ${isOpen ? 'is-open' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-label={ariaLabel || label}
    >
      {icon && <span className="chip-leading-icon">{icon}</span>}
      <span className="chip-text">{label}</span>

      {countBadge !== undefined && countBadge > 0 && (
        <span className="chip-count-badge">{countBadge}</span>
      )}

      {/* Chevron indicator if not a standalone button */}
      <svg
        className={`chip-chevron ${isOpen ? 'rotated' : ''}`}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>

      <style jsx>{`
        .sunu-filter-trigger-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 14px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          outline: none;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          user-select: none;
        }

        .sunu-filter-trigger-chip:hover {
          border-color: #cbd5e1;
          background: #fafafa;
          color: #0f172a;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.05);
        }

        .sunu-filter-trigger-chip.is-active {
          background: #eef2ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        .sunu-filter-trigger-chip.is-open {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
          background: #ffffff;
        }

        .sunu-filter-trigger-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chip-leading-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .chip-text {
          letter-spacing: -0.01em;
        }

        .chip-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #4f46e5;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 10.5px;
          font-weight: 700;
          line-height: 1;
        }

        .chip-chevron {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
          margin-left: 1px;
        }

        .chip-chevron.rotated {
          transform: rotate(180deg);
          color: #4f46e5;
        }
      `}</style>
    </button>
  );
};
