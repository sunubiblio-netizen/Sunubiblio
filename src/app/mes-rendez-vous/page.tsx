'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentDetail } from '@/components/appointments/AppointmentDetail';
import { AppointmentStatsBar } from '@/components/appointments/AppointmentStatsBar';
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters';
import { AppointmentEmptyState } from '@/components/appointments/AppointmentEmptyState';
import {
  MOCK_APPOINTMENTS,
  computeAppointmentStats,
  filterAppointments,
} from '@/data/mockAppointments';
import { Appointment, AppointmentFilterState, AppointmentStatus } from '@/types/appointment';

const INITIAL_FILTERS: AppointmentFilterState = {
  searchQuery: '',
  status: 'all',
  mode: 'all',
  period: 'all',
  type: 'all',
};

// Ordre d'affichage des statuts
const STATUS_ORDER: AppointmentStatus[] = [
  'today',
  'upcoming',
  'pending',
  'completed',
  'cancelled',
];

function sortAppointments(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => {
    const ai = STATUS_ORDER.indexOf(a.status);
    const bi = STATUS_ORDER.indexOf(b.status);
    if (ai !== bi) return ai - bi;
    // À date égale de statut, trier par date/heure
    const aDateTime = `${a.date}T${a.startTime}`;
    const bDateTime = `${b.date}T${b.startTime}`;
    return aDateTime.localeCompare(bDateTime);
  });
}

