'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MOCK_RESOURCES } from '@/data/mockLibrary';
import { AIAttachment } from '@/types/ai';

interface AILibraryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResource: (attachment: AIAttachment) => void;
}

export const AILibraryPickerModal: React.FC<AILibraryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectResource,
}) => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter((res) => {
      const matchQuery =
        !searchQuery ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.subject && res.subject.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || res.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen || !mounted || typeof document === 'undefined' || !document.body) return null;

  const handlePick = (res: typeof MOCK_RESOURCES[0]) => {
    const rawConcepts = [
      res.subject ? res.subject.toUpperCase() : '',
      res.level?.grade || '',
      'Notions clés du programme',
      'Méthodes & Application',
    ].filter(Boolean);

    const attachment: AIAttachment = {
      id: 'lib-' + res.id + '-' + Date.now(),
      type: 'library',
      name: res.title,
      libraryResourceId: res.id,
      subject: res.subject ? res.subject.toUpperCase() : 'Général',
      level: res.level?.grade || 'Tous niveaux',
      size: `${res.pagesCount || 120} pages`,
      status: 'ready',
      description: res.description,
      extractedText: `${res.title}.\n${res.subtitle || ''}\n${res.description || ''}\nDiscipline: ${res.subject || 'Général'}\nNiveau officiel: ${res.level?.grade || 'Tous niveaux'}\nÉtablissement référent: ${res.institution || 'Sunubiblio'}`,
      keyConcepts: rawConcepts,
      pagesCount: res.pagesCount || 120,
    };
    onSelectResource(attachment);
    onClose();
  };

  return createPortal(
    <div 
      className="library-picker-backdrop" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999999
      }}
    >
      <div className="picker-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <div className="lib-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="modal-title">Bibliothèque Sunubiblio</h3>
              <p className="modal-subtitle">Sélectionnez un livre, un cours ou une annale à soumettre à l'IA</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-close-modal" aria-label="Fermer la fenêtre">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="modal-filter-bar">
          <div className="search-input-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Rechercher par titre, matière, auteur (ex: Mathématiques, SVT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>

          <div className="categories-pill-row">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'cours', label: 'Cours' },
              { id: 'annales', label: 'Annales' },
              { id: 'exercices', label: 'Exercices' },
              { id: 'livres', label: 'Livres' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="resources-scroll-list">
          {filteredResources.length === 0 ? (
            <div className="empty-results">
              <p>Aucune ressource trouvée pour cette recherche.</p>
            </div>
          ) : (
            filteredResources.map((item) => (
              <div
                key={item.id}
                className="resource-item-row"
                onClick={() => handlePick(item)}
              >
                <div className="res-cover-thumb" style={{ background: item.coverGradient || '#4f46e5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>

                <div className="res-meta-info">
                  <div className="res-badges-row">
                    <span className="res-category-badge">{item.category}</span>
                    {item.level?.grade && <span className="res-level-badge">{item.level.grade}</span>}
                    {item.subject && <span className="res-subject-badge">{item.subject}</span>}
                  </div>
                  <h4 className="res-title">{item.title}</h4>
                  <p className="res-author">{item.author} • {item.institution || 'Sunubiblio'}</p>
                </div>

                <button type="button" className="btn-select-res">
                  <span>Choisir</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .library-picker-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
          box-sizing: border-box;
        }

        .picker-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 680px;
          max-height: 88vh;
          border-radius: 24px;
          box-shadow: 0 25px 70px -10px rgba(15, 23, 42, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          z-index: 10000000;
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title-box {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .lib-icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f5f3ff;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .modal-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .btn-close-modal {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-close-modal:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .modal-filter-bar {
          padding: 16px 24px;
          background: #f8fafc;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 10px 14px;
          color: #94a3b8;
        }

        .search-input-wrap:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
          color: #0f172a;
        }

        .categories-pill-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .cat-pill {
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .cat-pill.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        .resources-scroll-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 480px;
        }

        .resource-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 16px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .resource-item-row:hover {
          border-color: #6366f1;
          background: #fbfbfe;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
        }

        .res-cover-thumb {
          width: 44px;
          height: 54px;
          border-radius: 8px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .res-meta-info {
          flex: 1;
          min-width: 0;
        }

        .res-badges-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .res-category-badge {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .res-level-badge,
        .res-subject-badge {
          font-size: 11px;
          color: #64748b;
        }

        .res-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .res-author {
          font-size: 12px;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }

        .btn-select-res {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #eef2ff;
          color: #4f46e5;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          pointer-events: none;
        }

        .empty-results {
          padding: 40px 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
};
