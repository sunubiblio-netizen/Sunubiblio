'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ReligionHero } from '@/components/religion/ReligionHero';
import { ReligionTraditionsSection } from '@/components/religion/ReligionTraditionsSection';
import { ReligionCTA } from '@/components/religion/ReligionCTA';
import { RELIGION_TRADITIONS } from '@/data/mockReligion';

export default function ReligionPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/bibliotheque?q=${encodeURIComponent(query.trim())}&category=religion`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="religion-page-wrapper">
      {/* Global Header */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="religion" />

      {/* Main Content */}
      <main className="religion-main">
        {/* 1. Hero Section Centré avec Recherche Universelle (Identique à Éducation) */}
        <ReligionHero
          onSearch={handleSearch}
          onExploreClick={() => scrollToSection('traditions')}
        />

        {/* 2. Grandes Traditions & Sagesses sous forme de Cartes avec Images d'Arrière-Plan (Style Éducation) */}
        <ReligionTraditionsSection traditions={RELIGION_TRADITIONS} />

        {/* 3. CTA Global */}
        <ReligionCTA />
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
        .religion-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff !important;
          position: relative;
        }

        .religion-main {
          flex: 1;
          position: relative;
          background: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
