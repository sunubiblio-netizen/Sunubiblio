import { Resource, CycleItem, FilterOption } from '@/types/library';

export const EDUCATION_CYCLES: CycleItem[] = [
  {
    id: 'primaire',
    label: 'Primaire',
    grades: [
      { id: 'ci', name: 'Cours d’Initiation (CI)', short: 'CI' },
      { id: 'cp', name: 'Cours Préparatoire (CP)', short: 'CP' },
      { id: 'ce1', name: 'Cours Élémentaire 1 (CE1)', short: 'CE1' },
      { id: 'ce2', name: 'Cours Élémentaire 2 (CE2)', short: 'CE2' },
      { id: 'cm1', name: 'Cours Moyen 1 (CM1)', short: 'CM1' },
      { id: 'cm2', name: 'Cours Moyen 2 (CM2 / CFEE)', short: 'CM2' },
    ],
  },
  {
    id: 'college',
    label: 'Collège',
    grades: [
      { id: '6e', name: 'Sixième (6e)', short: '6e' },
      { id: '5e', name: 'Cinquième (5e)', short: '5e' },
      { id: '4e', name: 'Quatrième (4e)', short: '4e' },
      { id: '3e', name: 'Troisième (3e / BFEM)', short: '3e' },
    ],
  },
  {
    id: 'lycee',
    label: 'Lycée',
    grades: [
      { id: '2nde_s', name: 'Seconde S (Scientifique)', short: '2nde S' },
      { id: '2nde_l', name: 'Seconde L (Littéraire)', short: '2nde L' },
      { id: '1ere_s', name: 'Première S1/S2', short: '1ère S' },
      { id: '1ere_l', name: 'Première L1/L2', short: '1ère L' },
      { id: 'tle_s', name: 'Terminale S1/S2 (Baccalauréat)', short: 'Terminale S' },
      { id: 'tle_l', name: 'Terminale L1/L2 (Baccalauréat)', short: 'Terminale L' },
    ],
  },
  {
    id: 'universite',
    label: 'Université',
    grades: [
      { id: 'l1', name: 'Licence 1 (L1)', short: 'Licence 1' },
      { id: 'l2', name: 'Licence 2 (L2)', short: 'Licence 2' },
      { id: 'l3', name: 'Licence 3 (L3)', short: 'Licence 3' },
      { id: 'm1_m2', name: 'Master 1 & 2', short: 'Master' },
      { id: 'doctorat', name: 'Doctorat & Recherche', short: 'Doctorat' },
    ],
  },
];

export const QUICK_CATEGORIES = [
  { id: 'all', label: 'Toutes les ressources' },
  { id: 'livres', label: 'Livres' },
  { id: 'cours', label: 'Cours' },
  { id: 'annales', label: 'Annales' },
  { id: 'exercices', label: 'Exercices' },
  { id: 'documents', label: 'Documents' },
  { id: 'informatique', label: 'Informatique' },
  { id: 'sciences', label: 'Sciences' },
  { id: 'business', label: 'Business & Entrepreneuriat' },
  { id: 'litterature', label: 'Littérature' },
  { id: 'finance', label: 'Finance & Management' },
  { id: 'dev_perso', label: 'Développement personnel' },
  { id: 'religion', label: 'Religion & Spiritualité' },
];

export const SUBJECT_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'Toutes les matières' },
  { id: 'mathematiques', label: 'Mathématiques' },
  { id: 'francais', label: 'Français & Littérature' },
  { id: 'anglais', label: 'Anglais' },
  { id: 'physique_chimie', label: 'Physique - Chimie' },
  { id: 'svt', label: 'Sciences de la Vie et de la Terre (SVT)' },
  { id: 'informatique', label: 'Informatique & Algorithmique' },
  { id: 'histoire_geo', label: 'Histoire & Géographie' },
  { id: 'philosophie', label: 'Philosophie' },
  { id: 'economie', label: 'Sciences Économiques & Gestion' },
  { id: 'droit', label: 'Droit & Sciences Politiques' },
];

