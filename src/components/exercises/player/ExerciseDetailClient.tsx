'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { AuthModal } from '@/components/ui/AuthModal';
import { ExercisePlayer } from '@/components/exercises/player/ExercisePlayer';
import { Exercise } from '@/types/exercise';

interface ExerciseDetailClientProps {
  exercise: Exercise | null;
}

export const ExerciseDetailClient: React.FC<ExerciseDetailClientProps> = ({ exercise }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="exercise-player-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="exercices" hideOnMobile={true} />

      <main className="exercise-player-main">
        {!exercise ? (
          <div className="container player-not-found-card">
            <div className="not-found-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Exercice introuvable</h2>
            <p>Cet exercice n'existe pas ou a été déplacé dans le catalogue Sunubiblio.</p>
            <Link href="/exercices" className="btn-primary">
              Retour au catalogue des exercices
            </Link>
          </div>
        ) : (
          <div className="container player-screen-container">
            <ExercisePlayer exercise={exercise} />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
};
