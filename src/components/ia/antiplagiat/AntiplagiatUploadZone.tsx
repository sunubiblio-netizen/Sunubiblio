'use client';

import React, { useState, useRef } from 'react';
import { PlagiarismQuota } from '@/types/plagiarism';
import { PlagiarismService } from '@/services/plagiarismService';
import { AILibraryPickerModal } from '../composer/AILibraryPickerModal';
import { AIPasteTextModal } from '../composer/AIPasteTextModal';
import { AIAttachment } from '@/types/ai';

interface AntiplagiatUploadZoneProps {
  quota: PlagiarismQuota;
  isAnalyzing: boolean;
  onStartAnalysis: (doc: { name: string; size: string; rawText?: string }) => void;
}

export const AntiplagiatUploadZone: React.FC<AntiplagiatUploadZoneProps> = ({
  quota,
  isAnalyzing,
  onStartAnalysis,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    source: 'upload' | 'library' | 'paste';
    rawText?: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isPasteTextModalOpen, setIsPasteTextModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validation = PlagiarismService.validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Fichier invalide');
      e.target.value = '';
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
      return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
    };

    setSelectedFile({
      name: file.name,
      size: formatSize(file.size),
      type: file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      source: 'upload'
    });
    setErrorMessage(null);
    e.target.value = '';
  };

  const handleSelectLibraryResource = (att: AIAttachment) => {
    setSelectedFile({
      name: att.name,
      size: att.size || '3.2 Mo',
      type: 'BIBLIOTHÈQUE',
      source: 'library'
    });
    setErrorMessage(null);
  };

  const handleAddPastedText = (att: AIAttachment) => {
    setSelectedFile({
      name: att.name || 'Extrait textuel',
      size: att.size || `${att.contentSnippet?.length || 0} car.`,
      type: 'TEXTE COLLÉ',
      source: 'paste',
      rawText: att.contentSnippet
    });
    setErrorMessage(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleLaunch = () => {
    if (!selectedFile || isAnalyzing) return;
    onStartAnalysis({
      name: selectedFile.name,
      size: selectedFile.size,
      rawText: selectedFile.rawText
    });
  };

  return (
    <div className="antiplagiat-upload-card">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Modals */}
      <AILibraryPickerModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectResource={handleSelectLibraryResource}
      />
      <AIPasteTextModal
        isOpen={isPasteTextModalOpen}
        onClose={() => setIsPasteTextModalOpen(false)}
        onAddText={handleAddPastedText}
      />

      {/* Quota & Plan Bar */}
      <div className="quota-bar">
        <div className="quota-info">
          <span className="quota-badge">Analyses restantes</span>
          <span className="quota-count">
            <strong>{quota.limit - quota.used}</strong> / {quota.limit} disponibles ce mois-ci
          </span>
        </div>
        <span className="plan-tag">{quota.planName}</span>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="error-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload Dropzone or Selected File */}
      {!selectedFile ? (
        <div className="dropzone-area" onClick={() => fileInputRef.current?.click()}>
          <div className="upload-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>

          <h3 className="dropzone-title">Glissez-déposez votre document ici</h3>
          <p className="dropzone-desc">
            Formats acceptés : <strong>PDF, Word (.docx, .doc), Texte brut (.txt)</strong> jusqu'à {quota.maxFileSizeMB} Mo (max {quota.maxPagesPerDoc} pages).
          </p>

          <div className="dropzone-buttons-row" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-upload-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Choisir un document</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLibraryModalOpen(true)}
              className="btn-upload-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Depuis Sunubiblio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPasteTextModalOpen(true)}
              className="btn-upload-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>Coller du texte</span>
            </button>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="selected-file-box">
          <div className="file-info-col">
            <div className="file-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="file-text-details">
              <div className="file-badges">
                <span className="badge-type">{selectedFile.type}</span>
                <span className="badge-source">
                  {selectedFile.source === 'library' && 'Ressource Sunubiblio'}
                  {selectedFile.source === 'upload' && 'Document local'}
                  {selectedFile.source === 'paste' && 'Texte collé'}
                </span>
              </div>
              <h4 className="file-name">{selectedFile.name}</h4>
              <span className="file-size">{selectedFile.size} • Prêt pour vérification de similarité</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            className="btn-remove-file"
            title="Retirer le document"
            disabled={isAnalyzing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Action CTA when document is ready */}
      {selectedFile && (
        <div className="launch-action-bar">
          <button
            type="button"
            onClick={handleLaunch}
            disabled={isAnalyzing}
            className="btn-launch-analysis"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>{isAnalyzing ? 'Analyse en cours...' : 'Lancer la vérification de similarité'}</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .antiplagiat-upload-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
        }

        .quota-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .quota-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quota-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          background: rgba(99, 102, 241, 0.08);
          color: #4f46e5;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .quota-count {
          font-size: 13.5px;
          color: #475569;
        }

        .plan-tag {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          padding: 3px 10px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .dropzone-area {
          border: 2px dashed rgba(99, 102, 241, 0.35);
          background: #fbfbfe;
          border-radius: 20px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropzone-area:hover {
          border-color: #6366f1;
          background: #f5f7ff;
        }

        .upload-icon-circle {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .dropzone-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .dropzone-desc {
          font-size: 13px;
          color: #64748b;
          max-width: 480px;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .dropzone-buttons-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-upload-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          transition: transform 0.15s ease;
        }

        .btn-upload-primary:hover {
          transform: translateY(-1px);
        }

        .btn-upload-secondary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-upload-secondary:hover {
          background: #f8faff;
          border-color: #6366f1;
          color: #4f46e5;
        }

        .selected-file-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: #f8faff;
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 18px;
          gap: 16px;
        }

        .file-info-col {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .file-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-text-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .file-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .badge-type {
          font-size: 10px;
          font-weight: 800;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .badge-source {
          font-size: 11px;
          color: #64748b;
        }

        .file-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 12.5px;
          color: #64748b;
        }

        .btn-remove-file {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .btn-remove-file:hover:not(:disabled) {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        .launch-action-bar {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-launch-analysis {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          border-radius: 9999px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px -4px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
        }

        .btn-launch-analysis:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -4px rgba(79, 70, 229, 0.45);
        }

        .btn-launch-analysis:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
