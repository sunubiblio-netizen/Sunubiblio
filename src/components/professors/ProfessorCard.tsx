'use client';

import React from 'react';
import Link from 'next/link';
import {
  ProfessorProfile,
  TeachingMode,
  AcademicLevel,
  ProfessionalBadgeType,
} from '@/types/professor';

interface ProfessorCardProps {
  professor: ProfessorProfile;
  onBookCourse: (prof: ProfessorProfile) => void;
}

const LEVEL_LABELS: Record<AcademicLevel, string> = {
  primaire: 'Primaire',
  college: 'Collège (BFEM)',
  lycee: 'Lycée (BAC)',
  superieur: 'Université',
  concours_prepa: 'Concours / Prépa',
};

const BADGE_CONFIG: Record<ProfessionalBadgeType, { label: string; color: string; bg: string }> = {
  enseignant_verifie: {
    label: 'Enseignant vérifié',
    color: '#0284c7',
    bg: '#e0f2fe',
  },
  formateur_certifie: {
    label: 'Formateur certifié',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  auteur: {
    label: 'Auteur Sunubiblio',
    color: '#d97706',
    bg: '#fef3c7',
  },
  vendeur: {
    label: 'Vendeur certifié',
    color: '#059669',
    bg: '#d1fae5',
  },
};

export const ProfessorCard: React.FC<ProfessorCardProps> = ({
  professor,
  onBookCourse,
}) => {
  // Extraction des initiales pour le fallback d'avatar
  const initials = professor.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <article className="professor-card">
      {/* Top Banner / Top badge */}
      {professor.isTopTutor && (
        <div className="professor-top-tutor-banner">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Profil Recommandé par Sunubiblio
        </div>
      )}

      <div className="professor-card-body">
        {/* Header : Avatar + Noms + Badges */}
        <div className="professor-header-row">
          <div className="professor-avatar-wrap">
            <div className="professor-avatar-fallback">
              <span>{initials}</span>
            </div>
            {professor.verified && (
              <span className="professor-verified-check" title="Identité et diplômes vérifiés par Sunubiblio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>

          <div className="professor-main-info">
            <div className="professor-name-rating-row">
              <h3 className="professor-fullname">{professor.fullName}</h3>
              {professor.rating > 0 && (
                <div className="professor-rating-badge" title={`${professor.rating} sur 5 (${professor.reviewCount} avis)`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="rating-num">{professor.rating.toFixed(1)}</span>
                  <span className="review-count">({professor.reviewCount})</span>
                </div>
              )}
            </div>

            <p className="professor-headline">{professor.headline}</p>

            {/* Badges professionnels */}
            <div className="professor-badges-row">
              {professor.badges.map((badge) => {
                const conf = BADGE_CONFIG[badge];
                if (!conf) return null;
                return (
                  <span
                    key={badge}
                    className="prof-badge-pill"
                    style={{ color: conf.color, backgroundColor: conf.bg }}
                  >
                    {conf.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bio courte */}
        <p className="professor-bio-snippet">{professor.bio}</p>

        {/* Matières enseignées */}
        <div className="professor-meta-group">
          <span className="meta-label">Matières :</span>
          <div className="meta-tags-list">
            {professor.subjects.map((subj) => (
              <span key={subj} className="subject-tag">
                {subj}
              </span>
            ))}
          </div>
        </div>

        {/* Niveaux & Zone */}
        <div className="professor-details-grid">
          <div className="detail-item">
            <span className="detail-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <div className="detail-text">
              <span className="label">Niveaux</span>
              <span className="val">{professor.levels.map((l) => LEVEL_LABELS[l]).join(', ')}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <div className="detail-text">
              <span className="label">Pays & Ville</span>
              <span className="val">{professor.country} • {professor.city}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div className="detail-text">
              <span className="label">Expérience</span>
              <span className="val">{professor.experienceYears} ans</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <div className="detail-text">
              <span className="label">Disponibilité</span>
              <span className="val available-text">{professor.availabilityNote}</span>
            </div>
          </div>
        </div>

        {/* Modes d'enseignement acceptés */}
        <div className="professor-modes-row">
          <span className="modes-title">Modes de cours :</span>
          <div className="modes-chips-list">
            {professor.modes.map((mode) => (
              <span key={mode} className={`mode-badge mode-${mode}`}>
                {mode === 'visio' && (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Visio en direct
                  </>
                )}
                {mode === 'presentiel' && (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Présentiel
                  </>
                )}
                {mode === 'domicile' && (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    À domicile
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Footer de la carte : Tarif horaire & Actions */}
        <div className="professor-card-footer">
          <div className="professor-pricing-wrap">
            <span className="pricing-prefix">Tarif indicatif</span>
            <div className="pricing-value-group">
              <strong className="rate-amount">
                {professor.hourlyRate.toLocaleString('fr-FR')} {professor.currency}
              </strong>
              <span className="rate-unit">/ heure</span>
            </div>
          </div>

          <div className="professor-actions-group">
            {/* Bouton Voir le profil (prépare l'URL /professeurs/id sans casser) */}
            <Link
              href={`#prof-${professor.id}`}
              className="btn-view-profile"
              onClick={(e) => {
                e.preventDefault();
                // Avertissement doux que le profil complet sera actif au prochain lot
                alert(`Fiche de ${professor.fullName} :\n\nFormation : ${professor.education}\nLangues : ${professor.languages.join(', ')}\nCréneaux : ${professor.availableSlots.map(s => `${s.day} (${s.hours})`).join(' • ')}\n\nLa page individuelle détaillée sera disponible prochainement.`);
              }}
            >
              Voir le profil
            </Link>

            {/* Bouton Réserver un cours */}
            <button
              type="button"
              className="btn-book-course"
              onClick={() => onBookCourse(professor)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Réserver un cours
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
