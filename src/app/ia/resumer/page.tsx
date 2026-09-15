'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIWorkspaceLayout } from '@/components/ia/workspace/AIWorkspaceLayout';
import { AIInputSelector } from '@/components/ia/workspace/AIInputSelector';
import { AIOptionsPanel } from '@/components/ia/workspace/AIOptionsPanel';
import { AIProOptionSelector } from '@/components/ia/workspace/AIProOptionSelector';
import { AIProcessState, AIStatus } from '@/components/ia/workspace/AIProcessState';
import { AIResultView } from '@/components/ia/workspace/AIResultView';

export default function IAResumerPage() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [length, setLength] = useState('standard');
  const [style, setStyle] = useState('simple');

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1800);
  };

  const LENGTH_OPTIONS = [
    {
      id: 'points-cles',
      label: 'Points Clés & Fiche',
      badge: 'Rapide',
      badgeColor: 'amber' as const,
      description: 'L’essentiel sous forme de puces courtes, dates, formules et définitions prioritaires.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      )
    },
    {
      id: 'standard',
      label: 'Synthèse Standard',
      badge: 'Recommandé',
      badgeColor: 'primary' as const,
      description: 'Résumé équilibré en 2 à 3 paragraphes structurés avec articulation des arguments.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="13" y2="18"></line>
        </svg>
      )
    },
    {
      id: 'detaille',
      label: 'Plan Détaillé & Analyse',
      badge: 'Complet',
      badgeColor: 'success' as const,
      description: 'Synthèse approfondie respectant la structure I, II, III avec développements.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      )
    }
  ];

  const STYLE_OPTIONS = [
    {
      id: 'simple',
      label: 'Simple & Accessible',
      badge: 'Vulgarisation',
      badgeColor: 'success' as const,
      description: 'Clair et direct, idéal pour réviser sans jargon complexe.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      )
    },
    {
      id: 'academique',
      label: 'Académique & Concours',
      badge: 'Excellence',
      badgeColor: 'primary' as const,
      description: 'Terminologie exacte, rigueur méthodologique et style soutenu.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      )
    }
  ];

  const ConfigPanel = (
    <div className="config-panel-pro">
      <div className="config-content-section">
        <AIInputSelector label="Que souhaitez-vous résumer ?" />
      </div>

      <AIOptionsPanel
        title="Format et style du résumé"
        subtitle="Définissez la longueur idéale et le ton souhaité pour votre synthèse"
      >
        <AIProOptionSelector
          label="Longueur et niveau de détail souhaité"
          options={LENGTH_OPTIONS}
          value={length}
          onChange={setLength}
          layout="list"
        />

        <AIProOptionSelector
          label="Style de rédaction"
          options={STYLE_OPTIONS}
          value={style}
          onChange={setStyle}
          layout="cards"
          columns={2}
        />
      </AIOptionsPanel>

      <div className="action-panel-pro">
        <div className="action-hint">
          <span className="status-dot"></span>
          <span>Prêt pour synthèse • Intégration Sunubiblio IA</span>
        </div>

        <button 
          className="btn-generate-pro"
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <div className="btn-spinner"></div>
              <span>Synthèse en cours...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
              <span>Résumer avec l'IA</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .config-panel-pro { display: flex; flex-direction: column; height: 100%; }
        .config-content-section { padding: 28px; flex: 1; }
        .action-panel-pro {
          padding: 20px 28px;
          background: #ffffff;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          position: sticky;
          bottom: 0;
          z-index: 10;
          box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.04);
        }
        .action-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        .btn-generate-pro {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
          color: #ffffff;
          padding: 13px 28px;
          border-radius: 9999px;
          border: none;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 6px 20px -2px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
        }
        .btn-generate-pro:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px -2px rgba(79, 70, 229, 0.45);
        }
        .btn-generate-pro:disabled { opacity: 0.65; cursor: not-allowed; }
        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .config-content-section { padding: 18px; }
          .action-panel-pro { flex-direction: column; align-items: stretch; padding: 16px; }
          .btn-generate-pro { justify-content: center; }
        }
      `}</style>
    </div>
  );

  const mockResult = (
    <div className="resumer-result-flow">
      <div className="res-card-head">
        <span className="res-badge">Synthèse structurée • {length.toUpperCase()}</span>
        <h3>Résumé des concepts fondamentaux</h3>
      </div>

      <div className="summary-paragraphs">
        <p>
          Ce cours expose les principes fondamentaux de la discipline en articulant les définitions clés et leurs champs d'application pratiques dans le cadre des épreuves académiques.
        </p>

        <div className="key-takeaways-box">
          <h4>💡 Les 3 points majeurs à retenir :</h4>
          <ul>
            <li><strong>Définition nominale :</strong> Maîtriser le vocabulaire technique officiel exigé au barème national.</li>
            <li><strong>Méthode d'application :</strong> Toujours énoncer les hypothèses préalables avant de poser la démonstration.</li>
            <li><strong>Interprétation :</strong> Mettre en relation directe le résultat numérique avec la réalité observable.</li>
          </ul>
        </div>

        <p>
          En conclusion, la maîtrise de ces notions constitue le socle indispensable pour aborder les exercices de niveau supérieur et les sujets types d'examens.
        </p>
      </div>

      <style jsx>{`
        .resumer-result-flow { display: flex; flex-direction: column; gap: 16px; }
        .res-card-head { display: flex; flex-direction: column; gap: 4px; }
        .res-badge {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }
        .res-card-head h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0; }
        .summary-paragraphs { font-size: 14.5px; color: #334155; line-height: 1.65; display: flex; flex-direction: column; gap: 14px; }
        .summary-paragraphs p { margin: 0; }
        .key-takeaways-box {
          background: #f8faff;
          border: 1px solid #e0e7ff;
          border-radius: 14px;
          padding: 16px;
        }
        .key-takeaways-box h4 { font-size: 13.5px; font-weight: 800; color: #312e81; margin: 0 0 8px 0; }
        .key-takeaways-box ul { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
      `}</style>
    </div>
  );

  const ResultPanel = (
    <AIProcessState 
      status={status} 
      loadingMessage="Extraction des points clés et synthèse en cours..."
      toolName="Résumé"
    >
      <AIResultView 
        label="RÉSUMÉ STRUCTURÉ"
        content={mockResult}
        actions={[
          {
            label: "Générer un QCM associé",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
            href: "/ia/qcm"
          },
          {
            label: "Créer des exercices",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
            href: "/ia/exercices"
          }
        ]}
      />
    </AIProcessState>
  );

  return (
    <>
      <Navbar />
      <AIWorkspaceLayout
        title="Résumer un contenu"
        subtitle="Obtenez rapidement l'essentiel d'un cours, d'un livre ou d'un document long sous forme structurée."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="13" y2="18"></line></svg>}
        resultPanel={ResultPanel}
      >
        {ConfigPanel}
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
