'use client';

import React, { useState, useEffect } from 'react';
import { EducationResource } from '@/types/education';

interface EducationResourceModalProps {
  resource: EducationResource | null;
  onClose: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const EducationResourceModal: React.FC<EducationResourceModalProps> = ({
  resource,
  onClose,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'rights'>('details');
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (resource) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [resource]);

  if (!resource) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrimaryAction = () => {
    if (resource.accessStatus === 'gratuit') {
      setActionNotice(`Ouverture du document « ${resource.title} » dans le lecteur sécurisé Sunubiblio...`);
      setTimeout(() => setActionNotice(null), 3000);
    } else {
      onClose();
      if (onOpenAuth) onOpenAuth('register');
    }
  };

  const handleDownload = () => {
    setActionNotice(`Téléchargement de « ${resource.title} » lancé avec succès.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Generate contextual syllabus key points based on resource metadata
  const getKeyPoints = () => {
    if (resource.subjectSlug === 'informatique' || resource.subject.toLowerCase().includes('informatique')) {
      return [
        'Complexité algorithmique spatiale et temporelle (Notations Grand O, Omega, Theta)',
        'Structures de données fondamentales : listes chaînées, piles, files et tables de hachage',
        'Arbres binaires de recherche (ABR) et parcours en profondeur / largeur',
        'Algorithmes de tri avancés : Tri rapide (QuickSort), Tri fusion (MergeSort)',
        'Exercices pratiques et annales d’examen résolues pas à pas',
      ];
    }
    if (resource.subjectSlug === 'mathematiques' || resource.subject.toLowerCase().includes('math')) {
      return [
        'Espaces vectoriels, sous-espaces et familles libres/génératrices',
        'Applications linéaires, matrices associées et calcul du déterminant',
        'Réduction des endomorphismes : diagonalisation et trigonalisation',
        'Formes bilinéaires et espaces préhilbertiens réels',
        'Sujets d’examens corrigés avec barème officiel et astuces méthodologiques',
      ];
    }
    if (resource.subject.toLowerCase().includes('histoire') || resource.subjectSlug === 'histoire') {
      return [
        'Cadre méthodologique de l’historiographie africaine contemporaine',
        'Sources orales, archives coloniales et épigraphie ouest-africaine',
        'Les grands empires du Sahel et l’évolution géopolitique régionale',
        'Chronologie commentée et repères bibliographiques fondamentaux',
        'Méthodologie détaillée du commentaire de document et de la dissertation',
      ];
    }
    return [
      'Fondements théoriques et concepts clés du programme officiel',
      'Applications concrètes et exemples résolus illustrés',
      'Méthodologie de travail et pièges fréquents lors des examens',
      'Exercices d’application directe avec solutions commentées',
      'Synthèse récapitulative et fiches de révision rapide',
    ];
  };

  return (
    <div className="res-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="res-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Floating Toast Notification */}
        {actionNotice && (
          <div className="modal-toast-notice">
            <span className="toast-icon">✓</span>
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 1. Header Banner with Cover Gradient */}
        <div className="res-modal-banner" style={{ background: resource.coverGradient }}>
          {/* Subtle decorative grid pattern overlay */}
          <div className="banner-pattern-overlay" />

          {/* Close button */}
          <button
            type="button"
            className="res-close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Top Badges Bar */}
          <div className="banner-top-badges">
            <span className="badge-pill-light">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>{resource.levelLabel} {resource.grade ? `• ${resource.grade}` : ''}</span>
            </span>

            <span className="badge-pill-light">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>{resource.typeLabel}</span>
            </span>

            <span className={`access-glow-badge badge-${resource.accessStatus}`}>
              {resource.accessStatus === 'gratuit' ? (
                <>
                  <span className="glow-dot dot-free" />
                  <span>Accès Gratuit</span>
                </>
              ) : resource.accessStatus === 'gold' ? (
                <>
                  <span className="glow-dot dot-gold" />
                  <span>Formule Gold</span>
                </>
              ) : (
                <>
                  <span className="glow-dot dot-sub" />
                  <span>Inclus avec Abonnement</span>
                </>
              )}
            </span>
          </div>

          {/* Resource Title & Details */}
          <div className="banner-title-wrap">
            <h2 className="banner-title">{resource.title}</h2>
            
            <div className="banner-institution-row">
              <span className="inst-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" />
                </svg>
                {resource.filiereTitle ? resource.filiereTitle : `${resource.subject} • Sunubiblio Savoir`}
              </span>
              {resource.domainTitle && (
                <span className="inst-sub">({resource.domainTitle})</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Key Specifications Bar (4 Mini Spec Cards) */}
        <div className="res-specs-bar">
          <div className="spec-item">
            <div className="spec-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="spec-text">
              <span className="spec-label">Format</span>
              <strong className="spec-val">PDF Haute Définition</strong>
            </div>
          </div>

          <div className="spec-item">
            <div className="spec-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="spec-text">
              <span className="spec-label">Volume</span>
              <strong className="spec-val">{resource.pagesCount || 52} pages</strong>
            </div>
          </div>

          <div className="spec-item">
            <div className="spec-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="spec-text">
              <span className="spec-label">Discipline</span>
              <strong className="spec-val">{resource.subject}</strong>
            </div>
          </div>

          <div className="spec-item">
            <div className="spec-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="spec-text">
              <span className="spec-label">Validation</span>
              <strong className="spec-val">Conforme Sénégal</strong>
            </div>
          </div>
        </div>

        {/* 3. Interactive Tabs Navigation */}
        <div className="res-modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'details' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <span>📋 Présentation & Programme</span>
            {activeTab === 'details' && <span className="tab-indicator" />}
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'preview' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span>👁️ Extrait du Document</span>
            {activeTab === 'preview' && <span className="tab-indicator" />}
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'rights' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('rights')}
          >
            <span>🔒 Droits & Lecture Sécurisée</span>
            {activeTab === 'rights' && <span className="tab-indicator" />}
          </button>
        </div>

        {/* 4. Tab Content Body */}
        <div className="res-tab-body">
          {activeTab === 'details' && (
            <div className="tab-panel animate-fade">
              <div className="desc-section">
                <h4 className="panel-subheading">Description du document</h4>
                <p className="desc-paragraph">{resource.description}</p>
              </div>

              {/* Syllabus / Key Points */}
              <div className="keypoints-section">
                <h4 className="panel-subheading">Points clés & Notions couvertes</h4>
                <div className="keypoints-list">
                  {getKeyPoints().map((pt, idx) => (
                    <div key={idx} className="keypoint-item">
                      <div className="kp-bullet">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="kp-text">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Guarantee Badges */}
              <div className="quality-badges-row">
                <div className="q-badge">
                  <span className="q-icon">🛡️</span>
                  <div className="q-text">
                    <strong>Contenu vérifié</strong>
                    <span>Rédigé par des universitaires & professeurs certifiés</span>
                  </div>
                </div>

                <div className="q-badge">
                  <span className="q-icon">⚡</span>
                  <div className="q-text">
                    <strong>Accès instantané</strong>
                    <span>Lecture immédiate sans délai sur mobile et ordinateur</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="tab-panel animate-fade">
              <div className="document-sample-viewer">
                <div className="sample-header">
                  <div className="sample-window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div className="sample-title-bar">
                    <span>{resource.title} — Spécimen Page 1</span>
                  </div>
                  <span className="sample-watermark-badge">Sunubiblio Éducation</span>
                </div>

                <div className="sample-sheet">
                  <div className="sheet-top-univ">
                    <span>RÉPUBLIQUE DU SÉNÉGAL</span>
                    <span>MINISTÈRE DE L’ENSEIGNEMENT SUPÉRIEUR DE LA RECHERCHE ET DE L’INNOVATION</span>
                    <strong className="sheet-inst-name">
                      {resource.domainTitle ? resource.domainTitle.toUpperCase() : 'UNIVERSITÉ CHEIKH ANTA DIOP DE DAKAR'}
                    </strong>
                  </div>

                  <div className="sheet-divider" />

                  <div className="sheet-hero">
                    <h3 className="sheet-h3">{resource.title}</h3>
                    <p className="sheet-sub">
                      Niveau : <strong>{resource.levelLabel} ({resource.grade || 'Tous'})</strong> — Matière : <strong>{resource.subject}</strong>
                    </p>
                  </div>

                  <div className="sheet-body-text">
                    <p className="sheet-lead">
                      <strong>1. Introduction générale et objectifs pédagogiques :</strong> Le présent support de cours a pour vocation de fournir aux étudiants les compétences fondamentales et méthodologiques requises pour la réussite des examens universitaires et des concours nationaux.
                    </p>
                    <p className="sheet-quote">
                      « La maîtrise des structures formelles et l’analyse méthodique des énoncés constituent la clé de voûte de toute démarche scientifique rigoureuse. »
                    </p>
                    <div className="sheet-watermark-overlay">
                      <span>SPÉCIMEN D’ÉTUDE SUNUBIBLIO</span>
                    </div>
                  </div>

                  <div className="sheet-footer">
                    <span>Document certifié Sunubiblio • ID: {resource.id}</span>
                    <span>Page 1 / {resource.pagesCount || 48}</span>
                  </div>
                </div>

                <div className="sample-unlock-banner">
                  <div className="unlock-info">
                    <strong>Vous consultez l’extrait public de la page 1</strong>
                    <p>Débloquez le document complet ({resource.pagesCount || 48} pages) pour lire les chapitres, exercices et corrigés détaillés.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div className="tab-panel animate-fade">
              <div className="rights-box">
                <div className="rights-item">
                  <div className="rights-icon">📜</div>
                  <div className="rights-content">
                    <h4>Licence d’utilisation académique</h4>
                    <p>
                      Ce document est mis à la disposition des étudiants et enseignants enregistrés sur Sunubiblio à des fins d’apprentissage, de révision et de recherche personnelle. Toute reproduction ou revente commerciale non autorisée est strictement interdite.
                    </p>
                  </div>
                </div>

                <div className="rights-item">
                  <div className="rights-icon">📱</div>
                  <div className="rights-content">
                    <h4>Lecture & Mode Hors-ligne</h4>
                    <p>
                      Les utilisateurs abonnés peuvent synchroniser ce document dans l’espace <em>« Mes Téléchargements »</em> pour y accéder sans connexion internet depuis leur smartphone, tablette ou ordinateur.
                    </p>
                  </div>
                </div>

                <div className="rights-item">
                  <div className="rights-icon">🔒</div>
                  <div className="rights-content">
                    <h4>Protection & Filigrane numérique</h4>
                    <p>
                      Chaque fichier généré intègre un filigrane de sécurité discret lié à votre compte afin de protéger la propriété intellectuelle des auteurs et enseignants partenaires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Bottom Action Bar */}
        <div className="res-modal-footer">
          <div className="footer-left-actions">
            <button
              type="button"
              className={`action-icon-btn ${isFavorite ? 'active-fav' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? '#ef4444' : 'none'} stroke={isFavorite ? '#ef4444' : 'currentColor'} strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isFavorite ? 'Enregistré' : 'Favoris'}</span>
            </button>

            <button
              type="button"
              className="action-icon-btn"
              onClick={handleCopyLink}
              title="Partager le lien"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
            </button>
          </div>

          <div className="footer-right-buttons">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Fermer
            </button>

            {resource.accessStatus === 'gratuit' ? (
              <>
                <button
                  type="button"
                  className="btn-secondary modal-btn-flex"
                  onClick={handleDownload}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Télécharger PDF</span>
                </button>

                <button
                  type="button"
                  className="btn-primary modal-btn-flex"
                  onClick={handlePrimaryAction}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span>Consulter en ligne</span>
                </button>
              </>
            ) : resource.accessStatus === 'gold' ? (
              <button
                type="button"
                className="btn-gold-action modal-btn-flex"
                onClick={handlePrimaryAction}
              >
                <span>⭐ Débloquer avec Formule Gold (15 000 FCFA)</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary modal-btn-flex"
                onClick={handlePrimaryAction}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Débloquer avec un abonnement (Dès 3 000 FCFA)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .res-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.68);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFadeIn 0.2s ease-out;
        }

        .res-modal-window {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 680px;
          max-height: 92vh;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15);
          animation: modalPopUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Floating Toast */
        .modal-toast-notice {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          animation: slideDownToast 0.25s ease-out;
        }

        .toast-icon {
          color: #10b981;
          font-weight: 800;
        }

        /* 1. Banner */
        .res-modal-banner {
          position: relative;
          padding: 28px 28px 24px 28px;
          color: #ffffff;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .banner-pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
        }

        .res-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .res-close-btn:hover {
          background: rgba(0, 0, 0, 0.45);
          transform: rotate(90deg) scale(1.05);
        }

        .banner-top-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .badge-pill-light {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .access-glow-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 11px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .badge-gratuit {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .badge-abonnement {
          background: #fef08a;
          color: #854d0e;
          border: 1px solid #fde047;
        }

        .badge-gold {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .glow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-free {
          background: #16a34a;
          box-shadow: 0 0 8px #22c55e;
        }

        .dot-sub {
          background: #ca8a04;
          box-shadow: 0 0 8px #eab308;
        }

        .dot-gold {
          background: #d97706;
          box-shadow: 0 0 8px #f59e0b;
        }

        .banner-title-wrap {
          position: relative;
          z-index: 2;
        }

        .banner-title {
          font-size: 21px;
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 10px 0;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .banner-institution-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .inst-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .inst-sub {
          color: rgba(255, 255, 255, 0.75);
          font-weight: 500;
        }

        /* 2. Specs Bar */
        .res-specs-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 24px;
          gap: 12px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spec-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .spec-text {
          display: flex;
          flex-direction: column;
        }

        .spec-label {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.03em;
        }

        .spec-val {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 3. Tabs Navigation */
        .res-modal-tabs {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0 24px;
        }

        .tab-btn {
          position: relative;
          background: none;
          border: none;
          padding: 14px 16px;
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: color 0.2s;
        }

        .tab-btn:hover {
          color: #1e1b4b;
        }

        .tab-btn-active {
          color: #4f46e5;
          font-weight: 700;
        }

        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 3px;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          border-radius: 9999px;
        }

        /* 4. Tab Body Content */
        .res-tab-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          background: #ffffff;
        }

        .tab-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-subheading {
          font-size: 13.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .desc-paragraph {
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* Keypoints */
        .keypoints-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .keypoint-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .kp-bullet {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #e0e7ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .kp-text {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.45;
        }

        /* Quality row */
        .quality-badges-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 6px;
        }

        .q-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
        }

        .q-icon {
          font-size: 20px;
        }

        .q-text {
          display: flex;
          flex-direction: column;
        }

        .q-text strong {
          font-size: 12px;
          color: #166534;
        }

        .q-text span {
          font-size: 11px;
          color: #15803d;
        }

        /* Preview Tab: Sample Viewer */
        .document-sample-viewer {
          background: #f1f5f9;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          overflow: hidden;
        }

        .sample-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #e2e8f0;
          padding: 8px 14px;
          border-bottom: 1px solid #cbd5e1;
        }

        .sample-window-dots {
          display: flex;
          gap: 6px;
        }

        .sample-window-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .sample-window-dots .dot.red { background: #f87171; }
        .sample-window-dots .dot.yellow { background: #fbbf24; }
        .sample-window-dots .dot.green { background: #34d399; }

        .sample-title-bar {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .sample-watermark-badge {
          font-size: 11px;
          font-weight: 700;
          color: #4338ca;
          background: #e0e7ff;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .sample-sheet {
          position: relative;
          background: #ffffff;
          margin: 16px auto;
          max-width: 540px;
          padding: 30px 28px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
          border-radius: 4px;
          overflow: hidden;
        }

        .sheet-top-univ {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 9.5px;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .sheet-inst-name {
          font-size: 11px;
          color: #1e1b4b;
          font-weight: 800;
          margin-top: 4px;
        }

        .sheet-divider {
          height: 2px;
          background: #e2e8f0;
          margin: 14px 0;
        }

        .sheet-hero {
          margin-bottom: 16px;
        }

        .sheet-h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .sheet-sub {
          font-size: 11.5px;
          color: #64748b;
          margin: 0;
        }

        .sheet-body-text {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sheet-lead {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }

        .sheet-quote {
          font-size: 12px;
          font-style: italic;
          color: #4f46e5;
          background: #f5f3ff;
          padding: 8px 12px;
          border-left: 3px solid #6366f1;
          border-radius: 0 6px 6px 0;
          margin: 0;
        }

        .sheet-watermark-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transform: rotate(-25deg);
        }

        .sheet-watermark-overlay span {
          font-size: 26px;
          font-weight: 900;
          color: rgba(99, 102, 241, 0.07);
          letter-spacing: 0.15em;
          white-space: nowrap;
          user-select: none;
        }

        .sheet-footer {
          margin-top: 24px;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94a3b8;
        }

        .sample-unlock-banner {
          background: #eff6ff;
          border-top: 1px solid #bfdbfe;
          padding: 12px 18px;
        }

        .unlock-info strong {
          font-size: 13px;
          color: #1e40af;
          display: block;
          margin-bottom: 2px;
        }

        .unlock-info p {
          font-size: 12px;
          color: #2563eb;
          margin: 0;
        }

        /* Rights Tab */
        .rights-box {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rights-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .rights-icon {
          font-size: 22px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rights-content h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .rights-content p {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.55;
          margin: 0;
        }

        /* 5. Footer Actions */
        .res-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-left-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon-btn:hover {
          background: #f1f5f9;
          color: #1e1b4b;
        }

        .action-icon-btn.active-fav {
          color: #ef4444;
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .footer-right-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-left: auto;
        }

        .btn-modal-cancel {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 600;
          padding: 9px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-cancel:hover {
          color: #0f172a;
          background: #e2e8f0;
        }

        .modal-btn-flex {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .modal-btn-flex:hover {
          transform: translateY(-1px);
        }

        .btn-gold-action {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 700;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
          cursor: pointer;
        }

        .btn-gold-action:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        /* Animations */
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPopUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideDownToast {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-fade {
          animation: modalFadeIn 0.25s ease-out;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .res-specs-bar {
            grid-template-columns: repeat(2, 1fr);
            padding: 10px 16px;
          }

          .quality-badges-row {
            grid-template-columns: 1fr;
          }

          .res-modal-banner {
            padding: 20px 16px;
          }

          .banner-title {
            font-size: 18px;
          }

          .res-modal-tabs {
            padding: 0 10px;
            overflow-x: auto;
          }

          .tab-btn {
            padding: 12px 10px;
            font-size: 12px;
            white-space: nowrap;
          }

          .res-tab-body {
            padding: 16px;
          }

          .res-modal-footer {
            padding: 12px 16px;
            flex-direction: column;
            align-items: stretch;
          }

          .footer-left-actions {
            justify-content: space-between;
          }

          .footer-right-buttons {
            margin-left: 0;
            flex-direction: column;
            width: 100%;
          }

          .modal-btn-flex, .btn-modal-cancel, .btn-gold-action {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
