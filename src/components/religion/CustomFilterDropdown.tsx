'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  count?: number;
}

interface CustomFilterDropdownProps {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  align?: 'left' | 'right';
  className?: string;
}

export const CustomFilterDropdown: React.FC<CustomFilterDropdownProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = 'Sélectionner...',
  enableSearch = false,
  searchPlaceholder = 'Rechercher...',
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isFiltered = value !== 'all' && value !== '';

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Filtrage en direct de la liste selon la recherche interne
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(q) ||
      (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  // Fermeture automatique au clic en dehors et sur Échap
  useEffect(() => {
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus sur la recherche dès l'ouverture
  useEffect(() => {
    if (isOpen && enableSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, enableSearch]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('all');
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-filter-field ${isFiltered ? 'is-active' : ''} ${isOpen ? 'is-open' : ''} ${className}`}
    >
      <label htmlFor={id} className="dropdown-field-label">
        <span>{label}</span>
        {isFiltered && <span className="active-dot" />}
      </label>

      <div className="dropdown-trigger-box">
        <button
          id={id}
          type="button"
          className={`dropdown-trigger-btn ${isFiltered ? 'filtered' : ''} ${isOpen ? 'focused' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="selected-value-text" title={displayLabel}>
            {displayLabel}
          </span>

          <div className="trigger-actions">
            {isFiltered && (
              <button
                type="button"
                className="clear-filter-mini-btn"
                onClick={handleClear}
                title="Effacer ce filtre"
                aria-label="Effacer le filtre"
              >
                ✕
              </button>
            )}
            <svg
              className={`chevron-arrow ${isOpen ? 'rotated' : ''}`}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className={`dropdown-popover-menu ${align === 'right' ? 'align-right' : 'align-left'}`}>
            {enableSearch && options.length > 5 && (
              <div className="popover-search-wrap">
                <svg
                  className="popover-search-icon"
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
                  className="popover-search-input"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="popover-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            <div className="popover-items-scroller" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`popover-item-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      <div className="item-text-group">
                        <span className="item-title">{opt.label}</span>
                        {opt.badge && <span className="item-badge">{opt.badge}</span>}
                      </div>

                      {isSelected && (
                        <div className="item-check-icon">
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
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="popover-empty-state">
                  <span>Aucun résultat trouvé pour « {searchQuery} »</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-filter-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          position: relative;
          width: 100%;
        }

        .custom-filter-field.is-open {
          z-index: 80;
        }

        .dropdown-field-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.15s ease;
        }

        .custom-filter-field.is-active .dropdown-field-label {
          color: #4f46e5;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          display: inline-block;
        }

        .dropdown-trigger-box {
          position: relative;
          width: 100%;
        }

        .dropdown-trigger-btn {
          width: 100%;
          min-height: 40px;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 11px;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          outline: none;
        }

        .dropdown-trigger-btn:hover {
          border-color: #4f46e5;
          background: #fafaff;
        }

        .dropdown-trigger-btn.focused {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
          background: #ffffff;
        }

        .dropdown-trigger-btn.filtered {
          background: #eef2ff;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .selected-value-text {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .dropdown-trigger-btn.filtered .selected-value-text {
          color: #3730a3;
          font-weight: 700;
        }

        .trigger-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .clear-filter-mini-btn {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.15);
          border: none;
          color: #4f46e5;
          font-size: 9.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .clear-filter-mini-btn:hover {
          background: #4f46e5;
          color: #ffffff;
        }

        .chevron-arrow {
          color: #64748b;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
        }

        .dropdown-trigger-btn.filtered .chevron-arrow {
          color: #4f46e5;
        }

        .chevron-arrow.rotated {
          transform: rotate(180deg);
        }

        /* Popover Menu */
        .dropdown-popover-menu {
          position: absolute;
          top: calc(100% + 6px);
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 16px 38px -4px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04);
          z-index: 100;
          padding: 6px;
          min-width: 100%;
          width: max-content;
          max-width: 360px;
          animation: popover-drop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-popover-menu.align-left {
          left: 0;
        }

        .dropdown-popover-menu.align-right {
          right: 0;
        }

        @keyframes popover-drop {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popover-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          padding: 6px 10px;
          margin: 4px 4px 8px 4px;
        }

        .popover-search-wrap:focus-within {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .popover-search-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .popover-search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 12.5px;
          color: #0f172a;
          outline: none;
        }

        .popover-search-clear {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 11px;
          cursor: pointer;
          padding: 0 4px;
        }

        .popover-items-scroller {
          max-height: 250px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .popover-items-scroller::-webkit-scrollbar {
          width: 5px;
        }

        .popover-items-scroller::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .popover-item-btn {
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .popover-item-btn:hover {
          background: #f8fafc;
          transform: translateX(2px);
        }

        .popover-item-btn.selected {
          background: #eef2ff;
          border-left: 3px solid #6366f1;
        }

        .item-text-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          line-height: 1.35;
          word-break: break-word;
        }

        .popover-item-btn.selected .item-title {
          font-weight: 700;
          color: #3730a3;
        }

        .item-badge {
          font-size: 10.5px;
          font-weight: 700;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          padding: 2px 7px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .item-check-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popover-empty-state {
          padding: 16px 12px;
          text-align: center;
          font-size: 12.5px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};
