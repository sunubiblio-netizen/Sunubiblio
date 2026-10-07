import { NextRequest, NextResponse } from 'next/server';
import { extractDocumentFromBuffer } from '@/services/documentExtractorService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier transmis dans la requête.' },
        { status: 400 }
      );
    }

    // Vérification de la taille (max 20 Mo)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier dépasse la taille maximale autorisée de 20 Mo.' },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractedData = await extractDocumentFromBuffer(
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json({
      success: true,
      text: extractedData.text,
      cleanedTitle: extractedData.cleanedTitle,
      wordCount: extractedData.wordCount,
      keyConcepts: extractedData.keyConcepts,
      summary: extractedData.summary,
    });
  } catch (error: any) {
    console.error('[API extract-document] Erreur lors de l’extraction:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la lecture du document.',
        details: error?.message || 'Format de document non reconnu ou corrompu.'
      },
      { status: 500 }
    );
  }
}
