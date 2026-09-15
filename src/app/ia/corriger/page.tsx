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

export default function IACorrigerPage() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [correctionType, setCorrectionType] = useState('detaillee');
  const [evaluationCriteria, setEvaluationCriteria] = useState('examen');

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1800);
  };

  const CORRECTION_LEVELS = [
    {
      id: 'simple',
      label: 'Synthétique',
      badge: 'Rapide',
      badgeColor: 'amber' as const,
      description: 'Validation direct Vrai / Faux et résultat numérique sans démonstration longue.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      )
    },
    {
      id: 'detaillee',
      label: 'Détaillée & Expliquée',
      badge: 'Recommandé',
      badgeColor: 'primary' as const,
      description: 'Analyse étape par étape, explications des règles, justifications et erreurs à éviter.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    },
    {
      id: 'coach',
      label: 'Mode Coach',
      badge: 'Pédagogique',
      badgeColor: 'success' as const,
      description: 'Indices guidés et questions de relance sans donner immédiatement la solution brute.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      )
    }
  ];

  const EVAL_OPTIONS = [
    {
      id: 'examen',
      label: 'Rigueur Examen & Concours',
      badge: 'Officiel',
      badgeColor: 'primary' as const,
      description: 'Barème strict conforme aux attentes du Baccalauréat et des concours nationaux (FASTEF, ENA).',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      id: 'bienveillant',
      label: 'Accompagnement Bienveillant',
      badge: 'Progression',
      badgeColor: 'success' as const,
      description: 'Valorisation des efforts, identification des points forts et pistes d’amélioration concrètes.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )
    }
  ];

  const ConfigPanel = (
    <div className="config-panel-pro">
      <div className="config-content-section">
        <AIInputSelector label="Collez votre réponse, exercice ou importez votre copie :" />
      </div>

      <AIOptionsPanel
        title="Niveau d'analyse et critères de correction"
        subtitle="Personnalisez la rigueur méthodologique et la profondeur des explications"
      >
        {/* Sélecteur Pro pour Niveau de détail */}
        <AIProOptionSelector
          label="Niveau de détail de la correction"
          options={CORRECTION_LEVELS}
          value={correctionType}
          onChange={setCorrectionType}
          layout="list"
        />

        {/* Sélecteur Pro pour Critère d'évaluation */}
        <AIProOptionSelector
          label="Barème et critères d'évaluation"
          options={EVAL_OPTIONS}
          value={evaluationCriteria}
          onChange={setEvaluationCriteria}
          layout="cards"
          columns={2}
        />
      </AIOptionsPanel>

      {/* Action Footer Bar */}
      <div className="action-panel-pro">
        <div className="action-hint">
          <span className="status-dot"></span>
          <span>Prêt pour analyse • Intégration Sunubiblio IA</span>
        </div>

        <button 
          className="btn-generate-pro"
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <div className="btn-spinner"></div>
              <span>Correction en cours...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Corriger avec l'IA</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .config-panel-pro {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .config-content-section {
          padding: 28px;
          flex: 1;
        }

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

        .btn-generate-pro:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .config-content-section {
            padding: 18px;
          }
          .action-panel-pro {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }
          .btn-generate-pro {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );

  const mockResult = (
    <div className="correction-result-flow">
      <div className="score-summary-banner">
        <div className="score-badge-circle">
          <span className="score-num">16</span>
          <span className="score-denom">/20</span>
        </div>
        <div className="score-summary-text">
          <h4 className="eval-status">Très bonne maîtrise de la méthode</h4>
          <p className="eval-sub">
            Le raisonnement est solide et suit les exigences du barème {evaluationCriteria === 'examen' ? 'Examen officiel' : 'Pédagogique'}. Quelques détails de rigueur à ajuster.
          </p>
        </div>
      </div>

      <div className="correction-blocks-list">
        <div className="correction-card card-error">
          <div className="card-top-tag">
            <span className="error-icon">✕</span>
            <strong>Point d’inattention repéré (Étape 2)</strong>
          </div>
          <p className="card-body-text">
            Vous avez appliqué la division sans vérifier préalablement que le dénominateur était strictement non nul. Cela peut faire perdre 0.5 point sur l'épreuve du Bac.
          </p>
        </div>

        <div className="correction-card card-solution">
          <div className="card-top-tag">
            <span className="check-icon">✓</span>
            <strong>Démarche recommandée & Justification</strong>
          </div>
          <p className="card-body-text">
            Posez d'abord : <em>« Pour tout x distinct de 3, l'expression est définie »</em>, puis procédez à la simplification algébrique étape par étape.
          </p>
        </div>

        <div className="correction-card card-pedagogy">
          <div className="card-top-tag">
            <span className="tip-icon">💡</span>
            <strong>Conseil pour les examens et concours</strong>
          </div>
          <p className="card-body-text">
            Encadrez toujours votre résultat final et mentionnez explicitement le théorème ou la formule de cours utilisée pour maximiser vos points.
          </p>
        </div>
      </div>

      <style jsx>{`
        .correction-result-flow {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .score-summary-banner {
          background: linear-gradient(135deg, #f8faff 0%, #f0fdf4 100%);
          border: 1px solid #bbf7d0;
          border-radius: 18px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .score-badge-circle {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: #166534;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.25);
        }

        .score-num {
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
        }

        .score-denom {
          font-size: 11px;
          font-weight: 700;
          opacity: 0.85;
        }

        .score-summary-text {
          display: flex;
          flex-direction: column;
        }

        .eval-status {
          font-size: 16px;
          font-weight: 800;
          color: #14532d;
          margin: 0 0 4px 0;
        }

        .eval-sub {
          font-size: 13px;
          color: #475569;
          margin: 0;
          line-height: 1.45;
        }

        .correction-blocks-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .correction-card {
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-error {
          background: #fff5f5;
          border: 1px solid #fed7d7;
        }

        .card-solution {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .card-pedagogy {
          background: #fbfbfe;
          border: 1px solid #e0e7ff;
        }

        .card-top-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
        }

        .card-error .card-top-tag { color: #991b1b; }
        .card-solution .card-top-tag { color: #166534; }
        .card-pedagogy .card-top-tag { color: #4338ca; }

        .card-body-text {
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0;
          color: #334155;
        }
      `}</style>
    </div>
  );

  const ResultPanel = (
    <AIProcessState 
      status={status} 
      loadingMessage="Analyse méthodique et correction détaillée en cours..."
      toolName="Correction"
    >
      <AIResultView 
        label="CORRECTION DÉTAILLÉE"
        content={mockResult}
        actions={[
          {
            label: "Générer un QCM d'entraînement",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
            href: "/ia/qcm"
          },
          {
            label: "Demander une explication",
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
            href: "/ia/expliquer"
          }
        ]}
      />
    </AIProcessState>
  );

  return (
    <>
      <Navbar />
      <AIWorkspaceLayout
        title="Corriger une réponse"
        subtitle="Analysez une réponse, un exercice ou une copie pour obtenir une correction expliquée et des conseils."
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
        resultPanel={ResultPanel}
      >
        {ConfigPanel}
      </AIWorkspaceLayout>
      <Footer />
    </>
  );
}
