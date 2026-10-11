export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  badge?: string;
  href: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'bibliotheque',
    title: 'Bibliothèque',
    subtitle: 'Livres, cours, annales...',
    iconBg: 'rgba(217, 119, 6, 0.08)',
    iconColor: '#d97706',
    borderColor: 'rgba(217, 119, 6, 0.2)',
    href: '/bibliotheque',
    icon: 'book',
  },
  {
    id: 'education',
    title: 'Éducation',
    subtitle: 'Du primaire au doctorat',
    iconBg: 'rgba(14, 165, 233, 0.08)',
    iconColor: '#0ea5e9',
    borderColor: 'rgba(14, 165, 233, 0.2)',
    href: '/education',
    icon: 'school',
  },
  {
    id: 'concours',
    title: 'Concours',
    subtitle: 'Sénégal et International',
    iconBg: 'rgba(236, 72, 153, 0.08)',
    iconColor: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    href: '/concours',
    icon: 'trophy',
  },
  {
    id: 'documents',
    title: 'Documents',
    subtitle: 'Administratifs, guides...',
    iconBg: 'rgba(16, 185, 129, 0.08)',
    iconColor: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    href: '/documents',
    icon: 'file-text',
  },
  {
    id: 'religion',
    title: 'Religion',
    subtitle: 'Islam, Christianisme...',
    iconBg: 'rgba(245, 158, 11, 0.08)',
    iconColor: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    href: '/religion',
    icon: 'home',
  },
  {
    id: 'ia-assistant',
    title: 'IA',
    subtitle: 'Résumé, QCM, exercices...',
    iconBg: 'rgba(139, 92, 246, 0.08)',
    iconColor: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    href: '/ia',
    icon: 'brain',
  },
  {
    id: 'exercices',
    title: 'Exercices',
    subtitle: 'QCM, corrections, scores...',
    iconBg: 'rgba(6, 182, 212, 0.08)',
    iconColor: '#06b6d4',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    href: '/exercices',
    icon: 'clipboard-check',
  },
  {
    id: 'communaute',
    title: 'Communauté',
    subtitle: 'Échangez, partagez, progressez',
    iconBg: 'rgba(217, 70, 239, 0.08)',
    iconColor: '#d946ef',
    borderColor: 'rgba(217, 70, 239, 0.2)',
    href: '/communaute',
    icon: 'users',
  },
];

export const POPULAR_TAGS = [
  'Mathématiques',
  'Annales',
  'Baccalauréat',
  'Informatique',
  'Sciences',
  'Concours FASTEF',
  'Droit',
  'Médecine',
];

export const FEATURES = [
  {
    id: 'speed',
    icon: 'zap',
    iconBg: 'rgba(217, 119, 6, 0.08)',
    iconColor: '#d97706',
    title: 'Accès immédiat',
    desc: 'Commencez dès maintenant',
  },
  {
    id: 'security',
    icon: 'shield',
    iconBg: 'rgba(14, 165, 233, 0.08)',
    iconColor: '#0ea5e9',
    title: 'Contenus sécurisés',
    desc: 'Protection de vos données',
  },
  {
    id: 'devices',
    icon: 'device',
    iconBg: 'rgba(139, 92, 246, 0.08)',
    iconColor: '#8b5cf6',
    title: 'Multi-supports',
    desc: 'Ordinateur, tablette, mobile',
  },
  {
    id: 'flexibility',
    icon: 'heart',
    iconBg: 'rgba(245, 158, 11, 0.08)',
    iconColor: '#f59e0b',
    title: 'Apprentissage flexible',
    desc: 'À votre rythme, partout',
  },
];
