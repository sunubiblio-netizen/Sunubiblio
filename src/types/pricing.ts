export type PlanBillingPeriod = 'month' | 'year';

export interface PlanFeature {
  id: string;
  label: string;
  included: boolean;
  highlight?: boolean;
  note?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: 'gratuit' | 'simple' | 'recommande' | 'gold';
  price: number;
  currency: 'XOF';
  formattedPrice: string;
  billingPeriod: PlanBillingPeriod;
  periodLabel: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  isGold?: boolean;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'gold';
  features: PlanFeature[];
  displayOrder: number;
}

export interface ComparisonRow {
  name: string;
  category: string;
  gratuit: string | boolean;
  simple: string | boolean;
  recommande: string | boolean;
  gold: string | boolean;
  tooltip?: string;
}

export interface ComparisonCategory {
  title: string;
  rows: ComparisonRow[];
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  iconName: 'wave' | 'orange-money' | 'card';
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface UserSubscriptionState {
  isAuthenticated: boolean;
  activePlanSlug?: 'gratuit' | 'simple' | 'recommande' | 'gold';
  expiresAt?: string;
}
