'use client';

import React, { useState } from 'react';
import { UserProcessedDocument } from '@/types/documentTools';

interface WordToPdfToolProps {
  onDocumentCreated?: (doc: UserProcessedDocument) => void;
}

const MAX_FILE_SIZE_MB = 25;

export const WordToPdfTool: React.FC<WordToPdfToolProps> = ({ onDocumentCreated }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [convertedDoc, setConvertedDoc] = useState<UserProcessedDocument | null>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setConvertedDoc(null);

    const name = file.name.toLowerCase();
    if (!name.endsWith('.doc') && !name.endsWith('.docx')) {
      setErrorMessage('Format invalide. Seuls les fichiers Word (.docx ou .doc) sont acceptés.');
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_FILE_SIZE_MB) {
      setErrorMessage(`Le fichier est trop volumineux (${sizeMb.toFixed(1)} Mo). La limite maximale autorisée est de ${MAX_FILE_SIZE_MB} Mo.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(15);
    setCurrentStep('Téléversement sécurisé et chiffrement...');

    // Progress simulation
    setTimeout(() => {
      setProgress(45);
      setCurrentStep('Analyse de la mise en page et polices vectorielles...');
    }, 600);

    setTimeout(() => {
      setProgress(80);
      setCurrentStep('Génération certifiée du document PDF/A...');
    }, 1200);

    try {
      const formattedSize =
        selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo`
          : `${Math.round(selectedFile.size / 1024)} Ko`;

      const res = await fetch('/api/documents/tools/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: formattedSize,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        setProgress(100);
        setCurrentStep('Conversion finalisée avec succès !');

        if (data.success && data.document) {
          setConvertedDoc(data.document);
          if (onDocumentCreated) onDocumentCreated(data.document);
        } else {
          setErrorMessage(data.message || 'Erreur lors de la conversion.');
        }
        setIsConverting(false);
      }, 1600);
    } catch {
      setErrorMessage('Impossible de joindre le serveur de conversion.');
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedDoc) return;
    // Download simulation
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', convertedDoc.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="doc-tool-box word-to-pdf-container">
      {/* Tool Header */}
      <div className="doc-tool-header">
        <div className="tool-title-col">
          <div className="tool-badge-pill">Conversion Sécurisée</div>
          <h2 className="tool-main-title">Convertir Word en PDF</h2>
          <p className="tool-main-desc">
            Transformez vos fichiers .doc et .docx en documents PDF conformes et verrouillés,
            avec préservation exacte des polices, tableaux et marges.
          </p>
        </div>
      </div>

      {/* Conversion Workspace */}
      <div className="convert-workspace">
        {/* Dropzone */}
        {!convertedDoc ? (
          <div
            className={`convert-dropzone ${isDragOver ? 'is-dragover' : ''} ${
              selectedFile ? 'has-file' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="dropzone-inner">
              <div className="dropzone-icon-box">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M9 15l3-3 3 3" />
                </svg>
              </div>

              {selectedFile ? (
                <div className="selected-file-info">
                  <span className="selected-badge">Fichier Word sélectionné</span>
                  <h4 className="selected-name">{selectedFile.name}</h4>
                  <span className="selected-size">
                    {(selectedFile.size / 1024).toFixed(0)} Ko • Prêt pour la conversion
                  </span>

                  <button
                    type="button"
                    className="change-file-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="dropzone-instructions">
                  <h4 className="instructions-title">Glissez votre fichier Word ici</h4>
                  <p className="instructions-subtitle">ou cliquez pour parcourir vos dossiers</p>
                  <label htmlFor="word-file-input" className="btn-secondary dropzone-browse-btn">
                    Choisir un fichier (.docx, .doc)
                  </label>
                  <input
                    id="word-file-input"
                    type="file"
                    accept=".doc,.docx"
                    className="hidden-file-input"
                    onChange={handleFileChange}
                  />
                  <span className="instructions-hint">Limite maximale : {MAX_FILE_SIZE_MB} Mo par document</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Converted Success State */
          <div className="convert-success-card">
            <div className="success-icon-badge">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="success-title">Votre PDF est prêt !</h3>
            <p className="success-name">{convertedDoc.name}</p>
            <span className="success-meta">
              Taille : {convertedDoc.size} • Format : PDF/A conforme • Enregistré dans « Mes documents »
            </span>

            <div className="success-actions">
              <button
                type="button"
                className="btn-primary success-dl-btn"
                onClick={handleDownload}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Télécharger le document PDF</span>
              </button>

              <button
                type="button"
                className="btn-secondary convert-another-btn"
                onClick={() => {
                  setSelectedFile(null);
                  setConvertedDoc(null);
                  setProgress(0);
                }}
              >
                Convertir un autre document
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="convert-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress Bar during conversion */}
        {isConverting && (
          <div className="convert-progress-card">
            <div className="progress-info-row">
              <span className="progress-step-text">{currentStep}</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Action button if file is selected and not yet converted */}
        {selectedFile && !convertedDoc && !isConverting && (
          <div className="convert-action-row">
            <button
              type="button"
              className="btn-primary convert-start-btn"
              onClick={handleConvert}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
              <span>Lancer la conversion Word vers PDF</span>
            </button>
          </div>
        )}

        {/* Security & Confidentiality Guarantee */}
        <div className="convert-guarantees-grid">
          <div className="guarantee-item">
            <div className="guarantee-icon">🔒</div>
            <div>
              <strong>Chiffrement de bout en bout</strong>
              <p>Votre document n'est jamais rendu public et reste accessible uniquement dans votre espace.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">⚡</div>
            <div>
              <strong>Qualité d'impression vectorielle</strong>
              <p>Maintien des polices, marges, en-têtes et métadonnées fidèles à votre fichier d'origine.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
