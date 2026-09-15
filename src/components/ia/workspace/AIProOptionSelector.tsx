'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ProOptionItem {
  id: string;
  label?: string;
  title?: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'amber';
  description?: string;
  icon?: React.ReactNode;
}

interface AIProOptionSelectorProps {
  label: string;
  helperText?: string;
  description?: string;
  options: ProOptionItem[];
  value: string;
  onChange: (val: string) => void;
  layout?: 'cards' | 'dropdown' | 'list';
  columns?: 2 | 3;
}

export const AIProOptionSelector: React.FC<AIProOptionSelectorProps> = ({
  label,
  helperText,
  description,
  options,
  value,
  onChange,
  layout = 'cards',
  columns = 3,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const effectiveHelper = description || helperText;
  const selectedOption = options.find((opt) => opt.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="pro-option-selector-root">
      <div className="selector-header">
        <div className="label-col">
          <label className="selector-label">{label}</label>
          {effectiveHelper && <span className="selector-helper">{effectiveHelper}</span>}
        </div>
      </div>

      {layout === 'list' ? (
        /* Layout en Liste Horizontale Pro (Ampleur maximale, zero tronquage, lisibilité absolue) */
        <div className="options-list-stack">
          {options.map((opt) => {
            const isSelected = opt.id === value;
            const optTitle = opt.title || opt.label || '';
            return (
              <div
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`pro-card-horizontal ${isSelected ? 'active' : ''}`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(opt.id);
                  }
                }}
              >
                <div className="card-h-main">
                  {opt.icon && <div className="opt-icon-wrap">{opt.icon}</div>}
                  <div className="card-h-info">
                    <div className="title-and-badge">
                      <span className="opt-label">{optTitle}</span>
                      {opt.badge && (
                        <span className={`opt-badge ${opt.badgeColor || 'primary'}`}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.description && <p className="opt-desc">{opt.description}</p>}
                  </div>
                </div>

                <div className="card-h-action">
                  <div className="radio-circle">
                    {isSelected && <div className="radio-dot" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : layout === 'cards' ? (
        /* Layout en Cartes interactives Modernes & Pro */
        <div className={`options-cards-grid cols-${columns}`}>
          {options.map((opt) => {
            const isSelected = opt.id === value;
            const optTitle = opt.title || opt.label || '';
            return (
              <div
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`pro-card-option ${isSelected ? 'active' : ''}`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(opt.id);
                  }
                }}
              >
                <div className="card-top-line">
                  <div className="icon-and-title">
                    {opt.icon && <div className="opt-icon-wrap">{opt.icon}</div>}
                    <span className="opt-label">{optTitle}</span>
                  </div>

                  {opt.badge && (
                    <span className={`opt-badge ${opt.badgeColor || 'primary'}`}>
                      {opt.badge}
                    </span>
                  )}
                </div>

                {opt.description && <p className="opt-desc">{opt.description}</p>}

                <div className="card-selection-indicator">
                  <div className="radio-circle">
                    {isSelected && <div className="radio-dot" />}
                  </div>
                  <span className="select-text">{isSelected ? 'Sélectionné' : 'Choisir ce niveau'}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Layout Dropdown Popover Custom (Design Pro, jamais de <select> natif brut) */
        <div className="pro-custom-dropdown" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`dropdown-trigger-btn ${isDropdownOpen ? 'open' : ''}`}
            aria-expanded={isDropdownOpen}
          >
            <div className="selected-preview">
              {selectedOption.icon && (
                <div className="selected-icon-wrap">{selectedOption.icon}</div>
              )}
              <div className="selected-text-block">
                <div className="title-row">
                  <span className="selected-label">{selectedOption.title || selectedOption.label}</span>
                  {selectedOption.badge && (
                    <span className={`opt-badge-mini ${selectedOption.badgeColor || 'primary'}`}>
                      {selectedOption.badge}
                    </span>
                  )}
                </div>
                {selectedOption.description && (
                  <span className="selected-sub">{selectedOption.description}</span>
                )}
              </div>
            </div>

            <div className="chevron-wrap">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-popover-menu" role="listbox">
              {options.map((opt) => {
                const isSelected = opt.id === value;
                const optTitle = opt.title || opt.label || '';
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`dropdown-item-row ${isSelected ? 'active-item' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {opt.icon && <div className="dropdown-opt-icon">{opt.icon}</div>}
                    <div className="dropdown-opt-text">
                      <div className="title-row">
                        <span className="item-label">{optTitle}</span>
                        {opt.badge && (
                          <span className={`opt-badge-mini ${opt.badgeColor || 'primary'}`}>
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.description && <span className="item-desc">{opt.description}</span>}
                    </div>

                    {isSelected && (
                      <div className="item-checkmark">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .pro-option-selector-root {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .selector-label {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .selector-helper {
          font-size: 12.5px;
          color: #64748b;
          margin-left: 8px;
        }

        /* --- Liste Horizontale Pro (layout="list") --- */
        .options-list-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .pro-card-horizontal {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }

        .pro-card-horizontal:hover {
          border-color: #6366f1;
          background: #fbfbfe;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.1);
        }

        .pro-card-horizontal.active {
          border-color: #4f46e5;
          background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12), 0 6px 18px -3px rgba(79, 70, 229, 0.1);
        }

        .card-h-main {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }

        .pro-card-horizontal .opt-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .pro-card-horizontal.active .opt-icon-wrap {
          background: #4f46e5;
          color: #ffffff;
        }

        .card-h-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
        }

        .title-and-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .card-h-info .opt-label {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }

        .card-h-info .opt-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        .card-h-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        /* --- Cartes Interactives Modernes (layout="cards") --- */
        .options-cards-grid {
          display: grid;
          gap: 14px;
          width: 100%;
        }

        .options-cards-grid.cols-2 {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .options-cards-grid.cols-3 {
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .pro-card-option {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          user-select: none;
          min-width: 0;
        }

        .pro-card-option:hover {
          border-color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.12);
          background: #fbfbfe;
        }

        .pro-card-option.active {
          border-color: #4f46e5;
          background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15), 0 10px 24px -4px rgba(79, 70, 229, 0.14);
        }

        .card-top-line {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .icon-and-title {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .opt-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .pro-card-option.active .opt-icon-wrap {
          background: #4f46e5;
          color: #ffffff;
        }

        .opt-label {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }

        .opt-badge {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 8px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .opt-badge.primary {
          background: rgba(99, 102, 241, 0.12);
          color: #4f46e5;
        }

        .opt-badge.success {
          background: #dcfce7;
          color: #166534;
        }

        .opt-badge.amber {
          background: #fef3c7;
          color: #92400e;
        }

        .opt-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 14px 0;
          flex-grow: 1;
        }

        .card-selection-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .pro-card-option.active .radio-circle {
          border-color: #4f46e5;
          background: #4f46e5;
        }

        .radio-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
        }

        .select-text {
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
        }

        .pro-card-option.active .select-text {
          color: #4f46e5;
        }

        /* --- Custom Dropdown Popover --- */
        .pro-custom-dropdown {
          position: relative;
          width: 100%;
        }

        .dropdown-trigger-btn {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .dropdown-trigger-btn:hover,
        .dropdown-trigger-btn.open {
          border-color: #6366f1;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
        }

        .selected-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .selected-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .selected-text-block {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .selected-label {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .opt-badge-mini {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.12);
          color: #4f46e5;
        }

        .selected-sub {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chevron-icon {
          color: #818cf8;
          transition: transform 0.2s ease;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .dropdown-popover-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          padding: 8px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.14);
          z-index: 100;
          animation: popoverFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropdown-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dropdown-item-row:hover {
          background: #f8faff;
        }

        .dropdown-item-row.active-item {
          background: rgba(99, 102, 241, 0.08);
        }

        .dropdown-opt-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dropdown-opt-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .item-label {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .item-desc {
          font-size: 12px;
          color: #64748b;
        }

        .item-checkmark {
          color: #4f46e5;
          display: flex;
          align-items: center;
          padding-left: 8px;
        }

        @media (max-width: 800px) {
          .options-cards-grid.cols-3,
          .options-cards-grid.cols-2 {
            grid-template-columns: 1fr;
          }
        }

        @keyframes popoverFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
