/**
 * Sunubiblio — Contrôleur Centralisé des Droits d'Accès aux Abonnements
 * 
 * Lit la configuration centrale unique depuis PRICING_PLANS.
 * Ne code aucun prix en dur dans les composants d'interface.
 */

import { PRICING_PLANS } from '@/data/pricingPlans';
import { PricingPlan } from '@/types/pricing';

export type UserPlanSlug = 'gratuit' | 'simple' | 'recommande' | 'gold';

export const subscriptionAccessService = {
  /**
   * Récupère le plan officiellement recommandé dans la configuration centrale
   */
  getRecommendedPlan(): PricingPlan {
    const recommended = PRICING_PLANS.find((p) => p.slug === 'recommande');
    if (!recommended) {
      // Fallback sécurisé vers le plan ayant le badge recommandé ou displayOrder 3
      return PRICING_PLANS[2] || PRICING_PLANS[0];
    }
    return recommended;
  },

  /**
   * Récupère le prix formaté du forfait recommandé (ex: "5 000 FCFA")
   */
  getRecommendedPriceLabel(): string {
    const plan = this.getRecommendedPlan();
    return plan.formattedPrice;
  },

  /**
   * Récupère le libellé d'action pour passer au forfait recommandé
   */
  getUpgradeActionLabel(): string {
    const plan = this.getRecommendedPlan();
    return `Passer au forfait ${plan.formattedPrice}`;
  },

  /**
   * Vérifie si un forfait utilisateur donné a accès aux outils de modification avancée de documents
   * (Nécessite au minimum le forfait Recommandé ou Gold)
   */
  canAccessAdvancedDocumentTools(userPlanSlug: UserPlanSlug = 'gratuit'): boolean {
    return userPlanSlug === 'recommande' || userPlanSlug === 'gold';
  },

  getPlanBySlug(slug: UserPlanSlug): PricingPlan | undefined {
    return PRICING_PLANS.find((p) => p.slug === slug);
  },
};

export const getRecommendedPlan = (): PricingPlan => {
  return subscriptionAccessService.getRecommendedPlan();
};

export const getRecommendedPriceLabel = (): string => {
  return subscriptionAccessService.getRecommendedPriceLabel();
};

export const getUpgradeActionLabel = (): string => {
  return subscriptionAccessService.getUpgradeActionLabel();
};

export const canAccessAdvancedDocumentTools = (userPlanSlug: UserPlanSlug = 'gratuit'): boolean => {
  return subscriptionAccessService.canAccessAdvancedDocumentTools(userPlanSlug);
};

export const getPlanBySlug = (slug: UserPlanSlug): PricingPlan | undefined => {
  return subscriptionAccessService.getPlanBySlug(slug);
};
