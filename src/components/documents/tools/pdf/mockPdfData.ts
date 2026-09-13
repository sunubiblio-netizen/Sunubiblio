import { PdfPageModel } from './types';

export const INITIAL_PDF_PAGES: PdfPageModel[] = [
  {
    pageNumber: 1,
    title: 'Page de garde & Résumé',
    rotation: 0,
    isDeleted: false,
    contentParagraphs: [
      {
        id: 'p1-title',
        type: 'h1',
        text: 'RAPPORT DE RECHERCHE ACADÉMIQUE SUR LA TRANSFORMATION DIGITALE',
      },
      {
        id: 'p1-meta',
        type: 'p',
        text: 'Faculté des Sciences Économiques et de Gestion • Session Annuelle 2026 • Réf: SNB-DOC-892',
      },
      {
        id: 'p1-sec1',
        type: 'h2',
        text: '1. Résumé exécutif et contexte global',
      },
      {
        id: 'p1-p1',
        type: 'p',
        text: 'Le présent rapport analyse en profondeur les mutations structurelles induites par l’intégration des technologies numériques au sein des écosystèmes éducatifs et administratifs ouest-africains. Face à la massification des flux d’information, la gouvernance des données documentaires s’impose comme un axe stratégique incontournable.',
      },
      {
        id: 'p1-quote',
        type: 'quote',
        text: '« L’accessibilité universelle au savoir numérique constitue le levier fondamental de l’émancipation intellectuelle et de l’efficacité des institutions publiques contemporaines. »',
      },
      {
        id: 'p1-p2',
        type: 'p',
        text: 'Nos observations de terrain mettent en évidence une progression significative des taux d’adoption (+42% sur la période 2024-2026), bien que des disparités territoriales subsistent concernant l’accès aux infrastructures à très haut débit.',
      },
    ],
  },
  {
    pageNumber: 2,
    title: 'Cadre méthodologique',
    rotation: 0,
    isDeleted: false,
    contentParagraphs: [
      {
        id: 'p2-sec2',
        type: 'h2',
        text: '2. Cadre conceptuel et démarche méthodologique',
      },
      {
        id: 'p2-p1',
        type: 'p',
        text: 'La méthodologie adoptée repose sur un protocole mixte combinant enquêtes quantitatives auprès de 1 200 usagers et entretiens semi-directifs avec 45 experts du secteur éducatif. Cette double approche garantit une représentativité optimale des résultats.',
      },
      {
        id: 'p2-p2',
        type: 'p',
        text: 'Les critères d’évaluation ont été standardisés selon les recommandations de l’UNESCO pour l’évaluation des ressources éducatives libres (REL). Chaque dimension a fait l’objet d’un étalonnage rigoureux afin d’éviter tout biais de confirmation.',
      },
      {
        id: 'p2-sec3',
        type: 'h2',
        text: '3. Analyse des corpus documentaires consultés',
      },
      {
        id: 'p2-p3',
        type: 'p',
        text: 'L’examen systématique des 350 publications référencées démontre une forte corrélation entre la disponibilité de formats certifiés (PDF/A, métadonnées normalisées) et le taux de citation académique.',
      },
    ],
  },
  {
    pageNumber: 3,
    title: 'Résultats & Données',
    rotation: 0,
    isDeleted: false,
    contentParagraphs: [
      {
        id: 'p3-sec4',
        type: 'h2',
        text: '4. Synthèse des résultats et indicateurs clés',
      },
      {
        id: 'p3-p1',
        type: 'p',
        text: 'L’analyse statistique met en relief trois tendances majeures : la primauté des terminaux mobiles pour la consultation documentaire (78%), l’exigence accrue de vérification de l’authenticité des sources, et la recherche d’outils d’annotation collaborative.',
      },
      {
        id: 'p3-p2',
        type: 'p',
        text: 'Les répondants soulignent l’importance d’une interface sobre, réactive et dénuée de distractions publicitaires, permettant une immersion de lecture prolongée et une prise de notes contextuelle fluide.',
      },
      {
        id: 'p3-quote',
        type: 'quote',
        text: 'Indicateur de satisfaction globale de l’échantillon : 91,4% d’avis favorables sur la fiabilité et la traçabilité des documents certifiés.',
      },
    ],
  },
  {
    pageNumber: 4,
    title: 'Recommandations & Visa',
    rotation: 0,
    isDeleted: false,
    contentParagraphs: [
      {
        id: 'p4-sec5',
        type: 'h2',
        text: '5. Recommandations stratégiques pour le déploiement',
      },
      {
        id: 'p4-p1',
        type: 'p',
        text: 'Il est vivement recommandé d’accélérer la numérisation des archives institutionnelles, de généraliser les mécanismes de signature électronique conforme, et de doter chaque apprenant d’un espace de travail documentaire pérenne et sécurisé.',
      },
      {
        id: 'p4-p2',
        type: 'p',
        text: 'Fait à Dakar, le 13 septembre 2026. Document soumis pour validation académique et archivage officiel auprès de la bibliothèque numérique Sunubiblio.',
      },
    ],
  },
];
