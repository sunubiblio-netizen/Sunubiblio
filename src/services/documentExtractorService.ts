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

export interface ExtractedDocumentData {
  text: string;
  cleanedTitle: string;
  wordCount: number;
  keyConcepts: string[];
  summary: string;
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
 * Analyse le texte extrait pour en dégager les points clés, le vrai titre
 * et un résumé pour la génération de questions.
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

  // 2. Détection des concepts clés du document
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
    // Si aucun mot fréquent détecté, générer des concepts pédagogiques élégants basés sur le titre
    const titleWords = cleanedTitle.split(/\s+/).filter(w => w.length >= 4 && !stopWords.has(w.toLowerCase()));
    if (titleWords.length > 0) {
      sortedConcepts = titleWords.slice(0, 4);
    } else {
      sortedConcepts = ['Principes fondamentaux', 'Méthode d\'analyse', 'Application pratique'];
    }
  }

  // 3. Résumé contextuel
  const summary = sentences.slice(0, 3).join(' ') || (cleaned.length > 10 ? cleaned.slice(0, 250) : `Document portant sur ${cleanedTitle}.`);

  return {
    text: cleaned,
    cleanedTitle,
    wordCount: wordCount > 0 ? wordCount : 150,
    keyConcepts: sortedConcepts,
    summary,
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
