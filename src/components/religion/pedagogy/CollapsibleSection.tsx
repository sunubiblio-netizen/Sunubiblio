'use client';

import React from 'react';

export interface CollapsibleSectionProps {
  id: string;
  stepNumber: number | string;
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  stepNumber,
  title,
  subtitle,
  badge,
  accentColor = '#4f46e5',
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  const contentId = `collapsible-content-${id}`;
  const headerId = `collapsible-header-${id}`;

  return (
    <section
      id={id}
      className={`collapsible-section-wrapper ${isOpen ? 'is-open' : 'is-closed'} ${className}`}
      aria-labelledby={headerId}
    >
      {/* En-tête cliquable sur toute la largeur */}
      <div className="collapsible-header-card">
        <button
          id={headerId}
          type="button"
          className="collapsible-trigger-btn"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          title={isOpen ? `Replier la section : ${title}` : `Déplier la section : ${title}`}
        >
          <div className="trigger-left-content">
            <div
              className="step-badge"
              style={{
                backgroundColor: accentColor,
              }}
              aria-hidden="true"
            >
              <span>{stepNumber}</span>
            </div>

            <div className="trigger-texts">
              <div className="title-row">
                <h2 className="trigger-title">{title}</h2>
                {badge && <span className="trigger-pill-badge">{badge}</span>}
              </div>
              {subtitle && <p className="trigger-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="trigger-right-actions">
            <span className="toggle-status-badge" aria-hidden="true">
              {isOpen ? 'Replier' : 'Déplier'}
            </span>

            <div className={`chevron-circle ${isOpen ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Contenu déroulant de la section */}
      {isOpen && (
        <div
          id={contentId}
          className="collapsible-body"
          role="region"
          aria-labelledby={headerId}
        >
          {children}
        </div>
      )}

      <style jsx>{`
        .collapsible-section-wrapper {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.85);
          border-radius: 20px;
          margin-bottom: 22px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          scroll-margin-top: 90px;
        }

        .collapsible-section-wrapper:hover {
          border-color: rgba(99, 102, 241, 0.3);
        }

        .collapsible-section-wrapper.is-open {
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 10px 30px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .collapsible-header-card {
          width: 100%;
          background: #ffffff;
          transition: background-color 0.15s ease;
        }

        .collapsible-section-wrapper.is-closed .collapsible-header-card:hover {
          background: #fafaff;
        }

        .collapsible-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 16px;
          outline: none;
          transition: all 0.15s ease;
        }

        .collapsible-trigger-btn:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px #4f46e5;
          background: #fafaff;
        }

        .trigger-left-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .step-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
        }

        .trigger-texts {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .trigger-title {
          font-size: clamp(17px, 2.2vw, 20px);
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .trigger-pill-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 9px;
          border-radius: 9999px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .trigger-subtitle {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .trigger-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .toggle-status-badge {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          background: #f1f5f9;
          padding: 5px 12px;
          border-radius: 9999px;
          transition: all 0.18s ease;
        }

        .collapsible-trigger-btn:hover .toggle-status-badge {
          background: #eef2ff;
          color: #4f46e5;
        }

        .chevron-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .collapsible-trigger-btn:hover .chevron-circle {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        .chevron-circle.is-rotated {
          transform: rotate(180deg);
          background: #eef2ff;
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
        }

        .collapsible-body {
          padding: 6px 24px 28px 24px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
          animation: collapsible-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes collapsible-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .collapsible-section-wrapper {
            border-radius: 16px;
            margin-bottom: 16px;
          }

          .collapsible-trigger-btn {
            padding: 16px;
            gap: 12px;
          }

          .step-badge {
            width: 32px;
            height: 32px;
            font-size: 13.5px;
            border-radius: 9px;
          }

          .toggle-status-badge {
            display: none;
          }

          .trigger-subtitle {
            display: none; /* Sur mobile : titre épuré pour éviter l'encombrement */
          }

          .collapsible-body {
            padding: 4px 16px 20px 16px;
          }
        }
      `}</style>
    </section>
  );
};
