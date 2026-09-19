'use client';

import React, { useState, useMemo } from 'react';
import { AgendaItem } from '@/types/agenda';
import {
  getWeekDates,
  toISODate,
  AGENDA_REFERENCE_DATE,
  formatAgendaDuration,
} from '@/data/mockAgenda';

interface AgendaTimetableViewProps {
  items: AgendaItem[];
  onSelectItem: (item: AgendaItem) => void;
  onJoinVisio: (item: AgendaItem) => void;
}

const DAYS_NAMES_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAYS_SHORT_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const AgendaTimetableView: React.FC<AgendaTimetableViewProps> = ({
  items,
  onSelectItem,
  onJoinVisio,
}) => {
  // Date de référence pour la semaine affichée
  const [currentDate, setCurrentDate] = useState<Date>(new Date(AGENDA_REFERENCE_DATE + 'T12:00:00'));
  
  // Jour sélectionné pour la vue mobile (par défaut aujourd'hui ou premier jour de la semaine)
  const [selectedMobileDateStr, setSelectedMobileDateStr] = useState<string>(AGENDA_REFERENCE_DATE);

  // 7 jours de la semaine courante
  const weekDays = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // Navigation semaine
  const handlePrevWeek = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleToday = () => {
    const today = new Date(AGENDA_REFERENCE_DATE + 'T12:00:00');
    setCurrentDate(today);
    setSelectedMobileDateStr(AGENDA_REFERENCE_DATE);
  };

  // Libellé de la semaine (ex: "14 – 20 Septembre 2026")
  const weekRangeLabel = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    const firstMonth = first.toLocaleDateString('fr-FR', { month: 'short' });
    const lastMonth = last.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    if (firstMonth === last.toLocaleDateString('fr-FR', { month: 'short' })) {
      return `${first.getDate()} – ${last.getDate()} ${lastMonth}`;
    }
    return `${first.getDate()} ${firstMonth} – ${last.getDate()} ${lastMonth}`;
  }, [weekDays]);

  // Événements par jour de la semaine
  const weekEventsMap = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    weekDays.forEach((d) => {
      const iso = toISODate(d);
      const dayItems = items
        .filter((it) => it.date === iso)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      map.set(iso, dayItems);
    });
    return map;
  }, [items, weekDays]);

  // Événements du jour mobile sélectionné
  const mobileSelectedEvents = useMemo(() => {
    return weekEventsMap.get(selectedMobileDateStr) || [];
  }, [weekEventsMap, selectedMobileDateStr]);

  return (
    <div className="timetable-root">
      {/* ── BARRE DE NAVIGATION TEMPORELLE ── */}
      <div className="timetable-nav-bar">
        <div className="nav-controls-group">
          <button
            type="button"
            className="nav-arrow-btn"
            onClick={handlePrevWeek}
            aria-label="Semaine précédente"
          >
            ‹
          </button>

          <button type="button" className="nav-today-btn" onClick={handleToday}>
            Aujourd'hui
          </button>

          <button
            type="button"
            className="nav-arrow-btn"
            onClick={handleNextWeek}
            aria-label="Semaine suivante"
          >
            ›
          </button>
        </div>

        <div className="nav-range-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{weekRangeLabel}</span>
        </div>
      </div>

      {/* ── 1. VUE DESKTOP (Grille structurée des 7 jours) ── */}
      <div className="timetable-desktop-grid desktop-only-view">
        {weekDays.map((dayDate, idx) => {
          const iso = toISODate(dayDate);
          const isToday = iso === AGENDA_REFERENCE_DATE;
          const dayItems = weekEventsMap.get(iso) || [];

          return (
            <div key={iso} className={`day-column ${isToday ? 'is-today-col' : ''}`}>
              {/* En-tête du jour */}
              <div className="day-col-header">
                <span className="day-name">{DAYS_NAMES_FR[idx]}</span>
                <span className={`day-num-badge ${isToday ? 'active' : ''}`}>
                  {dayDate.getDate()}
                </span>
              </div>

              {/* Liste des créneaux */}
              <div className="day-events-list">
                {dayItems.length === 0 ? (
                  <div className="day-empty-slot">
                    <span>Libre</span>
                  </div>
                ) : (
                  dayItems.map((evt) => (
                    <div
                      key={evt.id}
                      className={`timetable-event-chip type-${evt.type} ${evt.status === 'cancelled' ? 'cancelled' : ''}`}
                      onClick={() => onSelectItem(evt)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="chip-time-row">
                        <span className="chip-time">{evt.startTime} – {evt.endTime}</span>
                        <span className="chip-sticker">{evt.sticker || '📅'}</span>
                      </div>
                      <div className="chip-title">{evt.title}</div>
                      {evt.mode === 'visio' && (
                        <div className="chip-visio-tag">
                          <span>🖥 Visio</span>
                          {evt.status === 'today' && evt.visioAvailable && (
                            <button
                              type="button"
                              className="chip-join-mini"
                              onClick={(e) => {
                                e.stopPropagation();
                                onJoinVisio(evt);
                              }}
                            >
                              Rejoindre
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2. VUE MOBILE (Sélecteur tactile de jour + Timeline verticale compacte) ── */}
      <div className="timetable-mobile-view mobile-only-view">
        {/* Sélecteur compact de jours */}
        <div className="mobile-days-pill-bar">
          {weekDays.map((dayDate, idx) => {
            const iso = toISODate(dayDate);
            const isToday = iso === AGENDA_REFERENCE_DATE;
            const isSelected = iso === selectedMobileDateStr;
            const hasItems = (weekEventsMap.get(iso) || []).length > 0;

            return (
              <button
                key={iso}
                type="button"
                className={`mobile-day-pill ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                onClick={() => setSelectedMobileDateStr(iso)}
              >
                <span className="pill-day-short">{DAYS_SHORT_FR[idx]}</span>
                <span className="pill-day-number">{dayDate.getDate()}</span>
                {hasItems && <span className="pill-has-event-dot" />}
              </button>
            );
          })}
        </div>

        {/* Détail du jour mobile sélectionné */}
        <div className="mobile-day-agenda-content">
          <div className="mobile-agenda-day-header">
            <h4>
              {new Date(selectedMobileDateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h4>
            <span className="event-count-badge">
              {mobileSelectedEvents.length} activité{mobileSelectedEvents.length > 1 ? 's' : ''}
            </span>
          </div>

          {mobileSelectedEvents.length === 0 ? (
            <div className="mobile-empty-day">
              <span className="empty-icon">☕</span>
              <p>Aucun cours ou rendez-vous prévu pour cette journée.</p>
            </div>
          ) : (
            <div className="mobile-events-stack">
              {mobileSelectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`mobile-timetable-card type-${evt.type} ${evt.status === 'cancelled' ? 'cancelled' : ''}`}
                  onClick={() => onSelectItem(evt)}
                >
                  <div className="mobile-card-top">
                    <span className="m-time-slot">
                      {evt.startTime} – {evt.endTime}
                      <span className="m-duration">· {formatAgendaDuration(evt.durationMinutes)}</span>
                    </span>
                    <span className="m-sticker">{evt.sticker || '📅'}</span>
                  </div>

                  <div className="mobile-card-main">
                    <h5 className="m-title">{evt.title}</h5>
                    {evt.professorName && (
                      <p className="m-prof">Avec {evt.professorName}</p>
                    )}
                    {evt.location && <p className="m-loc">📍 {evt.location}</p>}
                  </div>

                  <div className="mobile-card-actions">
                    <span className="m-mode-badge">
                      {evt.mode === 'visio' ? '🖥 Visio' : '📍 Présentiel'}
                    </span>

                    {evt.status === 'today' && evt.mode === 'visio' && evt.visioAvailable && (
                      <button
                        type="button"
                        className="m-join-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJoinVisio(evt);
                        }}
                      >
                        Rejoindre visio
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .timetable-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Barre de navigation temporelle ── */
        .timetable-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.02);
          flex-wrap: wrap;
          gap: 12px;
        }

        .nav-controls-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #f8fafc;
          color: #334155;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nav-arrow-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .nav-today-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nav-today-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .nav-range-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          text-transform: capitalize;
        }

        /* ── 1. GRILLE DESKTOP ── */
        .timetable-desktop-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          background: transparent;
        }

        .day-column {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          min-height: 420px;
          overflow: hidden;
          transition: border-color 0.18s ease;
        }

        .day-column.is-today-col {
          border-color: #7c3aed;
          box-shadow: 0 0 0 1px #7c3aed;
        }

        .day-col-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: #f8fafc;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .day-name {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .day-num-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
        }

        .day-num-badge.active {
          background: #7c3aed;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
        }

        .day-events-list {
          flex: 1;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .day-empty-slot {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          font-size: 12px;
          font-style: italic;
        }

        .timetable-event-chip {
          padding: 9px 10px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.06);
          border: 1px solid rgba(79, 70, 229, 0.15);
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .timetable-event-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);
        }

        .timetable-event-chip.type-cours {
          background: rgba(59, 130, 246, 0.07);
          border-color: rgba(59, 130, 246, 0.22);
        }

        .timetable-event-chip.type-formation {
          background: rgba(139, 92, 246, 0.07);
          border-color: rgba(139, 92, 246, 0.22);
        }

        .timetable-event-chip.type-evenement {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.25);
        }

        .timetable-event-chip.type-examen {
          background: rgba(16, 185, 129, 0.07);
          border-color: rgba(16, 185, 129, 0.22);
        }

        .timetable-event-chip.cancelled {
          opacity: 0.6;
          border-style: dashed;
        }

        .chip-time-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
        }

        .chip-sticker {
          font-size: 13px;
        }

        .chip-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.25;
        }

        .chip-visio-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          font-size: 11px;
          color: #7c3aed;
          font-weight: 600;
          margin-top: 2px;
        }

        .chip-join-mini {
          background: #7c3aed;
          color: #ffffff;
          border: none;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
        }

        /* ── 2. VUE MOBILE ── */
        .mobile-only-view {
          display: none;
        }

        .mobile-days-pill-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 4px 2px;
        }

        .mobile-days-pill-bar::-webkit-scrollbar {
          display: none;
        }

        .mobile-day-pill {
          flex: 1;
          min-width: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
        }

        .mobile-day-pill.is-today {
          border-color: rgba(124, 58, 237, 0.4);
        }

        .mobile-day-pill.is-selected {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
        }

        .pill-day-short {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }

        .mobile-day-pill.is-selected .pill-day-short {
          color: rgba(255, 255, 255, 0.85);
        }

        .pill-day-number {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .mobile-day-pill.is-selected .pill-day-number {
          color: #ffffff;
        }

        .pill-has-event-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7c3aed;
        }

        .mobile-day-pill.is-selected .pill-has-event-dot {
          background: #ffffff;
        }

        .mobile-day-agenda-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 16px;
        }

        .mobile-agenda-day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          padding-bottom: 10px;
        }

        .mobile-agenda-day-header h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          text-transform: capitalize;
        }

        .event-count-badge {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .mobile-empty-day {
          padding: 30px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 28px;
        }

        .mobile-empty-day p {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
        }

        .mobile-events-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-timetable-card {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
        }

        .mobile-timetable-card.type-cours {
          border-left: 4px solid #3b82f6;
        }

        .mobile-timetable-card.type-formation {
          border-left: 4px solid #8b5cf6;
        }

        .mobile-timetable-card.type-evenement {
          border-left: 4px solid #f59e0b;
        }

        .mobile-timetable-card.type-examen {
          border-left: 4px solid #10b981;
        }

        .mobile-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .m-time-slot {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .m-duration {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
        }

        .m-sticker {
          font-size: 16px;
        }

        .m-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .m-prof,
        .m-loc {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .mobile-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 4px;
        }

        .m-mode-badge {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: rgba(226, 232, 240, 0.6);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .m-join-btn {
          background: #7c3aed;
          color: #ffffff;
          border: none;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* ── RESPONSIVE SWITCH ── */
        @media (max-width: 860px) {
          .desktop-only-view {
            display: none;
          }

          .mobile-only-view {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
