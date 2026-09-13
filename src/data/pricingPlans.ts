import {
  PricingPlan,
  ComparisonCategory,
  PaymentMethodItem,
  FAQItem,
} from '@/types/pricing';

/**
 * SOURCE DE DONNÉES UNIQUE POUR LES TARIFS OFFICIELS DE SUNUBIBLIO
 * Ne jamais dupliquer ces prix ailleurs dans le code.
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_gratuit',
    name: 'Gratuit',
    slug: 'gratuit',
    price: 0,
    currency: 'XOF',
    formattedPrice: '0 FCFA',
    billingPeriod: 'month',
    periodLabel: '/ mois',
    description: 'Découvrez Sunubiblio gratuitement.',
    ctaText: 'Commencer gratuitement',
    ctaVariant: 'secondary',
    isPopular: false,
    displayOrder: 1,
    features: [
      { id: 'f1', label: 'Accès partiel à la bibliothèque', included: true },
      { id: 'f2', label: 'Lecture en ligne limitée', included: true },
      { id: 'f3', label: 'Consultation des fiches concours', included: true },
      { id: 'f4', label: 'Exercices et QCM d’initiation', included: true },
      { id: 'f5', label: 'Téléchargements hors connexion', included: false },
      { id: 'f6', label: 'Corrigés détaillés d’annales', included: false },
      { id: 'f7', label: 'Assistance IA d’apprentissage', included: false },
      { id: 'f8', label: 'Support prioritaire', included: false },
    ],
  },
  {
    id: 'plan_simple',
    name: 'Simple',
    slug: 'simple',
    price: 3000,
    currency: 'XOF',
    formattedPrice: '3 000 FCFA',
    billingPeriod: 'month',
    periodLabel: '/ mois',
    description: 'Pour commencer à apprendre avec plus de ressources.',
    ctaText: 'Choisir Simple',
    ctaVariant: 'secondary',
    isPopular: false,
    displayOrder: 2,
    features: [
      { id: 'f1', label: 'Accès étendu aux manuels & cours', included: true },
      { id: 'f2', label: 'Annales officielles récentes', included: true },
      { id: 'f3', label: 'QCM interactifs avec scores', included: true },
      { id: 'f4', label: 'Suivi de progression personnel', included: true },
      { id: 'f5', label: 'Téléchargements hors connexion limités', included: true },
      { id: 'f6', label: 'Corrigés méthodologiques complets', included: false },
      { id: 'f7', label: 'Tuteur IA interactif', included: false },
      { id: 'f8', label: 'Accès multi-appareils simultané', included: false },
    ],
  },
  {
    id: 'plan_recommande',
    name: '5 000 FCFA',
    slug: 'recommande',
    price: 5000,
    currency: 'XOF',
    formattedPrice: '5 000 FCFA',
    billingPeriod: 'month',
    periodLabel: '/ mois',
    badge: 'RECOMMANDÉ',
    isPopular: true,
    description: 'Le meilleur équilibre pour progresser efficacement.',
    ctaText: 'Choisir cette formule',
    ctaVariant: 'primary',
    displayOrder: 3,
    features: [
      { id: 'f1', label: 'Accès illimité à toute la bibliothèque', included: true, highlight: true },
      { id: 'f2', label: 'Tous les concours, programmes & annales', included: true, highlight: true },
      { id: 'f3', label: 'Corrigés officiels étape par étape', included: true },
      { id: 'f4', label: 'Téléchargements hors connexion réguliers', included: true },
      { id: 'f5', label: 'Tuteur IA : explications & synthèses', included: true, highlight: true },
      { id: 'f6', label: 'Favoris et dossiers personnalisés', included: true },
      { id: 'f7', label: 'Synchronisation multi-écrans', included: true },
      { id: 'f8', label: 'Support client réactif', included: true },
    ],
  },
  {
    id: 'plan_gold',
    name: 'Gold',
    slug: 'gold',
    price: 9000,
    currency: 'XOF',
    formattedPrice: '9 000 FCFA',
    billingPeriod: 'month',
    periodLabel: '/ mois',
    isGold: true,
    description: 'Pour profiter d’une expérience complète.',
    ctaText: 'Choisir Gold',
    ctaVariant: 'gold',
    displayOrder: 4,
    features: [
      { id: 'f1', label: 'Tout le catalogue Sunubiblio en illimité', included: true, highlight: true },
      { id: 'f2', label: 'Téléchargements hors connexion illimités', included: true, highlight: true },
      { id: 'f3', label: 'Tuteur IA illimité (générateur QCM & synthèse)', included: true, highlight: true },
      { id: 'f4', label: 'Accès prioritaire aux nouvelles annales 2025', included: true },
      { id: 'f5', label: 'Mode hors ligne illimité sur mobile & PC', included: true },
      { id: 'f6', label: 'Statistiques avancées de maîtrise', included: true },
      { id: 'f7', label: 'Connexion 4 appareils simultanés', included: true },
      { id: 'f8', label: 'Support VIP dédié 7j/7', included: true },
    ],
  },
];

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    title: 'Bibliothèque & Documentation',
    rows: [
      {
        name: 'Accès au catalogue de livres',
        category: 'Bibliothèque',
        gratuit: 'Limité (échantillons)',
        simple: 'Standard (800+ doc)',
        recommande: 'Illimité (1 200+)',
        gold: 'Intégral & Exclusif',
      },
      {
        name: 'Ressources éducatives par niveau',
        category: 'Bibliothèque',
        gratuit: '1er cycle',
        simple: 'Tous cycles',
        recommande: 'Primaire au Master',
        gold: 'Tous cycles + Pro',
      },
      {
        name: 'Mode lecture sans distraction',
        category: 'Bibliothèque',
        gratuit: true,
        simple: true,
        recommande: true,
        gold: true,
      },
    ],
  },
  {
    title: 'Concours & Examens Nationaux',
    rows: [
      {
        name: 'Fiches de concours (FASTEF, ENA, etc.)',
        category: 'Concours',
        gratuit: 'Consultation sommaire',
        simple: 'Programmes officiels',
        recommande: 'Dossiers complets',
        gold: 'Dossiers complets + Bonus',
      },
      {
        name: 'Sujets d’annales corrigées',
        category: 'Concours',
        gratuit: false,
        simple: '3 dernières années',
        recommande: '10 dernières années',
        gold: 'Archives intégrales',
      },
      {
        name: 'Corrigés méthodologiques détaillés',
        category: 'Concours',
        gratuit: false,
        simple: false,
        recommande: true,
        gold: true,
      },
    ],
  },
  {
    title: 'Exercices, QCM & Entraînement',
    rows: [
      {
        name: 'Séries d’exercices corrigés',
        category: 'Exercices',
        gratuit: 'Sélection test',
        simple: 'Standard',
        recommande: 'Banque complète',
        gold: 'Banque complète + Générateur',
      },
      {
        name: 'QCM interactifs auto-évalués',
        category: 'Exercices',
        gratuit: '5 / mois',
        simple: '50 / mois',
        recommande: 'Illimités',
        gold: 'Illimités chronométrés',
      },
      {
        name: 'Suivi de progression et scores',
        category: 'Exercices',
        gratuit: false,
        simple: true,
        recommande: true,
        gold: 'Statistiques détaillées',
      },
    ],
  },
  {
    title: 'Téléchargements & Mobilité',
    rows: [
      {
        name: 'Téléchargements « Mes téléchargements »',
        category: 'Mobilité',
        gratuit: false,
        simple: '5 docs / mois',
        recommande: '25 docs / mois',
        gold: 'Illimités',
      },
      {
        name: 'Lecture hors connexion sécurisée',
        category: 'Mobilité',
        gratuit: false,
        simple: true,
        recommande: true,
        gold: true,
      },
      {
        name: 'Nombre d’appareils connectés',
        category: 'Mobilité',
        gratuit: '1 appareil',
        simple: '1 appareil',
        recommande: '2 appareils',
        gold: '4 appareils',
      },
    ],
  },
  {
    title: 'Intelligence Artificielle & Outils',
    rows: [
      {
        name: 'Tuteur IA pédagogique (explications)',
        category: 'IA',
        gratuit: false,
        simple: false,
        recommande: '50 requêtes / jour',
        gold: 'Illimité',
      },
      {
        name: 'Génération de fiches mémo par IA',
        category: 'IA',
        gratuit: false,
        simple: false,
        recommande: true,
        gold: true,
      },
    ],
  },
  {
    title: 'Compte, Favoris & Support',
    rows: [
      {
        name: 'Gestion des favoris et signets',
        category: 'Compte',
        gratuit: '5 max',
        simple: true,
        recommande: true,
        gold: true,
      },
      {
        name: 'Historique d’apprentissage',
        category: 'Compte',
        gratuit: '7 jours',
        simple: '30 jours',
        recommande: 'Illimité',
        gold: 'Illimité',
      },
      {
        name: 'Assistance et support client',
        category: 'Compte',
        gratuit: 'Standard',
        simple: 'Email 48h',
        recommande: 'Prioritaire 24h',
        gold: 'VIP dédié 7j/7',
      },
    ],
  },
];

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'pm_wave',
    name: 'Wave',
    tagline: 'Paiement instantané par QR Code ou numéro',
    badge: 'Recommandé au Sénégal',
    badgeColor: '#1d4ed8',
    iconName: 'wave',
    description: 'Sans frais supplémentaires. Validation automatique et activation immédiate.',
  },
  {
    id: 'pm_om',
    name: 'Orange Money',
    tagline: 'Paiement direct via compte Orange Money',
    badge: 'Disponible partout',
    badgeColor: '#ea580c',
    iconName: 'orange-money',
    description: 'Réglez avec votre code secret de paiement sécurisé depuis votre téléphone.',
  },
  {
    id: 'pm_card',
    name: 'Carte bancaire',
    tagline: 'Visa, Mastercard & cartes internationales',
    badge: 'Sécurisé 3D Secure',
    badgeColor: '#059669',
    iconName: 'card',
    description: 'Transaction chiffrée par protocole bancaire international. Zéro donnée stockée.',
  },
];

export const TRUST_POINTS = [
  {
    icon: 'lock',
    title: 'Paiement sécurisé',
    description: 'Transactions chiffrées de bout en bout via des prestataires agréés conformes aux normes bancaires.',
  },
  {
    icon: 'book',
    title: 'Des ressources vérifiées',
    description: 'Plus de 1 200 documents pédagogiques, manuels conformes aux programmes et corrigés méthodologiques.',
  },
  {
    icon: 'devices',
    title: 'Accessible partout',
    description: 'Compatible smartphone, tablette et ordinateur avec synchronisation automatique de votre progression.',
  },
  {
    icon: 'bolt',
    title: 'Activation immédiate',
    description: 'Accès instantané à vos privilèges dès la confirmation sécurisée du paiement côté serveur.',
  },
];

export const PRICING_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    question: 'Puis-je commencer gratuitement ?',
    answer:
      'Oui, absolument. La formule Gratuit à 0 FCFA vous permet de créer un compte apprenant et de découvrir Sunubiblio avec une sélection de cours, d’extraits de manuels et de QCM d’initiation, sans limite de temps.',
  },
  {
    id: 'faq_2',
    question: 'Puis-je changer de formule plus tard ?',
    answer:
      'Oui, à tout moment. Vous pouvez passer d’une formule à une autre directement depuis votre espace personnel. Lorsque vous passez à une formule supérieure, vos nouveaux privilèges sont appliqués immédiatement.',
  },
  {
    id: 'faq_3',
    question: 'Comment fonctionne le paiement ?',
    answer:
      'Le paiement s’effectue en ligne en toute sécurité via Wave, Orange Money ou carte bancaire. Vous recevez un reçu numérique officiel et votre compte est mis à niveau automatiquement dès que la transaction est confirmée par le serveur.',
  },
  {
    id: 'faq_4',
    question: 'Quand mon abonnement est-il activé ?',
    answer:
      'Votre abonnement est activé immédiatement dès la confirmation du paiement par notre passerelle bancaire (généralement en moins de 10 secondes). Vos téléchargements et contenus Premium deviennent aussitôt accessibles.',
  },
  {
    id: 'faq_5',
    question: 'Que se passe-t-il lorsque mon abonnement expire ?',
    answer:
      'Si votre abonnement arrive à échéance sans renouvellement, votre compte bascule automatiquement en formule Gratuit. Vous conservez votre historique et vos favoris enregistrés, mais l’accès aux contenus exclusifs Premium est temporairement suspendu jusqu’au réabonnement.',
  },
  {
    id: 'faq_6',
    question: 'Puis-je résilier mon abonnement ?',
    answer:
      'Oui. Chez Sunubiblio, vous êtes libre sans engagement contraignant. Vous pouvez interrompre le renouvellement automatique à tout moment en un clic depuis les paramètres de votre compte.',
  },
];
