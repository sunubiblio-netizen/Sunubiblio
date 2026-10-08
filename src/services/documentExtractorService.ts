/**
 * Sunubiblio — Service d'Extraction et d'Analyse de Documents
 * 
 * Capable d'extraire le texte de fichiers :
 * - Texte (.txt, .md, .csv, .json, .rtf, .tsv)
 * - Word (.docx) : via extraction de word/document.xml
 * - PDF (.pdf) : via extraction des flux de texte décompressés FlateDecode
 * 
 * Fonctionne de manière autonome sans dépendances lourdes.
 */

import zlib from 'zlib';

export interface DocumentChunk {
  id: number;
  title: string;
  content: string;
  summary: string;
  keyConcepts: string[];
}

export interface ExtractedDocumentData {
  text: string;
  cleanedTitle: string;
  wordCount: number;
  subject: string;
  subjectLabel: string;
  isScientific: boolean;
  detectedLevel: string;
  keyConcepts: string[];
  summary: string;
  chapters: DocumentChunk[];
  definitions: { term: string; definition: string }[];
  formulas: { name: string; formula: string; explanation?: string }[];
  keyRulesOrTheorems: string[];
  historicalEvents?: { period: string; event: string }[];
  keyFigures?: { name: string; role: string }[];
}

/**
 * Nettoie un nom de fichier pour obtenir un titre humain élégant
 * Ex: "cours_mathematiques_terminale_s2.pdf" -> "Cours Mathématiques Terminale S2"
 */
export function cleanDocumentName(filename: string): string {
  if (!filename) return 'Document d’étude';
  
  // Supprime l'extension (.pdf, .docx, .txt, etc.)
  let name = filename.replace(/\.(pdf|docx|doc|txt|md|rtf|csv|json)$/i, '');
  
  // Remplace les underscores, tirets et séparateurs par des espaces
  name = name.replace(/[_-]+/g, ' ');
  
  // Enlève les préfixes génériques inutiles
  name = name.replace(/^(cours|devoir|exercice|fiche|document|sujet)\s*de\s*/i, '');
  name = name.replace(/^(copie\s*de\s*|nouveau\s*document\s*)/i, '');
  
  // Met en forme (majuscule en début de mot si tout est en minuscule)
  name = name.trim();
  if (name.length === 0) return 'Document d’étude';
  
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Extrait le texte d'un buffer DOCX en analysant l'archive zip
 */
function extractDocxText(buffer: Buffer): string {
  try {
    // Dans un zip DOCX, recherchons l'entrée "word/document.xml"
    const targetFile = Buffer.from('word/document.xml', 'utf-8');
    const idx = buffer.indexOf(targetFile);
    
    if (idx !== -1) {
      // Rechercher l'en-tête du fichier local PK\x03\x04
      const headerIdx = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), idx);
      if (headerIdx !== -1) {
        // En-tête de fichier local : compression method à headerIdx + 8 (2 octets)
        const compressionMethod = buffer.readUInt16LE(headerIdx + 8);
        const compressedSize = buffer.readUInt32LE(headerIdx + 18);
        const fileNameLength = buffer.readUInt16LE(headerIdx + 26);
        const extraFieldLength = buffer.readUInt16LE(headerIdx + 28);
        
        const dataStart = headerIdx + 30 + fileNameLength + extraFieldLength;
        const compressedData = buffer.subarray(dataStart, dataStart + (compressedSize || buffer.length - dataStart));
        
        let xmlContent = '';
        if (compressionMethod === 8) {
          // Deflate (sans en-tête zlib, standard ZIP)
          const decompressed = zlib.inflateRawSync(compressedData);
          xmlContent = decompressed.toString('utf-8');
        } else if (compressionMethod === 0) {
          xmlContent = compressedData.toString('utf-8');
        }

        if (xmlContent) {
          // Extraction des balises <w:t> et paragraphes
          const matches = xmlContent.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
          if (matches && matches.length > 0) {
            const rawText = matches
              .map((tag) => tag.replace(/<\/?w:t[^>]*>/g, ''))
              .join(' ');
            return cleanExtractedText(rawText);
          }
        }
      }
    }
  } catch {
    // Fallback regex sur les fragments XML bruts si compression standard échoue
  }

  // Fallback: extraction de tout fragment textuel identifiable
  const fallbackStr = buffer.toString('binary');
  const xmlFragments = fallbackStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (xmlFragments) {
    return xmlFragments.map(t => t.replace(/<[^>]+>/g, '')).join(' ');
  }

  return '';
}

