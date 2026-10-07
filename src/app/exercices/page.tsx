'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { AIInputSelector, AIInputType } from '@/components/ia/workspace/AIInputSelector';
import { AIAttachment } from '@/types/ai';

type ExerciseMode = 'exercices' | 'qcm' | 'corriger';

interface QCMItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ExerciseItem {
  id: number;
  title: string;
  duration: string;
  statement: string;
  solution: string;
  isSolutionVisible?: boolean;
}

interface ChatReply {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ACTION_MODES_CONFIG = [
  {
    id: 'exercices' as ExerciseMode,
    title: 'Générer des exercices',
    subtitle: 'Exercices adaptés au niveau et à la matière',
    badge: 'Exercices',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#2563eb',
    bgColor: '#eff6ff',
  },
  {
    id: 'qcm' as ExerciseMode,
    title: '1. Générer des QCM',
    subtitle: 'Questionnaires interactifs avec correction immédiate',
    badge: 'QCM',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: '#16a34a',
    bgColor: '#f0fdf4',
  },
  {
    id: 'corriger' as ExerciseMode,
    title: '2. Corriger',
    subtitle: 'Analyse méthodique de devoirs et remarques',
    badge: 'Correction',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: '#dc2626',
    bgColor: '#fef2f2',
  },
];

export default function ExercicesPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Mode actif & Menu popover type Chat
  const [activeMode, setActiveMode] = useState<ExerciseMode>('exercices');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

  // Contenu sélectionné
  const [inputContent, setInputContent] = useState<{
    type: AIInputType;
    text?: string;
    file?: File;
    libraryResource?: AIAttachment;
  }>({
    type: 'text',
    text: '',
  });

  // État de la session interactive (Chat / Résultat in-place)
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Données générées
  const [generatedExercises, setGeneratedExercises] = useState<ExerciseItem[]>([]);
  const [generatedQCM, setGeneratedQCM] = useState<QCMItem[]>([]);
  const [selectedQCMAnswers, setSelectedQCMAnswers] = useState<Record<number, number>>({});
  const [correctionReport, setCorrectionReport] = useState<{
    grade: string;
    strengths: string[];
    improvements: string[];
    summary: string;
  } | null>(null);

  // Chat complémentaire
  const [chatMessages, setChatMessages] = useState<ChatReply[]>([]);
  const [followupText, setFollowupText] = useState('');

  const currentModeConfig = ACTION_MODES_CONFIG.find((m) => m.id === activeMode) || ACTION_MODES_CONFIG[0];

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSelectMode = (mode: ExerciseMode) => {
    setActiveMode(mode);
    setIsModeMenuOpen(false);
  };

