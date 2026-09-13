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
  group?: string;
}

interface CustomEducationSelectProps {
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

export const CustomEducationSelect: React.FC<CustomEducationSelectProps> = ({
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
  minMenuWidth = '290px',
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside this dropdown
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

  // Group options if applicable
  const hasGroups = options.some((opt) => opt.group);
  const groupedOptions = hasGroups
    ? options.reduce<Record<string, CustomSelectOption[]>>((acc, opt) => {
        const grp = opt.group || 'Général';
        if (!acc[grp]) acc[grp] = [];
        acc[grp].push(opt);
        return acc;
      }, {})
    : null;

  return (
    <div className="custom-select-root" ref={containerRef} id={`wrapper-${id}`}>
      {/* Label */}
      <label htmlFor={id} className="filter-col-label">
        {icon}
        <span>{label}</span>
      </label>

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''} ${
          isSelectedActive ? 'has-active-value' : ''
        } ${accent ? 'is-accent' : ''}`}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-content">
          {selectedOption?.icon && (
            <span className="trigger-opt-icon">
              {typeof selectedOption.icon === 'string' ? (
                selectedOption.icon
              ) : (
                selectedOption.icon
              )}
            </span>
          )}
          <span className="trigger-label">{selectedOption?.label || label}</span>
        </div>

        <div className="trigger-trailing">
          {isSelectedActive && <span className="active-dot" />}
          <div className={`trigger-chevron ${isOpen ? 'rotate' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          className={`custom-select-menu ${isMobile ? 'is-mobile-menu' : ''}`}
          role="listbox"
          style={{ minWidth: isMobile ? '100%' : minMenuWidth }}
        >
          <div className="menu-header">
            <span className="menu-header-title">{label}</span>
            <span className="menu-header-count">{options.length} options</span>
          </div>

          <div className="menu-options-scroll">
            {groupedOptions ? (
              Object.entries(groupedOptions).map(([groupName, groupOpts]) => (
                <div key={groupName} className="menu-group">
                  <div className="menu-group-heading">{groupName}</div>
                  {groupOpts.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        className={`menu-option-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => {
                          onChange(opt.value);
                          onClose();
                        }}
                      >
                        <div className="opt-left">
                          {opt.icon && (
                            <span className="opt-icon-badge">{opt.icon}</span>
                          )}
                          <div className="opt-text-wrap">
                            <span className="opt-title">{opt.label}</span>
                            {opt.subtitle && (
                              <span className="opt-subtitle">{opt.subtitle}</span>
                            )}
                          </div>
                        </div>

                        <div className="opt-right">
                          {opt.badge && (
                            <span
                              className="opt-badge"
                              style={{
                                background: opt.badgeColor || 'rgba(79, 70, 229, 0.1)',
                                color: opt.badgeTextColor || '#4f46e5',
                              }}
                            >
                              {opt.badge}
                            </span>
                          )}
                          {isSelected && (
                            <span className="opt-check">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`menu-option-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      onChange(opt.value);
                      onClose();
                    }}
                  >
                    <div className="opt-left">
                      {opt.icon && (
                        <span className="opt-icon-badge">{opt.icon}</span>
                      )}
                      <div className="opt-text-wrap">
                        <span className="opt-title">{opt.label}</span>
                        {opt.subtitle && (
                          <span className="opt-subtitle">{opt.subtitle}</span>
                        )}
                      </div>
                    </div>

                    <div className="opt-right">
                      {opt.badge && (
                        <span
                          className="opt-badge"
                          style={{
                            background: opt.badgeColor || 'rgba(79, 70, 229, 0.1)',
                            color: opt.badgeTextColor || '#4f46e5',
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="opt-check">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-select-root {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-col-label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
          user-select: none;
        }

        /* Trigger Button */
        .custom-select-trigger {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          text-align: left;
        }

        .custom-select-trigger:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .custom-select-trigger.is-open {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          background: #ffffff;
        }

        .custom-select-trigger.has-active-value {
          border-color: #818cf8;
          background: #faf5ff;
        }

        .custom-select-trigger.is-accent {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .trigger-content {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
          padding-right: 6px;
        }

        .trigger-opt-icon {
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .trigger-label {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trigger-trailing {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .trigger-chevron {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .trigger-chevron.rotate {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        /* Dropdown Floating Menu */
        .custom-select-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.05);
          z-index: 300;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: menuSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .custom-select-menu.is-mobile-menu {
          position: relative !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          margin-top: 6px !important;
          border-radius: 14px !important;
          border: 1.5px solid rgba(99, 102, 241, 0.25) !important;
          box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08) !important;
          z-index: 10 !important;
        }

        .custom-select-menu.is-mobile-menu .menu-options-scroll {
          max-height: 290px !important;
          padding: 6px !important;
          gap: 4px !important;
        }

        .custom-select-menu.is-mobile-menu .menu-option-item {
          padding: 9px 11px !important;
          border-radius: 10px !important;
        }

        .custom-select-menu.is-mobile-menu .opt-left {
          align-items: flex-start !important;
          gap: 10px !important;
        }

        .custom-select-menu.is-mobile-menu .opt-icon-badge {
          margin-top: 2px !important;
        }

        .custom-select-menu.is-mobile-menu .opt-title {
          font-size: 13px !important;
          white-space: normal !important;
          line-height: 1.3 !important;
        }

        .custom-select-menu.is-mobile-menu .opt-subtitle {
          font-size: 11px !important;
          white-space: normal !important;
          line-height: 1.38 !important;
          margin-top: 2px !important;
        }

        .custom-select-menu.is-mobile-menu .opt-right {
          align-self: flex-start !important;
          padding-top: 3px !important;
        }

        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .menu-header-title {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .menu-header-count {
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .menu-options-scroll {
          max-height: 320px;
          overflow-y: auto;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .menu-group {
          margin-bottom: 6px;
        }

        .menu-group-heading {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #6366f1;
          letter-spacing: 0.06em;
          padding: 8px 10px 4px 10px;
        }

        .menu-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .menu-option-item:hover {
          background: #f8fafc;
        }

        .menu-option-item.is-selected {
          background: #eef2ff;
        }

        .opt-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          padding-right: 8px;
        }

        .opt-icon-badge {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .menu-option-item.is-selected .opt-icon-badge {
          background: #e0e7ff;
        }

        .opt-text-wrap {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .opt-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-option-item.is-selected .opt-title {
          color: #4338ca;
          font-weight: 700;
        }

        .opt-subtitle {
          font-size: 10.5px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .opt-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .opt-badge {
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .opt-check {
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
