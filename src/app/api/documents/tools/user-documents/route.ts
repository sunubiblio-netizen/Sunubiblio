import { NextRequest, NextResponse } from 'next/server';
import { documentToolsService } from '@/services/documentToolsService';

export async function GET() {
  try {
    const docs = await documentToolsService.getUserDocuments();
    return NextResponse.json({
      success: true,
      documents: docs,
    });
  } catch (err) {
    console.error('API User Documents GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération de vos documents.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Identifiant du document requis.' },
        { status: 400 }
      );
    }

    const deleted = await documentToolsService.deleteUserDocument(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Document introuvable ou déjà supprimé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document supprimé en toute sécurité.',
    });
  } catch (err) {
    console.error('API User Documents DELETE error:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la suppression du document.' },
      { status: 500 }
    );
  }
}
