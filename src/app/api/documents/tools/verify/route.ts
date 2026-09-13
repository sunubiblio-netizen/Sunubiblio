import { NextRequest, NextResponse } from 'next/server';
import { documentToolsService } from '@/services/documentToolsService';
import { DocumentTypeTarget } from '@/types/documentTools';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const targetType = (body.targetType as DocumentTypeTarget) || 'memoire';

    if (!text || text.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Veuillez saisir ou importer un texte d’au moins 10 caractères.' },
        { status: 400 }
      );
    }

    if (text.length > 250000) {
      return NextResponse.json(
        { success: false, message: 'Le texte dépasse la limite autorisée (maximum 250 000 caractères par analyse).' },
        { status: 400 }
      );
    }

    const report = await documentToolsService.analyzeText(text, targetType);

    return NextResponse.json({
      success: true,
      report,
      message: 'Analyse effectuée avec succès.',
    });
  } catch (err) {
    console.error('API Verification error:', err);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de l’analyse du document.' },
      { status: 500 }
    );
  }
}
