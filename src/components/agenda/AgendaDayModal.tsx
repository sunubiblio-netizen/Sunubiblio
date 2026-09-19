'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AgendaItem, AgendaItemType } from '@/types/agenda';

interface AgendaDayModalProps {
  isOpen: boolean;
  selectedDate: string; // YYYY-MM-DD
  items: AgendaItem[];
  onClose: () => void;
  onCreateItem: (item: AgendaItem) => void;
  onSelectItem: (item: AgendaItem) => void;
  onJoinVisio: (item: AgendaItem) => void;
  onOpenNewModal?: (date?: string, type?: AgendaItemType | 'visio') => void;
}

const TYPE_OPTIONS: { type: AgendaItemType; label: string; icon: string }[] = [
  { type: 'evenement', label: 'Événement', icon: '🔔' },
  { type: 'rdv', label: 'Rendez-vous', icon: '🤝' },
  { type: 'cours', label: 'Cours/Séance', icon: '📚' },
  { type: 'tache', label: 'Tâche', icon: '✅' },
  { type: 'rappel', label: 'Rappel', icon: '⏰' },
  { type: 'visio', label: 'Visio', icon: '🎥' },
];

const DURATION_PRESETS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1h', value: 60 },
  { label: '1h 30', value: 90 },
  { label: '2h', value: 120 },
];

