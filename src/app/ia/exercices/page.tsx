'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIWorkspaceLayout } from '@/components/ia/workspace/AIWorkspaceLayout';
import { AIInputSelector } from '@/components/ia/workspace/AIInputSelector';
import { AIOptionsPanel } from '@/components/ia/workspace/AIOptionsPanel';
import { AIProcessState, AIStatus } from '@/components/ia/workspace/AIProcessState';
import { AIResultView } from '@/components/ia/workspace/AIResultView';
import { AIProOptionSelector } from '@/components/ia/workspace/AIProOptionSelector';

export default function IAExercicesPage() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [type, setType] = useState('synthese');
  const [formatCorrection, setFormatCorrection] = useState('detaillee');

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const typeOptions = [
    {
      id: 'application',
      title: 'Application directe du cours',
      description: 'Exercices ciblés pour maîtriser les formules de base et théorèmes.',
      badge: 'Fondation',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    },
    {
      id: 'synthese',
      title: 'Problème de synthèse',
      description: 'Mise en situation complète reliant plusieurs notions avec raisonnement guidé.',
      badge: 'Recommandé',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      )
    },
    {
      id: 'annales',
      title: 'Sujet type Concours / Examen',
      description: 'Questions d\'annales officielles avec barème de points et rigueur académique.',
      badge: 'Concours',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  const correctionOptions = [
    {
      id: 'detaillee',
      title: 'Correction intégrale pas à pas',
      description: 'Démonstration complète de la méthode et rappels de cours associés.',
      badge: 'Autonomie'
    },
    {
      id: 'guidance',
      title: 'Indices progressifs & Méthode',
      description: 'Aide à la réflexion étape par étape sans donner immédiatement la solution finale.',
      badge: 'Pédagogique'
    }
  ];

  const ConfigPanel = (
    <div className="config-panel">
      <div className="config-content">
        <AIInputSelector 
          label="Sur quelle leçon ou thème voulez-vous des exercices ?" 
          placeholder="Entrez un thème précis (ex: Équations différentielles, Droit des obligations, Génétique...) ou collez votre cours..."
        />
      </div>
      <AIOptionsPanel>
        <AIProOptionSelector
          label="Typologie de l'exercice"
          description="Adaptez le niveau d'exigence selon vos objectifs de révision."
          options={typeOptions}
          value={type}
          onChange={setType}
          layout="list"
        />

        <div style={{ height: '16px' }} />

        <AIProOptionSelector
          label="Accompagnement méthodologique"
          description="Choisissez comment l'IA formule la solution et les indices d'apprentissage."
          options={correctionOptions}
          value={formatCorrection}
          onChange={setFormatCorrection}
          layout="cards"
        />
      </AIOptionsPanel>
      <div className="action-panel">
        <button 
          className="btn-generate"
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Élaboration de l\'exercice...' : 'Générer les exercices avec l\'IA'}
        </button>
      </div>

      <style jsx>{`
        .config-panel { display: flex; flex-direction: column; height: 100%; }
        .config-content { padding: 24px; flex: 1; }
        .action-panel { 
          padding: 20px 24px; 
          background: #ffffff; 
          border-top: 1px solid #f1f5f9; 
          display: flex; 
          justify-content: flex-end; 
          position: sticky;
          bottom: 0;
          z-index: 10;
          box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.04);
        }
        .btn-generate { 
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); 
          color: #ffffff; 
          padding: 13px 28px; 
          border-radius: 12px; 
          border: none; 
          font-weight: 700; 
          font-size: 15px; 
          cursor: pointer; 
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px -3px rgba(79, 70, 229, 0.4);
        }
        .btn-generate:hover:not(:disabled) { 
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -3px rgba(79, 70, 229, 0.5);
        }
        .btn-generate:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );

  const mockResult = (
    <div>
      <h2>Exercice Généré</h2>
      <p><em>Format : {type} — Méthode : {formatCorrection}</em></p>
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
        <p><strong>Énoncé :</strong><br/>
        Un train part de Dakar à 8h00 à une vitesse moyenne de 80 km/h. Un second train part de Thiès...</p>
        <textarea 
          placeholder="Rédigez votre réponse ici..." 
          style={{ width: '100%', minHeight: '100px', marginTop: '16px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        ></textarea>
      </div>
    </div>
  );

  const ResultPanel = (
    <AIProcessState status={status} loadingMessage="Génération des exercices...">
      <AIResultView 
        label="EXERCICE"
        content={mockResult}
        actions={[
          {
            label: "Corriger ma réponse",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
            href: "/ia/corriger"
          }
        ]}
      />
    </AIProcessState>
  );

  return (
    <>
      <Navbar />
      <AIWorkspaceLayout
        title="Générer des exercices"
        subtitle="Créez des exercices pratiques adaptés à votre niveau."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
        resultPanel={ResultPanel}
      >
        {ConfigPanel}
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