export const RESOURCE_TYPES: FilterOption[] = [
  { id: 'all', label: 'Tous les formats' },
  { id: 'pdf', label: 'Fascicule / Manuel PDF' },
  { id: 'cours', label: 'Cours structuré' },
  { id: 'annale', label: 'Annale & Sujets d’examen' },
  { id: 'exercice', label: 'Cahier d’exercices' },
  { id: 'qcm', label: 'QCM interactif' },
  { id: 'livre', label: 'Livre & Ouvrage' },
  { id: 'doc', label: 'Document officiel' },
];

export const ACCESS_LEVELS: FilterOption[] = [
  { id: 'all', label: 'Tous les accès' },
  { id: 'free', label: 'Gratuit' },
  { id: 'subscription', label: 'Inclus dans l’abonnement' },
  { id: 'premium', label: 'Premium Gold' },
];

export const COMPETITION_TAGS = [
  { id: 'fastef', label: 'FASTEF Dakar', count: 42 },
  { id: 'ena', label: 'ENA Sénégal', count: 38 },
  { id: 'police', label: 'Concours Police', count: 24 },
  { id: 'douane', label: 'Concours Douane', count: 19 },
  { id: 'bac_s', label: 'Baccalauréat S1-S2', count: 156 },
  { id: 'bac_l', label: 'Baccalauréat L1-L2', count: 128 },
  { id: 'bfem', label: 'BFEM Général', count: 94 },
  { id: 'cfee', label: 'CFEE Primaire', count: 62 },
];

