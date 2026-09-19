'use client';

import React, { useState } from 'react';
import { ProfileUser } from '@/types/profile';
import { EditAboutModal } from './EditAboutModal';

interface ProfileAboutSectionProps {
  user: ProfileUser;
}

export const ProfileAboutSection: React.FC<ProfileAboutSectionProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<ProfileUser>(initialUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveAbout = (updated: Partial<ProfileUser>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <section className="profile-about-section" aria-label="À propos">
      {/* En-tête avec titre et bouton « + Modifier / compléter les informations » */}
      <div className="profile-section-header-bar">
        <div className="profile-section-title-cluster">
          <div className="section-title-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="section-title-text-group">
            <h2 className="section-main-heading">À propos & Parcours</h2>
            <p className="section-sub-heading">
              Profil académique, compétences professionnelles et zones d’intervention.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="btn-add-publication-action"
          aria-label="Modifier ou compléter les informations"
          title="Modifier / compléter les informations"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-action-text-desktop">Modifier / compléter les informations</span>
        </button>
      </div>

      {!user.bio && !user.school ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">👤</div>
          <h4>Aucune information renseignée</h4>
          <p>Complétez votre profil académique, votre établissement et vos matières enseignées.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setIsEditModalOpen(true)}
          >
            + Modifier / compléter les informations
          </button>
        </div>
      ) : (
        <div className="profile-about-card">
          <h3 className="about-section-heading">Présentation & Parcours</h3>
          <p className="about-lead-paragraph">
            {user.bio || 'Aucune biographie rédigée pour le moment.'}
          </p>
          <p className="about-secondary-paragraph">
            Titulaire d’un Master en Mathématiques Pures et certifié par l’école normale supérieure
            (FASTEF), j’accompagne depuis plusieurs années les élèves des filières scientifiques et
            les candidats aux concours nationaux dans la maîtrise des méthodes fondamentales.
          </p>

          <div className="about-details-grid">
          {/* Bloc Établissement & Rôle */}
          <div className="about-grid-card">
            <div className="about-card-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="about-card-content">
              <h4>Statut & Établissement</h4>
              <p>Professeur titulaire de Mathématiques au {user.school}.</p>
              <span className="about-badge-check">Enseignant vérifié Sunubiblio</span>
            </div>
          </div>

          {/* Bloc Niveaux enseignés */}
          <div className="about-grid-card">
            <div className="about-card-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <path d="m2 7 10-5 10 5-10 5z" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div className="about-card-content">
              <h4>Niveaux pris en charge</h4>
              <p>{user.level || 'Terminale S1/S2, Première S, Seconde S & Préparation Concours FASTEF / ENA.'}</p>
            </div>
          </div>

          {/* Bloc Expérience */}
          <div className="about-grid-card">
            <div className="about-card-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="about-card-content">
              <h4>Expérience</h4>
              <p>8 ans dans l’enseignement secondaire et la formation continue.</p>
            </div>
          </div>

          {/* Bloc Langues */}
          <div className="about-grid-card">
            <div className="about-card-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="about-card-content">
              <h4>Langues de travail</h4>
              <p>Français (courant / bilingue), Wolof, Anglais scientifique.</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Modale d'édition des infos */}
      <EditAboutModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveAbout}
      />
    </section>
  );
};
