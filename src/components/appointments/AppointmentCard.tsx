'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';
import { formatAppointmentDate, getTimeUntil } from '@/data/mockAppointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onView: (appointment: Appointment) => void;
  onJoin?: (appointment: Appointment) => void;
}

const STATUS_CONFIG = {
  today: { label: "Aujourd'hui", color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', dot: '#7c3aed' },
  upcoming: { label: 'À venir', color: '#4f46e5', bg: 'rgba(79,70,229,0.09)', dot: '#4f46e5' },
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.1)', dot: '#d97706' },
  completed: { label: 'Terminé', color: '#059669', bg: 'rgba(5,150,105,0.1)', dot: '#059669' },
  cancelled: { label: 'Annulé', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', dot: '#dc2626' },
};

const MODE_ICONS: Record<string, React.ReactNode> = {
  visio: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  presentiel: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  domicile: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

const MODE_LABELS: Record<string, string> = {
  visio: 'Visio',
  presentiel: 'Présentiel',
  domicile: 'À domicile',
};

const TYPE_LABELS: Record<string, string> = {
  cours: 'Cours',
  formation: 'Formation',
  rdv: 'Rendez-vous',
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment: a,
  onView,
  onJoin,
}) => {
  const status = STATUS_CONFIG[a.status];
  const timeUntil = getTimeUntil(a.date, a.startTime);
  const isToday = a.status === 'today';
  const canJoin = a.status === 'today' && a.mode === 'visio' && a.visioAvailable;
  const dateLabel = formatAppointmentDate(a.date);

  return (
    <article className={`appt-card ${a.status === 'cancelled' ? 'is-cancelled' : ''}`}>
      {/* Bande latérale de statut */}
      <div className="appt-card-stripe" style={{ background: status.dot }} />

      <div className="appt-card-body">
        {/* Header : date + statut */}
        <div className="appt-card-header">
          <div className="appt-date-block">
            <span className="appt-date-label">{dateLabel}</span>
            <span className="appt-time">
              {a.startTime} – {a.endTime}
              <span className="appt-duration">· {formatDuration(a.durationMinutes)}</span>
            </span>
          </div>

          <div className="appt-status-area">
            {timeUntil && (
              <span className="appt-countdown">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {timeUntil}
              </span>
            )}
            <span className="appt-status-badge" style={{ color: status.color, background: status.bg }}>
              <span className="status-dot" style={{ background: status.dot }} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Professeur + matière */}
        <div className="appt-prof-row">
          <div className="appt-avatar">
            {a.professorAvatar ? (
              <img src={a.professorAvatar} alt={a.professorName} onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.setAttribute('style', 'display:flex');
              }} />
            ) : null}
            <div className="appt-avatar-fallback" style={a.professorAvatar ? { display: 'none' } : undefined}>
              {getInitials(a.professorName)}
            </div>
          </div>
          <div className="appt-prof-info">
            <div className="appt-prof-name-row">
              <span className="appt-prof-name">{a.professorName}</span>
              {a.professorVerified && (
                <span className="appt-verified-badge" title="Enseignant vérifié">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#4f46e5" stroke="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Vérifié
                </span>
              )}
            </div>
            <span className="appt-subject">{a.subject}</span>
          </div>
        </div>

        {/* Méta : mode + type + prix */}
        <div className="appt-meta-row">
          <span className="appt-mode-chip">
            {MODE_ICONS[a.mode]}
            {MODE_LABELS[a.mode]}
          </span>
          <span className="appt-type-chip">{TYPE_LABELS[a.type]}</span>
          <span className="appt-price">
            {a.totalPrice.toLocaleString('fr-FR')} {a.currency}
            {!a.isPaid && a.status !== 'cancelled' && (
              <span className="appt-unpaid-tag">· Non payé</span>
            )}
          </span>
        </div>

        {/* Indicateur avis disponible */}
        {a.canReview && (
          <div className="appt-review-prompt">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Laisser un avis pour cette séance
          </div>
        )}

        {/* Actions */}
        <div className="appt-card-actions">
          <button
            type="button"
            className="appt-btn-secondary"
            onClick={() => onView(a)}
          >
            Voir les détails
          </button>

          {canJoin && (
            <button
              type="button"
              className="appt-btn-primary appt-btn-join"
              onClick={() => onJoin?.(a)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Rejoindre la visio
            </button>
          )}

          {a.status === 'upcoming' && a.mode === 'visio' && !a.visioAvailable && (
            <span className="appt-visio-soon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Lien visio disponible le jour J
            </span>
          )}

          {a.canReview && (
            <button type="button" className="appt-btn-review">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Laisser un avis
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .appt-card {
          display: flex;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 2px 16px rgba(15, 23, 42, 0.05);
          overflow: hidden;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .appt-card:hover {
          box-shadow: 0 6px 32px rgba(79, 70, 229, 0.1);
          transform: translateY(-1px);
        }

        .appt-card.is-cancelled {
          opacity: 0.72;
        }

        .appt-card-stripe {
          width: 4px;
          flex-shrink: 0;
        }

        .appt-card-body {
          flex: 1;
          padding: 18px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .appt-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .appt-date-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .appt-date-label {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          text-transform: capitalize;
        }

        .appt-time {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .appt-duration {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0;
        }

        .appt-status-area {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }

        .appt-countdown {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 700;
          color: #7c3aed;
          background: rgba(124, 58, 237, 0.08);
          padding: 3px 8px;
          border-radius: 999px;
          animation: pulse-countdown 2s ease-in-out infinite;
        }

        @keyframes pulse-countdown {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .appt-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .appt-prof-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .appt-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
        }

        .appt-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .appt-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #4f46e5;
        }

        .appt-prof-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .appt-prof-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .appt-prof-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .appt-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          padding: 2px 6px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .appt-subject {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .appt-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .appt-mode-chip,
        .appt-type-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: #f8fafc;
          color: #475569;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .appt-price {
          margin-left: auto;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .appt-unpaid-tag {
          color: #d97706;
          font-weight: 600;
          font-size: 12px;
        }

        .appt-review-prompt {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #d97706;
          background: rgba(245, 158, 11, 0.08);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .appt-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 4px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .appt-btn-primary,
        .appt-btn-secondary,
        .appt-btn-review {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .appt-btn-secondary {
          background: #f8fafc;
          color: #334155;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .appt-btn-secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .appt-btn-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        .appt-btn-primary:hover {
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.45);
          transform: translateY(-1px);
        }

        .appt-btn-join {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
        }

        .appt-btn-review {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .appt-btn-review:hover {
          background: rgba(245, 158, 11, 0.18);
        }

        .appt-visio-soon {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 500;
          font-style: italic;
          margin-left: auto;
        }

        @media (max-width: 480px) {
          .appt-card-body {
            padding: 14px 14px 12px;
            gap: 10px;
          }

          .appt-time {
            font-size: 18px;
          }

          .appt-price {
            margin-left: 0;
          }

          .appt-visio-soon {
            margin-left: 0;
            order: 99;
          }
        }
      `}</style>
    </article>
  );
};
