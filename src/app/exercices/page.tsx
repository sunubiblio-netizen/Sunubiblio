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

export default function ExercicesPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // État du formulaire
  const [activeMode, setActiveMode] = useState<ExerciseMode>('exercices');
  const [inputContent, setInputContent] = useState<{
    type: AIInputType;
    text?: string;
    file?: File;
    libraryResource?: AIAttachment;
  }>({
    type: 'text',
    text: '',
  });

  // Options secondaires
  const [selectedLevel, setSelectedLevel] = useState('lycee');
  const [selectedType, setSelectedType] = useState('synthese');
  const [qcmCount, setQcmCount] = useState(3);
  const [correctionDetail, setCorrectionDetail] = useState('detaillee');

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

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
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
    }, 1200);
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
    }, 800);
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
        {/* En-tête Compact */}
        <header className="page-header-compact">
          <div className="container">
            <div className="header-meta-box">
              <div className="header-badge">
                <span className="badge-dot" />
                <span>Espace Exercices & Évaluations</span>
              </div>
              <h1 className="header-title">
                Génération & <span className="header-gradient-text">Entraînement IA</span>
              </h1>
              <p className="header-subtitle">
                Générez des exercices sur mesure, testez-vous avec des QCM interactifs ou faites corriger vos devoirs directement sur cette page.
              </p>
            </div>
          </div>
        </header>

        <div className="container workspace-container">
          {!isSessionActive ? (
            /* ============================================================== */
            /* 1. ÉCRAN DE SAISIE INITIALE : SIMPLE, ORGANISÉ & VISIBLE       */
            /* ============================================================== */
            <div className="card-workspace-input">
              {/* Étape 1 : Support / Contenu avec les 3 onglets */}
              <div className="section-block">
                <AIInputSelector
                  label="1. Sur quelle leçon ou thème voulez-vous travailler ?"
                  placeholder="Entrez un thème précis (ex: Équations différentielles, Droit des obligations, Génétique...) ou collez votre cours..."
                  onContentChange={setInputContent}
                />
              </div>

              {/* Étape 2 : Choix de l'action sur la même page */}
              <div className="section-block action-choice-block">
                <label className="section-label">
                  2. Que souhaitez-vous faire avec ce support ?
                </label>

                <div className="action-modes-grid">
                  <button
                    type="button"
                    className={`mode-choice-card ${activeMode === 'exercices' ? 'is-active' : ''}`}
                    onClick={() => setActiveMode('exercices')}
                  >
                    <div className="mode-card-icon icon-exo">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="mode-card-text">
                      <h2 className="mode-title">Générer des exercices</h2>
                      <p className="mode-desc">Exercices adaptés au niveau et à la matière</p>
                    </div>
                    <div className="mode-radio-dot" />
                  </button>

                  <button
                    type="button"
                    className={`mode-choice-card ${activeMode === 'qcm' ? 'is-active' : ''}`}
                    onClick={() => setActiveMode('qcm')}
                  >
                    <div className="mode-card-icon icon-qcm">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <div className="mode-card-text">
                      <h2 className="mode-title">1. Générer des QCM</h2>
                      <p className="mode-desc">Questionnaires interactifs avec correction immédiate</p>
                    </div>
                    <div className="mode-radio-dot" />
                  </button>

                  <button
                    type="button"
                    className={`mode-choice-card ${activeMode === 'corriger' ? 'is-active' : ''}`}
                    onClick={() => setActiveMode('corriger')}
                  >
                    <div className="mode-card-icon icon-corriger">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <div className="mode-card-text">
                      <h2 className="mode-title">2. Corriger</h2>
                      <p className="mode-desc">Analyse détaillée, barème et conseils méthodologiques</p>
                    </div>
                    <div className="mode-radio-dot" />
                  </button>
                </div>

                {/* Micro-options selon le mode choisi */}
                <div className="mode-sub-options-bar">
                  {activeMode === 'exercices' && (
                    <div className="options-inline-row">
                      <div className="sub-opt-group">
                        <span className="sub-opt-label">Niveau :</span>
                        <select
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          className="sub-opt-select"
                        >
                          <option value="college">Collège</option>
                          <option value="lycee">Lycée</option>
                          <option value="universite">Université / Licence</option>
                          <option value="concours">Prépa / Concours</option>
                        </select>
                      </div>

                      <div className="sub-opt-group">
                        <span className="sub-opt-label">Type :</span>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="sub-opt-select"
                        >
                          <option value="application">Application directe</option>
                          <option value="synthese">Problème de synthèse</option>
                          <option value="annales">Sujet type Concours</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeMode === 'qcm' && (
                    <div className="options-inline-row">
                      <span className="sub-opt-label">Nombre de questions :</span>
                      {[3, 5, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`count-pill-btn ${qcmCount === num ? 'is-active' : ''}`}
                          onClick={() => setQcmCount(num)}
                        >
                          {num} questions
                        </button>
                      ))}
                    </div>
                  )}

                  {activeMode === 'corriger' && (
                    <div className="options-inline-row">
                      <span className="sub-opt-label">Niveau d'analyse :</span>
                      <button
                        type="button"
                        className={`count-pill-btn ${correctionDetail === 'detaillee' ? 'is-active' : ''}`}
                        onClick={() => setCorrectionDetail('detaillee')}
                      >
                        Complète avec barème
                      </button>
                      <button
                        type="button"
                        className={`count-pill-btn ${correctionDetail === 'guidance' ? 'is-active' : ''}`}
                        onClick={() => setCorrectionDetail('guidance')}
                      >
                        Indices & Pédagogie
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton Principal de Lancement */}
              <div className="launch-cta-wrap">
                <button
                  type="button"
                  className="btn-launch-generation"
                  onClick={handleStartGeneration}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>
                    {activeMode === 'exercices' && 'Générer les exercices adaptés'}
                    {activeMode === 'qcm' && 'Générer le QCM interactif'}
                    {activeMode === 'corriger' && 'Lancer la correction détaillée'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* 2. ÉCRAN INTERACTIF TYPE CHAT : SUR PLACE, ZÉRO SCROLL FORCÉ   */
            /* ============================================================== */
            <div className="interactive-chat-workspace">
              {/* Barre supérieure de session */}
              <div className="session-top-bar">
                <div className="session-meta">
                  <span className="session-badge">
                    {activeMode === 'exercices' && '✍️ Série d\'exercices'}
                    {activeMode === 'qcm' && '🎯 QCM Interactif'}
                    {activeMode === 'corriger' && '🔍 Rapport de correction'}
                  </span>
                  <span className="session-topic-tag">
                    {inputContent.text?.trim()
                      ? inputContent.text.slice(0, 35) + '...'
                      : inputContent.file?.name || 'Session personnalisée'}
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
                      {activeMode === 'exercices' && 'Élaboration d\'exercices progressifs et adaptés au niveau.'}
                      {activeMode === 'qcm' && 'Formulation des propositions et calibration des corrigés.'}
                      {activeMode === 'corriger' && 'Évaluation rigoureuse selon les critères officiels.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* MODE 1 : EXERCICES GÉNÉRÉS AVEC CORRIGÉ DÉPLIABLE SUR PLACE */}
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

                    {/* MODE 2 : QCM INTERACTIF JOUABLE DIRECTEMENT SUR L'ÉCRAN */}
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

                    {/* MODE 3 : RAPPORT DE CORRECTION IMMÉDIAT */}
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

              {/* Barre de Chat Interactive Inférieure (Pour relancer sans scroller) */}
              {!isLoading && (
                <div className="interactive-chat-bottom-bar">
                  {/* Puces de suggestion rapide */}
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
                      onClick={() => handleSendFollowup('Génère une variante un peu plus difficile de cet exercice')}
                    >
                      🔥 Variante plus difficile
                    </button>
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => handleSendFollowup('Explique la méthode pas-à-pas')}
                    >
                      📖 Explique la démarche
                    </button>
                  </div>

                  {/* Champ de saisie instantané */}
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
          padding: 32px 0 16px;
          text-align: center;
          background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .header-meta-box {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 9999px;
          background: #e0e7ff;
          color: #3730a3;
          font-size: 0.7813rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .header-title {
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .header-gradient-text {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          font-size: 0.9375rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .workspace-container {
          max-width: 860px;
          padding: 24px 16px 48px;
          flex: 1;
        }

        /* 1. Carte de Saisie Initiale */
        .card-workspace-input {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.06);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-label {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
        }

        .action-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .mode-choice-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mode-choice-card:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .mode-choice-card.is-active {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 4px 16px -2px rgba(37, 99, 235, 0.15);
        }

        .mode-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-exo {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-qcm {
          background: #f0fdf4;
          color: #16a34a;
        }

        .icon-corriger {
          background: #fef2f2;
          color: #dc2626;
        }

        .mode-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .mode-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
          line-height: 1.35;
        }

        .mode-radio-dot {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
        }

        .mode-choice-card.is-active .mode-radio-dot {
          border-color: #2563eb;
          background: #2563eb;
          box-shadow: inset 0 0 0 2px #ffffff;
        }

        .mode-sub-options-bar {
          background: #f8fafc;
          border-radius: 12px;
          padding: 10px 14px;
          border: 1px solid #f1f5f9;
        }

        .options-inline-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .sub-opt-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sub-opt-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #475569;
        }

        .sub-opt-select {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 0.8125rem;
          color: #0f172a;
          outline: none;
        }

        .count-pill-btn {
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.7813rem;
          font-weight: 700;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .count-pill-btn.is-active {
          background: #1e3a8a;
          color: #ffffff;
          border-color: #1e3a8a;
        }

        .launch-cta-wrap {
          margin-top: 6px;
        }

        .btn-launch-generation {
          width: 100%;
          padding: 14px 24px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          font-size: 1rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-launch-generation:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.32);
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
          min-height: 520px;
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
          color: #1e3a8a;
          background: #eff6ff;
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
          padding: 20px;
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
          padding: 48px 16px;
        }

        .spinner-sparkle {
          width: 38px;
          height: 38px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .loading-sub {
          font-size: 0.8125rem;
          color: #64748b;
          margin: 0;
        }

        /* Exercices */
        .generated-exercises-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .exercise-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
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
          font-size: 0.875rem;
          color: #334155;
          line-height: 1.6;
          margin: 0 0 14px;
        }

        .btn-toggle-solution {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .card-ex-solution-box {
          margin-top: 14px;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 14px;
        }

        .solution-heading {
          font-size: 0.8125rem;
          font-weight: 800;
          color: #1e3a8a;
          margin: 0 0 6px;
        }

        .solution-text {
          font-size: 0.8125rem;
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
          gap: 16px;
        }

        .qcm-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          background: #fbfcfe;
        }

        .qcm-question-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 14px;
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
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          font-size: 0.875rem;
          color: #1e293b;
          transition: all 0.15s ease;
        }

        .qcm-option-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .option-letter {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #f1f5f9;
          font-weight: 800;
          font-size: 0.75rem;
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
          margin-top: 12px;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.8125rem;
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
          padding: 20px;
          background: #ffffff;
        }

        .correction-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .correction-sub-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
        }

        .correction-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin: 2px 0 0;
        }

        .grade-badge {
          font-size: 1.125rem;
          font-weight: 900;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 6px 14px;
          border-radius: 10px;
        }

        .correction-summary {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 16px;
        }

        .correction-points-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .points-box {
          border-radius: 10px;
          padding: 14px;
          font-size: 0.8125rem;
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
          font-size: 0.8125rem;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .strengths-box .points-title { color: #166534; }
        .improvements-box .points-title { color: #1e40af; }

        .points-box ul {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
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
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.8438rem;
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
          margin-bottom: 4px;
          opacity: 0.8;
        }

        /* Barre inférieure type chat */
        .interactive-chat-bottom-bar {
          padding: 12px 18px 16px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .quick-action-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-btn {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 12px;
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
          padding: 6px 8px 6px 14px;
        }

        .chat-prompt-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.875rem;
          color: #0f172a;
        }

        .btn-send-chat {
          width: 34px;
          height: 34px;
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

        @media (max-width: 768px) {
          .action-modes-grid {
            grid-template-columns: 1fr;
          }
          .correction-points-grid {
            grid-template-columns: 1fr;
          }
          .card-workspace-input {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
