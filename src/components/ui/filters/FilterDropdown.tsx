'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { FilterChip } from './FilterChip';

export interface FilterOption {
  value: string;
  label: string;
  subtitle?: string;
  description?: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface FilterDropdownProps {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  align?: 'left' | 'right';
  className?: string;
  icon?: React.ReactNode;
  minMenuWidth?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  enableSearch = false,
  searchPlaceholder = 'Rechercher...',
  align = 'left',
  className = '',
  icon,
  minMenuWidth = '220px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = value !== 'all' && value !== '';

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Libellé affiché sur le chip
  const chipLabel = useMemo(() => {
    if (selectedOption && isActive) {
      return selectedOption.label;
    }
    return placeholder || label;
  }, [selectedOption, isActive, placeholder, label]);

  // Positionnement vertical intelligent
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 280 && rect.top > 260) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Filtrage des options selon la recherche
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  // Fermeture clic extérieur et Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus automatique champ recherche
  useEffect(() => {
    if (isOpen && enableSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, enableSearch]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className={`sunu-filter-dropdown-container ${className}`} ref={containerRef} id={id}>
      <FilterChip
        label={chipLabel}
        isActive={isActive}
        isOpen={isOpen}
        icon={icon}
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel={`${label} : ${chipLabel}`}
      />

      {isOpen && (
        <div
          className={`sunu-filter-popover ${align === 'right' ? 'align-right' : 'align-left'} ${
            openUpward ? 'open-upward' : ''
          }`}
          style={{ minWidth: minMenuWidth }}
          role="listbox"
        >
          {enableSearch && options.length > 5 && (
            <div className="popover-search-header">
              <svg
                className="search-svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="popover-options-scroller">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`popover-option-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="opt-meta">
                      {opt.icon && <span className="opt-icon">{opt.icon}</span>}
                      <span className="opt-label">{opt.label}</span>
                      {opt.subtitle && <span className="opt-subtitle">{opt.subtitle}</span>}
                    </div>

                    {opt.badge && <span className="opt-badge">{opt.badge}</span>}

                    {isSelected && (
                      <span className="opt-check">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="popover-empty">Aucun résultat</div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .sunu-filter-dropdown-container {
          position: relative;
          display: inline-block;
        }

        .sunu-filter-popover {
          position: absolute;
          top: calc(100% + 6px);
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.14),
            0 2px 8px rgba(0, 0, 0, 0.04);
          padding: 6px;
          z-index: 200;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sunu-filter-popover.open-upward {
          top: auto;
          bottom: calc(100% + 6px);
          animation: popoverFadeInUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sunu-filter-popover.align-left {
          left: 0;
        }

        .sunu-filter-popover.align-right {
          right: 0;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes popoverFadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popover-search-header {
          position: relative;
          padding: 4px 4px 6px 4px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
        }

        .search-svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 26px 6px 28px;
          font-size: 12px;
          color: #1e293b;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .search-input:focus {
          border-color: #4f46e5;
          background: #ffffff;
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 10px;
          cursor: pointer;
          padding: 2px;
        }

        .popover-options-scroller {
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 2px;
        }

        .popover-options-scroller::-webkit-scrollbar {
          width: 5px;
        }

        .popover-options-scroller::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 9999px;
        }

        .popover-option-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.12s ease;
          text-align: left;
        }

        .popover-option-btn:hover {
          background: #f8fafc;
        }

        .popover-option-btn.is-selected {
          background: rgba(79, 70, 229, 0.08);
        }

        .opt-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .opt-icon {
          display: inline-flex;
          align-items: center;
          font-size: 13px;
        }

        .opt-label {
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .popover-option-btn.is-selected .opt-label {
          font-weight: 700;
          color: #4338ca;
        }

        .opt-subtitle {
          font-size: 11px;
          color: #64748b;
        }

        .opt-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #64748b;
          white-space: nowrap;
        }

        .popover-option-btn.is-selected .opt-badge {
          background: #e0e7ff;
          color: #4338ca;
        }

        .opt-check {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .popover-empty {
          padding: 14px 10px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
