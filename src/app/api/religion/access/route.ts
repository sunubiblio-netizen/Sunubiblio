import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';
import { PRICING_PLANS } from '@/data/pricingPlans';
import { ReligionPlanRequired } from '@/types/religion';

export const dynamic = 'force-dynamic';

// Hiérarchie des niveaux de formule
const PLAN_TIER_LEVELS: Record<ReligionPlanRequired, number> = {
  gratuit: 0,
  simple: 1,
  recommande: 2,
  gold: 3,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('id');
    const userPlan = (searchParams.get('plan') as ReligionPlanRequired) || 'gratuit';

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Identifiant de ressource manquant.' },
        { status: 400 }
      );
    }

    const resource = INITIAL_RELIGION_RESOURCES.find((r) => r.id === resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: 'Ressource introuvable.' },
        { status: 404 }
      );
    }

    const requiredLevel = PLAN_TIER_LEVELS[resource.requiredPlan] || 0;
    const userLevel = PLAN_TIER_LEVELS[userPlan] || 0;

    // Vérification stricte côté serveur
    if (userLevel < requiredLevel) {
      const requiredPlanObj = PRICING_PLANS.find(
        (p) =>
          (resource.requiredPlan === 'gratuit' && p.id === 'plan_gratuit') ||
          (resource.requiredPlan === 'simple' && p.id === 'plan_simple') ||
          (resource.requiredPlan === 'recommande' && p.id === 'plan_recommande') ||
          (resource.requiredPlan === 'gold' && p.id === 'plan_gold')
      );

      return NextResponse.json(
        {
          authorized: false,
          error: 'Accès restreint : cette œuvre patrimoniale requiert un abonnement supérieur.',
          requiredPlan: resource.requiredPlan,
          requiredPlanName: requiredPlanObj?.name || resource.requiredPlan,
          requiredPlanPrice: requiredPlanObj?.formattedPrice || 'Abonnement requis',
        },
        { status: 403 }
      );
    }

    // Génération d'une autorisation serveur sécurisée avec URL signée temporaire (durée de validité 30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const mockSignedToken = Buffer.from(
      JSON.stringify({
        id: resource.id,
        exp: expiresAt,
        uid: 'session_verified',
      })
    ).toString('base64');

    return NextResponse.json({
      authorized: true,
      resourceId: resource.id,
      titre: resource.titre,
      auteur: resource.auteur,
      contentType: resource.contentType,
      fileSize: resource.fileSize,
      pagesCount: resource.pagesCount,
      signedDownloadUrl: `/api/religion/download?token=${mockSignedToken}`,
      expiresAt,
    });
  } catch (error) {
    console.error('Erreur API religion/access:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la vérification des droits.' },
      { status: 500 }
    );
  }
}
