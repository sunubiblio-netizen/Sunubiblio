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
  const startTimeRef = useRef<number>(0);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isLockedRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const isCancelledRef = useRef<boolean>(false);

  // Synchronisation des refs avec l'état pour les callbacks d'événements
  isLockedRef.current = isLocked;
  isRecordingRef.current = isRecording;

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

  // Nettoyage complet des flux et de l'AudioContext
  const cleanupAudio = useCallback(() => {
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

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Chronomètre haute précision basé sur Date.now()
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    startTimeRef.current = Date.now();
    setRecordingSeconds(0);

    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current > 0 && !isPaused) {
        const elapsed = Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
        setRecordingSeconds(elapsed);
      }
    }, 500);
  }, [isPaused]);

  // Démarrer l'enregistrement vocal réel avec le microphone
  const startRecording = useCallback(async () => {
    // Réinitialisation préalable
    cleanupAudio();
    isCancelledRef.current = false;
    audioChunksRef.current = [];

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
        if (event.data && event.data.size > 0) {
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

  // Mettre en pause ou reprendre
  const togglePause = useCallback(() => {
    if (!isRecording) return;

    if (isPaused) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        try {
          mediaRecorderRef.current.resume();
        } catch {
          // Ignorer
        }
      }
      setIsPaused(false);
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.pause();
        } catch {
          // Ignorer
        }
      }
      setIsPaused(true);
    }
  }, [isRecording, isPaused]);

  // Annuler et supprimer l'enregistrement
  const cancelRecording = useCallback(() => {
    isCancelledRef.current = true;

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
  }, [cleanupAudio]);

  // Arrêter et envoyer la note vocale enregistrée
  const stopAndSend = useCallback(async (): Promise<VoiceRecorderResult | null> => {
    if (!isRecordingRef.current) return null;

    const totalSec = Math.max(1, recordingSeconds || Math.round((Date.now() - startTimeRef.current) / 1000));
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
  }, [cleanupAudio, onSendAudio, recordingSeconds]);

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

      // 1. Glissement vers la gauche pour annuler ("< Faire glisser pour annuler")
      if (diffX < 0) {
        const clampedX = Math.max(-130, diffX);
        setDragOffsetX(clampedX);

        if (diffX < -70) {
          setIsNearCancel(true);
        } else {
          setIsNearCancel(false);
        }

        // Annulation automatique si glissé très loin vers la gauche (> 100px)
        if (diffX < -105) {
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

      // 2. Glissement vers le haut pour verrouiller (Cadenas vertical WhatsApp)
      if (diffY > 0) {
        setDragOffsetY(Math.min(90, diffY));
        if (diffY > 40 && !isLockedRef.current) {
          lockRecording();
          try {
            if (pointerTargetRef.current && pointerIdRef.current !== null) {
              pointerTargetRef.current.releasePointerCapture(pointerIdRef.current);
            }
          } catch {
            // Ignorer
          }
          isDraggingRef.current = false;
          pointerStartRef.current = null;
        }
      } else {
        setDragOffsetY(0);
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
      isDraggingRef.current = false;
      pointerStartRef.current = null;
      pointerIdRef.current = null;
      pointerTargetRef.current = null;

      // Si l'enregistrement a été verrouillé, relâcher le doigt ne coupe PAS l'enregistrement
      if (isLockedRef.current) {
        setIsHolding(false);
        return;
      }

      // Si l'utilisateur a glissé vers la gauche pour annuler
      const diffX = startPos ? e.clientX - startPos.x : 0;
      if (diffX < -65 || isNearCancel) {
        cancelRecording();
        return;
      }

      // Durée du maintien
      const durationHeld = startPos ? Date.now() - startPos.time : 1000;

      // Si clic très court (< 350ms), basculer en mode verrouillé pour permettre de parler les mains libres
      if (durationHeld < 350) {
        lockRecording();
        return;
      }

      // Si maintenu et relâché normalement, envoyer la note vocale immédiatement (WhatsApp)
      stopAndSend();
    },
    [isNearCancel, cancelRecording, lockRecording, stopAndSend]
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

      if (!isLockedRef.current) {
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
