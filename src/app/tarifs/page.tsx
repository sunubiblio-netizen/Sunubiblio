'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingGrid } from '@/components/pricing/PricingGrid';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import { PaymentMethods } from '@/components/pricing/PaymentMethods';
import { TrustSection } from '@/components/pricing/TrustSection';
import { PricingFAQ } from '@/components/pricing/PricingFAQ';
import { PricingCTA } from '@/components/pricing/PricingCTA';
import { PlanCheckoutModal } from '@/components/pricing/PlanCheckoutModal';
import { PricingPlan } from '@/types/pricing';

export default function TarifsPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const scrollToPlans = () => {
    const el = document.getElementById('pricing-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="tarifs-page-wrapper">
      {/* Global Navigation with activePage="tarifs" */}
      <Navbar
        activePage="tarifs"
        onOpenAuth={handleOpenAuth}
      />

      <main className="tarifs-main">
        {/* 1. Hero Section */}
        <PricingHero onScrollToPlans={scrollToPlans} />

        {/* 2. The 4 Official Pricing Cards Grid */}
        <PricingGrid onSelectPlan={handleSelectPlan} />

        {/* 3. Detailed Feature Comparison (Desktop Table + Mobile Accordion) */}
        <FeatureComparison onSelectPlan={handleSelectPlan} />

        {/* 4. Official Payment Methods in Senegal (Wave, Orange Money, Carte) */}
        <PaymentMethods />

        {/* 5. Trust & Reassurance Badges */}
        <TrustSection />

        {/* 6. Pricing & Subscription FAQ */}
        <PricingFAQ />

        {/* 7. Motivational Final CTA */}
        <PricingCTA onScrollToPlans={scrollToPlans} />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Checkout / Subscription Initiation Modal */}
      <PlanCheckoutModal
        plan={selectedPlan}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          // Can redirect or trigger user profile update in future
        }}
      />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .tarifs-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
          position: relative;
        }

        .tarifs-main {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
