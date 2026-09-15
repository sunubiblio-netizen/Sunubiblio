'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIWorkspaceLayout } from '@/components/ia/workspace/AIWorkspaceLayout';
import { IAAssistantDemo } from '@/components/ia/IAAssistantDemo';

export default function IAAssistantPage() {
  const [searchMode, setSearchMode] = useState<'ia' | 'web'>('ia');

  const ModeToggle = (
    <div className="mode-toggle-wrapper">
      <p className="toggle-label">Mode de réponse :</p>
      <div className="mode-toggle">
        <button 
          className={`toggle-btn ${searchMode === 'ia' ? 'active' : ''}`}
          onClick={() => setSearchMode('ia')}
        >
          IA uniquement
        </button>
        <button 
          className={`toggle-btn ${searchMode === 'web' ? 'active' : ''}`}
          onClick={() => setSearchMode('web')}
        >
          Rechercher sur Internet
        </button>
      </div>
      <style jsx>{`
        .mode-toggle-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .toggle-label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }
        .mode-toggle {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 9999px;
        }
        .toggle-btn {
          padding: 8px 16px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: #ffffff;
          color: #4f46e5;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05);
        }
      `}</style>
    </div>
  );

  return (
    <>
      <Navbar />
      <AIWorkspaceLayout
        title="Assistant IA Sunubiblio"
        subtitle="Discutez librement avec l'IA pour obtenir de l'aide sur vos cours et documents."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
        isSingleColumn={true}
      >
        <div style={{ padding: '24px' }}>
          {ModeToggle}
          {/* Reuse the demo chat component we made previously, just without its own section padding */}
          <div style={{ margin: '-60px 0' }}>
            <IAAssistantDemo />
          </div>
        </div>
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
