'use client';

import React from 'react';
import { EDUCATION_SUBJECTS } from '@/data/educationData';
import { EducationSubject } from '@/types/education';

interface EducationSubjectsSectionProps {
  selectedSubject: string;
  onSelectSubject: (subjectSlug: string) => void;
}

export const EducationSubjectsSection: React.FC<EducationSubjectsSectionProps> = ({
  selectedSubject,
  onSelectSubject,
}) => {
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'math':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
        );
      case 'book-open':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'globe':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'activity':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'zap':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case 'disc':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'clock':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'compass':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 'cpu':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );
      case 'feather':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
            <line x1="16" y1="8" x2="2" y2="22" />
            <line x1="17.5" y1="15" x2="9" y2="15" />
          </svg>
        );
    }
  };

  const handleSubjectClick = (slug: string) => {
    onSelectSubject(slug === selectedSubject ? 'all' : slug);
    // Smooth scroll to the resources section
    const target = document.getElementById('ressources');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="subjects-section" id="matieres">
      <div className="container">
        {/* Section Header */}
        <div className="subjects-center-header">
          <div className="badge-pill section-badge">
            <span className="badge-dot" />
            <span>Matières Fondamentales</span>
          </div>

          <h2 className="section-title">
            Explorer par <span className="gradient-hero-text">matière d’enseignement</span>
          </h2>

          <p className="section-subtitle">
            Sélectionnez une discipline pour afficher directement les cours, exercices corrigés et
            annales associés.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="subjects-grid">
          {EDUCATION_SUBJECTS.map((subject) => {
            const isSelected = selectedSubject === subject.slug;
            return (
              <div
                key={subject.id}
                className={`subject-card ${isSelected ? 'subject-card-selected' : ''}`}
                onClick={() => handleSubjectClick(subject.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSubjectClick(subject.slug);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Filtrer par ${subject.name}`}
              >
                <div
                  className="subject-icon-box"
                  style={{
                    color: subject.color,
                    background: subject.bgColor,
                  }}
                >
                  {renderSubjectIcon(subject.iconName)}
                </div>

                <div className="subject-info">
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-desc">{subject.description}</p>
                </div>

                <div className={`subject-action ${isSelected ? 'action-active' : ''}`}>
                  {isSelected ? (
                    <span className="selected-tag">Actif ✓</span>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .subjects-section {
          padding: 60px 0 54px;
          background: #f8fafc;
          border-top: 1px solid var(--border-subtle, #e2e8f0);
          border-bottom: 1px solid var(--border-subtle, #e2e8f0);
        }

        .subjects-center-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 44px;
        }

        .section-badge {
          display: inline-flex;
          margin-bottom: 14px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-heading, #0f172a);
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
        }

        .section-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-body, #64748b);
          margin: 0;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        .subject-card {
          background: #ffffff;
          border: 1px solid var(--border-card, rgba(226, 232, 240, 0.9));
          border-radius: 16px;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          outline: none;
        }

        .subject-card:hover {
          transform: translateY(-3px);
          border-color: #6366f1;
          box-shadow: 0 10px 24px -6px rgba(99, 102, 241, 0.12);
        }

        .subject-card-selected {
          border-color: #4f46e5 !important;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.16) !important;
        }

        .subject-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .subject-card:hover .subject-icon-box {
          transform: scale(1.08);
        }

        .subject-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .subject-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-heading, #0f172a);
          margin: 0;
        }

        .subject-desc {
          font-size: 11.5px;
          line-height: 1.45;
          color: var(--text-muted, #64748b);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .subject-action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: #94a3b8;
          font-size: 12px;
        }

        .subject-card:hover .subject-action {
          color: #4f46e5;
        }

        .selected-tag {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 999px;
        }

        @media (max-width: 1200px) {
          .subjects-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .subjects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .section-title {
            font-size: 26px;
          }
        }

        @media (max-width: 480px) {
          .subjects-grid {
            grid-template-columns: 1fr;
          }

          .subject-card {
            flex-direction: row;
            align-items: center;
            padding: 14px;
          }

          .subject-info {
            gap: 2px;
          }
        }
      `}</style>
    </section>
  );
};
