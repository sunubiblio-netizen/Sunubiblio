'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutStory } from '@/components/about/AboutStory';
import { MissionSection } from '@/components/about/MissionSection';
import { VisionSection } from '@/components/about/VisionSection';
import { AudienceSection } from '@/components/about/AudienceSection';
import { FeaturesOverview } from '@/components/about/FeaturesOverview';
import { ValuesSection } from '@/components/about/ValuesSection';
import { ApproachSection } from '@/components/about/ApproachSection';
import { SenegalSection } from '@/components/about/SenegalSection';
import { PurposeSection } from '@/components/about/PurposeSection';
import { AboutCTA } from '@/components/about/AboutCTA';

export default function AboutPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="about-page-wrapper">
      {/* Global Navbar with activePage="apropos" */}
      <Navbar
        activePage="apropos"
        onOpenAuth={handleOpenAuth}
      />

      <main className="about-main">
        {/* 1. Hero */}
        <AboutHero />

        {/* 2. Notre Histoire (Pourquoi Sunubiblio ?) */}
        <AboutStory />

        {/* 3. Notre Mission (3 piliers) */}
        <MissionSection />

        {/* 4. Notre Vision */}
        <VisionSection />

        {/* 5. Pour Qui ? (4 profils) */}
        <AudienceSection />

        {/* 6. Ce que l'on propose (Modules actifs & futurs) */}
        <FeaturesOverview />

        {/* 7. Nos Valeurs (4 principes directeurs) */}
        <ValuesSection />

        {/* 8. Notre Approche (4 étapes d'apprentissage) */}
        <ApproachSection />

        {/* 9. Sunubiblio & le Sénégal */}
        <SenegalSection />

        {/* 10. Raison d'être authentique */}
        <PurposeSection />

        {/* 11. Grand CTA Final */}
        <AboutCTA />
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
        .about-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
          position: relative;
        }

        .about-main {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
