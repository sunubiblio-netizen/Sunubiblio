'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode | string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  count?: number;
  group?: string;
}

export interface CustomFilterDropdownProps {
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
  icon?: React.ReactNode;
  disabled?: boolean;
  minMenuWidth?: string;
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
  icon,
  disabled = false,
  minMenuWidth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const isFiltered = value !== 'all' && value !== '';

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Détection intelligente de l'espace disponible (évite le débordement bas d'écran)
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

  // Filtrage selon la recherche interne si activée
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  // Fermeture automatique au clic en dehors et touche Échap
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

  // Focus automatique sur le champ de recherche à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (enableSearch) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
      // Positionner le surlignage sur l'élément actuellement sélectionné
      const idx = filteredOptions.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen, enableSearch, filteredOptions, value]);

  const handleSelect = useCallback(
    (val: string) => {
      if (disabled) return;
      onChange(val);
      setIsOpen(false);
    },
    [disabled, onChange]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange('all');
    setIsOpen(false);
  };

  // Clavier : Navigation via flèches haut/bas et sélection par Entrée
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleListboxKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-filter-dropdown-field ${isFiltered ? 'is-active' : ''} ${
        isOpen ? 'is-open' : ''
      } ${disabled ? 'is-disabled' : ''} ${className}`}
      onKeyDown={handleListboxKeyDown}
    >
      <label htmlFor={id} className="dropdown-field-label">
        {icon && <span className="field-icon">{icon}</span>}
        <span>{label}</span>
        {isFiltered && <span className="active-dot" />}
      </label>

      <div className="dropdown-trigger-box">
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={`dropdown-trigger-btn ${isFiltered ? 'filtered' : ''} ${
            isOpen ? 'focused' : ''
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <div className="trigger-leading">
            {selectedOption?.icon && (
              <span className="selected-opt-icon">
                {typeof selectedOption.icon === 'string' ? selectedOption.icon : selectedOption.icon}
              </span>
            )}
            <span className="selected-value-text" title={displayLabel}>
              {displayLabel}
            </span>
          </div>

          <div className="trigger-actions">
            {isFiltered && !disabled && (
              <span
                role="button"
                tabIndex={0}
                className="clear-filter-mini-btn"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                title="Effacer ce filtre"
                aria-label="Effacer le filtre"
              >
                ✕
              </span>
            )}
            <svg
              className={`chevron-arrow ${isOpen ? 'rotated' : ''}`}
              width="14"
              height="14"
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
          <div
            className={`dropdown-popover-menu ${align === 'right' ? 'align-right' : 'align-left'} ${
              openUpward ? 'open-upward' : ''
            }`}
            style={{ minWidth: minMenuWidth || undefined }}
          >
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
                  aria-label={searchPlaceholder}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="popover-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la recherche"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            <div className="popover-items-scroller" role="listbox" ref={listboxRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`popover-item-btn ${isSelected ? 'selected' : ''} ${
                        isHighlighted ? 'highlighted' : ''
                      }`}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="item-text-group">
                        {opt.icon && (
                          <span className="item-icon">
                            {typeof opt.icon === 'string' ? opt.icon : opt.icon}
                          </span>
                        )}
                        <div className="item-labels">
                          <span className="item-title">{opt.label}</span>
                          {opt.subtitle && <span className="item-subtitle">{opt.subtitle}</span>}
                        </div>
                        {opt.badge && (
                          <span
                            className="item-badge"
                            style={{
                              backgroundColor: opt.badgeColor || undefined,
                              color: opt.badgeTextColor || undefined,
                            }}
                          >
                            {opt.badge}
                          </span>
                        )}
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
                  <span>Aucun résultat trouvé</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-filter-dropdown-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          min-width: 140px;
        }

        .custom-filter-dropdown-field.is-open {
          z-index: 120;
        }

        .custom-filter-dropdown-field.is-disabled {
          opacity: 0.55;
          pointer-events: none;
        }

        .dropdown-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s ease;
          user-select: none;
        }

        .field-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .custom-filter-dropdown-field.is-active .dropdown-field-label {
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
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 6px 12px;
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
          border-color: #cbd5e1;
          background: #fafafa;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .dropdown-trigger-btn.focused {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
          background: #ffffff;
        }

        .dropdown-trigger-btn.filtered {
          background: #eef2ff;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .trigger-leading {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .selected-opt-icon {
          font-size: 14px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .selected-value-text {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-trigger-btn.filtered .selected-value-text {
          color: #4338ca;
        }

        .trigger-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .clear-filter-mini-btn {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.25);
          color: #475569;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .clear-filter-mini-btn:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .chevron-arrow {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
          flex-shrink: 0;
        }

        .chevron-arrow.rotated {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        .dropdown-popover-menu {
          position: absolute;
          top: calc(100% + 6px);
          min-width: 220px;
          max-width: 320px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(0, 0, 0, 0.04);
          padding: 6px;
          z-index: 150;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-popover-menu.open-upward {
          top: auto;
          bottom: calc(100% + 6px);
          animation: popoverFadeInUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-popover-menu.align-left {
          left: 0;
        }

        .dropdown-popover-menu.align-right {
          right: 0;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes popoverFadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popover-search-wrap {
          position: relative;
          padding: 6px 6px 8px 6px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
        }

        .popover-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .popover-search-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 28px 7px 30px;
          font-size: 12.5px;
          color: #1e293b;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .popover-search-input:focus {
          border-color: #4f46e5;
          background: #ffffff;
        }

        .popover-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 11px;
          padding: 2px 4px;
        }

        .popover-items-scroller {
          max-height: 250px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 2px;
        }

        .popover-items-scroller::-webkit-scrollbar {
          width: 5px;
        }

        .popover-items-scroller::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 9999px;
        }

        .popover-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 9px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.12s ease;
          text-align: left;
        }

        .popover-item-btn:hover,
        .popover-item-btn.highlighted {
          background: #f8fafc;
        }

        .popover-item-btn.selected {
          background: rgba(79, 70, 229, 0.08);
        }

        .item-text-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .item-icon {
          font-size: 14px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-labels {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .popover-item-btn.selected .item-title {
          font-weight: 700;
          color: #4338ca;
        }

        .item-subtitle {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-badge {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 5px;
          background: #f1f5f9;
          color: #64748b;
          white-space: nowrap;
        }

        .popover-item-btn.selected .item-badge {
          background: #e0e7ff;
          color: #4338ca;
        }

        .item-check-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .popover-empty-state {
          padding: 16px 12px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .dropdown-popover-menu {
            max-width: calc(100vw - 32px);
          }
        }
      `}</style>
    </div>
  );
};
