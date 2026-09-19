'use client';

import React, { useEffect } from 'react';
import { AgendaItem } from '@/types/agenda';
import { formatAgendaDate, formatAgendaDuration, AGENDA_REFERENCE_DATE } from '@/data/mockAgenda';

interface AgendaDetailModalProps {
  item: AgendaItem | null;
  onClose: () => void;
  onJoinVisio: (item: AgendaItem) => void;
  onCancelItem?: (item: AgendaItem) => void;
}

export const AgendaDetailModal: React.FC<AgendaDetailModalProps> = ({
  item,
  onClose,
  onJoinVisio,
  onCancelItem,
}) => {
  // Fermeture par Escape
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  // Bloquer le scroll d'arrière-plan
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  const isCancelled = item.status === 'cancelled';
  const isCompleted = item.status === 'completed';
  const isToday = item.status === 'today' || item.date === AGENDA_REFERENCE_DATE;
  const canJoin = isToday && item.mode === 'visio' && item.visioAvailable && !isCancelled;

  const modeLabel =
    item.mode === 'visio'
      ? '🖥 Visio en direct'
      : item.mode === 'domicile'
      ? '🏠 À domicile'
      : '📍 Présentiel';

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Détail de l'activité"
      >
        {/* Header du modal */}
        <div className="detail-modal-header">
          <div className="detail-tag-row">
            <span className="detail-sticker">{item.sticker || '📅'}</span>
            <span className={`detail-type-badge type-${item.type}`}>
              {item.badgeLabel || item.type}
            </span>
            {isCancelled && <span className="detail-status-pill cancelled">Annulé</span>}
            {isCompleted && <span className="detail-status-pill completed">Terminé</span>}
            {isToday && !isCancelled && !isCompleted && (
              <span className="detail-status-pill today">Aujourd'hui</span>
            )}
          </div>

          <button
            type="button"
            className="detail-close-icon"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Titre & Matière */}
        <div className="detail-title-section">
          <h3 className="detail-heading">{item.title}</h3>
          <span className="detail-subject-sub">{item.subject}</span>
        </div>

        {/* Informations clés condensées */}
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span className="info-label">Date</span>
            <span className="info-val">{formatAgendaDate(item.date)}</span>
          </div>

          <div className="detail-info-item">
            <span className="info-label">Horaire</span>
            <span className="info-val">
              {item.startTime} – {item.endTime} ({formatAgendaDuration(item.durationMinutes)})
            </span>
          </div>

          <div className="detail-info-item">
            <span className="info-label">Modalité</span>
            <span className="info-val">{modeLabel}</span>
          </div>

          {item.location && (
            <div className="detail-info-item">
              <span className="info-label">Lieu</span>
              <span className="info-val">{item.location}</span>
            </div>
          )}

          {item.price && item.price > 0 && (
            <div className="detail-info-item">
              <span className="info-label">Tarif</span>
              <span className="info-val">
                {item.price.toLocaleString('fr-FR')} {item.currency || 'FCFA'}
                {item.isPaid ? ' (Payé)' : ' (En attente)'}
              </span>
            </div>
          )}
        </div>

        {/* Bloc Professeur si présent */}
        {item.professorName && (
          <div className="detail-prof-box">
            <div className="prof-avatar-fallback">
              {item.professorName.slice(0, 2).toUpperCase()}
            </div>
            <div className="prof-meta">
              <span className="prof-label">Intervenant</span>
              <strong className="prof-fullname">{item.professorName}</strong>
              {item.professorVerified && (
                <span className="prof-verified-pill">Enseignant vérifié</span>
              )}
            </div>
          </div>
        )}

        {/* Description / Objectifs */}
        {item.description && (
          <div className="detail-desc-box">
            <span className="desc-heading">Programme & Notes</span>
            <p className="desc-text">{item.description}</p>
          </div>
        )}

        {/* Actions disponibles */}
        <div className="detail-actions-bar">
          {canJoin && (
            <button
              type="button"
              className="btn-detail-join"
              onClick={() => {
                onJoinVisio(item);
                onClose();
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Rejoindre la visio
            </button>
          )}

          {item.canCancel && !isCancelled && !isCompleted && onCancelItem && (
            <button
              type="button"
              className="btn-detail-cancel"
              onClick={() => {
                if (confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
                  onCancelItem(item);
                  onClose();
                }
              }}
            >
              Annuler
            </button>
          )}

          <button
            type="button"
            className="btn-detail-close"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>

      <style jsx>{`
        .detail-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .detail-modal-card {
          background: #ffffff;
          border-radius: 20px;
          width: min(460px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
          animation: pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .detail-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-tag-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .detail-sticker {
          font-size: 18px;
        }

        .detail-type-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
        }

        .detail-status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .detail-status-pill.today {
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
        }

        .detail-status-pill.completed {
          background: rgba(5, 150, 105, 0.1);
          color: #059669;
        }

        .detail-status-pill.cancelled {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .detail-close-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-close-icon:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .detail-title-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-heading {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .detail-subject-sub {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 600;
        }

        .detail-info-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .detail-info-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          gap: 12px;
        }

        .info-label {
          color: #64748b;
          font-weight: 500;
        }

        .info-val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        .detail-prof-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(238, 242, 255, 0.6), rgba(245, 243, 255, 0.6));
          border: 1px solid rgba(99, 102, 241, 0.15);
        }

        .prof-avatar-fallback {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #4f46e5;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
        }

        .prof-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .prof-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .prof-fullname {
          font-size: 14px;
          color: #0f172a;
        }

        .prof-verified-pill {
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
        }

        .detail-desc-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #fafbff;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .desc-heading {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .desc-text {
          font-size: 13px;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        .detail-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .btn-detail-join {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(124, 58, 237, 0.35);
        }

        .btn-detail-cancel {
          padding: 9px 14px;
          border-radius: 10px;
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid rgba(220, 38, 38, 0.2);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-detail-close {
          padding: 9px 16px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .detail-actions-bar {
            flex-direction: column;
          }

          .btn-detail-join,
          .btn-detail-cancel,
          .btn-detail-close {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
