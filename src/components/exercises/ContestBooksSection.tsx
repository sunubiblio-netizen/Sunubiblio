'use client';

import React from 'react';
import Link from 'next/link';
import { Resource } from '@/types/library';

interface ContestBooksSectionProps {
  books: (Resource & { associatedTestsCount: number })[];
  selectedResourceId?: string;
  onSelectResource: (resourceId: string) => void;
}

export const ContestBooksSection: React.FC<ContestBooksSectionProps> = ({
  books,
  selectedResourceId,
  onSelectResource,
}) => {
  if (!books || books.length === 0) return null;

  return (
    <section className="contest-books-section" aria-label="Livres pour préparer les concours">
      <div className="section-head-wrap">
        <div className="section-badge-top">
          <span className="badge-spark">📚</span>
          <span>Bibliothèque Pédagogique Officielle</span>
        </div>
        <h2 className="section-main-heading">Livres pour préparer les concours</h2>
        <p className="section-sub-heading">
          Les manuels, annales corrigées et fascicules de référence de la bibliothèque Sunubiblio, reliés à leurs séries de tests d'entraînement.
        </p>
      </div>

      <div className="contest-books-grid">
        {books.slice(0, 6).map((book) => {
          const isSelected = selectedResourceId === book.id;
          const hasTests = book.associatedTestsCount > 0;

          return (
            <article key={book.id} className={`contest-book-card ${isSelected ? 'is-selected' : ''}`}>
              {/* Couverture du livre */}
              <div
                className="book-card-cover"
                style={{ background: book.coverGradient || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}
              >
                <div className="cover-top-badges">
                  <span className="format-badge">
                    {book.resourceType === 'annale' ? 'Annale Corrigée' : book.resourceType === 'pdf' ? 'Manuel' : 'Cours'}
                  </span>
                  {book.accessLevel === 'free' ? (
                    <span className="free-badge">Gratuit</span>
                  ) : (
                    <span className="gold-badge">★ Gold</span>
                  )}
                </div>

                <div className="cover-middle-info">
                  <span className="book-subject-tag">{book.subject}</span>
                  <h4 className="book-cover-title">{book.title}</h4>
                </div>

                <div className="cover-footer-info">
                  <span className="book-author">{book.author}</span>
                  {book.institution && <span className="book-inst">• {book.institution}</span>}
                </div>
              </div>

              {/* Contenu et actions du livre */}
              <div className="book-card-content">
                <p className="book-short-desc">
                  {book.description ? book.description.slice(0, 95) + '...' : 'Ressource de révision approfondie conforme aux programmes.'}
                </p>

                {/* Métadonnées */}
                <div className="book-meta-chips">
                  {book.pagesCount && (
                    <span className="meta-chip">📄 {book.pagesCount} pages</span>
                  )}
                  {book.year && (
                    <span className="meta-chip">📅 {book.year}</span>
                  )}
                  {hasTests && (
                    <span className="meta-chip chip-tests-highlight">
                      🎯 {book.associatedTestsCount} tests associés
                    </span>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="book-actions-row">
                  <Link
                    href={`/bibliotheque/${book.id}`}
                    className="book-btn-consult"
                    title="Consulter ce livre dans la bibliothèque"
                  >
                    Consulter
                  </Link>

                  {hasTests && (
                    <button
                      type="button"
                      className={`book-btn-train ${isSelected ? 'btn-train-active' : ''}`}
                      onClick={() => onSelectResource(isSelected ? 'all' : book.id)}
                      title="S'entraîner sur les tests de ce livre"
                    >
                      <span>{isSelected ? 'Tests affichés ✓' : `S'entraîner (${book.associatedTestsCount})`}</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
