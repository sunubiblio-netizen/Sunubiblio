import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Jeton de téléchargement sécurisé manquant ou expiré.' },
        { status: 401 }
      );
    }

    let payload: { id: string; exp: string; uid: string };
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json(
        { error: 'Jeton de téléchargement invalide.' },
        { status: 403 }
      );
    }

    if (new Date(payload.exp).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Lien de téléchargement temporaire expiré. Veuillez réactualiser la demande.' },
        { status: 410 }
      );
    }

    const resource = INITIAL_RELIGION_RESOURCES.find((r) => r.id === payload.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Document introuvable.' },
        { status: 404 }
      );
    }

    // Réponse streamée avec headers sécurisés anti-fuite
    const filename = `${resource.slug || 'document'}.pdf`;
    return new NextResponse(
      `%PDF-1.4\n% Sunubiblio Protected Document: ${resource.titre} by ${resource.auteur}\n% Authorized for secure viewing only.\n%%EOF`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error) {
    console.error('Erreur API religion/download:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du téléchargement sécurisé.' },
      { status: 500 }
    );
  }
}
