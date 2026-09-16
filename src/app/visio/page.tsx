'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

interface VisioSession {
  id: string;
  title: string;
  hostName: string;
  date: string;
  time: string;
  durationMinutes: number;
  participantsCount: number;
  maxParticipants: number;
  status: 'live' | 'scheduled' | 'finished';
  subject: string;
  description: string;
}

const MOCK_VISIOS: VisioSession[] = [
  {
    id: 'v1',
    title: 'Correction en direct : Didactique FASTEF Sujet 2024',
    hostName: 'Amadou K. Ba (Major FASTEF)',
    date: 'Aujourd’hui',
    time: '18:00',
    durationMinutes: 90,
    participantsCount: 42,
    maxParticipants: 100,
    status: 'live',
    subject: 'Didactique & Concours',
    description: 'Analyse méthodique des critères d’évaluation du jury et rédaction d’une situation didactique type.',
  },
  {
    id: 'v2',
    title: 'Séance de révision Bac S2 : Nombres Complexes & Probabilités',
    hostName: 'Mme Ndiaye (Professeure Lycée)',
    date: 'Demain',
    time: '16:30',
    durationMinutes: 60,
    participantsCount: 28,
    maxParticipants: 50,
    status: 'scheduled',
    subject: 'Mathématiques',
    description: 'Résolution pas à pas d’exercices types baccalauréat avec questions/réponses en direct.',
  },
  {
    id: 'v3',
    title: 'Atelier de Méthodologie du Cas Clinique en Médecine',
    hostName: 'Dr. Fatou Diallo',
    date: 'Samedi 20 Sept.',
    time: '10:00',
    durationMinutes: 120,
    participantsCount: 65,
    maxParticipants: 80,
    status: 'scheduled',
    subject: 'Santé & Concours',
    description: 'Structure de la démarche clinique diagnostique et entraînement sur cas réels.',
  },
];

export default function VisioPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Formulaire de programmation
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionDesc, setSessionDesc] = useState('');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Votre séance Visio a été programmée avec succès et ajoutée à votre Agenda Sunubiblio !');
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="visio-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="visio" />

      <main className="visio-main-content">
        <section className="visio-hero-section">
          <div className="container">
            <div className="visio-hero-card">
              <div className="hero-tag-badge">
                <span className="live-dot" />
                <span>🎥 Service Visio Sunubiblio</span>
              </div>
              <h1 className="hero-main-heading">
                Séances de Révision & Tutorat en Direct
              </h1>
              <p className="hero-subtext">
                Lancez une visioconférence instantanée avec vos camarades d’étude ou programmez une séance de cours interactif avec tableau blanc et partage de documents.
              </p>

              <div className="visio-hero-actions">
                <button
                  type="button"
                  className="btn-primary start-instant-btn"
                  onClick={() => handleOpenAuth('login')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>Démarrer maintenant</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary schedule-btn"
                  onClick={() => setIsScheduleModalOpen(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Programmer une Visio</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des séances Visio */}
        <section className="visio-sessions-section" id="sessions">
          <div className="container">
            <div className="section-title-row">
              <h2>Séances Visio au programme</h2>
              <span className="active-badge">{MOCK_VISIOS.length} séances planifiées</span>
            </div>

            <div className="visio-grid">
              {MOCK_VISIOS.map((visio) => (
                <article key={visio.id} className="visio-card">
                  <div className="visio-card-header">
                    <span className="subject-pill">{visio.subject}</span>
                    {visio.status === 'live' ? (
                      <span className="live-pill">
                        <span className="pulse-dot" /> En direct
                      </span>
                    ) : (
                      <span className="scheduled-pill">Programmé</span>
                    )}
                  </div>

                  <h3 className="visio-title">{visio.title}</h3>
                  <p className="visio-desc">{visio.description}</p>

                  <div className="visio-meta-info">
                    <div className="meta-line">
                      <span>👤</span> <strong>{visio.hostName}</strong>
                    </div>
                    <div className="meta-line">
                      <span>🕒</span> <span>{visio.date} à {visio.time} ({visio.durationMinutes} min)</span>
                    </div>
                    <div className="meta-line">
                      <span>👥</span> <span>{visio.participantsCount} / {visio.maxParticipants} inscrits</span>
                    </div>
                  </div>

                  <div className="visio-card-bottom">
                    {visio.status === 'live' ? (
                      <button
                        type="button"
                        className="btn-primary w-full join-live-btn"
                        onClick={() => handleOpenAuth('login')}
                      >
                        Rejoindre la Visio en direct
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary w-full"
                        onClick={() => handleOpenAuth('login')}
                      >
                        Réserver ma place gratuite
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modale de programmation de Visio */}
      {isScheduleModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsScheduleModalOpen(false)}
            >
              ✕
            </button>

            <h3 className="modal-title">Programmer une séance Visio</h3>
            <p className="modal-subtitle">
              Créez une visioconférence pédagogique. Le lien de connexion sera automatiquement ajouté à votre Agenda.
            </p>

            <form onSubmit={handleScheduleSubmit} className="schedule-form">
              <div className="form-group">
                <label>Titre de la séance</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Révision Concours FASTEF 2026"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Heure</label>
                  <input
                    type="time"
                    required
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Durée estimée (minutes)</label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                >
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h 30 min</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description pédagogique & Objectifs</label>
                <textarea
                  rows={3}
                  placeholder="Thèmes abordés, documents à préparer..."
                  value={sessionDesc}
                  onChange={(e) => setSessionDesc(e.target.value)}
                />
              </div>

              <div className="form-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Valider et programmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
