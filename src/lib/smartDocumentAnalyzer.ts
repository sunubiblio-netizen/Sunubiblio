/**
 * Sunubiblio Pro — Moteur d'Analyse Intelligente de Fichiers & Dossiers
 * - Extraction de la 1ère page du PDF en image de couverture (Canvas HD + fallback éditorial)
 * - Détection automatique : Catégorie (Bibliothèque, Éducation, Concours, Documents, Religion)
 * - Distinction fine : Livre scolaire, Fascicule d'exercices, Cours, Annale d'examen, Document administratif
 * - Détection de la Classe exacte (CI, CP, CE1, CE2, CM1, CM2, 6e, 5e, 4e, 3e, 2nde, 1ère, Terminale S1/S2/L2, Licence 1/2/3, Master, Doctorat)
 * - Extraction de l'Auteur, de la Matière, de l'Institution et du Nombre de pages
 */

import { EducationCycleId, EducationResourceType } from '@/types/education';
import { AccessLevel } from '@/types/library';

export type AdminDestinationCategory =
  | 'education'
  | 'bibliotheque'
  | 'concours'
  | 'documents'
  | 'religion';

export type DetectedDocumentKind =
  | 'livre'
  | 'fascicule'
  | 'cours'
  | 'annale'
  | 'document'
  | 'ouvrage_religieux';

export interface AnalyzedStagingItem {
  id: string;
  fileName: string;
  folderPath: string;
  fileSizeFormatted: string;
  status: 'analyzing' | 'ready' | 'published' | 'error';
  confidence: number; // 0 - 100
  // Métadonnées extraites
  title: string;
  author: string;
  institution: string;
  year: number;
  pagesCount: number;
  description: string;
  // Classification intelligente
  destination: AdminDestinationCategory;
  documentKind: DetectedDocumentKind;
  educationType: EducationResourceType;
  cycle: EducationCycleId;
  grade: string; // ex: "Terminale S2", "3e / BFEM", "CM2 / CFEE", "Licence 2"
  subject: string; // ex: "Mathématiques", "Physique-Chimie", "SVT", "Français"
  competition?: string; // ex: "ENA", "FASTEF", "CREM", "Douanes"
  religionTradition?: string; // ex: "Islam", "Mouridisme", "Tidjaniya", "Christianisme"
  documentCategory?: string; // ex: "administratif", "etudes_examens", "emploi_stage"
  accessLevel: AccessLevel;
  // Couverture extraite (1ère page du PDF ou couverture générée HD)
  coverImage: string;
  coverGradient: string;
  coverSource: 'pdf_page_1' | 'custom_upload' | 'auto_editorial';
  createdAt: string;
}

const COVER_GRADIENTS: Record<string, string> = {
  Mathématiques: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  'Physique-Chimie': 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
  SVT: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
  Français: 'linear-gradient(135deg, #9a3412 0%, #f97316 100%)',
  Philosophie: 'linear-gradient(135deg, #701a75 0%, #d946ef 100%)',
  'Histoire-Géographie': 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
  Anglais: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
  Informatique: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)',
  'Droit & Administration': 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
  'Économie & Gestion': 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
  'Culture Générale': 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
  Spiritualité: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
  Général: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
};

/**
 * Génère une couverture de livre / fascicule haute définition sur Canvas
 * (utilisée en secours immédiat ou si le fichier n'est pas un PDF graphique)
 */
