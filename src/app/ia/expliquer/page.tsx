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

export default function IAExpliquerPage() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [level, setLevel] = useState('lycee');
  const [style, setStyle] = useState('etape');

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const levelOptions = [
    {
      id: 'vulgarise',
      title: 'Grand Public & Débutant',
      description: 'Vulgarisation par analogies simples et concrètes, sans jargon.',
      badge: 'Accessible',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      )
    },
    {
      id: 'lycee',
      title: 'Lycée & Prépa Bac',
      description: 'Définitions structurées, formules clés et méthodologie d\'examen.',
      badge: 'Recommandé',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    },
    {
      id: 'universitaire',
      title: 'Universitaire & Concours',
      description: 'Formalisme académique poussé, démonstrations et rigueur théorique.',
      badge: 'Expert',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  const styleOptions = [
    {
      id: 'etape',
      title: 'Décomposition pas à pas',
      description: 'Idéal pour comprendre les théorèmes, algorithmes et étapes de raisonnement.',
      badge: 'Pédagogique'
    },
    {
      id: 'analogie',
      title: 'Méthode par analogies',
      description: 'Illustrations par des exemples intuitifs du monde réel pour mémoriser vite.',
      badge: 'Intuitif'
    }
  ];

  const ConfigPanel = (
    <div className="config-panel">
      <div className="config-content">
        <AIInputSelector 
          label="Que voulez-vous comprendre ou approfondir ?" 
          placeholder="Posez une question, collez un théorème, une notion complexe ou un extrait de cours..."
        />
      </div>
      <AIOptionsPanel>
        <AIProOptionSelector
          label="Niveau de rigueur & profondeur"
          description="Ajuste le vocabulaire, la technicité et les prérequis de l'explication."
          options={levelOptions}
          value={level}
          onChange={setLevel}
          layout="list"
        />

        <div style={{ height: '16px' }} />

        <AIProOptionSelector
          label="Méthode d'explication"
          description="Choisissez la stratégie d'apprentissage la plus adaptée à vos besoins."
          options={styleOptions}
          value={style}
          onChange={setStyle}
          layout="cards"
        />
      </AIOptionsPanel>
      <div className="action-panel">
        <button 
          className="btn-generate"
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Analyse & Synthèse pédagogique...' : 'Expliquer avec l\'IA'}
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
      <h2>Explication (Démonstration)</h2>
      <p>Voici une explication factice de la notion demandée. Adaptée pour le niveau : <strong>{level}</strong>.</p>
      <h3>Concept clé</h3>
      <p>Imaginez que l'Intelligence Artificielle est comme un étudiant très studieux qui a lu des millions de livres. Lorsqu'on lui pose une question, il s'appuie sur ces lectures pour formuler une réponse pertinente.</p>
      <h3>Points importants</h3>
      <ul>
        <li>Réseaux de neurones</li>
        <li>Apprentissage profond (Deep Learning)</li>
        <li>Traitement du langage naturel (NLP)</li>
      </ul>
      <p>Cette réponse sera générée par Gemini dans la version finale.</p>
    </div>
  );

  const ResultPanel = (
    <AIProcessState status={status} loadingMessage="L'IA génère votre explication...">
      <AIResultView 
        label="EXPLICATION"
        content={mockResult}
        actions={[
          {
            label: "Générer un QCM pour vérifier",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
            href: "/ia/qcm"
          }
        ]}
      />
    </AIProcessState>
  );

  return (
    <>
      <Navbar />
      <AIWorkspaceLayout
        title="Expliquer"
        subtitle="Obtenez une explication claire et adaptée à votre niveau sur n'importe quel sujet."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
        resultPanel={ResultPanel}
      >
        {ConfigPanel}
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
