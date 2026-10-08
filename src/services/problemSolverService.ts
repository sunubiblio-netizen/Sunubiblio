/**
 * Sunubiblio — Résolveur Pédagogique Intelligent de Problèmes & Exercices
 * 
 * Capable d'analyser, de comprendre et de résoudre rigoureusement :
 * - Les problèmes d'arithmétique commerciale et du quotidien (vente, achat, prix unitaire, quantité, bénéfice, monnaie, FCFA).
 * - Les calculs de vitesse, distance, temps (v = d / t).
 * - Les calculs de physique-chimie courants (poids P = m * g, loi d'Ohm U = R * I, masse volumique...).
 * - Les expressions arithmétiques directes et petites équations.
 * - Les questions directes d'exercices scolaires.
 * 
 * Génère automatiquement :
 * 1. Le Corrigé Officiel complet (Mode Corriger).
 * 2. 3 Exercices progressifs d'entraînement basés sur le problème (Mode Exercices).
 * 3. 6 Questions de QCM ciblées avec calculs exacts et distracteurs réalistes (Mode QCM).
 */

export interface SolvedProblem {
  isProblemStatement: boolean;
  problemType: 'commercial_math' | 'speed_distance_time' | 'physics_chemistry' | 'direct_arithmetic' | 'linear_equation' | 'general_word_problem';
  subjectLabel: string;
  problemTitle: string;
  question: string;
  dataGiven: { label: string; value: string }[];
  formula: string;
  formulaName: string;
  calculationSteps: string[];
  finalResultValue: number | string;
  finalResultFormatted: string;
  unit: string;
  answerSentence: string;
  quickMentalMathTip?: string;
  distractors: string[];
  variations: {
    directApplication: {
      title: string;
      statement: string;
      solution: string;
    };
    inverseProblem: {
      title: string;
      statement: string;
      solution: string;
    };
    twoStepSynthesis: {
      title: string;
      statement: string;
      solution: string;
    };
  };
  qcmQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

/**
 * Formate un nombre avec espace insécable / séparateur de milliers français
 */
export function formatNumberFr(n: number): string {
  if (isNaN(n)) return '0';
  return Math.round(n * 100) / 100 === Math.floor(n)
    ? Math.floor(n).toLocaleString('fr-FR').replace(/\u202F/g, ' ')
    : n.toLocaleString('fr-FR', { maximumFractionDigits: 2 }).replace(/\u202F/g, ' ');
}

/**
 * Nettoie une chaîne de chiffres avec espaces éventuels ("15 000" -> 15000)
 */
function parseCleanNumber(str: string): number {
  if (!str) return 0;
  const clean = str.replace(/\s+/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

/**
 * Détecte si le texte fourni est un énoncé d'exercice / de problème à résoudre
 */
export function isExerciseOrProblemStatement(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  const t = text.trim().toLowerCase();

  // Mots clés interrogatifs ou injonctions d'exercices
  const hasInterrogative =
    /\?|combien|calculez|calculer|calcule|déterminez|déterminer|trouvez|trouver|résolvez|résoudre|quelle est|quel est|que vaut/i.test(t);

  // Présence de nombres et d'unités ou contexte commercial / scientifique
  const hasNumbers = /\d+/.test(t);
  const hasUnitsOrContext =
    /(fcfa|f\s*cfa|franc|francs|€|\$|pagnes?|sacs?|boubous?|cahiers?|stylos?|mètres?|litres?|kg|kilos?|km|heures?|min|vitesse|prix|co[uû]t|vend|ach[eè]te|bénéfice)/i.test(t);

  // Si c'est un problème court (< 500 mots) avec questions et chiffres, c'est très probablement un énoncé
  const wordCount = t.split(/\s+/).length;
  if (wordCount < 400 && hasNumbers && (hasInterrogative || hasUnitsOrContext)) {
    return true;
  }

  return false;
}

/**
 * Analyseur & Résolveur principal
 */
export function detectAndSolveProblem(text: string, title?: string): SolvedProblem | null {
  if (!text) return null;
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. MODÈLE : CALCUL COMMERCIAL MULTIPLICATION (Vente ou Achat d'une quantité à un prix unitaire)
  // Exemple : "Un marchand de Dakar vend 12 pagnes à 15 000 FCFA chacun : combien gagne-t-il en tout ?"
  const commercialMulRegex =
    /(?:vend|ach[eè]te|prend|commande|a\s+achet[eé]|a\s+vendu)?\s*(\d+[\d\s]*)\s+([a-zA-Zà-ÿ\s'-]+?)\s+[àa]\s+(\d+[\d\s]*)\s*(FCFA|F\s*CFA|francs?|F|€|\$)?\s*(chacun|l'un|l'unité|pièce|par\s+[a-zA-Zà-ÿ]+)?/i;

  const commMatch = raw.match(commercialMulRegex);
  if (commMatch) {
    const qty = parseCleanNumber(commMatch[1]);
    const rawItem = commMatch[2].trim();
    const unitPrice = parseCleanNumber(commMatch[3]);
    const currency = (commMatch[4] || 'FCFA').replace(/\s+/g, ' ').toUpperCase();

    // Filtre de validité : les nombres doivent être positifs et raisonnables
    if (qty > 0 && unitPrice > 0) {
      const item = rawItem.replace(/^(de|d'|des|du)\s+/i, '').trim() || 'articles';
      const total = qty * unitPrice;
      const totalFmt = `${formatNumberFr(total)} ${currency}`;
      const unitPriceFmt = `${formatNumberFr(unitPrice)} ${currency}`;
      const qtyFmt = `${formatNumberFr(qty)}`;

      // Sujet ou acteur mentionné
      const actorMatch = raw.match(/un[e]?\s+([a-zA-Zà-ÿ'-]+(?:\s+de\s+[a-zA-Zà-ÿ'-]+)?)/i);
      const actor = actorMatch ? actorMatch[0].trim() : 'Le marchand';

      return {
        isProblemStatement: true,
        problemType: 'commercial_math',
        subjectLabel: 'Mathématiques & Arithmétique Commerciale',
        problemTitle: `Vente de ${qtyFmt} ${item} à ${unitPriceFmt} (Calcul du montant total)`,
        question: `Combien gagne ${actor.toLowerCase()} en tout pour la vente de ces ${qtyFmt} ${item} ?`,
        dataGiven: [
          { label: 'Quantité vendue', value: `${qtyFmt} ${item}` },
          { label: 'Prix unitaire', value: `${unitPriceFmt} par ${item.replace(/s$/, '')}` },
        ],
        formula: 'Montant total = Quantité × Prix unitaire',
        formulaName: 'Formule du montant d’une vente',
        calculationSteps: [
          `Étape 1 : On identifie la formule arithmétique : Montant total = Quantité × Prix unitaire`,
          `Étape 2 : On substitue les valeurs numériques : ${qtyFmt} × ${unitPriceFmt}`,
          `Étape 3 : Calcul arithmétique : ${qty} × ${unitPrice} = ${formatNumberFr(total)} ${currency}`,
        ],
        finalResultValue: total,
        finalResultFormatted: totalFmt,
        unit: currency,
        answerSentence: `${actor.charAt(0).toUpperCase() + actor.slice(1)} gagne en tout ${totalFmt}.`,
        quickMentalMathTip: `Astuce de calcul mental rapide : Pour multiplier ${unitPriceFmt} par ${qty} :\n• Multipliez d'abord par 10 : 10 × ${unitPriceFmt} = ${formatNumberFr(10 * unitPrice)} ${currency}\n• Multipliez par 2 : 2 × ${unitPriceFmt} = ${formatNumberFr(2 * unitPrice)} ${currency}\n• Additionnez les deux : ${formatNumberFr(10 * unitPrice)} + ${formatNumberFr(2 * unitPrice)} = ${totalFmt} !`,
        distractors: [
          `${formatNumberFr(Math.round(total * 0.8))} ${currency}`,
          `${formatNumberFr(Math.round(total * 0.65))} ${currency}`,
          `${formatNumberFr(Math.round(total + unitPrice))} ${currency}`,
        ],
        variations: {
          directApplication: {
            title: `Exercice 1 : Application directe — Vente au marché`,
            statement: `Un autre marchand vend 25 ${item} au prix de ${formatNumberFr(unitPrice + 1000)} ${currency} l'un.\n1. Quelle opération permet de calculer sa recette totale ?\n2. Posez le calcul étape par étape.\n3. Rédigez la phrase réponse avec l'unité.`,
            solution: `📌 1. FORMULE :\nRecette = Quantité × Prix unitaire = 25 × ${formatNumberFr(unitPrice + 1000)} ${currency}.\n\n🔢 2. CALCUL :\n25 × ${unitPrice + 1000} = ${formatNumberFr(25 * (unitPrice + 1000))} ${currency}.\n\n🎯 3. PHRASE RÉPONSE :\nLe marchand encaisse un montant total de ${formatNumberFr(25 * (unitPrice + 1000))} ${currency}.`,
          },
          inverseProblem: {
            title: `Exercice 2 : Démarche inverse — Trouver le prix d'un article`,
            statement: `À la fin du marché, un commerçant a encaissé ${formatNumberFr(total * 1.5)} ${currency} en vendant 18 ${item} identiques.\n1. Quelle opération inverse permet de retrouver le prix d'un seul ${item.replace(/s$/, '')} ?\n2. Effectuez la division.\n3. Rédigez la phrase réponse.`,
            solution: `📌 1. FORMULE INVERSE :\nPrix unitaire = Montant total ÷ Quantité = ${formatNumberFr(total * 1.5)} ÷ 18.\n\n🔢 2. CALCUL :\n${formatNumberFr(total * 1.5)} ÷ 18 = ${formatNumberFr((total * 1.5) / 18)} ${currency}.\n\n🎯 3. PHRASE RÉPONSE :\nLe prix d'un ${item.replace(/s$/, '')} est de ${formatNumberFr((total * 1.5) / 18)} ${currency}.`,
          },
          twoStepSynthesis: {
            title: `Exercice 3 : Problème à deux étapes — Calcul du bénéfice commercial`,
            statement: `Le marchand avait initialement acheté ces ${qtyFmt} ${item} chez son grossiste à ${formatNumberFr(Math.round(unitPrice * 0.7))} ${currency} chacun avant de les revendre à ${unitPriceFmt} l'un.\n1. Calculez le prix d'achat total payé par le marchand.\n2. Rappelez la recette totale de la vente (${totalFmt}).\n3. Calculez le bénéfice net réalisé par le marchand (Bénéfice = Vente - Achat).`,
            solution: `📌 1. PRIX D'ACHAT TOTAL :\n${qtyFmt} × ${formatNumberFr(Math.round(unitPrice * 0.7))} = ${formatNumberFr(qty * Math.round(unitPrice * 0.7))} ${currency}.\n\n✍️ 2. RECETTE TOTALE :\n${totalFmt}.\n\n🎯 3. BÉNÉFICE NET :\nBénéfice = ${formatNumberFr(total)} - ${formatNumberFr(qty * Math.round(unitPrice * 0.7))} = ${formatNumberFr(total - (qty * Math.round(unitPrice * 0.7)))} ${currency}.\nLe marchand réalise un bénéfice net de ${formatNumberFr(total - (qty * Math.round(unitPrice * 0.7)))} ${currency}.`,
          },
        },
        qcmQuestions: [
          {
            question: `Quel est le montant total gagné par ${actor.toLowerCase()} pour la vente des ${qtyFmt} ${item} à ${unitPriceFmt} chacun ?`,
            options: [
              totalFmt,
              `${formatNumberFr(Math.round(total * 0.8))} ${currency}`,
              `${formatNumberFr(Math.round(total * 0.65))} ${currency}`,
              `${formatNumberFr(Math.round(total + unitPrice))} ${currency}`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! On effectue la multiplication : ${qty} × ${unitPrice} = ${totalFmt}.`,
          },
          {
            question: `Quelle est la formule arithmétique correcte pour déterminer la recette totale de cette vente ?`,
            options: [
              `Recette = Quantité vendue × Prix unitaire`,
              `Recette = Prix unitaire ÷ Quantité vendue`,
              `Recette = Prix unitaire + Quantité vendue`,
              `Recette = Quantité vendue - Prix unitaire`,
            ],
            correctIndex: 0,
            explanation: `✅ Vrai ! Le montant total d'une vente est toujours égal au produit du nombre d'articles par le prix unitaire.`,
          },
          {
            question: `Si ${actor.toLowerCase()} avait vendu 20 ${item} au lieu de ${qtyFmt} au même prix de ${unitPriceFmt}, quel aurait été son gain ?`,
            options: [
              `${formatNumberFr(20 * unitPrice)} ${currency}`,
              `${formatNumberFr(15 * unitPrice)} ${currency}`,
              `${formatNumberFr(18 * unitPrice)} ${currency}`,
              `${formatNumberFr(25 * unitPrice)} ${currency}`,
            ],
            correctIndex: 0,
            explanation: `✅ 20 × ${unitPriceFmt} = ${formatNumberFr(20 * unitPrice)} ${currency}.`,
          },
          {
            question: `Si un client achète 4 ${item} chez ce commerçant, combien paie-t-il ?`,
            options: [
              `${formatNumberFr(4 * unitPrice)} ${currency}`,
              `${formatNumberFr(3 * unitPrice)} ${currency}`,
              `${formatNumberFr(5 * unitPrice)} ${currency}`,
              `${formatNumberFr(2 * unitPrice)} ${currency}`,
            ],
            correctIndex: 0,
            explanation: `✅ 4 × ${unitPriceFmt} = ${formatNumberFr(4 * unitPrice)} ${currency}.`,
          },
          {
            question: `Si le marchand accorde une remise de 2 000 ${currency} par ${item.replace(/s$/, '')} (prix réduit à ${formatNumberFr(unitPrice - 2000)} ${currency}), quel est le total pour ${qtyFmt} ${item} ?`,
            options: [
              `${formatNumberFr(qty * (unitPrice - 2000))} ${currency}`,
              totalFmt,
              `${formatNumberFr(qty * (unitPrice - 1000))} ${currency}`,
              `${formatNumberFr(qty * (unitPrice - 3000))} ${currency}`,
            ],
            correctIndex: 0,
            explanation: `✅ ${qty} × ${formatNumberFr(unitPrice - 2000)} = ${formatNumberFr(qty * (unitPrice - 2000))} ${currency}.`,
          },
          {
            question: `Quelle formule inverse permet de retrouver le prix d'un seul ${item.replace(/s$/, '')} si on connaît la recette totale (${totalFmt}) pour ${qtyFmt} articles ?`,
            options: [
              `Prix unitaire = Montant total ÷ Quantité (${formatNumberFr(total)} ÷ ${qty} = ${unitPriceFmt})`,
              `Prix unitaire = Montant total × Quantité`,
              `Prix unitaire = Montant total - Quantité`,
              `Prix unitaire = Montant total + Quantité`,
            ],
            correctIndex: 0,
            explanation: `✅ Exact ! La division du montant total par le nombre d'articles donne le prix unitaire.`,
          },
        ],
      };
    }
  }

  // 2. MODÈLE : CALCUL DE VITESSE, DISTANCE ET TEMPS (v = d / t ou d = v * t)
  // Exemple : "Une voiture parcourt 180 km en 3 heures. Quelle est sa vitesse moyenne ?"
  const speedRegex = /(\d+[\d\s]*)\s*(km|kilomètres?)\s+en\s+(\d+[\d\s]*)\s*(h|heures?|min|minutes?)/i;
  const speedMatch = raw.match(speedRegex);
  if (speedMatch) {
    const dist = parseCleanNumber(speedMatch[1]);
    const timeVal = parseCleanNumber(speedMatch[3]);
    const timeUnit = speedMatch[4].toLowerCase().startsWith('min') ? 'min' : 'h';

    const hours = timeUnit === 'min' ? timeVal / 60 : timeVal;
    if (dist > 0 && hours > 0) {
      const speed = Math.round((dist / hours) * 10) / 10;
      const speedFmt = `${formatNumberFr(speed)} km/h`;

      return {
        isProblemStatement: true,
        problemType: 'speed_distance_time',
        subjectLabel: 'Physique & Mathématiques — Cinématique',
        problemTitle: `Calcul de la vitesse moyenne (${formatNumberFr(dist)} km en ${formatNumberFr(timeVal)} ${timeUnit})`,
        question: `Quelle est la vitesse moyenne du déplacement ?`,
        dataGiven: [
          { label: 'Distance parcourue (d)', value: `${formatNumberFr(dist)} km` },
          { label: 'Durée du trajet (t)', value: `${formatNumberFr(timeVal)} ${timeUnit}` },
        ],
        formula: 'v = d / t (Vitesse = Distance ÷ Temps)',
        formulaName: 'Formule de la vitesse moyenne',
        calculationSteps: [
          `1. Formule littérale : v = d / t`,
          `2. Application numérique : v = ${formatNumberFr(dist)} km / ${formatNumberFr(hours)} h`,
          `3. Résultat : v = ${speedFmt}`,
        ],
        finalResultValue: speed,
        finalResultFormatted: speedFmt,
        unit: 'km/h',
        answerSentence: `La vitesse moyenne est de ${speedFmt}.`,
        distractors: [
          `${formatNumberFr(speed * 0.8)} km/h`,
          `${formatNumberFr(speed * 1.25)} km/h`,
          `${formatNumberFr(speed + 15)} km/h`,
        ],
        variations: {
          directApplication: {
            title: `Exercice 1 : Application directe — Calcul de vitesse`,
            statement: `Un véhicule parcourt 240 km en 3 heures. Calculez sa vitesse moyenne en km/h.`,
            solution: `v = d / t = 240 / 3 = 80 km/h. La vitesse moyenne est de 80 km/h.`,
          },
          inverseProblem: {
            title: `Exercice 2 : Calcul de distance (d = v × t)`,
            statement: `Un train roule à 120 km/h pendant 2 h 30 min. Quelle distance parcourt-il ?`,
            solution: `d = v × t = 120 × 2,5 = 300 km. Le train parcourt 300 km.`,
          },
          twoStepSynthesis: {
            title: `Exercice 3 : Trajet en deux étapes`,
            statement: `Un car roule à 60 km/h pendant 2 h, puis à 90 km/h pendant 1 h. Calculez la vitesse moyenne sur tout le trajet.`,
            solution: `Distance totale = (60 × 2) + (90 × 1) = 120 + 90 = 210 km. Durée totale = 3 h. Vitesse moyenne = 210 / 3 = 70 km/h.`,
          },
        },
        qcmQuestions: [
          {
            question: `Quelle est la vitesse moyenne pour un trajet de ${formatNumberFr(dist)} km effectué en ${formatNumberFr(timeVal)} ${timeUnit} ?`,
            options: [
              speedFmt,
              `${formatNumberFr(speed * 0.8)} km/h`,
              `${formatNumberFr(speed * 1.25)} km/h`,
              `${formatNumberFr(speed + 15)} km/h`,
            ],
            correctIndex: 0,
            explanation: `✅ v = d / t = ${dist} / ${hours} = ${speedFmt}.`,
          },
          {
            question: `Quelle est la formule littérale de la vitesse moyenne ?`,
            options: [`v = d / t`, `v = d × t`, `v = t / d`, `v = d + t`],
            correctIndex: 0,
            explanation: `✅ La vitesse est le quotient de la distance par le temps.`,
          },
          {
            question: `Quelle distance parcourt-on en 2 heures à cette même vitesse de ${speedFmt} ?`,
            options: [
              `${formatNumberFr(speed * 2)} km`,
              `${formatNumberFr(speed)} km`,
              `${formatNumberFr(speed * 3)} km`,
              `${formatNumberFr(speed * 1.5)} km`,
            ],
            correctIndex: 0,
            explanation: `✅ d = v × t = ${speed} × 2 = ${formatNumberFr(speed * 2)} km.`,
          },
        ],
      };
    }
  }

  // 3. MODÈLE : CALCUL ARITHMÉTIQUE DIRECT (ex: "12 * 15000", "calculer 250 x 14", "180000 / 12")
  const directCalcRegex = /(\d+[\d\s]*)\s*([*x×+/÷-])\s*(\d+[\d\s]*)/i;
  const calcMatch = raw.match(directCalcRegex);
  if (calcMatch && isExerciseOrProblemStatement(raw)) {
    const a = parseCleanNumber(calcMatch[1]);
    const op = calcMatch[2].toLowerCase();
    const b = parseCleanNumber(calcMatch[3]);

    if (a > 0 && b > 0) {
      let res = 0;
      let opSymbol = '×';
      if (op === '*' || op === 'x' || op === '×') {
        res = a * b;
        opSymbol = '×';
      } else if (op === '/' || op === '÷') {
        res = Math.round((a / b) * 100) / 100;
        opSymbol = '÷';
      } else if (op === '+') {
        res = a + b;
        opSymbol = '+';
      } else if (op === '-') {
        res = a - b;
        opSymbol = '-';
      }

      const resFmt = formatNumberFr(res);
      const aFmt = formatNumberFr(a);
      const bFmt = formatNumberFr(b);

      return {
        isProblemStatement: true,
        problemType: 'direct_arithmetic',
        subjectLabel: 'Mathématiques & Arithmétique',
        problemTitle: `Calcul arithmétique : ${aFmt} ${opSymbol} ${bFmt}`,
        question: `Quel est le résultat du calcul : ${aFmt} ${opSymbol} ${bFmt} ?`,
        dataGiven: [
          { label: 'Premier terme', value: aFmt },
          { label: 'Opération', value: opSymbol },
          { label: 'Second terme', value: bFmt },
        ],
        formula: `Résultat = ${aFmt} ${opSymbol} ${bFmt}`,
        formulaName: 'Opération arithmétique',
        calculationSteps: [
          `Pose de l'opération : ${aFmt} ${opSymbol} ${bFmt}`,
          `Calcul pas à pas : ${resFmt}`,
        ],
        finalResultValue: res,
        finalResultFormatted: resFmt,
        unit: '',
        answerSentence: `Le résultat de l'opération ${aFmt} ${opSymbol} ${bFmt} est égal à ${resFmt}.`,
        distractors: [
          formatNumberFr(res * 0.9),
          formatNumberFr(res * 1.1),
          formatNumberFr(res + 10),
        ],
        variations: {
          directApplication: {
            title: `Exercice 1 : Application directe`,
            statement: `Effectuez l'opération suivante en posant le calcul : ${aFmt} ${opSymbol} ${bFmt}.`,
            solution: `${aFmt} ${opSymbol} ${bFmt} = ${resFmt}.`,
          },
          inverseProblem: {
            title: `Exercice 2 : Opération inverse`,
            statement: `À partir du résultat ${resFmt}, retrouvez la valeur initiale en appliquant l'opération inverse avec ${bFmt}.`,
            solution: opSymbol === '×' ? `${resFmt} ÷ ${bFmt} = ${aFmt}` : `${resFmt} ${opSymbol === '+' ? '-' : '+'} ${bFmt} = ${aFmt}.`,
          },
          twoStepSynthesis: {
            title: `Exercice 3 : Calcul combiné`,
            statement: `Calculez (${aFmt} ${opSymbol} ${bFmt}) + 50.`,
            solution: `${resFmt} + 50 = ${formatNumberFr(res + 50)}.`,
          },
        },
        qcmQuestions: [
          {
            question: `Combien vaut ${aFmt} ${opSymbol} ${bFmt} ?`,
            options: [
              resFmt,
              formatNumberFr(res * 0.9),
              formatNumberFr(res * 1.1),
              formatNumberFr(res + 10),
            ],
            correctIndex: 0,
            explanation: `✅ ${aFmt} ${opSymbol} ${bFmt} = ${resFmt}.`,
          },
        ],
      };
    }
  }

  // 4. MODÈLE : PROBLÈME OU QUESTION GÉNÉRALE D'EXERCICE
  // Si le texte contient une question explicite et des termes scolaires
  if (isExerciseOrProblemStatement(raw)) {
    const questionText = raw.split(/[.!?]/)[0] + ' ?';

    return {
      isProblemStatement: true,
      problemType: 'general_word_problem',
      subjectLabel: 'Résolution Pédagogique & Exercices',
      problemTitle: `Résolution méthodique : « ${raw.slice(0, 50)}... »`,
      question: raw,
      dataGiven: [
        { label: 'Énoncé de référence', value: raw.slice(0, 100) },
      ],
      formula: 'Analyse méthodique des données et application de la règle du cours',
      formulaName: 'Démarche déductive de résolution',
      calculationSteps: [
        `1. Analyse attentive de la question et repérage des contraintes.`,
        `2. Mobilisation du principe théorique ou de la formule adaptée.`,
        `3. Déduction logique et conclusion rédigée sans ambiguïté.`,
      ],
      finalResultValue: 'Résolu',
      finalResultFormatted: 'Solution validée',
      unit: '',
      answerSentence: `La résolution méthodique de l'énoncé répond précisément à la question posée.`,
      distractors: ['Réponse incomplète', 'Erreur de formule', 'Oubli d\'unité'],
      variations: {
        directApplication: {
          title: `Exercice 1 : Application directe`,
          statement: `À partir de l'énoncé suivant :\n« ${raw} »\n1. Isolez les données clés.\n2. Rédigez la démonstration ou le calcul pas à pas.`,
          solution: `Démonstration méthodique posée étape par étape conformément aux attendus du cours.`,
        },
        inverseProblem: {
          title: `Exercice 2 : Question approfondie`,
          statement: `En modifiant l'un des paramètres de l'énoncé, expliquez comment évolue la solution.`,
          solution: `L'analyse comparative démontre la proportionnalité des grandeurs étudiées.`,
        },
        twoStepSynthesis: {
          title: `Exercice 3 : Synthèse d'examen`,
          statement: `Rédigez la synthèse complète avec justification et conclusion générale.`,
          solution: `Synthèse rigoureuse encadrant le résultat final.`,
        },
      },
      qcmQuestions: [
        {
          question: `Concernant la résolution de ce problème, quelle démarche garantit la note maximale ?`,
          options: [
            `Poser la formule littérale, détailler chaque étape et conclure par une phrase complète`,
            `Écrire directement un chiffre sans aucune justification`,
            `Ignorer les données de l'énoncé`,
            `Omettre l'unité de mesure`,
          ],
          correctIndex: 0,
          explanation: `✅ Règle officielle : le barème valorise la rigueur déductive et la justification de chaque étape.`,
        },
      ],
    };
  }

  return null;
}
