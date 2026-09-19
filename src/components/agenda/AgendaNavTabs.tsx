'use client';

import React from 'react';
import { AgendaViewMode } from '@/types/agenda';

interface AgendaNavTabsProps {
  activeTab: AgendaViewMode;
  onTabChange: (tab: AgendaViewMode) => void;
  appointmentsCount?: number;
}

export const AgendaNavTabs: React.FC<AgendaNavTabsProps> = ({
  activeTab,
  onTabChange,
  appointmentsCount = 0,
}) => {
  return (
    <div className="agenda-tabs-bar" role="tablist" aria-label="Modes d'affichage de l'agenda">
      <div className="agenda-tabs-container">
        {/* Onglet 1 : Rendez-vous */}
        <button
          type="button"
          role="tab"
          id="tab-rendez-vous"
          aria-selected={activeTab === 'rendez-vous'}
          aria-controls="panel-rendez-vous"
          className={`agenda-tab-btn ${activeTab === 'rendez-vous' ? 'is-active' : ''}`}
          onClick={() => onTabChange('rendez-vous')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="tab-title">Rendez-vous</span>
          {appointmentsCount > 0 && (
            <span className="tab-counter-badge">{appointmentsCount}</span>
          )}
        </button>

        {/* Onglet 2 : Emploi du temps */}
        <button
          type="button"
          role="tab"
          id="tab-emploi-du-temps"
          aria-selected={activeTab === 'emploi-du-temps'}
          aria-controls="panel-emploi-du-temps"
          className={`agenda-tab-btn ${activeTab === 'emploi-du-temps' ? 'is-active' : ''}`}
          onClick={() => onTabChange('emploi-du-temps')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="tab-title">Emploi du temps</span>
        </button>

        {/* Onglet 3 : Calendrier */}
        <button
          type="button"
          role="tab"
          id="tab-calendrier"
          aria-selected={activeTab === 'calendrier'}
          aria-controls="panel-calendrier"
          className={`agenda-tab-btn ${activeTab === 'calendrier' ? 'is-active' : ''}`}
          onClick={() => onTabChange('calendrier')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="tab-title">Calendrier</span>
        </button>
      </div>

      <style jsx>{`
        .agenda-tabs-bar {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          padding-bottom: 0;
        }

        .agenda-tabs-container {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          width: 100%;
        }

        .agenda-tabs-container::-webkit-scrollbar {
          display: none;
        }

        .agenda-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px 12px 0 0;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: all 0.18s ease;
          white-space: nowrap;
          border-bottom: 2.5px solid transparent;
        }

        .agenda-tab-btn:hover {
          color: #0f172a;
          background: rgba(241, 245, 249, 0.6);
        }

        .agenda-tab-btn.is-active {
          color: #4f46e5;
          font-weight: 700;
          border-bottom-color: #4f46e5;
          background: rgba(79, 70, 229, 0.05);
        }

        .tab-counter-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(79, 70, 229, 0.12);
          color: #4f46e5;
        }

        .agenda-tab-btn.is-active .tab-counter-badge {
          background: #4f46e5;
          color: #ffffff;
        }

        @media (max-width: 640px) {
          .agenda-tabs-bar {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .agenda-tabs-bar::-webkit-scrollbar {
            display: none;
          }

          .agenda-tabs-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 2px;
          }

          .agenda-tab-btn {
            flex: 1;
            justify-content: center;
            padding: 8px 4px;
            font-size: 12px;
            gap: 4px;
            border-bottom-width: 2px;
          }

          .agenda-tab-btn svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }

          .tab-counter-badge {
            min-width: 16px;
            height: 16px;
            font-size: 9.5px;
            padding: 0 4px;
          }
        }

        @media (max-width: 380px) {
          .agenda-tab-btn {
            font-size: 11px;
            padding: 8px 2px;
            gap: 3px;
          }

          .agenda-tab-btn svg {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
