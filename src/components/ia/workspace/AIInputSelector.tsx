'use client';

import React, { useState, useRef } from 'react';
import { AILibraryPickerModal } from '../composer/AILibraryPickerModal';
import { AIAttachment } from '@/types/ai';

export type AIInputType = 'text' | 'file' | 'library';

interface AIInputSelectorProps {
  label?: string;
  placeholder?: string;
  defaultType?: AIInputType;
  onContentChange?: (content: { type: AIInputType; text?: string; file?: File; libraryResource?: AIAttachment }) => void;
}

export const AIInputSelector: React.FC<AIInputSelectorProps> = ({ 
  label = "Source du contenu à analyser",
  placeholder,
  defaultType = 'text',
  onContentChange
}) => {
  const [activeType, setActiveType] = useState<AIInputType>(defaultType);
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLibraryResource, setSelectedLibraryResource] = useState<AIAttachment | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextContent(val);
    if (onContentChange) {
      onContentChange({ type: 'text', text: val });
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    if (onContentChange) {
      onContentChange({ type: 'file', file });
    }
  };

  const handleLibrarySelected = (resource: AIAttachment) => {
    setSelectedLibraryResource(resource);
    if (onContentChange) {
      onContentChange({ type: 'library', libraryResource: resource });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  return (
    <div className="ai-input-selector-root">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.doc,.txt"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Library Picker Modal */}
      <AILibraryPickerModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectResource={handleLibrarySelected}
      />

      <div className="selector-head">
        <label className="input-label">{label}</label>
        <span className="source-hint">
          {activeType === 'text' && `${textContent.length} caractères saisis`}
          {activeType === 'file' && (selectedFile ? selectedFile.name : 'Aucun fichier importé')}
          {activeType === 'library' && (selectedLibraryResource ? selectedLibraryResource.name : 'Aucune ressource choisie')}
        </span>
      </div>
      
      {/* Segmented Capsule Tabs (sans scrollbar disgracieuse) */}
      <div className="input-tabs-capsule" role="tablist">
        <button 
          type="button"
          role="tab"
          aria-selected={activeType === 'text'}
          className={`tab-pill ${activeType === 'text' ? 'active' : ''}`}
          onClick={() => setActiveType('text')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
          <span>Coller du texte</span>
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeType === 'file'}
          className={`tab-pill ${activeType === 'file' ? 'active' : ''}`}
          onClick={() => setActiveType('file')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Importer un document</span>
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeType === 'library'}
          className={`tab-pill ${activeType === 'library' ? 'active' : ''}`}
          onClick={() => setActiveType('library')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Bibliothèque Sunubiblio</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="input-content-panel">
        {/* 1. Coller du texte */}
        {activeType === 'text' && (
          <div className="text-editor-wrap">
            <textarea 
              placeholder={placeholder || "Collez ou rédigez ici votre énoncé, votre devoir, vos notes de cours ou le paragraphe à analyser..."}
              value={textContent}
              onChange={handleTextChange}
              className="ai-textarea-pro"
              rows={8}
            />
            <div className="text-editor-footer">
              <div className="quick-fill-prompts">
                <button
                  type="button"
                  className="btn-sample-fill"
                  onClick={() => {
                    const sample = "Soit f(x) = (2x + 1) / (x - 3). Déterminer l'ensemble de définition Df, puis calculer les limites aux bornes de Df et interpréter graphiquement les résultats.";
                    setTextContent(sample);
                    if (onContentChange) onContentChange({ type: 'text', text: sample });
                  }}
                >
                  Exemple d'exercice
                </button>
                <button
                  type="button"
                  className="btn-sample-fill"
                  onClick={() => {
                    const sample = "La révolution industrielle en Europe au XIXe siècle a profondément transformé les structures économiques, démographiques et sociales, entraînant l'essor du capitalisme et la naissance de la classe ouvrière.";
                    setTextContent(sample);
                    if (onContentChange) onContentChange({ type: 'text', text: sample });
                  }}
                >
                  Exemple de cours
                </button>
              </div>

              {textContent.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setTextContent('');
                    if (onContentChange) onContentChange({ type: 'text', text: '' });
                  }}
                  className="btn-clear-text"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Importer un document */}
        {activeType === 'file' && (
          <div className="file-uploader-wrap">
            {!selectedFile ? (
              <div 
                className={`modern-dropzone ${isDragging ? 'dragging' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="dropzone-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <h4 className="dropzone-main-text">
                  Glissez-déposez votre document ici ou <span>parcourez vos fichiers</span>
                </h4>
                <p className="dropzone-sub-text">
                  Formats acceptés : <strong>PDF, Word (.docx, .doc), Texte (.txt)</strong>
                </p>

                <div className="formats-chips">
                  <span className="fmt-chip">📄 PDF</span>
                  <span className="fmt-chip">📝 DOCX</span>
                  <span className="fmt-chip">📑 TXT</span>
                  <span className="fmt-chip-max">Max 15 Mo</span>
                </div>
              </div>
            ) : (
              <div className="selected-document-card">
                <div className="doc-left-info">
                  <div className="doc-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="doc-meta-text">
                    <div className="status-row">
                      <span className="badge-ok">Document prêt</span>
                      <span className="doc-type-pill">{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
                    </div>
                    <h5 className="doc-filename">{selectedFile.name}</h5>
                    <span className="doc-size-info">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>

                <div className="doc-right-actions">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-change-doc"
                  >
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (onContentChange) onContentChange({ type: 'file', file: undefined });
                    }}
                    className="btn-remove-doc"
                    title="Retirer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Choisir dans la bibliothèque Sunubiblio */}
        {activeType === 'library' && (
          <div className="library-picker-wrap">
            {!selectedLibraryResource ? (
              <div 
                className="library-empty-invitation"
                onClick={() => setIsLibraryModalOpen(true)}
              >
                <div className="lib-icon-halo">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h4 className="lib-invite-title">Explorer le fonds documentaire Sunubiblio</h4>
                <p className="lib-invite-desc">
                  Sélectionnez directement un livre, un cours de référence ou une annale d'examen (FASTEF, Bac, BFEM) certifié.
                </p>

                <button
                  type="button"
                  onClick={() => setIsLibraryModalOpen(true)}
                  className="btn-open-library-pro"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Parcourir les ressources de la bibliothèque</span>
                </button>
              </div>
            ) : (
              <div className="selected-library-card">
                <div className="lib-card-left">
                  <div className="lib-res-cover">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <div className="lib-res-details">
                    <div className="badges-row">
                      <span className="badge-lib-origin">Bibliothèque Sunubiblio</span>
                      {selectedLibraryResource.subject && (
                        <span className="badge-subject">{selectedLibraryResource.subject}</span>
                      )}
                    </div>
                    <h5 className="lib-res-title">{selectedLibraryResource.name}</h5>
                    <span className="lib-res-meta">{selectedLibraryResource.size || 'Cours certifié'}</span>
                  </div>
                </div>

                <div className="lib-card-right">
                  <button
                    type="button"
                    onClick={() => setIsLibraryModalOpen(true)}
                    className="btn-change-doc"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLibraryResource(null);
                      if (onContentChange) onContentChange({ type: 'library', libraryResource: undefined });
                    }}
                    className="btn-remove-doc"
                    title="Retirer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .ai-input-selector-root {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
        }

        .selector-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .input-label {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .source-hint {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 500;
        }

        /* --- Capsule Segmented Tabs --- */
        .input-tabs-capsule {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 9999px;
          gap: 4px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .tab-pill {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          user-select: none;
        }

        .tab-pill:hover {
          color: #0f172a;
        }

        .tab-pill.active {
          background: #ffffff;
          color: #4f46e5;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .input-content-panel {
          width: 100%;
        }

        /* --- Textarea Editor --- */
        .text-editor-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ai-textarea-pro {
          width: 100%;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          background: #fbfbfe;
          padding: 16px;
          font-size: 14.5px;
          color: #0f172a;
          line-height: 1.6;
          font-family: inherit;
          resize: vertical;
          min-height: 200px;
          transition: all 0.2s ease;
        }

        .ai-textarea-pro:focus {
          outline: none;
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .text-editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quick-fill-prompts {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-sample-fill {
          font-size: 12px;
          font-weight: 600;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 4px 10px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-sample-fill:hover {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #6366f1;
        }

        .btn-clear-text {
          font-size: 12px;
          font-weight: 600;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .btn-clear-text:hover {
          color: #ef4444;
        }

        /* --- Modern Dropzone --- */
        .modern-dropzone {
          border: 2px dashed rgba(99, 102, 241, 0.35);
          border-radius: 20px;
          background: #fbfbfe;
          padding: 36px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modern-dropzone:hover,
        .modern-dropzone.dragging {
          border-color: #4f46e5;
          background: #f5f7ff;
        }

        .dropzone-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .dropzone-main-text {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
        }

        .dropzone-main-text span {
          color: #4f46e5;
          text-decoration: underline;
        }

        .dropzone-sub-text {
          font-size: 12.5px;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .formats-chips {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .fmt-chip {
          font-size: 11px;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .fmt-chip-max {
          font-size: 11px;
          color: #94a3b8;
          padding-left: 4px;
        }

        /* --- Selected Document & Library Cards --- */
        .selected-document-card,
        .selected-library-card {
          background: #f8faff;
          border: 1.5px solid rgba(99, 102, 241, 0.25);
          border-radius: 18px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          animation: cardPop 0.2s ease;
        }

        .doc-left-info,
        .lib-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .doc-icon-badge,
        .lib-res-cover {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lib-res-cover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
        }

        .doc-meta-text,
        .lib-res-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .status-row,
        .badges-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .badge-ok,
        .badge-lib-origin {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #dcfce7;
          color: #166534;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .badge-lib-origin {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .doc-type-pill,
        .badge-subject {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
        }

        .doc-filename,
        .lib-res-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-size-info,
        .lib-res-meta {
          font-size: 12px;
          color: #64748b;
        }

        .doc-right-actions,
        .lib-card-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-change-doc {
          font-size: 12px;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #4f46e5;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-change-doc:hover {
          background: #f8faff;
          border-color: #6366f1;
        }

        .btn-remove-doc {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-remove-doc:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
        }

        /* --- Library Empty Invitation --- */
        .library-empty-invitation {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 20px;
          background: #faf8ff;
          padding: 36px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .library-empty-invitation:hover {
          border-color: #7c3aed;
          background: #f5f0ff;
        }

        .lib-icon-halo {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: #f5f3ff;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .lib-invite-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .lib-invite-desc {
          font-size: 12.5px;
          color: #64748b;
          max-width: 440px;
          margin: 0 0 18px 0;
          line-height: 1.5;
        }

        .btn-open-library-pro {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
          transition: transform 0.15s ease;
        }

        .btn-open-library-pro:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .input-tabs-capsule {
            flex-direction: column;
            border-radius: 16px;
          }
          .selected-document-card,
          .selected-library-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .doc-right-actions,
          .lib-card-right {
            align-self: flex-end;
          }
        }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
