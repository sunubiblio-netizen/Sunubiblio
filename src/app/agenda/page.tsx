'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

interface AgendaEvent {
  id: string;
  title: string;
  category: 'concours' | 'visio' | 'examen' | 'devoir' | 'rappel';
  dateLabel: string;
  time: string;
  locationOrLink: string;
  isImportant?: boolean;
}

const MOCK_EVENTS: AgendaEvent[] = [
  {
    id: 'e1',
    title: 'Visio en direct : Didactique FASTEF 2024',
    category: 'visio',
    dateLabel: 'Aujourd’hui',
    time: '18:00 - 19:30',
    locationOrLink: 'Salle Visio Sunubiblio #1',
    isImportant: true,
  },
  {
    id: 'e2',
    title: 'Date Limite Dépôt Dossiers FASTEF 2026',
    category: 'concours',
    dateLabel: 'Vendredi 19 Sept.',
    time: '17:00',
    locationOrLink: 'Direction des Examens et Concours',
    isImportant: true,
  },
  {
    id: 'e3',
    title: 'Révision collective Bac S2 — Probabilités',
    category: 'visio',
    dateLabel: 'Samedi 20 Sept.',
    time: '16:30 - 17:30',
    locationOrLink: 'Salle Visio Sunubiblio #3',
  },
  {
    id: 'e4',
    title: 'Test d’évaluation en ligne : Algèbre & Matrices',
    category: 'examen',
    dateLabel: 'Lundi 22 Sept.',
    time: '10:00 - 11:30',
    locationOrLink: 'Espace Exercices Sunubiblio',
  },
];

export default function AgendaPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeFilter, setActiveFilter] = useState<'all' | 'concours' | 'visio' | 'examen'>('all');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const filteredEvents = MOCK_EVENTS.filter((e) => {
    if (activeFilter === 'all') return true;
    return e.category === activeFilter;
  });

  return (
    <div className="agenda-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="agenda" />

      <main className="agenda-main-content">
        <div className="container">
          {/* Header Agenda */}
          <div className="agenda-hero-card">
            <div className="agenda-tag-pill">
              <span>📅 Mon Emploi du Temps d’Étude</span>
            </div>
            <h1>Agenda Personnel & Échéances de Concours</h1>
            <p>
              Centralisez vos dates d’épreuves, devoirs, révisions programmées et séances de Visio en direct sur une vue claire et synchronisée.
            </p>

            <div className="agenda-filter-tabs">
              <button
                type="button"
                className={`agenda-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Tous les événements ({MOCK_EVENTS.length})
              </button>
              <button
                type="button"
                className={`agenda-filter-btn ${activeFilter === 'concours' ? 'active' : ''}`}
                onClick={() => setActiveFilter('concours')}
              >
                🏆 Concours & Dates Clés
              </button>
              <button
                type="button"
                className={`agenda-filter-btn ${activeFilter === 'visio' ? 'active' : ''}`}
                onClick={() => setActiveFilter('visio')}
              >
                🎥 Séances Visio
              </button>
              <button
                type="button"
                className={`agenda-filter-btn ${activeFilter === 'examen' ? 'active' : ''}`}
                onClick={() => setActiveFilter('examen')}
              >
                📝 Tests & Examens
              </button>
            </div>
          </div>

          {/* Liste chronologique des événements */}
          <div className="agenda-timeline-wrap">
            <div className="timeline-header-row">
              <h3>Échéances à venir</h3>
              <button
                type="button"
                className="btn-primary add-event-btn"
                onClick={() => handleOpenAuth('login')}
              >
                + Ajouter un événement
              </button>
            </div>

            <div className="timeline-events-list">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className={`timeline-event-card ${evt.isImportant ? 'is-highlighted' : ''}`}>
                  <div className="event-date-col">
                    <span className="event-date-badge">{evt.dateLabel}</span>
                    <span className="event-time-badge">{evt.time}</span>
                  </div>

                  <div className="event-details-col">
                    <div className="event-tag-row">
                      <span className={`category-tag-pill cat-${evt.category}`}>
                        {evt.category === 'concours' && '🏆 Concours officiel'}
                        {evt.category === 'visio' && '🎥 Séance Visio'}
                        {evt.category === 'examen' && '📝 Évaluation'}
                        {evt.category === 'devoir' && '📚 Devoir'}
                        {evt.category === 'rappel' && '🔔 Rappel personnel'}
                      </span>
                      {evt.isImportant && <span className="important-badge">Prioritaire</span>}
                    </div>

                    <h4 className="event-title">{evt.title}</h4>
                    <p className="event-loc">📍 {evt.locationOrLink}</p>
                  </div>

                  <div className="event-action-col">
                    {evt.category === 'visio' ? (
                      <Link href="/visio" className="btn-primary event-cta-btn">
                        Accéder à la Visio
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary event-cta-btn"
                        onClick={() => handleOpenAuth('login')}
                      >
                        Détails
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
