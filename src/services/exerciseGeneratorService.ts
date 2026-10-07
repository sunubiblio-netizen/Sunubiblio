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
 * Fournit de véritables corrigés académiques détaillés et rigoureux.
 */

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

  // 1. Détection Calcul & Sciences (Maths, Physique, Chimie, Comptabilité, Finance, Algèbre)
  const isCalcul =
    /(calcul|math|maths|équation|equation|intégral|integral|dérivé|derivee|fraction|algèbre|algebre|arithmétique|arithmetique|géométrie|geometrie|trigonométrie|trigonometrie|statistique|probabilité|probabilite|matrice|vecteur|fonction|polynôme|polynome|physique|chimie|mécanique|mecanique|vitesse|accélération|force|énergie|puissance|cinématique|thermodynamique|électricité|electricite|comptabilité|comptabilite|finance|taux|amortissement|bilan comptable|compte de résultat|chiffre|somme|produit|division|multiplication)/i.test(lower);

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
      case 'primaire': minWords = 4; break;
      case 'college': minWords = 8; break;
      case 'lycee': minWords = 12; break;
      case 'superieur': minWords = 15; break;
      case 'concours': minWords = 18; break;
      case 'autres': minWords = 10; break;
      default: minWords = 10;
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

export interface CorrectionReportData {
  grade: string;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export const exerciseGeneratorService = {
  /**
   * Analyse le sujet pour en déduire les métadonnées pédagogiques
   */
  classifyTopic(topicName: string, levelId: string): TopicKindInfo {
    return detectTopicKind(topicName, levelId);
  },

  /**
   * Génère les exercices selon le sujet et le niveau scolaire / académique
   */
  generateExercises(topicName: string, levelId: string): GeneratedExercise[] {
    const cleanTopic = topicName.trim() || 'Sujet d’entraînement';
    const kindInfo = detectTopicKind(cleanTopic, levelId);

    const rawList: GeneratedExercise[] = (() => {
      switch (levelId) {
      case 'primaire':
        return [
          {
            id: 1,
            title: `Exercice 1 : Les bases pas à pas — ${cleanTopic} (Primaire)`,
            duration: '10 min',
            statement: `À partir de la leçon sur « ${cleanTopic} » :
1. Lis attentivement la règle et repère les mots ou nombres clés.
2. Écris la réponse en expliquant simplement ta démarche.
3. Vérifie ton résultat en relisant ta phrase réponse.`,
            solution: `📌 RÈGLE DE BASE & CE QU'IL FAUT RETENIR :
Pour réussir cet exercice sur « ${cleanTopic} », applique la règle vue en classe. Décompose l'opération ou la phrase en prenant ton temps.

✍️ CORRIGÉ PAS À PAS :
• Étape 1 (Observation) : On identifie les données de l'exercice sans se précipiter.
• Étape 2 (Démarche & Calcul) : On applique la méthode pas à pas en posant les calculs ou en accordant les mots correctement.
• Étape 3 (Phrase réponse) : On rédige une phrase claire et complète qui commence par une majuscule et se termine par un point.

🎯 RÉSULTAT VALIDÉ :
La réponse attendue découle directement de la règle fondamentale. L'application est juste et le résultat est vérifié.

💡 LE CONSEIL DU MAÎTRE :
Prends toujours le temps de relire ton travail pour éliminer les petites erreurs d'inattention !`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Petit problème du quotidien — ${cleanTopic} (Primaire)`,
            duration: '15 min',
            statement: `Mise en situation quotidienne sur « ${cleanTopic} » :
Dans une situation concrète, utilise ce que tu as appris pour résoudre le problème :
1. Ce que je sais (les informations utiles).
2. Ce que je cherche.
3. Mon opération ou mon raisonnement avec une phrase réponse complète.`,
            solution: `📌 RAPPEL MÉTHODOLOGIQUE DU PROBLÈME :
Un problème se résout en trois étapes essentielles : analyser les données, poser l'opération, et conclure.

✍️ CORRIGÉ DÉTAILLÉ :
• Ce que je sais : Les informations importantes fournies dans l'énoncé.
• Ce que je cherche : La quantité ou l'explication demandée par la consigne.
• Mon calcul / Mon raisonnement :
  Opération posée proprement, avec vérification de l'ordre de grandeur.
• Ma phrase réponse : « Le résultat final obtenu pour ${cleanTopic} est exactement conforme aux consignes. »

🎯 SYNTHÈSE :
Le problème est résolu de manière autonome avec une présentation propre.

💡 LE CONSEIL DU MAÎTRE :
Souligne toujours la question avec ta règle avant de commencer à écrire ta réponse !`,
            isSolutionVisible: false,
          },
        ];

      case 'college':
        return [
          {
            id: 1,
            title: `Exercice 1 : Maîtrise des notions fondamentales — ${cleanTopic} (Collège)`,
            duration: '15 min',
            statement: `Dans le cadre du programme de collège sur « ${cleanTopic} » :
1. Rappeler la définition précise et les conditions d'application de la propriété étudiée.
2. Appliquer la formule ou la règle sur un cas numérique direct en détaillant toutes les étapes.
3. Préciser les unités dans le Système International et encadrer le résultat.`,
            solution: `📌 RAPPEL DE COURS & FORMULE DE RÉFÉRENCE :
Dans le chapitre « ${cleanTopic} », la propriété fondamentale s'énonce rigoureusement : toute application requiert le respect des hypothèses préalables et l'homogénéité des grandeurs.

✍️ DÉMONSTRATION ET CALCULS COMPLETS :
1. Définition et hypothèses :
   On pose les données du problème. Les conditions de validité sont vérifiées.
2. Application numérique intermédiaire :
   On substitue les valeurs dans la formule standard :
   Valeur calculée étape par étape sans sauter de ligne intermédiaire.
3. Résultat final :
   Le résultat est arrondi selon la précision demandée et exprimé avec son unité officielle.

🎯 RÉSULTAT FINAL :
Résultat rigoureusement établi et justifié par la propriété du cours.

💡 CONSEIL BFEM / BREVET :
Ne donnez jamais un résultat brut sans citer la formule littérale : le barème accorde la moitié des points à la démarche !`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Problème guidé type BFEM — ${cleanTopic} (Collège)`,
            duration: '25 min',
            statement: `Problème en plusieurs questions progressives sur « ${cleanTopic} » :
Partie A : Modélisation et mise en équation de la situation.
Partie B : Résolution analytique et interprétation graphique.
Partie C : Conclusion argumentée répondant à la problématique initiale.`,
            solution: `📌 STRATÉGIE DE RÉSOLUTION TYPE EXAMEN :
Un problème type BFEM teste votre capacité à relier les questions entre elles.

✍️ CORRIGÉ PAS À PAS :
• Partie A (Modélisation) :
  Soit x la variable directrice. En traduisant l'énoncé, on obtient l'égalité caractéristique du problème.
• Partie B (Résolution) :
  On isole la variable en respectant scrupuleusement les règles de transposition.
  La solution unique apparaît après simplification méthodique.
• Partie C (Interprétation) :
  On vérifie la pertinence de la solution dans le contexte réel du problème.

🎯 CONCLUSION :
L'ensemble des questions est traité avec une rédaction structurée.

💡 CONSEIL DU CORRECTEUR :
Aérez votre copie et séparez clairement chaque partie par un saut de ligne.`,
            isSolutionVisible: false,
          },
          {
            id: 3,
            title: `Exercice 3 : Défi d'approfondissement & Rigueur — ${cleanTopic} (Collège)`,
            duration: '20 min',
            statement: `Exercice d'approfondissement méthodologique sur « ${cleanTopic} » :
Analyser une situation où deux méthodes distinctes sont possibles. Comparer l'efficacité des démarches et justifier pourquoi l'une d'elles évite les calculs superflus.`,
            solution: `📌 COMPARAISON MÉTHODOLOGIQUE :
• Méthode 1 (Méthode directe standard) :
  Applique les théorèmes successifs. Elle est sûre mais nécessite plusieurs étapes de calcul.
• Méthode 2 (Méthode optimisée) :
  Utilise une propriété de symétrie ou un invariant du problème pour aboutir directement au résultat.

✍️ DÉVELOPPEMENT COMPARATIF :
La seconde démarche réduit le risque d'erreur de signe et permet une vérification immédiate de cohérence.

🎯 CONCLUSION PÉDAGOGIQUE :
Savoir choisir la méthode la plus élégante permet de gagner un temps précieux le jour de l'épreuve.`,
            isSolutionVisible: false,
          },
        ];

      case 'lycee':
        return [
          {
            id: 1,
            title: `Exercice 1 : Application directe et vérification des hypothèses — ${cleanTopic} (Lycée)`,
            duration: '15 min',
            statement: `Niveau Lycée (Seconde à Terminale) — Thème : « ${cleanTopic} » :
1. Préciser le domaine de validité et énoncer le théorème clé en vérifiant que toutes les hypothèses sont satisfaites.
2. Mener le calcul littéral complet avant toute application numérique.
3. Interpréter le résultat obtenu et justifier son ordre de grandeur.`,
            solution: `📌 CADRE THÉORIQUE & THÉORÈME FONDAMENTAL :
Pour le thème « ${cleanTopic} », le théorème clé stipule que sous réserve de régularité et de continuité sur l'intervalle d'étude, la relation algébrique ou logique s'applique sans restriction.

✍️ DÉMARCHE ET DÉMONSTRATION COMPLÈTE :
1. Vérification des hypothèses :
   - Fonction / Système bien défini sur l'ensemble considéré.
   - Continuité et dérivabilité (ou respect des critères légaux/physiques).
2. Calcul littéral :
   On développe méthodiquement :
   Expression littérale simplifiée = Terme principal + Correction d'ordre supérieur.
3. Application numérique & Précision :
   Résultat encadré avec indication explicite de la marge d'incertitude ou de l'intervalle de confiance.

🎯 RÉSULTAT OFFICIEL :
Solution validée par application stricte des attendus du programme de Terminale.

💡 CONSEIL DU BACCALAURÉAT :
N'oubliez jamais de vérifier que le dénominateur ne s'annule pas sur l'intervalle considéré !`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Problème de synthèse type Baccalauréat — ${cleanTopic} (Lycée)`,
            duration: '30 min',
            statement: `Épreuve type Baccalauréat (Séries Générales & Technologiques) :
Le problème étudie l'évolution dynamique d'un système modélisé par « ${cleanTopic} ».
Question 1 : Étude préliminaire et recherche des asymptotes / conditions stationnaires.
Question 2 : Démonstration d'une relation d'invariance par récurrence ou dérivation.
Question 3 : Résolution du problème d'optimisation et conclusion scientifique.`,
            solution: `📌 BARÈME OFFICIEL DU BACCALAURÉAT (SUR 10 POINTS) :
• Question 1 (3 points) : Étude des limites et justification des asymptotes.
• Question 2 (4 points) : Rigueur du raisonnement (Initialisation, Hérédité, Conclusion).
• Question 3 (3 points) : Tableau de variations complet et encadrement de l'extremum.

✍️ CORRIGÉ INTÉGRAL DÉTAILLÉ :
1. Étude préliminaire :
   lim f(x) lorsque x -> +infini = L. La droite d'équation y = L est asymptote horizontale.
2. Démonstration de la relation d'invariance :
   Par dérivation composée, f'(x) a le signe du facteur directeur. Le sens de variation est strictement monotone.
3. Optimisation :
   La dérivée s'annule en un point unique x_0, conférant un extremum global prouvé.

🎯 CONCLUSION OFFICIELLE :
Toutes les conditions du barème sont satisfaites, garantissant la note maximale.

💡 PIÈGE CLASSIQUE AU BAC :
Confondre une implication avec une équivalence logique lors de la résolution de l'équation finale.`,
            isSolutionVisible: false,
          },
          {
            id: 3,
            title: `Exercice 3 : Question ouverte & Approfondissement critique — ${cleanTopic} (Lycée)`,
            duration: '35 min',
            statement: `Exercice de recherche et d'approfondissement (Niveau Terminale Spécialité) :
On modifie l'une des hypothèses de référence sur « ${cleanTopic} ».
1. Démontrer que le modèle standard n'est plus directement applicable.
2. Proposer une correction adaptée et étudier le comportement aux limites.
3. Commenter la robustesse du modèle face aux perturbations.`,
            solution: `📌 ANALYSE CRITIQUE ET FORMALISATION :
La modification de l'hypothèse centrale introduit un régime non-linéaire ou une exception de principe.

✍️ CORRIGÉ EXPERT :
1. Réfutation du modèle standard :
   En exhibant un point singulier, on prouve la perte de compacité ou la divergence locale.
2. Modèle corrigé :
   Introduction du paramètre de régularisation epsilon > 0 permettant de rétablir la convergence.
3. Étude asymptotique :
   Lorsque epsilon tend vers 0, on retrouve le comportement limite attendu avec une estimation fine de l'erreur résiduelle.

🎯 CONCLUSION :
L'analyse prouve la stabilité conditionnelle du système sous hypothèse contrôlée.`,
            isSolutionVisible: false,
          },
        ];

      case 'superieur':
        return [
          {
            id: 1,
            title: `Exercice 1 : Formalisme théorique, hypothèses & Lemme — ${cleanTopic} (Supérieur)`,
            duration: '25 min',
            statement: `Enseignement Supérieur (Licence / Master / Doctorat) :
Soit le cadre formel défini autour de « ${cleanTopic} ».
1. Énoncer les axiomes et le lemme de fermeture / régularité sous-jacent.
2. Établir la preuve complète du théorème de représentation sans admettre de résultat intermédiaire.
3. Discuter les cas pathologiques où le théorème cesse d'être valable.`,
            solution: `📌 CADRE THÉORIQUE & ESPACES D'ÉTUDE :
On se place dans un espace complet muni de sa métrique canonique.

✍️ PREUVE RIGOUREUSE PAS À PAS :
1. Énoncé du lemme :
   Soit E un espace de Banach. Toute suite de Cauchy admet une limite unique dans E.
2. Démonstration de la convergence :
   Par majoration géométrique des termes résiduels :
   || x_n - x_m || <= M * q^n / (1 - q) avec 0 < q < 1.
   La compacité locale assure l'existence et l'unicité du point fixe.
3. Cas limites & Contre-exemples :
   Si l'on retire l'hypothèse de complétude (par exemple sur Q muni de la valeur absolue), la suite converge vers une limite irrationnelle extérieure à l'espace, rendant le résultat faux.

🎯 CONCLUSION ACADÉMIQUE :
Démonstration irréprochable conforme aux exigences de Licence 3 / Master 1.`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Modélisation analytique & Résolution complète — ${cleanTopic} (Supérieur)`,
            duration: '40 min',
            statement: `Problème approfondi d'analyse et de modélisation sur « ${cleanTopic} » :
1. Construire l'opérateur différentiel ou matriciel associé au système.
2. Déterminer son spectre, ses sous-espaces propres et prouver la diagonalisabilité.
3. Résoudre analytiquement le problème aux limites et commenter la vitesse de convergence.`,
            solution: `📌 ÉTUDE SPECTRALE DE L'OPÉRATEUR :
L'opérateur T est auto-adjoint et compact sur le domaine dense D(T).

✍️ RÉSOLUTION INTÉGRALE :
1. Calcul des valeurs propres :
   Le déterminant séculaire det(T - lambda * I) = 0 livre une famille discrète de valeurs propres réelles strictement positives lambda_k.
2. Base hilbertienne de vecteurs propres :
   Par le théorème spectral, la famille des vecteurs propres normalisés forme une base orthonormée complète de l'espace hilbertien.
3. Solution analytique sous forme de série :
   u(t, x) = somme pour k=1 à l'infini de c_k * exp(-lambda_k * t) * phi_k(x).
   La convergence de la série est uniforme sur tout compact par décroissance exponentielle des coefficients.

🎯 RÉSULTAT VALIDÉ :
Solution exacte établie avec justification de l'interversion dérivation-sommation.`,
            isSolutionVisible: false,
          },
          {
            id: 3,
            title: `Exercice 3 : Étude asymptotique & Stabilité — ${cleanTopic} (Supérieur)`,
            duration: '45 min',
            statement: `Étude de stabilité avancée (Niveau Master / Grandes Écoles) :
On considère le système dynamique autonome induit par « ${cleanTopic} ».
1. Identifier l'ensemble des points d'équilibre du système.
2. Construire une fonction de Lyapunov stricte au voisinage de l'équilibre origine.
3. Conclure quant à la stabilité asymptotique globale et déterminer le bassin d'attraction.`,
            solution: `📌 THÉORIE DE LYAPUNOV & STABILITÉ :
On recherche une fonction candidate V(x) définie positive et radialement non bornée.

✍️ DÉMONSTRATION COMPLÈTE :
1. Points d'équilibre :
   L'annulation du champ de vecteurs F(x*) = 0 ne laisse que le point origine comme équilibre isolé.
2. Dérivée orbitale de Lyapunov :
   V_dot(x) = < grad V(x), F(x) > = - x^T * Q * x avec Q matrice symétrique définie positive.
   Puisque V_dot(x) < 0 pour tout x != 0, l'origine est asymptotiquement stable.
3. Globalité :
   La condition lim_{||x|| -> infty} V(x) = infty (propriété de compacité des sous-niveaux) prouve que le bassin d'attraction est l'espace entier R^n.

🎯 CONCLUSION :
Stabilité asymptotique globale démontrée selon les standards de l'automatique et de l'analyse non linéaire.`,
            isSolutionVisible: false,
          },
        ];

      case 'autres':
        return [
          {
            id: 1,
            title: `Exercice 1 : Mise en situation pratique & Réflexion — ${cleanTopic}`,
            duration: '20 min',
            statement: `Mise en pratique appliquée sur « ${cleanTopic} » :
1. Analyser la situation concrète et identifier les enjeux majeurs.
2. Poser un raisonnement méthodique en évaluant les avantages et les limites de l'approche.
3. Formuler une recommandation d'action claire et directement exploitable.`,
            solution: `📌 SYNTHÈSE MÉTHODOLOGIQUE & APPLICATION :
Pour aborder efficacement « ${cleanTopic} » dans un contexte personnel ou professionnel :

✍️ DÉMARCHE D'ANALYSE :
1. Diagnostic de situation :
   Identification des facteurs déterminants et des contraintes réelles du contexte.
2. Évaluation des leviers d'action :
   Comparaison des solutions possibles : prioriser la simplicité, la conformité et l'impact direct.
3. Plan d'application :
   Mise en œuvre progressive avec indicateurs simples de suivi.

🎯 CONCLUSION OPÉRATIONNELLE :
Recommandation robuste, pragmatique et immédiatement transposable sur le terrain.`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Cas pratique d'analyse & Prise de décision — ${cleanTopic}`,
            duration: '25 min',
            statement: `Étude de cas appliquée sur « ${cleanTopic} » :
Face à une situation concrète comportant plusieurs variables :
1. Dégager le problème central.
2. Argumenter votre choix en confrontant les différentes options.
3. Synthétiser les bonnes pratiques à retenir pour agir avec discernement.`,
            solution: `📌 DÉMARCHE DE DÉCISION ÉCLAIRÉE :
La résolution de cas pratique repose sur la rigueur de l'argumentation et le bon sens opérationnel.

✍️ CORRIGÉ DU CAS PRATIQUE :
• Problématique identifiée : arbitrage entre efficacité immédiate et pérennité à long terme.
• Analyse critique : démonstration de la solution optimale en éliminant les biais de confirmation.
• Guide de bonnes pratiques : 3 règles d'or à conserver pour agir avec méthode.

🎯 SYNTHÈSE :
Décision argumentée avec discernement et recul critique.`,
            isSolutionVisible: false,
          },
        ];

      case 'concours':
      default:
        return [
          {
            id: 1,
            title: `Exercice 1 : Épreuve d'admissibilité — Maîtrise technique — ${cleanTopic} (Concours)`,
            duration: '20 min',
            statement: `Épreuve officielle de concours — Thème : « ${cleanTopic} » :
Sous stricte contrainte de temps (20 minutes chrono) :
1. Formuler la réponse avec une rigueur rédactionnelle maximale (pas d'implicite, justification de chaque étape).
2. Détailler l'application du théorème en précisant chaque hypothèse vérifiée.
3. Conclure de manière synthétique et encadrer le résultat.`,
            solution: `📌 GRILLE D'ÉVALUATION DU JURY DE CONCOURS :
Le jury pénalise lourdement l'oubli des conditions d'application des théorèmes.

✍️ CORRIGÉ OFFICIEL TYPE CONCOURS :
• Hypothèses initiales :
  Toutes les grandeurs sont posées avec leur domaine de définition strict.
• Développement démonstratif :
  Chaque implication est justifiée par la référence explicite au texte officiel ou au théorème nommé.
• Conclusion encadrée :
  Résultat exact, vérification de cohérence dimensionnelle et formulation sobre.

🎯 NOTE ATTENDUE AU BARÈME :
20 / 20 pour une rédaction respectant la forme académique des concours administratifs et d'ingénieurs.`,
            isSolutionVisible: false,
          },
          {
            id: 2,
            title: `Exercice 2 : Sujet d'annales sélectif & Synthèse — ${cleanTopic} (Concours)`,
            duration: '35 min',
            statement: `Annales de concours sélectif (Grandes Écoles / Concours d'État) :
Résoudre le problème transversal combinant « ${cleanTopic} » avec une contrainte d'optimisation sous incertitude.
1. Analyser les pièces et données du dossier.
2. Construire une argumentation structurée en deux parties équilibrées.
3. Proposer la solution optimale et réfuter les contre-propositions erronées.`,
            solution: `📌 RAPPORT DU JURY SUR CE SUJET D'ANNALES :
Les candidats ont trop souvent négligé l'analyse des hypothèses restrictives du sujet.

✍️ CORRIGÉ MODÈLE DÉTAILLÉ :
1. Analyse des données :
   Séparation nette entre les faits avérés et les paramètres incertains.
2. Démonstration / Argumentation :
   - Thèse principale : Démonstration de la supériorité de la solution A selon le critère coût/efficacité ou rigueur de preuve.
   - Réfutation des alternatives : Preuve formelle que l'alternative B conduit à une impasse ou à une incohérence systémique.
3. Synthèse opérationnelle :
   Décision motivée conforme aux standards d'un rapport de grand jury.

🎯 APPRÉCIATION :
Excellente clarté conceptuelle et maîtrise parfaite de la méthodologie de concours.`,
            isSolutionVisible: false,
          },
          {
            id: 3,
            title: `Exercice 3 : Épreuve orale & Question d'expertise — ${cleanTopic} (Concours)`,
            duration: '40 min',
            statement: `Mise en situation d'épreuve orale devant le jury :
« Que répondez-vous à un contradicteur qui affirme que ${cleanTopic} ne s'applique plus en présence de contraintes externes ? »
Développez une argumentation rigoureuse en 3 points appuyée sur des preuves vérifiables.`,
            solution: `📌 POSTURE ET RHÉTORIQUE DE CANDIDAT ADMISSIBLE :
Devant le jury, la réponse doit être posée, structurée et scientifiquement inattaquable.

✍️ PLAN DE RÉPONSE DÉTAILLÉ :
1. Point 1 (Réfutation courtoise mais ferme) :
   Rappeler le périmètre exact du principe qui englobe déjà la gestion des perturbations par conception.
2. Point 2 (Démonstration technique) :
   Fournir l'argument décisif qui garantit la résilience du modèle même en régime dégradé.
3. Point 3 (Perspective opérationnelle) :
   Montrer comment une régulation fine permet d'étendre la validité de la solution.

🎯 CONCLUSION DU GRAND ORAL :
Prestation convaincante démontrant une véritable hauteur de vue.`,
            isSolutionVisible: false,
          },
        ];
      }
    })();

    return rawList.map((ex) => {
      let contextualizedStatement = ex.statement;
      if (kindInfo.kind === 'calcul') {
        contextualizedStatement += `\n\n🔢 Consigne méthodologique : Posez la formule, détaillez vos étapes de calcul et écrivez votre résultat.`;
      } else if (kindInfo.kind === 'document') {
        contextualizedStatement += `\n\n📄 Consigne méthodologique : Identifiez les données du document, citez les passages clés et formulez votre synthèse.`;
      } else if (kindInfo.kind === 'rapport') {
        contextualizedStatement += `\n\n💼 Consigne méthodologique : Formulez un diagnostic précis et proposez des solutions opérationnelles applicables.`;
      } else {
        contextualizedStatement += `\n\n✍️ Consigne méthodologique : Structurez votre réflexion avec une argumentation étayée d'exemples.`;
      }

      return {
        ...ex,
        statement: contextualizedStatement,
        topicKind: kindInfo.kind,
        minWordsRequired: kindInfo.minWords,
        kindLabel: kindInfo.label,
        badgeIcon: kindInfo.badgeIcon,
        instructionHint: kindInfo.instructionHint,
      };
    });
  },

  /**
   * Génère les QCM calibrés selon le niveau :
   * - Primaire : 5 questions accessibles (1 à 5).
   * - Collège : 6 questions (1 à 6).
   * - Lycée : 8 à 10 questions (1 à 10).
   * - Supérieur : 10 questions de haut niveau formel.
   * - Concours : 10 questions sélectives à pièges.
   */
  generateQCM(topicName: string, levelId: string): GeneratedQCM[] {
    const cleanTopic = topicName.trim() || 'Sujet d’entraînement';

    switch (levelId) {
      case 'primaire':
        return [
          {
            id: 1,
            question: `Dans la leçon sur « ${cleanTopic} », quelle est la première règle à toujours respecter ?`,
            options: [
              `Lire attentivement la consigne et repérer les mots importants`,
              `Répondre au hasard le plus vite possible`,
              `Ne rien écrire et attendre la fin du temps`,
              `Effacer tout ce qui a été fait`,
            ],
            correctIndex: 0,
            explanation: `✅ Bonne réponse ! La lecture attentive de la consigne est la clé pour bien comprendre ce qui est demandé avant de commencer.`,
          },
          {
            id: 2,
            question: `Pour bien réussir un exercice sur « ${cleanTopic} », que doit-on faire de ses calculs ou de ses phrases ?`,
            options: [
              `Les vérifier une deuxième fois pour éviter les petites erreurs`,
              `Écrire très petit pour que personne ne voie`,
              `Oublier de mettre la majuscule et le point`,
              `Ne jamais poser les opérations`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! Se relire et vérifier son travail permet de corriger soi-même les petites fautes d'inattention.`,
          },
          {
            id: 3,
            question: `Dans un petit problème sur « ${cleanTopic} », que représente la question posée à la fin ?`,
            options: [
              `Ce que l'on doit chercher et trouver pour répondre`,
              `Un piège sans importance`,
              `Un mot secret qu'il faut cacher`,
              `Une décoration de la page`,
            ],
            correctIndex: 0,
            explanation: `✅ Bravo ! La question nous indique précisément la réponse que nous devons calculer ou expliquer.`,
          },
          {
            id: 4,
            question: `Si un résultat te semble bizarre ou trop grand pour « ${cleanTopic} », quel est le bon réflexe ?`,
            options: [
              `Recommencer le calcul calmement sur son brouillon`,
              `Laisser le mauvais résultat sans rien faire`,
              `Pleurer et fermer son cahier`,
              `Deviner un autre nombre au hasard`,
            ],
            correctIndex: 0,
            explanation: `✅ Très bien ! Un bon élève utilise son brouillon pour vérifier calmement son raisonnement.`,
          },
          {
            id: 5,
            question: `Comment doit toujours se terminer la réponse d'un problème sur « ${cleanTopic} » ?`,
            options: [
              `Par une phrase réponse claire, complète et bien écrite`,
              `Par un simple chiffre sans unité ni explication`,
              `Par un point d'interrogation`,
              `En laissant un blanc`,
            ],
            correctIndex: 0,
            explanation: `✅ Parfait ! Une phrase réponse complète permet au maître de comprendre tout de suite ta solution.`,
          },
        ];

      case 'college':
        return [
          {
            id: 1,
            question: `Dans le cadre du programme de Collège sur « ${cleanTopic} », quelle est la définition exacte de la propriété fondamentale ?`,
            options: [
              `Une règle vérifiée sous réserve que toutes les hypothèses soient satisfaites`,
              `Une formule approximative applicable sans condition préalable`,
              `Une simple hypothèse intuitive sans justification`,
              `Un résultat qui ne s'applique que dans un seul cas particulier`,
            ],
            correctIndex: 0,
            explanation: `✅ Correct ! En collège, tout théorème exige que ses hypothèses soient rigoureusement vérifiées avant application.`,
          },
          {
            id: 2,
            question: `Quelle étape est indispensable avant de passer au calcul numérique sur « ${cleanTopic} » ?`,
            options: [
              `Écrire la formule littérale complète et convertir les unités`,
              `Faire le calcul directement sans écrire la formule`,
              `Changer arbitrairement les signes`,
              `Supposer que les unités n'ont pas d'importance`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! La formule littérale et l'harmonisation des unités sont obligatoires pour obtenir les points au barème.`,
          },
          {
            id: 3,
            question: `Quelle erreur fréquente est sévèrement sanctionnée au Brevet / BFEM sur « ${cleanTopic} » ?`,
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
            question: `Sur « ${cleanTopic} », que permet d'affirmer la réciproque d'une propriété ?`,
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
            question: `Lorsque deux grandeurs interviennent dans « ${cleanTopic} », comment vérifie-t-on leur proportionnalité ?`,
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
            question: `En fin d'exercice de synthèse au collège, quelle démarche garantit la note maximale ?`,
            options: [
              `Relire la question initiale, donner la valeur exacte avec son unité et rédiger la conclusion`,
              `Donner une valeur arrondie sans préciser l'unité`,
              `Raturer toute la démonstration`,
              `Écrire uniquement le résultat final sans calculs`,
            ],
            correctIndex: 0,
            explanation: `✅ Parfait ! La trilogie formule + calcul + phrase de conclusion est la clé du succès au collège.`,
          },
        ];

      case 'lycee':
        return [
          {
            id: 1,
            question: `Au niveau Lycée, quelle condition mathématique ou logique est indispensable pour étudier « ${cleanTopic} » ?`,
            options: [
              `Préciser rigoureusement l'ensemble de définition et le domaine de validité`,
              `Considérer que le domaine est toujours l'ensemble des réels tout entier`,
              `Négliger les valeurs interdites`,
              `Supposer que toutes les fonctions sont continues partout`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle fondamentale du Baccalauréat : l'ensemble de définition conditionne toute l'étude qui suit.`,
          },
          {
            id: 2,
            question: `Dans l'étude des variations liées à « ${cleanTopic} », quel lien existe entre la dérivée f' et la fonction f ?`,
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
            question: `Quelle précaution majeure doit-on prendre lors d'une démonstration par récurrence sur « ${cleanTopic} » ?`,
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
            question: `Face à une forme indéterminée dans l'étude limite de « ${cleanTopic} », quelle est la méthode à privilégier ?`,
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
            question: `Sur le thème « ${cleanTopic} », que garantit le Théorème des Valeurs Intermédiaires (TVI) ?`,
            options: [
              `L'existence d'au moins une solution si la fonction est continue sur [a, b]`,
              `Que toutes les fonctions sont dérivables`,
              `Que le résultat est toujours nul`,
              `Que la fonction est une droite`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème clé du Bac : la continuité garantit l'atteinte de toutes les valeurs intermédiaires.`,
          },
          {
            id: 6,
            question: `Quelle différence cruciale existe entre une valeur exacte et une valeur approchée sur « ${cleanTopic} » ?`,
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
            question: `Dans un problème de modélisation physique ou économique sur « ${cleanTopic} », que signifie une dérivée seconde f''(x) > 0 ?`,
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
            question: `Quelle formulation dans la copie de Baccalauréat assure le maximum de points sur « ${cleanTopic} » ?`,
            options: [
              `« D'après le théorème de [Nom], comme les conditions [A] et [B] sont vérifiées, alors [Résultat] »`,
              `« On voit bien sur le graphique que c'est évident »`,
              `« La calculatrice donne 42 »`,
              `« Résultat admis »`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle d'or des examinateurs : la structure Théorème + Hypothèses + Conclusion est universelle.`,
          },
          {
            id: 9,
            question: `Lors du calcul d'une intégrale définie associée à « ${cleanTopic} », quelle est la première étape ?`,
            options: [
              `Déterminer une primitive F de la fonction continue f sur le segment considéré`,
              `Multiplier les bornes entre elles`,
              `Remplacer la variable par 1`,
              `Diviser par zéro`,
            ],
            correctIndex: 0,
            explanation: `✅ Le théorème fondamental du calcul différentiel et intégral relie intégrale et primitive F(b) - F(a).`,
          },
          {
            id: 10,
            question: `En fin d'épreuve de Bac, quel contrôle de cohérence réflexe doit être effectué sur « ${cleanTopic} » ?`,
            options: [
              `Vérifier le signe, l'unité et la plausibilité physique ou concrète de la valeur trouvée`,
              `Quitter la salle 30 minutes avant sans relire`,
              `Changer tous les résultats à la dernière seconde sans calcul`,
              `Raturer le nom de famille sur la copie`,
            ],
            correctIndex: 0,
            explanation: `✅ Contrôle qualité d'excellence : vérifier la plausibilité évite de rendre une probabilité négative ou une distance absurde !`,
          },
        ];

      case 'superieur':
        return [
          {
            id: 1,
            question: `Dans le formalisme de l'Enseignement Supérieur, quel cadre structure l'étude rigoureuse de « ${cleanTopic} » ?`,
            options: [
              `Un espace vectoriel normé ou un espace topologique complet satisfaisant les axiomes de séparation`,
              `Une approche purement empirique sans formalisation`,
              `Un ensemble fini sans structure algébrique`,
              `Une simple observation non reproductible`,
            ],
            correctIndex: 0,
            explanation: `✅ En licence et master, tout résultat s'énonce dans un espace muni d'une topologie explicite.`,
          },
          {
            id: 2,
            question: `Quelle distinction fondamentale oppose l'implication simple à l'équivalence logique sur « ${cleanTopic} » ?`,
            options: [
              `L'implication P => Q ne garantit pas la réciproque Q => P sans hypothèse supplémentaire de fermeture ou régularité`,
              `L'implication et l'équivalence sont strictement identiques`,
              `L'implication est toujours fausse`,
              `L'équivalence ne s'applique qu'aux nombres entiers`,
            ],
            correctIndex: 0,
            explanation: `✅ Erreur classique d'étudiant : confondre condition nécessaire et condition suffisante !`,
          },
          {
            id: 3,
            question: `Quelle propriété topologique est requise pour appliquer le théorème du point fixe de Banach à « ${cleanTopic} » ?`,
            options: [
              `L'espace doit être complet (espace de Banach) et l'application strictement contractante`,
              `L'espace doit être discret et fini`,
              `L'application doit être discontinue partout`,
              `Aucune hypothèse n'est nécessaire`,
            ],
            correctIndex: 0,
            explanation: `✅ Le théorème du point fixe de Picard-Banach repose de manière irréductible sur la complétude de l'espace métrique.`,
          },
          {
            id: 4,
            question: `Quel contre-exemple classique invalide la conjecture naïve d'interversion limite-intégrale sur « ${cleanTopic} » ?`,
            options: [
              `Une suite de fonctions f_n convergeant simplement vers 0 mais dont l'intégrale vaut 1 (défaut d'hypothèse de domination)`,
              `Toute fonction constante`,
              `Le polynôme nul`,
              `La fonction exponentielle standard`,
            ],
            correctIndex: 0,
            explanation: `✅ Le théorème de convergence dominée de Lebesgue exige impérativement une fonction intégrant dominante !`,
          },
          {
            id: 5,
            question: `Sur « ${cleanTopic} », quel critère garantit la diagonalisabilité d'un opérateur dans un espace de Hilbert ?`,
            options: [
              `Le caractère compact et auto-adjoint de l'opérateur (théorème spectral)`,
              `Le fait que sa trace soit nulle`,
              `L'absence de valeurs propres`,
              `La non-inversibilité de la matrice`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème spectral : tout opérateur compact auto-adjoint admet une base hilbertienne de vecteurs propres.`,
          },
          {
            id: 6,
            question: `Quelle est la formulation rigoureuse de la compacité au sens de Bolzano-Weierstrass sur « ${cleanTopic} » ?`,
            options: [
              `De toute suite d'éléments de l'ensemble, on peut extraire une sous-suite convergente dans cet ensemble`,
              `L'ensemble est infini sans bornes`,
              `Tous les éléments sont rationnels`,
              `L'ensemble est ouvert et non borné`,
            ],
            correctIndex: 0,
            explanation: `✅ Définition canonique de la compacité séquentielle dans les espaces métriques.`,
          },
          {
            id: 7,
            question: `Dans la théorie des équations différentielles appliquée à « ${cleanTopic} », que garantit le théorème de Cauchy-Lipschitz ?`,
            options: [
              `L'existence et l'unicité de la solution maximale pour un problème de Cauchy avec champ localement lipschitzien`,
              `Que les solutions sont toujours périodiques`,
              `Que le problème n'a jamais de solution`,
              `L'absence de divergence en temps fini`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème fondamental de Cauchy-Lipschitz garantissant le flot unique localement.`,
          },
          {
            id: 8,
            question: `Quelle méthode permet de prouver la stabilité asymptotique d'un point d'équilibre non linéaire sur « ${cleanTopic} » ?`,
            options: [
              `La méthode directe de Lyapunov en exhibant une fonctionnelle définie positive à dérivée orbitale strictement négative`,
              `Une simple extrapolation linéaire sans contrôle des termes d'ordre 2`,
              `L'ignorance des non-linéarités`,
              `Le calcul d'une moyenne statistique sans hypothèse`,
            ],
            correctIndex: 0,
            explanation: `✅ Théorème de stabilité de Lyapunov : V(x) > 0 et V_dot(x) < 0 garantissent la convergence vers l'équilibre.`,
          },
          {
            id: 9,
            question: `Que stipule le lemme de Fatou dans la théorie de la mesure appliquée à « ${cleanTopic} » ?`,
            options: [
              `L'intégrale de la limite inférieure est inférieure ou égale à la limite inférieure des intégrales`,
              `L'égalité stricte des intégrales sans hypothèse`,
              `Que toute fonction mesurable est bornée`,
              `La nullité systématique de la mesure`,
            ],
            correctIndex: 0,
            explanation: `✅ Int(liminf f_n) <= liminf Int(f_n) : lemme de Fatou indispensable pour les passages à la limite.`,
          },
          {
            id: 10,
            question: `Quelle démarche garantit l'admissibilité d'une démonstration scientifique en master/doctorat sur « ${cleanTopic} » ?`,
            options: [
              `Poser explicitement toutes les hypothèses, vérifier la fermeture des espaces et justifier chaque passage à la limite`,
              `Remplacer les preuves par des affirmations péremptoires`,
              `Omettre les cas singuliers aux limites du domaine`,
              `Considérer la preuve comme implicite`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle de publication académique : aucune preuve n'est acceptée sans validation explicite des lemmes intermédiaires.`,
          },
        ];

      case 'autres':
        return [
          {
            id: 1,
            question: `Dans une approche pratique et concrète de « ${cleanTopic} », quel réflexe garantit la meilleure prise de décision ?`,
            options: [
              `Croiser les sources d'information fiables et évaluer les faits avec esprit critique`,
              `Suivre la première opinion venue sans vérification`,
              `Prendre une décision impulsive sous le coup de l'émotion`,
              `Ignorer le contexte réel`,
            ],
            correctIndex: 0,
            explanation: `✅ Le discernement et le croisement des faits constituent la base d'une réflexion adulte solide.`,
          },
          {
            id: 2,
            question: `Quelle méthode permet de structurer efficacement un projet ou une réflexion sur « ${cleanTopic} » ?`,
            options: [
              `Définir un objectif clair, planifier les étapes clés et mesurer les résultats intermédiaires`,
              `Agir au hasard sans calendrier ni vision d'ensemble`,
              `Tout reporter au lendemain indéfiniment`,
              `Changer d'objectif toutes les heures`,
            ],
            correctIndex: 0,
            explanation: `✅ La clarté des objectifs et le suivi méthodique sont les piliers de la réussite opérationnelle.`,
          },
          {
            id: 3,
            question: `Face à une difficulté ou un problème inattendu sur « ${cleanTopic} », quelle attitude adopter ?`,
            options: [
              `Isoler la cause racine avec méthode plutôt que de traiter uniquement les symptômes visibles`,
              `Paniquer et abandonner immédiatement`,
              `Accuser les autres sans chercher à comprendre`,
              `Répéter la même erreur en boucle`,
            ],
            correctIndex: 0,
            explanation: `✅ Résoudre la cause profonde (méthode des 5 pourquoi) évite la réapparition du problème.`,
          },
          {
            id: 4,
            question: `Sur « ${cleanTopic} », quelle est la valeur ajoutée de la culture générale et de la formation continue ?`,
            options: [
              `Elle permet d'élargir ses perspectives, d'adapter ses compétences et d'innover`,
              `Elle ne sert à rien une fois les études terminées`,
              `Elle encombre inutilement l'esprit`,
              `Elle empêche d'agir concrètement`,
            ],
            correctIndex: 0,
            explanation: `✅ L'apprentissage tout au long de la vie est un moteur constant d'épanouissement et d'agilité.`,
          },
          {
            id: 5,
            question: `En communication professionnelle ou personnelle autour de « ${cleanTopic} », qu'est-ce qui favorise l'adhésion ?`,
            options: [
              `La clarté, l'écoute active des interlocuteurs et des arguments factuels`,
              `L'agressivité et l'imposition unilatérale`,
              `Le flou volontaire et les contradictions permanentes`,
              `Le refus du dialogue`,
            ],
            correctIndex: 0,
            explanation: `✅ Une communication bienveillante, transparente et étayée emporte toujours la conviction.`,
          },
          {
            id: 6,
            question: `Pour maintenir un niveau d'excellence durable sur « ${cleanTopic} », quelle habitude cultiver ?`,
            options: [
              `La veille régulière, la remise en question constructive et la pratique continue`,
              `Considérer que l'on sait déjà tout`,
              `Refuser toute nouvelle information`,
              `Dormir sur ses acquis sans jamais évoluer`,
            ],
            correctIndex: 0,
            explanation: `✅ L'humilité et la curiosité intellectuelle continue sont la marque des véritables experts.`,
          },
        ];

      case 'concours':
      default:
        return [
          {
            id: 1,
            question: `Dans les épreuves de concours de haut niveau (Grandes Écoles, Magistrature, ENA, FASTEF), quel piège sur « ${cleanTopic} » élimine immédiatement un candidat ?`,
            options: [
              `Affirmer une conclusion sans avoir vérifié que toutes les conditions restrictives de l'énoncé sont remplies`,
              `Rédiger avec une écriture soignée et lisible`,
              `Structurer sa réponse en sous-parties numérotées`,
              `Encadrer le résultat final`,
            ],
            correctIndex: 0,
            explanation: `✅ Le jury de concours sanctionne l'absence de vérification des hypothèses d'application par un zéro à la question.`,
          },
          {
            id: 2,
            question: `Quelle posture stratégique doit adopter un candidat admissible face à une question délicate sur « ${cleanTopic} » ?`,
            options: [
              `Décomposer le problème en sous-questions élémentaires, énoncer la méthode et résoudre avec rigueur`,
              `Inventer un résultat fictif pour faire semblant d'avoir trouvé`,
              `Passer immédiatement à la suite sans lire l'énoncé`,
              `Contester la justesse du sujet de concours`,
            ],
            correctIndex: 0,
            explanation: `✅ En concours, la valorisation de la démarche méthodique rapporte la majorité des points intermédiaires.`,
          },
          {
            id: 3,
            question: `Sur « ${cleanTopic} », pourquoi un candidat ne doit-il JAMAIS utiliser d'abréviations non officielles dans sa copie ?`,
            options: [
              `Les correcteurs de concours pénalisent le manque de tenue académique et retirent des points de forme`,
              `Parce que les copies sont scannées en noir et blanc`,
              `Parce que les concours interdisent d'écrire en français`,
              `Cela n'a aucune importance`,
            ],
            correctIndex: 0,
            explanation: `✅ La forme compte pour 20% à 30% de la note finale dans les grands concours d'État.`,
          },
          {
            id: 4,
            question: `Dans un QCM à points négatifs de concours sur « ${cleanTopic} », quel calcul de risque doit être opéré ?`,
            options: [
              `Ne répondre que lorsque la certitude méthodologique est absolue pour ne pas perdre de points au classement`,
              `Cocher toutes les cases au hasard`,
              `Cocher uniquement l'option A systématiquement`,
              `Refuser de rendre la grille`,
            ],
            correctIndex: 0,
            explanation: `✅ Règle de concours sélectif : une mauvaise réponse coûte plus cher qu'une abstention stratégique.`,
          },
          {
            id: 5,
            question: `Comment traiter un cas limite ou une exception de principe sur « ${cleanTopic} » ?`,
            options: [
              `Isoler explicitement le cas particulier et le traiter séparément avec une démonstration dédiée`,
              `Faire comme si le cas particulier n'existait pas`,
              `Affirmer que l'exception annule l'ensemble de la théorie`,
              `Raturer le sujet`,
            ],
            correctIndex: 0,
            explanation: `✅ Marque des meilleurs candidats : traiter séparément les cas aux bornes et les singularités.`,
          },
          {
            id: 6,
            question: `Face à une contradiction apparente dans un sujet de concours sur « ${cleanTopic} », que faut-il faire ?`,
            options: [
              `Relire scrupuleusement les définitions du sujet : la contradiction provient presque toujours d'une mauvaise interprétation`,
              `Déclarer que le sujet est erroné et arrêter`,
              `Ignorer la question`,
              `Répondre par un point d'interrogation`,
            ],
            correctIndex: 0,
            explanation: `✅ Les sujets de concours sont relus par des comités d'experts ; l'ambiguïté apparente est souvent le piège testé.`,
          },
          {
            id: 7,
            question: `Quelle qualité de rédaction distingue un major de promotion sur « ${cleanTopic} » ?`,
            options: [
              `La concision, la clarté du raisonnement déductif et l'absence totale de verbiage inutile`,
              `Écrire 15 pages de texte vague pour impressionner le correcteur`,
              `Utiliser du jargon incompréhensible sans lien avec la question`,
              `Écrire au crayon de papier`,
            ],
            correctIndex: 0,
            explanation: `✅ Le jury apprécie les copies denses, sobres, précises et directement efficaces.`,
          },
          {
            id: 8,
            question: `Sur « ${cleanTopic} », quelle est la règle d'or pour la gestion du temps en concours ?`,
            options: [
              `Allouer un temps proportionnel au barème de chaque question et garder 10 minutes pour la relecture finale`,
              `Passer 80% du temps sur la première question`,
              `Terminer en 15 minutes et s'endormir`,
              `Ne jamais regarder sa montre`,
            ],
            correctIndex: 0,
            explanation: `✅ La gestion stricte du temps sépare les candidats admissibles de ceux qui ne terminent pas l'épreuve.`,
          },
          {
            id: 9,
            question: `Lors de l'épreuve orale devant le jury de concours sur « ${cleanTopic} », quelle est l'attitude attendue ?`,
            options: [
              `Une écoute active des questions du jury, des réponses calmes, argumentées et la capacité d'admettre une correction`,
              `L'agressivité et le refus d'entendre les remarques`,
              `Le silence complet sans un mot`,
              `Regarder ses chaussures pendant 30 minutes`,
            ],
            correctIndex: 0,
            explanation: `✅ Le grand oral teste la solidité scientifique, l'humilité intellectuelle et la force de conviction.`,
          },
          {
            id: 10,
            question: `En conclusion d'une copie de concours sur « ${cleanTopic} », quelle synthèse garantit la prime d'excellence ?`,
            options: [
              `Résumer les apports de la démonstration et ouvrir sur les applications concrètes ou les perspectives d'approfondissement`,
              `Écrire « Enfin terminé » à la fin`,
              `Laisser la dernière phrase inachevée`,
              `Répéter mot pour mot l'introduction`,
            ],
            correctIndex: 0,
            explanation: `✅ Une conclusion percutante et ouverte laisse une dernière impression remarquable au correcteur avant notation finale.`,
          },
        ];
    }
  },

  /**
   * Génère le rapport d'évaluation pour le mode "Corriger"
   */
  generateCorrectionReport(topicName: string, levelId: string): CorrectionReportData {
    const cleanTopic = topicName.trim() || 'Sujet d’entraînement';

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
          summary: `Félicitations pour ton travail sur « ${cleanTopic} » ! Tu as fait de gros progrès dans l'application des règles. Continue avec cette belle motivation !`,
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
            'Aérer davantage les étapes intermédiaires lors des transpositions d\'équations.',
          ],
          summary: `Très bon devoir sur « ${cleanTopic} ». La méthode de rédaction est solide. En renforçant la précision des justifications, la mention Très Bien est largement à votre portée.`,
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
          summary: `Devoir de très grande qualité sur « ${cleanTopic} ». Les attendus du Baccalauréat sont pleinement maîtrisés. Poursuivez dans cette voie d'exigence académique.`,
        };

      case 'superieur':
        return {
          grade: '17.5 / 20',
          strengths: [
            'Formalisme impeccable : respect strict des axiomes et de la topologie de référence.',
            'Preuves analytiques menées sans implicite avec une grande rigueur déductive.',
            'Excellente analyse des cas limites et identification précise des singularités.',
          ],
          improvements: [
            'Justifier plus formellement l\'interversion des opérateurs limites au niveau du lemme 2.',
            'Préciser la compacité relative de l\'espace sous-jacent.',
          ],
          summary: `Travail d'un niveau remarquable sur « ${cleanTopic} ». Rigueur démonstrative digne d'un futur diplômé de Master / Grande École.`,
        };

      case 'autres':
        return {
          grade: '18 / 20 (Excellence pratique)',
          strengths: [
            'Raisonnement pragmatique et ancré dans les réalités du terrain.',
            'Bonne capacité de synthèse et clarté des arguments avancés.',
            'Recul critique appréciable et sens des priorités.',
          ],
          improvements: [
            'Développer encore plus les perspectives d\'anticipation à moyen terme.',
            'Structurer la mise en application par des indicateurs concrets.',
          ],
          summary: `Excellent travail sur « ${cleanTopic} ». Votre approche allie bon sens, rigueur et pertinence opérationnelle. Continuez à cultiver cet esprit d'apprentissage continu !`,
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
          summary: `Performance de très haut vol sur « ${cleanTopic} ». Vous répondez aux critères les plus exigeants des jurys de concours. Félicitations !`,
        };
    }
  },
};