/**
 * Extrait le texte d'un buffer PDF en analysant les flux textuels et FlateDecode
 */
/**
 * Détecte si un texte contient du code PDF, des métadonnées ou des artefacts binaires non textuels
 */
export function isGarbageText(text: string): boolean {
  if (!text || text.trim().length < 15) return true;
  // Détecte les résidus de syntaxe PDF ou de métadonnées binaires
  const pdfArtifacts = /(\/Type|\/Filespec|\/Catalog|\/ObjStm|\/Filter|FlateDecode|c2pa|Credentials|opensource\s+[a-zA-Z0-9;!]{5,}|stream|endstream|[a-zA-Z0-9]{18,})/i;
  if (pdfArtifacts.test(text)) {
    return true;
  }
  // Vérifie le ratio de caractères alphabétiques et d'espaces
  const alphaSpaces = text.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').length;
  if (alphaSpaces / text.length < 0.60) {
    return true;
  }
  return false;
}

/**
 * Valide qu'un titre proposé est bien un titre humain compréhensible
 */
export function isValidDocumentTitle(title: string): boolean {
  if (!title || title.length < 3 || title.length > 80) return false;
  if (/(\/Type|\/Filespec|\/UF|\/Catalog|c2pa|Credentials|opensource|http|www\.|<[^>]+>|[a-zA-Z0-9;!]{12,})/i.test(title)) {
    return false;
  }
  const lettersAndSpaces = title.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').length;
  if (lettersAndSpaces / title.length < 0.70) return false;
  return true;
}

/**
 * Extrait le texte d'un buffer PDF en utilisant d'abord unpdf (PDF.js officiel),
 * avec repli sur les blocs BT...ET décompressés
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // 1. Moteur officiel PDF.js via unpdf
  try {
    const { extractText } = await import('unpdf');
    const res = await extractText(new Uint8Array(buffer), { mergePages: true });
    if (res && res.text && res.text.trim().length > 30) {
      const cleaned = cleanExtractedText(res.text);
      if (!isGarbageText(cleaned)) {
        return cleaned;
      }
    }
  } catch (err) {
    console.warn('[PDF Extractor] unpdf warning, bascule sur parseur de secours:', err);
  }

  // 2. Parseur de secours ciblant uniquement les flux de texte BT...ET
  const textChunks: string[] = [];
  const rawString = buffer.toString('binary');
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamData = Buffer.from(match[1], 'binary');
    let decodedText = '';

    try {
      decodedText = zlib.inflateSync(streamData).toString('latin1');
    } catch {
      try {
        decodedText = zlib.inflateRawSync(streamData).toString('latin1');
      } catch {
        continue;
      }
    }

    if (decodedText && decodedText.includes('BT')) {
      const btRegex = /BT[\s\S]*?ET/g;
      let btMatch: RegExpExecArray | null;
      while ((btMatch = btRegex.exec(decodedText)) !== null) {
        const block = btMatch[0];
        const tjRegex = /\(([\s\S]*?)\)\s*Tj/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(block)) !== null) {
          textChunks.push(decodePdfLiteralString(tjMatch[1]));
        }

        const arrayTjRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let arrMatch: RegExpExecArray | null;
        while ((arrMatch = arrayTjRegex.exec(block)) !== null) {
          const innerStrings = arrMatch[1].match(/\(([\s\S]*?)\)/g);
          if (innerStrings) {
            textChunks.push(innerStrings.map(s => decodePdfLiteralString(s.slice(1, -1))).join(''));
          }
        }
      }
    }
  }

  const result = cleanExtractedText(textChunks.join(' '));
  if (result.length > 30 && !isGarbageText(result)) {
    return result;
  }

  return '';
}

function decodePdfLiteralString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

export function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    // Supprimer les paquets XML / XMP
    .replace(/<\?xpacket[\s\S]*?\?>/g, ' ')
    .replace(/<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/g, ' ')
    // Supprimer les résidus de syntaxe de dictionnaire PDF (/Type /Filespec /UF ...)
    .replace(/\/[A-Za-z0-9_]+(?:\s*\([^)]*\)|\s*\/[A-Za-z0-9_]+)*/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // caractères de contrôle
    .replace(/\s+/g, ' ') // espaces multiples
    .trim();
}

