'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AIService } from '@/services/aiService';

export const ExerciseAISection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePromptType, setActivePromptType] = useState<'revision' | 'mistakes' | 'quiz' | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [inputSubject, setInputSubject] = useState('Mathématiques');

  const handleOpenPrompt = async (type: 'revision' | 'mistakes' | 'quiz') => {
    setActivePromptType(type);
    setModalOpen(true);
    setLoading(true);
    setResponse(null);

    let promptText = '';
    if (type === 'revision') {
      promptText = `Je m'apprête à passer un test d'entraînement en ${inputSubject} pour préparer un concours officiel. Donne-moi un guide de révision rapide en 4 points clés : 1) Les définitions indispensables, 2) Les théorèmes ou formules clés, 3) Les pièges classiques des candidats, 4) Une astuce pour gagner du temps.`;
    } else if (type === 'mistakes') {
      promptText = `Dans le cadre de ma préparation aux examens en ${inputSubject}, comment puis-je analyser méthodiquement mes erreurs de test pour ne plus les reproduire le jour de l'épreuve ? Donne-moi une méthode concrète d'auto-correction active.`;
    } else {
      promptText = `Propose-moi un mini-test de diagnostic de 3 questions QCM niveau intermédiaire en ${inputSubject} avec 4 choix par question et la correction argumentée pour tester mes réflexes.`;
    }

    try {
      const res = await AIService.processRequest({
        content: promptText,
        mode: 'expliquer',
      });
      setResponse(res.content);
    } catch {
      setResponse("L'assistant IA pédagogique Sunubiblio n'a pas pu traiter la demande. Veuillez réessayer dans quelques instants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="exercise-ai-hub-section" aria-label="Assistant IA Sunubiblio">
      <div className="ai-hub-card">
        {/* En-tête du hub */}
        <div className="ai-hub-header">
          <div className="ai-hub-badge">
            <span className="sparkle-icon">✨</span>
            <span>Accompagnement Pédagogique Intelligent</span>
          </div>

          <h2 className="ai-hub-title">IA Sunubiblio — Votre Coach d'Entraînement</h2>
          <p className="ai-hub-desc">
            Besoin d'aide pour comprendre une notion, analyser vos erreurs ou vous entraîner sur mesure ? L'IA pédagogique Sunubiblio vous accompagne avant, après et entre chaque épreuve.
          </p>
        </div>

        {/* Grille des 3 actions guidées */}
        <div className="ai-hub-actions-grid">
          <div className="ai-action-card" onClick={() => handleOpenPrompt('revision')}>
            <div className="ai-card-icon icon-blue">📘</div>
            <h3 className="ai-card-title">Avant le test : Que réviser ?</h3>
            <p className="ai-card-desc">
              Obtenez la synthèse des formules clés, définitions et astuces indispensables avant de démarrer une épreuve.
            </p>
            <span className="ai-card-cta">Lancer la révision flash →</span>
          </div>

          <div className="ai-action-card" onClick={() => handleOpenPrompt('mistakes')}>
            <div className="ai-card-icon icon-purple">🔍</div>
            <h3 className="ai-card-title">Après le test : Analyser mes erreurs</h3>
            <p className="ai-card-desc">
              Comprenez l'origine de vos hésitations et identifiez les pièges récurrents pour sécuriser vos points.
            </p>
            <span className="ai-card-cta">Analyser mes faiblesses →</span>
          </div>

          <div className="ai-action-card" onClick={() => handleOpenPrompt('quiz')}>
            <div className="ai-card-icon icon-emerald">🎯</div>
            <h3 className="ai-card-title">Diagnostic : Mini-test sur mesure</h3>
            <p className="ai-card-desc">
              Générez 3 questions ciblées pour évaluer instantanément votre niveau de maîtrise sur un chapitre.
            </p>
            <span className="ai-card-cta">Générer un mini-test →</span>
          </div>
        </div>

        {/* Bouton global vers l'espace /ia existant */}
        <div className="ai-hub-footer">
          <div className="ai-footer-info">
            <span className="ai-dot-live" />
            <span>Connecté au modèle pédagogique centralisé Sunubiblio</span>
          </div>

          <Link href="/ia" className="btn-primary ai-open-full-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Ouvrir l'Espace IA Sunubiblio</span>
          </Link>
        </div>
      </div>

      {/* Modale d'aide rapide */}
      {modalOpen && (
        <div className="ai-help-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="ai-help-modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ai-modal-header">
              <div className="ai-brand-badge">
                <div className="ai-spark-icon">✨</div>
                <span>Coach IA Sunubiblio</span>
              </div>
              <button
                type="button"
                className="ai-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="ai-modal-body">
              <h3 className="ai-modal-title">
                {activePromptType === 'revision' && '📘 Guide de révision flash'}
                {activePromptType === 'mistakes' && '🔍 Méthode d’analyse des erreurs'}
                {activePromptType === 'quiz' && '🎯 Mini-test diagnostic'}
              </h3>

              {loading ? (
                <div className="ai-loading-box">
                  <div className="ai-spinner" />
                  <p>L'IA Sunubiblio génère vos conseils pédagogiques personnalisés...</p>
                </div>
              ) : (
                <div className="ai-response-container">
                  <div className="ai-response-formatted">
                    {response ? (
                      response.split('\n\n').map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))
                    ) : (
                      <p>Aucune réponse générée.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <Link href="/ia" className="btn-secondary" style={{ marginRight: 'auto' }}>
                Continuer dans l'Espace IA →
              </Link>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
