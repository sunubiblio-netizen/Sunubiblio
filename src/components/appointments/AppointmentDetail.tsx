'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Appointment } from '@/types/appointment';
import { formatAppointmentDate } from '@/data/mockAppointments';

interface AppointmentDetailProps {
  appointment: Appointment | null;
  onClose: () => void;
  onJoin?: (appointment: Appointment) => void;
}

const STATUS_CONFIG = {
  today: { label: "Aujourd'hui", color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  upcoming: { label: 'À venir', color: '#4f46e5', bg: 'rgba(79,70,229,0.09)' },
  pending: { label: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  completed: { label: 'Terminé', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  cancelled: { label: 'Annulé', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
};

const MODE_LABELS: Record<string, string> = {
  visio: '🖥 Visio en direct',
  presentiel: '📍 Présentiel',
  domicile: '🏠 À domicile',
};

const TYPE_LABELS: Record<string, string> = {
  cours: 'Cours particulier',
  formation: 'Formation',
  rdv: 'Rendez-vous conseil',
};

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  appointment,
  onClose,
  onJoin,
}) => {
  const isOpen = appointment !== null;

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!appointment) return null;

  const a = appointment;
  const status = STATUS_CONFIG[a.status];
  const canJoin = (a.status === 'today') && a.mode === 'visio' && a.visioAvailable;

  return (
    <>
      {/* Overlay */}
      <div className="detail-overlay" onClick={onClose} aria-hidden="true" />

      {/* Panneau latéral */}
      <aside className="detail-panel" role="dialog" aria-label="Détail du rendez-vous" aria-modal="true">
        {/* En-tête du panneau */}
        <div className="detail-panel-header">
          <div className="detail-header-title">
            <span className="detail-header-label">Rendez-vous</span>
            <span
              className="detail-status-badge"
              style={{ color: status.color, background: status.bg }}
            >
              {status.label}
            </span>
          </div>
          <button type="button" className="detail-close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps du panneau */}
        <div className="detail-panel-body">
          {/* Section : Professeur */}
          <div className="detail-section detail-prof-section">
            <div className="detail-prof-avatar">
              {a.professorAvatar ? (
                <img
                  src={a.professorAvatar}
                  alt={a.professorName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.setAttribute('style', 'display:flex');
                  }}
                />
              ) : null}
              <div
                className="detail-avatar-fallback"
                style={a.professorAvatar ? { display: 'none' } : undefined}
              >
                {getInitials(a.professorName)}
              </div>
            </div>
            <div className="detail-prof-info">
              <div className="detail-prof-name-row">
                <h2 className="detail-prof-name">{a.professorName}</h2>
                {a.professorVerified && (
                  <span className="detail-verified">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#4f46e5" stroke="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Enseignant vérifié
                  </span>
                )}
              </div>
              <div className="detail-prof-rating">
                {'★'.repeat(Math.round(a.professorRating))}
                {'☆'.repeat(5 - Math.round(a.professorRating))}
                <span>{a.professorRating.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Section : Infos séance */}
          <div className="detail-section">
            <h3 className="detail-section-title">Détails de la séance</h3>
            <div className="detail-info-grid">
              <div className="detail-info-row">
                <span className="detail-info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </span>
                <div>
                  <span className="detail-info-label">Matière</span>
                  <span className="detail-info-value">{a.subject}</span>
                </div>
              </div>

              <div className="detail-info-row">
                <span className="detail-info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <div>
                  <span className="detail-info-label">Type</span>
                  <span className="detail-info-value">{TYPE_LABELS[a.type]}</span>
                </div>
              </div>

              <div className="detail-info-row">
                <span className="detail-info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <div>
                  <span className="detail-info-label">Date</span>
                  <span className="detail-info-value">{formatAppointmentDate(a.date)}</span>
                </div>
              </div>

              <div className="detail-info-row">
                <span className="detail-info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div>
                  <span className="detail-info-label">Horaire</span>
                  <span className="detail-info-value">{a.startTime} – {a.endTime} ({formatDuration(a.durationMinutes)})</span>
                </div>
              </div>

              <div className="detail-info-row">
                <span className="detail-info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </span>
                <div>
                  <span className="detail-info-label">Mode</span>
                  <span className="detail-info-value">{MODE_LABELS[a.mode]}</span>
                </div>
              </div>

              {a.location && (
                <div className="detail-info-row">
                  <span className="detail-info-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <span className="detail-info-label">Lieu</span>
                    <span className="detail-info-value">{a.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section : Description */}
          {a.description && (
            <div className="detail-section">
              <h3 className="detail-section-title">Programme de la séance</h3>
              <p className="detail-description">{a.description}</p>
            </div>
          )}

          {/* Section : Tarification */}
          <div className="detail-section">
            <h3 className="detail-section-title">Tarification</h3>
            <div className="detail-price-card">
              <div className="detail-price-row">
                <span>Tarif horaire</span>
                <span>{a.pricePerHour.toLocaleString('fr-FR')} {a.currency}/h</span>
              </div>
              <div className="detail-price-row">
                <span>Durée</span>
                <span>{formatDuration(a.durationMinutes)}</span>
              </div>
              <div className="detail-price-row detail-price-total">
                <span>Total</span>
                <span className="total-amount">{a.totalPrice.toLocaleString('fr-FR')} {a.currency}</span>
              </div>
              <div className="detail-payment-status">
                {a.isPaid ? (
                  <span className="paid-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Paiement reçu
                  </span>
                ) : a.status !== 'cancelled' ? (
                  <span className="unpaid-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Paiement en attente
                  </span>
                ) : (
                  <span className="cancelled-tag">Réservation annulée</span>
                )}
              </div>
            </div>
          </div>

          {/* Section : Visio */}
          {a.mode === 'visio' && (
            <div className="detail-section">
              <h3 className="detail-section-title">Lien de visioconférence</h3>
              {canJoin ? (
                <div className="detail-visio-card detail-visio-active">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <div>
                    <p className="visio-active-label">Session ouverte</p>
                    <p className="visio-active-sub">Votre professeur vous attend.</p>
                  </div>
                </div>
              ) : a.status === 'upcoming' ? (
                <div className="detail-visio-card detail-visio-pending">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <p>Le lien visio sera disponible le jour du rendez-vous.</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Notes personnelles */}
          {a.notes && (
            <div className="detail-section">
              <h3 className="detail-section-title">Vos notes personnelles</h3>
              <div className="detail-notes-card">{a.notes}</div>
            </div>
          )}

          {/* Méta de réservation */}
          <div className="detail-booking-meta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Réservé le {new Date(a.bookedAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
            {a.updatedAt && ` · Modifié le ${new Date(a.updatedAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}`}
          </div>
        </div>

        {/* Pied de panneau : Actions */}
        <div className="detail-panel-footer">
          {canJoin && (
            <button
              type="button"
              className="detail-action-btn detail-action-primary"
              onClick={() => onJoin?.(a)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Rejoindre la visio
            </button>
          )}

          {a.canReview && (
            <button type="button" className="detail-action-btn detail-action-review">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Laisser un avis
            </button>
          )}

          {a.canCancel && (
            <button type="button" className="detail-action-btn detail-action-danger">
              Annuler le rendez-vous
            </button>
          )}

          {a.status === 'cancelled' && (
            <Link href="/professeurs" className="detail-action-btn detail-action-secondary">
              Réserver à nouveau
            </Link>
          )}

          <button type="button" className="detail-action-btn detail-action-ghost" onClick={onClose}>
            Fermer
          </button>
        </div>
      </aside>

      <style jsx>{`
        .detail-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .detail-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(480px, 100vw);
          background: #ffffff;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 40px rgba(15, 23, 42, 0.15);
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .detail-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 18px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          flex-shrink: 0;
          background: linear-gradient(to bottom, #fafbff, #ffffff);
        }

        .detail-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-header-label {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .detail-status-badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .detail-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .detail-close-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .detail-panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        /* Professeur */
        .detail-prof-section {
          flex-direction: row !important;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(238, 242, 255, 0.6), rgba(245, 243, 255, 0.6));
          border-radius: 14px;
          border: 1px solid rgba(99, 102, 241, 0.12);
        }

        .detail-prof-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          border: 2px solid rgba(99, 102, 241, 0.2);
          position: relative;
        }

        .detail-prof-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 700;
          color: #4f46e5;
        }

        .detail-prof-info {
          flex: 1;
          min-width: 0;
        }

        .detail-prof-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }

        .detail-prof-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .detail-verified {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          padding: 2px 7px;
          border-radius: 999px;
        }

        .detail-prof-rating {
          font-size: 13px;
          color: #f59e0b;
          letter-spacing: 0.02em;
        }

        .detail-prof-rating span {
          color: #64748b;
          font-size: 12px;
          margin-left: 4px;
        }

        /* Info grid */
        .detail-info-grid {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
        }

        .detail-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 14px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          background: #ffffff;
          transition: background 0.12s ease;
        }

        .detail-info-row:last-child {
          border-bottom: none;
        }

        .detail-info-row:hover {
          background: #fafbff;
        }

        .detail-info-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(79, 70, 229, 0.07);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .detail-info-row > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-info-label {
          font-size: 10.5px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .detail-info-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        /* Description */
        .detail-description {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          background: #f8fafc;
          border-radius: 12px;
          padding: 14px;
          border: 1px solid rgba(226, 232, 240, 0.7);
        }

        /* Prix */
        .detail-price-card {
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
        }

        .detail-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          font-size: 13.5px;
          color: #475569;
          font-weight: 500;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        }

        .detail-price-total {
          font-weight: 700;
          color: #0f172a;
          background: #f8fafc;
        }

        .total-amount {
          font-size: 16px;
          font-weight: 800;
          color: #4f46e5;
        }

        .detail-payment-status {
          padding: 10px 14px;
        }

        .paid-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: #059669;
          background: rgba(5, 150, 105, 0.08);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .unpaid-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: #d97706;
          background: rgba(217, 119, 6, 0.08);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .cancelled-tag {
          font-size: 12px;
          font-weight: 600;
          color: #dc2626;
        }

        /* Visio */
        .detail-visio-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
        }

        .detail-visio-active {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(99, 102, 241, 0.05));
          border: 1px solid rgba(124, 58, 237, 0.2);
          color: #7c3aed;
        }

        .visio-active-label {
          font-weight: 700;
          color: #7c3aed;
          font-size: 14px;
        }

        .visio-active-sub {
          font-size: 12.5px;
          color: #64748b;
        }

        .detail-visio-pending {
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.8);
          color: #64748b;
        }

        /* Notes */
        .detail-notes-card {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
          background: rgba(245, 243, 255, 0.5);
          border: 1px solid rgba(124, 58, 237, 0.12);
          border-radius: 12px;
          padding: 14px;
          font-style: italic;
        }

        /* Booking meta */
        .detail-booking-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Footer */
        .detail-panel-footer {
          border-top: 1px solid rgba(241, 245, 249, 0.9);
          padding: 16px 24px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
          background: #fafbff;
        }

        .detail-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          text-decoration: none;
          text-align: center;
        }

        .detail-action-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 3px 12px rgba(124, 58, 237, 0.35);
        }

        .detail-action-primary:hover {
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
          transform: translateY(-1px);
        }

        .detail-action-review {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1.5px solid rgba(245, 158, 11, 0.3);
        }

        .detail-action-review:hover {
          background: rgba(245, 158, 11, 0.18);
        }

        .detail-action-danger {
          background: rgba(220, 38, 38, 0.06);
          color: #dc2626;
          border: 1.5px solid rgba(220, 38, 38, 0.2);
        }

        .detail-action-danger:hover {
          background: rgba(220, 38, 38, 0.12);
        }

        .detail-action-secondary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          border: none;
          box-shadow: 0 3px 12px rgba(79, 70, 229, 0.3);
        }

        .detail-action-ghost {
          background: transparent;
          color: #64748b;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
        }

        .detail-action-ghost:hover {
          background: #f8fafc;
          color: #334155;
        }

        @media (max-width: 520px) {
          .detail-panel {
            width: 100vw;
          }

          .detail-panel-header,
          .detail-panel-body,
          .detail-panel-footer {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </>
  );
};
