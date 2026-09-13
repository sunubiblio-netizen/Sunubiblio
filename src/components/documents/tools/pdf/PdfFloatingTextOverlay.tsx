'use client';

import React, { useState } from 'react';
import { PdfTextAnnotation } from './types';

interface PdfFloatingTextOverlayProps {
  annotation: PdfTextAnnotation;
  onUpdateText: (id: string, newContent: string) => void;
  onDeleteText: (id: string) => void;
}

export const PdfFloatingTextOverlay: React.FC<PdfFloatingTextOverlayProps> = ({
  annotation,
  onUpdateText,
  onDeleteText,
}) => {
  const [isEditing, setIsEditing] = useState(annotation.isEditing);
  const [textVal, setTextVal] = useState(annotation.content);

  const handleBlurOrSubmit = () => {
    if (textVal.trim()) {
      onUpdateText(annotation.id, textVal.trim());
      setIsEditing(false);
    } else {
      onDeleteText(annotation.id);
    }
  };

  return (
    <div
      className={`pdf-floating-text-box ${isEditing ? 'is-editing' : ''}`}
      style={{ left: `${annotation.xPercent}%`, top: `${annotation.yPercent}%` }}
      onClick={(e) => e.stopPropagation()}
    >
      {isEditing ? (
        <div className="floating-text-input-wrap">
          <input
            type="text"
            className="floating-text-input"
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            onBlur={handleBlurOrSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBlurOrSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            placeholder="Tapez votre texte..."
            autoFocus
          />
        </div>
      ) : (
        <div className="floating-text-display-wrap" onDoubleClick={() => setIsEditing(true)}>
          <span className="floating-text-content">{annotation.content}</span>
          <button
            type="button"
            className="floating-text-del-btn"
            onClick={() => onDeleteText(annotation.id)}
            title="Supprimer ce texte"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
