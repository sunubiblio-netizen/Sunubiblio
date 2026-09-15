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

export default function IAQCMPage() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [questionsCount, setQuestionsCount] = useState('10');
  const [difficulty, setDifficulty] = useState('moyen');

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 2500);
  };

  const countOptions = [
    {
      id: '5',
      title: '5 Questions',
      description: 'Quiz express pour vérifier la mémorisation immédiate (3 min).',
      badge: 'Rapide',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: '10',
      title: '10 Questions',
      description: 'Évaluation équilibrée couvrant l\'ensemble des notions clés.',
      badge: 'Recommandé',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      id: '20',
      title: '20 Questions',
      description: 'Grand format pour simulation d\'examen et entraînement intensif.',
      badge: 'Examen',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  const difficultyOptions = [
    {
      id: 'facile',
      title: 'Fondamentaux & Définitions',
      description: 'Questions directes de cours pour valider les repères essentiels.',
      badge: 'Accessible'
    },
    {
      id: 'moyen',
      title: 'Compréhension & Analyse',
      description: 'Mises en situation, pièges classiques et nuances du programme.',
      badge: 'Standard'
    },
    {
      id: 'difficile',
      title: 'Niveau Concours & Annales',
      description: 'Distracteurs fins, cas cliniques/problèmes complexes et chronométrage.',
      badge: 'Avancé'
    }
  ];

  const ConfigPanel = (
    <div className="config-panel">
      <div className="config-content">
        <AIInputSelector 
          label="À partir de quoi voulez-vous créer votre QCM ?" 
          placeholder="Collez un chapitre, un texte de loi, un cours ou importez un document de votre bibliothèque..."
        />
      </div>
      <AIOptionsPanel>
        <AIProOptionSelector
          label="Volume de questions"
          description="Déterminez la longueur et le temps estimé pour l'exercice."
          options={countOptions}
          value={questionsCount}
          onChange={setQuestionsCount}
          layout="list"
        />

        <div style={{ height: '16px' }} />

        <AIProOptionSelector
          label="Niveau d'exigence & difficulté"
          description="Ajuste la subtilité des réponses et le niveau de réflexion exigé."
          options={difficultyOptions}
          value={difficulty}
          onChange={setDifficulty}
          layout="cards"
        />
      </AIOptionsPanel>
      <div className="action-panel">
        <button 
          className="btn-generate"
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Conception des questions...' : 'Générer le QCM avec l\'IA'}
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
      <h2>QCM Généré : {questionsCount} questions (Niveau {difficulty})</h2>
      <p><em>Note : Ceci est une interface de démonstration. Dans la version finale, le QCM sera interactif (cliquable avec calcul de score).</em></p>
      
      <div style={{ marginTop: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <p style={{ fontWeight: 600, margin: '0 0 12px 0' }}>1. Quelle est la principale utilité d'un réseau de neurones artificiel ?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}><input type="radio" name="q1" /> A. Faire le café</label>
          <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}><input type="radio" name="q1" /> B. Apprendre des motifs à partir de données</label>
          <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}><input type="radio" name="q1" /> C. Stocker des fichiers HTML</label>
        </div>
      </div>
    </div>
  );

  const ResultPanel = (
    <AIProcessState status={status} loadingMessage="Génération des questions en cours...">
      <AIResultView 
        label="QCM INTERACTIF"
        content={mockResult}
        actions={[
          {
            label: "Corriger mes réponses",
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
        title="Générer des QCM"
        subtitle="Créez des questions à choix multiples à partir de n'importe quel contenu."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>}
        resultPanel={ResultPanel}
      >
        {ConfigPanel}
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
