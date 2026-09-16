import { NextRequest, NextResponse } from 'next/server';
import { exerciseService } from '@/services/exerciseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseId, questionId, questionNumber, prompt } = body;

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
    if (exercise.allowAI === false) {
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

    // 4. Détection pédagogique : l'utilisateur demande-t-il la réponse brute ? (Règle 8)
    const directAnswerRegex = /(quelle\s+est\s+la\s+(bonne\s+)?r[ée]ponse|donne(\s*-\s*moi)?\s+(la\s+)?(bonne\s+)?r[ée]ponse|c'est\s+quoi\s+la\s+r[ée]ponse|c'est\s+la\s+lettre|donne(\s*-\s*moi)?\s+la\s+solution|dis(\s*-\s*moi)?\s+la\s+r[ée]ponse|peux\s*-\s*tu\s+me\s+donner\s+la\s+r[ée]ponse)/i;
    const isAskingDirectAnswer = directAnswerRegex.test(cleanPrompt);

    let content = '';

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
