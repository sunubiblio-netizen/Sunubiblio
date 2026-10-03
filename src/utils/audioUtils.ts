/**
 * Utilitaires Audio pour la messagerie et les notes vocales Sunubiblio
 */

/**
 * Formate un nombre de secondes en mm:ss (ex: 65 -> "1:05")
 */
export function formatAudioDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convertit une chaîne de durée "mm:ss" en secondes
 */
export function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 15;
  const parts = durationStr.split(':').map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  const parsed = parseInt(durationStr, 10);
  return isNaN(parsed) ? 15 : parsed;
}

/**
 * Génère un Blob audio WAV synthétique harmonieux et réaliste
 * Utile comme fallback infaillible si le micro n'est pas autorisé
 * ou pour les messages vocaux de démonstration.
 */
export function generateSyntheticVoiceNoteBlob(durationSec = 3): Blob {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * Math.max(1, durationSec));
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // Écriture du header WAV
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // PCM = 1
  view.setUint16(22, 1, true); // Mono = 1
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Modulation sonore douce imitant une intonation vocale chaleureuse
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Fréquence fondamentale vocale ~220Hz avec harmoniques et enveloppe naturelle
    const envelope = Math.sin((Math.PI * i) / numSamples); // Enveloppe douce début/fin
    const cadence = 0.5 + 0.5 * Math.sin(2 * Math.PI * 3.5 * t); // Rythme syllabique
    const f1 = Math.sin(2 * Math.PI * 240 * t);
    const f2 = 0.4 * Math.sin(2 * Math.PI * 480 * t);
    const f3 = 0.2 * Math.sin(2 * Math.PI * 720 * t);
    const sample = (f1 + f2 + f3) * envelope * cadence * 0.35;

    // Normalisation en entier 16-bit signé
    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
