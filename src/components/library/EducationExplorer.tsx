'use client';

import React, { useState } from 'react';
import { EDUCATION_CYCLES } from '@/data/mockLibrary';
import { EducationCycle } from '@/types/library';

interface EducationExplorerProps {
  selectedCycle: string;
  selectedGrade?: string;
  onSelectGrade: (cycle: EducationCycle | 'all', gradeName?: string) => void;
}

export const EducationExplorer: React.FC<EducationExplorerProps> = ({
  selectedCycle,
  selectedGrade,
  onSelectGrade,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EducationCycle>('lycee');

  const currentCycle = EDUCATION_CYCLES.find((c) => c.id === activeTab) || EDUCATION_CYCLES[2];

  const hasSelection = selectedCycle !== 'all' || Boolean(selectedGrade);

  return (
    <div className="edu-explorer-card">
      <div className="edu-explorer-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="edu-header-left">
          <div className="edu-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="edu-header-texts">
            <span className="edu-title">Explorer par niveau scolaire & universitaire</span>
            <span className="edu-subtitle">
              {selectedGrade
                ? `Filtre actif : ${selectedGrade}`
                : 'Du Primaire (CI-CM2) à l’Université (Licence-Doctorat)'}
            </span>
          </div>
        </div>

        <div className="edu-header-right">
          {hasSelection && (
            <button
              type="button"
              className="edu-reset-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectGrade('all', undefined);
              }}
            >
              Effacer le niveau
            </button>
          )}
          <button
            type="button"
            className="edu-toggle-btn"
            aria-label={isOpen ? 'Fermer le sélecteur' : 'Ouvrir le sélecteur'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="edu-explorer-body">
          {/* Cycle tabs */}
          <div className="edu-tabs">
            {EDUCATION_CYCLES.map((cycle) => (
              <button
                key={cycle.id}
                type="button"
                className={`edu-tab-btn ${activeTab === cycle.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cycle.id)}
              >
                {cycle.label}
              </button>
            ))}
          </div>

          {/* Grades list for active cycle */}
          <div className="edu-grades-grid">
            {currentCycle.grades.map((grade) => {
              const isGradeActive = selectedGrade === grade.short || selectedGrade === grade.name;
              return (
                <button
                  key={grade.id}
                  type="button"
                  className={`grade-chip ${isGradeActive ? 'active' : ''}`}
                  onClick={() => {
                    if (isGradeActive) {
                      onSelectGrade('all', undefined);
                    } else {
                      onSelectGrade(currentCycle.id, grade.short);
                    }
                  }}
                >
                  <span className="grade-short">{grade.short}</span>
                  <span className="grade-name">{grade.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .edu-explorer-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }

        .edu-explorer-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
        }

        .edu-explorer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          cursor: pointer;
          background: linear-gradient(90deg, #ffffff 0%, #faf8ff 100%);
          user-select: none;
        }

        .edu-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .edu-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .edu-header-texts {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .edu-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .edu-subtitle {
          font-size: 12.5px;
          color: #64748b;
        }

        .edu-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .edu-reset-btn {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
        }

        .edu-reset-btn:hover {
          background: rgba(99, 102, 241, 0.15);
        }

        .edu-toggle-btn {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edu-explorer-body {
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          background: #ffffff;
          animation: fade-down 0.2s ease-out;
        }

        .edu-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          padding-bottom: 10px;
          overflow-x: auto;
        }

        .edu-tab-btn {
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .edu-tab-btn:hover {
          color: #4f46e5;
          background: #f8fafc;
        }

        .edu-tab-btn.active {
          color: #4f46e5;
          background: rgba(99, 102, 241, 0.1);
        }

        .edu-grades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .grade-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          text-align: left;
          transition: all 0.2s ease;
        }

        .grade-chip:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: #faf8ff;
          transform: translateY(-1px);
        }

        .grade-chip.active {
          background: #eef2ff;
          border-color: #6366f1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
        }

        .grade-short {
          font-size: 12px;
          font-weight: 800;
          color: #4f46e5;
          background: #ffffff;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          white-space: nowrap;
        }

        .grade-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }

        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .edu-grades-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
