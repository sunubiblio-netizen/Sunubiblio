'use client';

import React from 'react';
import Link from 'next/link';

interface AIWorkspaceLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  resultPanel?: React.ReactNode;
  isSingleColumn?: boolean;
}

export const AIWorkspaceLayout: React.FC<AIWorkspaceLayoutProps> = ({
  title,
  subtitle,
  icon,
  children,
  resultPanel,
  isSingleColumn = false
}) => {
  return (
    <div className="ai-workspace">
      <div className="workspace-header">
        <div className="container">
          <div className="top-nav-row">
            <Link href="/ia" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Retour au Hub IA
            </Link>
          </div>
          
          <div className="header-content-centered">
            <div className="header-icon">
              {icon}
            </div>
            <div className="header-text">
              <h1 className="workspace-title">{title}</h1>
              <p className="workspace-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-body">
        <div className="container">
          <div className={`workspace-grid ${isSingleColumn ? 'single-col' : ''}`}>
            <div className="workspace-config-panel">
              {children}
            </div>
            
            {!isSingleColumn && resultPanel && (
              <div className="workspace-result-panel">
                {resultPanel}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-workspace {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .workspace-header {
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 24px 0 32px 0;
        }

        .top-nav-row {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 16px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #4f46e5;
        }

        .header-content-centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          max-width: 700px;
          margin: 0 auto;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-text {
          text-align: center;
          width: 100%;
        }

        .workspace-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .workspace-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          text-align: center;
        }

        .workspace-body {
          flex: 1;
          padding: 40px 0;
        }

        .workspace-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: 32px;
          align-items: start;
        }

        .workspace-grid.single-col {
          grid-template-columns: 1fr;
          max-width: 800px;
          margin: 0 auto;
        }

        .workspace-config-panel {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.02);
          overflow: hidden;
          min-width: 0;
        }

        .workspace-result-panel {
          position: sticky;
          top: 24px;
          max-height: calc(100vh - 48px);
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.02);
          overflow: hidden;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        @media (max-width: 1024px) {
          .workspace-grid {
            grid-template-columns: 1fr;
          }
          
          .workspace-result-panel {
            position: static;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};
