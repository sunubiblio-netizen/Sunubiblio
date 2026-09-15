import { 
  PlagiarismAnalysisStep, 
  PlagiarismReport, 
  PlagiarismHistoryItem, 
  PlagiarismQuota,
  SimilarPassage
} from '@/types/plagiarism';
import { MOCK_RESOURCES } from '@/data/mockLibrary';

const DEFAULT_QUOTA: PlagiarismQuota = {
  used: 3,
  limit: 5,
  planName: 'Étudiant Pro (3 000 FCFA/mois)',
  maxPagesPerDoc: 60,
  maxFileSizeMB: 15
};

const INITIAL_HISTORY: PlagiarismHistoryItem[] = [
  {
    id: 'hist-1',
    documentName: 'Memoire_Master_Droit_Public_v2.pdf',
    similarityScore: 14,
    similarityLevel: 'faible',
    date: '12 Septembre 2026',
    fileSize: '3.8 Mo',
    reportId: 'rep-hist-1'
  },
  {
    id: 'hist-2',
    documentName: 'Rapport_Stage_Economie_Sante.docx',
    similarityScore: 22,
    similarityLevel: 'modere',
    date: '04 Septembre 2026',
    fileSize: '1.4 Mo',
    reportId: 'rep-hist-2'
  }
];

