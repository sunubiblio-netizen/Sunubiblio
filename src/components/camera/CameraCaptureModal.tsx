'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { CAMERA_FILTERS, CameraFilter } from './cameraFilters';
import './camera.css';

export interface CameraCaptureResult {
  type: 'photo' | 'video';
  dataUrl: string;
  blob?: Blob;
  filterId: string;
  durationSeconds?: number;
}

export interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'photo' | 'video';
  allowModeSwitch?: boolean;
  onCapture: (result: CameraCaptureResult) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'photo',
  allowModeSwitch = true,
  onCapture,
}) => {
  // Verrouille strictement le scroll du body pendant l'utilisation de la caméra
  useLockBodyScroll(isOpen);

  const pathname = usePathname();

  const [mode, setMode] = useState<'photo' | 'video'>(initialMode);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [activeFilter, setActiveFilter] = useState<CameraFilter>(CAMERA_FILTERS[0]);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  // État de la caméra & flux
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Enregistrement vidéo
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Média capturé en attente de validation (Aperçu après capture)
  const [capturedMedia, setCapturedMedia] = useState<{
    type: 'photo' | 'video';
    url: string;
    blob?: Blob;
    duration?: number;
  } | null>(null);

  // Références
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasAnimRef = useRef<number | null>(null);

  // Synchroniser le mode initial lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setCapturedMedia(null);
      setIsRecording(false);
      setRecordingDuration(0);
    }
  }, [isOpen, initialMode]);

  // Arrêter proprement et TOTALEMENT tout flux vidéo et audio
  const stopStream = useCallback(() => {
    // 1. Arrêter toutes les pistes du stream stocké
    if (streamRef.current) {
      try {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          try {
            track.stop();
            track.enabled = false;
          } catch (e) {
            console.warn('Erreur arrêt track:', e);
          }
        });
      } catch (e) {}
      streamRef.current = null;
    }

    // 2. Arrêter toutes les pistes attachées à la balise vidéo
    if (videoRef.current) {
      try {
        if (videoRef.current.srcObject instanceof MediaStream) {
          videoRef.current.srcObject.getTracks().forEach((track) => {
            try {
              track.stop();
              track.enabled = false;
            } catch (e) {}
          });
        }
        videoRef.current.srcObject = null;
      } catch (e) {}
    }

    // 3. Arrêter tout enregistreur actif
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
      mediaRecorderRef.current = null;
    }

    // 4. Nettoyer les boucles d'animation et chronos
    if (canvasAnimRef.current) {
      cancelAnimationFrame(canvasAnimRef.current);
      canvasAnimRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setStreamActive(false);
    setTorchOn(false);
    setHasTorch(false);
    setIsRecording(false);
  }, []);

  // Fermeture sécurisée avec coupure immédiate de la caméra
  const handleSafeClose = useCallback(() => {
    stopStream();
    onClose();
  }, [stopStream, onClose]);

  // Si la route change pendant que la modal est ouverte, couper immédiatement
  useEffect(() => {
    if (isOpen) {
      stopStream();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Écouter les événements de sortie de page / onglet en arrière-plan
  useEffect(() => {
    const handlePageHide = () => {
      stopStream();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stopStream();
      }
    };
    const handlePopState = () => {
      stopStream();
      onClose();
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibility);
      stopStream();
    };
  }, [stopStream, onClose]);

  // Démarrer le flux caméra
  const startCamera = useCallback(async () => {
    stopStream();
    setErrorMsg(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Votre navigateur ne prend pas en charge l'accès à la caméra.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: mode === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setStreamActive(true);

      // Vérifier si le flash/torche est supporté
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as any;
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn('Erreur accès caméra:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg("L'autorisation d'accès à la caméra a été refusée. Veuillez autoriser la caméra dans les paramètres de votre navigateur.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('Aucun appareil caméra détecté sur cet appareil.');
      } else {
        setErrorMsg("Impossible d'initialiser la caméra. Vérifiez les autorisations de votre appareil.");
      }
    }
  }, [facingMode, mode, stopStream]);

  // Déclencher le démarrage dès l'ouverture et si pas de média capturé
  useEffect(() => {
    if (isOpen && !capturedMedia) {
      startCamera();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, capturedMedia, startCamera, stopStream]);

  // Bascule Flash / Torche
  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const nextState = !torchOn;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      } catch (e) {
        console.warn('Impossible de basculer la torche:', e);
      }
    }
  };

  // Bascule avant / arrière
  const switchFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // --------------------------------------------------------------------------
  // CAPTURE PHOTO AVEC APPLICATION DU FILTRE EN TEMPS RÉEL
  // --------------------------------------------------------------------------
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Appliquer le filtre en temps réel sélectionné
    if (activeFilter.cssFilter && activeFilter.cssFilter !== 'none') {
      ctx.filter = activeFilter.cssFilter;
    }

    // Effet miroir pour la caméra avant (selfie)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // Convertir en Blob pour une utilisation polyvalente
    canvas.toBlob(
      (blob) => {
        setCapturedMedia({
          type: 'photo',
          url: dataUrl,
          blob: blob || undefined,
        });
        // Arrêter immédiatement la caméra pendant l'aperçu
        stopStream();
      },
      'image/jpeg',
      0.92
    );
  };

  // --------------------------------------------------------------------------
  // ENREGISTREMENT VIDÉO AVEC FILTRE EN DIRECT
  // --------------------------------------------------------------------------
  const startVideoRecording = () => {
    if (!videoRef.current || !streamRef.current) return;

    try {
      recordedChunksRef.current = [];
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      // Création d'un Canvas animé pour incruster le filtre dans la vidéo
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      let recordStream: MediaStream = streamRef.current;

      if (ctx && typeof (canvas as any).captureStream === 'function') {
        const drawLoop = () => {
          if (!video.paused && !video.ended) {
            if (activeFilter.cssFilter && activeFilter.cssFilter !== 'none') {
              ctx.filter = activeFilter.cssFilter;
            }
            if (facingMode === 'user') {
              ctx.save();
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, 0, width, height);
              ctx.restore();
            } else {
              ctx.drawImage(video, 0, 0, width, height);
            }
          }
          canvasAnimRef.current = requestAnimationFrame(drawLoop);
        };
        drawLoop();

        const canvasStream = (canvas as any).captureStream(30) as MediaStream;
        // Ajouter la piste audio du microphone
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
          canvasStream.addTrack(audioTrack);
        }
        recordStream = canvasStream;
      }

      // Types MIME pris en charge
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(recordStream, selectedMime ? { mimeType: selectedMime } : {});

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (canvasAnimRef.current) {
          cancelAnimationFrame(canvasAnimRef.current);
          canvasAnimRef.current = null;
        }

        const mime = selectedMime || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        const videoUrl = URL.createObjectURL(blob);

        setCapturedMedia({
          type: 'video',
          url: videoUrl,
          blob,
          duration: recordingDuration,
        });
        // Arrêter immédiatement la caméra
        stopStream();
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      // Timer d'enregistrement
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          // Limite max automatique à 60 secondes
          if (prev >= 59) {
            stopVideoRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e) {
      console.error("Erreur lors de l'enregistrement vidéo:", e);
      setErrorMsg("Impossible de démarrer l'enregistrement vidéo sur cet appareil.");
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Formatage du timer mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Action bouton de capture principal
  const handleMainTrigger = () => {
    if (mode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS APRÈS CAPTURE (REPRENDRE / UTILISER)
  // --------------------------------------------------------------------------
  const handleRetake = () => {
    setCapturedMedia(null);
    setRecordingDuration(0);
    setIsRecording(false);
    // startCamera sera automatiquement redéclenché par le useEffect([isOpen, capturedMedia])
  };

  const handleUseMedia = () => {
    if (!capturedMedia) return;

    // Arrêter complètement le flux avant de transmettre
    stopStream();

    onCapture({
      type: capturedMedia.type,
      dataUrl: capturedMedia.url,
      blob: capturedMedia.blob,
      filterId: activeFilter.id,
      durationSeconds: capturedMedia.duration,
    });

    onClose();
  };

  // Fallback fichier si la caméra n'est pas disponible
  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string;
        stopStream();
        onCapture({
          type: 'photo',
          dataUrl,
          blob: file,
          filterId: 'original',
        });
        onClose();
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      stopStream();
      onCapture({
        type: 'video',
        dataUrl: url,
        blob: file,
        filterId: 'original',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="sunu-camera-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* 1. Zone Vidéo Live */}
      {!capturedMedia && (
        <div className="sunu-camera-stage" onClick={(e) => e.stopPropagation()}>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`sunu-camera-video ${facingMode === 'user' ? 'mirrored' : ''}`}
            style={{ filter: activeFilter.cssFilter }}
          />
        </div>
      )}

      {/* 2. Barre Supérieure des Contrôles */}
      {!capturedMedia && (
        <div className="sunu-camera-top-bar" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="sunu-camera-btn-icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSafeClose();
            }}
            aria-label="Fermer la caméra"
            title="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Indicateur de mode / Timer d'enregistrement */}
          {mode === 'video' && isRecording ? (
            <div className="sunu-camera-recording-pill">
              <span className="sunu-camera-rec-dot" />
              <span>{formatTimer(recordingDuration)}</span>
            </div>
          ) : (
            <div className="sunu-camera-mode-switcher" onClick={(e) => e.stopPropagation()}>
              {allowModeSwitch ? (
                <>
                  <button
                    type="button"
                    className={`sunu-camera-mode-btn ${mode === 'photo' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isRecording) setMode('photo');
                    }}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    className={`sunu-camera-mode-btn ${mode === 'video' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMode('video');
                    }}
                  >
                    Vidéo
                  </button>
                </>
              ) : (
                <span className="sunu-camera-mode-btn active">
                  {mode === 'photo' ? 'Mode Photo' : 'Mode Vidéo'}
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
            {/* Flash / Torche si supporté */}
            {hasTorch && (
              <button
                type="button"
                className={`sunu-camera-btn-icon ${torchOn ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleTorch();
                }}
                title={torchOn ? 'Éteindre la torche' : 'Allumer la torche'}
                aria-label="Torche"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </button>
            )}

            {/* Bascule Caméra Avant / Arrière */}
            <button
              type="button"
              className="sunu-camera-btn-icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                switchFacingMode();
              }}
              title="Changer de caméra"
              aria-label="Changer de caméra"
              disabled={isRecording}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.21 0.895 4.21 2.343 5.657L4 18h6v-6l-2.343 2.343C6.627 13.314 6 11.734 6 10c0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.734-0.627 3.314-1.657 4.343L14 12v6h6l-2.343-2.343C19.105 14.21 20 12.21 20 10z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 3. Message d'erreur / Permissions avec fallback */}
      {errorMsg && !capturedMedia && (
        <div className="sunu-camera-fallback-box" onClick={(e) => e.stopPropagation()}>
          <div className="sunu-camera-fallback-icon">📷</div>
          <h3 className="sunu-camera-fallback-title">Accès Caméra</h3>
          <p className="sunu-camera-fallback-desc">{errorMsg}</p>
          <div className="sunu-camera-fallback-actions">
            <button
              type="button"
              className="sunu-camera-btn-retry"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startCamera();
              }}
            >
              Réessayer
            </button>
            <label className="sunu-camera-btn-file-alt" onClick={(e) => e.stopPropagation()}>
              <span>Importer depuis l’appareil</span>
              <input
                type="file"
                accept={mode === 'photo' ? 'image/*' : 'video/*'}
                style={{ display: 'none' }}
                onChange={handleFallbackFile}
              />
            </label>
          </div>
        </div>
      )}

      {/* 4. Barre Inférieure (Filtres en direct & Déclencheur) */}
      {!capturedMedia && (
        <div className="sunu-camera-bottom-bar" onClick={(e) => e.stopPropagation()}>
          {/* Rangée des Filtres en Temps Réel */}
          <div
            className="sunu-camera-filters-track"
            role="radiogroup"
            aria-label="Filtres en direct"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {CAMERA_FILTERS.map((f) => {
              const isSelected = activeFilter.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`sunu-filter-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveFilter(f);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                  }}
                  title={`Filtre ${f.name}`}
                >
                  <div className="sunu-filter-swatch-circle" style={{ background: f.previewBg }}>
                    <span className="sunu-filter-icon">{f.icon}</span>
                    {f.badge && <span className="sunu-filter-badge">{f.badge}</span>}
                  </div>
                  <span className="sunu-filter-name">{f.name}</span>
                </button>
              );
            })}
          </div>

          {/* Déclencheur Principal */}
          <div className="sunu-camera-trigger-row" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`sunu-camera-shutter-btn ${mode === 'video' ? 'video-mode' : ''} ${isRecording ? 'is-recording' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMainTrigger();
              }}
              aria-label={
                mode === 'photo'
                  ? 'Prendre une photo'
                  : isRecording
                  ? 'Arrêter la vidéo'
                  : 'Enregistrer une vidéo'
              }
            >
              <div className="sunu-shutter-inner-circle" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Écran d'Aperçu après Capture (« Reprendre » et « Utiliser ») */}
      {capturedMedia && (
        <div className="sunu-camera-preview-stage" onClick={(e) => e.stopPropagation()}>
          {capturedMedia.type === 'photo' ? (
            <img
              src={capturedMedia.url}
              alt="Photo capturée"
              className="sunu-camera-preview-media"
            />
          ) : (
            <video
              src={capturedMedia.url}
              controls
              autoPlay
              playsInline
              loop
              className="sunu-camera-preview-media"
            />
          )}

          <div className="sunu-camera-review-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="sunu-camera-btn-retake"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRetake();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 2v6h6" />
                <path d="M21.5 22v-6h-6" />
                <path d="M22 11.5A10 10 0 0 0 3.2 7.2L2.5 8" />
                <path d="M2 12.5a10 10 0 0 0 18.8 4.2l.7.8" />
              </svg>
              <span>Reprendre</span>
            </button>

            <button
              type="button"
              className="sunu-camera-btn-use"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUseMedia();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Utiliser cette {capturedMedia.type === 'photo' ? 'photo' : 'vidéo'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
