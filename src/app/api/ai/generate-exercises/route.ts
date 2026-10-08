import { NextRequest, NextResponse } from 'next/server';
import { exerciseGeneratorService } from '@/services/exerciseGeneratorService';

export const runtime = 'nodejs';

interface GenerateExercisesRequestBody {
  topicName: string;
  extractedText?: string;
  keyConcepts?: string[];
  levelId: string;
  mode: 'exercices' | 'qcm' | 'corriger';
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExercisesRequestBody = await req.json();
    const { topicName, extractedText, keyConcepts, levelId, mode } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Si une clé Gemini est configurée, nous pouvons solliciter l'API Gemini
    if (apiKey && (extractedText || topicName)) {
      try {
        const geminiResult = await callGeminiEngine({
          apiKey,
          topicName,
          extractedText: extractedText || '',
          levelId,
          mode,
        });

        if (geminiResult) {
          if (mode === 'exercices' && Array.isArray(geminiResult.exercises)) {
            const kindInfo = exerciseGeneratorService.classifyTopic(topicName, levelId);
            geminiResult.exercises = geminiResult.exercises.map((ex: any) => ({
              ...ex,
              topicKind: kindInfo.kind,
              minWordsRequired: kindInfo.minWords,
              kindLabel: kindInfo.label,
              badgeIcon: kindInfo.badgeIcon,
              instructionHint: kindInfo.instructionHint,
            }));
          }
          return NextResponse.json({
            success: true,
            provider: 'gemini',
            data: geminiResult,
          });
        }
      } catch (geminiError) {
        console.warn('[Gemini API] Erreur ou quota dépassé, bascule vers le moteur local:', geminiError);
        // Fallback transparent vers le moteur local
      }
    }

    // Moteur local enrichi Sunubiblio
    const localData = exerciseGeneratorService.generateContentWithDocument({
      topicName: topicName || 'Sujet d’entraînement',
      extractedText: extractedText || '',
      keyConcepts: keyConcepts || [],
      levelId,
      mode,
    });

    return NextResponse.json({
      success: true,
      provider: 'local',
      data: localData,
    });
  } catch (error: any) {
    console.error('[API generate-exercises] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération.', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * Appel direct de l'API Google Gemini sans dépendances externes
 */
async function callGeminiEngine({
  apiKey,
  topicName,
  extractedText,
  levelId,
  mode,
}: {
  apiKey: string;
  topicName: string;
  extractedText: string;
  levelId: string;
  mode: 'exercices' | 'qcm' | 'corriger';
}) {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let promptInstruction = '';
  if (mode === 'exercices') {
    promptInstruction = `
Tu es un inspecteur pédagogique d'excellence et professeur agrégé. À partir du contenu du document fourni ci-dessous, génère 3 exercices progressifs adaptés au niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS mentionner le nom de fichier ou son extension (.pdf, .docx, etc.).
2. Pour les matières à calcul (Maths, Physique, Chimie, etc.) : utilise les vraies formules du document, donne des valeurs précises, détaille le remplacement des valeurs, effectue le calcul sans faute d'arithmétique, précise les unités et vérifie la cohérence.
3. Pour les matières littéraires / humaines / droit : pose des questions précises sur les définitions, arguments, concepts et structure du texte.
4. Rends un JSON STRICT valide avec la forme :
{
  "exercises": [
    {
      "id": 1,
      "title": "Titre explicite de l'exercice 1",
      "duration": "15 min",
      "statement": "Énoncé complet et détaillé avec questions 1, 2, 3...",
      "solution": "Corrigé académique rigoureux et détaillé pas à pas avec formules, calculs, unités ou plan détaillé"
    }
  ]
}
`;
  } else if (mode === 'qcm') {
    promptInstruction = `
Tu es un concepteur d'épreuves officielles de QCM. À partir du contenu du document fourni ci-dessous, génère 6 à 8 questions de QCM pour le niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS répéter le nom du document ou du fichier.
2. Chaque question doit porter sur une notion, un chiffre, une formule, une règle ou une définition réelle tirée du document.
3. Les 3 mauvaises propositions doivent être crédibles et pédagogiquement pertinentes (pièges classiques, inversion d'unités ou de causalité), sans réponses absurdes.
4. Fournis une explication détaillée expliquant pourquoi la bonne réponse est exacte et pourquoi les autres sont fausses.
5. Rends un JSON STRICT valide avec la forme :
{
  "qcm": [
    {
      "id": 1,
      "question": "Texte précis de la question posée",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctIndex": 0,
      "explanation": "Explication pédagogique complète et détaillée"
    }
  ]
}
`;
  } else {
    promptInstruction = `
Tu es un correcteur officiel d'examen et professeur particulier bienveillant. Analyse le travail fourni en référence au document pour le niveau "${levelId}" et produis un rapport d'évaluation pédagogique ultra-précis.
RÈGLES CAPITALES :
1. Ne pas répéter le nom du fichier.
2. Pour chaque réponse examinée, détermine si elle est correcte, partiellement correcte ou incorrecte, identifie l'erreur exacte, donne la bonne méthode et explique comment l'élève pouvait trouver la réponse.
3. Rends un JSON STRICT valide avec la forme :
{
  "report": {
    "grade": "15.5 / 20 (Mention Bien)",
    "generalVerdict": "Synthèse de l'évaluation globale",
    "subjectDomain": "Discipline concernée",
    "levelEvaluated": "${levelId}",
    "criteriaScores": [
      { "criterion": "Compréhension du sujet & Notions clés", "score": "4 / 5", "comment": "Remarque sur la compréhension" },
      { "criterion": "Rigueur méthodologique & Démarche", "score": "3.5 / 5", "comment": "Remarque sur la démarche" },
      { "criterion": "Exactitude des calculs ou argumentation", "score": "4 / 5", "comment": "Remarque sur l'exactitude" },
      { "criterion": "Clarté de rédaction & Présentation", "score": "4 / 5", "comment": "Remarque sur la clarté" }
    ],
    "detailedEvaluations": [
      {
        "id": 1,
        "questionOrProblem": "Question ou point évalué",
        "studentAnswer": "Réponse observée",
        "status": "correct",
        "statusLabel": "✅ Réponse exacte & maîtrisée",
        "whyExplanation": "Pourquoi cette note",
        "exactErrorIdentified": "Erreur exacte ou Aucune erreur",
        "properMethod": "La bonne démarche à suivre",
        "correctAnswerDetailed": "Corrigé modèle complet",
        "stepByStepSolution": "Étapes de résolution détaillées",
        "howToReachAnswer": "Conseil méthodologique pour réussir"
      }
    ],
    "strengths": ["Point fort 1", "Point fort 2"],
    "improvements": ["Axe de progrès 1", "Axe de progrès 2"],
    "summary": "Synthèse pédagogique encourageante",
    "pedagogicalAdvice": "Conseil personnalisé du professeur"
  }
}
`;
  }

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${promptInstruction}\n\n--- CONTENU DU DOCUMENT ---\n${extractedText.slice(0, 15000) || topicName}\n--- FIN DU CONTENU ---`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}
