/**
 * Sunubiblio — Service Outils Documents
 * Traitement, analyse éthique, conversion et stockage privé
 */

import {
  DocumentTypeTarget,
  DocumentTypeTargetInfo,
  DocumentAnalysisReport,
  UserProcessedDocument,
  AIPassageFlag,
  VerificationAlert,
  PdfAnnotationItem,
  PdfPageState,
} from '@/types/documentTools';

export const DOCUMENT_TYPE_TARGETS: DocumentTypeTargetInfo[] = [
  {
    id: 'memoire',
    label: 'Mémoire universitaire',
    description: 'Master 1 & 2, fin d’études supérieures',
    icon: '🎓',
  },
  {
    id: 'these',
    label: 'Thèse de doctorat',
    description: 'Travaux doctoraux et recherches approfondies',
    icon: '🏛️',
  },
  {
    id: 'rapport',
    label: 'Rapport de stage / professionnel',
    description: 'Immersion en entreprise et bilans d’activité',
    icon: '💼',
  },
  {
    id: 'article',
    label: 'Article scientifique ou d’analyse',
    description: 'Publication, revue ou communication de recherche',
    icon: '📰',
  },
  {
    id: 'livre',
    label: 'Manuscrit de livre / essai',
    description: 'Ouvrage littéraire, essai ou manuel pédagogique',
    icon: '📖',
  },
  {
    id: 'academique',
    label: 'Autre document académique',
    description: 'Devoir de recherche, exposé ou projet tutoré',
    icon: '📑',
  },
];

// Mock private store initialized with samples
let privateUserDocuments: UserProcessedDocument[] = [
  {
    id: 'pdoc-001',
    name: 'Analyse_Memoire_Master_Finance.pdf',
    originalName: 'Memoire_Master_Finance_v3.docx',
    type: 'verification',
    size: '1.4 Mo',
    processedAt: 'Aujourd’hui à 09:24',
    status: 'ready',
    downloadToken: 'token_usr_9831a_4',
    summary: 'Rapport d’analyse stylistique & vérification des sources',
  },
  {
    id: 'pdoc-002',
    name: 'Convention_Stage_Signee.pdf',
    originalName: 'Convention_Stage_Final.docx',
    type: 'word_to_pdf',
    size: '340 Ko',
    processedAt: 'Hier à 16:45',
    status: 'ready',
    downloadToken: 'token_usr_1194b_2',
    summary: 'Conversion certifiée conforme format A4',
  },
];