export const AgendaDayModal: React.FC<AgendaDayModalProps> = ({
  isOpen,
  selectedDate,
  items,
  onClose,
  onCreateItem,
  onSelectItem,
  onJoinVisio,
  onOpenNewModal,
}) => {
  const router = useRouter();

  // Filtrer les événements de la date sélectionnée
  const dateEvents = useMemo(() => {
    return items.filter((it) => it.date === selectedDate);
  }, [items, selectedDate]);

  // Mode d'affichage interne : 'view' (liste des événements existants) ou 'create' (formulaire d'ajout)
  const [viewMode, setViewMode] = useState<'view' | 'create'>('view');

  // État du formulaire de création
  const [type, setType] = useState<AgendaItemType>('evenement');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInstantVisioStarting, setIsInstantVisioStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mémoriser la position de scroll pour qu'elle ne bouge absolument pas
  const scrollYRef = useRef<number>(0);

  // À l'ouverture : initialiser la vue et bloquer le défilement de fond de façon étanche
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Si la date a des événements, on montre la liste, sinon on montre directement l'état vide avec "+ Ajouter"
      setViewMode('view');
      setDate(selectedDate);
      setType('evenement');
      setTitle('');
      setDescription('');
      setErrorMessage(null);
      setIsSubmitting(false);
      setIsInstantVisioStarting(false);

      return () => {
        document.body.style.overflow = originalOverflow;
        // Restaurer la position exacte sans le moindre saut
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isOpen, selectedDate]);

  // Fermeture par la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Date formatée en français
  const formattedDateTitle = useMemo(() => {
    try {
      const d = new Date(selectedDate + 'T12:00:00');
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Calcul du créneau de fin
  const formattedEndTime = useMemo(() => {
    const [h, m] = startTime.split(':').map(Number);
    const total = h * 60 + m + durationMinutes;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, durationMinutes]);

  // Placeholder dynamique selon le type
  const titlePlaceholder = useMemo(() => {
    switch (type) {
      case 'evenement':
        return 'Ex: Dépôt dossier FASTEF, Conférence...';
      case 'rdv':
        return 'Ex: Rendez-vous d’orientation pédagogique...';
      case 'cours':
        return 'Ex: Séance de révision Bac Mathématiques...';
      case 'tache':
        return 'Ex: Rédiger le devoir de français...';
      case 'rappel':
        return 'Ex: Vérifier les inscriptions au concours...';
      case 'visio':
        return 'Ex: Révision collective Visio en direct...';
      default:
        return 'Titre de l’élément...';
    }
  }, [type]);

  // 1. Action : Démarrer immédiatement la Visio existante
  const handleStartInstantVisio = async () => {
    setErrorMessage(null);
    setIsInstantVisioStarting(true);

    try {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const todayIso = now.toISOString().split('T')[0];

      const res = await fetch('/api/agenda/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Session Visio en direct',
          type: 'visio',
          date: todayIso,
          startTime: `${currentHours}:${currentMinutes}`,
          durationMinutes: 60,
          mode: 'visio',
          subject: 'Visioconférence',
          isInstant: true,
          description: description.trim() || 'Session Visio démarrée instantanément depuis le Calendrier.',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors du lancement de la Visio.');
        setIsInstantVisioStarting(false);
        return;
      }

      // Ajouter la session active à l'agenda
      onCreateItem(data.item);
      setIsInstantVisioStarting(false);
      onClose();

      // Démarrer immédiatement la Visio existante (/visio)
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
      setIsInstantVisioStarting(false);
    }
  };

  // 2. Action : Soumettre la création d'un élément
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Veuillez saisir un titre pour cet élément.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const isVisio = type === 'visio';
      const res = await fetch('/api/agenda/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          type,
          date,
          startTime,
          durationMinutes,
          description: description.trim(),
          mode: isVisio ? 'visio' : type === 'cours' || type === 'rdv' ? 'visio' : 'en_ligne',
          subject: isVisio ? 'Visioconférence' : type === 'cours' ? 'Cours' : 'Personnel',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur de validation lors de la création.');
        setIsSubmitting(false);
        return;
      }

      // Ajout immédiat à l'agenda
      onCreateItem(data.item);
      setIsSubmitting(false);

      // Revenir à la liste des événements mis à jour pour cette date
      setViewMode('view');
    } catch {
      setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="day-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      onTouchMove={(e) => {
        // Empêche le scrolling élastique de l'arrière-plan sur mobile
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div className="day-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Poignée de glissement tactile pour mobile */}
        <div className="mobile-handle" aria-hidden="true">
          <span className="handle-bar" />
        </div>

        {/* ── EN-TÊTE COMPACT ── */}
        <div className="day-modal-header">
          <div className="header-info">
            {viewMode === 'create' && dateEvents.length > 0 ? (
              <button
                type="button"
                className="btn-back-link"
                onClick={() => setViewMode('view')}
              >
                ‹ Voir les éléments ({dateEvents.length})
              </button>
            ) : (
              <span className="header-badge">Date sélectionnée</span>
            )}
            <h3 className="header-title">{formattedDateTitle}</h3>
          </div>

          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* ── MESSAGE D'ERREUR SI NÉCESSAIRE ── */}
        {errorMessage && (
          <div className="day-error-alert" role="alert">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* ── CORPS DU MODAL : VUE LISTE OU FORMULAIRE ── */}
        <div className="day-modal-body">
          {viewMode === 'view' ? (
            /* 1. VUE DES ÉLÉMENTS EXISTANTS */
            <div className="view-list-pane">
              {dateEvents.length === 0 ? (
                /* S'il n'y en a aucun : afficher état vide + « + Ajouter » */
                <div className="empty-events-box">
                  <span className="empty-box-icon">📅</span>
                  <p className="empty-box-msg">Aucun élément prévu pour cette date.</p>
                  <button
                    type="button"
                    className="btn-add-primary"
                    onClick={() => {
                      if (onOpenNewModal) {
                        onOpenNewModal(selectedDate, 'evenement');
                        onClose();
                      } else {
                        setViewMode('create');
                      }
                    }}
                  >
                    <span className="plus-symbol">+</span>
                    <span>Ajouter</span>
                  </button>
                </div>
              ) : (
                /* S'il y a des éléments existants : les afficher + « + Ajouter » */
                <div className="existing-events-box">
                  <div className="events-count-row">
                    <span className="events-count-label">
                      {dateEvents.length} élément{dateEvents.length > 1 ? 's' : ''} prévu{dateEvents.length > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      className="btn-add-small"
                      onClick={() => {
                        if (onOpenNewModal) {
                          onOpenNewModal(selectedDate, 'evenement');
                          onClose();
                        } else {
                          setViewMode('create');
                        }
                      }}
                    >
                      + Ajouter
                    </button>
                  </div>

                  <div className="events-items-list">
                    {dateEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`item-row type-${evt.type}`}
                        onClick={() => {
                          onSelectItem(evt);
                          onClose();
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="item-time">
                          <span className="t-start">{evt.startTime}</span>
                          <span className="t-end">{evt.endTime}</span>
                        </div>

                        <div className="item-details">
                          <div className="item-title-line">
                            <span className="item-sticker">{evt.sticker || '📅'}</span>
                            <span className="item-title">{evt.title}</span>
                          </div>
                          {evt.subject && <span className="item-sub">{evt.subject}</span>}
                          {evt.professorName && (
                            <span className="item-prof">Avec {evt.professorName}</span>
                          )}
                        </div>

                        <div className="item-action">
                          {evt.mode === 'visio' && evt.status === 'today' && evt.visioAvailable ? (
                            <button
                              type="button"
                              className="btn-join-direct"
                              onClick={(e) => {
                                e.stopPropagation();
                                onJoinVisio(evt);
                              }}
                            >
                              Rejoindre
                            </button>
                          ) : (
                            <span className="item-chevron">›</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn-add-bottom"
                    onClick={() => setViewMode('create')}
                  >
                    + Ajouter un élément à cette date
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 2. VUE FORMULAIRE DE CRÉATION COMPACT */
            <form onSubmit={handleCreateSubmit} className="create-form-pane">
              {/* Sélecteur de type d'élément */}
              <div className="form-group">
                <label className="field-label">Type d’élément à créer</label>
                <div className="types-grid">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      className={`type-pill ${type === opt.type ? 'active' : ''} ${
                        opt.type === 'visio' ? 'pill-visio' : ''
                      }`}
                      onClick={() => setType(opt.type)}
                    >
                      <span className="pill-icon">{opt.icon}</span>
                      <span className="pill-txt">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Encadré spécifique Visio : Démarrer maintenant ou Planifier */}
              {type === 'visio' && (
                <div className="visio-direct-card">
                  <div className="visio-card-head">
                    <span className="visio-live-dot" />
                    <strong>Visioconférence Sunubiblio</strong>
                  </div>
                  <div className="visio-options-row">
                    <button
                      type="button"
                      className="btn-visio-start-now"
                      onClick={handleStartInstantVisio}
                      disabled={isInstantVisioStarting || isSubmitting}
                      title="Démarrer immédiatement la Visio existante"
                    >
                      <span>⚡</span>
                      <span>
                        {isInstantVisioStarting ? 'Lancement...' : 'Démarrer maintenant'}
                      </span>
                    </button>
                    <span className="visio-or">ou</span>
                    <span className="visio-plan-txt">Planifier ci-dessous :</span>
                  </div>
                </div>
              )}

              {/* Titre */}
              <div className="form-group">
                <label className="field-label" htmlFor="day-item-title">
                  Titre <span className="req">*</span>
                </label>
                <input
                  id="day-item-title"
                  type="text"
                  required
                  autoFocus
                  className="field-input"
                  placeholder={titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Date & Heure */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="field-label" htmlFor="day-item-date">
                    Date
                  </label>
                  <input
                    id="day-item-date"
                    type="date"
                    required
                    className="field-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label" htmlFor="day-item-time">
                    Heure
                  </label>
                  <input
                    id="day-item-time"
                    type="time"
                    required
                    className="field-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Durée avec presets rapides */}
              <div className="form-group">
                <div className="duration-label-row">
                  <label className="field-label">Durée</label>
                  <span className="duration-calc-badge">
                    Fin estimée : <strong>{formattedEndTime}</strong> ({durationMinutes} min)
                  </span>
                </div>
                <div className="duration-presets-grid">
                  {DURATION_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`dur-pill ${durationMinutes === p.value ? 'active' : ''}`}
                      onClick={() => setDurationMinutes(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description courte (optionnelle) */}
              <div className="form-group">
                <label className="field-label" htmlFor="day-item-desc">
                  Notes ou description (optionnel)
                </label>
                <textarea
                  id="day-item-desc"
                  rows={2}
                  className="field-input field-textarea"
                  placeholder="Détails essentiels, objectifs ou lien..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Boutons d'action */}
              <div className="form-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    if (dateEvents.length > 0) {
                      setViewMode('view');
                    } else {
                      onClose();
                    }
                  }}
                  disabled={isSubmitting || isInstantVisioStarting}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className={`btn-create-submit ${type === 'visio' ? 'btn-create-visio' : ''}`}
                  disabled={isSubmitting || isInstantVisioStarting}
                >
                  {isSubmitting ? (
                    <span>Création...</span>
                  ) : type === 'visio' ? (
                    <span>Planifier la Visio 🎥</span>
                  ) : (
                    <span>Créer</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ── OVERLAY FIXE SANS DÉPLACEMENT DE SCROLL ── */
        .day-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.46);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fade-in 0.16s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── CONTENEUR COMPACT ── */
        .day-modal-container {
          background: #ffffff;
          border-radius: 18px;
          width: min(470px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
          display: flex;
          flex-direction: column;
          animation: pop-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pop-up {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .mobile-handle {
          display: none;
          justify-content: center;
          padding: 10px 0 2px;
        }

        .handle-bar {
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: #cbd5e1;
        }

        /* ── EN-TÊTE ── */
        .day-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .btn-back-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 11.5px;
          font-weight: 700;
          color: #4f46e5;
          cursor: pointer;
          text-align: left;
          margin-bottom: 2px;
        }

        .btn-back-link:hover {
          text-decoration: underline;
        }

        .header-badge {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
        }

        .header-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          text-transform: capitalize;
        }

        .btn-close-modal {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }

        .btn-close-modal:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .day-error-alert {
          margin: 10px 20px 0;
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #b91c1c;
          font-size: 12.5px;
        }

        .day-modal-body {
          padding: 16px 20px 20px;
        }

        /* ── ÉLÉMENTS EXISTANTS ── */
        .view-list-pane {
          display: flex;
          flex-direction: column;
        }

        .empty-events-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 10px 10px;
          gap: 8px;
        }

        .empty-box-icon {
          font-size: 32px;
        }

        .empty-box-msg {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
          font-weight: 500;
        }

        .btn-add-primary {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 24px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(79, 70, 229, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-add-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(79, 70, 229, 0.4);
        }

        .plus-symbol {
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
        }

        .existing-events-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .events-count-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .events-count-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #475569;
        }

        .btn-add-small {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
        }

        .events-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 260px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .item-row:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .item-time {
          display: flex;
          flex-direction: column;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          min-width: 44px;
        }

        .t-start {
          color: #0f172a;
        }

        .item-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .item-sticker {
          font-size: 13px;
        }

        .item-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-sub,
        .item-prof {
          font-size: 11px;
          color: #64748b;
        }

        .btn-join-direct {
          background: #7c3aed;
          color: #ffffff;
          border: none;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .item-chevron {
          font-size: 16px;
          color: #94a3b8;
          font-weight: 700;
        }

        .btn-add-bottom {
          width: 100%;
          padding: 9px;
          border-radius: 10px;
          border: 1.5px dashed rgba(79, 70, 229, 0.3);
          background: rgba(79, 70, 229, 0.04);
          color: #4f46e5;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-add-bottom:hover {
          background: rgba(79, 70, 229, 0.08);
          border-color: #4f46e5;
        }

        /* ── FORMULAIRE DE CRÉATION ── */
        .create-form-pane {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .req {
          color: #ef4444;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .type-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 7px 4px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          transition: all 0.15s ease;
        }

        .type-pill.active {
          background: rgba(79, 70, 229, 0.08);
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .type-pill.pill-visio.active {
          background: rgba(124, 58, 237, 0.1);
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .pill-icon {
          font-size: 13px;
        }

        .visio-direct-card {
          padding: 10px 12px;
          background: #f5f3ff;
          border: 1px solid rgba(196, 181, 253, 0.9);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .visio-card-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #6d28d9;
        }

        .visio-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
        }

        .visio-options-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
        }

        .btn-visio-start-now {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 7px;
          background: #7c3aed;
          color: #ffffff;
          border: none;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
        }

        .btn-visio-start-now:hover:not(:disabled) {
          background: #6d28d9;
        }

        .visio-or {
          color: #94a3b8;
          font-weight: 600;
        }

        .visio-plan-txt {
          color: #6d28d9;
          font-weight: 600;
        }

        .field-input {
          width: 100%;
          padding: 9px 12px;
          border-radius: 9px;
          border: 1.5px solid rgba(203, 213, 225, 0.9);
          font-size: 13.5px;
          color: #0f172a;
          background: #ffffff;
          transition: all 0.15s ease;
        }

        .field-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .field-textarea {
          resize: vertical;
          min-height: 48px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .duration-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .duration-calc-badge {
          font-size: 11px;
          color: #64748b;
        }

        .duration-calc-badge strong {
          color: #0f172a;
        }

        .duration-presets-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }

        .dur-pill {
          padding: 6px 2px;
          border-radius: 7px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.95);
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }

        .dur-pill.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }

        .form-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 4px;
        }

        .btn-cancel {
          padding: 9px 16px;
          border-radius: 9px;
          background: #f1f5f9;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-create-submit {
          padding: 9px 22px;
          border-radius: 9px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
          transition: transform 0.15s ease;
        }

        .btn-create-submit.btn-create-visio {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        }

        .btn-create-submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-create-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ── RESPONSIVE SUR MOBILE (BOTTOM-SHEET) ── */
        @media (max-width: 640px) {
          .day-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .day-modal-container {
            width: 100%;
            border-radius: 20px 20px 0 0;
            max-height: 85vh;
            animation: slide-bottom 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slide-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .mobile-handle {
            display: flex;
          }

          .types-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .duration-presets-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .form-footer-actions {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-create-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
