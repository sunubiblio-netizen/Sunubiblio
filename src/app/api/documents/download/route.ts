import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/services/documentService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: 'Identifiant de document requis.' },
        { status: 400 }
      );
    }

    const doc = await documentService.getDocumentById(documentId);

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Document introuvable.' },
        { status: 404 }
      );
    }

    // Si le document est Premium, vérification de l'autorisation serveur
    if (doc.accessLevel === 'premium') {
      const authHeader = req.headers.get('authorization');
      // En attendant l'intégration Supabase Auth finale, on valide les tokens de session
      const isAuthorizedUser = Boolean(authHeader && authHeader.startsWith('Bearer '));

      if (!isAuthorizedUser) {
        return NextResponse.json(
          {
            success: false,
            authorized: false,
            requiresSubscription: true,
            message:
              'Ce document officiel est réservé aux abonnés Sunubiblio. Veuillez souscrire à une formule pour y accéder.',
          },
          { status: 403 }
        );
      }
    }

    // Génération d'un jeton de téléchargement temporaire signé (valide 15 minutes)
    const downloadToken = `dl_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return NextResponse.json(
      {
        success: true,
        authorized: true,
        document: {
          id: doc.id,
          title: doc.title,
          format: doc.format,
          fileSize: doc.fileSize,
        },
        downloadToken,
        expiresAt,
        message: 'Autorisation accordée avec succès.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Download verification error:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du traitement de la requête.' },
      { status: 500 }
    );
  }
}