/**
 * Détecte la discipline académique et le niveau scolaire d'un texte/titre
 */
export function detectSubjectAndLevel(text: string, title: string): {
  subject: string;
  subjectLabel: string;
  isScientific: boolean;
  detectedLevel: string;
} {
  const combined = (title + ' ' + text.slice(0, 4000)).toLowerCase();

  // Niveau
  let detectedLevel = 'lycee';
  if (/(primaire|cm2|cm1|ce2|ce1|cp|ci)\b/i.test(combined)) {
    detectedLevel = 'primaire';
  } else if (/(collège|college|6e|5e|4e|3e|brevet|bfem)\b/i.test(combined)) {
    detectedLevel = 'college';
  } else if (/(université|universite|licence|master|doctorat|l1|l2|l3|m1|m2|faculté)\b/i.test(combined)) {
    detectedLevel = 'superieur';
  } else if (/(concours|ena|douane|police|fastef|cfj|crpe|recrutement)\b/i.test(combined)) {
    detectedLevel = 'concours';
  } else if (/(seconde|première|premiere|terminale|bac|baccalauréat|tle|1ere)\b/i.test(combined)) {
    detectedLevel = 'lycee';
  }

  // Matière & Type scientifique
  if (/(mathématique|mathematique|maths|algèbre|algebre|géométrie|geometrie|trigonométrie|dérivée|intégrale|polynôme|matrice|vecteur|probabilité)\b/i.test(combined)) {
    return { subject: 'mathematiques', subjectLabel: 'Mathématiques', isScientific: true, detectedLevel };
  }
  if (/(physique|chimie|mécanique|cinématique|newton|vitesse|accélération|force|énergie|électricité|atome|môle|réaction|acide|base|solution)\b/i.test(combined)) {
    return { subject: 'physique_chimie', subjectLabel: 'Physique - Chimie', isScientific: true, detectedLevel };
  }
  if (/(svt|biologie|cellule|adn|gène|mitose|méiose|photosynthèse|organisme|écosystème|géologie|système nerveux|immunité)\b/i.test(combined)) {
    return { subject: 'svt', subjectLabel: 'Sciences de la Vie et de la Terre', isScientific: true, detectedLevel };
  }
  if (/(français|francais|littérature|litterature|poésie|roman|théâtre|dissertation|grammaire|conjugaison|figure de style|métaphore)\b/i.test(combined)) {
    return { subject: 'francais', subjectLabel: 'Français & Littérature', isScientific: false, detectedLevel };
  }
  if (/(philosophie|conscience|inconscient|morale|devoir|vérité|verite|justice|liberté|liberte|kant|descartes|platon|rousseau|désir)\b/i.test(combined)) {
    return { subject: 'philosophie', subjectLabel: 'Philosophie', isScientific: false, detectedLevel };
  }
  if (/(histoire|géographie|geographie|siècle|guerre|traité|décolonisation|sénégal|senegal|afrique|démographie|climat|territoire)\b/i.test(combined)) {
    return { subject: 'histoire_geo', subjectLabel: 'Histoire - Géographie', isScientific: false, detectedLevel };
  }
  if (/(économie|economie|gestion|comptabilité|comptabilite|marché|offre|demande|inflation|pib|budget|investissement|entreprise)\b/i.test(combined)) {
    return { subject: 'economie', subjectLabel: 'Économie & Gestion', isScientific: true, detectedLevel };
  }
  if (/(droit|juridique|loi|constitution|code civil|pénal|penal|contrat|juridiction|responsabilité|contentieux)\b/i.test(combined)) {
    return { subject: 'droit', subjectLabel: 'Droit & Sciences Juridiques', isScientific: false, detectedLevel };
  }

  return { subject: 'general', subjectLabel: 'Enseignement Général', isScientific: false, detectedLevel };
}