export function generateEditorialCoverDataUrl(params: {
  title: string;
  author: string;
  kindLabel: string;
  gradeOrSub: string;
  subject: string;
  accentHex?: string;
}): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Palette selon le type / matière
  const paletteMap: Record<string, [string, string, string]> = {
    Mathématiques: ['#0f172a', '#1e3a8a', '#38bdf8'],
    'Physique-Chimie': ['#1e1b4b', '#4c1d95', '#c084fc'],
    SVT: ['#022c22', '#065f46', '#34d399'],
    Français: ['#431407', '#9a3412', '#fb923c'],
    Philosophie: ['#3b0764', '#701a75', '#f472b6'],
    'Histoire-Géographie': ['#451a03', '#92400e', '#fbbf24'],
    Informatique: ['#090d16', '#312e81', '#818cf8'],
    'Droit & Administration': ['#450a0a', '#991b1b', '#f87171'],
    'Économie & Gestion': ['#052e16', '#166534', '#4ade80'],
  };

  const [bgStart, bgEnd, accent] = paletteMap[params.subject] || ['#0f172a', '#1e293b', '#f59e0b'];

  // Fond dégradé riche
  const grad = ctx.createLinearGradient(0, 0, 480, 680);
  grad.addColorStop(0, bgStart);
  grad.addColorStop(1, bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 480, 680);

  // Motifs géométriques subtils
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 2;
  for (let i = -200; i < 700; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(480, i + 180);
    ctx.stroke();
  }
  ctx.restore();

  // Bande latérale gauche (reliure d'ouvrage)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, 0, 26, 680);
  ctx.fillStyle = accent;
  ctx.fillRect(26, 0, 4, 680);

  // Cadre intérieur éditorial
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 36, 396, 608);

  // Badge supérieur (Type : LIVRE / FASCICULE / ANNALE / DOCUMENT)
  ctx.fillStyle = accent;
  roundRect(ctx, 68, 60, 190, 34, 8);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(params.kindLabel.toUpperCase().slice(0, 22), 82, 82);

  // Niveau / Classe en haut à droite
  if (params.gradeOrSub) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    roundRect(ctx, 270, 60, 154, 34, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(params.gradeOrSub.slice(0, 16), 284, 82);
  }

  // Matière
  ctx.fillStyle = accent;
  ctx.font = '700 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(params.subject.toUpperCase(), 68, 145);

  // Ligne décorative sous la matière
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(68, 160, 90, 3);

  // Titre principal (multi-lignes)
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 30px system-ui, -apple-system, sans-serif';
  wrapCanvasText(ctx, params.title, 68, 220, 356, 38, 6);

  // Bloc bas : Auteur & Collection Sunubiblio
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.fillRect(49, 520, 394, 123);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('AUTEUR / ÉDITION', 68, 554);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(params.author.slice(0, 32), 68, 582);

  ctx.fillStyle = accent;
  ctx.font = '700 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('SUNUBIBLIO • ÉDITION CERTIFIÉE', 68, 616);

  return canvas.toDataURL('image/jpeg', 0.88);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  let line = '';
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(n).join(' ');
        ctx.fillText(
          remaining.length > 22 ? remaining.slice(0, 22) + '…' : remaining,
          x,
          y
        );
        return;
      }
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, y);
  }
}

/**
 * Charge PDF.js côté navigateur (via CDN officiel) pour rendre la vraie 1ère page du PDF
 * sous forme d'image de couverture PNG/JPEG + extraire le texte des premières pages et les métadonnées.
 */
let pdfjsPromise: Promise<any> | null = null;

async function getPdfJsBrowser(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve(lib || null);
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }
  return pdfjsPromise;
}

