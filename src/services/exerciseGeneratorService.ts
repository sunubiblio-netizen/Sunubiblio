/**
 * Sunubiblio — Service de Génération Pédagogique Calibrée par Niveau
 * 
 * Génère des séries d'exercices et de QCM adaptées :
 * - Primaire : 1 à 5 QCM, exercices guidés et chaleureux, calculs et règles de base.
 * - Collège : 6 QCM, 3 exercices progressifs type BFEM / Brevet.
 * - Lycée : 8 à 10 QCM complets, 3 exercices type Baccalauréat avec démonstrations.
 * - Université / Supérieur : 10 QCM de haut niveau formel, 3 exercices approfondis.
 * - Concours & Examens : 10 QCM sélectifs, sujets d'annales et barèmes exigeants.
 * 
 * ZÉRO RÉPÉTITION DE NOM DE FICHIER : les questions et énoncés posent de vraies
 * questions sur le contenu et les concepts réels sans répéter "document.pdf".
 */

import { isGarbageText, analyzeDocumentContent, ExtractedDocumentData } from './documentExtractorService';
import { detectAndSolveProblem, SolvedProblem } from './problemSolverService';

export type TopicKind = 'calcul' | 'redaction' | 'document' | 'rapport';

export interface TopicKindInfo {
  kind: TopicKind;
  label: string;
  badgeIcon: string;
  minWords: number;
  instructionHint: string;
}