  const handleStartGeneration = () => {
    setIsLoading(true);
    setIsSessionActive(true);
    setChatMessages([]);
    setSelectedQCMAnswers({});

    // Simulation de génération IA
    setTimeout(() => {
      const topicName = inputContent.text?.trim()
        ? inputContent.text.slice(0, 45)
        : inputContent.file
        ? inputContent.file.name
        : inputContent.libraryResource
        ? inputContent.libraryResource.name
        : 'Sujet d’entraînement';

      if (activeMode === 'exercices') {
        setGeneratedExercises([
          {
            id: 1,
            title: `Exercice 1 : Application directe — ${topicName}`,
            duration: '15 min',
            statement: `À partir des notions fondamentales du cours, définir rigoureusement les concepts clés et déterminer les conditions de validité. Calculer les grandeurs caractéristiques et vérifier la cohérence des unités.`,
            solution: `Étape 1 : Poser les hypothèses de travail.\nÉtape 2 : Appliquer la formule standard adaptée au niveau choisi.\nÉtape 3 : Conclusion numérique et interprétation pédagogique validée.`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Problème de synthèse & Raisonnement guidé`,
            duration: '30 min',
            statement: `Mise en situation complète reliant plusieurs aspects du programme. Analyser les données fournies, modéliser le problème et proposer une démarche de résolution argumentée.`,
            solution: `1. Identification des variables interdépendantes.\n2. Résolution du système d'équations / construction du plan de dissertation.\n3. Analyse critique du résultat obtenu.`,
            isSolutionVisible: false,
          },
        ]);
      } else if (activeMode === 'qcm') {
        setGeneratedQCM([
          {
            id: 1,
            question: `Dans le cadre du thème « ${topicName} », quelle est la définition ou la formule exacte à appliquer en priorité ?`,
            options: [
              `Le théorème de proportionnalité sans restriction`,
              `Le principe de conservation et d'équilibre en régime stable`,
              `L'hypothèse empirique sans justification théorique`,
              `La méthode de déduction approximative`,
            ],
            correctIndex: 1,
            explanation: `Le principe de conservation en régime stable constitue la base rigoureuse du programme officiel.`,
          },
          {
            id: 2,
            question: `Quelle condition préalable est indispensable avant d'effectuer les calculs ou l'analyse ?`,
            options: [
              `Vérifier le domaine de définition et la compatibilité des grandeurs`,
              `Passer immédiatement à l'application numérique`,
              `Supposer que toutes les variables sont négligeables`,
              `Utiliser une formule simplifiée non démontrée`,
            ],
            correctIndex: 0,
            explanation: `Il est impératif de valider le domaine de définition et l'homogénéité dimensionnelle.`,
          },
          {
            id: 3,
            question: `En situation d'examen officiel, quelle démarche garantit le maximum de points au barème ?`,
            options: [
              `Donner uniquement le résultat final souligné`,
              `Énoncer le théorème, détailler le calcul intermédiaire et encadrer le résultat`,
              `Écrire une justification vague`,
              `Utiliser des abréviations non conventionnelles`,
            ],
            correctIndex: 1,
            explanation: `Le barème académique valorise la rigueur de la démonstration et le respect des étapes méthodologiques.`,
          },
        ]);
      } else if (activeMode === 'corriger') {
        setCorrectionReport({
          grade: '16 / 20',
          strengths: [
            'Raisonnement global solide et logique bien structurée.',
            'Bonne compréhension des concepts fondamentaux.',
            'Présentation propre et étapes de calcul bien aérées.',
          ],
          improvements: [
            'Préciser systématiquement les unités et le domaine de validité.',
            'Prendre le temps de justifier le choix du théorème avant de l\'appliquer.',
          ],
          summary: `Excellent travail sur « ${topicName} ». En renforçant la précision méthodologique, vous atteindrez facilement l'excellence aux concours et examens.`,
        });
      }

      setIsLoading(false);
    }, 1100);
  };

