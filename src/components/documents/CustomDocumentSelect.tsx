'use client';

import React, { useRef, useEffect } from 'react';

export interface CustomSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode | string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
}

interface CustomDocumentSelectProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  accent?: boolean;
  minMenuWidth?: string;
  isMobile?: boolean;
}

export const CustomDocumentSelect: React.FC<CustomDocumentSelectProps> = ({
  id,
  label,
  icon,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
  accent = false,
  minMenuWidth = '280px',
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const isSelectedActive = value !== 'all' && value !== '';

  return (
    <div
      ref={containerRef}
      className={`doc-custom-select-container ${isMobile ? 'is-mobile' : ''} ${
        accent ? 'accent-mode' : ''
      }`}
    >
      <label htmlFor={id} className="doc-custom-select-label" onClick={onToggle}>
        {icon && <span className="doc-select-icon">{icon}</span>}
        <span>{label}</span>
      </label>

      <button
        id={id}
        type="button"
        className={`doc-custom-select-trigger ${isOpen ? 'is-open' : ''} ${
          isSelectedActive ? 'is-active-val' : ''
        }`}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="doc-trigger-content">
          {selectedOption.icon && (
            <span className="doc-trigger-opt-icon">{selectedOption.icon}</span>
          )}
          <span className="doc-trigger-label">{selectedOption.label}</span>
          {selectedOption.badge && (
            <span
              className="doc-trigger-badge"
              style={{
                backgroundColor: selectedOption.badgeColor || '#e0e7ff',
                color: selectedOption.badgeTextColor || '#4338ca',
              }}
            >
              {selectedOption.badge}
            </span>
          )}
        </span>

        <svg
          className={`doc-chevron-icon ${isOpen ? 'rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`doc-custom-dropdown-menu ${isMobile ? 'menu-mobile' : ''}`}
          style={{ minWidth: isMobile ? '100%' : minMenuWidth }}
          role="listbox"
        >
          <div className="doc-dropdown-scroll">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className={`doc-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    onClose();
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="doc-item-icon-col">
                    {option.icon ? (
                      <span className="doc-item-icon">{option.icon}</span>
                    ) : (
                      <span className="doc-item-dot" />
                    )}
                  </div>

                  <div className="doc-item-text-col">
                    <div className="doc-item-title-row">
                      <span className="doc-item-label">{option.label}</span>
                      {option.badge && (
                        <span
                          className="doc-item-badge"
                          style={{
                            backgroundColor: option.badgeColor || '#e0e7ff',
                            color: option.badgeTextColor || '#4338ca',
                          }}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.subtitle && (
                      <span className="doc-item-subtitle">{option.subtitle}</span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="doc-item-check-col">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
