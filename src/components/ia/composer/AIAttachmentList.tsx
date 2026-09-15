'use client';

import React from 'react';
import { AIAttachment } from '@/types/ai';

interface AIAttachmentListProps {
  attachments: AIAttachment[];
  onRemove: (id: string) => void;
}

export const AIAttachmentList: React.FC<AIAttachmentListProps> = ({
  attachments,
  onRemove,
}) => {
  if (!attachments || attachments.length === 0) return null;

  const getAttachmentIcon = (type: AIAttachment['type']) => {
    switch (type) {
      case 'image':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'library':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case 'text':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
        );
      case 'document':
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
    }
  };

  const getBadgeLabel = (type: AIAttachment['type']) => {
    switch (type) {
      case 'library':
        return 'Bibliothèque Sunubiblio';
      case 'image':
        return 'Image';
      case 'text':
        return 'Extrait texte';
      case 'document':
      default:
        return 'Document';
    }
  };

  return (
    <div className="attachments-list-container" aria-label="Pièces jointes sélectionnées">
      {attachments.map((item) => (
        <div key={item.id} className={`attachment-card ${item.type}`}>
          <div className="attachment-icon-wrap">
            {item.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.previewUrl} alt={item.name} className="thumb-img" />
            ) : (
              getAttachmentIcon(item.type)
            )}
          </div>

          <div className="attachment-details">
            <div className="attachment-header-row">
              <span className="type-badge">{getBadgeLabel(item.type)}</span>
              {item.size && <span className="attachment-size">{item.size}</span>}
            </div>
            <span className="attachment-name" title={item.name}>
              {item.name}
            </span>
            {item.subject && (
              <span className="attachment-meta">
                {item.subject} {item.level ? `• ${item.level}` : ''}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="btn-remove-attachment"
            aria-label={`Retirer ${item.name}`}
            title="Retirer la pièce jointe"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}

      <style jsx>{`
        .attachments-list-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
          padding: 2px 4px;
        }

        .attachment-card {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f8faff;
          border: 1px solid rgba(99, 102, 241, 0.22);
          border-radius: 14px;
          max-width: 280px;
          position: relative;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .attachment-card.library {
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
          border-color: rgba(147, 51, 234, 0.28);
        }

        .attachment-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
          flex-shrink: 0;
          overflow: hidden;
        }

        .attachment-card.library .attachment-icon-wrap {
          color: #7c3aed;
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .attachment-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .attachment-header-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .type-badge {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #6366f1;
        }

        .attachment-card.library .type-badge {
          color: #7c3aed;
        }

        .attachment-size {
          font-size: 10.5px;
          color: #94a3b8;
        }

        .attachment-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attachment-meta {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-remove-attachment {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(203, 213, 225, 0.7);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
          padding: 0;
        }

        .btn-remove-attachment:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
