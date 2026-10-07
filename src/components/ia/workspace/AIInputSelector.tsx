'use client';

import React, { useState, useRef, useImperativeHandle } from 'react';
import { AILibraryPickerModal } from '../composer/AILibraryPickerModal';
import { AIAttachment } from '@/types/ai';

export type AIInputType = 'text' | 'file' | 'library';

export interface AIInputContent {
  type: AIInputType;
  text?: string;
  file?: File;
  libraryResource?: AIAttachment;
  extractedText?: string;
  documentTitle?: string;
  keyConcepts?: string[];
  wordCount?: number;
}

export interface AIInputSelectorHandle {
  openFilePicker: () => void;
  openLibraryModal: () => void;
  focusText: () => void;
  getActiveType: () => AIInputType;
}

interface AIInputSelectorProps {
  label?: string;
  placeholder?: string;
  defaultType?: AIInputType;
  onContentChange?: (content: AIInputContent) => void;
}

export const AIInputSelector = React.forwardRef<AIInputSelectorHandle, AIInputSelectorProps>(({ 
  label = "Source du contenu à analyser",
  placeholder,
  defaultType = 'text',
  onContentChange
}, ref) => {
  const [activeType, setActiveType] = useState<AIInputType>(defaultType);
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLibraryResource, setSelectedLibraryResource] = useState<AIAttachment | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionInfo, setExtractionInfo] = useState<{
    wordCount: number;
    cleanedTitle: string;
    keyConcepts: string[];
    summary?: string;
    text?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => fileInputRef.current?.click(),
    openLibraryModal: () => setIsLibraryModalOpen(true),
    focusText: () => textareaRef.current?.focus(),
    getActiveType: () => activeType,
  }));

  const handleSwitchTab = (newType: AIInputType) => {
    setActiveType(newType);
    if (!onContentChange) return;

    if (newType === 'text') {
      onContentChange({
        type: 'text',
        text: textContent,
        extractedText: textContent,
        documentTitle: textContent.trim().slice(0, 50),
      });
    } else if (newType === 'file') {
      onContentChange({
        type: 'file',
        file: selectedFile || undefined,
        text: extractionInfo?.text || undefined,
        extractedText: extractionInfo?.text || undefined,
        documentTitle: extractionInfo?.cleanedTitle || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : undefined),
        keyConcepts: extractionInfo?.keyConcepts || [],
        wordCount: extractionInfo?.wordCount,
      });
    } else if (newType === 'library') {
      onContentChange({
        type: 'library',
        libraryResource: selectedLibraryResource || undefined,
        documentTitle: selectedLibraryResource?.name,
        extractedText: selectedLibraryResource?.extractedText || selectedLibraryResource?.description,
        keyConcepts: selectedLibraryResource?.keyConcepts || [],
        wordCount: selectedLibraryResource ? (selectedLibraryResource.pagesCount || 120) * 250 : undefined,
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextContent(val);
    if (onContentChange) {
      onContentChange({ type: 'text', text: val });
    }
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsExtracting(true);
    setExtractionInfo(null);

    if (onContentChange) {
      onContentChange({ type: 'file', file });
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/ai/extract-document', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.text) {
          setExtractionInfo({
            wordCount: data.wordCount,
            cleanedTitle: data.cleanedTitle,
            keyConcepts: data.keyConcepts || [],
            summary: data.summary,
            text: data.text,
          });

          if (onContentChange) {
            onContentChange({
              type: 'file',
              file,
              text: data.text,
              extractedText: data.text,
              documentTitle: data.cleanedTitle,
              keyConcepts: data.keyConcepts,
              wordCount: data.wordCount,
            });
          }
          setIsExtracting(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Extraction API inaccessible, repli sur lecteur local:', err);
    }

    // Repli client si fichier texte
    try {
      const raw = await file.text();
      const words = raw.trim().split(/\s+/).filter(Boolean);
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setExtractionInfo({
        wordCount: words.length,
        cleanedTitle: title,
        keyConcepts: ['Notion centrale', 'Méthode', 'Analyse'],
        text: raw,
      });
      if (onContentChange) {
        onContentChange({
          type: 'file',
          file,
          text: raw,
          extractedText: raw,
          documentTitle: title,
          keyConcepts: ['Notion centrale', 'Méthode', 'Analyse'],
          wordCount: words.length,
        });
      }
    } catch {
      // Fichier binaire non décodable en texte brut
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLibrarySelected = (resource: AIAttachment) => {
    setSelectedLibraryResource(resource);
    if (onContentChange) {
      onContentChange({
        type: 'library',
        libraryResource: resource,
        documentTitle: resource.name,
        extractedText: resource.extractedText || resource.description || resource.name,
        keyConcepts: resource.keyConcepts || (resource.subject ? [resource.subject] : ['Notions clés']),
        wordCount: (resource.pagesCount || 120) * 250,
      });
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
          onClick={() => handleSwitchTab('text')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
          <span className="tab-label-text">
            <span className="label-desktop">Coller du texte</span>
            <span className="label-mobile">Texte</span>
          </span>
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeType === 'file'}
          className={`tab-pill ${activeType === 'file' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('file')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span className="tab-label-text">
            <span className="label-desktop">Importer un document</span>
            <span className="label-mobile">Document</span>
          </span>
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeType === 'library'}
          className={`tab-pill ${activeType === 'library' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('library')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span className="tab-label-text">
            <span className="label-desktop">Bibliothèque Sunubiblio</span>
            <span className="label-mobile">Bibliothèque</span>
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="input-content-panel">
        {/* 1. Coller du texte */}
        {activeType === 'text' && (
          <div className="text-editor-wrap">
            <textarea 
              ref={textareaRef}
              placeholder={placeholder || "Collez ou rédigez ici votre énoncé, votre devoir, vos notes de cours ou le paragraphe à analyser..."}
              value={textContent}
              onChange={handleTextChange}
              className="ai-textarea-pro"
              rows={8}
            />
            {textContent.length > 0 && (
              <div className="text-editor-footer">
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
              </div>
            )}
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
                <div className="doc-center-preview">
                  <div className="doc-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="status-row">
                    {isExtracting ? (
                      <span className="badge-reading" style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        ⏳ Lecture et analyse du texte...
                      </span>
                    ) : extractionInfo ? (
                      <span className="badge-ok" style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        ✓ Document lu ({extractionInfo.wordCount} mots analysés)
                      </span>
                    ) : (
                      <span className="badge-ok">✓ Document prêt</span>
                    )}
                    <span className="doc-type-pill">{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                  <h5 className="doc-filename" title={selectedFile.name}>{selectedFile.name}</h5>
                  <span className="doc-size-info">{formatFileSize(selectedFile.size)}</span>
                  {extractionInfo && extractionInfo.keyConcepts && extractionInfo.keyConcepts.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '12.5px', color: '#334155' }}>
                      <strong style={{ color: '#4f46e5' }}>🎯 Thèmes détectés :</strong> {extractionInfo.keyConcepts.slice(0, 4).join(' • ')}
                    </div>
                  )}
                </div>

                <div className="card-actions-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-change-doc"
                  >
                    Remplacer le document
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setExtractionInfo(null);
                      if (onContentChange) {
                        onContentChange({
                          type: 'file',
                          file: undefined,
                          text: '',
                          extractedText: '',
                          documentTitle: '',
                          keyConcepts: [],
                          wordCount: 0,
                        });
                      }
                    }}
                    className="btn-remove-doc-text"
                  >
                    Retirer
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
                <div className="lib-center-preview">
                  <div className="lib-res-cover">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <div className="badges-row">
                    <span className="badge-lib-origin">Bibliothèque Sunubiblio</span>
                    {selectedLibraryResource.subject && (
                      <span className="badge-subject">{selectedLibraryResource.subject}</span>
                    )}
                  </div>
                  <h5 className="lib-res-title" title={selectedLibraryResource.name}>{selectedLibraryResource.name}</h5>
                  <span className="lib-res-meta">{selectedLibraryResource.size || 'Cours certifié'}</span>
                </div>

                <div className="card-actions-row">
                  <button
                    type="button"
                    onClick={() => setIsLibraryModalOpen(true)}
                    className="btn-change-doc"
                  >
                    Changer de ressource
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLibraryResource(null);
                      if (onContentChange) {
                        onContentChange({
                          type: 'library',
                          libraryResource: undefined,
                          extractedText: '',
                          documentTitle: '',
                          keyConcepts: [],
                          wordCount: 0,
                        });
                      }
                    }}
                    className="btn-remove-doc-text"
                  >
                    Retirer
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

        .label-mobile {
          display: none;
        }

        .label-desktop {
          display: inline;
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
          min-height: 290px;
          display: flex;
          flex-direction: column;
        }

        /* --- Texteditor Wrapper & Dropzone Wrappers fixes --- */
        .text-editor-wrap,
        .file-uploader-wrap,
        .library-picker-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          min-height: 290px;
          justify-content: space-between;
        }

        .file-uploader-wrap,
        .library-picker-wrap {
          justify-content: center;
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
          resize: none;
          min-height: 235px;
          flex: 1;
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
          justify-content: flex-end;
          align-items: center;
          padding-top: 8px;
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

        /* --- Modern Dropzone Statique --- */
        .modern-dropzone {
          border: 2px dashed rgba(99, 102, 241, 0.35);
          border-radius: 20px;
          background: #fbfbfe;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          flex: 1;
          min-height: 290px;
          box-sizing: border-box;
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

        /* --- Selected Document & Library Cards Adaptées --- */
        .selected-document-card,
        .selected-library-card {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 18px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex: 1;
          height: 100%;
          min-height: 290px;
          box-sizing: border-box;
          gap: 14px;
          animation: cardPop 0.18s ease;
        }

        .doc-center-preview,
        .lib-center-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 100%;
        }

        .doc-icon-badge,
        .lib-res-cover {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
        }

        .lib-res-cover {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
        }

        .status-row,
        .badges-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .badge-ok,
        .badge-lib-origin {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          background: #dcfce7;
          color: #166534;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .badge-lib-origin {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .doc-type-pill,
        .badge-subject {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: #e2e8f0;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .doc-filename,
        .lib-res-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          max-width: 450px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-size-info,
        .lib-res-meta {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 500;
        }

        .card-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-change-doc {
          font-size: 12.5px;
          font-weight: 700;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #1e3a8a;
          padding: 7px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-change-doc:hover {
          background: #eff6ff;
          border-color: #2563eb;
        }

        .btn-remove-doc-text {
          font-size: 12px;
          font-weight: 700;
          background: transparent;
          border: none;
          color: #dc2626;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 0.15s ease;
        }

        .btn-remove-doc-text:hover {
          background: #fee2e2;
        }

        /* --- Library Empty Invitation Statique --- */
        .library-empty-invitation {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 20px;
          background: #faf8ff;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          flex: 1;
          min-height: 290px;
          box-sizing: border-box;
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
          .selector-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            margin-bottom: 8px;
          }
          .input-label {
            font-size: 13px;
          }
          .source-hint {
            font-size: 11px;
          }
          .label-desktop {
            display: none;
          }
          .label-mobile {
            display: inline;
          }
          .input-tabs-capsule {
            display: flex;
            width: 100%;
            overflow-x: visible;
            border-radius: 9999px;
            padding: 3px;
            gap: 2px;
          }
          .tab-pill {
            flex: 1;
            min-width: 0;
            padding: 7px 4px;
            font-size: 11.5px;
            gap: 4px;
            justify-content: center;
            white-space: nowrap;
          }
          .tab-pill svg {
            width: 13px;
            height: 13px;
            flex-shrink: 0;
          }
          .input-content-panel {
            min-height: 195px;
            height: 195px;
          }
          .text-editor-wrap,
          .file-uploader-wrap,
          .library-picker-wrap {
            min-height: 195px;
            height: 100%;
          }
          .ai-textarea-pro {
            min-height: 140px;
            padding: 10px 12px;
            font-size: 13.5px;
            border-radius: 14px;
          }
          .modern-dropzone {
            min-height: 195px;
            padding: 12px 10px;
            border-radius: 14px;
          }
          .dropzone-icon-box {
            width: 38px;
            height: 38px;
            margin-bottom: 6px;
          }
          .dropzone-main-text {
            font-size: 12.5px;
            margin-bottom: 2px;
          }
          .dropzone-sub-text {
            font-size: 11px;
            margin-bottom: 6px;
          }
          .library-empty-invitation {
            min-height: 195px;
            padding: 12px 10px;
            border-radius: 14px;
          }
          .lib-icon-halo {
            width: 38px;
            height: 38px;
            margin-bottom: 6px;
          }
          .lib-invite-title {
            font-size: 12.5px;
            margin-bottom: 2px;
          }
          .lib-invite-desc {
            font-size: 11px;
            margin-bottom: 8px;
          }
          .btn-open-library-pro {
            padding: 6px 12px;
            font-size: 11.5px;
          }
          .selected-document-card,
          .selected-library-card {
            min-height: 195px;
            height: 195px;
            padding: 12px 10px;
            border-radius: 14px;
            gap: 8px;
          }
          .doc-icon-badge,
          .lib-res-cover {
            width: 38px;
            height: 38px;
            margin-bottom: 4px;
            border-radius: 10px;
          }
          .doc-filename,
          .lib-res-title {
            font-size: 13px;
            max-width: 250px;
          }
          .doc-size-info,
          .lib-res-meta {
            font-size: 11px;
          }
          .card-actions-row {
            gap: 8px;
          }
          .btn-change-doc {
            padding: 5px 12px;
            font-size: 11.5px;
          }
          .btn-remove-doc-text {
            font-size: 11px;
            padding: 5px 8px;
          }
        }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
});

AIInputSelector.displayName = 'AIInputSelector';
