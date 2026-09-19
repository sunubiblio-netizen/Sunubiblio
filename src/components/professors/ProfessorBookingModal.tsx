'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProfessorProfile, TeachingMode, BookingFormState } from '@/types/professor';
import { professorService } from '@/services/professorService';

interface ProfessorBookingModalProps {
  isOpen: boolean;
  professor: ProfessorProfile | null;
  onClose: () => void;
}

export const ProfessorBookingModal: React.FC<ProfessorBookingModalProps> = ({
  isOpen,
  professor,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMode, setSelectedMode] = useState<TeachingMode>('visio');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialisation à l'ouverture pour ce professeur
  useEffect(() => {
    if (professor) {
      setSelectedSubject(professor.subjects[0] || 'Général');
      setSelectedMode(professor.modes[0] || 'visio');
      // Prochaine date par défaut (demain)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      if (professor.availableSlots.length > 0) {
        setSelectedSlot(`${professor.availableSlots[0].day} (${professor.availableSlots[0].hours})`);
      } else {
        setSelectedSlot('16h00 - 18h00');
      }
      setConfirmedBookingId(null);
    }
  }, [professor]);

  // Verrouillage du scroll
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || !professor || typeof document === 'undefined') return null;

  const totalAmount = Math.round(professor.hourlyRate * durationHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const bookingState: BookingFormState = {
        professorId: professor.id,
        professorName: professor.fullName,
        subject: selectedSubject,
        mode: selectedMode,
        date: selectedDate,
        timeSlot: selectedSlot,
        durationHours,
        studentName,
        studentPhone,
        notes,
      };

      const result = professorService.submitBooking(bookingState);
      setLoading(false);
      if (result.success) {
        setConfirmedBookingId(result.bookingId);
      }
    }, 700);
  };

  return createPortal(
    <div className="modal-backdrop-generic" onClick={onClose} style={{ zIndex: 9999999 }}>
      <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header du modal */}
        <div className="booking-modal-header">
          <div className="booking-header-prof-info">
            <div className="prof-mini-avatar">
              <span>{professor.fullName.charAt(0)}</span>
            </div>
            <div>
              <h2 className="booking-title">Réserver un cours avec {professor.fullName}</h2>
              <p className="booking-subtitle">{professor.headline}</p>
            </div>
          </div>
          <button
            type="button"
            className="booking-close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre de réservation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps : Confirmation ou Formulaire */}
        <div className="booking-modal-body">
          {confirmedBookingId ? (
            <div className="booking-success-view">
              <div className="booking-success-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="success-title">Demande de réservation confirmée !</h3>
              <p className="success-desc">
                Votre demande de séance a été transmise à <strong>{professor.fullName}</strong>.
                Un récapitulatif ainsi que le lien de connexion sécurisé vous ont été envoyés par SMS/WhatsApp.
              </p>

              <div className="booking-summary-box">
                <div className="summary-row">
                  <span>Matière :</span>
                  <strong>{selectedSubject}</strong>
                </div>
                <div className="summary-row">
                  <span>Mode :</span>
                  <strong>{selectedMode === 'visio' ? 'Visio en direct Sunubiblio' : selectedMode === 'presentiel' ? 'Présentiel' : 'À domicile'}</strong>
                </div>
                <div className="summary-row">
                  <span>Date & Créneau :</span>
                  <strong>{selectedDate} • {selectedSlot} ({durationHours}h)</strong>
                </div>
                <div className="summary-row total-row">
                  <span>Montant de la séance :</span>
                  <strong>{totalAmount.toLocaleString('fr-FR')} FCFA</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn-success-close"
                onClick={onClose}
              >
                Terminer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Choix de la matière */}
              <div className="form-group-field">
                <label className="field-label">Matière à travailler</label>
                <select
                  className="form-select-clean"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {professor.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Choix du mode d'enseignement */}
              <div className="form-group-field">
                <label className="field-label">Mode d’apprentissage souhaité</label>
                <div className="mode-selection-pills">
                  {professor.modes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`mode-select-pill ${selectedMode === m ? 'active' : ''}`}
                      onClick={() => setSelectedMode(m)}
                    >
                      {m === 'visio' && 'Visio en direct'}
                      {m === 'presentiel' && 'Présentiel'}
                      {m === 'domicile' && 'À domicile'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Durée */}
              <div className="form-two-cols">
                <div className="form-group-field">
                  <label className="field-label">Date de la séance</label>
                  <input
                    type="date"
                    className="form-input-clean"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-field">
                  <label className="field-label">Durée de la séance</label>
                  <select
                    className="form-select-clean"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                  >
                    <option value={1}>1 heure</option>
                    <option value={1.5}>1 heure 30 min</option>
                    <option value={2}>2 heures</option>
                    <option value={3}>3 heures</option>
                  </select>
                </div>
              </div>

              {/* Créneau proposé */}
              <div className="form-group-field">
                <label className="field-label">Créneaux habituels de disponibilité</label>
                <select
                  className="form-select-clean"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  {professor.availableSlots.map((slot) => (
                    <option key={`${slot.day}-${slot.hours}`} value={`${slot.day} (${slot.hours})`}>
                      {slot.day} : {slot.hours}
                    </option>
                  ))}
                  <option value="Autre créneau à convenir">Autre créneau à convenir</option>
                </select>
              </div>

              {/* Coordonnées élève */}
              <div className="form-two-cols">
                <div className="form-group-field">
                  <label className="field-label">Votre nom complet</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="Ex: Babacar Diop"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-field">
                  <label className="field-label">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    className="form-input-clean"
                    placeholder="Ex: +221 77 123 45 67"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Notes / Objectif */}
              <div className="form-group-field">
                <label className="field-label">Objectif spécifique ou chapitre à travailler (optionnel)</label>
                <textarea
                  className="form-textarea-clean"
                  rows={2}
                  placeholder="Ex : Révision des suites géométriques et exercices du Bac 2024..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Total & Bouton d'envoi */}
              <div className="booking-modal-footer">
                <div className="total-calculation-wrap">
                  <span className="total-label">Tarif calculé :</span>
                  <strong className="total-price">
                    {totalAmount.toLocaleString('fr-FR')} FCFA
                  </strong>
                  <span className="total-detail">
                    ({professor.hourlyRate.toLocaleString('fr-FR')} FCFA × {durationHours}h)
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-submit-booking"
                  disabled={loading}
                >
                  {loading ? 'Validation en cours...' : 'Confirmer la séance'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
