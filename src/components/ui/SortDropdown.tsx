'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SortOptionItem<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SortDropdownProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SortOptionItem<T>[];
  labelPrefix?: string;
  align?: 'left' | 'right';
}

export function SortDropdown<T extends string>({
  value,
  onChange,
  options,
  labelPrefix = 'Trier par :',
  align = 'right',
}: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="custom-sort-dropdown-root" ref={dropdownRef}>
      {labelPrefix && (
        <span className="dropdown-label-prefix desktop-only">
          {labelPrefix}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className={`dropdown-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Trier par : ${activeOption?.label || ''}`}
      >
        <span className="trigger-icon-wrap">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="8" y2="18" />
          </svg>
        </span>

        <span className="trigger-selected-text">
          {activeOption?.label}
        </span>

        <svg
          className={`trigger-chevron ${isOpen ? 'rotated' : ''}`}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Clean, Opaque, Designer Popover (No full screen glass veil) */}
      {isOpen && (
        <div
          className={`dropdown-popover-card ${align === 'right' ? 'align-right' : 'align-left'}`}
          role="listbox"
        >
          <div className="popover-header">
            <span className="popover-header-title">Trier les résultats</span>
          </div>

          <div className="popover-options-list">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="option-icon-box">
                    {option.icon ? (
                      option.icon
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </div>

                  <div className="option-text-group">
                    <span className="option-main-label">{option.label}</span>
                    {option.description && (
                      <span className="option-desc-label">
                        {option.description}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="option-check-pill">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-sort-dropdown-root {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        }

        .dropdown-label-prefix {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .dropdown-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 13px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .dropdown-trigger-btn:hover {
          border-color: #cbd5e1;
          background: #fafafa;
          color: #1e293b;
        }

        .dropdown-trigger-btn.active {
          border-color: #6366f1;
          color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .trigger-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .trigger-selected-text {
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .trigger-chevron {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
          margin-left: 1px;
        }

        .trigger-chevron.rotated {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        /* Pure White Designer Card */
        .dropdown-popover-card {
          position: absolute;
          top: calc(100% + 6px);
          z-index: 500;
          width: 240px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.14),
            0 2px 8px rgba(15, 23, 42, 0.04);
          padding: 6px;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Desktop alignment: align with right edge of trigger */
        .dropdown-popover-card.align-right {
          right: 0;
          left: auto;
        }

        .dropdown-popover-card.align-left {
          left: 0;
          right: auto;
        }

        .popover-header {
          padding: 6px 9px 5px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 3px;
        }

        .popover-header-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
        }

        .popover-options-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .popover-option-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 7px 9px;
          border-radius: 9px;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .popover-option-item:hover {
          background: #f8fafc;
        }

        .popover-option-item.selected {
          background: rgba(79, 70, 229, 0.06);
        }

        .option-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .popover-option-item:hover .option-icon-box {
          background: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
        }

        .popover-option-item.selected .option-icon-box {
          background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
        }

        .option-text-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
          min-width: 0;
        }

        .option-main-label {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.2;
        }

        .popover-option-item.selected .option-main-label {
          font-weight: 700;
          color: #4f46e5;
        }

        .option-desc-label {
          font-size: 10.5px;
          color: #64748b;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .option-check-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.1);
          flex-shrink: 0;
        }

        /* Mobile & Tablet adjustments: align to left edge so it never overflows offscreen */
        @media (max-width: 640px) {
          .dropdown-popover-card.align-right,
          .dropdown-popover-card.align-left {
            left: 0 !important;
            right: auto !important;
            width: 230px !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
      `}</style>
    </div>
  );
}
