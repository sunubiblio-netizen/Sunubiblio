'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { formatAudioDuration, generateSyntheticVoiceNoteBlob } from '@/utils/audioUtils';

export interface VoiceRecorderState {
  isRecording: boolean;
  isHolding: boolean;
  isLocked: boolean;
  isPaused: boolean;
  recordingSeconds: number;
  formattedTimer: string;
  dragOffsetX: number; // Déplacement horizontal pour "Faire glisser pour annuler"
  dragOffsetY: number; // Déplacement vertical pour le verrouillage
  liveVolume: number; // Volume sonore en direct (0 à 1) pour les ondes dynamiques
  isNearCancel: boolean; // Si l'utilisateur est sur le point d'annuler
}

export interface VoiceRecorderResult {
  duration: string;
  audioUrl: string;
  blob: Blob;
}

export function useVoiceRecorder(onSendAudio?: (result: VoiceRecorderResult) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [liveVolume, setLiveVolume] = useState(0.5);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isFallbackRef = useRef<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Formattage du timer
  const formattedTimer = useMemo(() => {
    return formatAudioDuration(recordingSeconds);
  }, [recordingSeconds]);

  // Seuil d'annulation par glissement (slide to cancel)
  const isNearCancel = dragOffsetX < -45;

  // Chronomètre
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Nettoyage de l'AudioContext et du stream micro
  const cleanupMedia = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignorer si déjà fermé
      }
      audioContextRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  }, []);

  // Début de l'enregistrement
  const startRecording = useCallback(async () => {
    setIsRecording(true);
    setIsHolding(true);
    setIsLocked(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setDragOffsetX(0);
    setDragOffsetY(0);
    setLiveVolume(0.5);
    audioChunksRef.current = [];
    isFallbackRef.current = false;

    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        audioStreamRef.current = stream;

        // Analyseur de volume pour le waveform en direct
        try {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.6;
            source.connect(analyser);
            analyserRef.current = analyser;

            const updateVolume = () => {
              if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / (dataArray.length * 255);
                setLiveVolume(Math.min(1, Math.max(0.2, avg * 1.8)));
              }
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        } catch {
          // Fallback d'analyse silencieux
        }

        // Configuration du MediaRecorder
        let mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg';
          }

          const recorder = new MediaRecorder(stream, { mimeType });
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.start(100);
        } else {
          isFallbackRef.current = true;
        }
      } else {
        isFallbackRef.current = true;
      }
    } catch {
      // Permission refusée ou micro indisponible : basculer élégamment sur le fallback audio synthétique
      isFallbackRef.current = true;
    }
  }, []);

  // Verrouillage en mode mains libres (Swipe up vers le cadenas)
  const lockRecording = useCallback(() => {
    setIsLocked(true);
    setIsHolding(false);
    setDragOffsetY(0);
    setDragOffsetX(0);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
  }, []);

  // Mettre en pause ou reprendre
  const togglePause = useCallback(() => {
    if (!isRecording) return;

    if (isPaused) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
      setIsPaused(false);
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(true);
    }
  }, [isRecording, isPaused]);

  // Annulation (Glisser vers la gauche ou clic corbeille)
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignorer
      }
    }

    cleanupMedia();
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    setIsRecording(false);
    setIsHolding(false);
    setIsLocked(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setDragOffsetX(0);
    setDragOffsetY(0);
  }, [cleanupMedia]);

  // Arrêter et envoyer l'audio
  const stopAndSend = useCallback(async (): Promise<VoiceRecorderResult | null> => {
    const finalSeconds = Math.max(1, recordingSeconds);
    const durationText = formatAudioDuration(finalSeconds);

    return new Promise((resolve) => {
      const finalize = (blob: Blob) => {
        cleanupMedia();
        const audioUrl = URL.createObjectURL(blob);
        const result: VoiceRecorderResult = {
          duration: durationText,
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

        if (onSendAudio) {
          onSendAudio(result);
        }
        resolve(result);
      };

      if (!isFallbackRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          const mime = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: mime });
          finalize(blob);
        };
        try {
          mediaRecorderRef.current.stop();
        } catch {
          const fallbackBlob = generateSyntheticVoiceNoteBlob(finalSeconds);
          finalize(fallbackBlob);
        }
      } else {
        const fallbackBlob = generateSyntheticVoiceNoteBlob(finalSeconds);
        finalize(fallbackBlob);
      }
    });
  }, [recordingSeconds, cleanupMedia, onSendAudio]);

  // Gestion des événements tactiles (Touch Mobile)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    startRecording();
  }, [startRecording]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touchStartRef.current.y - touch.clientY; // Positif vers le haut

    // Déplacement vers la gauche pour annuler
    if (diffX < 0) {
      setDragOffsetX(Math.max(-120, diffX));
      // Si glissement > 90px vers la gauche : déclencher l'annulation
      if (diffX < -90) {
        cancelRecording();
        touchStartRef.current = null;
        return;
      }
    } else {
      setDragOffsetX(0);
    }

    // Déplacement vers le haut pour verrouiller (Cadenas)
    if (diffY > 0) {
      setDragOffsetY(Math.min(100, diffY));
      if (diffY > 45 && !isLocked) {
        lockRecording();
      }
    } else {
      setDragOffsetY(0);
    }
  }, [isLocked, lockRecording, cancelRecording]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const durationHeld = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;
    setDragOffsetX(0);
    setDragOffsetY(0);

    // Si déjà verrouillé, on ne fait rien (l'utilisateur enregistre les mains libres)
    if (isLocked) {
      setIsHolding(false);
      return;
    }

    // Si c'était un clic très court (< 300ms), on bascule en mode verrouillé pour permettre de parler sans maintenir
    if (durationHeld < 300) {
      lockRecording();
      return;
    }

    // Si maintenu (> 300ms) et relâché sans glisser pour annuler, on envoie directement (Comportement WhatsApp)
    stopAndSend();
  }, [isLocked, lockRecording, stopAndSend]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      cleanupMedia();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [cleanupMedia]);

  return {
    isRecording,
    isHolding,
    isLocked,
    isPaused,
    recordingSeconds,
    formattedTimer,
    dragOffsetX,
    dragOffsetY,
    liveVolume,
    isNearCancel,
    startRecording,
    lockRecording,
    togglePause,
    cancelRecording,
    stopAndSend,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
