'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { AgendaItem, AgendaItemType } from '@/types/agenda';
import { TeachingMode, ProfessorProfile } from '@/types/professor';
import { INITIAL_PROFESSORS } from '@/data/mockProfessors';
import { AGENDA_REFERENCE_DATE } from '@/data/mockAgenda';

export interface AgendaNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateItem: (newItem: AgendaItem) => void;
  initialDate?: string;
  initialType?: AgendaItemType | 'visio';
}

const COMMON_SUBJECTS = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT & Biologie',
  'Français & Littérature',
  'Anglais',
  'Philosophie',
  'Informatique & IA',
];

const DURATION_OPTIONS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 heure', value: 60 },
  { label: '1h 30', value: 90 },
  { label: '2 heures', value: 120 },
];

const COMMON_HOURS = ['09:00', '10:30', '14:00', '16:00', '18:00'];

export const AgendaNewModal: React.FC<AgendaNewModalProps> = ({
  isOpen,
  onClose,
  onCreateItem,
  initialDate,
  initialType,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // État d'ouverture indépendant pour chaque section
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    prof: true,
    datetime: true,
    subject: false,
    mode: false,
    duration: false,
    notes: false,
  });

  // Form State
  const [itemType, setItemType] = useState<AgendaItemType>('cours');
  const [selectedProfId, setSelectedProfId] = useState<string>(INITIAL_PROFESSORS[0]?.id || '');
  const [subject, setSubject] = useState<string>(INITIAL_PROFESSORS[0]?.subjects[0] || 'Mathématiques');
  const [mode, setMode] = useState<TeachingMode>('visio');
  const [date, setDate] = useState<string>(initialDate || AGENDA_REFERENCE_DATE);
  const [startTime, setStartTime] = useState<string>('16:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronisation lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        setDate(initialDate);
      } else {
        setDate(AGENDA_REFERENCE_DATE);
      }

      if (initialType) {
        if (initialType === 'visio') {
          setItemType('cours');
          setMode('visio');
          setOpenSections({
            type: true,
            prof: false,
            datetime: true,
            subject: false,
            mode: true,
            duration: false,
            notes: false,
          });
        } else {
          setItemType(initialType);
          setOpenSections({
            type: true,
            prof: initialType === 'cours' || initialType === 'rdv',
            datetime: true,
            subject: false,
            mode: false,
            duration: false,
            notes: false,
          });
        }
      } else {
        setOpenSections({
          type: true,
          prof: true,
          datetime: true,
          subject: false,
          mode: false,
          duration: false,
          notes: false,
        });
      }
    }
  }, [isOpen, initialDate, initialType]);

  // ── VERROUILLAGE TOTAL ET IMMOBILE DE L'ARRIÈRE-PLAN (IDENTIQUE AUX FILTRES SUNUBIBLIO) ──
  useEffect(() => {
    if (!isOpen) return;

    // 1. Sauvegarder la position exacte du scroll avant l'ouverture
    const initialScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    // 2. Sauvegarder les styles de scroll existants
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const prevBodyScrollBehavior = document.body.style.scrollBehavior;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;

    // Verrouiller strictement le défilement global
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.overscrollBehavior = 'none';

    // 3. Interception ciblée des gestes tactiles
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollBody = target?.closest('.agenda-modal-scroll-body') as HTMLElement | null;

      // Si le geste tactile se produit en dehors du corps défilable du modal, l'annuler immédiatement
      if (!scrollBody) {
        if (e.cancelable) {
          e.preventDefault();
        }
        return;
      }

      // Si le geste est à l'intérieur, empêcher le rebond aux extrémités haut et bas
      if (e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const isPullingDown = currentY > touchStartY;
        const isPushingUp = currentY < touchStartY;

        const isAtTop = scrollBody.scrollTop <= 0;
        const isAtBottom = scrollBody.scrollTop + scrollBody.clientHeight >= scrollBody.scrollHeight - 1;

        if ((isAtTop && isPullingDown) || (isAtBottom && isPushingUp)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollBody = target?.closest('.agenda-modal-scroll-body');
      if (!scrollBody) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Ancrage strict sur la coordonnée initiale
    const handleWindowScroll = () => {
      if (window.scrollY !== initialScrollY) {
        window.scrollTo({ top: initialScrollY, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);

      // Restaurer le scroll d'arrière-plan sans aucun saut
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.scrollTo({ top: initialScrollY, left: 0, behavior: 'instant' as ScrollBehavior });

      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
        document.body.style.scrollBehavior = prevBodyScrollBehavior;
        document.documentElement.style.overscrollBehavior = prevOverscroll;
      });
    };
  }, [isOpen, onClose]);

  // Professeur sélectionné
  const currentProf = useMemo(() => {
    return (
      INITIAL_PROFESSORS.find((p: ProfessorProfile) => p.id === selectedProfId) ||
      INITIAL_PROFESSORS[0]
    );
  }, [selectedProfId]);

  // Calcul de l'heure de fin
  const endTime = useMemo(() => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, durationMinutes]);

  // Calcul du tarif estimé
  const estimatedPrice = useMemo(() => {
    if (itemType !== 'cours' && itemType !== 'rdv' && itemType !== 'formation') return 0;
    const rate = currentProf ? currentProf.hourlyRate : 5000;
    return Math.round((rate * durationMinutes) / 60);
  }, [itemType, currentProf, durationMinutes]);

  // Résumés formatés pour les sections
  const typeSummary = useMemo(() => {
    switch (itemType) {
      case 'cours':
        return 'Cours particulier';
      case 'rdv':
        return 'Rendez-vous';
      case 'evenement':
        return customTitle.trim() ? customTitle.trim() : 'Événement';
      case 'formation':
        return 'Formation';
      case 'examen':
        return 'Évaluation';
      default:
        return 'Activité';
    }
  }, [itemType, customTitle]);

  const profSummary = useMemo(() => {
    return currentProf ? currentProf.fullName : 'Non défini';
  }, [currentProf]);

  const modeSummary = useMemo(() => {
    if (mode === 'visio') return 'Visio';
    if (mode === 'presentiel') return 'Présentiel';
    return 'À domicile';
  }, [mode]);

  const dateTimeSummary = useMemo(() => {
    try {
      const [y, m, d] = date.split('-').map(Number);
      const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      const monthStr = months[m - 1] || '';
      return `${d} ${monthStr} · ${startTime}`;
    } catch {
      return `${date} · ${startTime}`;
    }
  }, [date, startTime]);

  const durationSummary = useMemo(() => {
    if (durationMinutes === 60) return '1 heure';
    if (durationMinutes === 90) return '1h 30';
    if (durationMinutes === 120) return '2 heures';
    return `${durationMinutes} min`;
  }, [durationMinutes]);

  const notesSummary = useMemo(() => {
    if (!description.trim()) return 'Optionnel';
    return description.length > 20 ? `${description.slice(0, 20)}…` : description;
  }, [description]);

  // Basculement indépendant d'une section
  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Action : Lancer Visio maintenant (système Visio existant préservé)
  const handleStartInstantVisio = () => {
    onClose();
    try {
      const visioWin = window.open('/visio', '_blank');
      if (!visioWin || visioWin.closed || typeof visioWin.closed === 'undefined') {
        router.push('/visio');
      }
    } catch {
      router.push('/visio');
    }
  };

  // Action : Planifier une Visio
  const handleSelectPlanVisio = () => {
    setMode('visio');
    setItemType('cours');
    setOpenSections((prev) => ({
      ...prev,
      datetime: true,
      mode: true,
    }));
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let sticker = '📅';
    let badgeLabel = 'Rendez-vous';
    if (itemType === 'cours') {
      sticker = mode === 'visio' ? '🖥' : '📚';
      badgeLabel = 'Cours particulier';
    } else if (itemType === 'formation') {
      sticker = '🎓';
      badgeLabel = 'Formation';
    } else if (itemType === 'evenement') {
      sticker = '🔔';
      badgeLabel = 'Événement';
    } else if (itemType === 'examen') {
      sticker = '✨';
      badgeLabel = 'Évaluation';
    }

    const title =
      itemType === 'evenement' || itemType === 'examen'
        ? customTitle.trim() || `${subject}`
        : `${subject} — avec ${currentProf.fullName.split(' ').slice(-1)[0]}`;

    const isToday = date === AGENDA_REFERENCE_DATE;

    const newItem: AgendaItem = {
      id: `agenda-user-${Date.now()}`,
      type: itemType,
      title,
      subject,
      date,
      startTime,
      endTime,
      durationMinutes,
      mode,
      status: isToday ? 'today' : 'upcoming',
      professorId: itemType === 'evenement' || itemType === 'examen' ? undefined : currentProf.id,
      professorName: itemType === 'evenement' || itemType === 'examen' ? undefined : currentProf.fullName,
      professorAvatar: itemType === 'evenement' || itemType === 'examen' ? undefined : currentProf.avatarUrl,
      professorVerified: itemType === 'evenement' || itemType === 'examen' ? undefined : currentProf.verified,
      professorRating: itemType === 'evenement' || itemType === 'examen' ? undefined : currentProf.rating,
      visioLink: mode === 'visio' ? `https://visio.sunubiblio.com/session-${Date.now()}` : undefined,
      visioAvailable: isToday && mode === 'visio',
      location: mode === 'presentiel' ? 'Centre Sunubiblio Dakar' : mode === 'domicile' ? 'À domicile' : undefined,
      description: description.trim() || undefined,
      price: estimatedPrice,
      currency: 'FCFA',
      isPaid: false,
      canCancel: true,
      sticker,
      badgeLabel,
    };

    onCreateItem(newItem);
    onClose();
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* ── 1. OVERLAY DE FOND : PARFAITEMENT CENTRÉ, COUVRE 100% DU VIEWPORT ── */}
      <div
        className="agenda-modal-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Nouveau rendez-vous"
      >
        {/* ── 2. CARTE DU MODAL : PROPRE, BLANCHE / GLASS, SANS AUCUN TRAIT LUMINEUX À L'INTÉRIEUR ── */}
        <div
          className="agenda-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* EN-TÊTE DU MODAL */}
          <div className="agenda-modal-header">
            <div className="header-badge-group">
              <span className="header-sparkle-dot" aria-hidden="true" />
              <span className="header-top-tag">📅 Agenda Sunubiblio</span>
            </div>
            <div className="header-main-row">
              <h2 className="header-title">Nouveau rendez-vous</h2>
              <button
                type="button"
                className="modal-close-button"
                onClick={onClose}
                aria-label="Fermer le formulaire"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* RACCOURCI VISIO EXPRESS (CRÉER MAINTENANT OU PLANIFIER) */}
          <div className="visio-express-bar">
            <button
              type="button"
              className="btn-visio-instant"
              onClick={handleStartInstantVisio}
              title="Démarrer immédiatement une visioconférence"
            >
              <span className="visio-btn-icon">🎥</span>
              <div className="visio-btn-texts">
                <strong>Créer une Visio maintenant</strong>
                <small>Lancer la session directe</small>
              </div>
            </button>

            <button
              type="button"
              className={`btn-visio-plan ${mode === 'visio' ? 'active' : ''}`}
              onClick={handleSelectPlanVisio}
              title="Programmer une réunion Visio dans l'agenda"
            >
              <span className="visio-btn-icon">📅</span>
              <div className="visio-btn-texts">
                <strong>Planifier une Visio</strong>
                <small>Choisir date & heure</small>
              </div>
            </button>
          </div>

          {/* CORPS DÉFILABLE : SECTIONS REPLIABLES INDÉPENDANTES */}
          <form onSubmit={handleSubmit} className="agenda-modal-scroll-body" tabIndex={0}>
            <div className="accordion-stack">
              {/* 1. TYPE D'ACTIVITÉ */}
              <div className={`accordion-row ${openSections.type ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('type')}
                  aria-expanded={!!openSections.type}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.type ? '⌄' : '›'}</span>
                    <span className="trigger-icon">🎯</span>
                    <span className="trigger-label">Type d’activité</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{typeSummary}</span>
                  </div>
                </button>

                {openSections.type && (
                  <div className="accordion-panel-body">
                    <div className="type-chips-grid">
                      <button
                        type="button"
                        className={`choice-chip ${itemType === 'cours' ? 'selected' : ''}`}
                        onClick={() => {
                          setItemType('cours');
                          setOpenSections((prev) => ({ ...prev, prof: true }));
                        }}
                      >
                        <span>📚</span> Cours particulier
                      </button>
                      <button
                        type="button"
                        className={`choice-chip ${itemType === 'rdv' ? 'selected' : ''}`}
                        onClick={() => {
                          setItemType('rdv');
                          setOpenSections((prev) => ({ ...prev, prof: true }));
                        }}
                      >
                        <span>🤝</span> Rendez-vous
                      </button>
                      <button
                        type="button"
                        className={`choice-chip ${itemType === 'evenement' ? 'selected' : ''}`}
                        onClick={() => {
                          setItemType('evenement');
                          setOpenSections((prev) => ({ ...prev, subject: true }));
                        }}
                      >
                        <span>🔔</span> Événement libre
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. PROFESSEUR / FORMATEUR (affiché pour cours ou rdv) */}
              {(itemType === 'cours' || itemType === 'rdv') && (
                <div className={`accordion-row ${openSections.prof ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    className="accordion-trigger"
                    onClick={() => toggleSection('prof')}
                    aria-expanded={!!openSections.prof}
                  >
                    <div className="trigger-left">
                      <span className="trigger-chevron">{openSections.prof ? '⌄' : '›'}</span>
                      <span className="trigger-icon">👨‍🏫</span>
                      <span className="trigger-label">Professeur</span>
                    </div>
                    <div className="trigger-right">
                      <span className="trigger-summary">{profSummary}</span>
                    </div>
                  </button>

                  {openSections.prof && (
                    <div className="accordion-panel-body">
                      <div className="profs-options-list">
                        {INITIAL_PROFESSORS.map((p) => {
                          const isSelected = p.id === selectedProfId;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              className={`prof-option-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedProfId(p.id);
                                if (p.subjects && p.subjects[0]) setSubject(p.subjects[0]);
                              }}
                            >
                              <div className="prof-card-avatar">
                                {p.fullName.charAt(0)}
                              </div>
                              <div className="prof-card-info">
                                <strong>{p.fullName}</strong>
                                <span>{p.subjects.slice(0, 2).join(', ')} · {p.hourlyRate.toLocaleString('fr-FR')} FCFA/h</span>
                              </div>
                              {isSelected && <span className="prof-card-check">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. MATIÈRE / DOMAINE / TITRE */}
              <div className={`accordion-row ${openSections.subject ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('subject')}
                  aria-expanded={!!openSections.subject}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.subject ? '⌄' : '›'}</span>
                    <span className="trigger-icon">📖</span>
                    <span className="trigger-label">Matière / Domaine</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{subject}</span>
                  </div>
                </button>

                {openSections.subject && (
                  <div className="accordion-panel-body">
                    {itemType === 'evenement' && (
                      <div className="field-group" style={{ marginBottom: 12 }}>
                        <label className="field-sublabel">Titre personnalisé de l'événement</label>
                        <input
                          type="text"
                          className="native-text-input"
                          placeholder="Ex : Révision concours FASTEF, Rendu devoir..."
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="field-group">
                      <label className="field-sublabel">Choisir ou saisir une matière</label>
                      <div className="quick-subject-chips">
                        {COMMON_SUBJECTS.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            className={`sub-chip ${subject === sub ? 'selected' : ''}`}
                            onClick={() => setSubject(sub)}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="native-text-input"
                        placeholder="Autre matière..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. MODE D'ENSEIGNEMENT */}
              <div className={`accordion-row ${openSections.mode ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('mode')}
                  aria-expanded={!!openSections.mode}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.mode ? '⌄' : '›'}</span>
                    <span className="trigger-icon">{mode === 'visio' ? '🖥' : '📍'}</span>
                    <span className="trigger-label">Mode d’enseignement</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{modeSummary}</span>
                  </div>
                </button>

                {openSections.mode && (
                  <div className="accordion-panel-body">
                    <div className="mode-cards-row">
                      <button
                        type="button"
                        className={`mode-option-btn ${mode === 'visio' ? 'selected' : ''}`}
                        onClick={() => setMode('visio')}
                      >
                        <span className="mode-btn-ico">🖥</span>
                        <div className="mode-btn-texts">
                          <strong>Visio en direct</strong>
                          <small>Lien sécurisé Sunubiblio</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`mode-option-btn ${mode === 'presentiel' ? 'selected' : ''}`}
                        onClick={() => setMode('presentiel')}
                      >
                        <span className="mode-btn-ico">📍</span>
                        <div className="mode-btn-texts">
                          <strong>Présentiel</strong>
                          <small>Centre & Salle partenaire</small>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. DATE ET HEURE (Sélecteurs clairs jour, mois, année, heure) */}
              <div className={`accordion-row ${openSections.datetime ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('datetime')}
                  aria-expanded={!!openSections.datetime}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.datetime ? '⌄' : '›'}</span>
                    <span className="trigger-icon">📅</span>
                    <span className="trigger-label">Date & heure</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{dateTimeSummary}</span>
                  </div>
                </button>

                {openSections.datetime && (
                  <div className="accordion-panel-body">
                    <div className="datetime-fields-grid">
                      {/* Date */}
                      <div className="picker-box">
                        <label className="picker-label">Date (Jour / Mois / Année)</label>
                        <input
                          type="date"
                          className="native-datetime-input"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                        <div className="quick-date-shortcuts">
                          <button
                            type="button"
                            className="date-tag-btn"
                            onClick={() => setDate(AGENDA_REFERENCE_DATE)}
                          >
                            Aujourd’hui
                          </button>
                          <button
                            type="button"
                            className="date-tag-btn"
                            onClick={() => {
                              const d = new Date(AGENDA_REFERENCE_DATE);
                              d.setDate(d.getDate() + 1);
                              setDate(d.toISOString().split('T')[0]);
                            }}
                          >
                            Demain
                          </button>
                        </div>
                      </div>

                      {/* Heure */}
                      <div className="picker-box">
                        <label className="picker-label">Heure de début</label>
                        <input
                          type="time"
                          className="native-datetime-input"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                        <div className="quick-hour-shortcuts">
                          {COMMON_HOURS.map((hr) => (
                            <button
                              key={hr}
                              type="button"
                              className={`hour-tag-btn ${startTime === hr ? 'active' : ''}`}
                              onClick={() => setStartTime(hr)}
                            >
                              {hr}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. DURÉE */}
              <div className={`accordion-row ${openSections.duration ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('duration')}
                  aria-expanded={!!openSections.duration}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.duration ? '⌄' : '›'}</span>
                    <span className="trigger-icon">⏱</span>
                    <span className="trigger-label">Durée</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{durationSummary}</span>
                  </div>
                </button>

                {openSections.duration && (
                  <div className="accordion-panel-body">
                    <div className="duration-pills-row">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`duration-pill-btn ${durationMinutes === opt.value ? 'selected' : ''}`}
                          onClick={() => setDurationMinutes(opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="slot-preview-badge">
                      Fin prévue à <strong>{endTime}</strong> ({durationMinutes} minutes)
                    </div>
                  </div>
                )}
              </div>

              {/* 7. OBJECTIFS / NOTES */}
              <div className={`accordion-row ${openSections.notes ? 'expanded' : ''}`}>
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleSection('notes')}
                  aria-expanded={!!openSections.notes}
                >
                  <div className="trigger-left">
                    <span className="trigger-chevron">{openSections.notes ? '⌄' : '›'}</span>
                    <span className="trigger-icon">📝</span>
                    <span className="trigger-label">Objectifs / Notes</span>
                  </div>
                  <div className="trigger-right">
                    <span className="trigger-summary">{notesSummary}</span>
                  </div>
                </button>

                {openSections.notes && (
                  <div className="accordion-panel-body">
                    <textarea
                      className="native-textarea-input"
                      rows={3}
                      placeholder="Ex : Exercices du chapitre 3, questions sur la méthodologie, chapitres prioritaires..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RÉCAPITULATIF CRÉNEAU & TARIF */}
            {(itemType === 'cours' || itemType === 'rdv') && (
              <div className="modal-summary-box">
                <div className="summary-line">
                  <span className="sum-label">Créneau prévu</span>
                  <span className="sum-val">{dateTimeSummary} → {endTime}</span>
                </div>
                <div className="summary-line highlight">
                  <span className="sum-label">Tarif estimé</span>
                  <span className="sum-price">{estimatedPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            )}

            {/* PIED DE PAGE FIXE : ACTIONS */}
            <div className="modal-sticky-footer">
              <button
                type="button"
                className="btn-action-cancel"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-action-submit"
              >
                Confirmer la programmation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── 3. BORDURE LUMINEUSE 4 CÔTÉS INDÉPENDANTS (CIRCULE UNIQUEMENT SUR LE CONTENEUR EXTÉRIEUR DU MOBILE / VIEWPORT — SYSTÈME EXACT DES FILTRES SUNUBIBLIO) ── */}
      <div
        className="sunu-mobile-independent-frame"
        aria-hidden="true"
        style={{ zIndex: 99999999, pointerEvents: 'none' }}
      >
        {/* 1. TOP : Mouvement horizontal indépendant (gauche -> droite), Bleu -> Violet */}
        <div className="sunu-edge-bar sunu-edge-top">
          <div className="sunu-edge-track" />
          <div className="sunu-edge-beam-top" />
        </div>

        {/* 2. RIGHT : Mouvement vertical indépendant (haut -> bas), Violet -> Rose */}
        <div className="sunu-edge-bar sunu-edge-right">
          <div className="sunu-edge-track" />
          <div className="sunu-edge-beam-right" />
        </div>

        {/* 3. BOTTOM : Mouvement horizontal indépendant (droite -> gauche), Rose -> Magenta -> Violet */}
        <div className="sunu-edge-bar sunu-edge-bottom">
          <div className="sunu-edge-track" />
          <div className="sunu-edge-beam-bottom" />
        </div>

        {/* 4. LEFT : Mouvement vertical indépendant (bas -> haut), Violet -> Bleu */}
        <div className="sunu-edge-bar sunu-edge-left">
          <div className="sunu-edge-track" />
          <div className="sunu-edge-beam-left" />
        </div>
      </div>

      <style jsx>{`
        /* ── OVERLAY DE FOND GLASSMORPHISM : COUVRE 100% DU VIEWPORT ET RESTE STRICTEMENT FIXE ── */
        .agenda-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100dvh;
          background: rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(14px, env(safe-area-inset-top, 14px)) 14px max(14px, env(safe-area-inset-bottom, 14px)) 14px;
          z-index: 999990;
          touch-action: none;
          overscroll-behavior: none;
          animation: overlayFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── CARTE INTÉRIEURE DU MODAL (100% PROPRE, BLANCHE / GLASS, SANS AUCUNE LUMIÈRE À L'INTÉRIEUR) ── */
        .agenda-modal-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          max-height: min(740px, calc(100dvh - 28px));
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.28),
            0 0 0 1px rgba(99, 102, 241, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          overscroll-behavior: contain;
          user-select: none;
          animation: modalPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalPopIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* ── BORDURE MOBILE 4 CÔTÉS INDÉPENDANTS (CIRCULE UNIQUEMENT SUR LE CONTOUR EXTÉRIEUR DU MOBILE / VIEWPORT) ── */
        .sunu-mobile-independent-frame {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100dvh;
          pointer-events: none;
          z-index: 99999999;
          overflow: hidden;
        }

        .sunu-edge-bar {
          position: absolute;
          pointer-events: none;
          overflow: hidden;
        }

        .sunu-edge-track {
          position: absolute;
          inset: 0;
          background: rgba(99, 102, 241, 0.22);
        }

        /* ── 1. CÔTÉ TOP (Horizontal, Gauche -> Droite, Bleu -> Violet) ── */
        .sunu-edge-top {
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
        }

        .sunu-edge-beam-top {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 42%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #3b82f6 20%,
            #6366f1 60%,
            #8b5cf6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.95), 0 1px 5px rgba(99, 102, 241, 0.9);
          animation: beamMoveTop 2.8s linear infinite;
        }

        @keyframes beamMoveTop {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }

        /* ── 2. CÔTÉ RIGHT (Vertical, Haut -> Bas, Violet -> Rose) ── */
        .sunu-edge-right {
          top: 0;
          right: 0;
          bottom: 0;
          width: 2.5px;
        }

        .sunu-edge-beam-right {
          position: absolute;
          left: 0;
          right: 0;
          height: 42%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            #8b5cf6 20%,
            #a855f7 60%,
            #ec4899 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.95), -1px 0 5px rgba(168, 85, 247, 0.9);
          animation: beamMoveRight 2.8s linear infinite;
          animation-delay: 0.7s;
        }

        @keyframes beamMoveRight {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }

        /* ── 3. CÔTÉ BOTTOM (Horizontal, Droite -> Gauche, Rose -> Magenta -> Violet) ── */
        .sunu-edge-bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: 2.5px;
        }

        .sunu-edge-beam-bottom {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 42%;
          background: linear-gradient(
            270deg,
            transparent 0%,
            #ec4899 20%,
            #d946ef 55%,
            #8b5cf6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(217, 70, 239, 0.95), 0 -1px 5px rgba(236, 72, 153, 0.9);
          animation: beamMoveBottom 2.8s linear infinite;
          animation-delay: 1.4s;
        }

        @keyframes beamMoveBottom {
          0% { transform: translateX(250%); }
          100% { transform: translateX(-100%); }
        }

        /* ── 4. CÔTÉ LEFT (Vertical, Bas -> Haut, Violet -> Bleu) ── */
        .sunu-edge-left {
          top: 0;
          left: 0;
          bottom: 0;
          width: 2.5px;
        }

        .sunu-edge-beam-left {
          position: absolute;
          left: 0;
          right: 0;
          height: 42%;
          background: linear-gradient(
            0deg,
            transparent 0%,
            #a855f7 20%,
            #6366f1 60%,
            #3b82f6 90%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.95), 1px 0 5px rgba(59, 130, 246, 0.9);
          animation: beamMoveLeft 2.8s linear infinite;
          animation-delay: 2.1s;
        }

        @keyframes beamMoveLeft {
          0% { transform: translateY(250%); }
          100% { transform: translateY(-100%); }
        }

        /* ── EN-TÊTE DU MODAL ── */
        .agenda-modal-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          background: #ffffff;
          flex-shrink: 0;
        }

        .header-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .header-sparkle-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px rgba(99, 102, 241, 0.8);
        }

        .header-top-tag {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .modal-close-button {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-close-button:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* ── BARRE VISIO EXPRESS ── */
        .visio-express-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, rgba(238, 242, 255, 0.7) 0%, rgba(250, 245, 255, 0.7) 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          flex-shrink: 0;
        }

        .btn-visio-instant,
        .btn-visio-plan {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 12px;
          border: 1px solid rgba(224, 231, 255, 0.9);
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .btn-visio-instant:hover {
          border-color: #6366f1;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
        }

        .btn-visio-plan.active,
        .btn-visio-plan:hover {
          border-color: #a855f7;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.12);
        }

        .visio-btn-icon {
          font-size: 18px;
          line-height: 1;
        }

        .visio-btn-texts {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .visio-btn-texts strong {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .visio-btn-texts small {
          font-size: 10px;
          color: #64748b;
        }

        /* ── CORPS DÉFILABLE DU FORMULAIRE ── */
        .agenda-modal-scroll-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          outline: none;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        /* ── PILE D'ACCORDÉONS COMPACTS ── */
        .accordion-stack {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .accordion-row {
          border-radius: 13px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
          overflow: hidden;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .accordion-row.expanded {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px -4px rgba(15, 23, 42, 0.08);
        }

        .accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 10px;
          transition: background 0.15s ease;
        }

        .accordion-trigger:hover {
          background: rgba(241, 245, 249, 0.6);
        }

        .trigger-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .trigger-chevron {
          font-size: 14px;
          font-weight: 800;
          color: #64748b;
          width: 14px;
          text-align: center;
        }

        .trigger-icon {
          font-size: 15px;
          line-height: 1;
        }

        .trigger-label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
        }

        .trigger-right {
          margin-left: auto;
          text-align: right;
          min-width: 0;
        }

        .trigger-summary {
          font-size: 12.5px;
          font-weight: 600;
          color: #4f46e5;
          background: rgba(238, 242, 255, 0.85);
          padding: 3px 8px;
          border-radius: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          max-width: 180px;
        }

        .accordion-panel-body {
          padding: 8px 14px 14px;
          border-top: 1px dashed #e2e8f0;
          animation: slideDown 0.16s ease forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── CONTENUS DES PANELS ── */
        .type-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .choice-chip {
          padding: 9px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
          transition: all 0.15s ease;
        }

        .choice-chip.selected {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
          font-weight: 700;
        }

        .profs-options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 210px;
          overflow-y: auto;
        }

        .prof-option-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .prof-option-card.selected {
          border-color: #6366f1;
          background: #f5f3ff;
        }

        .prof-card-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .prof-card-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .prof-card-info strong {
          font-size: 12.5px;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .prof-card-info span {
          font-size: 11px;
          color: #64748b;
        }

        .prof-card-check {
          color: #4f46e5;
          font-weight: 800;
          font-size: 14px;
        }

        .quick-subject-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .sub-chip {
          padding: 5px 9px;
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sub-chip.selected {
          background: #e0e7ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        .field-sublabel {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 6px;
        }

        .native-text-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          outline: none;
        }

        .native-text-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .mode-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .mode-option-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 11px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .mode-option-btn.selected {
          border-color: #4f46e5;
          background: #eef2ff;
        }

        .mode-btn-ico {
          font-size: 18px;
        }

        .mode-btn-texts {
          display: flex;
          flex-direction: column;
        }

        .mode-btn-texts strong {
          font-size: 12.5px;
          color: #0f172a;
        }

        .mode-btn-texts small {
          font-size: 10.5px;
          color: #64748b;
        }

        /* ── DATE & HEURE PICKERS ── */
        .datetime-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .picker-box {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .picker-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .native-datetime-input {
          width: 100%;
          padding: 8px 10px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          outline: none;
        }

        .native-datetime-input:focus {
          border-color: #6366f1;
        }

        .quick-date-shortcuts,
        .quick-hour-shortcuts {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }

        .date-tag-btn,
        .hour-tag-btn {
          padding: 3px 6px;
          font-size: 10.5px;
          font-weight: 600;
          color: #475569;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
        }

        .hour-tag-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }

        /* ── DURÉE ── */
        .duration-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .duration-pill-btn {
          padding: 6px 11px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .duration-pill-btn.selected {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }

        .slot-preview-badge {
          margin-top: 8px;
          font-size: 11.5px;
          color: #64748b;
          background: #f8fafc;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .native-textarea-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 12.5px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          resize: vertical;
        }

        /* ── RÉCAPITULATIF CRÉNEAU / PRIX ── */
        .modal-summary-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 2px;
        }

        .summary-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .sum-label {
          color: #64748b;
          font-weight: 600;
        }

        .sum-val {
          color: #0f172a;
          font-weight: 700;
        }

        .summary-line.highlight {
          border-top: 1px dashed #e2e8f0;
          padding-top: 6px;
        }

        .sum-price {
          font-size: 14px;
          font-weight: 800;
          color: #4f46e5;
        }

        /* ── ACTIONS FOOTER ── */
        .modal-sticky-footer {
          display: flex;
          gap: 10px;
          padding-top: 6px;
        }

        .btn-action-cancel {
          flex: 1;
          padding: 11px;
          border-radius: 11px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-action-submit {
          flex: 2;
          padding: 11px 16px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.28);
          transition: all 0.15s ease;
        }

        .btn-action-submit:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        /* ── RESPONSIVE MOBILE ET TABLETTE : PARFAITEMENT CENTRÉ SUR TOUS LES ÉCRANS ── */
        @media (max-width: 640px) {
          .agenda-modal-overlay {
            align-items: center;
            justify-content: center;
            padding: 12px;
          }

          .agenda-modal-card {
            width: 100%;
            max-width: 440px;
            max-height: min(84vh, calc(100dvh - 28px));
            margin: auto;
          }

          .header-title {
            font-size: 16px;
          }

          .datetime-fields-grid {
            grid-template-columns: 1fr;
          }

          .trigger-summary {
            max-width: 130px;
          }
        }
      `}</style>
    </>,
    document.body
  );
};
