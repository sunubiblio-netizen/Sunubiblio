import { ContactCategory, ContactFAQItem } from '@/types/contact';

/**
 * SOURCE DE DONNÉES UNIQUE POUR LES COORDONNÉES ET LA CONFIGURATION DU CONTACT
 * Ne jamais dupliquer ces coordonnées en dur dans les composants.
 */
export const CONTACT_INFO = {
  phone: '+221 78 439 63 26',
  phoneRaw: '+221784396326',
  email: 'sunubiblio@gmail.com',
  availabilityTitle: 'Nous contacter',
  availabilityDescription:
    'Pour toute question concernant Sunubiblio, nos ressources, nos abonnements ou votre compte personnel.',
};

export const CONTACT_CATEGORIES: ContactCategory[] = [
  'Question générale',
  'Compte',
  'Bibliothèque',
  'Concours',
  'Abonnement',
  'Paiement',
  'Problème technique',
  'Suggestion',
  'Partenariat',
  'Autre',
];

export const CONTACT_FAQS: ContactFAQItem[] = [
  {
    id: 'faq_contact_1',
    question: 'Comment contacter Sunubiblio ?',
    answer:
      'Vous pouvez joindre notre équipe directement par téléphone au +221 78 439 63 26, par email à sunubiblio@gmail.com, ou simplement en remplissant le formulaire de contact sur cette page. Nous traitons chaque demande avec attention.',
  },
  {
    id: 'faq_contact_2',
    question: 'Comment signaler un problème avec une ressource ?',
    answer:
      'Si vous constatez une erreur dans un document, une annale ou un corrigé, sélectionnez la catégorie « Bibliothèque » ou « Concours » dans le formulaire ci-dessous en précisant le titre de la ressource. Nos équipes pédagogiques procéderont à la vérification et à la mise à jour.',
  },
  {
    id: 'faq_contact_3',
    question: 'Que faire si mon paiement n’est pas confirmé ?',
    answer:
      'Les paiements par Wave et Orange Money sont généralement validés en quelques secondes. Si votre compte n’est pas activé automatiquement, choisissez la catégorie « Paiement » dans le formulaire en indiquant le numéro de téléphone utilisé pour la transaction afin que nous puissions débloquer vos accès immédiatement.',
  },
  {
    id: 'faq_contact_4',
    question: 'Comment demander de l’aide concernant mon compte ?',
    answer:
      'Pour toute difficulté de connexion, de mot de passe oublié ou de gestion de vos favoris et téléchargements, sélectionnez la catégorie « Compte » dans le formulaire. Nous vous aiderons à retrouver un accès complet à votre espace.',
  },
  {
    id: 'faq_contact_5',
    question: 'Comment proposer une ressource ou un partenariat ?',
    answer:
      'Vous êtes une école, une université, un centre de formation ou un enseignant souhaitant partager des cours ou annales ? Sélectionnez la catégorie « Partenariat » pour nous décrire votre proposition de collaboration éducative.',
  },
];