export const PlagiarismService = {
  getQuota(): PlagiarismQuota {
    return { ...DEFAULT_QUOTA };
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxBytes = DEFAULT_QUOTA.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `Le document dépasse la taille maximale autorisée de ${DEFAULT_QUOTA.maxFileSizeMB} Mo.`
      };
    }

    const validExts = ['.pdf', '.doc', '.docx', '.txt'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExts.includes(extension)) {
      return {
        valid: false,
        error: `Format non supporté (${extension}). Veuillez soumettre un fichier PDF, Word (.doc, .docx) ou texte brut (.txt).`
      };
    }

    return { valid: true };
  },

  getHistory(): PlagiarismHistoryItem[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sunubiblio_plagiarism_history');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore error
        }
      }
    }
    return INITIAL_HISTORY;
  },

  saveHistoryItem(item: PlagiarismHistoryItem): void {
    if (typeof window !== 'undefined') {
      const current = this.getHistory();
      const updated = [item, ...current.filter(h => h.id !== item.id)];
      localStorage.setItem('sunubiblio_plagiarism_history', JSON.stringify(updated));
    }
  },

  deleteHistoryItem(id: string): PlagiarismHistoryItem[] {
    if (typeof window !== 'undefined') {
      const current = this.getHistory().filter(h => h.id !== id);
      localStorage.setItem('sunubiblio_plagiarism_history', JSON.stringify(current));
      return current;
    }
    return INITIAL_HISTORY.filter(h => h.id !== id);
  },

  async analyzeDocument(params: {
    documentName: string;
    fileSize?: string;
    rawText?: string;
    onProgress?: (step: PlagiarismAnalysisStep) => void;
  }): Promise<PlagiarismReport> {
    const notify = (step: PlagiarismAnalysisStep) => {
      if (params.onProgress) params.onProgress(step);
    };

    // 1. Lecture
    notify('reading');
    await new Promise(r => setTimeout(r, 600));

    // 2. Extraction
    notify('extracting');
    await new Promise(r => setTimeout(r, 700));

    // 3. Comparaison segments
    notify('comparing');
    await new Promise(r => setTimeout(r, 800));

    // 4. Recherche de correspondances dans les archives Sunubiblio
    notify('matching');
    await new Promise(r => setTimeout(r, 700));

    // 5. Génération du rapport
    notify('generating_report');
    await new Promise(r => setTimeout(r, 500));

    notify('completed');

    // Selection de sources Sunubiblio représentatives pour la comparaison
    const source1 = MOCK_RESOURCES[0] || {
      id: 'res-ref-1',
      title: 'Mathématiques — Cours complet & 300 Exercices résolus',
      author: 'Prof. Amadou Ndiaye',
      institution: 'FASTEF / UCAD'
    };

    const source2 = MOCK_RESOURCES[1] || {
      id: 'res-ref-2',
      title: 'Histoire & Géographie — Programme officiel UEMOA',
      author: 'Dr. Marième Sall',
      institution: 'Institut Pédagogique National'
    };

    const detectedPassages: SimilarPassage[] = [
      {
        id: 'pas-1',
        userText: "L'approche méthodologique adoptée dans cette recherche repose sur une analyse comparative des données institutionnelles et sur le principe de continuité pédagogique.",
        matchedText: "La méthodologie d'évaluation s'appuie sur une analyse comparative des données institutionnelles et sur le principe d'équité et de continuité pédagogique.",
        similarityScore: 84,
        isCitation: false,
        pageNumber: 3,
        advice: "Formulation très proche de la source officielle. Reformulez en explicitant votre propre démarche d'enquête ou citez la directive de référence.",
        source: {
          id: 'src-1',
          title: source1.title,
          author: source1.author,
          institution: source1.institution || 'FASTEF',
          type: 'sunubiblio_library',
          category: 'Cours académique',
          resourceId: source1.id
        }
      },
      {
        id: 'pas-2',
        userText: "Selon les directives ministérielles de 2024, le programme d'intégration des compétences numériques s'articule autour de trois piliers fondamentaux.",
        matchedText: "Conformément aux orientations du MEN (2024), le développement des compétences numériques s'articule autour de trois piliers fondamentaux : accès, formation et évaluation.",
        similarityScore: 78,
        isCitation: true,
        pageNumber: 7,
        advice: "Ce passage correspond à une référence institutionnelle. Veillez à insérer des guillemets formels et à préciser la page du document dans votre bibliographie.",
        source: {
          id: 'src-2',
          title: source2.title,
          author: source2.author,
          institution: source2.institution || 'Ministère de l’Éducation',
          type: 'institutional_document',
          category: 'Référentiel National',
          resourceId: source2.id
        }
      },
      {
        id: 'pas-3',
        userText: "L'analyse des rendements montre une corrélation directe entre le temps consacré aux révisions guidées et le taux d'admissibilité au second groupe.",
        matchedText: "Les observations démontrent une corrélation directe entre le volume d'heures de travaux dirigés et le taux d'admissibilité des candidats au second groupe.",
        similarityScore: 71,
        isCitation: false,
        pageNumber: 12,
        advice: "Similarité structurelle détectée. Ajoutez vos données d'échantillon propres pour singulariser votre conclusion.",
        source: {
          id: 'src-3',
          title: 'Annales FASTEF & Statistiques des Examens Nationaux',
          author: 'Collectif FASTEF',
          institution: 'UCAD Dakar',
          type: 'academic_archive',
          category: 'Annales & Recherche'
        }
      }
    ];

    const similarityScore = 16; // 16% score de similarité mesuré
    const similarityLevel = similarityScore <= 15 ? 'faible' : similarityScore <= 35 ? 'modere' : 'eleve';

    const report: PlagiarismReport = {
      id: 'rep-' + Date.now(),
      documentName: params.documentName,
      fileSize: params.fileSize || '2.1 Mo',
      pageCount: 14,
      wordCount: 4250,
      characterCount: 26800,
      analyzedAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      similarityScore,
      similarityLevel,
      passagesCount: detectedPassages.length,
      passages: detectedPassages,
      sourcesCount: 3,
      sources: [
        {
          id: 'src-1',
          title: source1.title,
          author: source1.author,
          institution: source1.institution,
          type: 'sunubiblio_library'
        },
        {
          id: 'src-2',
          title: source2.title,
          author: source2.author,
          institution: source2.institution,
          type: 'institutional_document'
        },
        {
          id: 'src-3',
          title: 'Annales FASTEF & Statistiques des Examens Nationaux',
          author: 'Collectif FASTEF',
          institution: 'UCAD Dakar',
          type: 'academic_archive'
        }
      ],
      disclaimer: "Le score de similarité est un indicateur de comparaison textuelle. Une similarité peut être parfaitement légitime, notamment lorsqu'elle provient de citations entre guillemets, références académiques, expressions techniques courantes, titres ou contenus d'autorités correctement attribués.",
      academicAdvice: [
        "Vérifiez que chaque citation directe est entourée de guillemets et assortie d'une note de bas de page ou d'une référence explicite (Auteur, Année).",
        "Privilégiez la reformulation critique et l'apport d'arguments personnels plutôt que l'enchaînement de paraphrases.",
        "Assurez-vous que l'ensemble des documents mentionnés figurent fidèlement dans votre bibliographie générale."
      ]
    };

    // Enregistrer automatiquement dans l'historique
    this.saveHistoryItem({
      id: 'hist-' + Date.now(),
      documentName: report.documentName,
      similarityScore: report.similarityScore,
      similarityLevel: report.similarityLevel,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: report.fileSize,
      reportId: report.id
    });

    return report;
  }
};
