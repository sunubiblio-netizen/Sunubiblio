'use client';

import React from 'react';
import { EducationLevelCard } from '@/types/education';

interface LevelDetailModalProps {
  level: EducationLevelCard | null;
  onClose: () => void;
  onFilterLevel: (levelId: EducationLevelCard['id']) => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  level,
  onClose,
  onFilterLevel,
}) => {
  if (!level) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-left">
            <div
              className="level-icon-wrap"
              style={{ background: level.iconBg, color: level.iconColor }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <div className="badge-row">
                <span className="level-badge" style={{ color: level.iconColor, background: level.iconBg }}>
                  {level.badge}
                </span>
                <span className="curriculum-badge">Programme Sénégal</span>
              </div>
              <h3 className="modal-title">{level.title}</h3>
              <p className="modal-sub">{level.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="info-block">
            <h4 className="block-title">Présentation du cycle</h4>
            <p className="block-text">{level.description}</p>
          </div>

          <div className="info-block">
            <h4 className="block-title">Classes & niveaux couverts</h4>
            <div className="grades-list">
              {level.grades.map((grade) => (
                <div key={grade} className="grade-tag">
                  <span className="grade-check">✓</span>
                  <span>{grade}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="preparation-note">
            <div className="note-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="note-text">
              <strong>Bibliothèque en enrichissement continu</strong>
              <span>
                Les fascicules, cours structurés et annales pour ce cycle sont
                progressivement indexés par les enseignants et éditeurs partenaires de
                Sunubiblio.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onFilterLevel(level.id);
              onClose();
            }}
          >
            <span>Voir les ressources {level.title}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-card {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          padding: 24px 28px 18px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .level-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .level-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .curriculum-badge {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
          letter-spacing: -0.02em;
        }

        .modal-sub {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        .close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.15s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .modal-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .block-title {
          font-size: 12.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin: 0;
        }

        .block-text {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .grades-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .grade-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .grade-check {
          color: #10b981;
          font-weight: 800;
          font-size: 12px;
        }

        .preparation-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          background: #f5f3ff;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 14px;
        }

        .note-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .note-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 12.5px;
          line-height: 1.45;
          color: #4338ca;
        }

        .modal-footer {
          padding: 16px 28px 24px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .modal-card {
            border-radius: 20px 20px 0 0;
            position: fixed;
            bottom: 0;
            max-height: 85vh;
            overflow-y: auto;
          }

          .modal-header {
            padding: 18px 20px 14px;
          }

          .modal-body {
            padding: 18px 20px;
          }

          .modal-footer {
            padding: 14px 20px 20px;
            flex-direction: column-reverse;
            gap: 10px;
          }

          .modal-footer button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
