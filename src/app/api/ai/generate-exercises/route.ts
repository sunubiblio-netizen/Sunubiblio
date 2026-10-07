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
Tu es un inspecteur pédagogique d'excellence. À partir du contenu du document fourni ci-dessous, génère 3 exercices progressifs adaptés au niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS mentionner le nom de fichier ou son extension (.pdf, .docx, etc.).
2. Pose de vraies questions précises basées sur les faits, calculs, règles et arguments du texte.
3. Rends un JSON STRICT valide avec la forme :
{
  "exercises": [
    {
      "id": 1,
      "title": "Titre explicite de l'exercice 1",
      "duration": "15 min",
      "statement": "Énoncé complet et détaillé avec questions 1, 2, 3...",
      "solution": "Corrigé académique rigoureux et détaillé pas à pas"
    }
  ]
}
`;
  } else if (mode === 'qcm') {
    promptInstruction = `
Tu es un concepteur d'épreuves de QCM de référence. À partir du contenu du document fourni ci-dessous, génère une série de 5 à 10 questions de QCM pour le niveau "${levelId}".
RÈGLES CAPITALES :
1. NE JAMAIS répéter le nom du document ou du fichier.
2. Chaque question doit porter sur une notion, un chiffre, une définition ou une déduction tirée du document.
3. Rends un JSON STRICT valide avec la forme :
{
  "qcm": [
    {
      "id": 1,
      "question": "Texte précis de la question posée sans répéter le nom du fichier",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctIndex": 0,
      "explanation": "Explication pédagogique claire de la bonne réponse"
    }
  ]
}
`;
  } else {
    promptInstruction = `
Tu es un correcteur officiel d'examen. Analyse le document pour le niveau "${levelId}" et produis un rapport d'évaluation pédagogique.
RÈGLES CAPITALES :
1. Ne pas répéter le nom du fichier.
2. Rends un JSON STRICT valide avec :
{
  "report": {
    "grade": "16/20",
    "strengths": ["Point fort 1 tiré du contenu", "Point fort 2"],
    "improvements": ["Axe d'amélioration 1", "Axe d'amélioration 2"],
    "summary": "Synthèse pédagogique constructive"
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
