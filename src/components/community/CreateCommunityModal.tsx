'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { CreateCommunityInput } from '@/types/community';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCommunityInput) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  useLockBodyScroll(isOpen);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Éducation');
  const [domainTheme, setDomainTheme] = useState('');
  const [icon, setIcon] = useState('🎓');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [rules, setRules] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Veuillez saisir un nom pour votre communauté.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Veuillez ajouter une brève description de la communauté.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      domainTheme: domainTheme.trim() || undefined,
      icon,
      visibility,
      rules: rules.trim() || undefined,
      requireApproval,
    });

    onClose();
  };

  const iconsList = ['🎓', '📚', '🏆', '💡', '🇸🇳', '🔬', '💻', '🩺', '⚖️', '🌸'];

  return createPortal(
    <div
      className="communaute-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-community-title"
    >
      <div className="communaute-modal-panel">
        {/* En-tête de la modale */}
        <div className="communaute-modal-header">
          <div className="header-title-box">
            <span className="header-sparkle-dot" aria-hidden="true" />
            <h3 id="create-community-title" className="communaute-modal-title">
              Créer une communauté
            </h3>
          </div>
          <button
            type="button"
            className="communaute-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Formulaire avec scroll interne fluide */}
        <form onSubmit={handleSubmit} className="communaute-modal-body">
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

          <div className="communaute-form-group">
            <label className="communaute-form-label">Nom de la communauté *</label>
            <input
              type="text"
              placeholder="Ex: Passion Mathématiques Sénégal"
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
            <label className="communaute-form-label">Icône représentative</label>
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
                    border: icon === ic ? '2px solid #6366f1' : '1px solid #e2e8f0',
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

          <div className="communaute-form-group">
            <label className="communaute-form-label">Catégorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="communaute-form-select"
              aria-label="Catégorie de la communauté"
            >
              <option value="Éducation">🎓 Éducation & Scolaire</option>
              <option value="Enseignement supérieur">🏛️ Enseignement supérieur (Universités)</option>
              <option value="Concours">🏆 Concours & Examens professionnels</option>
              <option value="Technologie">💡 Technologie & Innovation</option>
              <option value="Orientation">🧭 Orientation & Métiers</option>
              <option value="Général">🌍 Général & Entraide</option>
            </select>
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Thème ou Domaine d’expertise</label>
            <input
              type="text"
              placeholder="Ex: Algèbre, Didactique, Prépa Concours..."
              value={domainTheme}
              onChange={(e) => setDomainTheme(e.target.value)}
              className="communaute-form-input"
            />
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Description de la mission *</label>
            <textarea
              placeholder="Expliquez les objectifs, ce que les membres y trouveront et le type d'échanges attendus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="communaute-form-textarea"
              required
            />
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Confidentialité & Accès</label>
            <div className="communaute-radio-grid">
              <div
                className={`communaute-radio-card ${visibility === 'public' ? 'active' : ''}`}
                onClick={() => setVisibility('public')}
                role="button"
                tabIndex={0}
              >
                <strong>🌐 Publique</strong>
                <span>Tout utilisateur peut rejoindre et lire les échanges</span>
              </div>

              <div
                className={`communaute-radio-card ${visibility === 'private' ? 'active' : ''}`}
                onClick={() => setVisibility('private')}
                role="button"
                tabIndex={0}
              >
                <strong>🔒 Privée</strong>
                <span>Adhésion soumise à validation de l'administrateur</span>
              </div>
            </div>
          </div>

          <div className="communaute-form-group">
            <label className="communaute-form-label">Règles de la communauté (optionnel)</label>
            <textarea
              placeholder="Ex: Politesse requise, interdiction du spam, entraide mutuelle obligatoire..."
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="communaute-form-textarea"
              style={{ minHeight: '60px' }}
            />
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
              Créer la communauté
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
