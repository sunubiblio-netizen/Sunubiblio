'use client';

import React from 'react';
import { AppointmentStats } from '@/types/appointment';

interface AppointmentStatsBarProps {
  stats: AppointmentStats;
  activeFilter: string;
  onFilterByStatus: (status: string) => void;
}

const STAT_ITEMS = [
  {
    key: 'upcoming',
    label: 'À venir',
    color: '#4f46e5',
    bg: 'rgba(79,70,229,0.08)',
    activeBg: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: 'today',
    label: "Aujourd'hui",
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    activeBg: 'linear-gradient(135deg, #7c3aed, #9333ea)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Terminés',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    activeBg: 'linear-gradient(135deg, #059669, #10b981)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    key: 'pending',
    label: 'En attente',
    color: '#d97706',
    bg: 'rgba(217,119,6,0.08)',
    activeBg: 'linear-gradient(135deg, #d97706, #f59e0b)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

function getStatValue(stats: AppointmentStats, key: string): number {
  const map: Record<string, number> = {
    upcoming: stats.upcoming,
    today: stats.today,
    completed: stats.completed,
    pending: stats.pending,
  };
  return map[key] ?? 0;
}

export const AppointmentStatsBar: React.FC<AppointmentStatsBarProps> = ({
  stats,
  activeFilter,
  onFilterByStatus,
}) => {
  return (
    <div className="stats-bar-root">
      {STAT_ITEMS.map((item) => {
        const value = getStatValue(stats, item.key);
        const isActive = activeFilter === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={`stat-card ${isActive ? 'is-active' : ''}`}
            onClick={() => onFilterByStatus(isActive ? 'all' : item.key)}
            style={
              isActive
                ? { background: item.activeBg, borderColor: 'transparent' }
                : { borderColor: 'rgba(226,232,240,0.8)' }
            }
          >
            <div
              className="stat-icon"
              style={
                isActive
                  ? { background: 'rgba(255,255,255,0.2)', color: '#ffffff' }
                  : { background: item.bg, color: item.color }
              }
            >
              {item.icon}
            </div>
            <div className="stat-content">
              <span
                className="stat-value"
                style={{ color: isActive ? '#ffffff' : '#0f172a' }}
              >
                {value}
              </span>
              <span
                className="stat-label"
                style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#64748b' }}
              >
                {item.label}
              </span>
            </div>
          </button>
        );
      })}

      <style jsx>{`
        .stats-bar-root {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.12);
        }

        .stat-card.is-active {
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.25);
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          transition: color 0.2s ease;
        }

        .stat-label {
          font-size: 11.5px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        @media (max-width: 860px) {
          .stats-bar-root {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .stats-bar-root {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .stat-card {
            padding: 12px 12px;
            gap: 10px;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }

          .stat-value {
            font-size: 19px;
          }

          .stat-label {
            font-size: 10.5px;
          }
        }
      `}</style>
    </div>
  );
};
