export interface EtablissementItem {
  id: string;
  name: string;
  type: 'universite' | 'ecole' | 'institut';
  typeLabel: string;
  city: string;
  country: string;
  description: string;
  logoText: string;
  badge?: string;
  verified: boolean;
  featured: boolean;
  // Les 8 composantes de la demande
  formations: string[];
  inscriptionsStatus: 'ouvertes' | 'bientot' | 'cloturees';
  inscriptionsDeadline?: string;
  portesOuvertes?: {
    date: string;
    lieu: string;
    mode: 'presentiel' | 'en_ligne' | 'hybride';
  };
  bourses?: {
    titre: string;
    montantOuType: string;
    conditions: string;
  }[];
  annonces?: {
    id: string;
    titre: string;
    date: string;
    badge: 'Annonce' | 'Urgent' | 'Concours' | 'Info';
  }[];
}

export const MOCK_ETABLISSEMENTS: EtablissementItem[] = [
  {
    id: 'ucad',
    name: 'Université Cheikh Anta Diop (UCAD)',
    type: 'universite',
    typeLabel: 'Université Publique',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Première université francophone d’Afrique de l’Ouest, pôle d’excellence académique, scientifique et de recherche multidisciplinaire.',
    logoText: 'UCAD',
    badge: 'Université d’Excellence',
    verified: true,
    featured: true,
    formations: [
      'Faculté des Sciences & Techniques (FST)',
      'Faculté de Médecine, Pharmacie et Odonto-Stomatologie (FMPOS)',
      'Faculté des Lettres & Sciences Humaines (FLSH)',
      'Faculté des Sciences Économiques et de Gestion (FASEG)',
      'École Supérieure Polytechnique (ESP)',
      'Institut National Supérieur de l’Éducation Populaire et du Sport (INSEPS)',
    ],
    inscriptionsStatus: 'ouvertes',
    inscriptionsDeadline: '30 Novembre 2026',
    portesOuvertes: {
      date: '15 Octobre 2026',
      lieu: 'Campus Central & Amphi UCAD II',
      mode: 'hybride',
    },
    bourses: [
      {
        titre: 'Bourses Nationales d’Études Supérieures (Direction des Bourses)',
        montantOuType: 'Bourse entière & Demi-bourse',
        conditions: 'Bacheliers et étudiants réguliers selon critères académiques officiels.',
      },
      {
        titre: 'Bourse d’Excellence Recherche & Doctorat',
        montantOuType: 'Financement complet de thèse',
        conditions: 'Sélection sur projet de recherche innovant.',
      },
    ],
    annonces: [
      {
        id: 'ann-1',
        titre: 'Ouverture des pré-inscriptions sur la plateforme nationale Campusen',
        date: 'Il y a 2 jours',
        badge: 'Urgent',
      },
      {
        id: 'ann-2',
        titre: 'Séminaire doctoral international : Sciences & Développement Durable',
        date: 'Il y a 5 jours',
        badge: 'Info',
      },
    ],
  },
  {
    id: 'ugb',
    name: 'Université Gaston Berger (UGB)',
    type: 'universite',
    typeLabel: 'Université Publique d’Excellence',
    city: 'Saint-Louis',
    country: 'Sénégal',
    description: 'Université d’excellence réputée pour ses UFR d’informatique appliquée, de mathématiques, de droit et de sciences agronomiques.',
    logoText: 'UGB',
    badge: 'Pôle d’Excellence',
    verified: true,
    featured: true,
    formations: [
      'UFR Sciences Appliquées et Technologies (SAT)',
      'UFR Sciences Économiques et de Gestion (SEG)',
      'UFR Sciences Juridiques et Politiques (SJP)',
      'UFR Sciences Agronomiques et d’Aquaculture (S2ATA)',
    ],
    inscriptionsStatus: 'ouvertes',
    inscriptionsDeadline: '15 Décembre 2026',
    portesOuvertes: {
      date: '22 Octobre 2026',
      lieu: 'Village Sanar, Saint-Louis & Visioconférence',
      mode: 'hybride',
    },
    bourses: [
      {
        titre: 'Bourse d’Excellence UGB en Génie Informatique & IA',
        montantOuType: 'Prise en charge intégrale',
        conditions: 'Mention Très Bien au Baccalauréat Scientifique.',
      },
    ],
    annonces: [
      {
        id: 'ann-3',
        titre: 'Lancement du nouveau Master Data Science & Intelligence Artificielle',
        date: 'Il y a 3 jours',
        badge: 'Annonce',
      },
    ],
  },
  {
    id: 'esp-dakar',
    name: 'École Supérieure Polytechnique (ESP)',
    type: 'ecole',
    typeLabel: 'Grande École d’Ingénieurs',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Institution phare formant l’élite des ingénieurs, techniciens supérieurs et managers technologiques du continent.',
    logoText: 'ESP',
    badge: 'Grande École',
    verified: true,
    featured: true,
    formations: [
      'Diplôme d’Ingénieur de Conception (Génie Électrique, Mécanique, Informatique)',
      'Diplôme Supérieur de Technologie (DST)',
      'Licences & Masters Professionnels Technologiques',
    ],
    inscriptionsStatus: 'ouvertes',
    inscriptionsDeadline: '25 Octobre 2026',
    portesOuvertes: {
      date: '18 Octobre 2026',
      lieu: 'Campus ESP Dakar, Fann Résidence',
      mode: 'presentiel',
    },
    bourses: [
      {
        titre: 'Bourse Entreprises Partenaires Tech & Énergie',
        montantOuType: 'Frais de scolarité + allocation mensuelle',
        conditions: 'Admis sur concours avec projet industriel.',
      },
    ],
    annonces: [
      {
        id: 'ann-4',
        titre: 'Résultats du concours d’entrée en 1ère année du cycle d’ingénieurs',
        date: 'Hier',
        badge: 'Concours',
      },
    ],
  },
  {
    id: 'ism-groupe',
    name: 'Groupe ISM (Institut Supérieur de Management)',
    type: 'institut',
    typeLabel: 'Institut Privé International',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Pionnier de l’enseignement supérieur privé de gestion, de droit, de digital et de sciences politiques en Afrique francophone.',
    logoText: 'ISM',
    badge: 'International',
    verified: true,
    featured: false,
    formations: [
      'Bachelors en Management & Marketing International',
      'Masters Grande École (Finance, Audit, Ressources Humaines)',
      'ISM Digital Campus (Cyber-sécurité, Développement Web, IA)',
      'École de Droit et de Sciences Politiques',
    ],
    inscriptionsStatus: 'ouvertes',
    inscriptionsDeadline: 'Session continue 2026',
    portesOuvertes: {
      date: '28 Octobre 2026',
      lieu: 'Campus Point E & diffusion live',
      mode: 'hybride',
    },
    bourses: [
      {
        titre: 'Bourses d’Étude Solidarité & Mérite ISM',
        montantOuType: 'Exonération de 25% à 50% de la scolarité',
        conditions: 'Étude de dossier académique et critères sociaux.',
      },
    ],
    annonces: [
      {
        id: 'ann-5',
        titre: 'Session spéciale d’admission : Tests d’aptitude et entretiens de motivation',
        date: 'Cette semaine',
        badge: 'Info',
      },
    ],
  },
  {
    id: 'lycee-excellence',
    name: 'Lycée Scientifique d’Excellence de Diourbel',
    type: 'ecole',
    typeLabel: 'Lycée Public d’Élite',
    city: 'Diourbel',
    country: 'Sénégal',
    description: 'Pôle national d’excellence scientifique préparant les meilleurs élèves du Sénégal aux concours internationaux et prépas scientifiques.',
    logoText: 'LSED',
    badge: 'Élite Nationale',
    verified: true,
    featured: true,
    formations: [
      'Seconde Scientifique d’Élite',
      'Première S1 & S2',
      'Terminale S1 d’Excellence',
      'Classes Préparatoires aux Grandes Écoles (CPGE scientifiques)',
    ],
    inscriptionsStatus: 'bientot',
    inscriptionsDeadline: 'Concours national d’août',
    portesOuvertes: {
      date: '5 Novembre 2026',
      lieu: 'Campus Diourbel',
      mode: 'presentiel',
    },
    bourses: [
      {
        titre: 'Internat d’Excellence de l’État du Sénégal',
        montantOuType: 'Prise en charge intégrale (hébergement, restauration, fournitures)',
        conditions: 'Lauréats du concours national d’entrée au LSED.',
      },
    ],
    annonces: [
      {
        id: 'ann-6',
        titre: '100% de réussite avec mention au Baccalauréat Scientifique 2026',
        date: 'Récemment',
        badge: 'Annonce',
      },
    ],
  },
  {
    id: 'iam-dakar',
    name: 'Institut Africain de Management (IAM)',
    type: 'institut',
    typeLabel: 'Institut Supérieur de Commerce',
    city: 'Dakar',
    country: 'Sénégal',
    description: 'Grande école de commerce et de technologies de l’information accréditée CAMES et classée parmi les meilleures d’Afrique.',
    logoText: 'IAM',
    badge: 'Accrédité CAMES',
    verified: true,
    featured: false,
    formations: [
      'Bachelor en Affaires Internationales',
      'Master en Banque & Ingénierie Financière',
      'Master Logistique, Transport & Supply Chain',
    ],
    inscriptionsStatus: 'ouvertes',
    inscriptionsDeadline: '30 Octobre 2026',
    portesOuvertes: {
      date: '20 Octobre 2026',
      lieu: 'Campus Mermoz, Dakar',
      mode: 'presentiel',
    },
    bourses: [
      {
        titre: 'Programme Jeunes Talents Féminins',
        montantOuType: 'Bourse partielle de 40%',
        conditions: 'Candidatures féminines en filières technologiques et financières.',
      },
    ],
  },
];