/**
 * Découpe un document en chapitres / sections thématiques (chunks de 400 à 1000 mots)
 */
function chunkDocument(text: string, title: string): DocumentChunk[] {
  if (!text || text.trim().length === 0) {
    return [
      {
        id: 1,
        title: title || 'Section Principale',
        content: text,
        summary: `Contenu d'étude pour ${title}.`,
        keyConcepts: ['Concepts clés', 'Méthodologie'],
      },
    ];
  }

  // Tenter de découper par en-têtes explicites (Chapitre, Section, Partie, Grand I, etc.)
  const headerRegex = /(?:\n\s*(?:chapitre|partie|section|module|grand\s+[ivx\d]+|[ivx\d]+\.)\s+([^\n]{3,80}))/gi;
  const matches = Array.from(text.matchAll(headerRegex));

  if (matches.length >= 2) {
    const chunks: DocumentChunk[] = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const start = match.index || 0;
      const end = i < matches.length - 1 ? (matches[i + 1].index || text.length) : text.length;
      const content = text.slice(start, end).trim();
      const chunkTitle = match[1]?.trim() || `Section ${i + 1}`;
      const firstLines = content.split('\n').filter(l => l.trim().length > 10).slice(0, 3).join(' ');

      chunks.push({
        id: i + 1,
        title: chunkTitle.charAt(0).toUpperCase() + chunkTitle.slice(1),
        content,
        summary: firstLines.slice(0, 200) || `Développement portant sur ${chunkTitle}.`,
        keyConcepts: [chunkTitle.slice(0, 25)],
      });
    }
    return chunks;
  }

  // Découpage automatique par paquets de paragraphes (~600 mots)
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 20);
  if (paragraphs.length <= 3) {
    return [
      {
        id: 1,
        title: title || 'Section Complète',
        content: text,
        summary: text.slice(0, 220),
        keyConcepts: ['Fondements', 'Application'],
      },
    ];
  }

  const chunks: DocumentChunk[] = [];
  let currentWords: string[] = [];
  let chunkIndex = 1;

  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/);
    currentWords.push(...paraWords);

    if (currentWords.length >= 500) {
      const chunkContent = currentWords.join(' ');
      chunks.push({
        id: chunkIndex,
        title: `Partie ${chunkIndex} — ${title}`,
        content: chunkContent,
        summary: chunkContent.slice(0, 220),
        keyConcepts: [`Partie ${chunkIndex}`],
      });
      chunkIndex++;
      currentWords = [];
    }
  }

  if (currentWords.length > 0) {
    const chunkContent = currentWords.join(' ');
    if (chunks.length > 0 && currentWords.length < 100) {
      // Fusionner avec le dernier si très court
      chunks[chunks.length - 1].content += '\n\n' + chunkContent;
    } else {
      chunks.push({
        id: chunkIndex,
        title: `Partie ${chunkIndex} — ${title}`,
        content: chunkContent,
        summary: chunkContent.slice(0, 220),
        keyConcepts: [`Partie ${chunkIndex}`],
      });
    }
  }

  return chunks.length > 0 ? chunks : [
    {
      id: 1,
      title: title || 'Section Principale',
      content: text,
      summary: text.slice(0, 220),
      keyConcepts: ['Notions clés'],
    },
  ];
}