export async function extractPdfCoverAndMetadata(file: File): Promise<{
  coverDataUrl: string | null;
  pagesCount: number;
  extractedText: string;
  metaTitle?: string;
  metaAuthor?: string;
}> {
  try {
    const pdfjsLib = await getPdfJsBrowser();
    if (!pdfjsLib) {
      return { coverDataUrl: null, pagesCount: 0, extractedText: '' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pagesCount = pdf.numPages || 1;

    // 1. Métadonnées internes du PDF (Titre, Auteur)
    let metaTitle: string | undefined;
    let metaAuthor: string | undefined;
    try {
      const meta = await pdf.getMetadata();
      if (meta?.info) {
        if (meta.info.Title && typeof meta.info.Title === 'string' && meta.info.Title.trim().length > 2) {
          metaTitle = meta.info.Title.trim();
        }
        if (meta.info.Author && typeof meta.info.Author === 'string' && meta.info.Author.trim().length > 2) {
          metaAuthor = meta.info.Author.trim();
        }
      }
    } catch {
      // ignore metadata error
    }

    // 2. Rendu de la Page 1 (Page de couverture) sur un Canvas haute qualité
    let coverDataUrl: string | null = null;
    try {
      const page1 = await pdf.getPage(1);
      const unscaledViewport = page1.getViewport({ scale: 1 });
      const targetWidth = 480;
      const scale = targetWidth / unscaledViewport.width;
      const viewport = page1.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page1.render({ canvasContext: ctx, viewport }).promise;
        coverDataUrl = canvas.toDataURL('image/jpeg', 0.86);
      }
    } catch {
      coverDataUrl = null;
    }

    // 3. Extraction du texte des 2 premières pages pour détecter titre, auteur, classe, matière
    let extractedText = '';
    try {
      const maxPagesToRead = Math.min(pagesCount, 2);
      for (let p = 1; p <= maxPagesToRead; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const pageStr = (textContent.items || [])
          .map((item: any) => item.str || '')
          .join(' ');
        extractedText += ' ' + pageStr;
      }
    } catch {
      // ignore text error
    }

    return {
      coverDataUrl,
      pagesCount,
      extractedText: extractedText.trim(),
      metaTitle,
      metaAuthor,
    };
  } catch {
    return { coverDataUrl: null, pagesCount: 0, extractedText: '' };
  }
}

/**
 * Analyse intelligente complète d'un fichier (nom + chemin du dossier + contenu PDF + métadonnées)
 */
export async function analyzeUploadedFile(file: File): Promise<AnalyzedStagingItem> {
  const rawRelativePath = (file as any).webkitRelativePath || file.name;
  const pathParts = rawRelativePath.split('/');
  const folderPath = pathParts.length > 1 ? pathParts.slice(0, -1).join(' / ') : 'Racine';

  const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
  let pdfData = {
    coverDataUrl: null as string | null,
    pagesCount: Math.max(12, Math.min(420, Math.round(file.size / 18000))),
    extractedText: '',
    metaTitle: undefined as string | undefined,
    metaAuthor: undefined as string | undefined,
  };

  if (isPdf) {
    const extracted = await extractPdfCoverAndMetadata(file);
    if (extracted.pagesCount > 0) pdfData.pagesCount = extracted.pagesCount;
    pdfData.coverDataUrl = extracted.coverDataUrl;
    pdfData.extractedText = extracted.extractedText;
    pdfData.metaTitle = extracted.metaTitle;
    pdfData.metaAuthor = extracted.metaAuthor;
  }

  const combinedCorpus = `${rawRelativePath} ${pdfData.metaTitle || ''} ${pdfData.metaAuthor || ''} ${pdfData.extractedText.slice(0, 1500)}`.toLowerCase();

  // 1. Détection de la Classe et du Cycle Éducatif
  const { cycle, grade, matchedGradeConfidence } = detectCycleAndGrade(combinedCorpus);

  // 2. Détection de la Matière
  const subject = detectSubject(combinedCorpus);

  // 3. Détection du Type de document (Livre vs Fascicule vs Cours vs Annale vs Document vs Religion)
  const { destination, documentKind, educationType, competition, religionTradition, documentCategory, confidence } =
    detectCategoryAndKind(combinedCorpus, pdfData.pagesCount, matchedGradeConfidence);

  // 4. Nettoyage intelligent du Titre
  const cleanTitle = buildCleanTitle(file.name, pdfData.metaTitle, documentKind, subject, grade, competition);

  // 5. Détection de l'Auteur et de l'Institution
  const { author, institution } = detectAuthorAndInstitution(
    file.name,
    pdfData.metaAuthor,
    pdfData.extractedText,
    destination,
    competition,
    subject
  );

  // 6. Détection de l'Année
  const yearMatch = combinedCorpus.match(/\b(199\d|200\d|201\d|202[0-7])\b/);
  const year = yearMatch ? Number(yearMatch[1]) : 2025;

  // 7. Couverture finale : 1ère page réelle du PDF si disponible, sinon Couverture Éditoriale HD
  const coverGradient = COVER_GRADIENTS[subject] || COVER_GRADIENTS.Général;
  const kindLabelMap: Record<DetectedDocumentKind, string> = {
    livre: 'Livre & Manuel',
    fascicule: 'Fascicule Éducation',
    cours: 'Cours & Synthèse',
    annale: 'Annale & Corrigé',
    document: 'Document Officiel',
    ouvrage_religieux: 'Ouvrage Spirituel',
  };

  const finalCoverImage =
    pdfData.coverDataUrl ||
    generateEditorialCoverDataUrl({
      title: cleanTitle,
      author,
      kindLabel: kindLabelMap[documentKind],
      gradeOrSub: competition || religionTradition || grade,
      subject,
    });

  // 8. Génération d'un résumé descriptif pertinent
  const description = buildSmartDescription({
    title: cleanTitle,
    documentKind,
    destination,
    grade,
    subject,
    author,
    institution,
    competition,
    religionTradition,
    pagesCount: pdfData.pagesCount,
  });

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    folderPath,
    fileSizeFormatted: formatFileSize(file.size),
    status: 'ready',
    confidence,
    title: cleanTitle,
    author,
    institution,
    year,
    pagesCount: pdfData.pagesCount,
    description,
    destination,
    documentKind,
    educationType,
    cycle,
    grade,
    subject,
    competition,
    religionTradition,
    documentCategory,
    accessLevel: documentKind === 'document' ? 'free' : 'subscription',
    coverImage: finalCoverImage,
    coverGradient,
    coverSource: pdfData.coverDataUrl ? 'pdf_page_1' : 'auto_editorial',
    createdAt: new Date().toISOString(),
  };
}

