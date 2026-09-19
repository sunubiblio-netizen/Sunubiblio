'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { professorService } from '@/services/professorService';
import { TeachingMode, AcademicLevel } from '@/types/professor';

interface BecomeProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeProfessorModal: React.FC<BecomeProfessorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [diploma, setDiploma] = useState('');
  const [experience, setExperience] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(6000);
  const [country, setCountry] = useState('Sénégal');
  const [city, setCity] = useState('Dakar (Région)');
  const [presentation, setPresentation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  // Simulation vérification éligibilité (formule Simple 3 000 FCFA requise au minimum)
  const eligibility = professorService.checkTeacherEligibility('simple');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      professorService.submitTeacherApplication({
        fullName,
        phone,
        headline,
        subjects: ['Mathématiques'],
        levels: ['lycee', 'college'],
        modes: ['visio', 'presentiel'],
        country,
        city,
        experienceYears: experience,
        diplomaOrInstitution: diploma,
        hourlyRate,
        presentation,
      });
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return createPortal(
    <div className="modal-backdrop-generic" onClick={onClose} style={{ zIndex: 9999999 }}>
      <div className="become-teacher-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="become-teacher-header">
          <div className="badge-pill-header">Programme Enseignants & Formateurs Sunubiblio</div>
          <h2 className="modal-main-title">Rejoindre le réseau des enseignants Sunubiblio</h2>
          <p className="modal-subtitle">
            Partagez votre savoir, accompagnez des apprenants motivés et valorisez vos compétences au Sénégal.
          </p>
          <button
            type="button"
            className="become-close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps */}
        <div className="become-teacher-body">
          {submitted ? (
            <div className="become-success-box">
              <div className="success-icon-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Candidature enregistrée avec succès !</h3>
              <p>
                Votre dossier a été transmis à la commission pédagogique de Sunubiblio.
                Notre équipe examinera vos justificatifs sous 48 heures ouvrées pour validation de votre badge professionnel.
              </p>
              <button
                type="button"
                className="btn-finish-become"
                onClick={onClose}
              >
                Compris
              </button>
            </div>
          ) : (
            <>
              {/* Les 6 étapes officielles */}
              <div className="official-steps-timeline">
                <h4 className="timeline-title">Parcours officiel d’intégration :</h4>
                <div className="steps-grid">
                  <div className="step-card">
                    <span className="step-num">1</span>
                    <strong>Compte unique</strong>
                    <p>Votre compte Sunubiblio existant (aucun 2e compte requis)</p>
                  </div>
                  <div className="step-card highlight">
                    <span className="step-num">2</span>
                    <strong>Abonnement ≥ 3 000 FCFA</strong>
                    <p>Formule Simple, 5 000 FCFA ou Gold active requise</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">3</span>
                    <strong>Dossier professionnel</strong>
                    <p>Matières, diplômes et tarifs horaires</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">4</span>
                    <strong>Validation par Sunubiblio</strong>
                    <p>Payer 3 000 FCFA ne valide pas automatiquement : contrôle humain</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">5</span>
                    <strong>Badge vérifié</strong>
                    <p>Attribution des badges officiels</p>
                  </div>
                  <div className="step-card">
                    <span className="step-num">6</span>
                    <strong>Visibilité publique</strong>
                    <p>Apparition dans la recherche Professeurs</p>
                  </div>
                </div>
              </div>

              {/* Règle importante d'abonnement */}
              <div className="eligibility-notice-box">
                <div className="notice-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="notice-text">
                  <strong>Prérequis d’éligibilité :</strong>
                  <p>
                    L’accès aux outils professionnels et à la visibilité publique nécessite un compte utilisateur avec un abonnement actif d’au moins 3 000 FCFA/mois.
                    Si vous n’êtes pas encore abonné, vous pouvez <Link href="/tarifs" onClick={onClose} className="link-inline">consulter les formules ici</Link>.
                  </p>
                </div>
              </div>

              {/* Formulaire de candidature */}
              <form onSubmit={handleSubmit} className="teacher-application-form">
                <div className="form-two-cols">
                  <div className="form-group-field">
                    <label className="field-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Ex : M. Amadou Tidiane Ndiaye"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-field">
                    <label className="field-label">Téléphone / WhatsApp professionnel</label>
                    <input
                      type="tel"
                      className="form-input-clean"
                      placeholder="Ex : +221 77 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Titre professionnel & Spécialité</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Ex : Professeur certifié FASTEF en Mathématiques Lycée & Supérieur"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                  />
                </div>

                <div className="form-two-cols">
                  <div className="form-group-field">
                    <label className="field-label">Diplôme / École de formation</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Ex : FASTEF / UCAD, CRFPE, ESP, UGB..."
                      value={diploma}
                      onChange={(e) => setDiploma(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-field">
                    <label className="field-label">Années d’expérience d’enseignement</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      className="form-input-clean"
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-two-cols">
                  <div className="form-group-field">
                    <label className="field-label">Pays de résidence</label>
                    <select
                      className="form-select-clean"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="Sénégal">Sénégal</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="France">France</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Canada">Canada</option>
                      <option value="Mali">Mali</option>
                      <option value="Guinée">Guinée</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Autre pays">Autre pays</option>
                    </select>
                  </div>

                  <div className="form-group-field">
                    <label className="field-label">Ville principale d’intervention</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="Ex : Dakar, Abidjan, Thiès, Paris..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Tarif horaire indicatif souhaité (FCFA)</label>
                  <input
                    type="number"
                    step={500}
                    min={2000}
                    className="form-input-clean"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group-field">
                  <label className="field-label">Présentation de votre approche pédagogique</label>
                  <textarea
                    className="form-textarea-clean"
                    rows={3}
                    placeholder="Décrivez votre méthode, vos résultats obtenus, vos spécialités d'accompagnement..."
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    required
                  />
                </div>

                <div className="become-footer-action">
                  <button
                    type="submit"
                    className="btn-submit-application"
                    disabled={loading}
                  >
                    {loading ? 'Envoi en cours...' : 'Déposer mon dossier enseignant'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
