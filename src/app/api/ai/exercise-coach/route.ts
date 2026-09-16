import { NextRequest, NextResponse } from 'next/server';
import { exerciseService } from '@/services/exerciseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      exerciseId,
      questionId,
      questionNumber,
      prompt,
      isCorrectionMode,
      userAnswerLabel,
      correctAnswerLabel,
      explanationText,
    } = body;

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Identifiant d’exercice manquant.', code: 'MISSING_EXERCISE_ID' },
        { status: 400 }
      );
    }

    // 1. Récupération et vérification serveur de l'exercice
    const exercise = await exerciseService.getExerciseById(exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercice introuvable dans le catalogue.', code: 'EXERCISE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 2. Contrôle d'autorisation strict côté serveur (Règle 9 & 19)
    if (exercise.allowAI === false && !isCorrectionMode) {
      return NextResponse.json(
        {
          error: "L'assistant IA est strictement désactivé pour cette épreuve sous conditions réelles de concours ou d'examen.",
          code: 'AI_DISABLED_EXAM',
        },
        { status: 403 }
      );
    }

    // 3. Récupération de la question autorisée
    const questions = exercise.questions || [];
    const question =
      questions.find((q) => q.id === questionId) ||
      questions[(questionNumber || 1) - 1] ||
      questions[0];

    const cleanPrompt = (prompt || '').trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 4. Mode Correction : L'épreuve est terminée, l'IA agit comme un tuteur pédagogique d'analyse
    let content = '';

    if (isCorrectionMode) {
      const lower = cleanPrompt.toLowerCase();
      const goodChoice = question?.choices?.find((c) => c.isCorrect)?.label || correctAnswerLabel;

      if (lower.includes('erreur') || lower.includes('pourquoi') && lower.includes('faux')) {
        content = `### 🔍 Analyse Pédagogique de Votre Erreur\n\n` +
          `Dans cette question en **${exercise.subject}** (${exercise.chapter || 'Général'}) :\n\n` +
          `* **Votre réponse sélectionnée :** « ${userAnswerLabel || 'Aucune sélectionnée'} »\n` +
          `* **Réponse attendue :** « ${goodChoice || 'Solution officielle'} »\n\n` +
          `**Pourquoi cette réponse est incorrecte :**\n` +
          (question?.commonMistake
            ? `* ⚠️ **Piège fréquent :** ${question.commonMistake}\n`
            : `* ⚠️ **Attention :** Ce choix repose sur une confusion fréquente dans les conditions d'application de la règle.\n`) +
          (question?.explanation
            ? `* 💡 **Explication :** ${question.explanation}\n`
            : '') +
          (question?.method
            ? `* 🧭 **Méthode à retenir :** ${question.method}\n`
            : '') +
          `\n*Besoin d'éclaircir un terme ou un point précis ? Vous pouvez me poser toute question ci-dessous.*`;
      } else if (lower.includes('correction') || lower.includes('explique la')) {
        content = `### 💡 Explication Détaillée de la Correction\n\n` +
          `**Question :** *« ${question?.question} »*\n\n` +
          `* 🎯 **Bonne réponse :** « ${goodChoice} »\n\n` +
          (question?.explanation
            ? `**Raisonnement pas à pas :**\n${question.explanation}\n\n`
            : (explanationText ? `**Raisonnement :**\n${explanationText}\n\n` : '')) +
          (question?.method
            ? `**Méthode de résolution :**\n${question.method}\n\n`
            : '') +
          (question?.tip
            ? `> 🎯 **Astuce Concours :** ${question.tip}\n\n`
            : '') +
          `*Avez-vous compris le cheminement logique ou souhaitez-vous un exemple concret ?*`;
      } else if (lower.includes('autre méthode') || lower.includes('méthode alternative') || lower.includes('autre technique')) {
        content = `### 📐 Autre Méthode de Résolution\n\n` +
          `Pour aborder ce problème sous un angle différent et gagner en rapidité le jour de l'épreuve :\n\n` +
          `1. **Méthode par élimination directe :** En observant les propositions, vous pouvez écarter immédiatement les valeurs extrêmes ou contradictoires avec le cours.\n` +
          `2. **Approche par substitution / contre-exemple :** Testez une situation particulière simple pour vérifier quelle option reste toujours vraie.\n` +
          (question?.method
            ? `3. **Comparaison avec la méthode formelle :** Rappel de la démarche classique : *${question.method}*.\n`
            : '') +
          `\n*Cette méthode vous permet de sécuriser vos points même en cas de doute sur le calcul théorique !*`;
      } else if (lower.includes('similaire') || lower.includes('pose-moi') || lower.includes('autre question')) {
        content = `### 📝 Question Similaire d'Entraînement\n\n` +
          `Testons votre assimilation sur **${exercise.chapter || exercise.subject}** :\n\n` +
          `*« Dans une situation analogue où les conditions initiales seraient renforcées, quelle démarche méthodologique est prioritaire ? »*\n\n` +
          `* **A)** Appliquer immédiatement la formule finale sans vérifier les hypothèses\n` +
          `* **B)** Évaluer d'abord le domaine de validité de la règle avant tout calcul\n` +
          `* **C)** Conclure à l'impossibilité de résoudre le problème\n` +
          `* **D)** Réduire arbitrairement le nombre de paramètres\n\n` +
          `*👉 Écrivez-moi votre choix (A, B, C ou D) dans le chat ci-dessous, je vous corrigerai immédiatement !*`;
      } else {
        // Question libre en mode correction
        content = `### 🎓 Tuteur Pédagogique Sunubiblio\n\n` +
          `Concernant la **Question ${question?.order || questionNumber}** en ${exercise.subject} (*« ${question?.question} »*) :\n\n` +
          `* 🎯 **Solution officielle :** « ${goodChoice} »\n` +
          (question?.explanation ? `* 💡 **Élément clé :** ${question.explanation}\n\n` : '\n') +
          `Pour répondre précisément à votre question : « *${cleanPrompt}* » :\n\n` +
          `En préparation de concours ou d'examen, il est crucial de toujours relier la question aux définitions fondamentales du chapitre. ` +
          (question?.tip ? `N'oubliez pas ce repère d'examen : *${question.tip}*.\n\n` : '\n\n') +
          `*Vous pouvez approfondir en me posant une question plus ciblée ou en demandant un exemple chiffré.*`;
      }

      return NextResponse.json({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp,
        status: 'complete',
      });
    }

    // 5. Détection pédagogique en mode entraînement direct (Règle 8)
    const directAnswerRegex = /(quelle\s+est\s+la\s+(bonne\s+)?r[ée]ponse|donne(\s*-\s*moi)?\s+(la\s+)?(bonne\s+)?r[ée]ponse|c'est\s+quoi\s+la\s+r[ée]ponse|c'est\s+la\s+lettre|donne(\s*-\s*moi)?\s+la\s+solution|dis(\s*-\s*moi)?\s+la\s+r[ée]ponse|peux\s*-\s*tu\s+me\s+donner\s+la\s+r[ée]ponse)/i;
    const isAskingDirectAnswer = directAnswerRegex.test(cleanPrompt);

    if (isAskingDirectAnswer) {
      content = `### 🎯 Règle Pédagogique Sunubiblio\n\n` +
        `En mode entraînement, **je ne vous donne pas directement la lettre de la bonne réponse** afin de préserver votre progression et votre assimilation.\n\n` +
        `**Voici la démarche pour trouver par vous-même :**\n` +
        (question?.method ? `* 🧭 **Méthode :** ${question.method}\n` : `* 🧭 **Méthode :** Relisez attentivement l'énoncé et éliminez d'abord les deux propositions qui contredisent le cours.\n`) +
        (question?.tip ? `* 💡 **Indice clé :** ${question.tip}\n` : '') +
        (question?.commonMistake ? `* ⚠️ **Attention au piège fréquent :** ${question.commonMistake}\n` : '') +
        `\n*Sélectionnez l'option qui correspond à ce raisonnement dans votre test, puis vous aurez accès à la correction intégrale lors de la soumission !*`;
    } else if (cleanPrompt.toLowerCase().includes('indice')) {
      content = `### 🧠 Indice Méthodologique\n\n` +
        (question?.tip
          ? `> **Conseil de révision :** ${question.tip}\n\n`
          : `Pour cette question sur **${exercise.chapter || exercise.subject}**, concentrez-vous sur la définition exacte donnée dans le programme officiel.\n\n`) +
        (question?.method
          ? `**Règle à appliquer :** ${question.method}\n\n`
          : '') +
        `*Essayez d'éliminer les choix manifestement contraires à ce principe.*`;
    } else if (cleanPrompt.toLowerCase().includes('explique') && cleanPrompt.toLowerCase().includes('notion')) {
      content = `### 📚 Notions & Concepts Clés\n\n` +
        `Cette question teste vos connaissances sur le chapitre **${exercise.chapter || exercise.subject}**${exercise.competitionName ? ` (Concours ${exercise.competitionName})` : ''}.\n\n` +
        `* **Définition essentielle :** Dans ce cadre d'évaluation, le concept central repose sur la distinction nette entre les situations d'apprentissage et les phases d'évaluation.\n` +
        (question?.method ? `* **Ce qu'attend le jury :** ${question.method}\n` : '') +
        `* **Fiche mémo :** Revoyez les définitions officielles du programme pour ce concours.`;
    } else if (cleanPrompt.toLowerCase().includes('similaire') || cleanPrompt.toLowerCase().includes('exemple')) {
      content = `### 📝 Mini-Exercice d'Entraînement Similaire\n\n` +
        `Pour vous exercer sur le même raisonnement que la question ${question?.order || 1} :\n\n` +
        `*« Dans un contexte similaire en ${exercise.subject}, quelle serait la première étape à formaliser avant de conclure ? »*\n\n` +
        `1. Identifier les hypothèses de départ.\n` +
        `2. Vérifier les conditions d'application de la règle.\n` +
        `3. Appliquer la formule ou la définition avec rigueur.\n\n` +
        `*Une fois que vous maîtrisez cette logique, appliquez-la à la question active du test !*`;
    } else if (cleanPrompt.toLowerCase().includes('revoir') || cleanPrompt.toLowerCase().includes('réviser')) {
      content = `### 📖 Points à Réviser en Priorité\n\n` +
        `Pour consolider votre score sur **${exercise.chapter}** (${exercise.subject}) :\n\n` +
        `1. **Définitions de base :** Assurez-vous de pouvoir énoncer la règle sans hésitation.\n` +
        (question?.commonMistake ? `2. **Pièges fréquents :** Évitez : *${question.commonMistake}*.\n` : '') +
        `3. **Annales officielles :** Révisez les sujets corrigés équivalents dans la section Concours de Sunubiblio.`;
    } else {
      // Explication générale contextualisée
      content = `### 💡 Analyse de la Question ${question?.order || 1}\n\n` +
        (question ? `Pour bien aborder : *« ${question.question} »* :\n\n` : '') +
        (question?.method ? `* **Orientation méthodologique :** ${question.method}\n` : '') +
        (question?.tip ? `* **Repère utile :** ${question.tip}\n` : '') +
        `\n*Besoin d'un indice supplémentaire ou d'une précision sur un terme particulier ? Demandez-moi !*`;
    }

    return NextResponse.json({
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp,
      status: 'complete',
    });
  } catch (error) {
    console.error('Erreur API /api/ai/exercise-coach:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors du traitement de la demande IA.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
