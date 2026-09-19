'use client';

import React from 'react';

interface AgendaHeaderProps {
  onOpenNewModal: () => void;
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = ({ onOpenNewModal }) => {
  return (
    <div className="agenda-header-root">
      <div className="agenda-header-content">
        <div className="agenda-title-group">
          <div className="agenda-badge-subtle">
            <span className="agenda-badge-icon">📅</span>
            <span>Organisation personnelle</span>
          </div>
          <h1 className="agenda-main-title">Agenda</h1>
          <p className="agenda-main-desc">
            Organisez vos rendez-vous, cours et événements.
          </p>
        </div>

        <button
          type="button"
          className="agenda-cta-new-btn"
          onClick={onOpenNewModal}
          aria-label="Créer un nouveau rendez-vous, cours ou événement"
          id="btn-agenda-nouveau"
        >
          <svg
            className="agenda-plus-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="cta-label-desktop">Nouveau</span>
        </button>
      </div>

      <style jsx>{`
        .agenda-header-root {
          padding-bottom: 4px;
        }

        .agenda-header-content {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .agenda-title-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .agenda-badge-subtle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.15);
          padding: 3px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .agenda-badge-icon {
          font-size: 13px;
        }

        .agenda-main-title {
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          margin: 0;
          line-height: 1.15;
        }

        .agenda-main-desc {
          font-size: 14.5px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
          max-width: 520px;
          line-height: 1.45;
        }

        .agenda-cta-new-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.32);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .agenda-cta-new-btn:hover {
          box-shadow: 0 6px 24px rgba(79, 70, 229, 0.44);
          transform: translateY(-1px);
        }

        .agenda-cta-new-btn:active {
          transform: translateY(0);
        }

        .agenda-plus-icon {
          flex-shrink: 0;
        }

        .cta-label-desktop {
          display: inline;
        }

        @media (max-width: 640px) {
          .agenda-header-content {
            align-items: center;
            gap: 12px;
          }

          .agenda-badge-subtle {
            font-size: 11px;
            padding: 2px 8px;
          }

          .agenda-main-title {
            font-size: 24px;
          }

          .agenda-main-desc {
            font-size: 12.5px;
            line-height: 1.35;
          }

          .agenda-cta-new-btn {
            width: 42px;
            height: 42px;
            padding: 0;
            border-radius: 12px;
            flex-shrink: 0;
          }

          .cta-label-desktop {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
