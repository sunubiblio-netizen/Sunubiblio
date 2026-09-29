'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { CreateGroupInput } from '@/types/community';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupInput) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'Lycée', label: 'Lycée / Secondaire', icon: '🎓', desc: 'Prépa Bac, Seconde, Première, Terminale' },
  { value: 'Université', label: 'Université / Supérieur', icon: '🏛️', desc: 'Licence, Master, Doctorat, Grandes Écoles' },
  { value: 'Concours', label: 'Concours direct / Pro', icon: '🏆', desc: 'FASTEF, ENA, Douanes, Police, Concours' },
  { value: 'Collège', label: 'Collège', icon: '📚', desc: 'De la 6ème à la 3ème, BFEM' },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  useLockBodyScroll(isOpen);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [category, setCategory] = useState('Lycée');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [contest, setContest] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('Terminale');
  const [school, setSchool] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [rules, setRules] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  type SectionId = 'identity' | 'domain' | 'program' | 'access';
  const [openSection, setOpenSection] = useState<SectionId>('identity');

  const toggleSection = (sec: SectionId) => {
    setOpenSection((prev) => (prev === sec ? ('' as any) : sec));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer le dropdown catégorie au clic à l'extérieur ou touche Échap
  useEffect(() => {
    if (!isCategoryOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Veuillez donner un nom à votre groupe d’études.');
      setOpenSection('identity');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Veuillez ajouter une description des objectifs de travail.');
      setOpenSection('program');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      category,
      contest: contest.trim() || undefined,
      subject: subject.trim() || undefined,
      level: level.trim() || undefined,
      school: school.trim() || undefined,
      visibility,
      rules: rules.trim() || undefined,
      requireApproval,
    });

    onClose();
  };

  const iconsList = ['📐', '♾️', '⚖️', '💻', '🩺', '📚', '🔬', '🎓', '📝', '🏆'];

  return createPortal(
    <div
      className="communaute-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
    >
      {/* Cadre lumineux dynamique sur les 4 côtés DE TOUT L'ÉCRAN / VIEWPORT */}
      <div className="sunu-edge-top" aria-hidden="true">
        <div className="sunu-edge-beam-top" />
      </div>
      <div className="sunu-edge-right" aria-hidden="true">
        <div className="sunu-edge-beam-right" />
      </div>
      <div className="sunu-edge-bottom" aria-hidden="true">
        <div className="sunu-edge-beam-bottom" />
      </div>
      <div className="sunu-edge-left" aria-hidden="true">
        <div className="sunu-edge-beam-left" />
      </div>

      <div className="communaute-modal-panel">
        {/* En-tête de la modale (modale normale SANS faisceau lumineux autour d'elle) */}
        <div className="communaute-modal-header">
          <h3 id="create-group-title" className="communaute-modal-title">
            Créer un groupe d’études
          </h3>
          <button
            type="button"
            className="communaute-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Formulaire en accordéon compact */}
        <form onSubmit={handleSubmit} className="communaute-modal-body modal-accordion-container">
          {errorMsg && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* SECTION 1 : IDENTITÉ DU GROUPE */}
          <div className={`modal-accordion-item ${openSection === 'identity' ? 'open' : ''}`}>
            <button
              type="button"
              className="modal-accordion-header"
              onClick={() => toggleSection('identity')}
              aria-expanded={openSection === 'identity'}
            >
              <div className="accordion-header-left">
                <span className="accordion-step-num">1</span>
                <span className="accordion-title">Identité du groupe</span>
                {openSection !== 'identity' && (
                  <span className="accordion-preview-pill">
                    {icon} {name.trim() || 'À renseigner *'}
                  </span>
                )}
              </div>
              <svg
                className={`accordion-chevron ${openSection === 'identity' ? 'rotate' : ''}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSection === 'identity' && (
              <div className="modal-accordion-body">
                <div className="communaute-form-group">
                  <label className="communaute-form-label">Nom du groupe *</label>
                  <input
                    type="text"
                    placeholder="Ex: Prépa FASTEF Sciences Physiques 2027"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    className="communaute-form-input"
                    required
                  />
                </div>

                <div className="communaute-form-group">
                  <label className="communaute-form-label">Icône du groupe</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {iconsList.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setIcon(ic)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          border: icon === ic ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                          background: icon === ic ? '#eef2ff' : '#ffffff',
                          fontSize: '18px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2 : NIVEAU & DOMAINE */}
          <div className={`modal-accordion-item ${openSection === 'domain' ? 'open' : ''}`}>
            <button
              type="button"
              className="modal-accordion-header"
              onClick={() => toggleSection('domain')}
              aria-expanded={openSection === 'domain'}
            >
              <div className="accordion-header-left">
                <span className="accordion-step-num">2</span>
                <span className="accordion-title">Niveau & Domaine</span>
                {openSection !== 'domain' && (
                  <span className="accordion-preview-pill">
                    {category} • {level || 'Tous niveaux'}
                  </span>
                )}
              </div>
              <svg
                className={`accordion-chevron ${openSection === 'domain' ? 'rotate' : ''}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSection === 'domain' && (
              <div className="modal-accordion-body">
                <div className="form-row-two-cols">
                  <div className="communaute-form-group" ref={categoryDropdownRef} style={{ position: 'relative' }}>
                    <label className="communaute-form-label" id="category-dropdown-label">Catégorie *</label>
                    <button
                      type="button"
                      id="category-dropdown-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={isCategoryOpen}
                      aria-labelledby="category-dropdown-label category-dropdown-trigger"
                      className={`sunu-modern-select-trigger ${isCategoryOpen ? 'open' : ''}`}
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                      <div className="sunu-modern-select-current">
                        <span className="sunu-modern-select-icon">
                          {CATEGORY_OPTIONS.find((c) => c.value === category)?.icon || '📚'}
                        </span>
                        <span className="sunu-modern-select-text">
                          {CATEGORY_OPTIONS.find((c) => c.value === category)?.label || category}
                        </span>
                      </div>
                      <svg
                        className={`sunu-modern-select-chevron ${isCategoryOpen ? 'rotate' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isCategoryOpen && (
                      <div
                        className="sunu-modern-select-menu"
                        role="listbox"
                        aria-labelledby="category-dropdown-label"
                      >
                        {CATEGORY_OPTIONS.map((opt) => {
                          const isSelected = category === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              className={`sunu-modern-select-option ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setCategory(opt.value);
                                setIsCategoryOpen(false);
                              }}
                            >
                              <div className="sunu-option-left">
                                <span className="sunu-option-icon">{opt.icon}</span>
                                <div className="sunu-option-texts">
                                  <span className="sunu-option-title">{opt.label}</span>
                                  <span className="sunu-option-desc">{opt.desc}</span>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="sunu-option-check">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="communaute-form-group">
                    <label className="communaute-form-label">Niveau d’études</label>
                    <input
                      type="text"
                      placeholder="Ex: Terminale S1, L2, Master 1..."
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="communaute-form-input"
                    />
                  </div>
                </div>

                <div className="form-row-two-cols">
                  <div className="communaute-form-group">
                    <label className="communaute-form-label">Matière principale</label>
                    <input
                      type="text"
                      placeholder="Ex: Mathématiques, Droit..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="communaute-form-input"
                    />
                  </div>

                  <div className="communaute-form-group">
                    <label className="communaute-form-label">Concours ciblé (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Ex: ENA, FASTEF, Douanes..."
                      value={contest}
                      onChange={(e) => setContest(e.target.value)}
                      className="communaute-form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3 : PROGRAMME & OBJECTIFS */}
          <div className={`modal-accordion-item ${openSection === 'program' ? 'open' : ''}`}>
            <button
              type="button"
              className="modal-accordion-header"
              onClick={() => toggleSection('program')}
              aria-expanded={openSection === 'program'}
            >
              <div className="accordion-header-left">
                <span className="accordion-step-num">3</span>
                <span className="accordion-title">Programme & Objectifs</span>
                {openSection !== 'program' && (
                  <span className="accordion-preview-pill">
                    {description.trim() ? (description.length > 25 ? description.slice(0, 25) + '…' : description) : 'À renseigner *'}
                  </span>
                )}
              </div>
              <svg
                className={`accordion-chevron ${openSection === 'program' ? 'rotate' : ''}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSection === 'program' && (
              <div className="modal-accordion-body">
                <div className="communaute-form-group">
                  <label className="communaute-form-label">Établissement ou zone (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: UCAD FST, Lycée Lamine Guèye, Dakar..."
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="communaute-form-input"
                  />
                </div>

                <div className="communaute-form-group">
                  <label className="communaute-form-label">Description du programme de travail *</label>
                  <textarea
                    placeholder="Rythme des réunions, thèmes abordés, annales révisées..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrorMsg('');
                    }}
                    className="communaute-form-textarea"
                    style={{ minHeight: '80px' }}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4 : ACCÈS & RÈGLES */}
          <div className={`modal-accordion-item ${openSection === 'access' ? 'open' : ''}`}>
            <button
              type="button"
              className="modal-accordion-header"
              onClick={() => toggleSection('access')}
              aria-expanded={openSection === 'access'}
            >
              <div className="accordion-header-left">
                <span className="accordion-step-num">4</span>
                <span className="accordion-title">Accès & Règles</span>
                {openSection !== 'access' && (
                  <span className="accordion-preview-pill">
                    {visibility === 'public' ? '🌐 Public' : '🔒 Sur validation'}
                  </span>
                )}
              </div>
              <svg
                className={`accordion-chevron ${openSection === 'access' ? 'rotate' : ''}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSection === 'access' && (
              <div className="modal-accordion-body">
                <div className="communaute-form-group">
                  <label className="communaute-form-label">Accès au groupe</label>
                  <div className="communaute-radio-grid">
                    <div
                      className={`communaute-radio-card ${visibility === 'public' ? 'active' : ''}`}
                      onClick={() => setVisibility('public')}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>🌐 Public</strong>
                      <span>Entrée libre pour tout étudiant motivé</span>
                    </div>

                    <div
                      className={`communaute-radio-card ${visibility === 'private' ? 'active' : ''}`}
                      onClick={() => setVisibility('private')}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>🔒 Sur validation</strong>
                      <span>L'admin valide les demandes de candidature</span>
                    </div>
                  </div>
                </div>

                <div className="communaute-form-group">
                  <label className="communaute-form-label">Règles du groupe (optionnel)</label>
                  <textarea
                    placeholder="Ex: Être assidu aux révisions hebdomadaires, poster ses démarches..."
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="communaute-form-textarea"
                    style={{ minHeight: '60px' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="communaute-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn-modal-submit"
            >
              Créer le groupe
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
