'use client';

import React, { useState, useMemo } from 'react';
import { AgendaItem } from '@/types/agenda';
import { formatAgendaDate, formatAgendaDuration, AGENDA_REFERENCE_DATE } from '@/data/mockAgenda';

interface AgendaAppointmentsViewProps {
  items: AgendaItem[];
  onSelectItem: (item: AgendaItem) => void;
  onJoinVisio: (item: AgendaItem) => void;
  onCancelItem?: (item: AgendaItem) => void;
  onEmptyCTA: () => void;
}

type AppointmentFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';

export const AgendaAppointmentsView: React.FC<AgendaAppointmentsViewProps> = ({
  items,
  onSelectItem,
  onJoinVisio,
  onEmptyCTA,
}) => {
  const [filter, setFilter] = useState<AppointmentFilter>('all');

  // Rendez-vous seulement (exclure événements génériques sans intervenant pour cette vue spécifique)
  const appointmentsOnly = useMemo(() => {
    return items.filter((it) => it.type === 'cours' || it.type === 'rdv' || it.type === 'formation');
  }, [items]);

  const filteredItems = useMemo(() => {
    return appointmentsOnly.filter((it) => {
      if (filter === 'upcoming') {
        return it.status === 'today' || it.status === 'upcoming' || it.status === 'pending';
      }
      if (filter === 'completed') {
        return it.status === 'completed';
      }
      if (filter === 'cancelled') {
        return it.status === 'cancelled';
      }
      return true;
    });
  }, [appointmentsOnly, filter]);

  // Groupement par période
  const grouped = useMemo(() => {
    const today: AgendaItem[] = [];
    const upcoming: AgendaItem[] = [];
    const past: AgendaItem[] = [];

    filteredItems.forEach((it) => {
      if (it.status === 'cancelled') {
        past.push(it);
      } else if (it.status === 'today' || it.date === AGENDA_REFERENCE_DATE) {
        today.push(it);
      } else if (it.status === 'completed' || it.date < AGENDA_REFERENCE_DATE) {
        past.push(it);
      } else {
        upcoming.push(it);
      }
    });

    return { today, upcoming, past };
  }, [filteredItems]);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    today: true,
    upcoming: true,
    past: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isTodayOpen = filter === 'all' ? (openSections.today ?? true) : true;
  const isUpcomingOpen = filter === 'upcoming' ? true : (openSections.upcoming ?? true);
  const isPastOpen = (filter === 'completed' || filter === 'cancelled') ? true : (openSections.past ?? false);

  if (appointmentsOnly.length === 0) {
    return (
      <div className="appt-empty-container">
        <div className="appt-empty-icon">📅</div>
        <h3>Votre agenda est vide</h3>
        <p>Vos prochains cours et rendez-vous apparaîtront ici.</p>
        <button type="button" className="appt-empty-btn" onClick={onEmptyCTA}>
          Trouver un professeur
        </button>
      </div>
    );
  }

  return (
    <div className="agenda-appts-root">
      {/* Barre de filtres rapides */}
      <div className="appt-filter-row">
        <div className="filter-pills-group">
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({appointmentsOnly.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            À venir ({appointmentsOnly.filter((i) => i.status === 'today' || i.status === 'upcoming' || i.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Terminés ({appointmentsOnly.filter((i) => i.status === 'completed').length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Annulés ({appointmentsOnly.filter((i) => i.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="appt-no-results">
          <p>Aucun rendez-vous dans cette catégorie.</p>
          <button type="button" className="filter-reset-link" onClick={() => setFilter('all')}>
            Afficher tous les rendez-vous
          </button>
        </div>
      ) : (
        <div className="appt-sections-stack">
          {/* Section Aujourd'hui */}
          {grouped.today.length > 0 && (
            <div className="appt-group-block">
              <button
                type="button"
                className="group-collapse-btn"
                onClick={() => toggleSection('today')}
                aria-expanded={isTodayOpen}
              >
                <div className="group-left-label">
                  <span className="live-dot" />
                  <h3 className="group-title">Aujourd'hui</h3>
                  <span className="group-count-tag">{grouped.today.length}</span>
                </div>
                <div className="group-right-toggle">
                  <span className="toggle-hint">{isTodayOpen ? 'Masquer' : 'Afficher'}</span>
                  <span className={`toggle-chevron ${isTodayOpen ? 'is-open' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>

              {isTodayOpen && (
                <div className="appt-cards-grid">
                  {grouped.today.map((item) => (
                    <AppointmentCard
                      key={item.id}
                      item={item}
                      onSelect={() => onSelectItem(item)}
                      onJoin={() => onJoinVisio(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Prochainement */}
          {grouped.upcoming.length > 0 && (
            <div className="appt-group-block">
              <button
                type="button"
                className="group-collapse-btn"
                onClick={() => toggleSection('upcoming')}
                aria-expanded={isUpcomingOpen}
              >
                <div className="group-left-label">
                  <span className="upcoming-dot" />
                  <h3 className="group-title">Prochainement</h3>
                  <span className="group-count-tag">{grouped.upcoming.length}</span>
                </div>
                <div className="group-right-toggle">
                  <span className="toggle-hint">{isUpcomingOpen ? 'Masquer' : 'Afficher'}</span>
                  <span className={`toggle-chevron ${isUpcomingOpen ? 'is-open' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>

              {isUpcomingOpen && (
                <div className="appt-cards-grid">
                  {grouped.upcoming.map((item) => (
                    <AppointmentCard
                      key={item.id}
                      item={item}
                      onSelect={() => onSelectItem(item)}
                      onJoin={() => onJoinVisio(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Passés / Terminés / Annulés */}
          {grouped.past.length > 0 && (
            <div className="appt-group-block">
              <button
                type="button"
                className="group-collapse-btn"
                onClick={() => toggleSection('past')}
                aria-expanded={isPastOpen}
              >
                <div className="group-left-label">
                  <span className="past-dot" />
                  <h3 className="group-title">Passés & Historique</h3>
                  <span className="group-count-tag">{grouped.past.length}</span>
                </div>
                <div className="group-right-toggle">
                  <span className="toggle-hint">{isPastOpen ? 'Masquer' : 'Afficher'}</span>
                  <span className={`toggle-chevron ${isPastOpen ? 'is-open' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>

              {isPastOpen && (
                <div className="appt-cards-grid">
                  {grouped.past.map((item) => (
                    <AppointmentCard
                      key={item.id}
                      item={item}
                      onSelect={() => onSelectItem(item)}
                      onJoin={() => onJoinVisio(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .agenda-appts-root {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .appt-filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .appt-filter-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pills-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
        }

        .filter-pill-btn {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .filter-pill-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .filter-pill-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
        }

        .appt-sections-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .appt-group-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .group-collapse-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          padding: 10px 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.02);
          user-select: none;
        }

        .group-collapse-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .group-left-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7c3aed;
          animation: pulse 1.8s infinite;
          flex-shrink: 0;
        }

        .upcoming-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
          flex-shrink: 0;
        }

        .past-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .group-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .group-count-tag {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .group-right-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-hint {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
        }

        .toggle-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          transition: transform 0.22s ease, background 0.18s ease;
        }

        .toggle-chevron.is-open {
          transform: rotate(180deg);
          background: #e0e7ff;
          color: #4338ca;
        }

        .appt-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }

        @media (max-width: 640px) {
          .agenda-appts-root {
            padding-bottom: 40px;
          }

          .appt-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 320px) {
          .appt-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .appt-no-results {
          padding: 40px 20px;
          text-align: center;
          background: #ffffff;
          border-radius: 16px;
          border: 1px dashed rgba(203, 213, 225, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .appt-no-results p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .filter-reset-link {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          text-decoration: underline;
        }

        .appt-empty-container {
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
        }

        .appt-empty-icon {
          font-size: 40px;
          margin-bottom: 4px;
        }

        .appt-empty-container h3 {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .appt-empty-container p {
          font-size: 14.5px;
          color: #64748b;
          margin: 0;
          max-width: 320px;
        }

        .appt-empty-btn {
          margin-top: 8px;
          padding: 11px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
      `}</style>
    </div>
  );
};

const formatShortCardDate = (dateStr: string): string => {
  if (dateStr === AGENDA_REFERENCE_DATE) return "Aujourd'hui";
  const tomorrow = new Date(new Date(AGENDA_REFERENCE_DATE).setDate(new Date(AGENDA_REFERENCE_DATE).getDate() + 1))
    .toISOString()
    .slice(0, 10);
  if (dateStr === tomorrow) return 'Demain';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// Carte individuelle de rendez-vous
interface AppointmentCardProps {
  item: AgendaItem;
  onSelect: () => void;
  onJoin: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ item, onSelect, onJoin }) => {
  const isCancelled = item.status === 'cancelled';
  const isCompleted = item.status === 'completed';
  const isToday = item.status === 'today' || item.date === AGENDA_REFERENCE_DATE;
  const canJoin = isToday && item.mode === 'visio' && item.visioAvailable && !isCancelled;

  const statusBadge = useMemo(() => {
    if (isCancelled) {
      return { text: 'Annulé', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)' };
    }
    if (isCompleted) {
      return { text: 'Terminé', color: '#059669', bg: 'rgba(5, 150, 105, 0.08)' };
    }
    if (item.status === 'pending') {
      return { text: 'En attente', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' };
    }
    if (isToday) {
      return { text: "Aujourd'hui", color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' };
    }
    return { text: 'Confirmé', color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.08)' };
  }, [isCancelled, isCompleted, isToday, item.status]);

  const modeIcon = item.mode === 'visio' ? '🎥' : item.mode === 'domicile' ? '🏠' : '📍';
  const modeLabel = item.mode === 'visio' ? 'Visio' : item.mode === 'domicile' ? 'Domicile' : 'Présentiel';

  return (
    <article
      className={`single-appt-square ${isCancelled ? 'is-cancelled' : ''} ${isToday ? 'is-today' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`${item.subject} à ${item.startTime}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Haut : Heure & Statut spacieux */}
      <div className="square-header">
        <span className="time-val">{item.startTime}</span>
        <span
          className="status-pill"
          style={{ color: statusBadge.color, background: statusBadge.bg }}
        >
          {statusBadge.text}
        </span>
      </div>

      {/* Centre : Titre matière & Intervenant & Mode / Durée */}
      <div className="square-body">
        <div className="subject-line">
          {item.sticker && <span className="subject-sticker">{item.sticker}</span>}
          <h4 className="subject-title" title={item.subject}>
            {item.subject}
          </h4>
        </div>

        {item.professorName && (
          <div className="prof-row" title={`Avec ${item.professorName}`}>
            <span className="prof-avatar-circle">
              {item.professorName.charAt(0)}
            </span>
            <span className="prof-name">{item.professorName}</span>
            {item.professorVerified && (
              <span className="prof-verified" title="Enseignant vérifié">
                ✓
              </span>
            )}
          </div>
        )}

        <div className="meta-row">
          <span className="mode-tag">{modeIcon} {modeLabel}</span>
          <span className="meta-dot">·</span>
          <span className="dur-tag">{formatAgendaDuration(item.durationMinutes)}</span>
          {!isToday && (
            <>
              <span className="meta-dot">·</span>
              <span className="date-tag">{formatShortCardDate(item.date)}</span>
            </>
          )}
        </div>
      </div>

      {/* Bas : Action directe */}
      <div className="square-footer" onClick={(e) => e.stopPropagation()}>
        {canJoin ? (
          <button
            type="button"
            className="btn-join-square"
            onClick={onJoin}
            title="Rejoindre la séance en visio"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span>Rejoindre</span>
          </button>
        ) : item.canReview ? (
          <button
            type="button"
            className="btn-review-square"
            onClick={onSelect}
          >
            ★ Laisser un avis
          </button>
        ) : (
          <button
            type="button"
            className="btn-details-square"
            onClick={onSelect}
          >
            <span>Détails</span>
            <span className="arrow-glyph">›</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .single-appt-square {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 12px 11px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          cursor: pointer;
          min-height: 168px;
          position: relative;
          box-sizing: border-box;
          text-align: left;
        }

        .single-appt-square:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.1);
          border-color: rgba(124, 58, 237, 0.3);
        }

        .single-appt-square.is-today {
          border-color: rgba(124, 58, 237, 0.28);
          background: linear-gradient(145deg, #ffffff 0%, rgba(245, 243, 255, 0.55) 100%);
        }

        .single-appt-square.is-cancelled {
          opacity: 0.65;
          background: #f8fafc;
        }

        /* HEADER */
        .square-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          width: 100%;
        }

        .time-val {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .status-pill {
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          white-space: nowrap;
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }

        /* BODY */
        .square-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 6px 0;
          min-width: 0;
          width: 100%;
        }

        .subject-line {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          min-width: 0;
        }

        .subject-sticker {
          font-size: 13px;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .subject-title {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }

        .prof-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #475569;
          min-width: 0;
          margin-top: 1px;
        }

        .prof-avatar-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 9px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prof-name {
          font-weight: 600;
          color: #334155;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        .prof-verified {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #4f46e5;
          color: #ffffff;
          font-size: 7px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 3.5px;
          font-size: 10px;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mode-tag {
          color: #475569;
        }

        .meta-dot {
          color: #cbd5e1;
          font-size: 10px;
        }

        .dur-tag {
          color: #64748b;
        }

        .date-tag {
          color: #6366f1;
          font-weight: 700;
        }

        /* FOOTER */
        .square-footer {
          margin-top: auto;
          width: 100%;
          padding-top: 4px;
        }

        .btn-join-square {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 9px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 7px rgba(124, 58, 237, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-join-square:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.45);
        }

        .btn-details-square {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 9px;
          border-radius: 9px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(226, 232, 240, 0.9);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-details-square:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .arrow-glyph {
          font-size: 13px;
          font-weight: 800;
          color: #94a3b8;
          line-height: 1;
        }

        .btn-review-square {
          width: 100%;
          padding: 5px 8px;
          border-radius: 8px;
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.25);
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
        }

        @media (max-width: 400px) {
          .single-appt-square {
            padding: 10px;
            min-height: 162px;
          }

          .time-val {
            font-size: 14px;
          }

          .subject-title {
            font-size: 12px;
          }
        }
      `}</style>
    </article>
  );
};
