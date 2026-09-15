'use client';

import React from 'react';
import { PlagiarismHistoryItem } from '@/types/plagiarism';

interface AntiplagiatHistoryProps {
  history: PlagiarismHistoryItem[];
  onSelectHistoryItem: (item: PlagiarismHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const AntiplagiatHistory: React.FC<AntiplagiatHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="antiplagiat-history-card">
      <div className="history-header">
        <div className="history-title-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h3 className="history-title">Historique de vos vérifications antiplagiat</h3>
        </div>
        <span className="history-count-badge">{history.length} analyse{history.length > 1 ? 's' : ''}</span>
      </div>

      <div className="history-list">
        {history.map((item) => {
          const scoreClass = item.similarityScore <= 15 ? 'low' : item.similarityScore <= 35 ? 'mid' : 'high';

          return (
            <div key={item.id} className="history-item-row">
              <div className="item-main-info" onClick={() => onSelectHistoryItem(item)}>
                <div className="doc-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="doc-meta">
                  <h4 className="doc-name-title">{item.documentName}</h4>
                  <div className="doc-subline">
                    <span>{item.date}</span>
                    <span>• {item.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="item-actions-side">
                <div className={`score-badge ${scoreClass}`}>
                  <strong>{item.similarityScore}%</strong>
                  <span>similarité</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectHistoryItem(item)}
                  className="btn-view-report"
                  title="Consulter le rapport"
                >
                  Voir
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="btn-delete-hist"
                  title="Supprimer cette analyse de l'historique"
                  aria-label="Supprimer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .antiplagiat-history-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .history-title-box {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1e293b;
        }

        .history-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .history-count-badge {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 10px;
          border-radius: 9999px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 16px;
          transition: all 0.15s ease;
          gap: 12px;
        }

        .history-item-row:hover {
          border-color: #6366f1;
          background: #fbfbfe;
        }

        .item-main-info {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          min-width: 0;
          flex: 1;
        }

        .doc-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .doc-meta {
          min-width: 0;
        }

        .doc-name-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-subline {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .item-actions-side {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 10px;
          border-radius: 8px;
          min-width: 68px;
          text-align: center;
        }

        .score-badge strong {
          font-size: 14px;
          line-height: 1;
        }

        .score-badge span {
          font-size: 9.5px;
          text-transform: uppercase;
        }

        .score-badge.low {
          background: #f0fdf4;
          color: #166534;
        }

        .score-badge.mid {
          background: #fffbeb;
          color: #b45309;
        }

        .score-badge.high {
          background: #fef2f2;
          color: #b91c1c;
        }

        .btn-view-report {
          background: #eef2ff;
          color: #4f46e5;
          border: none;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-view-report:hover {
          background: #e0e7ff;
        }

        .btn-delete-hist {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-delete-hist:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
        }

        @media (max-width: 640px) {
          .history-item-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .item-actions-side {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};