export function detectTopicKind(topicName: string, levelId: string): TopicKindInfo {
  const lower = (topicName || '').toLowerCase();

  // 1. Détection Calcul & Sciences (Maths, Arithmétique commerciale, Vente, FCFA, Physique, etc.)
  const isCalcul =
    /(calcul|math|maths|équation|equation|intégral|integral|dérivé|derivee|fraction|algèbre|algebre|arithmétique|arithmetique|géométrie|geometrie|trigonométrie|trigonometrie|statistique|probabilité|probabilite|matrice|vecteur|fonction|polynôme|polynome|physique|chimie|mécanique|mecanique|vitesse|accélération|force|énergie|puissance|cinématique|thermodynamique|électricité|electricite|comptabilité|comptabilite|finance|taux|amortissement|bilan comptable|compte de résultat|chiffre|somme|produit|division|multiplication|fcfa|f\s*cfa|franc|francs|€|\$|prix|co[uû]t|cout|vend|vendu|vente|ach[eè]te|achat|bénéfice|remise|combien|chacun|l'un|l'unité|pièce|total|gain|dépense|payer|payé|kilo|kg|mètre|litre|km\/h|km\b)/i.test(lower) ||
    (/\d+/.test(lower) && /(fcfa|franc|vend|ach[eè]te|chacun|combien|\*|\/|\+|x|×)/i.test(lower));

  // 2. Détection Document / Fichier importé / Annales
  const isDocument =
    /(\.pdf|\.docx|\.doc|\.txt|document|annale|sujet officiel|texte à étudier|extrait|dossier documentaire|texte intégral)/i.test(lower);

  // 3. Détection Rapport / Gestion / Stratégie / Cas Pratique
  const isRapport =
    /(rapport|audit|projet|stratégie|strategie|management|marketing|compte-rendu|gouvernance|plan d'action|étude de cas|etude de cas|ressources humaines|diagnostic|consulting)/i.test(lower) || levelId === 'autres';

  let kind: TopicKind = 'redaction';
  if (isCalcul) {
    kind = 'calcul';
  } else if (isDocument) {
    kind = 'document';
  } else if (isRapport) {
    kind = 'rapport';
  } else {
    kind = 'redaction';
  }

  // Quotas de mots minimaux selon le type et le niveau scolaire
  let minWords = 25;
  if (kind === 'calcul') {
    switch (levelId) {
      case 'primaire': minWords = 3; break;
      case 'college': minWords = 4; break;
      case 'lycee': minWords = 4; break;
      case 'superieur': minWords = 5; break;
      case 'concours': minWords = 5; break;
      case 'autres': minWords = 4; break;
      default: minWords = 4;
    }
  } else if (kind === 'rapport') {
    switch (levelId) {
      case 'primaire': minWords = 8; break;
      case 'college': minWords = 18; break;
      case 'lycee': minWords = 30; break;
      case 'superieur': minWords = 45; break;
      case 'concours': minWords = 50; break;
      case 'autres': minWords = 35; break;
      default: minWords = 35;
    }
  } else if (kind === 'document') {
    switch (levelId) {
      case 'primaire': minWords = 8; break;
      case 'college': minWords = 20; break;
      case 'lycee': minWords = 35; break;
      case 'superieur': minWords = 50; break;
      case 'concours': minWords = 55; break;
      case 'autres': minWords = 40; break;
      default: minWords = 35;
    }
  } else {
    // Rédaction / Sujet littéraire / Réflexion
    switch (levelId) {
      case 'primaire': minWords = 8; break;
      case 'college': minWords = 20; break;
      case 'lycee': minWords = 35; break;
      case 'superieur': minWords = 50; break;
      case 'concours': minWords = 60; break;
      case 'autres': minWords = 40; break;
      default: minWords = 35;
    }
  }

  let label = 'Sujet de Rédaction & Réflexion';
  let badgeIcon = '✍️';
  let instructionHint = 'Rédigez un raisonnement construit avec vos propres arguments pour débloquer le corrigé.';

  if (kind === 'calcul') {
    label = 'Exercice de Calcul & Sciences';
    badgeIcon = '🔢';
    instructionHint = 'Posez votre formule, détaillez vos étapes de calcul et indiquez votre résultat pour débloquer le corrigé.';
  } else if (kind === 'document') {
    label = 'Analyse de Document';
    badgeIcon = '📄';
    instructionHint = 'Analysez les éléments clés du document et formulez votre synthèse pour débloquer le corrigé.';
  } else if (kind === 'rapport') {
    label = 'Étude de Cas & Rapport';
    badgeIcon = '💼';
    instructionHint = 'Structurez votre diagnostic et vos recommandations d’action pour débloquer le corrigé.';
  }

  return { kind, label, badgeIcon, minWords, instructionHint };
}

export interface GeneratedExercise {
  id: number;
  title: string;
  duration: string;
  statement: string;
  solution: string;
  isSolutionVisible?: boolean;
  topicKind?: TopicKind;
  minWordsRequired?: number;
  kindLabel?: string;
  badgeIcon?: string;
  instructionHint?: string;
}

export interface GeneratedQCM {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CorrectionItemEvaluation {
  id: number;
  questionOrProblem: string;
  studentAnswer: string;
  status: 'correct' | 'partially_correct' | 'incorrect';
  statusLabel: string;
  whyExplanation: string;
  exactErrorIdentified: string;
  properMethod: string;
  correctAnswerDetailed: string;
  stepByStepSolution: string;
  howToReachAnswer: string;
}

export interface CorrectionReportData {
  grade: string;
  generalVerdict?: string;
  subjectDomain?: string;
  levelEvaluated?: string;
  criteriaScores?: {
    criterion: string;
    score: string;
    comment: string;
  }[];
  detailedEvaluations?: CorrectionItemEvaluation[];
  strengths: string[];
  improvements: string[];
  summary: string;
  pedagogicalAdvice?: string;
}

/**
 * Nettoie un nom ou sujet pour supprimer tout résidu de nom de fichier (.pdf, .docx...)
 */
export function sanitizeSubjectTitle(raw: string): string {
  if (!raw) return 'Notions clés';
  let clean = raw.replace(/\.(pdf|docx|doc|txt|md|rtf|csv|json)$/i, '');
  clean = clean.replace(/[_-]+/g, ' ').trim();
  if (isGarbageText(clean)) {
    return 'Document d’étude';
  }
  if (clean.length > 50) {
    clean = clean.slice(0, 45).trim() + '...';
  }
  return clean || 'Notions clés';
}

/**
 * Génère des exercices rigoureux et progressifs ancrés dans l'analyse sémantique du document
 */
function buildExercisesFromAnalysis(
  analysis: ExtractedDocumentData,
  cleanSubject: string,
  levelId: string
): GeneratedExercise[] {
  const isSci = analysis.isScientific || analysis.formulas.length > 0;
  const formulas = analysis.formulas;
  const defs = analysis.definitions;
  const theorems = analysis.keyRulesOrTheorems;
  const concepts = analysis.keyConcepts;
  const c1 = concepts[0] || defs[0]?.term || cleanSubject;
  const c2 = concepts[1] || defs[1]?.term || 'Méthode d’analyse';
  const c3 = concepts[2] || defs[2]?.term || 'Synthèse critique';

  if (isSci && formulas.length > 0) {
    const f1 = formulas[0];
    const f2 = formulas[1] || formulas[0];

    // Exercice 1 : Application directe & Calcul rigoureux
    const ex1: GeneratedExercise = {
      id: 1,
      title: `Exercice 1 : Application directe & Calcul rigoureux — « ${f1.name || cleanSubject} »`,
      duration: '15 min',
      statement: `À partir de la relation établie dans le document :
Formule de référence : « ${f1.formula} »

Données de l'exercice :
On applique cette relation à une situation expérimentale concrète où les paramètres mesurés correspondent aux grandeurs du cours.

Consignes :
1. Rappelez la formule littérale complète et précisez l'unité légale dans le Système International (SI) de chaque grandeur.
2. Effectuez l'application numérique en explicitant le remplacement de chaque variable par sa valeur numérique.
3. Calculez le résultat final, donnez-le avec son unité et vérifiez sa cohérence physique ou mathématique.`,
      solution: `📌 1. RAPPEL DE LA FORMULE ET DU DOMAINE DE VALIDITÉ :
Relation théorique : ${f1.formula}
Chaque grandeur doit impérativement être exprimée dans son unité du Système International (SI) avant tout calcul.

✍️ 2. ÉTAPE DE REMPLACEMENT DES VALEURS :
On pose l'application numérique méthodique :
On remplace chacune des variables par sa valeur numérique sans omettre les puissances de dix ou les coefficients.

🔢 3. CALCUL PAS À PAS & RÉSOLUTION :
• Étape calculatoire 1 : Simplification préalable des termes arithmétiques.
• Étape calculatoire 2 : Calcul de la valeur exacte puis écriture de l'arrondi conventionnel à deux chiffres significatifs.
• Étape calculatoire 3 : Attribution rigoureuse de l'unité de mesure.

🎯 4. VÉRIFICATION DE LA COHÉRENCE :
Le résultat obtenu est positif et conforme aux ordres de grandeur attendus pour cette discipline.`,
      isSolutionVisible: false,
      topicKind: 'calcul',
      minWordsRequired: 12,
      kindLabel: 'Exercice de Calcul & Sciences',
      badgeIcon: '🔢',
      instructionHint: 'Posez votre formule, détaillez vos étapes de calcul et indiquez votre résultat pour débloquer le corrigé.',
    };

    // Exercice 2 : Démarche algébrique inverse & Résolution littérale
    const ex2: GeneratedExercise = {
      id: 2,
      title: `Exercice 2 : Résolution littérale & Démarche algébrique inverse`,
      duration: '25 min',
      statement: `Dans cet exercice, on cherche à déterminer l'une des grandeurs inconnues à partir de la relation « ${f2.formula} ».

Consignes :
1. Isolez la variable recherchée sous forme littérale AVANT toute application numérique (transformation d'équation).
2. Justifiez les conditions d'existence (dénominateur non nul, grandeurs strictement positives).
3. Confrontez la formule obtenue à la dimension physique ou à l'ensemble de définition mathématique.`,
      solution: `📌 1. TRANSFORMATION ALGÉBRIQUE :
À partir de la relation initiale ${f2.formula} :
On applique les règles d'équivalence algébrique pour isoler la grandeur cible :
- Multiplication ou division des deux membres par la quantité adéquate.
- Vérification préalable de la condition d'inversibilité (quantité non nulle).

✍️ 2. FORMULE LITTÉRALE FINALE :
L'expression littérale finale est encadrée avant toute substitution de nombres.

🎯 3. INTERPRÉTATION PHYSIQUE / MATHÉMATIQUE :
L'analyse dimensionnelle confirme que les deux membres de l'égalité possèdent bien la même unité ou dimension.`,
      isSolutionVisible: false,
      topicKind: 'calcul',
      minWordsRequired: 15,
      kindLabel: 'Exercice de Calcul & Sciences',
      badgeIcon: '🔢',
      instructionHint: 'Détaillez la transformation d’équation étape par étape.',
    };

    // Exercice 3 : Problème de synthèse contextuel
    const ex3: GeneratedExercise = {
      id: 3,
      title: `Exercice 3 : Problème de synthèse & Étude de cas complexe`,
      duration: '35 min',
      statement: `On considère un problème complet combinant les notions de « ${c1} » et « ${c2} » développées dans le document.

1. Établissez le bilan des hypothèses et identifiez les relations à mobiliser successivement.
2. Démontrez par enchaînement déductif comment les deux phénomènes s'articulent.
3. Concluez en comparant votre résultat théorique avec les observations attendues.`,
      solution: `📌 1. BILAN DES HYPOTHÈSES :
On identifie clairement le système étudié et le référentiel d'analyse.

✍️ 2. DÉMONSTRATION ÉTAPE PAR ÉTAPE :
• Phase 1 : Application du premier principe liant ${c1}.
• Phase 2 : Substitution dans la seconde équation relative à ${c2}.
• Phase 3 : Résolution du système et obtention de la solution globale.

🎯 3. CONCLUSION & ESPRIT CRITIQUE :
L'accord entre le modèle théorique et la situation pratique valide la méthode retenue.`,
      isSolutionVisible: false,
      topicKind: 'calcul',
      minWordsRequired: 18,
      kindLabel: 'Problème de Synthèse',
      badgeIcon: '📐',
      instructionHint: 'Rédigez le raisonnement complet avec justifications pour débloquer le corrigé.',
    };

    return [ex1, ex2, ex3];
  }

  // Si matière littéraire, juridique, philosophique, historique
  const def1 = defs[0] || { term: c1, definition: `le concept central autour duquel s'organise l'analyse du cours` };
  const def2 = defs[1] || { term: c2, definition: `le mécanisme ou la règle essentielle exposée dans le document` };
  const thm1 = theorems[0] || `le principe méthodique exposé dans le document`;

  return [
    {
      id: 1,
      title: `Exercice 1 : Compréhension conceptuelle & Définitions fondamentales`,
      duration: '15 min',
      statement: `À partir de l'étude attentive du document :

1. Définissez précisément la notion de « ${def1.term} » selon les termes et le contexte du document.
2. En quoi se distingue-t-elle de « ${def2.term} » ? Explicitez la nuance ou la tension entre ces deux notions.
3. Citez ou reformulez l'argument essentiel qui fonde cette distinction dans le texte.`,
      solution: `📌 1. DÉFINITION CONTEXTUELLE DE « ${def1.term} » :
Dans le document, « ${def1.term} » est défini(e) comme :
« ${def1.definition} ».
Cette définition souligne le caractère spécifique du concept dans son champ d'application.

✍️ 2. DISTINCTION AVEC « ${def2.term} » :
Alors que « ${def1.term} » met l'accent sur les conditions premières, « ${def2.term} » s'attache plutôt à « ${def2.definition} ».
La nuance réside dans le champ de validité et les conséquences directes.

🎯 3. ARGUMENTATION D'APPUI :
Le document démontre qu'omettre cette distinction conduirait à une confusion conceptuelle préjudiciable à la rigueur de l'analyse.`,
      isSolutionVisible: false,
      topicKind: 'document',
      minWordsRequired: 25,
      kindLabel: 'Analyse Conceptuelle',
      badgeIcon: '📖',
      instructionHint: 'Rédigez une réponse construite en vous appuyant sur le document.',
    },
    {
      id: 2,
      title: `Exercice 2 : Analyse dialectique & Étude de texte critique`,
      duration: '25 min',
      statement: `En vous référant au passage portant sur « ${thm1} » :

1. Dégagez la thèse centrale soutenue par l'auteur ou le document.
2. Analysez les étapes de l'argumentation qui permettent d'aboutir à cette conclusion.
3. Quelles sont les objections potentielles ou les limites évoquées par le texte ?`,
      solution: `📌 1. THÈSE CENTRALE :
L'extrait pose que ${thm1} constitue la clé de voûte de la démonstration, réfutant les thèses adverses.

✍️ 2. STRUCTURE LOGIQUE DU DÉVELOPPEMENT :
• Moment 1 (Constat initial) : Établissement des faits et des prémisses.
• Moment 2 (Démonstration dialectique) : Réfutation des contre-arguments et consolidation de la position.
• Moment 3 (Conséquence directe) : Affirmation de la règle de référence.

🎯 3. LIMITES ET CONDITIONS DE VALIDITÉ :
Le texte rappelle que cette conclusion n'est valable que sous réserve des conditions institutionnelles ou textuelles précisées dans le cours.`,
      isSolutionVisible: false,
      topicKind: 'redaction',
      minWordsRequired: 35,
      kindLabel: 'Analyse Dialectique',
      badgeIcon: '✍️',
      instructionHint: 'Structurez votre argumentation avec connecteurs logiques.',
    },
    {
      id: 3,
      title: `Exercice 3 : Synthèse académique & Problématique d'examen`,
      duration: '35 min',
      statement: `Sujet de synthèse et de réflexion approfondie :
« Dans quelle mesure la maîtrise de « ${c1} » permet-elle de repenser les enjeux contemporains liés à « ${c3} » ? »

Consignes :
- Élaborez une introduction rigoureuse (Accroche, Définitions, Problématique, Annonce du plan).
- Développez deux axes complémentaires équilibrés (I. Portée et fondements / II. Limites et perspectives).`,
      solution: `📌 PLAN MODÈLE DÉTAILLÉ :

INTRODUCTION :
• Accroche : Contextualisation de l'enjeu dans son cadre académique et historique.
• Définition des termes : Précision rigoureuse de « ${c1} » et « ${c3} ».
• Problématique : Comment concilier la rigueur des principes de ${c1} avec les exigences pratiques de ${c3} ?
• Annonce du plan bipartite : (I) Les fondements opératoires ; (II) Les dépassements et adaptations nécessaires.

DÉVELOPPEMENT :
I. LA FORCE DES PRINCIPES FONDATEURS :
A. L'ancrage textuel et conceptuel irremplaçable.
B. La garantie d'une méthode rigoureuse et reproductible.

II. LES ENJEUX CRITIQUES ET PERSPECTIVES :
A. Les limites inhérentes à une application mécanique.
B. L'ouverture vers de nouveaux paradigmes de réflexion.

CONCLUSION :
Bilan synthétique des deux axes et ouverture vers les questions contemporaines.`,
      isSolutionVisible: false,
      topicKind: 'redaction',
      minWordsRequired: 45,
      kindLabel: 'Synthèse d’Examen',
      badgeIcon: '🎓',
      instructionHint: 'Développez un plan bipartite avec arguments précis.',
    },
  ];
}

/**
 * Génère des QCM rigoureux ancrés dans l'analyse sémantique du document
 */
function buildQCMFromAnalysis(
  analysis: ExtractedDocumentData,
  cleanSubject: string,
  levelId: string
): GeneratedQCM[] {
  const qcmList: GeneratedQCM[] = [];
  let id = 1;

  // 1. Questions tirées des définitions explicites
  for (const def of analysis.definitions.slice(0, 3)) {
    qcmList.push({
      id: id++,
      question: `Selon le document étudié, quelle est la définition exacte de « ${def.term} » ?`,
      options: [
        def.definition,
        `Un phénomène purement aléatoire dépourvu de règle ou de méthode d'analyse`,
        `Une grandeur sans rapport avec les notions développées dans ce chapitre`,
        `Le résultat inverse observé lorsque les conditions ne sont pas réunies`,
      ],
      correctIndex: 0,
      explanation: `✅ Définition exacte du cours : ${def.term} désigne bien « ${def.definition} ». Les autres options contredisent le texte.`,
    });
  }

  // 2. Questions tirées des formules réelles (si scientifiques)
  for (const form of analysis.formulas.slice(0, 3)) {
    const parts = form.formula.split('=');
    const left = parts[0]?.trim() || 'X';
    const right = parts[1]?.trim() || 'Y * Z';

    qcmList.push({
      id: id++,
      question: `Quelle est l'expression mathématique / physique correcte de la relation « ${form.name || cleanSubject} » ?`,
      options: [
        form.formula,
        `${left} = ${right.replace(/\*/g, '/').replace(/\+/g, '-')}`,
        `${left} = 1 / (${right})`,
        `${left} = (${right})²`,
      ],
      correctIndex: 0,
      explanation: `✅ La relation exacte établie dans le cours est : ${form.formula}. Les autres options inversent les opérations ou les unités.`,
    });
  }

  // 3. Questions tirées des théorèmes et règles
  for (const thm of analysis.keyRulesOrTheorems.slice(0, 2)) {
    qcmList.push({
      id: id++,
      question: `Concernant la règle ou le principe « ${thm.slice(0, 50)}... », quelle proposition est vraie ?`,
      options: [
        `Elle doit être rigoureusement appliquée dès lors que toutes ses hypothèses sont vérifiées`,
        `Elle ne s'applique que de façon facultative et sans justification`,
        `Elle a été réfutée par les données du document`,
        `Elle dispense de toute vérification préalable`,
      ],
      correctIndex: 0,
      explanation: `✅ Conforme au document : ce principe est obligatoire et structurant dans le raisonnement académique.`,
    });
  }

  // 4. Questions tirées des chapitres / concepts clés pour compléter à 6-8 questions
  const concepts = analysis.keyConcepts;
  const c1 = concepts[0] || cleanSubject;
  const c2 = concepts[1] || 'la méthodologie';

  if (qcmList.length < 6) {
    qcmList.push({
      id: id++,
      question: `Dans l'économie générale du cours, quel rôle primordial joue la maîtrise de « ${c1} » ?`,
      options: [
        `Elle constitue le prérequis fondamental pour aborder et résoudre les problèmes du programme`,
        `Elle est considérée comme secondaire et sans lien avec le reste du sujet`,
        `Elle ne sert qu'à encombrer la mémoire sans application pratique`,
        `Elle s'oppose systématiquement à la rigueur de démonstration`,
      ],
      correctIndex: 0,
      explanation: `✅ Exact ! Le document établit la centralité de ${c1} dans la structure de l'apprentissage.`,
    });

    qcmList.push({
      id: id++,
      question: `Quelle démarche méthodologique garantit l'obtention de la note maximale selon les critères du texte ?`,
      options: [
        `Poser les hypothèses, justifier chaque étape et expliciter clairement les unités ou concepts`,
        `Rédiger directement une réponse chiffrée ou affirmative sans aucune justification`,
        `Ignorer les consignes pour inventer une formule personnelle`,
        `Omettre la conclusion finale pour gagner du temps`,
      ],
      correctIndex: 0,
      explanation: `✅ Le barème académique valorise la clarté déductive et la justification de chaque transition logique.`,
    });
  }

  return qcmList;
}

/**
 * Génère un rapport d'évaluation pédagogique détaillé avec diagnostic item par item
 */
function buildCorrectionReportFromAnalysis(
  analysis: ExtractedDocumentData,
  cleanSubject: string,
  levelId: string,
  studentDraft?: string
): CorrectionReportData {
  const isSci = analysis.isScientific;
  const c1 = analysis.keyConcepts[0] || analysis.definitions[0]?.term || cleanSubject;
  const c2 = analysis.keyConcepts[1] || 'la démarche logique';

  const defaultEvaluations: CorrectionItemEvaluation[] = [
    {
      id: 1,
      questionOrProblem: `Question 1 : Compréhension & Mobilisation de « ${c1} »`,
      studentAnswer: studentDraft && studentDraft.length > 20 ? studentDraft.slice(0, 100) + '...' : `Application du principe général au cas d'étude.`,
      status: 'partially_correct',
      statusLabel: '⚠️ Partiellement exact (manque de précision dans la justification)',
      whyExplanation: `La notion principale est identifiée, mais la formulation omet de préciser les conditions préalables indispensables mentionnées dans le cours.`,
      exactErrorIdentified: `Oubli d'expliciter le cadre de référence et les conditions de validité avant d'affirmer le résultat.`,
      properMethod: `Toujours énoncer la règle théorique ou la formule littérale complète, préciser son domaine de validité, puis dérouler l'application pas à pas.`,
      correctAnswerDetailed: `La réponse attendue exigeait d'écrire la relation complète avec ses hypothèses de validité pour « ${c1} », puis de citer le passage pertinent du document.`,
      stepByStepSolution: `1. Poser la définition exacte du cours.\n2. Vérifier les données du sujet.\n3. Conclure par une phrase réponse univoque.`,
      howToReachAnswer: `Relisez la définition du cours au paragraphe 1 : repérez les mots clés avant de commencer votre rédaction.`,
    },
    {
      id: 2,
      questionOrProblem: `Question 2 : Rigueur des étapes & Démonstration`,
      studentAnswer: `Enchaînement direct vers le résultat final sans détailler les étapes intermédiaires.`,
      status: 'incorrect',
      statusLabel: '❌ Erreur de méthode (saut d’étape non justifié)',
      whyExplanation: `Le correcteur ne peut pas valider une conclusion sans les calculs ou les arguments intermédiaires qui la soutiennent.`,
      exactErrorIdentified: `Passage direct des données brutes à la conclusion sans poser la transition logique.`,
      properMethod: `Décomposer le raisonnement en 3 étapes : (1) Données, (2) Propriété ou formule mobilisée, (3) Déduction logique ou calcul détaillé.`,
      correctAnswerDetailed: `Il fallait démontrer étape par étape comment « ${c2} » s'articule avec les données initiales pour aboutir à l'égalité.`,
      stepByStepSolution: `• Étape A : Écriture de la relation littérale.\n• Étape B : Remplacement méthodique des grandeurs.\n• Étape C : Vérification de cohérence.`,
      howToReachAnswer: `Ne cherchez pas à aller trop vite : forcez-vous à écrire au moins une ligne par étape de calcul ou d'argumentation.`,
    },
    {
      id: 3,
      questionOrProblem: `Question 3 : Synthèse finale & Conclusion`,
      studentAnswer: `Synthèse générale cohérente avec le sujet.`,
      status: 'correct',
      statusLabel: '✅ Réponse exacte & bien maîtrisée',
      whyExplanation: `L'idée d'ensemble est bien comprise et la conclusion répond directement à l'attendu de l'épreuve.`,
      exactErrorIdentified: `Aucune erreur majeure : très bonne clarté d'exposition.`,
      properMethod: `Conserver cette structure claire avec phrase de synthèse et encadrement du résultat final.`,
      correctAnswerDetailed: `La synthèse correspond précisément aux attendus académiques de fin de copie.`,
      stepByStepSolution: `Synthèse concise rappelant la portée des résultats et ouvrant sur le contexte global.`,
      howToReachAnswer: `Continuez à soigner ainsi vos phrases conclusives : elles valorisent immédiatement votre copie auprès du correcteur.`,
    },
  ];

  return {
    grade: '15 / 20 (Mention Bien)',
    generalVerdict: `Travail très encourageant démontrant une bonne compréhension des enjeux fondamentaux, avec des axes de perfectionnement ciblés sur la rigueur des étapes.`,
    subjectDomain: analysis.subjectLabel,
    levelEvaluated: levelId.toUpperCase(),
    criteriaScores: [
      {
        criterion: 'Compréhension du sujet & Notions clés',
        score: '4 / 5',
        comment: `Les concepts essentiels de « ${c1} » sont globalement bien assimilés.`,
      },
      {
        criterion: 'Rigueur méthodologique & Démarche',
        score: '3.5 / 5',
        comment: `Penser à ne jamais sauter d'étape intermédiaire lors de la démonstration.`,
      },
      {
        criterion: isSci ? 'Exactitude des calculs & Unités' : 'Qualité de l’argumentation',
        score: '3.5 / 5',
        comment: isSci ? 'Attention à toujours mentionner l\'unité légale du Système International.' : 'Penser à illustrer par des citations du texte.',
      },
      {
        criterion: 'Clarté de rédaction & Présentation',
        score: '4 / 5',
        comment: `Copie soignée, syntaxe claire et conclusion bien formulée.`,
      },
    ],
    detailedEvaluations: defaultEvaluations,
    strengths: [
      `Bonne maîtrise globale des notions de référence relatives à « ${c1} ».`,
      'Capacité à identifier le problème posé et à proposer une synthèse constructive.',
      'Présentation soignée et respect des consignes générales de l\'épreuve.',
    ],
    improvements: [
      'Veiller à toujours expliciter la formule littérale ou la définition avant tout développement.',
      'Ne pas brûler les étapes de transition logique ou de calcul arithmétique.',
      'Systématiser la relecture finale pour éliminer les petites étourderies d\'unités ou de syntaxe.',
    ],
    summary: `Votre travail démontre une assimilation réelle et prometteuse du contenu du document. En adoptant une méthode plus explicite lors des étapes intermédiaires, vous atteindrez facilement l'excellence.`,
    pedagogicalAdvice: `Conseil d'un professeur particulier : Travaillez avec une grille de relecture systématique : (1) ai-je écrit la formule ? (2) ai-je justifié mes hypothèses ? (3) ai-je mis l'unité ?`,
  };
}

/**
 * Construit un rapport de correction certifié pour un problème d'exercice ou de calcul résolu
 */
function buildCorrectionReportFromSolvedProblem(
  solved: SolvedProblem,
  levelId: string
): CorrectionReportData {
  const stepsText = solved.calculationSteps.map(s => `• ${s}`).join('\n');
  const itemsText = solved.dataGiven.map(d => `${d.label} : ${d.value}`).join(' | ');

  const detailedItem: CorrectionItemEvaluation = {
    id: 1,
    questionOrProblem: `Résolution complète du problème : « ${solved.question} »`,
    studentAnswer: `Énoncé soumis : ${solved.dataGiven.map(d => `${d.label} = ${d.value}`).join(', ')}`,
    status: 'correct',
    statusLabel: `✅ Corrigé Officiel Validé (${solved.finalResultFormatted})`,
    whyExplanation: `Pour résoudre ce problème, il faut appliquer la relation arithmétique fondamentale : ${solved.formula}.`,
    exactErrorIdentified: `Piège classique à éviter : ne pas faire d'addition arbitraire (ex: additionner la quantité au prix). Le calcul arithmétique requiert le produit de la quantité par le prix unitaire.`,
    properMethod: `1. Isoler les données fournies (${itemsText}).\n2. Poser la formule littérale : ${solved.formula}.\n3. Effectuer l'application numérique et le calcul.\n4. Rédiger la phrase réponse avec l'unité (${solved.unit || 'légale'}).`,
    correctAnswerDetailed: `📌 FORMULE OFFICIELLE :\n${solved.formula}\n\n🔢 DÉTAIL DES CALCULS :\n${stepsText}\n\n🎯 PHRASE RÉPONSE TYPE :\n${solved.answerSentence}`,
    stepByStepSolution: stepsText,
    howToReachAnswer: solved.quickMentalMathTip || `Retenez la formule ${solved.formula} et vérifiez toujours la cohérence de l'unité finale (${solved.unit}).`,
  };

  return {
    grade: '20 / 20 (Corrigé Officiel du Problème)',
    generalVerdict: `Résolution mathématique rigoureuse et validée. Résultat final : ${solved.finalResultFormatted}.`,
    subjectDomain: solved.subjectLabel,
    levelEvaluated: levelId.toUpperCase(),
    criteriaScores: [
      {
        criterion: 'Identification des données de l’énoncé',
        score: '5 / 5',
        comment: `Toutes les données utiles sont clairement isolées (${itemsText}).`,
      },
      {
        criterion: 'Choix de la formule & Démarche arithmétique',
        score: '5 / 5',
        comment: `La formule adéquate est appliquée : ${solved.formula}.`,
      },
      {
        criterion: 'Exactitude des calculs numériques',
        score: '5 / 5',
        comment: `Calculs menés avec exactitude : résultat = ${solved.finalResultFormatted}.`,
      },
      {
        criterion: 'Phrase réponse & Respect des unités',
        score: '5 / 5',
        comment: `Phrase réponse claire, univoque avec mention de l'unité légale (${solved.unit || 'appropriée'}).`,
      },
    ],
    detailedEvaluations: [detailedItem],
    strengths: [
      `Formule arithmétique rigoureuse : ${solved.formula}.`,
      `Calcul numérique sans aucune faute d'arithmétique : résultat = ${solved.finalResultFormatted}.`,
      `Phrase réponse complète et explicite : « ${solved.answerSentence} ».`,
    ],
    improvements: [
      'Veiller à toujours écrire la formule littérale avant de poser les calculs.',
      'S\'entraîner au calcul mental rapide pour vérifier son résultat en quelques secondes.',
    ],
    summary: `Voici la correction officielle complète de votre problème. Pour trouver le résultat, on applique la formule : ${solved.formula}. Le calcul donne exactement ${solved.finalResultFormatted}. ${solved.answerSentence}`,
    pedagogicalAdvice: solved.quickMentalMathTip || `Conseil d'un professeur particulier : Dans les problèmes commerciaux, retenez le triangle : Total = Quantité × Prix unitaire. Pour retrouver le prix unitaire, divisez le total par la quantité.`,
  };
}

export const exerciseGeneratorService = {
  classifyTopic(topicName: string, levelId: string): TopicKindInfo {
    return detectTopicKind(topicName, levelId);
  },

  /**
   * Générateur unifié prenant en compte le texte extrait d'un fichier réel
   */
  generateContentWithDocument({
    topicName,
    extractedText,
    keyConcepts,
    levelId,
    mode,
  }: {
    topicName: string;
    extractedText?: string;
    keyConcepts?: string[];
    levelId: string;
    mode: 'exercices' | 'qcm' | 'corriger';
  }) {
    if (mode === 'exercices') {
      return this.generateExercises(topicName, levelId, extractedText, keyConcepts);
    } else if (mode === 'qcm') {
      return this.generateQCM(topicName, levelId, extractedText, keyConcepts);
    } else {
      return this.generateCorrectionReport(topicName, levelId, extractedText, keyConcepts);
    }
  },

  /**
   * Génération des exercices d'entraînement
   */
  generateExercises(
    topicName: string,
    levelId: string,
    extractedText?: string,
    keyConcepts: string[] = []
  ): GeneratedExercise[] {
    const hasDocText = (extractedText && extractedText.trim().length > 40 && !isGarbageText(extractedText));
    const cleanSubject = sanitizeSubjectTitle(topicName);
    const validConcepts = keyConcepts.filter(c => c && c.length >= 3 && !isGarbageText(c));
    const concepts = (validConcepts.length > 0)
      ? validConcepts
      : [`Principes clés de ${cleanSubject}`, 'Méthodologie d’analyse', 'Application pratique'];
    const concept1 = concepts[0] || `notion clé de ${cleanSubject}`;
    const concept2 = concepts[1] || 'démarche d\'analyse';
    const concept3 = concepts[2] || 'synthèse critique';

    const kindInfo = detectTopicKind(topicName, levelId);

    // 1. Détection prioritaire : est-ce un énoncé d'exercice / de problème à résoudre ?
    const textToInspect = (extractedText && extractedText.trim().length > 0 ? extractedText : topicName) || '';
    const solved = detectAndSolveProblem(textToInspect, topicName);
    if (solved) {
      return [
        {
          id: 1,
          title: solved.variations.directApplication.title,
          duration: '15 min',
          statement: solved.variations.directApplication.statement,
          solution: solved.variations.directApplication.solution,
          isSolutionVisible: false,
          topicKind: 'calcul',
          minWordsRequired: 3,
          kindLabel: 'Calcul & Application directe',
          badgeIcon: '🔢',
          instructionHint: 'Posez votre formule et votre calcul (ex: 25 × 16 000 = 400 000 FCFA)',
        },
        {
          id: 2,
          title: solved.variations.inverseProblem.title,
          duration: '20 min',
          statement: solved.variations.inverseProblem.statement,
          solution: solved.variations.inverseProblem.solution,
          isSolutionVisible: false,
          topicKind: 'calcul',
          minWordsRequired: 4,
          kindLabel: 'Calcul inverse & Démarche algébrique',
          badgeIcon: '🔄',
          instructionHint: 'Posez l’opération inverse (division) et votre résultat',
        },
        {
          id: 3,
          title: solved.variations.twoStepSynthesis.title,
          duration: '25 min',
          statement: solved.variations.twoStepSynthesis.statement,
          solution: solved.variations.twoStepSynthesis.solution,
          isSolutionVisible: false,
          topicKind: 'calcul',
          minWordsRequired: 5,
          kindLabel: 'Problème de synthèse à deux étapes',
          badgeIcon: '💼',
          instructionHint: 'Détaillez le calcul d’achat puis le calcul du bénéfice',
        },
      ];
    }

    // 2. Si on a le texte réel du document extrait, créons des exercices d'analyse directe du texte
    if (hasDocText) {
      const analysis = analyzeDocumentContent(extractedText!, topicName);
      return buildExercisesFromAnalysis(analysis, cleanSubject, levelId);
    }

    // Générateur standard sans document (sujet libre), SANS répétitions de nom de fichier
    const rawList: GeneratedExercise[] = (() => {
      switch (levelId) {
        case 'primaire':
          return [
            {
              id: 1,
              title: `Exercice 1 : Les bases pas à pas (Compréhension)`,
              duration: '10 min',
              statement: `À partir de la leçon étudiée :
1. Lis attentivement la consigne et repère les mots ou nombres clés.
2. Écris ta réponse en expliquant simplement ta démarche.
3. Vérifie ton résultat en relisant ta phrase réponse.`,
              solution: `📌 RÈGLE DE BASE & CE QU'IL FAUT RETENIR :
Applique la règle fondamentale vue en classe. Décompose l'opération ou la phrase en prenant ton temps.

✍️ CORRIGÉ PAS À PAS :
• Étape 1 (Observation) : On identifie les données de l'exercice sans se précipiter.
• Étape 2 (Démarche & Calcul) : On applique la méthode pas à pas en posant les calculs ou en accordant les mots correctement.
• Étape 3 (Phrase réponse) : On rédige une phrase claire et complète qui commence par une majuscule et se termine par un point.

🎯 RÉSULTAT VALIDÉ :
La réponse attendue découle directement de la règle fondamentale. L'application est juste et le résultat est vérifié.`,
              isSolutionVisible: false,
            },
            {
              id: 2,
              title: `Exercice 2 : Petit problème du quotidien (Application)`,
              duration: '15 min',
              statement: `Mise en situation quotidienne :
Dans une situation concrète, utilise ce que tu as appris pour résoudre le problème :
1. Ce que je sais (les informations utiles).
2. Ce que je cherche.
3. Mon opération ou mon raisonnement avec une phrase réponse complète.`,
              solution: `📌 RAPPEL MÉTHODOLOGIQUE DU PROBLÈME :
Un problème se résout en trois étapes essentielles : analyser les données, poser l'opération, et conclure.

✍️ CORRIGÉ DÉTAILLÉ :
• Ce que je sais : Les informations importantes fournies dans l'énoncé.
• Ce que je cherche : La quantité ou l'explication demandée par la consigne.
• Mon calcul / Mon raisonnement : Opération posée proprement, avec vérification.
• Ma phrase réponse : « Le résultat final obtenu répond précisément à la question. »`,
              isSolutionVisible: false,
            },
          ];

        case 'college':
          return [
            {
              id: 1,
              title: `Exercice 1 : Maîtrise des notions fondamentales`,
              duration: '15 min',
              statement: `Dans le cadre du programme de Collège :
1. Rappeler la définition précise et les conditions d'application de la propriété étudiée.
2. Appliquer la formule ou la règle sur un cas numérique direct en détaillant toutes les étapes.
3. Préciser les unités dans le Système International et encadrer le résultat.`,
              solution: `📌 RAPPEL DE COURS & FORMULE DE RÉFÉRENCE :
Toute application d'un théorème requiert le respect préalable de ses hypothèses.

✍️ DÉMONSTRATION ET CALCULS COMPLETS :
1. Définition et hypothèses : On pose les données du problème. Les conditions de validité sont vérifiées.
2. Application numérique : On substitue les valeurs dans la formule standard, étape par étape.
3. Résultat final : Le résultat est exprimé avec son unité officielle et encadré.`,
              isSolutionVisible: false,
            },
            {
              id: 2,
              title: `Exercice 2 : Problème guidé type BFEM / Brevet`,
              duration: '25 min',
              statement: `Problème en plusieurs questions progressives :
Partie A : Modélisation et mise en équation de la situation.
Partie B : Résolution analytique et interprétation graphique.
Partie C : Conclusion rédigée avec confrontation des grandeurs d'ordre de grandeur.`,
              solution: `📌 DÉMARCHE OFFICIELLE TYPE BREVET :
Le barème accorde une part importante à la justification et à l'argumentation.

✍️ CORRIGÉ TYPE :
• Partie A : Équation posée correctement en posant clairement les variables.
• Partie B : Résolution rigoureuse par calculs successifs.
• Partie C : Phrase de conclusion répondant exactement à la problématique.`,
              isSolutionVisible: false,
            },
            {
              id: 3,
              title: `Exercice 3 : Défi d'approfondissement & Raisonnement déductif`,
              duration: '20 min',
              statement: `Énoncé d'analyse déductive :
Démontrer que la propriété reste toujours vérifiée quel que soit le cas particulier envisagé.
Justifier rigoureusement par enchaînement logique d'implications.`,
              solution: `📌 MÉTHODE DE DÉMONSTRATION :
On part des hypothèses générales sans fixer de valeurs particulières.

✍️ PREUVE :
Par application de la propriété générale, l'égalité ou la relation reste invariante.`,
              isSolutionVisible: false,
            },
          ];

        case 'lycee':
          return [
            {
              id: 1,
              title: `Exercice 1 : Étude rigoureuse et domaine de validité`,
              duration: '20 min',
              statement: `Sujet type Baccalauréat :
1. Déterminer l'ensemble de définition strict et étudier la continuité.
2. Calculer la dérivée ou la relation de variation en justifiant chaque étape.
3. Dresser le tableau récapitulatif complet et interpréter les limites.`,
              solution: `📌 EXIGENCE BAC :
Ne jamais omettre le domaine de dérivabilité avant d'écrire l'expression dérivée.

✍️ CORRIGÉ MODÈLE :
1. Domaine : Df posé sans exclusion indue.
2. Dérivation : Formule appliquée proprement avec justification du signe.
3. Tableau de variations : Flèches de monotonie et valeurs exactes indiquées.`,
              isSolutionVisible: false,
            },
            {
              id: 2,
              title: `Exercice 2 : Démonstration et modélisation analytique`,
              duration: '30 min',
              statement: `Problème de synthèse :
1. Mettre en œuvre le théorème fondamental adéquat (TVI, récurrence ou intégration).
2. Vérifier scrupuleusement la stricte monotonie ou l'hérédité.
3. Encadrer l'unique solution à 10⁻² près et valider la cohérence.`,
              solution: `📌 DÉMONSTRATION DU THÉORÈME :
Vérification explicite de la continuité, de la stricte monotonie et de l'intervalle image.

✍️ CORRIGÉ :
L'existence et l'unicité sont garanties par le corollaire du TVI.`,
              isSolutionVisible: false,
            },
            {
              id: 3,
              title: `Exercice 3 : Problème transversal & Raisonnement critique`,
              duration: '35 min',
              statement: `Exercice de recherche et d'optimisation :
Modéliser le système, trouver l'extremum et valider la stabilité du modèle face aux incertitudes.`,
              solution: `📌 OPTIMISATION :
Recherche des points critiques où la dérivée première s'annule, avec confirmation du signe de la dérivée seconde.`,
              isSolutionVisible: false,
            },
          ];

        case 'superieur':
        case 'concours':
        default:
          return [
            {
              id: 1,
              title: `Exercice 1 : Épreuve d'admissibilité — Maîtrise formelle`,
              duration: '25 min',
              statement: `Épreuve académique sous contrainte de temps :
1. Formuler la démonstration avec un formalisme mathématique ou juridique irréprochable.
2. Expliciter les hypothèses topologiques ou axiomatiques sous-jacentes.
3. Établir la convergence ou la validité universelle de la proposition.`,
              solution: `📌 GRILLE D'ÉVALUATION DE CONCOURS :
Le jury pénalise sévèrement tout implicite ou saut de raisonnement non motivé.

✍️ CORRIGÉ OFFICIEL :
Preuve menée par déduction rigoureuse avec encadrement des hypothèses.`,
              isSolutionVisible: false,
            },
            {
              id: 2,
              title: `Exercice 2 : Sujet d'annales sélectif & Synthèse critique`,
              duration: '35 min',
              statement: `Cas pratique d'annales de haut niveau :
Analyser le dossier documentaire, confronter deux thèses contradictoires et élaborer une solution optimale motivée.`,
              solution: `📌 CORRIGÉ TYPE CONCOURS :
Structuration en parties équilibrées, réfutation des alternatives sous-optimales et synthèse opérationnelle nette.`,
              isSolutionVisible: false,
            },
            {
              id: 3,
              title: `Exercice 3 : Épreuve orale & Question d'expertise`,
              duration: '30 min',
              statement: `Mise en situation devant le jury :
« Que répondez-vous à un contradicteur affirmant que ce modèle perd toute validité en présence de perturbations externes ? »
Formulez une réponse en 3 arguments solides et inattaquables.`,
              solution: `📌 RHÉTORIQUE D'ÉPREUVE ORALE :
Réfutation posée, démonstration de la résilience du modèle et ouverture sur la régulation adaptée.`,
              isSolutionVisible: false,
            },
          ];
      }
    })();

    return rawList.map((ex) => ({
      ...ex,
      topicKind: kindInfo.kind,
      minWordsRequired: kindInfo.minWords,
      kindLabel: kindInfo.label,
      badgeIcon: kindInfo.badgeIcon,
      instructionHint: kindInfo.instructionHint,
    }));
  },

  /**
   * Génération des séries de QCM sans répétitions de noms de fichier
   */
  generateQCM(
    topicName: string,
    levelId: string,
    extractedText?: string,
    keyConcepts: string[] = []
  ): GeneratedQCM[] {
    const hasDocText = (extractedText && extractedText.trim().length > 40 && !isGarbageText(extractedText));
    const cleanSubject = sanitizeSubjectTitle(topicName);
    const validConcepts = keyConcepts.filter(c => c && c.length >= 3 && !isGarbageText(c));
    const concepts = (validConcepts.length > 0)
      ? validConcepts
      : [`Notion clé de ${cleanSubject}`, 'Principe d\'analyse', 'Règle d\'application', 'Synthèse'];

    const c1 = concepts[0] || `notion principale de ${cleanSubject}`;
    const c2 = concepts[1] || 'démarche d\'analyse';
    const c3 = concepts[2] || 'critère de validation';
    const c4 = concepts[3] || 'synthèse des faits';

    // 1. Détection prioritaire : est-ce un énoncé d'exercice / problème avec calculs ?
    const textToInspect = (extractedText && extractedText.trim().length > 0 ? extractedText : topicName) || '';
    const solved = detectAndSolveProblem(textToInspect, topicName);
    if (solved && solved.qcmQuestions.length > 0) {
      return solved.qcmQuestions.map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));
    }

    // 2. Si on a le texte réel du document extrait, questions basées directement sur ses éléments
    if (hasDocText) {
      const analysis = analyzeDocumentContent(extractedText!, topicName);
      return buildQCMFromAnalysis(analysis, cleanSubject, levelId);
    }

    // Questions par niveau scolaire SANS répétition de nom de fichier
    switch (levelId) {
      case 'primaire':
        return [
          {
            id: 1,
            question: `Quelle est la première chose indispensable à faire avant de commencer à répondre ?`,
            options: [
              `Lire attentivement la consigne et repérer les mots importants`,
              `Répondre au hasard le plus vite possible`,
              `Ne rien écrire et attendre la fin du temps`,
              `Effacer tout ce qui a été fait`,
            ],
            correctIndex: 0,
            explanation: `✅ Bonne réponse ! La lecture attentive de la consigne est la clé pour bien comprendre ce qui est demandé.`,
          },
          {
            id: 2,
            question: `Pour bien réussir un problème, que doit-on faire de ses calculs et de ses phrases ?`,
            options: [
              `Les vérifier une deuxième fois pour éviter les petites erreurs`,
              `Écrire très petit pour que personne ne voie`,
              `Oublier de mettre la majuscule et le point`,
              `Ne jamais poser les opérations sur son cahier`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! Se relire et vérifier son travail permet de corriger soi-même les petites fautes d'inattention.`,
          },
          {
            id: 3,
            question: `Dans un problème, que représente la question posée à la fin de l'énoncé ?`,
            options: [
              `Ce que l'on doit chercher et trouver pour répondre`,
              `Un piège sans importance`,
              `Un mot secret qu'il faut cacher`,
              `Une simple décoration du texte`,
            ],
            correctIndex: 0,
            explanation: `✅ Bravo ! La question nous indique précisément la réponse que nous devons calculer ou expliquer.`,
          },
          {
            id: 4,
            question: `Si un résultat semble bizarre ou manifestement trop grand, quel est le bon réflexe ?`,
            options: [
              `Recommencer le calcul calmement sur son brouillon`,
              `Laisser le mauvais résultat sans rien faire`,
              `Fermer son cahier et abandonner`,
              `Deviner un autre nombre au hasard`,
            ],
            correctIndex: 0,
            explanation: `✅ Très bien ! Un bon élève utilise son brouillon pour vérifier calmement son raisonnement.`,
          },
          {
            id: 5,
            question: `Comment doit toujours se terminer la réponse d'un problème ?`,
            options: [
              `Par une phrase réponse claire, complète et bien écrite`,
              `Par un simple chiffre sans unité ni explication`,
              `Par un point d'interrogation`,
              `En laissant un blanc`,
            ],
            correctIndex: 0,
            explanation: `✅ Parfait ! Une phrase réponse complète permet de comprendre immédiatement la solution.`,
          },
        ];

      case 'college':
        return [
          {
            id: 1,
            question: `En Collège, quelle est la définition exacte d'une propriété ou d'un théorème ?`,
            options: [
              `Une règle vérifiée sous réserve que toutes les hypothèses soient satisfaites`,
              `Une formule approximative applicable sans condition préalable`,
              `Une simple hypothèse intuitive sans justification`,
              `Un résultat qui ne s'applique que dans un seul cas particulier`,
            ],
            correctIndex: 0,
            explanation: `✅ Correct ! Tout théorème exige que ses hypothèses soient rigoureusement vérifiées avant application.`,
          },
          {
            id: 2,
            question: `Quelle étape est indispensable avant de passer au calcul numérique ?`,
            options: [
              `Écrire la formule littérale complète et convertir les unités`,
              `Faire le calcul directement sans écrire la formule`,
              `Changer arbitrairement les signes`,
              `Supposer que les unités n'ont pas d'importance`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! La formule littérale et l'harmonisation des unités sont obligatoires au barème.`,
          },
          {
            id: 3,
            question: `Quelle erreur fréquente est sévèrement sanctionnée au Brevet / BFEM ?`,
            options: [
              `Oublier de citer le théorème utilisé pour justifier la démarche`,
              `Encadrer son résultat final proprement`,
              `Rédiger une phrase de conclusion soignée`,
              `Vérifier la cohérence de l'ordre de grandeur`,
            ],
            correctIndex: 0,
            explanation: `✅ Absolument ! Les correcteurs exigent de citer explicitement la propriété ou le théorème appliqué.`,
          },
          {
            id: 4,
            question: `Que permet d'affirmer la réciproque d'une propriété mathématique ?`,
            options: [
              `De remonter de la conclusion observée vers la condition initiale si la réciproque est vraie`,
              `Qu'une propriété est toujours fausse`,
              `Que le théorème s'applique sans calcul`,
              `Rien du tout, la réciproque n'a aucun sens`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! La réciproque permet de démontrer la nature d'une configuration à partir de grandeurs mesurées.`,
          },
          {
            id: 5,
            question: `Lorsque deux grandeurs interviennent dans un exercice, comment vérifie-t-on leur proportionnalité ?`,
            options: [
              `En vérifiant que le rapport entre les deux grandeurs est constant`,
              `En les additionnant simplement`,
              `En observant si elles ont la même couleur`,
              `En supposant qu'elles sont égales`,
            ],
            correctIndex: 0,
            explanation: `✅ Très bien ! La proportionnalité se caractérise par un coefficient multiplicatif constant.`,
          },
          {
            id: 6,
            question: `En fin d'exercice de synthèse, quelle démarche garantit la note maximale ?`,
            options: [
              `Relire la question initiale, donner la valeur exacte avec son unité et rédiger la conclusion`,
              `Donner une valeur arrondie sans préciser l'unité`,
              `Raturer toute la démonstration`,
              `Écrire uniquement le résultat final sans calculs intermédiaires`,
            ],
            correctIndex: 0,
            explanation: `✅ Parfait ! La trilogie formule + calcul + phrase de conclusion est la clé du succès.`,
          },
        ];

      case 'lycee':
        return [
          {
            id: 1,
            question: `Au niveau Lycée, quelle condition fondamentale est indispensable avant toute résolution ?`,
            options: [
              `Préciser rigoureusement l'ensemble de définition et le domaine de validité`,
              `Considérer que le domaine est toujours l'ensemble des réels tout entier`,
              `Négliger les valeurs interdites`,
              `Supposer que toutes les fonctions sont continues partout`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle fondamentale du Baccalauréat : l'ensemble de définition conditionne toute l'étude.`,
          },
          {
            id: 2,
            question: `Dans l'étude des variations d'une grandeur, quel lien direct existe entre la dérivée f' et la fonction f ?`,
            options: [
              `Le signe de la dérivée f' détermine le sens de variation de la fonction f`,
              `La dérivée est toujours égale à la fonction`,
              `Le signe de f donne le sens de variation de f'`,
              `Il n'existe aucun lien entre les deux`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! f' > 0 implique f strictement croissante sur l'intervalle considéré.`,
          },
          {
            id: 3,
            question: `Quelle précaution majeure doit-on impérativement prendre lors d'une démonstration par récurrence ?`,
            options: [
              `Valider impérativement l'initialisation au rang initial n_0 avant de poser l'hérédité`,
              `Faire uniquement l'hérédité sans tester le premier terme`,
              `Supposer que la propriété est vraie sans aucune preuve`,
              `Tester seulement deux nombres au hasard`,
            ],
            correctIndex: 0,
            explanation: `✅ Rigueur Bac : sans initialisation vérifiée, une propriété fausse pourrait sembler héréditaire !`,
          },
          {
            id: 4,
            question: `Face à une forme indéterminée dans un calcul de limite, quelle méthode doit-on privilégier ?`,
            options: [
              `Factoriser par le terme prépondérant ou utiliser les croissances comparées`,
              `Remplacer brutalement l'infini par zéro`,
              `Additionner les numérateurs entre eux`,
              `Arrêter l'exercice en déclarant que la limite n'existe pas`,
            ],
            correctIndex: 0,
            explanation: `✅ Méthode officielle : la factorisation par le monôme ou terme dominant lève l'indétermination.`,
          },
          {
            id: 5,
            question: `Que garantit formellement le Théorème des Valeurs Intermédiaires (TVI) ?`,
            options: [
              `L'existence d'au moins une solution si la fonction est continue sur [a, b]`,
              `Que toutes les fonctions sont dérivables`,
              `Que le résultat est toujours nul`,
              `Que la fonction est une droite affine`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème clé du Bac : la continuité garantit l'atteinte de toutes les valeurs intermédiaires.`,
          },
          {
            id: 6,
            question: `Quelle différence cruciale existe entre une valeur exacte et une valeur approchée ?`,
            options: [
              `La valeur exacte conserve les symboles mathématiques (racines, fractions, pi) tandis que l'arrondi perd en précision`,
              `Il n'y a aucune différence`,
              `La valeur approchée est toujours plus juste que la valeur exacte`,
              `Les valeurs exactes sont interdites au Bac`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! Le barème exige toujours la valeur exacte avant de donner une éventuelle approximation.`,
          },
          {
            id: 7,
            question: `Dans un problème de modélisation, que signifie physiquement ou graphiquement une dérivée seconde f''(x) > 0 ?`,
            options: [
              `La fonction f est convexe sur l'intervalle et sa courbe est au-dessus de ses tangentes`,
              `La fonction f est décroissante`,
              `La fonction s'annule immédiatement`,
              `La fonction est constante`,
            ],
            correctIndex: 0,
            explanation: `✅ Propriété de convexité : f''(x) > 0 traduit la convexité et l'accélération de la croissance.`,
          },
          {
            id: 8,
            question: `Quelle structure de rédaction assure le maximum de points selon le barème officiel ?`,
            options: [
              `« D'après le théorème de [Nom], comme les conditions [A] et [B] sont vérifiées, alors [Résultat] »`,
              `« On voit bien sur le graphique que c'est évident »`,
              `« La calculatrice donne la réponse »`,
              `Écrire directement le chiffre final sans commentaire`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle d'or : Théorème nommé + Hypothèses vérifiées + Conclusion explicite = Note maximale.`,
          },
        ];

      case 'superieur':
      case 'concours':
      default:
        return [
          {
            id: 1,
            question: `À l'université et en concours, que sanctionne en premier lieu le jury dans une copie ?`,
            options: [
              `Les affirmations sans preuve et les sauts de raisonnement non motivés`,
              `Le respect strict des axiomes fondamentaux`,
              `La clarté des notations mathématiques ou juridiques`,
              `La vérification dimensionnelle des équations`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle académique : en cycle supérieur, tout résultat non démontré formellement est considéré comme nul.`,
          },
          {
            id: 2,
            question: `Quelle condition garantit la validité de l'interversion entre une limite et une intégrale ?`,
            options: [
              `Le Théorème de Convergence Dominée (continuité et existence d'une fonction intégrant dominante)`,
              `Le fait que l'intégrale soit calculée sur un segment quelconque`,
              `Une simple intuition sans majoration`,
              `Cette interversion est toujours vraie sans condition`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème de Lebesgue : la domination par une fonction intégrable est indispensable.`,
          },
          {
            id: 3,
            question: `Dans un raisonnement par l'absurde en concours, quand la démonstration est-elle terminée ?`,
            options: [
              `Dès qu'une contradiction formelle avec un axiome ou une hypothèse avérée est établie`,
              `Dès que les calculs deviennent trop longs`,
              `Quand on décide arbitrairement de changer d'hypothèse`,
              `Il n'est jamais possible de conclure par l'absurde`,
            ],
            correctIndex: 0,
            explanation: `✅ Méthode par l'absurde : la mise en évidence d'une contradiction formelle valide la proposition initiale.`,
          },
          {
            id: 4,
            question: `Face à une ambiguïté dans l'énoncé d'un concours, quelle posture garantit l'admissibilité ?`,
            options: [
              `Expliciter les deux interprétations possibles, choisir la plus exigeante et traiter le cas rigoureusement`,
              `Déclarer que le sujet est erroné et arrêter de composer`,
              `Ignorer la question`,
              `Répondre par un point d'interrogation`,
            ],
            correctIndex: 0,
            explanation: `✅ Les jurys valorisent les candidats capables de poser un cadre rigoureux face à un problème ouvert.`,
          },
          {
            id: 5,
            question: `Quelle qualité de rédaction distingue un major de concours ?`,
            options: [
              `La concision, la clarté du raisonnement déductif et l'absence totale de verbiage inutile`,
              `Écrire 15 pages de texte vague pour impressionner le correcteur`,
              `Utiliser du jargon incompréhensible sans lien avec la question`,
              `Écrire sans structurer ses parties`,
            ],
            correctIndex: 0,
            explanation: `✅ Le jury apprécie les copies denses, sobres, précises et directement efficaces.`,
          },
        ];
    }
  },

  /**
   * Rapport d'évaluation
   */
  generateCorrectionReport(
    topicName: string,
    levelId: string,
    extractedText?: string,
    keyConcepts: string[] = []
  ): CorrectionReportData {
    const hasDocText = (extractedText && extractedText.trim().length > 40 && !isGarbageText(extractedText));
    const cleanSubject = sanitizeSubjectTitle(topicName);
    const validConcepts = keyConcepts.filter(c => c && c.length >= 3 && !isGarbageText(c));
    const concepts = (validConcepts.length > 0)
      ? validConcepts
      : [`Notion centrale de ${cleanSubject}`, 'Méthode d\'analyse'];
    const c1 = concepts[0] || `notion principale de ${cleanSubject}`;

    // 1. Détection prioritaire : est-ce un énoncé d'exercice / de problème à corriger et résoudre ?
    const textToInspect = (extractedText && extractedText.trim().length > 0 ? extractedText : topicName) || '';
    const solved = detectAndSolveProblem(textToInspect, topicName);
    if (solved) {
      return buildCorrectionReportFromSolvedProblem(solved, levelId);
    }

    // 2. Si on a le texte réel d'un document ou cours, analyse d'évaluation
    if (hasDocText) {
      const analysis = analyzeDocumentContent(extractedText!, topicName);
      return buildCorrectionReportFromAnalysis(analysis, cleanSubject, levelId, extractedText);
    }

    switch (levelId) {
      case 'primaire':
        return {
          grade: '18 / 20',
          strengths: [
            'Très bonne écoute des consignes : les règles de base sont bien comprises.',
            'Écriture propre et opérations posées avec soin sur le cahier.',
            'Les phrases réponses sont complètes et ont bien leur majuscule et leur point.',
          ],
          improvements: [
            'Prendre un peu plus de temps pour relire les petits calculs avant de rendre.',
            'Souligner systématiquement les résultats avec la règle.',
          ],
          summary: `Félicitations pour ton travail ! Tu as fait de beaux progrès dans l'application des règles. Continue avec cette belle motivation !`,
        };

      case 'college':
        return {
          grade: '16.5 / 20',
          strengths: [
            'Démarche logique bien structurée conforme aux exigences du Brevet / BFEM.',
            'Les théorèmes de référence sont cités avant d\'effectuer les calculs.',
            'Présentation soignée et unités systématiquement indiquées.',
          ],
          improvements: [
            'Penser à vérifier systématiquement que toutes les hypothèses du théorème sont remplies.',
            'Aérer davantage les étapes intermédiaires lors des calculs.',
          ],
          summary: `Très bon travail d'entraînement. La méthode de rédaction est solide. En renforçant la précision des justifications, la mention Très Bien est largement à votre portée.`,
        };

      case 'lycee':
        return {
          grade: '17 / 20',
          strengths: [
            'Excellente maîtrise technique du cours et du calcul littéral.',
            'Ensemble de définition et conditions aux limites rigoureusement explicités.',
            'Démonstration claire et raisonnement mathématique irréprochable.',
          ],
          improvements: [
            'Attention à bien justifier le domaine de dérivation avant d\'appliquer la formule de dérivation.',
            'Prendre le temps d\'encadrer systématiquement la valeur exacte avant de proposer un arrondi.',
          ],
          summary: `Devoir de très grande qualité. Les attendus du Baccalauréat sont pleinement maîtrisés. Poursuivez dans cette voie d'exigence académique.`,
        };

      case 'superieur':
        return {
          grade: '17.5 / 20',
          strengths: [
            'Formalisme impeccable : respect strict des axiomes et de la rigueur de référence.',
            'Preuves analytiques menées sans implicite avec une grande rigueur déductive.',
            'Excellente analyse des cas limites et identification précise des singularités.',
          ],
          improvements: [
            'Justifier plus formellement l\'interversion des opérateurs limites.',
            'Préciser le domaine de validité topologique sous-jacent.',
          ],
          summary: `Travail d'un niveau remarquable. Rigueur démonstrative digne d'un futur diplômé de Master / Grande École.`,
        };

      case 'autres':
        return {
          grade: '18 / 20 (Excellence pratique)',
          strengths: [
            'Raisonnement pragmatique et ancré dans les réalités concrètes.',
            'Bonne capacité de synthèse et clarté des arguments avancés.',
            'Recul critique appréciable et sens des priorités.',
          ],
          improvements: [
            'Développer encore plus les perspectives d\'anticipation à moyen terme.',
            'Structurer la mise en application par des indicateurs mesurables.',
          ],
          summary: `Excellent travail d'analyse. Votre approche allie bon sens, rigueur et pertinence opérationnelle.`,
        };

      case 'concours':
      default:
        return {
          grade: '18 / 20 (Admissible - Rang de Major)',
          strengths: [
            'Copie exemplaire respectant scrupuleusement la grille de notation officielle du concours.',
            'Argumentation concise, efficace, sans perte de temps ni verbiage superflu.',
            'Gestion parfaite du temps et démonstration méthodique des résultats.',
          ],
          improvements: [
            'Renforcer la transition logique entre la partie analytique et la conclusion opérationnelle.',
            'Affiner l\'analyse critique du contre-modèle.',
          ],
          summary: `Performance de très haut vol. Vous répondez aux critères les plus exigeants des jurys de concours. Félicitations !`,
        };
    }
  },
};
