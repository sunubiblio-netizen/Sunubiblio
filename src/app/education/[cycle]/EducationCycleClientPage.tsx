'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { EducationCycleWorkspace } from '@/components/education/EducationCycleWorkspace';
import { EducationCycleDetails } from '@/data/educationCyclesData';

interface EducationCycleClientPageProps {
  cycle: EducationCycleDetails;
}

export default function EducationCycleClientPage({ cycle }: EducationCycleClientPageProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="education-cycle-page-shell">
      {/* Top Navbar Sunubiblio */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="education" />

      {/* Main Cycle Content (Dedicated workspace matching FASTEF layout) */}
      <main className="cycle-main-content">
        <EducationCycleWorkspace cycle={cycle} onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal d'Authentification */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
