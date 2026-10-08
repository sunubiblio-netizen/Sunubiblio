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
Tu es un inspecteur pédagogique d'excellence et professeur agrégé. À partir du contenu du document ou de l'énoncé fourni ci-dessous, génère 3 exercices progressifs adaptés au niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS mentionner le nom de fichier ou son extension (.pdf, .docx, etc.).
2. Si le texte est un problème ou un exercice de calcul (ex: vente, commerce, vitesse, maths, physique) : génère 3 exercices d'entraînement progressifs sur ce même type de problème (Exercice 1 : Application directe avec nouvelles valeurs, Exercice 2 : Démarche inverse type division ou recherche d'inconnue, Exercice 3 : Problème complet à deux étapes avec bénéfice ou analyse combinée).
3. Effectue tous les calculs sans faute d'arithmétique, précise les unités et vérifie la cohérence.
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
Tu es un concepteur d'épreuves officielles de QCM. À partir du contenu ou du problème fourni ci-dessous, génère 6 à 8 questions de QCM pour le niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS répéter le nom du document ou du fichier.
2. Si le texte est un problème de calcul (ex: vente de pagnes, prix, vitesse, etc.) : pose des questions portant directement sur ce problème (le calcul exact, la formule utilisée, une variante avec une autre quantité, une variante avec réduction, et l'opération inverse).
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
Tu es un correcteur officiel d'examen et professeur particulier bienveillant. Analyse le travail fourni pour le niveau "${levelId}" et produis un rapport d'évaluation pédagogique ultra-précis.
RÈGLES CAPITALES :
1. NE JAMAIS noter un problème de maths ou d'arithmétique comme une dissertation littéraire ! Si le texte soumis est un énoncé de problème (ex: "Un marchand vend 12 pagnes à 15 000 FCFA : combien gagne-t-il en tout ?"), produis le Corrigé Officiel Modèle avec le calcul exact (12 × 15 000 = 180 000 FCFA), la formule (Total = Quantité × Prix unitaire) et la phrase réponse complète en lui attribuant "20 / 20 (Corrigé Officiel du Problème)".
2. Pour chaque étape ou point examiné, détaille la formule, le calcul exact, l'erreur fréquente à éviter, la méthode et les conseils de calcul mental.
3. Rends un JSON STRICT valide avec la forme :
{
  "report": {
    "grade": "20 / 20 (Corrigé Officiel du Problème)",
    "generalVerdict": "Résolution complète et rigoureuse du problème",
    "subjectDomain": "Discipline concernée (ex: Mathématiques & Arithmétique)",
    "levelEvaluated": "${levelId}",
    "criteriaScores": [
      { "criterion": "Identification des données", "score": "5 / 5", "comment": "Toutes les données utiles sont repérées" },
      { "criterion": "Choix de la formule & Démarche", "score": "5 / 5", "comment": "La bonne opération est appliquée" },
      { "criterion": "Exactitude des calculs", "score": "5 / 5", "comment": "Calculs exacts et sans erreur" },
      { "criterion": "Phrase réponse & Unités", "score": "5 / 5", "comment": "Phrase réponse complète et unité mentionnée" }
    ],
    "detailedEvaluations": [
      {
        "id": 1,
        "questionOrProblem": "Résolution de la question posée",
        "studentAnswer": "Énoncé analysé",
        "status": "correct",
        "statusLabel": "✅ Corrigé Officiel Validé",
        "whyExplanation": "Explication du résultat",
        "exactErrorIdentified": "Piège fréquent à éviter",
        "properMethod": "Formule et méthode exacte",
        "correctAnswerDetailed": "Corrigé modèle pas à pas",
        "stepByStepSolution": "Étapes de calcul détaillées",
        "howToReachAnswer": "Conseil méthodologique et astuce de calcul mental"
      }
    ],
    "strengths": ["Point fort 1", "Point fort 2"],
    "improvements": ["Conseil méthodologique 1", "Conseil méthodologique 2"],
    "summary": "Synthèse de la résolution du problème",
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
