'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AgendaItem, AgendaItemType } from '@/types/agenda';

interface AgendaQuickCreateModalProps {
  isOpen: boolean;
  selectedDate: string; // YYYY-MM-DD
  initialType?: AgendaItemType;
  onClose: () => void;
  onCreateItem: (item: AgendaItem) => void;
}

const TYPE_OPTIONS: { type: AgendaItemType; label: string; icon: string }[] = [
  { type: 'evenement', label: 'Événement', icon: '🔔' },
  { type: 'rdv', label: 'Rendez-vous', icon: '🤝' },
  { type: 'cours', label: 'Cours / Séance', icon: '📚' },
  { type: 'visio', label: 'Visio', icon: '🎥' },
  { type: 'tache', label: 'Tâche', icon: '✅' },
  { type: 'rappel', label: 'Rappel', icon: '⏰' },
];

const DURATION_PRESETS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 heure', value: 60 },
  { label: '1h 30', value: 90 },
  { label: '2 heures', value: 120 },
];

export const AgendaQuickCreateModal: React.FC<AgendaQuickCreateModalProps> = ({
  isOpen,
  selectedDate,
  initialType = 'evenement',
  onClose,
  onCreateItem,
}) => {
  const router = useRouter();

  const [type, setType] = useState<AgendaItemType>(initialType);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'visio' | 'presentiel' | 'en_ligne'>('visio');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartingInstantVisio, setIsStartingInstantVisio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchroniser la date et le type initial lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) setDate(selectedDate);
      setType(initialType || 'evenement');
      setTitle('');
      setDescription('');
      setErrorMessage(null);
      setIsSubmitting(false);
      setIsStartingInstantVisio(false);
      if (initialType === 'visio') {
        setMode('visio');
      }
    }
  }, [isOpen, selectedDate, initialType]);

  // Fermer avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquer le défilement de l'arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calcul du créneau de fin
  const formattedEndTime = useMemo(() => {
    const [h, m] = startTime.split(':').map(Number);
    const total = h * 60 + m + durationMinutes;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, durationMinutes]);

  // Date formatée en français
  const formattedDateTitle = useMemo(() => {
    try {
      const d = new Date(date + 'T12:00:00');
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  }, [date]);

  // Placeholder dynamique
  const titlePlaceholder = useMemo(() => {
    switch (type) {
      case 'visio':
        return 'Ex: Révision collective Visio, Tutorat en direct...';
      case 'evenement':
        return 'Ex: Dépôt dossier FASTEF, Conférence...';
      case 'rdv':
        return 'Ex: Rendez-vous d’orientation pédagogique...';
      case 'cours':
        return 'Ex: Séance de révision Bac Mathématiques...';
      case 'tache':
        return 'Ex: Rédiger le devoir de philosophie...';
      case 'rappel':
        return 'Ex: Consulter les résultats du concours...';
      default:
        return 'Titre de l’activité...';
    }
  }, [type]);

  // 1. Action : Démarrer immédiatement la Visio existante
  const handleStartInstantVisio = async () => {
    setErrorMessage(null);
    setIsStartingInstantVisio(true);

    try {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const todayIso = now.toISOString().split('T')[0];

      const res = await fetch('/api/agenda/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || 'Session Visio en direct',
          type: 'visio',
          date: todayIso,
          startTime: `${currentHours}:${currentMinutes}`,
          durationMinutes: 60,
          mode: 'visio',
          subject: 'Visioconférence',
          isInstant: true,
          description: description.trim() || 'Session Visio démarrée instantanément depuis l’Agenda.',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors du lancement de la Visio.');
        setIsStartingInstantVisio(false);
        return;
      }

      // 1. Ajouter l'élément en direct à l'agenda de l'utilisateur
      onCreateItem(data.item);
      setIsStartingInstantVisio(false);
      onClose();

      // 2. Démarrer immédiatement la Visio existante (sans la modifier)
      try {
        const visioWin = window.open('/visio', '_blank');
        if (!visioWin || visioWin.closed || typeof visioWin.closed === 'undefined') {
          router.push('/visio');
        }
      } catch {
        router.push('/visio');
      }
    } catch {
      setErrorMessage('Connexion au serveur impossible pour démarrer la Visio.');
      setIsStartingInstantVisio(false);
    }
  };

  // 2. Action : Basculer le formulaire sur la planification d'une Visio
  const handleSelectVisioSchedule = () => {
    setType('visio');
    setMode('visio');
    if (!title.trim()) {
      setTitle('Séance de Visioconférence');
    }
  };

  // 3. Soumission normale du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Veuillez renseigner un titre pour cet élément.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const isVisioType = type === 'visio';
      const res = await fetch('/api/agenda/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          type,
          date,
          startTime,
          durationMinutes,
          description: description.trim(),
          mode: isVisioType ? 'visio' : type === 'cours' || type === 'rdv' ? mode : 'en_ligne',
          subject: isVisioType ? 'Visioconférence' : type === 'cours' ? 'Cours' : 'Personnel',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors de la validation du serveur.');
        setIsSubmitting(false);
        return;
      }

      // Ajout immédiat à l'agenda
      onCreateItem(data.item);
      setIsSubmitting(false);
      onClose();
    } catch {
      setErrorMessage('Connexion au serveur impossible. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="quick-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quick-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Poignée tactile pour mobile */}
        <div className="mobile-drag-handle mobile-only" aria-hidden="true">
          <span className="handle-bar" />
        </div>

        {/* En-tête */}
        <div className="quick-modal-header">
          <div className="header-text-group">
            <span className="header-subtitle">Ajouter à l’agenda</span>
            <h3 className="header-title">{formattedDateTitle}</h3>
          </div>

          <button
            type="button"
            className="quick-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Message d'erreur serveur si applicable */}
        {errorMessage && (
          <div className="quick-error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bloc Visio Express : Direct ou Planifié */}
        <div className="visio-shortcuts-card">
          <div className="visio-shortcuts-header">
            <div className="visio-shortcuts-badge">
              <span className="live-dot" />
              <span>Visioconférence Sunubiblio</span>
            </div>
            <span className="visio-shortcuts-hint">Intégré à l’Agenda</span>
          </div>

          <div className="visio-shortcuts-grid">
            <button
              type="button"
              className="btn-visio-instant"
              onClick={handleStartInstantVisio}
              disabled={isSubmitting || isStartingInstantVisio}
              title="Démarrer immédiatement la Visio existante"
            >
              <span className="btn-visio-icon">🎥</span>
              <div className="btn-visio-texts">
                <span className="btn-visio-title">
                  {isStartingInstantVisio ? 'Démarrage...' : 'Créer une Visio maintenant'}
                </span>
                <span className="btn-visio-sub">Démarre immédiatement la session</span>
              </div>
              <span className="btn-visio-pulse">⚡</span>
            </button>

            <button
              type="button"
              className={`btn-visio-schedule ${type === 'visio' ? 'active' : ''}`}
              onClick={handleSelectVisioSchedule}
              title="Planifier une Visio pour la date sélectionnée"
            >
              <span className="btn-visio-icon">📅</span>
              <div className="btn-visio-texts">
                <span className="btn-visio-title">Planifier une Visio</span>
                <span className="btn-visio-sub">Pour le {date.split('-').reverse().join('/')}</span>
              </div>
              <span className="btn-visio-arrow">›</span>
            </button>
          </div>
        </div>

        {/* Formulaire complet */}
        <form onSubmit={handleSubmit} className="quick-form-body">
          {/* 1. Sélecteur de type d'élément */}
          <div className="form-section">
            <label className="section-label">Type d’élément</label>
            <div className="types-pill-grid">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  className={`type-option-pill ${type === opt.type ? 'active' : ''} ${
                    opt.type === 'visio' ? 'pill-visio' : ''
                  }`}
                  onClick={() => {
                    setType(opt.type);
                    if (opt.type === 'visio') setMode('visio');
                  }}
                >
                  <span className="type-icon">{opt.icon}</span>
                  <span className="type-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Titre */}
          <div className="form-section">
            <label className="section-label" htmlFor="quick-title-input">
              Titre <span className="req-star">*</span>
            </label>
            <input
              id="quick-title-input"
              type="text"
              className="quick-input title-input"
              required
              autoFocus
              placeholder={titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 3. Horaires & Durée */}
          <div className="form-section times-grid">
            <div className="field-block">
              <label className="section-label" htmlFor="quick-time-input">
                Heure de début
              </label>
              <input
                id="quick-time-input"
                type="time"
                className="quick-input time-input"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="field-block">
              <label className="section-label" htmlFor="quick-duration-select">
                Durée
              </label>
              <select
                id="quick-duration-select"
                className="quick-input select-input"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              >
                {DURATION_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Indicateur de fin */}
          <div className="time-summary-pill">
            <span>Créneau : </span>
            <strong>
              {startTime} – {formattedEndTime} ({durationMinutes} min)
            </strong>
          </div>

          {/* 4. Modalité si Cours ou Rendez-vous */}
          {(type === 'cours' || type === 'rdv') && (
            <div className="form-section">
              <label className="section-label">Modalité</label>
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`mode-btn ${mode === 'visio' ? 'active' : ''}`}
                  onClick={() => setMode('visio')}
                >
                  🖥 Visio en direct
                </button>
                <button
                  type="button"
                  className={`mode-btn ${mode === 'presentiel' ? 'active' : ''}`}
                  onClick={() => setMode('presentiel')}
                >
                  📍 Présentiel
                </button>
              </div>
            </div>
          )}

          {/* 5. Description / Notes */}
          <div className="form-section">
            <label className="section-label" htmlFor="quick-desc-input">
              Description ou objectifs (optionnel)
            </label>
            <textarea
              id="quick-desc-input"
              className="quick-input desc-input"
              rows={2}
              placeholder={
                type === 'visio'
                  ? 'Objectifs de la session, lien de documents partagés...'
                  : 'Détails, liens, objectifs de la séance ou rappel...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Pied de modal avec bouton Créer / Planifier */}
          <div className="quick-modal-footer">
            <button
              type="button"
              className="btn-quick-cancel"
              onClick={onClose}
              disabled={isSubmitting || isStartingInstantVisio}
            >
              Annuler
            </button>

            <button
              type="submit"
              className={`btn-quick-submit ${type === 'visio' ? 'btn-submit-visio' : ''}`}
              disabled={isSubmitting || isStartingInstantVisio}
            >
              {isSubmitting ? (
                <span>Enregistrement...</span>
              ) : type === 'visio' ? (
                <>
                  <span>Planifier la Visio</span>
                  <span style={{ fontSize: '14px' }}>🎥</span>
                </>
              ) : (
                <>
                  <span>Créer l’élément</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .quick-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fade-in 0.18s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .quick-modal-container {
          background: #ffffff;
          border-radius: 20px;
          width: min(510px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
          display: flex;
          flex-direction: column;
          animation: pop-up 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pop-up {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .mobile-drag-handle {
          display: none;
          justify-content: center;
          padding-top: 10px;
          padding-bottom: 2px;
        }

        .handle-bar {
          width: 44px;
          height: 4px;
          border-radius: 4px;
          background: #cbd5e1;
        }

        .quick-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .header-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-subtitle {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6366f1;
        }

        .header-title {
          font-size: 16.5px;
          font-weight: 750;
          color: #0f172a;
          margin: 0;
          text-transform: capitalize;
        }

        .quick-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .quick-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .quick-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 22px 0;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 500;
        }

        /* ── BANDEAU VISIO EXPRESS ── */
        .visio-shortcuts-card {
          margin: 14px 22px 4px;
          padding: 12px 14px;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1px solid rgba(196, 181, 253, 0.85);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .visio-shortcuts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .visio-shortcuts-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 750;
          color: #6d28d9;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .visio-shortcuts-hint {
          font-size: 11px;
          color: #7c3aed;
          font-weight: 600;
        }

        .visio-shortcuts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .btn-visio-instant {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          background: #7c3aed;
          color: #ffffff;
          border: 1px solid #6d28d9;
          cursor: pointer;
          text-align: left;
          transition: all 0.16s ease;
          box-shadow: 0 3px 10px rgba(124, 58, 237, 0.28);
        }

        .btn-visio-instant:hover:not(:disabled) {
          background: #6d28d9;
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(124, 58, 237, 0.38);
        }

        .btn-visio-instant:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-visio-schedule {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          background: #ffffff;
          color: #4c1d95;
          border: 1.5px solid rgba(196, 181, 253, 0.9);
          cursor: pointer;
          text-align: left;
          transition: all 0.16s ease;
        }

        .btn-visio-schedule:hover {
          background: #fbfbfe;
          border-color: #8b5cf6;
        }

        .btn-visio-schedule.active {
          background: #ede9fe;
          border-color: #7c3aed;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
        }

        .btn-visio-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .btn-visio-texts {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .btn-visio-title {
          font-size: 12px;
          font-weight: 750;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-visio-sub {
          font-size: 10px;
          opacity: 0.82;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-visio-pulse {
          font-size: 12px;
          color: #fde047;
        }

        .btn-visio-arrow {
          font-size: 15px;
          font-weight: 700;
          color: #7c3aed;
        }

        /* ── FORMULAIRE ── */
        .quick-form-body {
          padding: 14px 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-label {
          font-size: 12.5px;
          font-weight: 650;
          color: #334155;
        }

        .req-star {
          color: #ef4444;
        }

        .types-pill-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .type-option-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 6px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          cursor: pointer;
          transition: all 0.15s ease;
          color: #475569;
        }

        .type-option-pill.active {
          background: rgba(79, 70, 229, 0.08);
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .type-option-pill.pill-visio.active {
          background: rgba(124, 58, 237, 0.1);
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .type-icon {
          font-size: 14px;
        }

        .type-label {
          font-size: 12px;
          font-weight: 700;
        }

        .quick-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(203, 213, 225, 0.85);
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          transition: all 0.15s ease;
        }

        .quick-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .desc-input {
          resize: vertical;
          min-height: 54px;
        }

        .times-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .time-summary-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          background: #f1f5f9;
          font-size: 12.5px;
          color: #475569;
        }

        .time-summary-pill strong {
          color: #0f172a;
        }

        .mode-toggle-group {
          display: flex;
          gap: 8px;
        }

        .mode-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #f8fafc;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          font-weight: 700;
        }

        .quick-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
        }

        .btn-quick-cancel {
          padding: 10px 18px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-quick-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-quick-submit.btn-submit-visio {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
        }

        .btn-quick-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
        }

        .btn-quick-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Responsive : Bottom sheet sur Mobile */
        @media (max-width: 640px) {
          .quick-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .quick-modal-container {
            width: 100%;
            border-radius: 20px 20px 0 0;
            max-height: 88vh;
            animation: slide-bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slide-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .mobile-drag-handle {
            display: flex;
          }

          .visio-shortcuts-grid {
            grid-template-columns: 1fr;
          }

          .types-pill-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-modal-footer {
            flex-direction: column;
          }

          .btn-quick-cancel,
          .btn-quick-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
