'use client';

import React from 'react';
import Link from 'next/link';

interface AIResultViewProps {
  content: React.ReactNode;
  label?: string;
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    href?: string;
    primary?: boolean;
  }>;
}

export const AIResultView: React.FC<AIResultViewProps> = ({ 
  content, 
  label = "RÉSULTAT",
  actions = []
}) => {
  return (
    <div className="ai-result-view">
      <div className="result-header">
        <div className="result-label">
          <span className="dot"></span>
          {label}
        </div>
        <div className="result-actions">
          <button className="action-btn" title="Copier" onClick={() => alert('Copié dans le presse-papier')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>

      <div className="result-content">
        {content}
      </div>

      {actions.length > 0 && (
        <div className="result-footer">
          <p className="footer-title">Que voulez-vous faire ensuite ?</p>
          <div className="footer-actions">
            {actions.map((act, i) => {
              if (act.href) {
                return (
                  <Link key={i} href={act.href} className={`next-action-btn ${act.primary ? 'primary' : ''}`}>
                    {act.icon}
                    {act.label}
                  </Link>
                );
              }
              return (
                <button key={i} onClick={act.onClick} className={`next-action-btn ${act.primary ? 'primary' : ''}`}>
                  {act.icon}
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-result-view {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: #f8fafc;
        }

        .result-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #4f46e5;
          letter-spacing: 0.05em;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .result-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          font-size: 15px;
          line-height: 1.7;
          color: #334155;
        }

        /* Styles pour le Markdown simulé */
        .result-content :global(h1), 
        .result-content :global(h2), 
        .result-content :global(h3) {
          color: #0f172a;
          margin-top: 0;
        }

        .result-content :global(ul) {
          padding-left: 20px;
        }

        .result-content :global(li) {
          margin-bottom: 8px;
        }

        .result-footer {
          padding: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          background: #f8fafc;
        }

        .footer-title {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .footer-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        :global(.next-action-btn) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 9px !important;
          padding: 10px 18px !important;
          background: #ffffff !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 9999px !important;
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #334155 !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        }

        :global(.next-action-btn svg) {
          color: #6366f1 !important;
          transition: transform 0.2s ease !important;
        }

        :global(.next-action-btn:hover) {
          background: #f8fafc !important;
          border-color: #6366f1 !important;
          color: #4f46e5 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px -2px rgba(99, 102, 241, 0.16) !important;
        }

        :global(.next-action-btn:hover svg) {
          transform: scale(1.1) !important;
        }

        :global(.next-action-btn.primary) {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%) !important;
          border-color: transparent !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.35) !important;
        }

        :global(.next-action-btn.primary svg) {
          color: #ffffff !important;
        }

        :global(.next-action-btn.primary:hover) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px -2px rgba(79, 70, 229, 0.45) !important;
        }
      `}</style>
    </div>
  );
};
