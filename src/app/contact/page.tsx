'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactCards } from '@/components/contact/ContactCards';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactFAQ } from '@/components/contact/ContactFAQ';
import { SupportSection } from '@/components/contact/SupportSection';
import { PartnershipSection } from '@/components/contact/PartnershipSection';
import { ContactCategory } from '@/types/contact';

export default function ContactPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [preselectedCategory, setPreselectedCategory] = useState<ContactCategory>('Question générale');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const scrollToFormWithCategory = (category: ContactCategory) => {
    setPreselectedCategory(category);
    const formElement = document.getElementById('formulaire');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* Global Navbar with activePage="contact" */}
      <Navbar
        activePage="contact"
        onOpenAuth={handleOpenAuth}
      />

      <main className="contact-main">
        {/* 1. Compact & Elegant Hero */}
        <ContactHero />

        {/* 2. Three Direct Contact Cards (Phone, Email, Scope) */}
        <ContactCards />

        {/* 3. Main Interactive Contact Form */}
        <ContactForm preselectedCategory={preselectedCategory} />

        {/* 4. Contact FAQs (single open at a time) */}
        <ContactFAQ />

        {/* 5. Subscription Assistance Banner */}
        <SupportSection
          onSelectSubscriptionHelp={() => scrollToFormWithCategory('Abonnement')}
        />

        {/* 6. Institutional & Educational Partnership Banner */}
        <PartnershipSection
          onSelectPartnership={() => scrollToFormWithCategory('Partenariat')}
        />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .contact-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
          position: relative;
        }

        .contact-main {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
