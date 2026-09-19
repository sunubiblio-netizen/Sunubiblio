'use client';

import React, { useState, useMemo } from 'react';
import { AgendaItem, CalendarScale, AgendaItemType } from '@/types/agenda';
import {
  getMonthMatrix,
  toISODate,
  AGENDA_REFERENCE_DATE,
  formatAgendaDuration,
  formatAgendaDate,
} from '@/data/mockAgenda';
import { AgendaQuickCreateModal } from './AgendaQuickCreateModal';
import { AgendaDayModal } from './AgendaDayModal';

interface AgendaCalendarViewProps {
  items: AgendaItem[];
  onSelectItem: (item: AgendaItem) => void;
  onJoinVisio: (item: AgendaItem) => void;
  onCreateItem?: (item: AgendaItem) => void;
  onOpenNewModal?: (date?: string, type?: AgendaItemType | 'visio') => void;
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const WEEKDAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const AgendaCalendarView: React.FC<AgendaCalendarViewProps> = ({
  items,
  onSelectItem,
  onJoinVisio,
  onCreateItem,
  onOpenNewModal,
}) => {
  // Échelle active : Mois / Semaine / Jour
  const [scale, setScale] = useState<CalendarScale>('mois');

  // Modal d'interaction pour la date sélectionnée (affiche les éléments + possibilité d'ajouter)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Modal de création rapide depuis le calendrier
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateInitialType, setQuickCreateInitialType] = useState<AgendaItemType>('evenement');

  // Mois courant affiché (2026-09 par défaut)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = Septembre (0-indexed)

  // Date sélectionnée (par défaut Aujourd'hui : 2026-09-17)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(AGENDA_REFERENCE_DATE);

