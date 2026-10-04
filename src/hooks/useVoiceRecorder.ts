'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { formatAudioDuration, generateSyntheticVoiceNoteBlob } from '@/utils/audioUtils';

export interface VoiceRecorderResult {
  duration: string;
  audioUrl: string;
  blob: Blob;
}

interface UseVoiceRecorderOptions {
  onSendAudio?: (result: VoiceRecorderResult) => void;
  onError?: (message: string) => void;
}

export function useVoiceRecorder({ onSendAudio, onError }: UseVoiceRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isNearCancel, setIsNearCancel] = useState(false);
  const [liveVolume, setLiveVolume] = useState(0.2);

  // Références d'enregistrement audio natif
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');

  // Références de synchronisation temporelle et tactile
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const segmentStartTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isLockedRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const isCancelledRef = useRef<boolean>(false);
  const lockedDuringGestureRef = useRef<boolean>(false);
  const lockedTimestampRef = useRef<number>(0);

  // Synchronisation des refs avec l'état pour les callbacks d'événements
  isLockedRef.current = isLocked;
  isRecordingRef.current = isRecording;
  isPausedRef.current = isPaused;

  // Formatage propre du chronomètre
  const formattedTimer = useMemo(() => {
    return formatAudioDuration(recordingSeconds);
  }, [recordingSeconds]);

  // Détection du format MIME optimal supporté par le navigateur (iOS Safari vs Chrome/Firefox)
  const getOptimalMimeType = (): string | undefined => {
    if (typeof MediaRecorder === 'undefined') return undefined;
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
      'audio/ogg',
    ];
    for (const mime of candidates) {
      if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return undefined;
  };

  // Arrêt immédiat du chronomètre
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Nettoyage complet des flux et de l'AudioContext
  const cleanupAudio = useCallback(() => {
    stopTimer();
    accumulatedTimeRef.current = 0;
    segmentStartTimeRef.current = 0;
    isPausedRef.current = false;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch {
        // Ignorer
      }
      audioContextRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignorer
        }
      });
      audioStreamRef.current = null;
    }
  }, [stopTimer]);

  // Chronomètre haute précision basé sur segments réels accumulés (pause-friendly)
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    timerIntervalRef.current = setInterval(() => {
      if (isPausedRef.current || segmentStartTimeRef.current === 0) return;
      const currentSegmentMs = Date.now() - segmentStartTimeRef.current;
      const totalMs = accumulatedTimeRef.current + currentSegmentMs;
      setRecordingSeconds(Math.max(0, Math.floor(totalMs / 1000)));
    }, 200);
  }, []);

  // Démarrer l'enregistrement vocal réel avec le microphone
  const startRecording = useCallback(async () => {
    // Réinitialisation préalable
    cleanupAudio();
    isCancelledRef.current = false;
    lockedDuringGestureRef.current = false;
    lockedTimestampRef.current = 0;
    audioChunksRef.current = [];
    accumulatedTimeRef.current = 0;
    segmentStartTimeRef.current = Date.now();
    isPausedRef.current = false;

    // Activation immédiate de l'interface visuelle et du compteur
    setIsRecording(true);
    setIsHolding(true);
    setIsLocked(false);
    setIsPaused(false);
    setDragOffsetX(0);
    setDragOffsetY(0);
    setIsNearCancel(false);
    setLiveVolume(0.2);
    startTimer();

    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Le microphone n’est pas supporté par votre navigateur.');
      }

      // Demande d'autorisation et capture réelle du flux micro
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Si l'utilisateur a annulé entre temps pendant l'invite de permission
      if (isCancelledRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      audioStreamRef.current = stream;

      // Initialisation du Web Audio API Analyser pour le waveform dynamique en direct
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }
          audioContextRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.4;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const trackVolume = () => {
            if (!isRecordingRef.current) return;
            if (isPausedRef.current) {
              setLiveVolume(0.15);
              animFrameRef.current = requestAnimationFrame(trackVolume);
              return;
            }
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / (dataArray.length * 255);
            // Normalisation dynamique du volume réel de la voix
            const normalized = Math.min(1, Math.max(0.15, avg * 3.8));
            setLiveVolume(normalized);
            animFrameRef.current = requestAnimationFrame(trackVolume);
          };
          trackVolume();
        }
      } catch (audioCtxErr) {
        console.warn('Web Audio Analyser fallback:', audioCtxErr);
      }

      // Création du MediaRecorder avec format MIME compatible
      const mime = getOptimalMimeType();
      mimeTypeRef.current = mime || 'audio/webm';

      let recorder: MediaRecorder;
      try {
        recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      } catch {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0 && !isPausedRef.current) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(150);
    } catch (err: unknown) {
      console.error('Erreur microphone:', err);
      cleanupAudio();
      setIsRecording(false);
      setIsHolding(false);
      setIsLocked(false);
      setIsPaused(false);
      setRecordingSeconds(0);
      setDragOffsetX(0);
      setDragOffsetY(0);

      const errorMsg =
        err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
          ? 'Autorisation micro refusée. Veuillez autoriser le microphone dans votre navigateur.'
          : 'Impossible d’accéder au microphone de votre appareil.';

      if (onError) {
        onError(errorMsg);
      }
    }
  }, [cleanupAudio, startTimer, onError]);

  // Verrouiller l'enregistrement (mode mains libres WhatsApp)
  const lockRecording = useCallback(() => {
    setIsLocked(true);
    setIsHolding(false);
    isLockedRef.current = true;
    lockedDuringGestureRef.current = true;
    lockedTimestampRef.current = Date.now();
    setDragOffsetY(0);
    setDragOffsetX(0);
    setIsNearCancel(false);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {
        // Ignorer
      }
    }
  }, []);

  // Mettre en pause ou reprendre l'enregistrement vocal
  const togglePause = useCallback(() => {
    if (!isRecordingRef.current) return;

    if (isPausedRef.current) {
      // 1. REPRENDRE
      isPausedRef.current = false;
      setIsPaused(false);

      // Réactiver le flux microphone
      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }

      // Reprendre AudioContext si suspendu
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }

      // Reprendre MediaRecorder si en pause
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        try {
          mediaRecorderRef.current.resume();
        } catch (e) {
          console.warn('Erreur reprise MediaRecorder:', e);
        }
      }

      // Relancer le chronomètre à partir du timestamp actuel
      segmentStartTimeRef.current = Date.now();
      startTimer();
    } else {
      // 2. METTRE EN PAUSE
      isPausedRef.current = true;
      setIsPaused(true);

      // Couper immédiatement le timer pour figer la durée
      stopTimer();

      // Accumuler le temps réellement enregistré avant la pause
      if (segmentStartTimeRef.current > 0) {
        accumulatedTimeRef.current += Date.now() - segmentStartTimeRef.current;
        segmentStartTimeRef.current = 0;
      }
      setRecordingSeconds(Math.max(0, Math.floor(accumulatedTimeRef.current / 1000)));

      // Mettre en pause MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.pause();
        } catch (e) {
          console.warn('Erreur pause MediaRecorder:', e);
        }
      }

      // Désactiver le micro au niveau matériel pour ne capter aucun son pendant la pause
      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      // Suspendre AudioContext et figer les ondes
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend().catch(() => {});
      }
      setLiveVolume(0.15);
    }
  }, [stopTimer, startTimer]);

  // Annuler et supprimer l'enregistrement
  const cancelRecording = useCallback(() => {
    isCancelledRef.current = true;
    isPausedRef.current = false;
    stopTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignorer
      }
    }

    cleanupAudio();
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    setIsRecording(false);
    setIsHolding(false);
    setIsLocked(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setDragOffsetX(0);
    setDragOffsetY(0);
    setIsNearCancel(false);
    setLiveVolume(0.2);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignorer
      }
    }
  }, [cleanupAudio, stopTimer]);

  // Arrêter et envoyer la note vocale enregistrée
  const stopAndSend = useCallback(async (): Promise<VoiceRecorderResult | null> => {
    // Si l'utilisateur vient tout juste de verrouiller (< 450ms), ignorer tout clic accidentel
    if (Date.now() - lockedTimestampRef.current < 450) {
      return null;
    }
    if (!isRecordingRef.current) return null;

    stopTimer();

    // Accumuler le dernier segment actif si on n'était pas en pause
    if (segmentStartTimeRef.current > 0 && !isPausedRef.current) {
      accumulatedTimeRef.current += Date.now() - segmentStartTimeRef.current;
      segmentStartTimeRef.current = 0;
    }

    const totalSec = Math.max(1, Math.round(accumulatedTimeRef.current / 1000) || recordingSeconds);
    const finalDurationText = formatAudioDuration(totalSec);

    return new Promise((resolve) => {
      const finalize = (blob: Blob) => {
        cleanupAudio();
        const audioUrl = URL.createObjectURL(blob);
        const result: VoiceRecorderResult = {
          duration: finalDurationText,
          audioUrl,
          blob,
        };

        setIsRecording(false);
        setIsHolding(false);
        setIsLocked(false);
        setIsPaused(false);
        setRecordingSeconds(0);
        setDragOffsetX(0);
        setDragOffsetY(0);
        setIsNearCancel(false);
        setLiveVolume(0.2);

        if (onSendAudio) {
          onSendAudio(result);
        }
        resolve(result);
      };

      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = () => {
          const finalMime = recorder.mimeType || mimeTypeRef.current || 'audio/webm';
          let blob: Blob;
          if (audioChunksRef.current.length > 0) {
            blob = new Blob(audioChunksRef.current, { type: finalMime });
          } else {
            blob = generateSyntheticVoiceNoteBlob(totalSec);
          }
          finalize(blob);
        };

        try {
          if (recorder.state === 'recording' || recorder.state === 'paused') {
            try {
              recorder.requestData();
            } catch {
              // Ignorer
            }
            recorder.stop();
          }
        } catch {
          const fallbackBlob = generateSyntheticVoiceNoteBlob(totalSec);
          finalize(fallbackBlob);
        }
      } else {
        // Fallback sécurisé si le recorder n'était pas actif
        let blob: Blob;
        if (audioChunksRef.current.length > 0) {
          blob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
        } else {
          blob = generateSyntheticVoiceNoteBlob(totalSec);
        }
        finalize(blob);
      }
    });
  }, [cleanupAudio, onSendAudio, recordingSeconds, stopTimer]);

  // Gestion des événements Pointer (Mobile Touch + Souris Desktop unifiés)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return; // Uniquement clic gauche / contact tactile primaire
      e.preventDefault();

      // Capture de pointeur pour recevoir tous les mouvements même en dehors du bouton
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignorer
      }

      pointerIdRef.current = e.pointerId;
      pointerTargetRef.current = e.currentTarget;
      isDraggingRef.current = true;
      pointerStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };

      startRecording();
    },
    [startRecording]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current || !pointerStartRef.current) return;
      e.preventDefault();

      const diffX = e.clientX - pointerStartRef.current.x;
      const diffY = pointerStartRef.current.y - e.clientY; // Positif vers le haut

      // 1. Détection prioritaire du glissement vertical vers le haut pour VERROUILLER
      if (diffY > 0) {
        // Amorti progressif (légère inertie agréable, monte avec fluidité sans précipitation)
        const progressiveY = Math.pow(diffY, 0.94);
        const clampedY = Math.min(75, Math.max(0, progressiveY));
        setDragOffsetY(clampedY);

        // Seuil d'enclenchement posé au sommet du rail vers le cadenas : 68px
        // L'utilisateur profite pleinement de l'effet de survolage sans déclenchement trop hâtif
        if (clampedY >= 68 && !isLockedRef.current && !lockedDuringGestureRef.current) {
          lockRecording();
          return;
        }
      } else {
        setDragOffsetY(0);
      }

      // Si l'enregistrement a été verrouillé (glissé vers le haut), ne pas traiter l'annulation
      if (isLockedRef.current || lockedDuringGestureRef.current) {
        return;
      }

      // 2. Glissement vers la gauche pour annuler ("< Faire glisser pour annuler")
      if (diffX < 0) {
        const clampedX = Math.max(-130, diffX);
        setDragOffsetX(clampedX);

        if (diffX < -65) {
          setIsNearCancel(true);
        } else {
          setIsNearCancel(false);
        }

        // Annulation automatique si glissé très loin vers la gauche (> 100px)
        if (diffX < -100) {
          try {
            if (pointerTargetRef.current && pointerIdRef.current !== null) {
              pointerTargetRef.current.releasePointerCapture(pointerIdRef.current);
            }
          } catch {
            // Ignorer
          }
          isDraggingRef.current = false;
          pointerStartRef.current = null;
          cancelRecording();
          return;
        }
      } else {
        setDragOffsetX(0);
        setIsNearCancel(false);
      }
    },
    [cancelRecording, lockRecording]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      try {
        if (pointerTargetRef.current && pointerIdRef.current !== null) {
          pointerTargetRef.current.releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // Ignorer
      }

      const startPos = pointerStartRef.current;
      const wasLocked = isLockedRef.current || lockedDuringGestureRef.current;

      isDraggingRef.current = false;
      pointerStartRef.current = null;
      pointerIdRef.current = null;
      pointerTargetRef.current = null;

      // CRITIQUE WHATSAPP : Si l'enregistrement a été verrouillé (glissé vers le haut),
      // relâcher le doigt NE COUPE PAS et N'ENVOIE PAS l'enregistrement !
      // L'utilisateur peut continuer à parler normalement les mains libres !
      if (wasLocked) {
        setIsHolding(false);
        setTimeout(() => {
          lockedDuringGestureRef.current = false;
        }, 400);
        return;
      }

      // Si l'utilisateur a glissé vers la gauche pour annuler
      const diffX = startPos ? e.clientX - startPos.x : 0;
      if (diffX < -60 || isNearCancel) {
        cancelRecording();
        return;
      }

      // Durée du maintien
      const durationHeld = startPos ? Date.now() - startPos.time : 1000;

      // WhatsApp : Si clic ou tapotement court (< 500ms) sans appui long, annuler automatiquement
      if (durationHeld < 500) {
        cancelRecording();
        return;
      }

      // Si vrai appui long maintenu et relâché normalement -> envoyer !
      stopAndSend();
    },
    [isNearCancel, cancelRecording, stopAndSend]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      try {
        if (pointerTargetRef.current && pointerIdRef.current !== null) {
          pointerTargetRef.current.releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // Ignorer
      }
      isDraggingRef.current = false;
      pointerStartRef.current = null;
      pointerIdRef.current = null;
      pointerTargetRef.current = null;

      if (!isLockedRef.current && !lockedDuringGestureRef.current) {
        cancelRecording();
      }
    },
    [cancelRecording]
  );

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isRecording,
    isHolding,
    isLocked,
    isPaused,
    recordingSeconds,
    formattedTimer,
    dragOffsetX,
    dragOffsetY,
    isNearCancel,
    liveVolume,
    startRecording,
    lockRecording,
    togglePause,
    cancelRecording,
    stopAndSend,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}