export default function MesRendezVousPage() {
  const [filters, setFilters] = useState<AppointmentFilterState>(INITIAL_FILTERS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleFilterChange = useCallback((newFilters: Partial<AppointmentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Statistiques calculées sur les vraies données
  const stats = useMemo(() => computeAppointmentStats(MOCK_APPOINTMENTS), []);

  // Filtrage
  const filtered = useMemo(
    () => sortAppointments(filterAppointments(MOCK_APPOINTMENTS, filters)),
    [filters]
  );

  // Filtrage rapide par statut via les stats cards
  const handleFilterByStatus = useCallback(
    (status: string) => {
      setFilters((prev) => ({
        ...prev,
        status: status === 'all' ? 'all' : (status as AppointmentStatus),
      }));
    },
    []
  );

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.mode !== 'all' ||
    filters.period !== 'all' ||
    filters.type !== 'all' ||
    filters.searchQuery.trim() !== '';

  // Rejoindre visio
  const handleJoinVisio = useCallback((appointment: Appointment) => {
    if (appointment.visioLink && appointment.visioAvailable) {
      window.open(appointment.visioLink, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // RDV aujourd'hui (pour la bannière)
  const todayAppointment = useMemo(
    () => MOCK_APPOINTMENTS.find((a) => a.status === 'today') || null,
    []
  );

  return (
    <div className="rdv-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="profil" />

      <main className="rdv-main">
        <div className="container rdv-container">

          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <div className="rdv-page-header">
            <div className="rdv-header-left">
              <div className="rdv-breadcrumb">
                <Link href="/profil" className="breadcrumb-link">Mon profil</Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span>Mes rendez-vous</span>
              </div>
              <h1 className="rdv-page-title">Mes rendez-vous</h1>
              <p className="rdv-page-subtitle">
                Gérez vos cours, séances et rendez-vous avec vos enseignants.
              </p>
            </div>

            <button
              type="button"
              className="rdv-new-btn"
              onClick={() => setShowNewModal(true)}
              id="btn-nouveau-rdv"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouveau rendez-vous
            </button>
          </div>

          {/* ── BANNIÈRE RDV IMMINENT ─────────────────────────────────── */}
          {todayAppointment && todayAppointment.status === 'today' && todayAppointment.visioAvailable && (
            <div className="rdv-urgent-banner">
              <div className="urgent-left">
                <div className="urgent-pulse">
                  <span className="urgent-dot" />
                </div>
                <div className="urgent-text">
                  <strong>Rendez-vous maintenant</strong>
                  <span>
                    {todayAppointment.subject} · {todayAppointment.startTime} – {todayAppointment.endTime} · avec {todayAppointment.professorName.split(' ').slice(-1)[0]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="urgent-join-btn"
                onClick={() => handleJoinVisio(todayAppointment)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Rejoindre la visio
              </button>
            </div>
          )}

          {/* ── STATISTIQUES ─────────────────────────────────────────── */}
          <div className="rdv-stats-section">
            <AppointmentStatsBar
              stats={stats}
              activeFilter={filters.status}
              onFilterByStatus={handleFilterByStatus}
            />
          </div>

          {/* ── FILTRES ──────────────────────────────────────────────── */}
          <div className="rdv-filters-section">
            <AppointmentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={filtered.length}
            />
          </div>

          {/* ── LISTE DES RENDEZ-VOUS ─────────────────────────────────── */}
          <div className="rdv-list-section">
            {filtered.length === 0 ? (
              <AppointmentEmptyState
                hasFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <>
                <div className="rdv-list-meta">
                  <span className="rdv-list-count">
                    {filtered.length} rendez-vous{filtered.length > 1 ? '' : ''}
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="rdv-clear-filters-btn"
                      onClick={handleResetFilters}
                    >
                      Effacer les filtres
                    </button>
                  )}
                </div>

                <div className="rdv-cards-grid">
                  {filtered.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onView={setSelectedAppointment}
                      onJoin={handleJoinVisio}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── CTA TROUVER UN PROFESSEUR ─────────────────────────────── */}
          {MOCK_APPOINTMENTS.length > 0 && (
            <div className="rdv-find-prof-cta">
              <div className="find-prof-text">
                <span>Besoin d'un autre cours ?</span>
                <p>Plus de 50 enseignants vérifiés disponibles</p>
              </div>
              <Link href="/professeurs" className="find-prof-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Trouver un professeur
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── PANNEAU DE DÉTAIL ─────────────────────────────────────────── */}
      <AppointmentDetail
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onJoin={handleJoinVisio}
      />

      {/* ── MODAL NOUVEAU RENDEZ-VOUS ─────────────────────────────────── */}
      {showNewModal && (
        <div className="new-rdv-overlay" onClick={() => setShowNewModal(false)}>
          <div className="new-rdv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="new-rdv-modal-header">
              <h2>Nouveau rendez-vous</h2>
              <button
                type="button"
                className="new-rdv-close"
                onClick={() => setShowNewModal(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="new-rdv-modal-body">
              <div className="new-rdv-step-hint">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3>Choisir un professeur</h3>
                <p>
                  Pour réserver un cours, commencez par trouver un professeur qualifié
                  sur la page Professeurs, puis sélectionnez une disponibilité.
                </p>
                <Link
                  href="/professeurs"
                  className="new-rdv-cta"
                  onClick={() => setShowNewModal(false)}
                >
                  Voir les professeurs disponibles
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .rdv-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .rdv-main {
          flex: 1;
        }

        .rdv-container {
          padding-top: 32px;
          padding-bottom: 100px; /* safe zone au-dessus de la bottom nav */
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── Header ──────────────────────────────────────── */
        .rdv-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .rdv-header-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rdv-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 500;
        }

        .breadcrumb-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .breadcrumb-link:hover {
          color: #4f46e5;
        }

        .rdv-breadcrumb span {
          color: #475569;
          font-weight: 600;
        }

        .rdv-page-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          margin: 0;
        }

        .rdv-page-subtitle {
          font-size: 14.5px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        .rdv-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .rdv-new-btn:hover {
          box-shadow: 0 6px 24px rgba(79, 70, 229, 0.45);
          transform: translateY(-2px);
        }

        /* ── Bannière visio urgente ──────────────────────── */
        .rdv-urgent-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(79, 70, 229, 0.04) 100%);
          border: 1.5px solid rgba(124, 58, 237, 0.25);
          flex-wrap: wrap;
        }

        .urgent-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .urgent-pulse {
          position: relative;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .urgent-dot {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #7c3aed;
          animation: live-pulse 1.8s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(124, 58, 237, 0); }
        }

        .urgent-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .urgent-text strong {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .urgent-text span {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 500;
        }

        .urgent-join-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          background: #7c3aed;
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          box-shadow: 0 3px 10px rgba(124, 58, 237, 0.35);
          transition: all 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .urgent-join-btn:hover {
          background: #6d28d9;
          transform: translateY(-1px);
        }

        /* ── Sections ──────────────────────────────────────── */
        .rdv-stats-section,
        .rdv-filters-section,
        .rdv-list-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Liste ──────────────────────────────────────────── */
        .rdv-list-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .rdv-list-count {
          font-size: 13.5px;
          font-weight: 700;
          color: #475569;
        }

        .rdv-clear-filters-btn {
          font-size: 12.5px;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .rdv-clear-filters-btn:hover {
          color: #4338ca;
        }

        .rdv-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── CTA bas ──────────────────────────────────────────── */
        .rdv-find-prof-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 24px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
        }

        .find-prof-text span {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          display: block;
        }

        .find-prof-text p {
          font-size: 12.5px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .find-prof-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid rgba(79, 70, 229, 0.2);
          transition: all 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .find-prof-link:hover {
          background: rgba(79, 70, 229, 0.14);
          transform: translateY(-1px);
        }

        /* ── Modal nouveau RDV ──────────────────────────────── */
        .new-rdv-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .new-rdv-modal {
          background: #ffffff;
          border-radius: 20px;
          width: min(480px, 100%);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
          overflow: hidden;
          animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }

        .new-rdv-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 18px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        }

        .new-rdv-modal-header h2 {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .new-rdv-close {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .new-rdv-close:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .new-rdv-modal-body {
          padding: 28px 24px 32px;
        }

        .new-rdv-step-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .new-rdv-step-hint h3 {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .new-rdv-step-hint p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          max-width: 320px;
        }

        .new-rdv-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .new-rdv-cta:hover {
          box-shadow: 0 6px 24px rgba(79, 70, 229, 0.45);
          transform: translateY(-2px);
        }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 860px) {
          .rdv-container {
            padding-top: 24px;
            padding-bottom: 90px;
            gap: 20px;
          }

          .rdv-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .rdv-new-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .rdv-container {
            padding-top: 16px;
            padding-bottom: 90px;
            gap: 16px;
          }

          .rdv-urgent-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .urgent-join-btn {
            width: 100%;
            justify-content: center;
          }

          .rdv-find-prof-cta {
            flex-direction: column;
            align-items: flex-start;
          }

          .find-prof-link {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 360px) {
          .rdv-page-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
