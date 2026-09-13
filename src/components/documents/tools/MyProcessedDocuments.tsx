'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserProcessedDocument } from '@/types/documentTools';

interface MyProcessedDocumentsProps {
  onOpenReport?: (doc: UserProcessedDocument) => void;
  refreshTrigger?: number;
}

export const MyProcessedDocuments: React.FC<MyProcessedDocumentsProps> = ({
  onOpenReport,
  refreshTrigger = 0,
}) => {
  const [documents, setDocuments] = useState<UserProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UserProcessedDocument | null>(null);

  const fetchUserDocs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/documents/tools/user-documents');
      const data = await res.json();
      if (data.success && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Erreur récupération documents utilisateur:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDocs();
  }, [fetchUserDocs, refreshTrigger]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous supprimer définitivement « ${name} » de votre espace privé ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/documents/tools/user-documents?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setActionFeedback(`Le document « ${name} » a été supprimé en toute sécurité.`);
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const handleDownload = (doc: UserProcessedDocument) => {
    setActionFeedback(`Téléchargement sécurisé de « ${doc.name} » démarré...`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const filteredDocs = documents.filter((d) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      d.name.toLowerCase().includes(q) ||
      d.originalName.toLowerCase().includes(q) ||
      (d.summary && d.summary.toLowerCase().includes(q))
    );
  });

  const getTypeBadge = (type: UserProcessedDocument['type']) => {
    switch (type) {
      case 'verification':
        return { label: 'Analyse & Style', bg: '#eef2ff', color: '#4338ca', icon: '🔍' };
      case 'word_to_pdf':
        return { label: 'Conversion PDF', bg: '#f0fdf4', color: '#15803d', icon: '📄' };
      case 'pdf_modified':
        return { label: 'PDF Modifié', bg: '#fef3c7', color: '#b45309', icon: '✏️' };
      default:
        return { label: 'Document', bg: '#f1f5f9', color: '#475569', icon: '📁' };
    }
  };

  return (
    <div className="doc-tool-box my-documents-container">
      {/* Header */}
      <div className="doc-tool-header">
        <div className="tool-title-col">
          <div className="tool-badge-pill">Espace Privé & Sécurisé</div>
          <h2 className="tool-main-title">Mes documents traités</h2>
          <p className="tool-main-desc">
            Retrouvez l’ensemble de vos fichiers importés, analysés, convertis et modifiés.
            Vos données sont conservées de manière chiffrée et restent accessibles uniquement depuis votre compte.
          </p>
        </div>

        <div className="my-docs-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Filtrer mes documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {actionFeedback && (
        <div className="my-docs-feedback-toast">
          <span>✓</span>
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Content Table / Cards */}
      {isLoading ? (
        <div className="my-docs-loading">
          <div className="skeleton-spinner" />
          <p>Chargement de vos fichiers chiffrés...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="my-docs-empty">
          <div className="empty-icon-wrap">📂</div>
          <h4 className="empty-title">Aucun document traité pour le moment</h4>
          <p className="empty-desc">
            Utilisez les outils ci-dessus pour vérifier un texte, convertir un fichier Word ou annoter un PDF.
            Vos résultats apparaîtront automatiquement ici.
          </p>
        </div>
      ) : (
        <div className="my-docs-list">
          {filteredDocs.map((doc) => {
            const typeInfo = getTypeBadge(doc.type);
            return (
              <div key={doc.id} className="my-doc-card">
                <div className="my-doc-icon-col">
                  <span className="doc-type-emoji">{typeInfo.icon}</span>
                </div>

                <div className="my-doc-info-col">
                  <div className="my-doc-title-row">
                    <h4 className="my-doc-name">{doc.name}</h4>
                    <span
                      className="my-doc-type-badge"
                      style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}
                    >
                      {typeInfo.label}
                    </span>
                    <span className="my-doc-status-badge ready">Prêt</span>
                  </div>

                  {doc.summary && <p className="my-doc-summary">{doc.summary}</p>}

                  <div className="my-doc-meta-line">
                    <span>Source : {doc.originalName}</span>
                    <span>•</span>
                    <span>Taille : {doc.size}</span>
                    <span>•</span>
                    <span>Traité : {doc.processedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="my-doc-actions-col">
                  <button
                    type="button"
                    className="doc-action-btn view"
                    onClick={() => {
                      if (doc.analysisReport && onOpenReport) {
                        onOpenReport(doc);
                      } else {
                        setPreviewDoc(doc);
                      }
                    }}
                    title="Consulter ce document"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>Ouvrir</span>
                  </button>

                  <button
                    type="button"
                    className="doc-action-btn download"
                    onClick={() => handleDownload(doc)}
                    title="Télécharger le fichier sécurisé"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Télécharger</span>
                  </button>

                  <button
                    type="button"
                    className="doc-action-btn delete"
                    onClick={() => handleDelete(doc.id, doc.name)}
                    title="Supprimer définitivement"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Preview Modal for Non-Report docs */}
      {previewDoc && (
        <div className="modal-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="modal-dialog preview-doc-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h3 className="doc-modal-title">{previewDoc.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setPreviewDoc(null)}>
                ✕
              </button>
            </div>
            <div className="doc-modal-content">
              <div className="preview-status-box">
                <p><strong>Type :</strong> {getTypeBadge(previewDoc.type).label}</p>
                <p><strong>Fichier d'origine :</strong> {previewDoc.originalName}</p>
                <p><strong>Taille :</strong> {previewDoc.size}</p>
                <p><strong>Horodatage :</strong> {previewDoc.processedAt}</p>
                <p><strong>Jeton de sécurité :</strong> <code>{previewDoc.downloadToken}</code></p>
              </div>
              <div className="preview-security-note">
                🔒 Ce fichier est stocké dans votre coffre-fort privé chiffré Sunubiblio.
              </div>
            </div>
            <div className="doc-modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setPreviewDoc(null)}>
                Fermer
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                Télécharger le fichier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
