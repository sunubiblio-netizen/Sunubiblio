'use client';

import React from 'react';
import { IAToolCard, IATool } from './IAToolCard';

const AI_TOOLS: IATool[] = [
  {
    id: 'resumer',
    title: 'Résumer',
    description: 'Résumez rapidement un cours, un livre ou un document complexe.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="13" y2="18"></line></svg>
  },
  {
    id: 'expliquer',
    title: 'Expliquer',
    description: 'Obtenez une explication claire et adaptée à votre niveau sur n\'importe quel sujet.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  },
  {
    id: 'qcm',
    title: 'Générer des QCM',
    description: 'Créez des questions à choix multiples à partir d\'un cours ou d\'un document.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
  },
  {
    id: 'exercices',
    title: 'Générer des exercices',
    description: 'Créez des exercices pratiques adaptés à une matière et à un niveau spécifique.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  },
  {
    id: 'corriger',
    title: 'Corriger',
    description: 'Analysez une réponse ou un exercice et obtenez une correction détaillée et expliquée.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
  },
  {
    id: 'assistant',
    title: 'Assistant IA',
    description: 'Discutez avec l\'assistant interactif et posez-lui toutes vos questions librement.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  }
];

export const IAToolsGrid: React.FC = () => {
  return (
    <section className="ia-tools-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Que voulez-vous faire ?</h2>
          <p className="section-subtitle">
            Choisissez un outil pour commencer à travailler intelligemment avec Sunubiblio.
          </p>
        </div>

        <div className="tools-grid">
          {AI_TOOLS.map((tool) => (
            <IAToolCard
              key={tool.id}
              tool={tool}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .ia-tools-section {
          padding: 60px 0;
          background: #ffffff;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-title {
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 960px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
