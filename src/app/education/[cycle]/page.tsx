'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { EducationCycleWorkspace } from '@/components/education/EducationCycleWorkspace';
import { getCycleConfig, EDUCATION_CYCLES_REGISTRY } from '@/data/educationCyclesData';

export default function EducationCyclePage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = (params?.cycle as string) || '';

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const cycleConfig = useMemo(() => {
    return getCycleConfig(cycleSlug);
  }, [cycleSlug]);

  return (
    <div className="education-cycle-page-shell">
      {/* Top Navbar Sunubiblio */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="education" />

      {/* Main Cycle Content */}
      <main className="cycle-main-content">
        {cycleConfig ? (
          <EducationCycleWorkspace cycle={cycleConfig} onOpenAuth={handleOpenAuth} />
        ) : (
          <div className="cycle-not-found-container">
            <div className="not-found-box">
              <div className="not-found-icon">📚</div>
              <h2>Niveau d’études introuvable</h2>
              <p>Le cycle éducatif demandé n’existe pas ou a été déplacé.</p>
              
              <div className="quick-cycles-list">
                <Link href="/education/prescolaire" className="cycle-quick-chip">
                  🌱 Préscolaire
                </Link>
                <Link href="/education/primaire" className="cycle-quick-chip">
                  📖 Primaire (CFEE)
                </Link>
                <Link href="/education/college" className="cycle-quick-chip">
                  🏫 Collège (BFEM)
                </Link>
                <Link href="/education/lycee" className="cycle-quick-chip">
                  🎓 Lycée (BAC)
                </Link>
                <Link href="/education/universite" className="cycle-quick-chip">
                  🏛️ Université (LMD)
                </Link>
                <Link href="/education/formation-professionnelle" className="cycle-quick-chip">
                  🔧 Formation Professionnelle
                </Link>
              </div>

              <Link href="/education" className="back-home-btn">
                ← Retour au catalogue Éducation
              </Link>
            </div>

            <style jsx>{`
              .cycle-not-found-container {
                min-height: 60vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                background: #f8fafc;
              }

              .not-found-box {
                max-width: 580px;
                background: #ffffff;
                padding: 40px;
                border-radius: 24px;
                border: 1px solid #e2e8f0;
                text-align: center;
                box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
              }

              .not-found-icon {
                font-size: 48px;
                margin-bottom: 16px;
              }

              .not-found-box h2 {
                font-size: 22px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 8px 0;
              }

              .not-found-box p {
                font-size: 14px;
                color: #64748b;
                margin: 0 0 24px 0;
              }

              .quick-cycles-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
                margin-bottom: 28px;
              }

              .cycle-quick-chip {
                padding: 8px 16px;
                background: #f1f5f9;
                color: #0f172a;
                font-size: 13px;
                font-weight: 600;
                border-radius: 999px;
                text-decoration: none;
                transition: all 0.2s ease;
              }

              .cycle-quick-chip:hover {
                background: #fffbeb;
                color: #d97706;
              }

              .back-home-btn {
                display: inline-block;
                background: #f59e0b;
                color: #ffffff;
                font-size: 13.5px;
                font-weight: 700;
                padding: 10px 24px;
                border-radius: 999px;
                text-decoration: none;
                transition: all 0.2s ease;
              }

              .back-home-btn:hover {
                background: #d97706;
              }
            `}</style>
          </div>
        )}
      </main>

      {/* Footer Sunubiblio */}
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
