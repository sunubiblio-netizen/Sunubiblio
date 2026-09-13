import { NextRequest, NextResponse } from 'next/server';
import { documentToolsService } from '@/services/documentToolsService';
import { subscriptionAccessService, UserPlanSlug } from '@/services/subscriptionAccessService';
import { PdfAnnotationItem, PdfPageState } from '@/types/documentTools';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userPlan = (body.userPlanSlug as UserPlanSlug) || 'gratuit';
    const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : 'document.pdf';
    const annotations = (body.annotations as PdfAnnotationItem[]) || [];
    const pagesState = (body.pagesState as PdfPageState[]) || [];

    // VÉRIFICATION D'AUTORISATION STRICTE CÔTÉ SERVEUR
    const hasAccess = subscriptionAccessService.canAccessAdvancedDocumentTools(userPlan);

    if (!hasAccess) {
      const recommendedPlan = subscriptionAccessService.getRecommendedPlan();
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          requiresSubscription: true,
          recommendedPlan: {
            id: recommendedPlan.id,
            name: recommendedPlan.name,
            formattedPrice: recommendedPlan.formattedPrice,
            slug: recommendedPlan.slug,
          },
          message: 'Cette fonctionnalité est disponible avec le forfait recommandé.',
        },
        { status: 403 }
      );
    }

    const processedDoc = await documentToolsService.editPdf(fileName, annotations, pagesState);

    return NextResponse.json({
      success: true,
      authorized: true,
      document: processedDoc,
      message: 'Modifications appliquées et enregistrées avec succès.',
    });
  } catch (err) {
    console.error('API PDF Edit error:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la modification du PDF.' },
      { status: 500 }
    );
  }
}
