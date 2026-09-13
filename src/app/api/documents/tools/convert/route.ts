import { NextRequest, NextResponse } from 'next/server';
import { documentToolsService } from '@/services/documentToolsService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
    const fileSize = typeof body.fileSize === 'string' ? body.fileSize.trim() : '1.2 Mo';

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: 'Nom de fichier manquant.' },
        { status: 400 }
      );
    }

    const lower = fileName.toLowerCase();
    if (!lower.endsWith('.doc') && !lower.endsWith('.docx')) {
      return NextResponse.json(
        { success: false, message: 'Format invalide. Seuls les fichiers Word (.doc, .docx) sont autorisés.' },
        { status: 400 }
      );
    }

    const processedDoc = await documentToolsService.convertWordToPdf(fileName, fileSize);

    return NextResponse.json({
      success: true,
      document: processedDoc,
      message: 'Conversion Word vers PDF effectuée avec succès.',
    });
  } catch (err) {
    console.error('API Convert error:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la conversion du fichier.' },
      { status: 500 }
    );
  }
}
