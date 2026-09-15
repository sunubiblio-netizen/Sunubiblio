'use client';

import React from 'react';
import { PlagiarismAnalysisStep } from '@/types/plagiarism';

interface AntiplagiatProgressStateProps {
  currentStep: PlagiarismAnalysisStep;
  documentName: string;
}

const STEPS = [
  { id: 'reading', label: '1. Lecture et validation du document' },
  { id: 'extracting', label: '2. Extraction et normalisation du texte' },
  { id: 'comparing', label: '3. Découpage et analyse des passages' },
  { id: 'matching', label: '4. Recherche de similarités dans le fonds Sunubiblio' },
  { id: 'generating_report', label: '5. Calcul du score et synthèse du rapport' },
];

export const AntiplagiatProgressState: React.FC<AntiplagiatProgressStateProps> = ({
  currentStep,
  documentName,
}) => {
  const getStepIndex = (step: PlagiarismAnalysisStep) => {
    switch (step) {
      case 'reading': return 0;
      case 'extracting': return 1;
      case 'comparing': return 2;
      case 'matching': return 3;
      case 'generating_report': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStep);

  return (
    <div className="progress-container-card">
      <div className="progress-header">
        <div className="radar-spinner-wrap">
          <div className="radar-pulse"></div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 className="progress-title">Vérification de similarité en cours</h3>
        <p className="progress-doc-name">Document : <strong>{documentName}</strong></p>
      </div>

      <div className="steps-vertical-list">
        {STEPS.map((step, idx) => {
          const isDone = activeIndex > idx;
          const isCurrent = activeIndex === idx;

          return (
            <div key={step.id} className={`step-row ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="step-bullet">
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : isCurrent ? (
                  <div className="bullet-spinner"></div>
                ) : (
                  <span className="bullet-dot"></span>
                )}
              </div>
              <span className="step-text">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="confidential-notice">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>
          Traitement confidentiel sécurisé — Votre document ne sera jamais rendu public ni accessible à d'autres utilisateurs.
        </span>
      </div>

      <style jsx>{`
        .progress-container-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 36px 30px;
          max-width: 640px;
          margin: 0 auto;
          box-shadow: 0 12px 36px -8px rgba(15, 23, 42, 0.06);
          text-align: center;
        }

        .progress-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .radar-spinner-wrap {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 16px;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
        }

        .radar-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          border: 2px solid #6366f1;
          opacity: 0.8;
          animation: pulsePing 2s infinite ease-out;
        }

        .progress-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .progress-doc-name {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        .steps-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          background: #f8faff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 13.5px;
          transition: all 0.2s ease;
        }

        .step-row.current {
          color: #4f46e5;
          font-weight: 700;
        }

        .step-row.done {
          color: #334155;
          font-weight: 600;
        }

        .step-bullet {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-row.done .step-bullet {
          background: #eef2ff;
          color: #4f46e5;
        }

        .step-row.current .step-bullet {
          background: #e0e7ff;
          color: #4f46e5;
        }

        .bullet-spinner {
          width: 10px;
          height: 10px;
          border: 2px solid #6366f1;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
        }

        .confidential-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: 10px;
        }

        @keyframes pulsePing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