export const RELIGION_SUB_OPTIONS = [
  { id: 'all_rel', label: 'Toutes les traditions' },
  { id: 'islam_mouride', label: 'Islam — Mouride (Touba)' },
  { id: 'islam_tidiane', label: 'Islam — Tidiane (Tivaouane)' },
  { id: 'islam_niassene', label: 'Islam — Niassène (Kaolack)' },
  { id: 'islam_layene', label: 'Islam — Layène (Yoff/Cambérène)' },
  { id: 'islam_general', label: 'Islam — Hadiths & Coran' },
  { id: 'christianisme', label: 'Christianisme & Théologie' },
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    slug: 'mathematiques-terminale-s-cours-exercices',
    title: 'Mathématiques — Cours complet & 300 Exercices résolus',
    subtitle: 'Conforme au programme national du Sénégal et de la zone UEMOA',
    author: 'Prof. Amadou Ndiaye',
    institution: 'FASTEF / UCAD',
    category: 'cours',
    level: { cycle: 'lycee', grade: 'Terminale S' },
    subject: 'mathematiques',
    resourceType: 'pdf',
    pagesCount: 284,
    rating: 4.9,
    reviewsCount: 342,
    year: 2024,
    accessLevel: 'free',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
    coverBadgeColor: '#3b82f6',
    description: 'Manuel de référence couvrant l’analyse réelle, les nombres complexes, les probabilités et la géométrie dans l’espace pour le Bac S1/S2.',
    downloadsCount: 14200,
    keyConcepts: ['Fonctions logarithme et exponentielle', 'Nombres complexes', 'Calcul intégral', 'Probabilités conditionnelles', 'Suites numériques'],
    extractedText: `PROGRAMME OFFICIEL DE MATHÉMATIQUES — TERMINALE S1 & S2

CHAPITRE 1 : FONCTIONS LOGARITHME NÉPÉRIEN ET EXPONENTIELLE
Définition : La fonction logarithme népérien, notée ln, est l'unique primitive sur ]0 ; +∞[ de la fonction x ↦ 1/x qui s'annule en 1.
Propriétés fondamentales :
Pour tous réels a > 0 et b > 0 :
ln(a * b) = ln(a) + ln(b)
ln(a / b) = ln(a) - ln(b)
ln(a^n) = n * ln(a)
Dérivée : Pour toute fonction dérivable u strictement positive, la dérivée de ln(u) est u'/u.
Limites remarquables :
lim (x→+∞) ln(x) = +∞
lim (x→0+) ln(x) = -∞
Croissances comparées : lim (x→+∞) ln(x)/x = 0 et lim (x→0+) x*ln(x) = 0.

CHAPITRE 2 : NOMBRES COMPLEXES ET GÉOMÉTRIE DU PLAN
Forme algébrique : Tout nombre complexe z s'écrit de manière unique z = a + ib, avec a = Re(z) et b = Im(z).
Module et argument : Le module est défini par |z| = sqrt(a² + b²).
Formule d'Euler : Pour tout réel θ, e^(iθ) = cos(θ) + i*sin(θ).
Formule de Moivre : (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ).
Théorème fondamental de l'algèbre : Tout polynôme non constant à coefficients complexes admet au moins une racine dans C.

CHAPITRE 3 : CALCUL INTÉGRAL ET PRIMITIVES
Définition : Soit f une fonction continue sur [a, b]. L'intégrale de f de a à b est notée ∫[a,b] f(t)dt = F(b) - F(a), où F est une primitive de f.
Intégration par parties : ∫[a,b] u'(t)*v(t)dt = [u(t)*v(t)][a,b] - ∫[a,b] u(t)*v'(t)dt.

CHAPITRE 4 : PROBABILITÉS CONDITIONNELLES
Formule des probabilités totales : Si (A_i) forme une partition de l'univers Ω, pour tout événement B :
P(B) = Σ P(B ∩ A_i) = Σ P(A_i) * P(B | A_i).
Formule de Bayes : P(A|B) = (P(A) * P(B|A)) / P(B).`,
  },
  {
    id: 'res-2',
    slug: 'annales-baccalaureat-s-2015-2024-senegal',
    title: 'Annales Baccalauréat S1 & S2 — Épreuves et Corrigés 2015-2024',
    subtitle: 'Mathématiques, Sciences Physiques et SVT',
    author: 'Collectif des Inspecteurs de l’Enseignement Secondaire',
    institution: 'Office du Baccalauréat du Sénégal',
    category: 'annales',
    level: { cycle: 'lycee', grade: 'Terminale S' },
    subject: 'mathematiques',
    resourceType: 'annale',
    pagesCount: 420,
    rating: 4.8,
    reviewsCount: 512,
    year: 2024,
    accessLevel: 'subscription',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #475569 100%)',
    coverBadgeColor: '#0ea5e9',
    description: '10 années complètes de sujets officiels commentés pas à pas avec barèmes détaillés et conseils méthodologiques des correcteurs.',
    downloadsCount: 22400,
  },
  {
    id: 'res-3',
    slug: 'preparation-concours-ena-senegal-culture-generale-droit',
    title: 'Préparation Concours ENA — Culture Générale & Droit Public',
    subtitle: 'Méthodologie de la dissertation administrative et synthèse de dossier',
    author: 'Dr. Ibrahima Sow & Dr. Fatou Camara',
    institution: 'École Nationale d’Administration (ENA)',
    category: 'annales',
    subCategory: 'ENA',
    level: { cycle: 'universite', grade: 'Master' },
    subject: 'droit',
    resourceType: 'pdf',
    pagesCount: 310,
    rating: 4.9,
    reviewsCount: 189,
    year: 2024,
    accessLevel: 'premium',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #311042 0%, #581c87 50%, #7e22ce 100%)',
    coverBadgeColor: '#a855f7',
    description: 'Guide d’excellence pour les cycles A et B : institutions du Sénégal, politiques publiques, finances et épreuves corrigées.',
    downloadsCount: 8900,
    keyConcepts: ['Organisation constitutionnelle', 'Décentralisation au Sénégal (Acte III)', 'Finances publiques et LOLF', 'Dissertation administrative', 'Actes administratifs unilatéraux'],
    extractedText: `MANUEL DE PRÉPARATION AUX CONCOURS DE L'ENA DU SÉNÉGAL — DROIT PUBLIC ET POLITIQUES PUBLIQUES

TITRE 1 : LE CADRE CONSTITUTIONNEL ET INSTITUTIONNEL SÉNÉGALAIS
Principe républicain : La Constitution sénégalaise consacre la séparation équilibrée des pouvoirs (exécutif, législatif, judiciaire) et l'État de droit.
Le Président de la République est la clé de voûte des institutions, garant du respect de la Constitution et du fonctionnement régulier des pouvoirs publics.
L'Administration sénégalaise est soumise au principe de légalité : tout acte administratif doit être conforme aux normes juridiques supérieures (bloc de constitutionnalité, traités ratifiés, lois et règlements).

TITRE 2 : LA DÉCENTRALISATION ET L'ACTE III DE LA DÉCENTRALISATION
Définition : La décentralisation est le transfert de compétences et de moyens de décision de l'État central vers des collectivités territoriales autonomes dotées de la personnalité juridique.
L'Acte III de la décentralisation au Sénégal (Loi n° 2013-10 du 28 décembre 2013 portant Code général des Collectivités territoriales) a érigé le département en collectivité territoriale de plein exercice et généralisé la communalisation intégrale.
Objectif stratégique : Construire des territoires viables, compétitifs et porteurs de développement durable d'ici 2035.

TITRE 3 : LES FINANCES PUBLIQUES ET LA DIRECTIVE DE L'UEMOA (LOLF)
La Loi Organique relative aux Lois de Finances (LOLF) consacre le passage d'une gestion budgétaire de moyens à un budget par programmes axé sur la performance et les résultats.
Principes budgétaires fondamentaux : Annualité, Unité, Universalité, Spécialité et Sincérité budgétaire.

MÉTHODOLOGIE OFFICIELLE DE LA DISSERTATION ADMINISTRATIVE :
1. Introduction en 4 étapes obligatoires : Accroche contextuelle, Définition rigoureuse des termes du sujet, Problématique administrative, Annonce précise du plan bipartite (I. et II.).
2. Corps du devoir structuré en deux parties équilibrées (I. A, B et II. A, B) avec transitions et chapeaux.
3. Neutralité républicaine, rigueur juridique et clarté de la syntaxe.`,
  },
  {
    id: 'res-4',
    slug: 'philosophie-terminale-l-notions-textes-dissertations',
    title: 'Philosophie Terminale L & S — Grands Courants & Dissertations',
    subtitle: 'De la pensée africaine contemporaine aux classiques universels',
    author: 'Prof. Souleymane Bachir Diagne & Coll.',
    institution: 'UCAD Faculté des Lettres',
    category: 'cours',
    level: { cycle: 'lycee', grade: 'Terminale L' },
    subject: 'philosophie',
    resourceType: 'cours',
    pagesCount: 196,
    rating: 4.7,
    reviewsCount: 230,
    year: 2023,
    accessLevel: 'free',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #6b7280 100%)',
    coverBadgeColor: '#ec4899',
    description: 'Guide méthodique complet : analyse des sujets récurrents au Bac, plans détaillés, citations clés et lexique philosophique.',
    downloadsCount: 11200,
    keyConcepts: ['Conscience et Inconscient', 'La Liberté et le Déterminisme', 'La Morale et le Devoir', 'Pensée africaine et universelle', 'L’État et la Justice'],
    extractedText: `PROGRAMME NATIONAL DE PHILOSOPHIE — TERMINALE L & S

CHAPITRE 1 : LA CONSCIENCE ET L'INCONSCIENT
Définition : La conscience (du latin cum scientia, avec savoir) est la faculté mentale par laquelle le sujet prend connaissance de ses états intérieurs et du monde extérieur.
Descartes affirme le primat du sujet pensant : « Cogito ergo sum » (Je pense, donc je suis). La conscience est pour lui transparence absolue et certitude première de l'existence.
Critique freudienne : Sigmund Freud introduit l'hypothèse de l'inconscient psychique. Le psychisme est structuré en trois instances : le Ça (pulsions refoulées), le Moi (instance régulatrice confrontée au principe de réalité) et le Surmoi (intériorisation des interdits moraux et parentaux).
Conséquence philosophique : « Le Moi n'est pas maître dans sa propre maison ».

CHAPITRE 2 : LA LIBERTÉ ET LE DÉTERMINISME
Définition : La liberté désigne la capacité de se déterminer soi-même à agir, sans contrainte externe.
Le déterminisme soutient au contraire que chaque événement ou action humaine est rigoureusement conditionné par une chaîne de causes antérieures (biologiques, psychologiques, sociales).
Selon Spinoza, l'illusion du libre arbitre provient du fait que « les hommes sont conscients de leurs désirs mais ignorants des causes qui les déterminent ».
Jean-Paul Sartre réfute le déterminisme absolu : « L'homme est condamné à être libre » car son existence précède son essence ; l'homme est responsable de l'ensemble de ses choix.

CHAPITRE 3 : L'ÉTAT ET LA JUSTICE
Théorie du contrat social : Thomas Hobbes, John Locke et Jean-Jacques Rousseau conceptualisent le passage de l'état de nature à l'état civil.
Pour Rousseau (Du Contrat Social) : L'obéissance à la loi que l'on s'est prescrite est liberté. La volonté générale vise l'intérêt commun et fonde la justice distributive et corrective.`,
  },
  {
    id: 'res-5',
    slug: 'physique-chimie-classe-de-troisieme-bfem',
    title: 'Physique - Chimie 3e : Tout le programme BFEM en fiches',
    subtitle: 'Optique, mécanique, électrocinétique et réactions chimiques',
    author: 'Moussa Seck, Inspecteur de Spécialité',
    institution: 'Ministère de l’Éducation Nationale',
    category: 'exercices',
    level: { cycle: 'college', grade: '3e' },
    subject: 'physique_chimie',
    resourceType: 'exercice',
    pagesCount: 148,
    rating: 4.8,
    reviewsCount: 378,
    year: 2024,
    accessLevel: 'subscription',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    coverBadgeColor: '#10b981',
    description: 'Fiches de révision ultra-visuelles, rappels de cours essentiels et 150 exercices gradués pour décrocher la mention au BFEM.',
    downloadsCount: 16500,
    keyConcepts: ['Poids et Masse (P = m * g)', 'Loi d’Ohm (U = R * I)', 'Puissance et Énergie électrique', 'Solutions acides et basiques', 'Réaction acido-basique'],
    extractedText: `PROGRAMME OFFICIEL DE PHYSIQUE - CHIMIE — CLASSE DE TROISIÈME (BFEM SÉNÉGAL)

MODULE 1 : MÉCANIQUE — POIDS ET MASSE D'UN CORPS
Définition : La masse m est la quantité de matière contenue dans un corps, invariable et mesurée en kilogrammes (kg).
Le poids P est l'action attractive exercée par la Terre sur ce corps, mesuré en Newtons (N) à l'aide d'un dynamomètre.
Relation fondamentale : P = m * g
où P est le poids en N, m est la masse en kg, et g est l'intensité de la pesanteur (sur Terre, g = 9,8 N/kg ou 10 N/kg).
Masse volumique : ρ = m / V (en kg/m³ ou g/cm³).

MODULE 2 : ÉLECTRICITÉ — LOI D'OHM ET ÉNERGIE ÉLECTRIQUE
Définition : Un conducteur ohmique est caractérisé par sa résistance électrique R, exprimée en Ohms (Ω).
Loi d'Ohm : La tension U aux bornes d'un dipôle ohmique est proportionnelle à l'intensité I du courant qui le traverse :
U = R * I
où U est en Volts (V), R en Ohms (Ω), et I en Ampères (A).
Puissance électrique : P = U * I (en Watts, W).
Énergie électrique : E = P * t (en Joules, J, ou en Watt-heures, Wh, avec 1 Wh = 3600 J).
Effet Joule : W = R * I² * t.

MODULE 3 : CHIMIE — SOLUTIONS ACIDES, BASIQUES ET PH
Définition : Le pH (potentiel Hydrogène) mesure la concentration en ions hydrogène H+ dans une solution aqueuse.
Échelle de pH à 25°C (entre 0 et 14) :
- Solution acide : pH < 7 (présence majoritaire d'ions H+ ou H3O+).
- Solution neutre : pH = 7 (eau pure).
- Solution basique : pH > 7 (présence majoritaire d'ions hydroxyde OH-).
Réaction acido-basique : Neutralisation selon l'équation H+ + OH- -> H2O avec dégagement de chaleur.
Test d'identification : L'acide chlorhydrique réagit avec le fer en produisant un dégagement de dihydrogène (H2) qui détonne à la flamme.`,
  },
  {
    id: 'res-6',
    slug: 'fastef-concours-entree-mathematiques-annales-sujets',
    title: 'Concours FASTEF — Annales et Corrigés Mathématiques (Section F1/F2)',
    subtitle: 'Didactique de la discipline et épreuves scientifiques de niveau Licence',
    author: 'Département de Mathématiques FASTEF',
    institution: 'FASTEF',
    category: 'annales',
    subCategory: 'FASTEF',
    level: { cycle: 'universite', grade: 'Licence 3' },
    subject: 'mathematiques',
    resourceType: 'annale',
    pagesCount: 252,
    rating: 4.9,
    reviewsCount: 145,
    year: 2023,
    accessLevel: 'premium',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #86198f 100%)',
    coverBadgeColor: '#d946ef',
    description: 'Préparation intensive pour devenir professeur certifié de mathématiques au Sénégal : épreuves d’admissibilité et d’admission.',
    downloadsCount: 6700,
  },
  {
    id: 'res-7',
    slug: 'algorithmique-structures-de-donnees-python-l1-l2',
    title: 'Algorithmique & Programmation en Python — Licence 1 & 2',
    subtitle: 'De la logique fondamentale aux structures de données avancées',
    author: 'Dr. Cheikh Tidiane Sall',
    institution: 'Université Iba Der Thiam (UIDT) Thiès',
    category: 'cours',
    level: { cycle: 'universite', grade: 'Licence 1' },
    subject: 'informatique',
    resourceType: 'qcm',
    pagesCount: 220,
    rating: 4.9,
    reviewsCount: 215,
    year: 2024,
    accessLevel: 'subscription',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #172554 0%, #1e40af 50%, #2563eb 100%)',
    coverBadgeColor: '#06b6d4',
    description: 'Cours interactif avec 80 QCM de vérification immédiate, exercices corrigés et projets pratiques en Python 3.',
    downloadsCount: 13800,
  },
  {
    id: 'res-8',
    slug: 'les-enseignements-de-cheikh-ahmadou-bamba-traduction-sens',
    title: 'Les Écrits de Cheikh Ahmadou Bamba — Foi, Éthique et Savoir',
    subtitle: 'Traductions annotées, contexte historique et portées spirituelles',
    author: 'Comité Scientifique de Recherche Mouride',
    institution: 'Institut Supérieur d’Études Islamiques de Touba',
    category: 'religion',
    subCategory: 'islam_mouride',
    level: { cycle: 'universite', grade: 'Licence' },
    subject: 'philosophie',
    resourceType: 'livre',
    pagesCount: 380,
    rating: 5.0,
    reviewsCount: 620,
    year: 2022,
    accessLevel: 'free',
    featured: true,
    coverGradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    coverBadgeColor: '#f59e0b',
    description: 'Anthologie bilingue (arabe-français) avec commentaires pédagogiques détaillés pour les étudiants et chercheurs de savoir.',
    downloadsCount: 19400,
  },
  {
    id: 'res-9',
    slug: 'svt-terminale-s2-genetique-immunologie-geologie',
    title: 'SVT Terminale S2 — Génétique, Immunologie & Tectonique',
    subtitle: 'Schémas bilan, méthodes d’interprétation et exercices types',
    author: 'Mme Aïssatou Ba, Enseignante agrégée',
    institution: 'Lycée Delafosse Dakar',
    category: 'cours',
    level: { cycle: 'lycee', grade: 'Terminale S' },
    subject: 'svt',
    resourceType: 'pdf',
    pagesCount: 216,
    rating: 4.8,
    reviewsCount: 295,
    year: 2024,
    accessLevel: 'subscription',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)',
    coverBadgeColor: '#10b981',
    description: 'L’ouvrage indispensable pour maîtriser la démarche scientifique, l’analyse des documents expérimentaux et la synthèse argumentée.',
    downloadsCount: 14700,
  },
  {
    id: 'res-10',
    slug: 'lecture-et-expression-ecrite-cp-ce1-senegal',
    title: 'Je Lis et J’Écris avec Sunubiblio — CP & CE1',
    subtitle: 'Méthode syllabique et illustrative adaptée aux réalités locales',
    author: 'Awa Diop & Mamadou Kane',
    institution: 'Direction de l’Enseignement Élémentaire',
    category: 'livres',
    level: { cycle: 'primaire', grade: 'CP' },
    subject: 'francais',
    resourceType: 'livre',
    pagesCount: 96,
    rating: 4.9,
    reviewsCount: 412,
    year: 2024,
    accessLevel: 'free',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #831843 0%, #9d174d 50%, #be185d 100%)',
    coverBadgeColor: '#ec4899',
    description: 'Ouvrage coloré, stimulant et phonétique pour accompagner les premiers pas des écoliers sénégalais dans l’alphabétisation.',
    downloadsCount: 25100,
  },
  {
    id: 'res-11',
    slug: 'droit-constitutionnel-institutions-politiques-senegal',
    title: 'Droit Constitutionnel & Institutions Politiques du Sénégal',
    subtitle: 'Analyse comparée des constitutions de 1963 à nos jours',
    author: 'Pr. Babacar Guèye',
    institution: 'UCAD Faculté des Sciences Juridiques',
    category: 'cours',
    level: { cycle: 'universite', grade: 'Licence 1' },
    subject: 'droit',
    resourceType: 'doc',
    pagesCount: 340,
    rating: 4.9,
    reviewsCount: 198,
    year: 2023,
    accessLevel: 'premium',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    coverBadgeColor: '#6366f1',
    description: 'Manuel fondamental pour les étudiants en droit, science politique et candidats aux grands concours administratifs de l’État.',
    downloadsCount: 7800,
  },
  {
    id: 'res-12',
    slug: 'anglais-terminales-annales-comprehension-expression',
    title: 'English for the Senegalese Baccalaureate — L & S',
    subtitle: 'Reading comprehension, grammar drills and guided writing',
    author: 'Alassane Wade & Jane Mitchell',
    institution: 'Association des Professeurs d’Anglais du Sénégal (APAS)',
    category: 'annales',
    level: { cycle: 'lycee', grade: 'Terminale S' },
    subject: 'anglais',
    resourceType: 'pdf',
    pagesCount: 172,
    rating: 4.6,
    reviewsCount: 167,
    year: 2024,
    accessLevel: 'free',
    featured: false,
    coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%)',
    coverBadgeColor: '#8b5cf6',
    description: 'Stratégies de lecture rapide, vocabulaire thématique (environnement, technologie, société) et 30 sujets d’annales avec corrections types.',
    downloadsCount: 11900,
  },
];