  // Clic sur une date du calendrier : sélectionne la date et ouvre la petite interface dédiée
  const handleDayClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setIsDayModalOpen(true);
  };

  // Navigation du calendrier
  const handlePrev = () => {
    if (scale === 'mois') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else if (scale === 'semaine') {
      const d = new Date(selectedDateStr + 'T12:00:00');
      d.setDate(d.getDate() - 7);
      setSelectedDateStr(toISODate(d));
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    } else {
      const d = new Date(selectedDateStr + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      setSelectedDateStr(toISODate(d));
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  const handleNext = () => {
    if (scale === 'mois') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    } else if (scale === 'semaine') {
      const d = new Date(selectedDateStr + 'T12:00:00');
      d.setDate(d.getDate() + 7);
      setSelectedDateStr(toISODate(d));
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    } else {
      const d = new Date(selectedDateStr + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      setSelectedDateStr(toISODate(d));
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // Septembre
    setSelectedDateStr(AGENDA_REFERENCE_DATE);
  };

  // Matrice du mois pour la vue Mois
  const monthMatrix = useMemo(() => {
    return getMonthMatrix(currentYear, currentMonth, items);
  }, [currentYear, currentMonth, items]);

  // Événements de la date sélectionnée
  const selectedDateEvents = useMemo(() => {
    return items
      .filter((it) => it.date === selectedDateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [items, selectedDateStr]);

  // Libellé de titre du calendrier
  const headerTitle = useMemo(() => {
    if (scale === 'mois') {
      return `${MONTH_NAMES_FR[currentMonth]} ${currentYear}`;
    }
    const selDate = new Date(selectedDateStr + 'T12:00:00');
    if (scale === 'jour') {
      return selDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    // Semaine
    return `${MONTH_NAMES_FR[currentMonth]} ${currentYear}`;
  }, [scale, currentMonth, currentYear, selectedDateStr]);

  return (
    <div className="calendar-root">
      {/* ── BARRE DE CONTRÔLE : Navigation date + Sélecteur d'échelle ── */}
      <div className="calendar-control-bar">
        <div className="calendar-nav-group">
          <button
            type="button"
            className="cal-arrow-btn"
            onClick={handlePrev}
            aria-label="Période précédente"
          >
            ‹
          </button>

          <button type="button" className="cal-today-btn" onClick={handleToday}>
            Aujourd'hui
          </button>

          <button
            type="button"
            className="cal-arrow-btn"
            onClick={handleNext}
            aria-label="Période suivante"
          >
            ›
          </button>

          <span className="cal-title-label">{headerTitle}</span>
        </div>

        {/* Sélecteur d'échelle : [ Mois ] [ Semaine ] [ Jour ] */}
        <div className="cal-scale-toggle" role="group" aria-label="Échelle du calendrier">
          <button
            type="button"
            className={`scale-btn ${scale === 'mois' ? 'active' : ''}`}
            onClick={() => setScale('mois')}
          >
            Mois
          </button>
          <button
            type="button"
            className={`scale-btn ${scale === 'semaine' ? 'active' : ''}`}
            onClick={() => setScale('semaine')}
          >
            Semaine
          </button>
          <button
            type="button"
            className={`scale-btn ${scale === 'jour' ? 'active' : ''}`}
            onClick={() => setScale('jour')}
          >
            Jour
          </button>
        </div>
      </div>

      {/* ── CONTENU SELON L'ÉCHELLE ── */}
      {scale === 'mois' && (
        <div className="calendar-month-layout">
          {/* Grille mensuelle */}
          <div className="calendar-grid-card">
            {/* Ligne des jours de la semaine */}
            <div className="grid-weekdays-row">
              {WEEKDAYS_SHORT.map((dayName) => (
                <div key={dayName} className="weekday-cell">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Matrice des semaines */}
            <div className="grid-days-body">
              {monthMatrix.map((week, wIdx) => (
                <div key={wIdx} className="grid-week-row">
                  {week.map((cell) => {
                    const isSelected = cell.dateStr === selectedDateStr;
                    const hasEvents = cell.items.length > 0;

                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        className={`day-cell ${!cell.isCurrentMonth ? 'is-outside' : ''} ${cell.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleDayClick(cell.dateStr)}
                      >
                        <span className="day-cell-num">{cell.dayNumber}</span>

                        {hasEvents && (
                          <div className="day-cell-indicators">
                            {cell.items.slice(0, 3).map((it, idx) => (
                              <span
                                key={idx}
                                className={`event-dot dot-${it.type}`}
                              />
                            ))}
                            {cell.items.length > 3 && (
                              <span className="event-more-count">+{cell.items.length - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── PANNEAU DÉTAIL DU JOUR SÉLECTIONNÉ ── */}
          <div className="selected-day-panel">
            <div className="panel-header-row">
              <div className="panel-date-info">
                <span className="panel-sub-label">Événements du jour</span>
                <h3 className="panel-date-title">
                  {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h3>
              </div>
              <div className="panel-header-actions">
                <span className="panel-count-tag">
                  {selectedDateEvents.length} activité{selectedDateEvents.length > 1 ? 's' : ''}
                </span>
                {onCreateItem && (
                  <div className="panel-header-btns">
                    <button
                      type="button"
                      className="panel-visio-header-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'visio');
                        } else {
                          setQuickCreateInitialType('visio');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                      title="Créer ou planifier une Visio"
                      aria-label="Créer ou planifier une Visio"
                    >
                      <span className="btn-visio-cam">🎥</span>
                      <span className="btn-label-desktop">Visio</span>
                    </button>
                    <button
                      type="button"
                      className="panel-add-header-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'evenement');
                        } else {
                          setQuickCreateInitialType('evenement');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                      title="Ajouter un élément pour ce jour"
                      aria-label="Ajouter un élément pour ce jour"
                    >
                      <svg
                        className="btn-plus-svg"
                        width="16"
                        height="16"
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
                      <span className="btn-label-desktop">Ajouter</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="panel-empty-state">
                <span className="panel-empty-icon">📅</span>
                <p>Aucun événement prévu pour cette date.</p>
                {onCreateItem && (
                  <div className="panel-empty-cta-group">
                    <button
                      type="button"
                      className="panel-quick-add-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'evenement');
                        } else {
                          setQuickCreateInitialType('evenement');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                    >
                      + Créer pour ce jour
                    </button>
                    <button
                      type="button"
                      className="panel-quick-visio-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'visio');
                        } else {
                          setQuickCreateInitialType('visio');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                      title="Planifier une séance Visio pour ce jour"
                    >
                      🎥 Planifier une Visio
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="panel-events-list">
                {selectedDateEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`day-event-item type-${evt.type}`}
                    onClick={() => onSelectItem(evt)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="day-event-time">
                      <span className="det-start">{evt.startTime}</span>
                      <span className="det-end">{evt.endTime}</span>
                    </div>

                    <div className="day-event-main">
                      <div className="det-title-row">
                        <span className="det-sticker">{evt.sticker || '📅'}</span>
                        <h4 className="det-title">{evt.title}</h4>
                      </div>
                      {evt.professorName && (
                        <span className="det-prof">Professeur : {evt.professorName}</span>
                      )}
                      {evt.location && <span className="det-loc">📍 {evt.location}</span>}
                    </div>

                    <div className="day-event-action">
                      {evt.mode === 'visio' && evt.status === 'today' && evt.visioAvailable ? (
                        <button
                          type="button"
                          className="det-join-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onJoinVisio(evt);
                          }}
                        >
                          Rejoindre
                        </button>
                      ) : (
                        <span className="det-chevron">›</span>
                      )}
                    </div>
                  </div>
                ))}

                {onCreateItem && (
                  <div className="panel-bottom-buttons-row">
                    <button
                      type="button"
                      className="panel-add-bottom-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'evenement');
                        } else {
                          setQuickCreateInitialType('evenement');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                    >
                      + Ajouter un élément à cette date
                    </button>
                    <button
                      type="button"
                      className="panel-visio-bottom-btn"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDateStr, 'visio');
                        } else {
                          setQuickCreateInitialType('visio');
                          setIsQuickCreateOpen(true);
                        }
                      }}
                      title="Planifier une Visio pour cette date"
                    >
                      🎥 Visio
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VUE SEMAINE / JOUR DÉDIÉE ── */}
      {scale !== 'mois' && (
        <div className="calendar-single-day-card">
          <div className="single-day-header">
            <h4>
              {scale === 'semaine' ? 'Aperçu hebdomadaire' : 'Journée complète'}
            </h4>
            <div className="single-day-actions">
              <span className="single-day-badge">
                {selectedDateEvents.length} événement{selectedDateEvents.length > 1 ? 's' : ''}
              </span>
              {onCreateItem && (
                <button
                  type="button"
                  className="panel-add-header-btn"
                  onClick={() => {
                    if (onOpenNewModal) {
                      onOpenNewModal(selectedDateStr, 'evenement');
                    } else {
                      setIsQuickCreateOpen(true);
                    }
                  }}
                  title="Ajouter un élément pour ce jour"
                  aria-label="Ajouter un élément pour ce jour"
                >
                  <svg
                    className="btn-plus-svg"
                    width="16"
                    height="16"
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
                  <span className="btn-label-desktop">Ajouter</span>
                </button>
              )}
            </div>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="panel-empty-state">
              <span className="panel-empty-icon">☕</span>
              <p>Aucun événement programmé pour cette journée.</p>
              {onCreateItem && (
                <button
                  type="button"
                  className="panel-quick-add-btn"
                  onClick={() => setIsQuickCreateOpen(true)}
                >
                  + Créer pour ce jour
                </button>
              )}
            </div>
          ) : (
            <div className="panel-events-list">
              {selectedDateEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`day-event-item type-${evt.type}`}
                  onClick={() => onSelectItem(evt)}
                >
                  <div className="day-event-time">
                    <span className="det-start">{evt.startTime}</span>
                    <span className="det-end">{evt.endTime}</span>
                  </div>
                  <div className="day-event-main">
                    <div className="det-title-row">
                      <span className="det-sticker">{evt.sticker || '📅'}</span>
                      <h4 className="det-title">{evt.title}</h4>
                    </div>
                    {evt.professorName && (
                      <span className="det-prof">Avec {evt.professorName}</span>
                    )}
                  </div>
                  <div className="day-event-action">
                    <span className="det-mode-tag">
                      {evt.mode === 'visio' ? 'Visio' : 'Présentiel'}
                    </span>
                  </div>
                </div>
              ))}

              {onCreateItem && (
                <button
                  type="button"
                  className="panel-add-bottom-btn"
                  onClick={() => {
                    if (onOpenNewModal) {
                      onOpenNewModal(selectedDateStr, 'evenement');
                    } else {
                      setIsQuickCreateOpen(true);
                    }
                  }}
                >
                  + Ajouter un élément
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal / Bottom-Sheet compact pour la date cliquée (liste des éléments + création rapide) */}
      {onCreateItem && (
        <AgendaDayModal
          isOpen={isDayModalOpen}
          selectedDate={selectedDateStr}
          items={items}
          onClose={() => setIsDayModalOpen(false)}
          onCreateItem={(newItem) => {
            onCreateItem(newItem);
          }}
          onSelectItem={onSelectItem}
          onJoinVisio={onJoinVisio}
          onOpenNewModal={(date, type) => {
            setIsDayModalOpen(false);
            onOpenNewModal?.(date, type);
          }}
        />
      )}

      {/* Modal / Bottom-Sheet de création rapide complémentaire */}
      {onCreateItem && (
        <AgendaQuickCreateModal
          isOpen={isQuickCreateOpen}
          selectedDate={selectedDateStr}
          initialType={quickCreateInitialType}
          onClose={() => setIsQuickCreateOpen(false)}
          onCreateItem={(newItem) => {
            onCreateItem(newItem);
            setIsQuickCreateOpen(false);
          }}
        />
      )}

      <style jsx>{`
        .calendar-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Barre de contrôle ── */
        .calendar-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          flex-wrap: wrap;
          gap: 12px;
        }

        .calendar-nav-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cal-arrow-btn {
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

        .cal-arrow-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .cal-today-btn {
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

        .cal-today-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .cal-title-label {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-left: 6px;
          text-transform: capitalize;
        }

        .cal-scale-toggle {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 10px;
          gap: 2px;
        }

        .scale-btn {
          padding: 5px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .scale-btn.active {
          background: #ffffff;
          color: #4f46e5;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
        }

        /* ── Disposition Mois : Grille + Panneau latéral ── */
        .calendar-month-layout {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 16px;
          align-items: start;
        }

        .calendar-grid-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.02);
        }

        .grid-weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        }

        .weekday-cell {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .grid-days-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .grid-week-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid transparent;
          background: #ffffff;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
          padding: 4px 2px;
          min-height: 42px;
        }

        .day-cell:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .day-cell.is-outside {
          opacity: 0.35;
        }

        .day-cell.is-today {
          border-color: rgba(124, 58, 237, 0.4);
          background: rgba(124, 58, 237, 0.04);
        }

        .day-cell.is-today .day-cell-num {
          color: #7c3aed;
          font-weight: 800;
        }

        .day-cell.is-selected {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #4f46e5, 0 4px 14px rgba(79, 70, 229, 0.35) !important;
          transform: scale(1.03);
          z-index: 2;
        }

        .day-cell.is-selected .day-cell-num {
          color: #ffffff !important;
          font-weight: 800;
        }

        .day-cell-num {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .day-cell-indicators {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          margin-top: 3px;
        }

        .event-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .day-cell.is-selected .event-dot {
          background: #ffffff;
        }

        .event-dot.dot-cours {
          background: #3b82f6;
        }

        .event-dot.dot-formation {
          background: #8b5cf6;
        }

        .event-dot.dot-evenement {
          background: #f59e0b;
        }

        .event-dot.dot-examen {
          background: #10b981;
        }

        .event-dot.dot-tache {
          background: #059669;
        }

        .event-dot.dot-rappel {
          background: #d97706;
        }

        .event-dot.dot-visio {
          background: #8b5cf6;
          box-shadow: 0 0 5px rgba(139, 92, 246, 0.45);
        }

        .event-more-count {
          font-size: 9px;
          font-weight: 800;
          color: #64748b;
        }

        .day-cell.is-selected .event-more-count {
          color: #ffffff;
        }

        /* ── Panneau du jour sélectionné ── */
        .selected-day-panel,
        .calendar-single-day-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.02);
        }

        .panel-header-row,
        .single-day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          padding-bottom: 10px;
        }

        .panel-date-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .panel-sub-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6366f1;
          letter-spacing: 0.05em;
        }

        .panel-date-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          text-transform: capitalize;
        }

        .panel-count-tag,
        .single-day-badge {
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 999px;
        }

        .panel-header-actions,
        .single-day-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-header-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-visio-header-btn,
        .panel-add-header-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.32);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .panel-visio-header-btn:hover,
        .panel-add-header-btn:hover {
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.44);
          transform: translateY(-1px);
        }

        .panel-visio-header-btn:active,
        .panel-add-header-btn:active {
          transform: translateY(0);
        }

        .btn-visio-cam {
          font-size: 14px;
          line-height: 1;
        }

        .btn-plus-svg {
          flex-shrink: 0;
        }

        .btn-label-desktop {
          display: inline;
        }

        .panel-empty-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .panel-quick-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
          transition: all 0.18s ease;
        }

        .panel-quick-add-btn:hover {
          box-shadow: 0 5px 16px rgba(79, 70, 229, 0.4);
          transform: translateY(-1px);
        }

        .panel-quick-visio-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(124, 58, 237, 0.08);
          border: 1.5px solid rgba(124, 58, 237, 0.3);
          color: #7c3aed;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .panel-quick-visio-btn:hover {
          background: rgba(124, 58, 237, 0.14);
          border-color: #7c3aed;
          transform: translateY(-1px);
        }

        .panel-bottom-buttons-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .panel-add-bottom-btn {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px dashed rgba(79, 70, 229, 0.3);
          background: rgba(79, 70, 229, 0.04);
          color: #4f46e5;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .panel-add-bottom-btn:hover {
          background: rgba(79, 70, 229, 0.08);
          border-color: #4f46e5;
        }

        .panel-empty-state {
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          color: #94a3b8;
        }

        .panel-empty-icon {
          font-size: 32px;
        }

        .panel-empty-state p {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
        }

        .panel-events-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .day-event-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .day-event-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
          background: #ffffff;
        }

        .day-event-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 48px;
          flex-shrink: 0;
        }

        .det-start {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .det-end {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .day-event-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .det-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .det-sticker {
          font-size: 14px;
        }

        .det-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .det-prof,
        .det-loc {
          font-size: 11.5px;
          color: #64748b;
        }

        .day-event-action {
          flex-shrink: 0;
        }

        .det-chevron {
          font-size: 18px;
          color: #94a3b8;
          font-weight: 700;
        }

        .det-join-btn {
          background: #7c3aed;
          color: #ffffff;
          border: none;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .det-mode-tag {
          font-size: 11px;
          font-weight: 600;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          padding: 2px 7px;
          border-radius: 4px;
        }

        @media (max-width: 860px) {
          .calendar-month-layout {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .calendar-root {
            gap: 12px;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            box-sizing: border-box;
          }

          /* ── Barre de contrôle responsive ── */
          .calendar-control-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 10px 12px;
            gap: 10px;
            border-radius: 14px;
            width: 100%;
            box-sizing: border-box;
          }

          .calendar-nav-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 6px;
          }

          .cal-arrow-btn {
            width: 30px;
            height: 30px;
            font-size: 16px;
            flex-shrink: 0;
          }

          .cal-today-btn {
            padding: 5px 12px;
            font-size: 12px;
            flex-shrink: 0;
          }

          .cal-title-label {
            font-size: 13.5px;
            margin-left: 0;
            text-align: right;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cal-scale-toggle {
            width: 100%;
            display: flex;
            padding: 3px;
          }

          .scale-btn {
            flex: 1;
            text-align: center;
            padding: 6px 4px;
            font-size: 12px;
          }

          /* ── Grille mensuelle mobile : 7 colonnes parfaitement réparties sans débordement ── */
          .calendar-grid-card {
            padding: 10px 6px;
            gap: 4px;
            border-radius: 14px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }

          .grid-weekdays-row {
            padding-bottom: 4px;
          }

          .weekday-cell {
            font-size: 10.5px;
            font-weight: 750;
            color: #64748b;
          }

          .grid-days-body {
            gap: 2px;
          }

          .grid-week-row {
            gap: 2px;
          }

          .day-cell {
            min-height: 38px;
            padding: 2px 1px;
            border-radius: 8px;
            box-sizing: border-box;
          }

          .day-cell-num {
            font-size: 11.5px;
          }

          .day-cell-indicators {
            gap: 2px;
            margin-top: 1px;
          }

          .event-dot {
            width: 4.5px;
            height: 4.5px;
          }

          .event-more-count {
            font-size: 8px;
          }

          /* ── Panneau du jour sélectionné sur mobile ── */
          .selected-day-panel,
          .calendar-single-day-card {
            padding: 12px;
            gap: 12px;
            border-radius: 14px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }

          .panel-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding-bottom: 8px;
          }

          .panel-date-info {
            width: 100%;
          }

          .panel-sub-label {
            font-size: 10.5px;
          }

          .panel-date-title {
            font-size: 14px;
          }

          .panel-header-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 6px;
          }

          .panel-count-tag {
            font-size: 10.5px;
            padding: 2px 6px;
          }

          .panel-header-btns {
            display: flex;
            align-items: center;
            gap: 7px;
          }

          .panel-visio-header-btn,
          .panel-add-header-btn {
            width: 36px;
            height: 36px;
            padding: 0;
            border-radius: 11px;
            flex-shrink: 0;
          }

          .btn-visio-cam {
            font-size: 15px;
          }

          .btn-label-desktop {
            display: none;
          }

          .day-event-item {
            padding: 9px 10px;
            gap: 8px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }

          .day-event-time {
            font-size: 10px;
            min-width: 40px;
          }

          .det-sticker {
            font-size: 12px;
          }

          .det-title {
            font-size: 12.5px;
          }

          .det-prof,
          .det-loc {
            font-size: 10.5px;
          }

          .det-join-btn {
            padding: 4px 8px;
            font-size: 10.5px;
          }

          .panel-bottom-buttons-row {
            flex-direction: column;
            gap: 6px;
            width: 100%;
          }

          .panel-add-bottom-btn {
            width: 100%;
            padding: 9px;
            font-size: 12px;
          }

          .panel-visio-bottom-btn {
            width: 100%;
            padding: 9px;
            font-size: 12px;
            justify-content: center;
          }
        }

        @media (max-width: 360px) {
          .cal-title-label {
            font-size: 12px;
          }
          .cal-today-btn {
            padding: 4px 8px;
            font-size: 11px;
          }
          .scale-btn {
            font-size: 11px;
            padding: 5px 2px;
          }
          .day-cell {
            min-height: 34px;
          }
          .day-cell-num {
            font-size: 10.5px;
          }
        }
      `}</style>
    </div>
  );
};
