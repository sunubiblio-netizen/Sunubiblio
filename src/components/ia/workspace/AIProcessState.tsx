'use client';

import React from 'react';

export type AIStatus = 'idle' | 'loading' | 'success' | 'error';

interface AIProcessStateProps {
  status: AIStatus;
  loadingMessage?: string;
  errorMessage?: string;
  toolName?: string;
  children: React.ReactNode; // Content when success
}

export const AIProcessState: React.FC<AIProcessStateProps> = ({ 
  status, 
  loadingMessage = "L'intelligence artificielle analyse votre contenu...", 
  errorMessage = "Une erreur s'est produite lors du traitement. Veuillez réessayer.",
  toolName = "Résultat généré",
  children 
}) => {
  if (status === 'idle') {
    return (
      <div className="ai-workspace-idle-canvas">
        <div className="ambient-halo"></div>

        <div className="idle-content-center">
          <div className="blueprint-mockup-card">
            <div className="mockup-header">
              <div className="dots-row">
                <span className="dot dot-r"></span>
                <span className="dot dot-y"></span>
                <span className="dot dot-g"></span>
              </div>
              <span className="mockup-tag">Aperçu du canevas de résultat</span>
            </div>

            <div className="mockup-body">
              <div className="skeleton-line line-title"></div>
              <div className="skeleton-badges-row">
                <div className="skeleton-badge badge-p"></div>
                <div className="skeleton-badge badge-s"></div>
              </div>
              <div className="skeleton-line line-p1"></div>
              <div className="skeleton-line line-p2"></div>
              <div className="skeleton-line line-p3"></div>
              <div className="skeleton-highlight-box">
                <div className="skeleton-line line-inner"></div>
              </div>
            </div>
          </div>

          <h3 className="idle-main-title">Prêt pour la génération intelligente</h3>
          <p className="idle-sub-desc">
            Sélectionnez votre document ou collez votre texte à gauche, ajustez vos options personnalisées, puis lancez le traitement pour visualiser votre {toolName.toLowerCase()}.
          </p>

          <div className="workflow-steps-pill">
            <div className="wf-step">
              <span className="wf-num">1</span>
              <span>Source</span>
            </div>
            <span className="wf-sep">→</span>
            <div className="wf-step">
              <span className="wf-num">2</span>
              <span>Options</span>
            </div>
            <span className="wf-sep">→</span>
            <div className="wf-step highlight">
              <span className="wf-num">3</span>
              <span>Génération IA</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .ai-workspace-idle-canvas {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 480px;
            text-align: center;
            padding: 40px 24px;
            position: relative;
            overflow: hidden;
            background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
          }

          .ambient-halo {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.05) 45%, transparent 70%);
            pointer-events: none;
            filter: blur(40px);
          }

          .idle-content-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 440px;
            position: relative;
            z-index: 1;
          }

          .blueprint-mockup-card {
            width: 100%;
            max-width: 320px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.95);
            border-radius: 18px;
            padding: 16px;
            box-shadow: 0 16px 36px -10px rgba(99, 102, 241, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.05);
            margin-bottom: 24px;
            opacity: 0.85;
            transition: all 0.2s ease;
          }

          .blueprint-mockup-card:hover {
            opacity: 1;
            transform: translateY(-2px);
          }

          .mockup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
            margin-bottom: 14px;
          }

          .dots-row {
            display: flex;
            gap: 5px;
          }

          .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }

          .dot-r { background: #fca5a5; }
          .dot-y { background: #fde68a; }
          .dot-g { background: #86efac; }

          .mockup-tag {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .mockup-body {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .skeleton-line {
            height: 8px;
            border-radius: 4px;
            background: #f1f5f9;
          }

          .line-title { width: 60%; height: 12px; background: #e0e7ff; margin-bottom: 4px; }
          .line-p1 { width: 92%; }
          .line-p2 { width: 85%; }
          .line-p3 { width: 70%; }

          .skeleton-badges-row {
            display: flex;
            gap: 6px;
            margin-bottom: 4px;
          }

          .skeleton-badge {
            width: 44px;
            height: 14px;
            border-radius: 4px;
          }

          .badge-p { background: #e0e7ff; }
          .badge-s { background: #dcfce7; }

          .skeleton-highlight-box {
            background: #f8faff;
            border: 1px solid #e0e7ff;
            border-radius: 8px;
            padding: 8px 10px;
            margin-top: 4px;
          }

          .line-inner {
            width: 75%;
            height: 6px;
            background: #cbd5e1;
          }

          .idle-main-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 8px 0;
            letter-spacing: -0.01em;
          }

          .idle-sub-desc {
            font-size: 13.5px;
            color: #64748b;
            line-height: 1.6;
            margin: 0 0 24px 0;
          }

          .workflow-steps-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.9);
            border-radius: 9999px;
            padding: 6px 16px;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
          }

          .wf-step {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .wf-num {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #f1f5f9;
            color: #475569;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
          }

          .wf-step.highlight {
            color: #4f46e5;
          }

          .wf-step.highlight .wf-num {
            background: #4f46e5;
            color: #ffffff;
          }

          .wf-sep {
            color: #cbd5e1;
          }
        `}</style>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="ai-loading-state">
        <div className="ambient-halo"></div>

        <div className="loading-center-card">
          <div className="radar-spinner">
            <div className="radar-circle-pulse"></div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>

          <div className="typing-dots-pill">
            <span className="t-dot"></span>
            <span className="t-dot"></span>
            <span className="t-dot"></span>
          </div>

          <h4 className="loading-title">{loadingMessage}</h4>
          <p className="loading-sub">Génération structurée en cours • Passerelle IA Sunubiblio</p>
        </div>

        <style jsx>{`
          .ai-loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 480px;
            padding: 40px 24px;
            position: relative;
            background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
          }

          .ambient-halo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%);
            pointer-events: none;
            filter: blur(35px);
          }

          .loading-center-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 400px;
            position: relative;
            z-index: 1;
          }

          .radar-spinner {
            width: 64px;
            height: 64px;
            border-radius: 20px;
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
            box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
          }

          .radar-circle-pulse {
            position: absolute;
            inset: -4px;
            border-radius: 24px;
            border: 2px solid #6366f1;
            animation: pulseWave 1.8s infinite ease-out;
          }

          .typing-dots-pill {
            display: flex;
            gap: 5px;
            margin-bottom: 12px;
          }

          .t-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #6366f1;
            animation: dotBounce 1.4s infinite ease-in-out both;
          }

          .t-dot:nth-child(1) { animation-delay: -0.32s; }
          .t-dot:nth-child(2) { animation-delay: -0.16s; }

          .loading-title {
            font-size: 16.5px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 6px 0;
          }

          .loading-sub {
            font-size: 13px;
            color: #64748b;
            margin: 0;
          }

          @keyframes pulseWave {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.3); opacity: 0; }
          }

          @keyframes dotBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="ai-error-state">
        <div className="error-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h4 className="error-title">Une erreur est survenue</h4>
        <p className="error-text">{errorMessage}</p>

        <style jsx>{`
          .ai-error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 480px;
            text-align: center;
            padding: 40px 24px;
          }

          .error-icon {
            width: 60px;
            height: 60px;
            background: #fef2f2;
            color: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }

          .error-title {
            font-size: 17px;
            font-weight: 800;
            color: #991b1b;
            margin: 0 0 6px 0;
          }

          .error-text {
            color: #64748b;
            font-size: 14px;
            margin: 0;
            max-width: 360px;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