  const handleToggleSolution = (exId: number) => {
    setGeneratedExercises((prev) =>
      prev.map((e) => (e.id === exId ? { ...e, isSolutionVisible: !e.isSolutionVisible } : e))
    );
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedQCMAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSendFollowup = (textToSend?: string) => {
    const text = textToSend || followupText.trim();
    if (!text) return;

    const userMsg: ChatReply = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setFollowupText('');

    setTimeout(() => {
      let aiContent = `Bien noté ! Voici un éclaircissement méthodologique : pensez à toujours décomposer le problème en sous-étapes et à vérifier vos hypothèses.`;
      if (text.toLowerCase().includes('indice')) {
        aiContent = `💡 **Indice pédagogique :** Observez attentivement la relation entre les variables principales. Une factorisation ou un changement de variable simplifie immédiatement l'analyse !`;
      } else if (text.toLowerCase().includes('difficile') || text.toLowerCase().includes('variante')) {
        aiContent = `🔥 **Variante niveau Concours :** Que se passerait-il si les conditions initiales variaient de façon non linéaire ? Essayez d'intégrer une contrainte supplémentaire de temps !`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: aiContent,
        },
      ]);
    }, 700);
  };

  const handleReset = () => {
    setIsSessionActive(false);
    setIsLoading(false);
    setGeneratedExercises([]);
    setGeneratedQCM([]);
    setSelectedQCMAnswers({});
    setCorrectionReport(null);
    setChatMessages([]);
  };

  return (
    <div className="exercices-page-root">
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="exercices-main-container">
        {/* En-tête Simple et Épuré */}
        <header className="page-header-compact">
          <div className="container">
            <h1 className="header-simple-title">Exercice</h1>
          </div>
        </header>

        <div className="container workspace-container">
          {!isSessionActive ? (
            /* ============================================================== */
            /* 1. ÉCRAN DE SAISIE INITIALE : ULTRA-MODERNE, STYLE CHAT       */
            /* ============================================================== */
            <div className="card-workspace-input">
              {/* Étape 1 : Support / Contenu avec les 3 onglets (Exactement la capture) */}
              <div className="section-block">
                <AIInputSelector
                  label="Sur quelle leçon ou thème voulez-vous des exercices ?"
                  placeholder="Entrez un thème précis (ex: Équations différentielles, Droit des obligations, Génétique...) ou collez votre cours..."
                  onContentChange={setInputContent}
                />
              </div>

              {/* Étape 2 : Barre d'action intelligente façon Chat avec bouton [+] */}
              <div className="chat-action-bar-wrap">
                <div className="action-selector-relative">
                  {/* Bouton de déclenchement style Chat (+) */}
                  <button
                    type="button"
                    className="btn-chat-mode-pill"
                    onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                    aria-expanded={isModeMenuOpen}
                    title="Changer d'action"
                  >
                    <span className="btn-plus-icon">+</span>
                    <span className="mode-current-icon" style={{ color: currentModeConfig.color }}>
                      {currentModeConfig.icon}
                    </span>
                    <span className="mode-current-label">{currentModeConfig.title}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chevron-indicator ${isModeMenuOpen ? 'is-open' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Menu Popover Flottant Moderne (comme sur un Chat) */}
                  {isModeMenuOpen && (
                    <>
                      <div className="menu-backdrop" onClick={() => setIsModeMenuOpen(false)} />
                      <div className="chat-mode-popover" role="menu">
                        <div className="popover-header">
                          <span className="popover-title">Que souhaitez-vous faire ?</span>
                        </div>
                        <div className="popover-items-list">
                          {ACTION_MODES_CONFIG.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              className={`popover-item-btn ${activeMode === m.id ? 'is-selected' : ''}`}
                              onClick={() => handleSelectMode(m.id)}
                            >
                              <div className="item-icon-box" style={{ background: m.bgColor, color: m.color }}>
                                {m.icon}
                              </div>
                              <div className="item-text-box">
                                <span className="item-title">{m.title}</span>
                                <span className="item-subtitle">{m.subtitle}</span>
                              </div>
                              {activeMode === m.id && (
                                <span className="item-check-badge">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Bouton Principal de Lancement Intégré */}
                <button
                  type="button"
                  className="btn-launch-generation"
                  onClick={handleStartGeneration}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>
                    {activeMode === 'exercices' && 'Générer des exercices'}
                    {activeMode === 'qcm' && 'Générer les QCM'}
                    {activeMode === 'corriger' && 'Corriger le devoir'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* 2. ÉCRAN INTERACTIF TYPE CHAT : SUR PLACE, SANS SCROLL FORCÉ   */
            /* ============================================================== */
            <div className="interactive-chat-workspace">
              {/* Barre supérieure de session */}
              <div className="session-top-bar">
                <div className="session-meta">
                  <span className="session-badge" style={{ color: currentModeConfig.color, background: currentModeConfig.bgColor }}>
                    {currentModeConfig.title}
                  </span>
                  <span className="session-topic-tag">
                    {inputContent.text?.trim()
                      ? inputContent.text.slice(0, 30) + '...'
                      : inputContent.file?.name || 'Session active'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-new-exercise"
                  onClick={handleReset}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Nouvel exercice</span>
                </button>
              </div>

              {/* Zone principale interactive */}
              <div className="interactive-viewport">
                {isLoading ? (
                  <div className="loading-state-box">
                    <div className="spinner-sparkle" />
                    <p className="loading-title">L’intelligence pédagogique analyse votre demande...</p>
                    <p className="loading-sub">
                      {activeMode === 'exercices' && 'Élaboration d\'exercices progressifs adaptés.'}
                      {activeMode === 'qcm' && 'Formulation des questions et calibration des réponses.'}
                      {activeMode === 'corriger' && 'Évaluation rigoureuse et barème officiel.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* MODE 1 : EXERCICES GÉNÉRÉS SUR PLACE */}
                    {activeMode === 'exercices' && (
                      <div className="generated-exercises-list">
                        {generatedExercises.map((ex) => (
                          <div key={ex.id} className="exercise-interactive-card">
                            <div className="card-head-row">
                              <h3 className="card-ex-title">{ex.title}</h3>
                              <span className="card-ex-duration">⏱️ {ex.duration}</span>
                            </div>

                            <p className="card-ex-statement">{ex.statement}</p>

                            <div className="card-ex-action-row">
                              <button
                                type="button"
                                className="btn-toggle-solution"
                                onClick={() => handleToggleSolution(ex.id)}
                              >
                                {ex.isSolutionVisible ? 'Masquer la solution' : 'Afficher la méthode & le corrigé'}
                              </button>
                            </div>

                            {ex.isSolutionVisible && (
                              <div className="card-ex-solution-box">
                                <h4 className="solution-heading">Correction détaillée & Méthode :</h4>
                                <pre className="solution-text">{ex.solution}</pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MODE 2 : QCM INTERACTIF SUR PLACE */}
                    {activeMode === 'qcm' && (
                      <div className="generated-qcm-list">
                        {generatedQCM.map((q) => {
                          const hasAnswered = selectedQCMAnswers[q.id] !== undefined;
                          const selectedIdx = selectedQCMAnswers[q.id];
                          const isCorrect = selectedIdx === q.correctIndex;

                          return (
                            <div key={q.id} className="qcm-interactive-card">
                              <h3 className="qcm-question-title">
                                Question {q.id} : {q.question}
                              </h3>

                              <div className="qcm-options-stack">
                                {q.options.map((opt, optIdx) => {
                                  let optionStateClass = '';
                                  if (hasAnswered) {
                                    if (optIdx === q.correctIndex) {
                                      optionStateClass = 'option-correct';
                                    } else if (optIdx === selectedIdx) {
                                      optionStateClass = 'option-wrong';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      type="button"
                                      disabled={hasAnswered}
                                      className={`qcm-option-btn ${optionStateClass} ${selectedIdx === optIdx ? 'is-selected' : ''}`}
                                      onClick={() => handleSelectOption(q.id, optIdx)}
                                    >
                                      <span className="option-letter">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className="option-text">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {hasAnswered && (
                                <div className={`qcm-feedback-banner ${isCorrect ? 'is-success' : 'is-error'}`}>
                                  <span className="feedback-icon">{isCorrect ? '✅' : '❌'}</span>
                                  <div className="feedback-text">
                                    <strong>{isCorrect ? 'Excellente réponse !' : 'Réponse incorrecte.'}</strong>
                                    <p>{q.explanation}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MODE 3 : RAPPORT DE CORRECTION SUR PLACE */}
                    {activeMode === 'corriger' && correctionReport && (
                      <div className="generated-correction-card">
                        <div className="correction-header-row">
                          <div>
                            <span className="correction-sub-tag">Évaluation formative</span>
                            <h3 className="correction-title">Note & Diagnostic Pédagogique</h3>
                          </div>
                          <div className="grade-badge">{correctionReport.grade}</div>
                        </div>

                        <p className="correction-summary">{correctionReport.summary}</p>

                        <div className="correction-points-grid">
                          <div className="points-box strengths-box">
                            <h4 className="points-title">🟢 Points forts observés :</h4>
                            <ul>
                              {correctionReport.strengths.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="points-box improvements-box">
                            <h4 className="points-title">💡 Recommandations de progrès :</h4>
                            <ul>
                              {correctionReport.improvements.map((imp, idx) => (
                                <li key={idx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Échanges conversationnels de relance */}
                    {chatMessages.length > 0 && (
                      <div className="chat-thread-flow">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`chat-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}
                          >
                            <span className="bubble-author">
                              {msg.role === 'user' ? 'Vous' : 'Tuteur IA'}
                            </span>
                            <div className="bubble-content">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Barre de Chat Interactive Inférieure */}
              {!isLoading && (
                <div className="interactive-chat-bottom-bar">
                  <div className="quick-action-chips">
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => handleSendFollowup('Donne-moi un indice méthodologique pour cet exercice')}
                    >
                      💡 Un indice ?
                    </button>
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => handleSendFollowup('Génère une variante un peu plus difficile')}
                    >
                      🔥 Variante plus difficile
                    </button>
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => handleSendFollowup('Explique la démarche étape par étape')}
                    >
                      📖 Explique la démarche
                    </button>
                  </div>

                  <div className="chat-input-row">
                    <input
                      type="text"
                      className="chat-prompt-input"
                      placeholder="Posez une question sur cet exercice ou demandez une précision..."
                      value={followupText}
                      onChange={(e) => setFollowupText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendFollowup();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-send-chat"
                      onClick={() => handleSendFollowup()}
                      disabled={!followupText.trim()}
                      aria-label="Envoyer"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {!isSessionActive && <Footer />}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <style jsx>{`
        .exercices-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .exercices-main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .page-header-compact {
          padding: 18px 0 8px;
          text-align: center;
          background: transparent;
        }

        .header-simple-title {
          font-size: clamp(1.6rem, 3.2vw, 2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #1e3a8a;
          margin: 0;
          letter-spacing: -0.025em;
          display: inline-block;
        }

        .workspace-container {
          max-width: 840px;
          padding: 12px 16px 50px;
          flex: 1;
        }

        /* 1. Carte de Saisie Initiale Ultra-Moderne */
        .card-workspace-input {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .section-block {
          display: flex;
          flex-direction: column;
        }

        /* Barre d'action intelligente façon Chat */
        .chat-action-bar-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .action-selector-relative {
          position: relative;
        }

        /* Bouton Pilule Style Chat (+) */
        .btn-chat-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          color: #0f172a;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 700;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-chat-mode-pill:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .btn-plus-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 800;
          line-height: 1;
        }

        .btn-chat-mode-pill:hover .btn-plus-icon {
          background: #2563eb;
          color: #ffffff;
        }

        .mode-current-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mode-current-label {
          font-weight: 700;
          color: #1e293b;
        }

        .chevron-indicator {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .chevron-indicator.is-open {
          transform: rotate(180deg);
        }

        /* Menu Popover Flottant */
        .menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
        }

        .chat-mode-popover {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 0;
          width: 340px;
          max-width: 90vw;
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.18);
          z-index: 101;
          overflow: hidden;
          animation: popoverFade 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popover-header {
          padding: 10px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .popover-title {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.04em;
        }

        .popover-items-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .popover-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          text-align: left;
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
        }

        .popover-item-btn:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .popover-item-btn.is-selected {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .item-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-text-box {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-title {
          font-size: 0.84rem;
          font-weight: 800;
          color: #0f172a;
        }

        .item-subtitle {
          font-size: 0.7188rem;
          color: #64748b;
          line-height: 1.3;
        }

        .item-check-badge {
          color: #2563eb;
          font-weight: 900;
          font-size: 1rem;
        }

        /* Bouton Lancement */
        .btn-launch-generation {
          padding: 10px 22px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
        }

        .btn-launch-generation:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.3);
        }

        /* 2. Espace Interactif Type Chat (In-place & Mobile First) */
        .interactive-chat-workspace {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }

        .session-top-bar {
          padding: 12px 18px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .session-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .session-badge {
          font-size: 0.7813rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .session-topic-tag {
          font-size: 0.7813rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 240px;
        }

        .btn-new-exercise {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7813rem;
          font-weight: 700;
          color: #2563eb;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-new-exercise:hover {
          background: #eff6ff;
        }

        .interactive-viewport {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          max-height: 60vh;
        }

        .loading-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 44px 16px;
        }

        .spinner-sparkle {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 14px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .loading-sub {
          font-size: 0.7813rem;
          color: #64748b;
          margin: 0;
        }

        /* Exercices */
        .generated-exercises-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .exercise-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          background: #fbfcfe;
        }

        .card-head-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .card-ex-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .card-ex-duration {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .card-ex-statement {
          font-size: 0.84rem;
          color: #334155;
          line-height: 1.6;
          margin: 0 0 12px;
        }

        .btn-toggle-solution {
          font-size: 0.7813rem;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 5px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .card-ex-solution-box {
          margin-top: 12px;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 12px;
        }

        .solution-heading {
          font-size: 0.7813rem;
          font-weight: 800;
          color: #1e3a8a;
          margin: 0 0 6px;
        }

        .solution-text {
          font-size: 0.7813rem;
          color: #334155;
          margin: 0;
          white-space: pre-line;
          font-family: inherit;
          line-height: 1.5;
        }

        /* QCM */
        .generated-qcm-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .qcm-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          background: #fbfcfe;
        }

        .qcm-question-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          line-height: 1.45;
        }

        .qcm-options-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .qcm-option-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          font-size: 0.84rem;
          color: #1e293b;
          transition: all 0.15s ease;
        }

        .qcm-option-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .option-letter {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #f1f5f9;
          font-weight: 800;
          font-size: 0.7188rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #475569;
        }

        .qcm-option-btn.option-correct {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #15803d;
        }

        .qcm-option-btn.option-correct .option-letter {
          background: #22c55e;
          color: #ffffff;
        }

        .qcm-option-btn.option-wrong {
          background: #fef2f2;
          border-color: #ef4444;
          color: #b91c1c;
        }

        .qcm-option-btn.option-wrong .option-letter {
          background: #ef4444;
          color: #ffffff;
        }

        .qcm-feedback-banner {
          margin-top: 10px;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.7813rem;
        }

        .qcm-feedback-banner.is-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .qcm-feedback-banner.is-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        /* Correction */
        .generated-correction-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          background: #ffffff;
        }

        .correction-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .correction-sub-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
        }

        .correction-title {
          font-size: 1.0625rem;
          font-weight: 800;
          color: #0f172a;
          margin: 2px 0 0;
        }

        .grade-badge {
          font-size: 1.0625rem;
          font-weight: 900;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 5px 12px;
          border-radius: 10px;
        }

        .correction-summary {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .correction-points-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .points-box {
          border-radius: 10px;
          padding: 12px;
          font-size: 0.7813rem;
        }

        .strengths-box {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
        }

        .improvements-box {
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .points-title {
          font-size: 0.7813rem;
          font-weight: 800;
          margin: 0 0 6px;
        }

        .strengths-box .points-title { color: #166534; }
        .improvements-box .points-title { color: #1e40af; }

        .points-box ul {
          margin: 0;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #334155;
        }

        /* Thread de Chat */
        .chat-thread-flow {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .chat-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        .bubble-user {
          align-self: flex-end;
          background: #2563eb;
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .bubble-assistant {
          align-self: flex-start;
          background: #f1f5f9;
          color: #0f172a;
          border-bottom-left-radius: 4px;
        }

        .bubble-author {
          display: block;
          font-size: 0.6875rem;
          font-weight: 700;
          margin-bottom: 2px;
          opacity: 0.8;
        }

        /* Barre inférieure type chat */
        .interactive-chat-bottom-bar {
          padding: 10px 16px 14px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quick-action-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip-btn {
          font-size: 0.7188rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .chip-btn:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;
        }

        .chat-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 6px 8px 6px 12px;
        }

        .chat-prompt-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.8125rem;
          color: #0f172a;
        }

        .btn-send-chat {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
          flex-shrink: 0;
        }

        .btn-send-chat:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-send-chat:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .page-header-compact {
            padding: 12px 0 4px;
          }
          .header-simple-title {
            font-size: 1.5rem;
            font-weight: 800;
          }
          .workspace-container {
            padding: 6px 12px 110px;
          }
          .card-workspace-input {
            padding: 14px 12px;
            border-radius: 16px;
            gap: 12px;
          }
          .chat-action-bar-wrap {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding-top: 10px;
          }
          .action-selector-relative {
            width: 100%;
          }
          .btn-chat-mode-pill {
            width: 100%;
            justify-content: space-between;
            padding: 8px 14px;
            font-size: 0.8125rem;
          }
          .chat-mode-popover {
            width: 100%;
            bottom: calc(100% + 8px);
          }
          .btn-launch-generation {
            width: 100%;
            justify-content: center;
            padding: 11px 16px;
            font-size: 0.875rem;
          }
          .correction-points-grid {
            grid-template-columns: 1fr;
          }
          .interactive-chat-workspace {
            margin-bottom: 90px;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}