function detectCycleAndGrade(corpus: string): {
  cycle: EducationCycleId;
  grade: string;
  matchedGradeConfidence: boolean;
} {
  // Préscolaire
  if (/\b(prescolaire|préscolaire|maternelle|petite section|moyenne section|grande section)\b/.test(corpus)) {
    return { cycle: 'prescolaire', grade: 'Grande Section', matchedGradeConfidence: true };
  }

  // Primaire (CI, CP, CE1, CE2, CM1, CM2, CFEE)
  if (/\b(cm2|cfee|entrée en 6|entree en 6)\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CM2 / CFEE', matchedGradeConfidence: true };
  }
  if (/\bcm1\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CM1', matchedGradeConfidence: true };
  }
  if (/\bce2\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CE2', matchedGradeConfidence: true };
  }
  if (/\bce1\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CE1', matchedGradeConfidence: true };
  }
  if (/\bcp\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CP', matchedGradeConfidence: true };
  }
  if (/\b(ci|cours d'initiation|primaire|élémentaire|elementaire)\b/.test(corpus)) {
    return { cycle: 'primaire', grade: 'CI', matchedGradeConfidence: true };
  }

  // Collège (6e, 5e, 4e, 3e, BFEM)
  if (/\b(3e|3ème|3eme|troisième|troisieme|bfem)\b/.test(corpus)) {
    return { cycle: 'college', grade: '3e / BFEM', matchedGradeConfidence: true };
  }
  if (/\b(4e|4ème|4eme|quatrième|quatrieme)\b/.test(corpus)) {
    return { cycle: 'college', grade: '4e', matchedGradeConfidence: true };
  }
  if (/\b(5e|5ème|5eme|cinquième|cinquieme)\b/.test(corpus)) {
    return { cycle: 'college', grade: '5e', matchedGradeConfidence: true };
  }
  if (/\b(6e|6ème|6eme|sixième|sixieme|collège|college)\b/.test(corpus)) {
    return { cycle: 'college', grade: '6e', matchedGradeConfidence: true };
  }

  // Lycée (Seconde, Première, Terminale S1, S2, L2, L'1, G, Bac)
  if (/\b(ts1|tle s1|terminale s1)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Terminale S1', matchedGradeConfidence: true };
  }
  if (/\b(ts2|tle s2|terminale s2|terminale s|tle s)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Terminale S2', matchedGradeConfidence: true };
  }
  if (/\b(tl2|tle l2|terminale l2|terminale l|tle l)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Terminale L2', matchedGradeConfidence: true };
  }
  if (/\b(terminale|tle|baccalauréat|baccalaureat|\bbac\b)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Terminale (Bac)', matchedGradeConfidence: true };
  }
  if (/\b(1ere s|1ère s|premiere s|première s)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Première S', matchedGradeConfidence: true };
  }
  if (/\b(1ere|1ère|premiere|première)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Première', matchedGradeConfidence: true };
  }
  if (/\b(2nde|seconde|lycée|lycee)\b/.test(corpus)) {
    return { cycle: 'lycee', grade: 'Seconde', matchedGradeConfidence: true };
  }

  // Formation Pro
  if (/\b(bts|cap\b|bep\b|formation pro|professionnel)\b/.test(corpus)) {
    return { cycle: 'formation_pro', grade: 'BTS / Formation Pro', matchedGradeConfidence: true };
  }

  // Université (Licence 1, 2, 3, Master, Doctorat)
  if (/\b(doctorat|thèse|these|phd)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Doctorat', matchedGradeConfidence: true };
  }
  if (/\b(master 2|\bm2\b)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Master 2', matchedGradeConfidence: true };
  }
  if (/\b(master 1|\bm1\b|master)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Master', matchedGradeConfidence: true };
  }
  if (/\b(licence 3|\bl3\b)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Licence 3', matchedGradeConfidence: true };
  }
  if (/\b(licence 2|\bl2\b)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Licence 2', matchedGradeConfidence: true };
  }
  if (/\b(licence 1|\bl1\b|licence|universit)\b/.test(corpus)) {
    return { cycle: 'universite', grade: 'Licence 1', matchedGradeConfidence: true };
  }

  return { cycle: 'lycee', grade: 'Terminale S2', matchedGradeConfidence: false };
}

function detectSubject(corpus: string): string {
  if (/\b(math|algèbre|algebre|géométrie|geometrie|arithmétique|probabilit|analyse|calcul)\b/.test(corpus)) {
    return 'Mathématiques';
  }
  if (/\b(physique|chimie|\bpc\b|mécanique|mecanique|électromagnétisme|organique|thermodynamique)\b/.test(corpus)) {
    return 'Physique-Chimie';
  }
  if (/\b(svt|biologie|géologie|geologie|sciences de la vie|sciences naturelles)\b/.test(corpus)) {
    return 'SVT';
  }
  if (/\b(philosophie|philo|épistémologie|esthétique|métaphysique)\b/.test(corpus)) {
    return 'Philosophie';
  }
  if (/\b(français|francais|littérature|litterature|grammaire|orthographe|conjugaison|roman|poésie|poesie|dissertation)\b/.test(corpus)) {
    return 'Français';
  }
  if (/\b(histoire|géographie|geographie|hist-geo|civilisation|décolonisation)\b/.test(corpus)) {
    return 'Histoire-Géographie';
  }
  if (/\b(anglais|english|espagnol|allemand|arabe|langue)\b/.test(corpus)) {
    return 'Anglais';
  }
  if (/\b(informatique|algorithmique|programmation|python|java|réseaux|base de données|numérique|ia)\b/.test(corpus)) {
    return 'Informatique';
  }
  if (/\b(droit|constitutionnel|administratif|pénal|civil|juridique|législation|code)\b/.test(corpus)) {
    return 'Droit & Administration';
  }
  if (/\b(économie|economie|gestion|comptabilité|comptabilite|ohada|finance|management|marketing)\b/.test(corpus)) {
    return 'Économie & Gestion';
  }
  if (/\b(coran|tafsir|hadith|khassida|xassida|mouride|tidiane|bible|catéchisme|théologie|spiritualité|islam)\b/.test(corpus)) {
    return 'Spiritualité';
  }
  return 'Culture Générale';
}

function detectCategoryAndKind(
  corpus: string,
  pagesCount: number,
  matchedGradeConfidence: boolean
): {
  destination: AdminDestinationCategory;
  documentKind: DetectedDocumentKind;
  educationType: EducationResourceType;
  competition?: string;
  religionTradition?: string;
  documentCategory?: string;
  confidence: number;
} {
  // 1. CONCOURS NATIONAUX
  const contestMatches: Array<[RegExp, string]> = [
    [/\b(ena|école nationale d'administration|ecole nationale d'administration)\b/, 'ENA'],
    [/\b(fastef|ens\b|école normale supérieure)\b/, 'FASTEF'],
    [/\b(crem| élève-maître|eleve-maitre|formation des personnels de l'éducation)\b/, 'CREM'],
    [/\b(douane|douanes)\b/, 'Douanes'],
    [/\b(police|gendarmerie)\b/, 'Police & Gendarmerie'],
    [/\b(endss|santé|infirmier|sage-femme|internat)\b/, 'Santé & Médecine'],
    [/\b(cfj|magistrature|greffier)\b/, 'CFJ Magistrature'],
  ];

  for (const [regex, contestName] of contestMatches) {
    if (regex.test(corpus)) {
      return {
        destination: 'concours',
        documentKind: 'annale',
        educationType: 'annale',
        competition: contestName,
        confidence: 97,
      };
    }
  }

  // 2. RELIGION & SPIRITUALITÉS
  if (/\b(mouride|mouridisme|touba|bamba|khassida|xassida)\b/.test(corpus)) {
    return {
      destination: 'religion',
      documentKind: 'ouvrage_religieux',
      educationType: 'livre',
      religionTradition: 'Mouridisme',
      confidence: 96,
    };
  }
  if (/\b(tidiane|tidjaniya|tivaouane|el hadj malick|niassène|kaolack|layène)\b/.test(corpus)) {
    return {
      destination: 'religion',
      documentKind: 'ouvrage_religieux',
      educationType: 'livre',
      religionTradition: 'Tidjaniya',
      confidence: 96,
    };
  }
  if (/\b(islam|coran|hadith|fiqh|tafsir|prophète|prophete)\b/.test(corpus)) {
    return {
      destination: 'religion',
      documentKind: 'ouvrage_religieux',
      educationType: 'livre',
      religionTradition: 'Islam',
      confidence: 95,
    };
  }
  if (/\b(christianisme|chrétien|bible|évangile|evangile|saint augustin|catéchisme)\b/.test(corpus)) {
    return {
      destination: 'religion',
      documentKind: 'ouvrage_religieux',
      educationType: 'livre',
      religionTradition: 'Christianisme',
      confidence: 95,
    };
  }

  // 3. DOCUMENTS ADMINISTRATIFS / MODÈLES
  if (
    /\b(demande de stage|demande d'emploi|lettre de motivation|modèle de|modele de|formulaire|attestation|contrat|procuration|certificat|bourse|état civil|etat civil|cv\b|curriculum)\b/.test(
      corpus
    )
  ) {
    let docCat = 'administratif';
    if (/\b(bourse|inscription|scolarité|universit|examen)\b/.test(corpus)) docCat = 'etudes_examens';
    if (/\b(stage|emploi|cv|motivation|travail)\b/.test(corpus)) docCat = 'emploi_stage';
    return {
      destination: 'documents',
      documentKind: 'document',
      educationType: 'support',
      documentCategory: docCat,
      confidence: 95,
    };
  }

  // 4. ÉDUCATION : Distinction précise entre FASCICULE, LIVRE SCOLAIRE, ANNALE et COURS
  if (/\b(fascicule|recueil d'exercices|cahier d'exercices|série d'exercices|serie d'exercices|exercices corrigés|wahab diop|collection Excellence)\b/i.test(corpus)) {
    return {
      destination: 'education',
      documentKind: 'fascicule',
      educationType: 'exercice',
      confidence: 98,
    };
  }

  if (/\b(annale|épreuve|epreuve|sujet officiel|corrigé bac|corrige bac|corrigé bfem|sujet bfem|sujet bac)\b/.test(corpus)) {
    return {
      destination: 'education',
      documentKind: 'annale',
      educationType: 'annale',
      confidence: 96,
    };
  }

  if (/\b(manuel|livre scolaire|programme officiel|collection|tome|ciam|édition|edition)\b/.test(corpus) && matchedGradeConfidence) {
    return {
      destination: 'education',
      documentKind: 'livre',
      educationType: 'livre',
      confidence: 95,
    };
  }

  if (/\b(cours|chapitre|leçon|lecon|résumé de cours|fiche de révision|synthèse)\b/.test(corpus) || matchedGradeConfidence) {
    // Si le document fait plus de 80 pages et concerne une classe, c'est un Livre scolaire ou un Fascicule complet
    if (pagesCount >= 80) {
      return {
        destination: 'education',
        documentKind: 'livre',
        educationType: 'livre',
        confidence: 93,
      };
    }
    return {
      destination: 'education',
      documentKind: 'fascicule',
      educationType: 'cours',
      confidence: 92,
    };
  }

  // 5. BIBLIOTHÈQUE GÉNÉRALE (Livre / Roman / Essai / Ouvrage de référence)
  return {
    destination: 'bibliotheque',
    documentKind: 'livre',
    educationType: 'livre',
    confidence: 91,
  };
}

function buildCleanTitle(
  fileName: string,
  metaTitle: string | undefined,
  kind: DetectedDocumentKind,
  subject: string,
  grade: string,
  competition?: string
): string {
  // Si le PDF contient un vrai titre propre (pas "Microsoft Word - ..." ni "Untitled")
  if (
    metaTitle &&
    metaTitle.length >= 5 &&
    !/^(untitled|sans titre|document|microsoft word|scan|page)/i.test(metaTitle)
  ) {
    return metaTitle;
  }

  // Nettoyage du nom de fichier
  let base = fileName
    .replace(/\.[a-zA-Z0-9]+$/, '') // retire l'extension
    .replace(/[_—–-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalisation de la première lettre
  if (base.length > 0) {
    base = base.charAt(0).toUpperCase() + base.slice(1);
  }

  // Si le nom de fichier était très court ou générique, on l'enrichit
  if (base.length < 8) {
    if (competition) return `Annale officielle ${competition} — ${subject}`;
    if (kind === 'fascicule') return `Fascicule de ${subject} — ${grade}`;
    if (kind === 'livre') return `Manuel de ${subject} — ${grade}`;
  }

  return base;
}

function detectAuthorAndInstitution(
  fileName: string,
  metaAuthor: string | undefined,
  extractedText: string,
  destination: AdminDestinationCategory,
  competition?: string,
  subject?: string
): { author: string; institution: string } {
  // 1. Si l'auteur est dans les métadonnées PDF et valide
  if (
    metaAuthor &&
    metaAuthor.length >= 3 &&
    !/^(admin|user|utilisateur|hp|dell|lenovo|acer|pc|microsoft|scanner)/i.test(metaAuthor)
  ) {
    return {
      author: metaAuthor,
      institution: getDefaultInstitution(destination, competition),
    };
  }

  // 2. Recherche de motifs d'auteur dans le texte extrait ou le nom de fichier (ex: "Pr. ...", "M. ...", "Par ...")
  const authorPattern = extractedText.match(
    /(?:Auteur\s*:\s*|Par\s+|Professeur\s+|Pr\.\s*|Dr\.\s*|M\.\s+)([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)/
  );
  if (authorPattern && authorPattern[1]) {
    return {
      author: authorPattern[1].trim(),
      institution: getDefaultInstitution(destination, competition),
    };
  }

  // 3. Auteurs connus dans le corpus éducatif sénégalais
  const lower = `${fileName} ${extractedText}`.toLowerCase();
  if (lower.includes('wahab diop')) {
    return { author: 'M. Wahab Diop', institution: 'Lycée Seydina Limamoulaye /IGEN' };
  }
  if (lower.includes('ciam')) {
    return { author: 'Collectif Inter-Africain de Mathématiques (CIAM)', institution: 'EDICEF / Programme Francophone' };
  }
  if (lower.includes('cheikh anta diop')) {
    return { author: 'Pr. Cheikh Anta Diop', institution: 'IFAN / UCAD' };
  }
  if (lower.includes('ousmane sembène') || lower.includes('sembene')) {
    return { author: 'Ousmane Sembène', institution: 'Patrimoine Littéraire Africain' };
  }
  if (lower.includes('mariama bâ') || lower.includes('mariama ba')) {
    return { author: 'Mariama Bâ', institution: 'Nouvelles Éditions Africaines' };
  }
  if (lower.includes('ahmadou bamba') || lower.includes('khadimou rassoul')) {
    return { author: 'Cheikh Ahmadou Bamba', institution: 'Bibliothèque Patrimoniale de Touba' };
  }

  if (destination === 'concours' && competition) {
    return {
      author: `Jury Officiel ${competition}`,
      institution: `Direction Générale ${competition} Sénégal`,
    };
  }
  if (destination === 'documents') {
    return {
      author: 'Rédaction Juridique & Administrative',
      institution: 'Service Public / Sunubiblio',
    };
  }
  if (destination === 'education') {
    return {
      author: `Cellule Pédagogique de ${subject || 'l’Éducation Nationale'}`,
      institution: 'Ministère de l’Éducation Nationale (MEN)',
    };
  }

  return {
    author: 'Éditions Académiques Sunubiblio',
    institution: 'Catalogue Certifié Sunubiblio',
  };
}

function getDefaultInstitution(destination: AdminDestinationCategory, competition?: string): string {
  if (competition) return `Direction des Concours (${competition})`;
  if (destination === 'education') return 'Ministère de l’Éducation Nationale / IGEN';
  if (destination === 'documents') return 'Portail Administratif Sénégal';
  if (destination === 'religion') return 'Institut du Patrimoine Spirituel';
  return 'Bibliothèque Universelle Sunubiblio';
}

function buildSmartDescription(params: {
  title: string;
  documentKind: DetectedDocumentKind;
  destination: AdminDestinationCategory;
  grade: string;
  subject: string;
  author: string;
  institution: string;
  competition?: string;
  religionTradition?: string;
  pagesCount: number;
}): string {
  if (params.destination === 'concours') {
    return `Ressource préparatoire officielle pour le concours ${params.competition || 'national'} (${params.subject}). Inclut sujets, barèmes et éléments méthodologiques (${params.pagesCount} pages).`;
  }
  if (params.destination === 'documents') {
    return `Modèle et document officiel prêt à l'emploi (${params.title}), vérifié et conforme aux démarches administratives, académiques et professionnelles au Sénégal.`;
  }
  if (params.destination === 'religion') {
    return `Ouvrage patrimonial et spirituel (${params.religionTradition || 'Tradition'}) par ${params.author}. Édition numérisée de ${params.pagesCount} pages.`;
  }
  if (params.documentKind === 'fascicule') {
    return `Fascicule pédagogique complet de ${params.subject} destiné aux élèves de ${params.grade}. Contient rappels de cours, séries d'exercices progressifs et corrigés détaillés (${params.pagesCount} pages).`;
  }
  if (params.documentKind === 'livre') {
    return `Livre et manuel de référence en ${params.subject} (${params.grade}) par ${params.author} (${params.institution}). Couverture intégrale du programme officiel (${params.pagesCount} pages).`;
  }
  return `Support pédagogique de ${params.subject} pour le niveau ${params.grade}, rédigé par ${params.author} (${params.pagesCount} pages).`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} Ko`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} Mo`;
}

/**
 * Génère un lot de démonstration réaliste représentant un dossier complet ("Dossier_Rentree_Sunubiblio_2025")
 * contenant des livres scolaires, des fascicules par classe, des sujets de concours et des documents administratifs.
 */
export function generateSampleFolderBatch(): AnalyzedStagingItem[] {
  const sampleSpecs: Array<{
    fileName: string;
    folderPath: string;
    title: string;
    author: string;
    institution: string;
    destination: AdminDestinationCategory;
    documentKind: DetectedDocumentKind;
    educationType: EducationResourceType;
    cycle: EducationCycleId;
    grade: string;
    subject: string;
    pagesCount: number;
    year: number;
    competition?: string;
    religionTradition?: string;
    documentCategory?: string;
  }> = [
    {
      fileName: 'Fascicule_Physique_Chimie_Terminale_S2_Wahab_Diop_2025.pdf',
      folderPath: 'Pack_Sunubiblio / Education / Lycee / Terminale_S2',
      title: 'Fascicule Physique-Chimie Terminale S1 & S2 — Cours & Exercices Corrigés',
      author: 'M. Wahab Diop',
      institution: 'Inspection Générale de l’Éducation Nationale (IGEN)',
      destination: 'education',
      documentKind: 'fascicule',
      educationType: 'exercice',
      cycle: 'lycee',
      grade: 'Terminale S2',
      subject: 'Physique-Chimie',
      pagesCount: 164,
      year: 2025,
    },
    {
      fileName: 'Manuel_CIAM_Mathematiques_3eme_BFEM.pdf',
      folderPath: 'Pack_Sunubiblio / Education / College / 3eme',
      title: 'Manuel CIAM Mathématiques 3e — Programme Officiel & Préparation BFEM',
      author: 'Collectif Inter-Africain de Mathématiques (CIAM)',
      institution: 'EDICEF / Ministère de l’Éducation Nationale',
      destination: 'education',
      documentKind: 'livre',
      educationType: 'livre',
      cycle: 'college',
      grade: '3e / BFEM',
      subject: 'Mathématiques',
      pagesCount: 256,
      year: 2025,
    },
    {
      fileName: 'Fascicule_SVT_Terminale_S2_Genetique_Immunologie.pdf',
      folderPath: 'Pack_Sunubiblio / Education / Lycee / Terminale_S2',
      title: 'Fascicule d’Excellence SVT Terminale S2 — Neurophysiologie, Génétique & Immunologie',
      author: 'Cellule Nationale SVT Sénégal',
      institution: 'Lycée Lamine Guèye / Académie de Dakar',
      destination: 'education',
      documentKind: 'fascicule',
      educationType: 'exercice',
      cycle: 'lycee',
      grade: 'Terminale S2',
      subject: 'SVT',
      pagesCount: 142,
      year: 2025,
    },
    {
      fileName: 'Livre_Lecture_Et_Calcul_CM2_CFEE_Sidy_Et_Rama.pdf',
      folderPath: 'Pack_Sunubiblio / Education / Primaire / CM2',
      title: 'Livre de Français & Calcul CM2 — Objectif Réussite au CFEE et Entrée en 6e',
      author: 'Inspection Élémentaire de Dakar',
      institution: 'INEADE / Ministère de l’Éducation Nationale',
      destination: 'education',
      documentKind: 'livre',
      educationType: 'livre',
      cycle: 'primaire',
      grade: 'CM2 / CFEE',
      subject: 'Français',
      pagesCount: 198,
      year: 2025,
    },
    {
      fileName: 'ENA_Cycle_A_Annale_Droit_Public_Culture_Generale_2024.pdf',
      folderPath: 'Pack_Sunubiblio / Concours / ENA',
      title: 'ENA Cycle A — Annales Officielles & Corrigés de Culture Générale et Droit Public',
      author: 'Jury Officiel ENA Sénégal',
      institution: 'École Nationale d’Administration (ENA)',
      destination: 'concours',
      documentKind: 'annale',
      educationType: 'annale',
      cycle: 'universite',
      grade: 'Master',
      subject: 'Droit & Administration',
      competition: 'ENA',
      pagesCount: 96,
      year: 2025,
    },
    {
      fileName: 'Modele_Demande_De_Bourse_Nationale_Et_Stage_Certifie.pdf',
      folderPath: 'Pack_Sunubiblio / Documents_Administratifs',
      title: 'Guide & Modèles Officiels : Demande de Bourse Nationale, Stage et Lettre de Motivation',
      author: 'Direction des Bourses & Orientation',
      institution: 'Portail Administratif Sénégal',
      destination: 'documents',
      documentKind: 'document',
      educationType: 'support',
      cycle: 'universite',
      grade: 'Licence 1',
      subject: 'Droit & Administration',
      documentCategory: 'etudes_examens',
      pagesCount: 18,
      year: 2025,
    },
    {
      fileName: 'Une_Si_Longue_Lettre_Mariama_Ba_Edition_Annotee.pdf',
      folderPath: 'Pack_Sunubiblio / Bibliotheque / Litterature_Africaine',
      title: 'Une si longue lettre — Édition Critique & Fiches de Lecture Analytiques',
      author: 'Mariama Bâ',
      institution: 'Nouvelles Éditions Africaines du Sénégal (NEAS)',
      destination: 'bibliotheque',
      documentKind: 'livre',
      educationType: 'livre',
      cycle: 'lycee',
      grade: 'Seconde',
      subject: 'Français',
      pagesCount: 168,
      year: 2024,
    },
    {
      fileName: 'Fascicule_Algebre_Analyse_Licence_1_UCAD_FST.pdf',
      folderPath: 'Pack_Sunubiblio / Education / Universite / Licence_1',
      title: 'Fascicule d’Algèbre Linéaire & Analyse 1 — TD Corrigés et Examens résolus L1',
      author: 'Département de Mathématiques FST',
      institution: 'Université Cheikh Anta Diop (UCAD)',
      destination: 'education',
      documentKind: 'fascicule',
      educationType: 'exercice',
      cycle: 'universite',
      grade: 'Licence 1',
      subject: 'Mathématiques',
      pagesCount: 134,
      year: 2025,
    },
  ];

  const kindLabelMap: Record<DetectedDocumentKind, string> = {
    livre: 'Livre & Manuel',
    fascicule: 'Fascicule Éducation',
    cours: 'Cours & Synthèse',
    annale: 'Annale & Corrigé',
    document: 'Document Officiel',
    ouvrage_religieux: 'Ouvrage Spirituel',
  };

  return sampleSpecs.map((spec, index) => {
    const coverImage = generateEditorialCoverDataUrl({
      title: spec.title,
      author: spec.author,
      kindLabel: kindLabelMap[spec.documentKind],
      gradeOrSub: spec.competition || spec.grade,
      subject: spec.subject,
    });

    return {
      id: `demo-batch-${Date.now()}-${index}`,
      fileName: spec.fileName,
      folderPath: spec.folderPath,
      fileSizeFormatted: `${(spec.pagesCount * 0.08 + 1.2).toFixed(1)} Mo`,
      status: 'ready',
      confidence: 96 + (index % 4),
      title: spec.title,
      author: spec.author,
      institution: spec.institution,
      year: spec.year,
      pagesCount: spec.pagesCount,
      description: buildSmartDescription({
        title: spec.title,
        documentKind: spec.documentKind,
        destination: spec.destination,
        grade: spec.grade,
        subject: spec.subject,
        author: spec.author,
        institution: spec.institution,
        competition: spec.competition,
        religionTradition: spec.religionTradition,
        pagesCount: spec.pagesCount,
      }),
      destination: spec.destination,
      documentKind: spec.documentKind,
      educationType: spec.educationType,
      cycle: spec.cycle,
      grade: spec.grade,
      subject: spec.subject,
      competition: spec.competition,
      religionTradition: spec.religionTradition,
      documentCategory: spec.documentCategory,
      accessLevel: spec.documentKind === 'document' ? 'free' : 'subscription',
      coverImage,
      coverGradient: COVER_GRADIENTS[spec.subject] || COVER_GRADIENTS.Général,
      coverSource: 'auto_editorial',
      createdAt: new Date().toISOString(),
    };
  });
}

