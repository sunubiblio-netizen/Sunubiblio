'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { parseDurationToSeconds, generateSyntheticVoiceNoteBlob } from '@/utils/audioUtils';

export function useAudioPlayer() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearInterval(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const togglePlayAudio = useCallback(
    (id: string, url?: string, durationStr?: string) => {
      const parsedDuration = parseDurationToSeconds(durationStr || '0:15');

      // Si c'est déjà l'audio en cours de lecture
      if (activeAudioId === id) {
        if (isPlaying) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          if (fallbackTimeoutRef.current) {
            clearInterval(fallbackTimeoutRef.current);
            fallbackTimeoutRef.current = null;
          }
          setIsPlaying(false);
        } else {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              // Si erreur de lecture, reprise silencieuse
            });
          }
          setIsPlaying(true);
        }
        return;
      }

      // Arrêt de l'audio précédent
      stopAudio();

      setActiveAudioId(id);
      setDuration(parsedDuration);
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(true);

      // Résolution de l'URL audio (URL réelle ou Blob synthétique si url === '#' ou absent)
      let resolvedUrl = url;
      if (!resolvedUrl || resolvedUrl === '#' || resolvedUrl.startsWith('/')) {
        const syntheticBlob = generateSyntheticVoiceNoteBlob(parsedDuration);
        resolvedUrl = URL.createObjectURL(syntheticBlob);
      }

      const audio = new Audio(resolvedUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
          setDuration(Math.floor(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          const cur = audio.currentTime;
          const dur = audio.duration;
          setCurrentTime(Math.floor(cur));
          setProgress(Math.min(100, (cur / dur) * 100));
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setActiveAudioId(null);
      };

      audio.onerror = () => {
        // En cas d'erreur de chargement de l'élément audio natif, simuler l'animation de lecture
        let cur = 0;
        const total = parsedDuration;
        fallbackTimeoutRef.current = setInterval(() => {
          cur += 1;
          setCurrentTime(cur);
          setProgress(Math.min(100, (cur / total) * 100));
          if (cur >= total) {
            if (fallbackTimeoutRef.current) clearInterval(fallbackTimeoutRef.current);
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            setActiveAudioId(null);
          }
        }, 1000);
      };

      audio.play().catch(() => {
        // En cas de blocage d'autoplay par le navigateur, le joueur reste actif
      });
    },
    [activeAudioId, isPlaying, stopAudio]
  );

  const seekAudio = useCallback(
    (targetPercentage: number) => {
      if (!audioRef.current || !duration) return;
      const targetTime = (targetPercentage / 100) * duration;
      audioRef.current.currentTime = targetTime;
      setCurrentTime(Math.floor(targetTime));
      setProgress(targetPercentage);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    activeAudioId,
    isPlaying,
    progress,
    currentTime,
    duration,
    togglePlayAudio,
    seekAudio,
    stopAudio,
  };
}