/**
 * Extrait les définitions explicites repérées dans le texte
 */
function extractDefinitions(text: string): { term: string; definition: string }[] {
  const definitions: { term: string; definition: string }[] = [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 15);

  const defPatterns = [
    /^(?:définition\s*:?\s*)?([A-ZÀ-ÿ][a-zà-ÿA-Z\s'-]{2,30})\s*:\s*([^.\n]+[.!?]?)/i,
    /(?:on appelle|on définit par)\s+([A-ZÀ-ÿa-zà-ÿ\s'-]{3,35})\s+([^.\n]{15,180}[.!?])/i,
    /([A-ZÀ-ÿa-zà-ÿ\s'-]{3,30})\s+(?:désigne|est défini comme|correspond à)\s+([^.\n]{15,180}[.!?])/i,
  ];

  for (const line of lines) {
    for (const pattern of defPatterns) {
      const match = line.match(pattern);
      if (match && match[1] && match[2]) {
        const term = match[1].trim();
        const definition = match[2].trim();
        if (term.length >= 3 && term.length <= 40 && definition.length >= 10) {
          if (!definitions.some(d => d.term.toLowerCase() === term.toLowerCase())) {
            definitions.push({ term, definition });
            if (definitions.length >= 8) return definitions;
          }
        }
      }
    }
  }

  return definitions;
}

/**
 * Extrait les formules de calcul mathématiques / physiques réelles du texte
 */
function extractFormulas(text: string): { name: string; formula: string; explanation?: string }[] {
  const formulas: { name: string; formula: string; explanation?: string }[] = [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 5);

  const formulaRegex = /([A-Za-z0-9_\s'’-]{2,25})\s*:\s*([A-Za-zΔλ\w()/\s*^+-]{2,30}\s*=\s*[^;\n]{2,50})/i;
  const standaloneEqualRegex = /([A-Za-zΔλ]\s*(?:\([a-z]\))?)\s*=\s*([a-zA-Z0-9Δλ()/\s*^+\-._]{2,40})/g;

  for (const line of lines) {
    const namedMatch = line.match(formulaRegex);
    if (namedMatch && namedMatch[1] && namedMatch[2]) {
      formulas.push({
        name: namedMatch[1].trim(),
        formula: namedMatch[2].trim(),
      });
      if (formulas.length >= 6) return formulas;
      continue;
    }

    let m: RegExpExecArray | null;
    while ((m = standaloneEqualRegex.exec(line)) !== null) {
      const full = `${m[1].trim()} = ${m[2].trim()}`;
      if (!formulas.some(f => f.formula === full) && full.length >= 5 && full.length <= 45) {
        formulas.push({
          name: 'Relation mathématique/physique',
          formula: full,
        });
        if (formulas.length >= 6) return formulas;
      }
    }
  }

  return formulas;
}

/**
 * Extrait les théorèmes, règles ou principes énoncés dans le cours
 */
function extractRulesAndTheorems(text: string): string[] {
  const rules: string[] = [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 15);

  const theoremRegex = /(?:théorème|loi|principe|propriété|règle)\s+(?:de\s+|d['’]\s*)?([^.\n:]{3,60})/i;

  for (const line of lines) {
    const match = line.match(theoremRegex);
    if (match && match[0]) {
      const item = line.slice(0, 150).trim();
      if (!rules.includes(item)) {
        rules.push(item);
        if (rules.length >= 6) return rules;
      }
    }
  }

  return rules;
}

/**
 * Extrait les repères chronologiques et événements historiques du texte
 */
function extractHistoricalEvents(text: string): { period: string; event: string }[] {
  const events: { period: string; event: string }[] = [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 8);

  // 1. Lignes chronologiques explicites : "1549 : bataille de Danki..." ou "Ier millénaire : édification..."
  const chronoLineRegex = /^[-*•]?\s*([Ier\d]+(?:\s*(?:millénaire|siècle|er\s+décembre|août|juin|mars|avril|octobre|février))?|\b\d{4}\b|vers\s+\d{3,4}|dès\s+le\s+[IVXLCDM]+e\s+siècle)\s*[:–-]\s*([^.\n;]{10,140})/i;

  for (const line of lines) {
    const match = line.match(chronoLineRegex);
    if (match && match[1] && match[2]) {
      const period = match[1].trim();
      const event = match[2].trim();
      if (!events.some(e => e.period === period || e.event === event)) {
        events.push({ period, event });
        if (events.length >= 10) return events;
      }
    }
  }

  // 2. Événements dans le corps de texte : "En 1549, ...", "Le 20 août 1960, ..."
  const narrativeRegex = /(?:en\s+(\d{4})|le\s+(\d{1,2}(?:er)?\s+[a-zA-Zà-ÿ]+\s+\d{4}))\s*,\s*([^.\n]{15,120}[.!?])/gi;
  let m: RegExpExecArray | null;
  while ((m = narrativeRegex.exec(text)) !== null) {
    const period = (m[1] || m[2])?.trim();
    const event = m[3]?.trim();
    if (period && event && !events.some(e => e.period === period)) {
      events.push({ period, event });
      if (events.length >= 12) break;
    }
  }

  return events;
}

/**
 * Extrait les personnalités et acteurs majeurs du texte
 */
function extractKeyFigures(text: string): { name: string; role: string }[] {
  const figures: { name: string; role: string }[] = [];
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 20);

  const figurePatterns = [
    /(?:le roi|le damel|le bourba|le président|le gouverneur|le député|l'opposant|fondateur\s+d'un|poète\s+et)\s+([A-ZÀ-ÿ][a-zà-ÿA-Z\s'-]{3,30})[,\s]+([^.\n]{15,120})/i,
    /([A-ZÀ-ÿ][a-zà-ÿA-Z\s'-]{3,28})\s*,\s*(fondateur|damel|bourba|gouverneur|président|premier ministre|écrivain|poète|figure\s+de\s+la)\s+([^.\n]{15,100})/i,
  ];

  for (const line of lines) {
    for (const pat of figurePatterns) {
      const match = line.match(pat);
      if (match && match[1] && (match[2] || match[3])) {
        const name = match[1].trim();
        const role = (match[3] ? `${match[2]} ${match[3]}` : match[2]).trim();
        if (name.length >= 4 && !figures.some(f => f.name.toLowerCase() === name.toLowerCase())) {
          figures.push({ name, role });
          if (figures.length >= 8) return figures;
        }
      }
    }
  }

  return figures;
}

/**
 * Analyse le texte extrait pour en dégager les points clés, le vrai titre,
 * la matière, le niveau, les chapitres, formules et définitions réelles.
 */
export function analyzeDocumentContent(rawText: string, fallbackFileName: string): ExtractedDocumentData {
  const fallbackClean = cleanDocumentName(fallbackFileName);
  const isGarbage = isGarbageText(rawText);

  // Si le texte extrait est corrompu ou illisible, on le neutralise
  const validText = isGarbage ? '' : rawText;
  const cleaned = cleanExtractedText(validText);
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5 && !isGarbageText(s));

  // 1. Déduction du titre réel à partir du texte (sans nom de fichier)
  let cleanedTitle = '';

  if (cleaned.length > 20) {
    const rawLines = validText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 3);
    for (const line of rawLines.slice(0, 6)) {
      const cleanLine = line.replace(/^[#\-*\d.:\s]+/, '').trim();
      if (isValidDocumentTitle(cleanLine)) {
        const lower = cleanLine.toLowerCase();
        if (
          lower.startsWith('chapitre') ||
          lower.startsWith('leçon') ||
          lower.startsWith('cours') ||
          lower.startsWith('thème') ||
          lower.startsWith('module') ||
          !cleanLine.endsWith('.')
        ) {
          cleanedTitle = cleanLine;
          break;
        }
      }
    }

    if (!cleanedTitle) {
      for (const s of sentences.slice(0, 5)) {
        const cleanCandidate = s.replace(/^[#\-*\d.:\s]+/, '').trim();
        if (isValidDocumentTitle(cleanCandidate) && cleanCandidate.split(' ').length <= 8) {
          cleanedTitle = cleanCandidate;
          break;
        }
      }
    }
  }

  // Si aucun titre valide n'a pu être extrait avec certitude, toujours utiliser le titre assaini du fichier
  if (!cleanedTitle || !isValidDocumentTitle(cleanedTitle)) {
    cleanedTitle = fallbackClean;
  }

  // 2. Détection matière, type scientifique et niveau
  const { subject, subjectLabel, isScientific, detectedLevel } = detectSubjectAndLevel(cleaned, cleanedTitle);

  // 3. Détection des concepts clés du document
  const stopWords = new Set([
    'cette', 'notre', 'votre', 'leurs', 'comme', 'alors', 'apres', 'avant',
    'aussi', 'entre', 'tous', 'toute', 'toutes', 'selon', 'faire', 'étant',
    'avoir', 'faire', 'quelle', 'quelles', 'quels', 'depuis', 'encore',
    'ainsi', 'chaque', 'aucun', 'aucune', 'autres', 'chose', 'cours', 'titre',
    'type', 'filespec', 'content', 'credentials', 'opensource', 'application',
    'document', 'sujet', 'exercice'
  ]);

  const conceptFreq: Record<string, number> = {};
  for (const w of words) {
    const cleanWord = w.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
    if (cleanWord.length >= 5 && !stopWords.has(cleanWord)) {
      conceptFreq[cleanWord] = (conceptFreq[cleanWord] || 0) + 1;
    }
  }

  let sortedConcepts = Object.entries(conceptFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([concept]) => concept.charAt(0).toUpperCase() + concept.slice(1));

  if (sortedConcepts.length === 0) {
    const titleWords = cleanedTitle.split(/\s+/).filter(w => w.length >= 4 && !stopWords.has(w.toLowerCase()));
    if (titleWords.length > 0) {
      sortedConcepts = titleWords.slice(0, 4);
    } else {
      sortedConcepts = ['Principes fondamentaux', 'Méthode d\'analyse', 'Application pratique'];
    }
  }

  // 4. Découpage en chapitres / chunks
  const chapters = chunkDocument(cleaned, cleanedTitle);

  // 5. Définitions, formules et théorèmes
  const definitions = extractDefinitions(cleaned);
  const formulas = extractFormulas(cleaned);
  const keyRulesOrTheorems = extractRulesAndTheorems(cleaned);
  const historicalEvents = extractHistoricalEvents(cleaned);
  const keyFigures = extractKeyFigures(cleaned);

  // 6. Résumé contextuel
  const summary = sentences.slice(0, 3).join(' ') || (cleaned.length > 10 ? cleaned.slice(0, 250) : `Document portant sur ${cleanedTitle}.`);

  return {
    text: cleaned,
    cleanedTitle,
    wordCount: wordCount > 0 ? wordCount : 150,
    subject,
    subjectLabel,
    isScientific,
    detectedLevel,
    keyConcepts: sortedConcepts,
    summary,
    chapters,
    definitions,
    formulas,
    keyRulesOrTheorems,
    historicalEvents,
    keyFigures,
  };
}

/**
 * Fonction principale d'extraction côté serveur
 */
export async function extractDocumentFromBuffer(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<ExtractedDocumentData> {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  let text = '';

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    text = await extractPdfText(buffer);
  } else if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = extractDocxText(buffer);
  } else {
    // Texte brut par défaut (.txt, .md, .csv, .json, etc.)
    text = buffer.toString('utf-8');
  }

  return analyzeDocumentContent(text, filename);
}
