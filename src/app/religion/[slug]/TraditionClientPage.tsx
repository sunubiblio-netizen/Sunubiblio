'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ReligionTraditionWorkspace } from '@/components/religion/ReligionTraditionWorkspace';
import {
  ReligionTradition,
  ReligionBranch,
  ReligionResource,
  ReligionPedagogicalData,
} from '@/types/religion';

interface TraditionClientPageProps {
  tradition: ReligionTradition;
  branches: ReligionBranch[];
  resources: ReligionResource[];
  pedagogicalData: ReligionPedagogicalData | null;
}

export const TraditionClientPage: React.FC<TraditionClientPageProps> = ({
  tradition,
  branches,
  resources,
  pedagogicalData,
}) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="tradition-page-shell">
      {/* Global Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="religion" />

      {/* Main Workspace (En haut la Carte, la Barre de recherche, les Filtres et la Grille de livres) */}
      <main className="tradition-main-content">
        <ReligionTraditionWorkspace
          tradition={tradition}
          branches={branches}
          resources={resources}
          pedagogicalData={pedagogicalData}
          onOpenAuth={handleOpenAuth}
        />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .tradition-page-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fdfcf9;
        }

        .tradition-main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
