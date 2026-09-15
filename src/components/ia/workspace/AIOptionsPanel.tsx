'use client';

import React from 'react';

interface AIOptionsPanelProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AIOptionsPanel: React.FC<AIOptionsPanelProps> = ({ 
  title = "Options et niveau de personnalisation",
  subtitle = "Adaptez les critères de traitement de l'IA selon vos objectifs",
  children 
}) => {
  return (
    <div className="ai-options-panel-pro">
      <div className="panel-header-line">
        <div className="title-with-badge">
          <span className="sparkle-dot"></span>
          <h3 className="options-title">{title}</h3>
        </div>
        {subtitle && <p className="options-subtitle">{subtitle}</p>}
      </div>

      <div className="options-content-stack">
        {children}
      </div>

      <style jsx>{`
        .ai-options-panel-pro {
          padding: 24px 28px;
          border-top: 1px solid rgba(226, 232, 240, 0.85);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-header-line {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .title-with-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sparkle-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px #6366f1;
        }

        .options-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .options-subtitle {
          font-size: 12.5px;
          color: #64748b;
          margin: 0;
        }

        .options-content-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  );
};
