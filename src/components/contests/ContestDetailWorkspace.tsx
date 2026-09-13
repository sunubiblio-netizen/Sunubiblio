'use client';

import React, { useState } from 'react';
import { Contest } from '@/types/contest';

interface ContestDetailWorkspaceProps {
  contest: Contest;
  onBack: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

type TabKey =
  | 'presentation'
  | 'conditions'
  | 'programme'
  | 'sujets'
  | 'corrections'
  | 'fascicules'
  | 'entrainement'
  | 'progression';

const TABS: { id: TabKey; label: string; icon: string }[] = [
  { id: 'presentation', label: 'Présentation', icon: 'info' },
  { id: 'conditions', label: 'Conditions d’accès', icon: 'check' },
  { id: 'programme', label: 'Programme officiel', icon: 'book' },
  { id: 'sujets', label: 'Sujets d’annales', icon: 'file' },
  { id: 'corrections', label: 'Corrections', icon: 'check-circle' },
  { id: 'fascicules', label: 'Fascicules', icon: 'bookmark' },
  { id: 'entrainement', label: 'Exercices & QCM', icon: 'zap' },
  { id: 'progression', label: 'Ma progression', icon: 'chart' },
];

export const ContestDetailWorkspace: React.FC<ContestDetailWorkspaceProps> = ({
  contest,
  onBack,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('presentation');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true); // default true for rich SaaS demonstration

  const subjects = contest.subjects || [];
  const papers = contest.papers || [];
  const conditions = contest.conditions || [];
  const progress = contest.sampleProgress || {
    globalPercentage: 68,
    completedSubjects: 12,
    totalSubjects: 20,
    completedExercises: 45,
    totalExercises: 60,
    completedQuizzes: 8,
    totalQuizzes: 10,
    studyHours: 24,
  };

  const sujetPapers = papers.filter((p) => p.type === 'sujet');
  const correctionPapers = papers.filter((p) => p.type === 'correction');
  const fasciculePapers = papers.filter((p) => p.type === 'fascicule');

  return (
    <div className="workspace-wrapper">
      {/* Back Button & Top Breadcrumb */}
      <div className="workspace-top-bar">
        <button type="button" className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Retour à tous les concours</span>
        </button>

        <div className="top-pills">
          <span className="session-pill">Session {contest.sessionYear}</span>
          <span className={`status-pill ${contest.status}`}>
            {contest.status === 'open' ? '● Inscriptions ouvertes' : contest.status === 'upcoming' ? '○ À venir' : '✕ Fermé'}
          </span>
        </div>
      </div>

      {/* Main Contest Identity Header Banner */}
      <header className="contest-identity-header">
        <div className="header-glow" style={{ background: contest.coverGradient }} />
        <div className="header-content">
          <div className="contest-emblem-badge">
            <span>{contest.name}</span>
          </div>

          <div className="header-titles">
            <div className="title-tags-row">
              <h1 className="contest-title">{contest.name}</h1>
              <span className="diploma-tag">{contest.diplomaLabel}</span>
            </div>
            <p className="contest-subtitle">{contest.fullName}</p>
            <p className="contest-org">
              Organisé par : <strong>{contest.organization}</strong>
            </p>
          </div>

          {/* Quick Stats on Right */}
          <div className="header-quick-stats desktop-only">
            <div className="q-stat">
              <span className="q-val">{contest.resourcesCount}</span>
              <span className="q-lbl">Ressources</span>
            </div>
            <div className="q-stat">
              <span className="q-val">{subjects.length}</span>
              <span className="q-lbl">Matières</span>
            </div>
            <div className="q-stat">
              <span className="q-val">{sujetPapers.length + 15}</span>
              <span className="q-lbl">Annales</span>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Tabs Navigation */}
      <nav className="tabs-nav-bar" aria-label="Sections du concours">
        <div className="tabs-scroll-wrap">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Workspace Tab Panels */}
      <div className="tab-panel-container">
        {/* TAB 1: PRÉSENTATION */}
        {activeTab === 'presentation' && (
          <div className="panel-box fade-in">
            <div className="presentation-grid">
              {/* Left description */}
              <div className="pres-left">
                <h3 className="panel-heading">Présentation du concours</h3>
                <p className="pres-text">{contest.longDescription}</p>

                <h4 className="sub-heading">Pourquoi préparer ce concours sur Sunubiblio ?</h4>
                <ul className="advantages-list">
                  <li>
                    <span className="bullet-check">✓</span>
                    <span>Accès complet aux annales officielles et corrigés types étape par étape.</span>
                  </li>
                  <li>
                    <span className="bullet-check">✓</span>
                    <span>QCM d’entraînement chronométrés conformes aux formats des épreuves.</span>
                  </li>
                  <li>
                    <span className="bullet-check">✓</span>
                    <span>Conseils méthodologiques rédigés par d’anciens lauréats et des inspecteurs.</span>
                  </li>
                  <li>
                    <span className="bullet-check">✓</span>
                    <span>Suivi analytique précis de votre niveau matière par matière.</span>
                  </li>
                </ul>
              </div>

              {/* Right: Informations Essentielles Card */}
              <div className="pres-right">
                <div className="essential-card">
                  <h4 className="essential-title">Informations essentielles</h4>
                  <div className="essential-rows">
                    <div className="e-row">
                      <span className="e-label">Organisme :</span>
                      <span className="e-value">{contest.organization}</span>
                    </div>
                    <div className="e-row">
                      <span className="e-label">Niveau requis :</span>
                      <span className="e-value">{contest.diplomaLabel}</span>
                    </div>
                    <div className="e-row">
                      <span className="e-label">Statut session :</span>
                      <span className="e-value highlight">{contest.statusLabel}</span>
                    </div>
                    <div className="e-row">
                      <span className="e-label">Date limite de dépôt :</span>
                      <span className="e-value">{contest.applicationDeadline || 'À préciser'}</span>
                    </div>
                    <div className="e-row">
                      <span className="e-label">Date des épreuves :</span>
                      <span className="e-value">{contest.examDate || 'Session 2025'}</span>
                    </div>
                    <div className="e-row">
                      <span className="e-label">Zone :</span>
                      <span className="e-value">
                        {contest.country === 'senegal' ? 'Sénégal (National)' : 'Zone UEMOA'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-primary start-prep-btn"
                    onClick={() => setActiveTab('programme')}
                  >
                    <span>Consulter le programme</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONDITIONS */}
        {activeTab === 'conditions' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Conditions d’accès & Éligibilité</h3>
            <p className="panel-sub">
              Vérifiez attentivement les conditions requises pour pouvoir vous présenter au concours.
            </p>

            <div className="conditions-checklist">
              {conditions.map((cond) => (
                <div key={cond.id} className="condition-card">
                  <div className="cond-check-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="cond-content">
                    <div className="cond-header">
                      <h4 className="cond-title">{cond.title}</h4>
                      {cond.isMandatory && <span className="cond-mand-badge">Obligatoire</span>}
                    </div>
                    <p className="cond-desc">{cond.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="conditions-footer-cta">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => alert("Toutes les conditions officielles de l'arrêté ministériel sont affichées.")}
              >
                Télécharger l'arrêté officiel complet (PDF)
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PROGRAMME */}
        {activeTab === 'programme' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Programme du concours par matière</h3>
            <p className="panel-sub">
              Explorez les épreuves officielles, les cours associés et le nombre d’exercices disponibles.
            </p>

            <div className="subjects-cards-grid">
              {subjects.map((sub) => (
                <div key={sub.id} className="subject-prep-card">
                  <div className="sub-card-top">
                    <div className="sub-icon-wrap">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span className="sub-res-count">{sub.resourcesCount} ressources</span>
                  </div>

                  <h4 className="sub-name">{sub.name}</h4>
                  <p className="sub-desc">{sub.description}</p>

                  <div className="sub-metrics-row">
                    <span className="sub-metric">
                      <strong>{sub.subjectsCount}</strong> sujets
                    </span>
                    <span className="sub-metric">
                      <strong>{sub.exercisesCount}</strong> exercices
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-secondary sub-explore-btn"
                    onClick={() => setActiveTab('sujets')}
                  >
                    Explorer cette matière →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUJETS */}
        {activeTab === 'sujets' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Sujets des années précédentes</h3>
            <p className="panel-sub">
              Entraînez-vous sur les épreuves réelles des sessions antérieures du concours {contest.name}.
            </p>

            <div className="papers-list-stack">
              {sujetPapers.map((paper) => (
                <div key={paper.id} className="paper-row-card">
                  <div className="paper-left">
                    <div className="paper-year-box">
                      <span className="p-year">{paper.year}</span>
                    </div>
                    <div className="paper-meta">
                      <h4 className="paper-title">{paper.title}</h4>
                      <div className="paper-details">
                        <span className="detail-tag">{paper.subjectName}</span>
                        <span className="detail-tag">PDF · {paper.pagesCount} pages</span>
                        {paper.hasCorrection && (
                          <span className="has-corr-badge">✓ Correction disponible</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="paper-actions">
                    <button
                      type="button"
                      className="btn-secondary paper-btn"
                      onClick={() => alert(`Consultation du sujet : ${paper.title}`)}
                    >
                      Consulter
                    </button>
                    <button
                      type="button"
                      className="btn-primary paper-btn"
                      onClick={() => alert(`Téléchargement sécurisé du sujet : ${paper.title}`)}
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CORRECTIONS */}
        {activeTab === 'corrections' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Corrections officielles & corrigés types</h3>
            <p className="panel-sub">
              Rappels méthodologiques, grilles de notation et explications détaillées des épreuves.
            </p>

            <div className="papers-list-stack">
              {correctionPapers.map((paper) => (
                <div key={paper.id} className="paper-row-card correction-card">
                  <div className="paper-left">
                    <div className="paper-year-box corr-year">
                      <span className="p-year">{paper.year}</span>
                    </div>
                    <div className="paper-meta">
                      <h4 className="paper-title">{paper.title}</h4>
                      <div className="paper-details">
                        <span className="detail-tag">{paper.subjectName}</span>
                        <span className="detail-tag">Corrigé intégral · {paper.pagesCount} pages</span>
                        {paper.accessLevel === 'premium' ? (
                          <span className="premium-badge">⭐ Membres Premium Gold</span>
                        ) : (
                          <span className="sub-badge">⚡ Inclus avec Abonnement</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="paper-actions">
                    <button
                      type="button"
                      className="btn-primary paper-btn"
                      onClick={() => alert(`Ouverture de la correction détaillée : ${paper.title}`)}
                    >
                      Consulter la correction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FASCICULES */}
        {activeTab === 'fascicules' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Fascicules de préparation méthodologique</h3>
            <p className="panel-sub">
              Manuels de synthèse et recueils thématiques rédigés par les formateurs pour maximiser vos chances.
            </p>

            <div className="fascicules-grid">
              {fasciculePapers.map((fasc) => (
                <div key={fasc.id} className="fascicule-card">
                  <div className="fasc-cover-preview">
                    <div className="fasc-book-spine" />
                    <div className="fasc-cover-content">
                      <span className="fasc-pill">{contest.name}</span>
                      <h4 className="fasc-cover-title">{fasc.title}</h4>
                      <span className="fasc-author">{fasc.authorOrSource}</span>
                    </div>
                  </div>

                  <div className="fasc-body">
                    <h4 className="fasc-title">{fasc.title}</h4>
                    <p className="fasc-specs">
                      {fasc.pagesCount} pages · PDF Haute Définition
                    </p>
                    <button
                      type="button"
                      className="btn-primary fasc-btn"
                      onClick={() => alert(`Ouverture du fascicule : ${fasc.title}`)}
                    >
                      Consulter le fascicule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ENTRAÎNEZ-VOUS (EXERCICES & QCM) */}
        {activeTab === 'entrainement' && (
          <div className="panel-box fade-in">
            <h3 className="panel-heading">Entraînez-vous en conditions réelles</h3>
            <p className="panel-sub">
              Mettez en pratique vos acquis avec nos banques d’exercices ciblés et nos QCM chronométrés.
            </p>

            <div className="training-cards-grid">
              {/* Exercices Card */}
              <div className="training-card exc-card">
                <div className="training-icon-wrap exc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="training-content">
                  <span className="training-tag">Pratique appliquée</span>
                  <h4 className="training-title">EXERCICES</h4>
                  <p className="training-desc">
                    Travaillez les notions importantes et perfectionnez votre méthode de résolution
                    pour chaque épreuve écrite.
                  </p>
                  <div className="training-stats">
                    <span>120 exercices disponibles</span>
                    <span>• Difficulté progressive</span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary training-btn"
                    onClick={() => alert(`Lancement de la session d'exercices pour ${contest.name}`)}
                  >
                    Commencer les exercices
                  </button>
                </div>
              </div>

              {/* QCM Card */}
              <div className="training-card qcm-card">
                <div className="training-icon-wrap qcm-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.2">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div className="training-content">
                  <span className="training-tag qcm-tag">Évaluation continue</span>
                  <h4 className="training-title">QCM INTERACTIFS</h4>
                  <p className="training-desc">
                    Testez vos connaissances en temps limité, découvrez vos points faibles et mesurez
                    instantanément votre score.
                  </p>
                  <div className="training-stats">
                    <span>15 séries de 20 questions</span>
                    <span>• Corrigé immédiat</span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary training-btn qcm-btn-accent"
                    onClick={() => alert(`Démarrage du QCM interactif ${contest.name}`)}
                  >
                    Commencer un QCM
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: MA PROGRESSION */}
        {activeTab === 'progression' && (
          <div className="panel-box fade-in">
            <div className="progress-panel-header">
              <div>
                <h3 className="panel-heading">Votre tableau de bord de préparation</h3>
                <p className="panel-sub">
                  Mesurez l’avancement de vos révisions pour le concours {contest.name}.
                </p>
              </div>

              {/* Toggle switch demonstration for connected vs guest */}
              <button
                type="button"
                className="demo-toggle-btn"
                onClick={() => setIsUserLoggedIn(!isUserLoggedIn)}
              >
                Vue : {isUserLoggedIn ? 'Utilisateur connecté' : 'Visiteur'} (Changer)
              </button>
            </div>

            {isUserLoggedIn ? (
              <div className="logged-progress-dashboard">
                {/* Global big card */}
                <div className="global-progress-card">
                  <div className="global-left">
                    <span className="prog-title">Progression globale de révision</span>
                    <div className="prog-bar-big">
                      <div className="prog-fill-big" style={{ width: `${progress.globalPercentage}%` }} />
                    </div>
                    <span className="prog-hint">
                      Vous avez complété {progress.globalPercentage}% du programme recommandé pour {contest.name}.
                    </span>
                  </div>

                  <div className="global-pct-circle">
                    <span className="pct-num">{progress.globalPercentage}%</span>
                    <span className="pct-lbl">Validé</span>
                  </div>
                </div>

                {/* 4 Detail metric cards */}
                <div className="metric-cards-grid">
                  <div className="prog-metric-card">
                    <span className="pm-label">Sujets réalisés</span>
                    <span className="pm-val">
                      {progress.completedSubjects} / {progress.totalSubjects}
                    </span>
                    <div className="pm-bar">
                      <div
                        className="pm-fill"
                        style={{ width: `${(progress.completedSubjects / progress.totalSubjects) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="prog-metric-card">
                    <span className="pm-label">Exercices résolus</span>
                    <span className="pm-val">
                      {progress.completedExercises} / {progress.totalExercises}
                    </span>
                    <div className="pm-bar">
                      <div
                        className="pm-fill"
                        style={{ width: `${(progress.completedExercises / progress.totalExercises) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="prog-metric-card">
                    <span className="pm-label">QCM validés</span>
                    <span className="pm-val">
                      {progress.completedQuizzes} / {progress.totalQuizzes}
                    </span>
                    <div className="pm-bar">
                      <div
                        className="pm-fill"
                        style={{ width: `${(progress.completedQuizzes / progress.totalQuizzes) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="prog-metric-card">
                    <span className="pm-label">Temps de préparation</span>
                    <span className="pm-val">{progress.studyHours} h</span>
                    <span className="pm-sub">sur les 40 h recommandées</span>
                  </div>
                </div>

                <div className="continue-prep-row">
                  <button
                    type="button"
                    className="btn-primary continue-prep-btn"
                    onClick={() => setActiveTab('entrainement')}
                  >
                    <span>Continuer ma préparation</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="guest-progress-card">
                <div className="guest-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h4 className="guest-title">Suivez votre progression en temps réel</h4>
                <p className="guest-desc">
                  Créez un compte ou connectez-vous pour enregistrer vos résultats aux QCM,
                  marquer les sujets résolus et calculer votre score d’admission estimé.
                </p>
                <button
                  type="button"
                  className="btn-primary guest-login-btn"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                >
                  Se connecter à Sunubiblio
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .workspace-wrapper {
          display: flex;
          flex-direction: column;
          margin-bottom: 50px;
        }

        .workspace-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 700;
          color: #4f46e5;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: #faf8ff;
          transform: translateX(-2px);
        }

        .top-pills {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .session-pill {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .status-pill {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .status-pill.open {
          background: #ecfdf5;
          color: #059669;
        }

        .status-pill.upcoming {
          background: #eff6ff;
          color: #2563eb;
        }

        /* Identity Banner */
        .contest-identity-header {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-xl);
          overflow: hidden;
          padding: 24px 28px;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px -4px rgba(79, 70, 229, 0.06);
        }

        .header-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .contest-emblem-badge {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        .header-titles {
          flex: 1;
        }

        .title-tags-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .contest-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .diploma-tag {
          font-size: 12px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .contest-subtitle {
          font-size: 14.5px;
          color: #475569;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .contest-org {
          font-size: 12.5px;
          color: #64748b;
        }

        .header-quick-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-left: 24px;
          border-left: 1px solid rgba(226, 232, 240, 0.8);
        }

        .q-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .q-val {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .q-lbl {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Tabs Nav Bar */
        .tabs-nav-bar {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
          padding: 6px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
        }

        .tabs-scroll-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .tabs-scroll-wrap::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #4f46e5;
          background: #f8fafc;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.35);
        }

        /* Panel Container */
        .tab-panel-container {
          width: 100%;
        }

        .panel-box {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
        }

        .panel-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .panel-sub {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 24px;
        }

        /* TAB 1 styles */
        .presentation-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 32px;
        }

        .pres-text {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .sub-heading {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .advantages-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .advantages-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #475569;
          line-height: 1.45;
        }

        .bullet-check {
          color: #10b981;
          font-weight: 800;
        }

        .essential-card {
          background: #faf8ff;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-lg);
          padding: 22px;
        }

        .essential-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
        }

        .essential-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .e-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          line-height: 1.4;
        }

        .e-label {
          color: #64748b;
          font-weight: 500;
        }

        .e-value {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }

        .e-value.highlight {
          color: #10b981;
        }

        .start-prep-btn {
          width: 100%;
          padding: 11px;
          font-size: 14px;
        }

        /* TAB 2 styles: Conditions */
        .conditions-checklist {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .condition-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-md);
        }

        .cond-check-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .cond-content {
          flex: 1;
        }

        .cond-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .cond-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .cond-mand-badge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .cond-desc {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.45;
        }

        /* TAB 3: Programme */
        .subjects-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        .subject-prep-card {
          background: #faf8ff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: flex;
          flex-direction: column;
        }

        .sub-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .sub-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sub-res-count {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #ffffff;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .sub-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .sub-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 16px;
          flex: 1;
        }

        .sub-metrics-row {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #475569;
          padding: 8px 10px;
          background: #ffffff;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .sub-explore-btn {
          width: 100%;
          font-size: 13px;
          padding: 8px;
        }

        /* TAB 4 & 5: Sujets & Corrections */
        .papers-list-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .paper-row-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .paper-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .paper-year-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #eef2ff;
          border: 1.5px solid rgba(99, 102, 241, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .corr-year {
          background: #ecfdf5;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .p-year {
          font-size: 16px;
          font-weight: 900;
          color: #4f46e5;
        }

        .corr-year .p-year {
          color: #059669;
        }

        .paper-meta {
          display: flex;
          flex-direction: column;
        }

        .paper-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .paper-details {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          flex-wrap: wrap;
        }

        .detail-tag {
          font-weight: 500;
        }

        .has-corr-badge {
          color: #059669;
          font-weight: 700;
          background: #ecfdf5;
          padding: 1px 7px;
          border-radius: 4px;
        }

        .premium-badge {
          color: #b45309;
          background: #fef3c7;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 4px;
        }

        .sub-badge {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 4px;
        }

        .paper-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .paper-btn {
          font-size: 13px;
          padding: 8px 16px;
        }

        /* TAB 6: Fascicules */
        .fascicules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .fascicule-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
        }

        .fasc-cover-preview {
          height: 130px;
          background: linear-gradient(135deg, #312e81 0%, #4338ca 100%);
          position: relative;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .fasc-pill {
          font-size: 10px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          width: fit-content;
        }

        .fasc-cover-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
        }

        .fasc-author {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }

        .fasc-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .fasc-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .fasc-specs {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .fasc-btn {
          margin-top: auto;
          width: 100%;
          padding: 9px;
          font-size: 13px;
        }

        /* TAB 7: Exercices & QCM */
        .training-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .training-card {
          background: #faf8ff;
          border: 1.5px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-xl);
          padding: 28px;
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }

        .training-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
          box-shadow: 0 16px 36px -6px rgba(79, 70, 229, 0.12);
        }

        .training-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .exc-icon {
          background: rgba(79, 70, 229, 0.1);
        }

        .qcm-icon {
          background: rgba(147, 51, 234, 0.1);
        }

        .training-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #4f46e5;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
          display: block;
        }

        .qcm-tag {
          color: #9333ea;
        }

        .training-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .training-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.55;
          margin-bottom: 18px;
          flex: 1;
        }

        .training-stats {
          display: flex;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 20px;
        }

        .training-btn {
          width: 100%;
          padding: 12px;
          font-size: 15px;
        }

        .qcm-btn-accent {
          background: linear-gradient(135deg, #9333ea 0%, #d946ef 100%);
          box-shadow: 0 4px 16px -2px rgba(147, 51, 234, 0.4);
        }

        /* TAB 8: Progression */
        .progress-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .demo-toggle-btn {
          font-size: 12px;
          font-weight: 700;
          color: #6366f1;
          background: #eef2ff;
          border: 1px dashed #6366f1;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .global-progress-card {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          border-radius: var(--radius-lg);
          padding: 24px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 20px;
        }

        .global-left {
          flex: 1;
        }

        .prog-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          display: block;
        }

        .prog-bar-big {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .prog-fill-big {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #38bdf8 0%, #34d399 100%);
        }

        .prog-hint {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.8);
        }

        .global-pct-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid #34d399;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pct-num {
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
        }

        .pct-lbl {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #34d399;
        }

        .metric-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .prog-metric-card {
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .pm-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .pm-val {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .pm-bar {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .pm-fill {
          height: 100%;
          background: #4f46e5;
          border-radius: 999px;
        }

        .pm-sub {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 500;
        }

        .continue-prep-row {
          display: flex;
          justify-content: center;
        }

        .continue-prep-btn {
          padding: 12px 30px;
          font-size: 15px;
        }

        /* Guest card */
        .guest-progress-card {
          background: #faf8ff;
          border: 1.5px dashed rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-xl);
          padding: 40px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .guest-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .guest-title {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .guest-desc {
          font-size: 14px;
          color: #64748b;
          max-width: 480px;
          line-height: 1.55;
          margin-bottom: 22px;
        }

        .guest-login-btn {
          padding: 12px 28px;
          font-size: 14.5px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.25s ease-out;
        }

        @media (max-width: 960px) {
          .presentation-grid {
            grid-template-columns: 1fr;
          }

          .training-cards-grid {
            grid-template-columns: 1fr;
          }

          .metric-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .panel-box {
            padding: 18px;
          }

          .global-progress-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .metric-cards-grid {
            grid-template-columns: 1fr;
          }

          .contest-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};
