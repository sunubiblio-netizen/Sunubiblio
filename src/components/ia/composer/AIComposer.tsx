'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIMode, AIAttachment } from '@/types/ai';
import { AIAttachmentList } from './AIAttachmentList';
import { AIAttachmentMenu } from './AIAttachmentMenu';
import { AIModeSelector } from './AIModeSelector';
import { AILibraryPickerModal } from './AILibraryPickerModal';
import { AIPasteTextModal } from './AIPasteTextModal';
import { AIService } from '@/services/aiService';

interface AIComposerProps {
  onSendMessage: (payload: {
    content: string;
    mode: AIMode;
    attachments: AIAttachment[];
    isWebSearch: boolean;
  }) => void;
  initialMode?: AIMode;
  disabled?: boolean;
  placeholder?: string;
  isFloatingBottom?: boolean;
}

export const AIComposer: React.FC<AIComposerProps> = ({
  onSendMessage,
  initialMode = 'assistant',
  disabled = false,
  placeholder = 'Posez une question, demandez un résumé ou analysez un cours...',
  isFloatingBottom = false,
}) => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<AIMode>(initialMode);
  const [attachments, setAttachments] = useState<AIAttachment[]>([]);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isPasteTextModalOpen, setIsPasteTextModalOpen] = useState(false);

  // Hidden native file input refs
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync mode if initialMode prop changes (e.g. from suggestions)
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Dynamic textarea auto-height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Cap at ~160px (around 6 lines)
      textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [content]);

  // Handle native file selections
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image' | 'file') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validation = AIService.validateAttachment(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Fichier invalide');
      setTimeout(() => setErrorMessage(null), 5000);
      e.target.value = '';
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
      return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
    };

    const newAttachment: AIAttachment = {
      id: 'att-' + Date.now(),
      type,
      name: file.name,
      size: formatSize(file.size),
      previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined,
      status: 'ready'
    };

    setAttachments(prev => [...prev, newAttachment]);
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(item => item.id !== id));
  };

  const handleAddLibraryResource = (attachment: AIAttachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAddPastedText = (attachment: AIAttachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift submits
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;

    onSendMessage({
      content: trimmed || (attachments.length > 0 ? `Analyse de ${attachments.map(a => a.name).join(', ')}` : ''),
      mode,
      attachments,
      isWebSearch
    });

    setContent('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const canSubmit = (content.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div className={`ai-composer-wrapper ${isFloatingBottom ? 'floating-bottom' : ''}`}>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'document')}
      />
      <input
        type="file"
        ref={imgInputRef}
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'image')}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.txt,image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'file')}
      />

      {/* Modals */}
      <AILibraryPickerModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectResource={handleAddLibraryResource}
      />
      <AIPasteTextModal
        isOpen={isPasteTextModalOpen}
        onClose={() => setIsPasteTextModalOpen(false)}
        onAddText={handleAddPastedText}
      />

      {/* Main Composer Container Card */}
      <div className="ai-composer-card">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="composer-error-alert" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Attachments Pills Tray */}
        <AIAttachmentList
          attachments={attachments}
          onRemove={handleRemoveAttachment}
        />

        {/* Text Input Row */}
        <div className="composer-input-row">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="composer-textarea"
            aria-label="Zone de saisie de votre message pour l'IA"
          />
        </div>

        {/* Bottom Actions Bar inside Composer */}
        <div className="composer-actions-bar">
          {/* Left Actions */}
          <div className="left-controls">
            {/* "+" button menu */}
            <AIAttachmentMenu
              onSelectDocument={() => docInputRef.current?.click()}
              onSelectImage={() => imgInputRef.current?.click()}
              onOpenLibraryPicker={() => setIsLibraryModalOpen(true)}
              onOpenPasteText={() => setIsPasteTextModalOpen(true)}
              onSelectFile={() => fileInputRef.current?.click()}
            />

            {/* Discrete Mode Selector */}
            <AIModeSelector
              currentMode={mode}
              onSelectMode={setMode}
            />

            {/* Web Search Explicit Toggle */}
            <button
              type="button"
              onClick={() => setIsWebSearch(!isWebSearch)}
              className={`btn-web-search-toggle ${isWebSearch ? 'active' : ''}`}
              title={isWebSearch ? 'Recherche Web activée' : 'Activer la recherche sur Internet pour enrichir la réponse'}
              aria-pressed={isWebSearch}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span className="web-search-label">Web</span>
            </button>
          </div>

          {/* Right Action: Send Button */}
          <div className="right-controls">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`btn-send-message ${canSubmit ? 'active' : ''}`}
              aria-label="Envoyer le message à l'assistant IA"
              title={canSubmit ? "Envoyer (Entrée)" : "Écrivez un message ou ajoutez une pièce jointe"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-composer-wrapper {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          position: relative;
          z-index: 50;
        }

        .ai-composer-wrapper.floating-bottom {
          max-width: 800px;
          margin: 0 auto;
          padding: 0;
        }

        .ai-composer-card {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 26px;
          box-shadow: 0 12px 34px -6px rgba(15, 23, 42, 0.07), 0 2px 8px rgba(99, 102, 241, 0.04);
          padding: 14px 18px 12px 18px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ai-composer-card:focus-within {
          border-color: #6366f1;
          box-shadow: 0 14px 40px -8px rgba(99, 102, 241, 0.16), 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .composer-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 12.5px;
          font-weight: 600;
          margin-bottom: 10px;
          animation: fadeIn 0.2s ease;
        }

        .composer-input-row {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        .composer-textarea {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 15.5px;
          color: #0f172a;
          line-height: 1.55;
          max-height: 160px;
          padding: 4px 0;
        }

        .composer-textarea::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .composer-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(241, 245, 249, 0.8);
          margin-top: 6px;
          gap: 12px;
        }

        .left-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-web-search-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 34px;
          padding: 0 10px;
          border-radius: 9999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-web-search-toggle:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .btn-web-search-toggle.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #2563eb;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12);
        }

        .web-search-label {
          white-space: nowrap;
        }

        .right-controls {
          display: flex;
          align-items: center;
          margin-left: auto;
        }

        .btn-send-message {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #94a3b8;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          flex-shrink: 0;
        }

        .btn-send-message.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }

        .btn-send-message.active:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45);
        }

        .btn-send-message.active:active {
          transform: scale(0.96);
        }

        @media (max-width: 640px) {
          .ai-composer-card {
            border-radius: 20px;
            padding: 12px 14px;
          }

          .composer-textarea {
            font-size: 14.5px;
          }

          .web-search-label {
            display: none;
          }

          .btn-web-search-toggle {
            padding: 0 8px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
