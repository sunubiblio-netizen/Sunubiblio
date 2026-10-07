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
function extractPdfText(buffer: Buffer): string {
  const textChunks: string[] = [];
  const rawString = buffer.toString('binary');

  // 1. Chercher tous les flux de données stream ... endstream
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamData = Buffer.from(match[1], 'binary');
    let decodedText = '';

    // Essayer de décompresser FlateDecode
    try {
      const decompressed = zlib.inflateSync(streamData);
      decodedText = decompressed.toString('latin1');
    } catch {
      try {
        const decompressedRaw = zlib.inflateRawSync(streamData);
        decodedText = decompressedRaw.toString('latin1');
      } catch {
        // Stream peut être en clair
        decodedText = streamData.toString('latin1');
      }
    }

    if (decodedText) {
      // Chercher les blocs texte BT ... ET
      const btRegex = /BT[\s\S]*?ET/g;
      let btMatch: RegExpExecArray | null;
      while ((btMatch = btRegex.exec(decodedText)) !== null) {
        const block = btMatch[0];

        // 1. Opérateur Tj : (texte) Tj
        const tjRegex = /\(([\s\S]*?)\)\s*Tj/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(block)) !== null) {
          textChunks.push(decodePdfLiteralString(tjMatch[1]));
        }

        // 2. Opérateur TJ : [(texte) 20 (suite)] TJ
        const arrayTjRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let arrMatch: RegExpExecArray | null;
        while ((arrMatch = arrayTjRegex.exec(block)) !== null) {
          const innerTj = arrMatch[1];
          const innerStrings = innerTj.match(/\(([\s\S]*?)\)/g);
          if (innerStrings) {
            const joined = innerStrings
              .map(s => decodePdfLiteralString(s.slice(1, -1)))
              .join('');
            textChunks.push(joined);
          }
        }

        // 3. Opérateur apostrophe ' (nouvelle ligne et texte)
        const apostropheRegex = /\(([\s\S]*?)\)\s*'/g;
        let apMatch: RegExpExecArray | null;
        while ((apMatch = apostropheRegex.exec(block)) !== null) {
          textChunks.push(decodePdfLiteralString(apMatch[1]));
        }
      }
    }
  }

  // Si l'analyse de flux a extrait du texte, on le retourne
  const fullExtracted = textChunks.join(' ').trim();
  if (fullExtracted.length > 30) {
    return cleanExtractedText(fullExtracted);
  }

  // Fallback direct sur les chaînes littérales entre parenthèses dans le document entier
  const literalMatches = rawString.match(/\(([A-Za-z0-9À-ÿ\s,;.?!':\-_/()]{4,})\)/g);
  if (literalMatches && literalMatches.length > 5) {
    const rawJoined = literalMatches
      .map(m => m.slice(1, -1))
      .filter(s => !s.startsWith('/'))
      .join(' ');
    return cleanExtractedText(rawJoined);
  }

  return cleanExtractedText(fullExtracted);
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

function cleanExtractedText(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // caractères de contrôle
    .replace(/\s+/g, ' ') // espaces multiples
    .trim();
}

/**
 * Analyse le texte extrait pour en dégager les points clés, le vrai titre
 * et un résumé pour la génération de questions.
 */
export function analyzeDocumentContent(rawText: string, fallbackFileName: string): ExtractedDocumentData {
  const cleaned = cleanExtractedText(rawText);
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  // 1. Déduction du titre réel à partir du texte (sans nom de fichier)
  let cleanedTitle = '';

  // Chercher une ligne de titre courte et nette dans les premières lignes du document
  const rawLines = rawText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 3);
  for (const line of rawLines.slice(0, 5)) {
    const cleanLine = line.replace(/^[#\-*\d.:\s]+/, '').trim();
    const lower = cleanLine.toLowerCase();
    if (
      cleanLine.length >= 5 && cleanLine.length <= 80 &&
      (lower.startsWith('chapitre') || lower.startsWith('leçon') || lower.startsWith('cours') || lower.startsWith('thème') || !cleanLine.endsWith('.'))
    ) {
      cleanedTitle = cleanLine;
      break;
    }
  }

  // Chercher sinon parmi les phrases nettoyées
  if (!cleanedTitle) {
    for (const s of sentences.slice(0, 5)) {
      const lower = s.toLowerCase();
      if (
        lower.startsWith('chapitre') ||
        lower.startsWith('leçon') ||
        lower.startsWith('module') ||
        lower.startsWith('thème') ||
        lower.startsWith('cours') ||
        (s.length < 60 && !s.includes('.') && s.split(' ').length <= 8)
      ) {
        cleanedTitle = s.replace(/^[#\-*\d.:\s]+/, '').trim();
        break;
      }
    }
  }

  // Si pas de titre évident dans les premières phrases, chercher la première phrase représentative
  if (!cleanedTitle && sentences.length > 0) {
    const first = sentences[0];
    if (first.length <= 70) {
      cleanedTitle = first;
    } else {
      cleanedTitle = first.slice(0, 50).trim() + '...';
    }
  }

  // Si toujours vide, assainir le nom de fichier
  if (!cleanedTitle) {
    cleanedTitle = cleanDocumentName(fallbackFileName);
  }

  // 2. Détection des concepts clés du document
  // Filtrer les mots porteurs de sens (longueur >= 5, pas de mots vides courants)
  const stopWords = new Set([
    'cette', 'notre', 'votre', 'leurs', 'comme', 'alors', 'apres', 'avant',
    'aussi', 'entre', 'tous', 'toute', 'toutes', 'selon', 'faire', 'étant',
    'avoir', 'faire', 'quelle', 'quelles', 'quels', 'depuis', 'encore',
    'ainsi', 'chaque', 'aucun', 'aucune', 'autres', 'chose', 'cours', 'titre'
  ]);

  const conceptFreq: Record<string, number> = {};
  for (const w of words) {
    const cleanWord = w.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
    if (cleanWord.length >= 5 && !stopWords.has(cleanWord)) {
      conceptFreq[cleanWord] = (conceptFreq[cleanWord] || 0) + 1;
    }
  }

  const sortedConcepts = Object.entries(conceptFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([concept]) => concept.charAt(0).toUpperCase() + concept.slice(1));

  // 3. Résumé contextuel
  const summary = sentences.slice(0, 3).join(' ') || cleaned.slice(0, 250);

  return {
    text: cleaned,
    cleanedTitle,
    wordCount,
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
    text = extractPdfText(buffer);
  } else if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = extractDocxText(buffer);
  } else {
    // Texte brut par défaut (.txt, .md, .csv, .json, etc.)
    text = buffer.toString('utf-8');
  }

  return analyzeDocumentContent(text, filename);
}