export const documentToolsService = {
  getDocumentTypes(): DocumentTypeTargetInfo[] {
    return DOCUMENT_TYPE_TARGETS;
  },

  /**
   * Analyse un document ou extrait textuel
   * Fournit des indicateurs éthiques sans jamais accuser l'utilisateur
   */
  async analyzeText(
    text: string,
    targetType: DocumentTypeTarget = 'memoire'
  ): Promise<DocumentAnalysisReport> {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 220));

    // Détection de passages à caractéristiques spécifiques
    const flaggedPassages: AIPassageFlag[] = [];
    const stylisticAlerts: VerificationAlert[] = [];

    // Recherche de structures symptomatiques (formulations impersonnelles ultra-standards)
    if (trimmed.toLowerCase().includes('il est crucial de') || trimmed.toLowerCase().includes('il convient de noter que') || trimmed.toLowerCase().includes('en outre, il appert')) {
      flaggedPassages.push({
        id: 'flag-1',
        locationLabel: 'Section introductive',
        excerpt: '« Il convient de noter que dans le contexte actuel, une approche multidimensionnelle est cruciale... »',
        confidenceIndicator: 'Style standardisé',
        whyFlagged:
          'Utilisation d’amorces de phrases récurrentes typiques des modèles de langage et transitions impersonnelles.',
        whatCanImprove:
          'Remplacer les formules passe-partout par des faits précis ou l’angle concret de votre problématique.',
        reformulationSuggestion:
          '« Dans le secteur bancaire ouest-africain, les récentes directives du régulateur imposent désormais... »',
        personalizationTips: [
          'Mentionnez le contexte géographique spécifique (Sénégal, UEMOA).',
          'Intégrez les noms précis des institutions et des données chiffrées issues de vos observations.',
          'Adoptez une voix d’auteur engagée plutôt que des généralités abstraites.',
        ],
      });
    }

    if (trimmed.toLowerCase().includes('en conclusion, il est indéniable') || trimmed.toLowerCase().includes('en résumé')) {
      flaggedPassages.push({
        id: 'flag-2',
        locationLabel: 'Synthèse',
        excerpt: '« En conclusion, il est indéniable que les perspectives d’avenir ouvrent la voie à de nombreuses opportunités... »',
        confidenceIndicator: 'Probabilité notable',
        whyFlagged:
          'Conclusion excessivement générique et balancée, sans prise de position analytique propre à un travail de recherche.',
        whatCanImprove:
          'Conclure sur les limites précises de votre échantillon et les questions concrètes laissées en suspens.',
        reformulationSuggestion:
          '« Bien que nos résultats confirment l’hypothèse initiale, la taille réduite du panel restreint la généralisation à l’échelle nationale. »',
        personalizationTips: [
          'Énoncez clairement les limites méthodologiques rencontrées.',
          'Formulez des recommandations concrètes applicables sur le terrain.',
        ],
      });
    }

    // Si le texte est court ou simple, ajout d'un exemple représentatif si rien n'est matché
    if (flaggedPassages.length === 0 && wordCount > 25) {
      flaggedPassages.push({
        id: 'flag-gen',
        locationLabel: 'Paragraphe central',
        excerpt: words.slice(0, 18).join(' ') + '...',
        confidenceIndicator: 'Style standardisé',
        whyFlagged:
          'Enchaînement de propositions parfaitement équilibrées sans variation de rythme stylistique.',
        whatCanImprove:
          'Varier la longueur des phrases et insérer des connecteurs logiques issus de votre raisonnement propre.',
        reformulationSuggestion:
          'Scindez la phrase longue en deux propositions indépendantes pour donner plus d’impact à votre argument.',
        personalizationTips: [
          'Appuyez cette assertion par une citation d’auteur de référence (format APA/CAM).',
          'Expliquez en une phrase l’impact direct pour les praticiens locaux.',
        ],
      });
    }

    // Alertes stylistiques
    stylisticAlerts.push(
      {
        id: 'alert-1',
        type: 'affirmation_non_sourcee',
        title: 'Affirmation nécessitant une référence',
        excerpt: '« La majorité des entreprises adoptent cette méthode... »',
        explanation: 'Une assertion quantitative sans source bibliographique affaiblit la rigueur académique.',
        suggestion: 'Ajouter une référence d’étude (ex: ANSD, BCEAO ou auteur référent).',
      },
      {
        id: 'alert-2',
        type: 'repetition',
        title: 'Répétition lexicale rapprochée',
        excerpt: 'Utilisation répétée du terme « développement » (4 fois en 3 phrases)',
        explanation: 'Cette répétition alourdit la lecture et réduit la richesse du vocabulaire.',
        suggestion: 'Varier avec : « essor », « déploiement », « montée en puissance », « consolidation ».',
      }
    );

    const score = Math.max(72, Math.min(96, 90 - flaggedPassages.length * 7));

    const report: DocumentAnalysisReport = {
      id: `rep_${Date.now()}`,
      targetType,
      analyzedAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      wordCount,
      readingTimeMinutes: readingTime,
      globalQualityScore: score,
      aiAssistanceIndicator: {
        level: flaggedPassages.length > 1 ? 'moderee' : 'faible',
        label: flaggedPassages.length > 1 ? 'Assistance IA estimée modérée' : 'Empreinte IA faible',
        description:
          'Ce document présente une base de rédaction cohérente. Quelques sections standardisées gagneraient à être enrichies par des sources primaires et un style plus personnalisé.',
        ethicalDisclaimer:
          'Ce diagnostic repose sur des indices statistiques de style et de régularité syntaxique. Il ne constitue en aucun cas une preuve absolue d’utilisation d’IA et doit être envisagé comme un guide d’amélioration rédactionnelle.',
      },
      executiveSummary:
        'Le document dispose d’un fil conducteur clair et d’une terminologie adaptée. L’approfondissement des données empiriques et la diversification du rythme de phrase renforceront significativement son authenticité.',
      structureAssessment: {
        detectedSections: ['Introduction', 'Développement thématique', 'Synthèse préliminaire'],
        isCoherent: true,
        observations: [
          'La transition entre l’introduction et le premier axe d’analyse est fluide.',
          'Prévoir un paragraphe de liaison plus explicite avant la conclusion.',
        ],
      },
      strengths: [
        'Bonne maîtrise de la terminologie académique.',
        'Orthographe et accords grammaticaux soignés.',
        'Organisation logique des idées.',
      ],
      priorityImprovements: [
        'Personnaliser les tournures de phrases trop standardisées.',
        'Citer explicitement les sources pour chaque donnée chiffrée.',
        'Éliminer les répétitions lexicales dans les paragraphes centraux.',
      ],
      flaggedPassages,
      stylisticAlerts,
    };

    // Auto-save in user's processed documents
    privateUserDocuments.unshift({
      id: `pdoc_${Date.now()}`,
      name: `Rapport_Analyse_${targetType.toUpperCase()}.pdf`,
      originalName: `Texte_${targetType}_${wordCount}mots.txt`,
      type: 'verification',
      size: `${Math.max(120, Math.round(wordCount * 1.5))} Ko`,
      processedAt: 'À l’instant',
      status: 'ready',
      downloadToken: `dl_rep_${Date.now()}`,
      summary: `Qualité : ${score}/100 • ${flaggedPassages.length} passages suggérés`,
      analysisReport: report,
    });

    return report;
  },

  /**
   * Simule la conversion sécurisée d'un fichier Word vers PDF
   */
  async convertWordToPdf(fileName: string, fileSize: string): Promise<UserProcessedDocument> {
    const newDoc: UserProcessedDocument = {
      id: `pdoc_${Date.now()}`,
      name: fileName.replace(/\.(docx|doc)$/i, '.pdf'),
      originalName: fileName,
      type: 'word_to_pdf',
      size: fileSize,
      processedAt: 'À l’instant',
      status: 'ready',
      downloadToken: `dl_conv_${Date.now()}`,
      summary: 'Conversion Word certifiée conforme PDF/A',
    };

    privateUserDocuments.unshift(newDoc);
    return newDoc;
  },

  /**
   * Applique les annotations et modifications à un PDF
   */
  async editPdf(
    originalFileName: string,
    annotations: PdfAnnotationItem[],
    pagesState: PdfPageState[]
  ): Promise<UserProcessedDocument> {
    const activePages = pagesState.filter((p) => !p.isDeleted);
    const newDoc: UserProcessedDocument = {
      id: `pdoc_${Date.now()}`,
      name: originalFileName.replace(/\.pdf$/i, '_modifie.pdf'),
      originalName: originalFileName,
      type: 'pdf_modified',
      size: '1.8 Mo',
      processedAt: 'À l’instant',
      status: 'ready',
      downloadToken: `dl_edit_${Date.now()}`,
      summary: `${annotations.length} annotation(s) • ${activePages.length} page(s) conservée(s)`,
    };

    privateUserDocuments.unshift(newDoc);
    return newDoc;
  },

  /**
   * Récupère la liste des documents traités par l'utilisateur
   */
  async getUserDocuments(): Promise<UserProcessedDocument[]> {
    return [...privateUserDocuments];
  },

  /**
   * Accès direct synchrone à l'état local
   */
  getUserProcessedDocuments(): UserProcessedDocument[] {
    return [...privateUserDocuments];
  },

  /**
   * Supprime un document de l'espace privé
   */
  async deleteUserDocument(id: string): Promise<boolean> {
    const before = privateUserDocuments.length;
    privateUserDocuments = privateUserDocuments.filter((d) => d.id !== id);
    return privateUserDocuments.length < before;
  },
};
