'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChatUser } from '@/types/chat';

interface ChatCallModalProps {
  isOpen: boolean;
  type: 'vocal' | 'video' | 'screen';
  user: ChatUser;
  onClose: () => void;
}

export const ChatCallModal: React.FC<ChatCallModalProps> = ({
  isOpen,
  type,
  user,
  onClose,
}) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="chat-call-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="chat-call-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="chat-call-modal-top">
          <div className="chat-call-avatar-ring">
            <Image
              src={user.avatar}
              alt={user.name}
              width={90}
              height={90}
              className="chat-call-avatar-img"
            />
          </div>

          <h3 className="chat-call-user-name">{user.name}</h3>
          <span className="chat-call-type-label">
            {type === 'video'
              ? 'Appel vidéo en cours'
              : type === 'screen'
              ? 'Partage d’écran pédagogique'
              : 'Appel vocal en cours'}
          </span>
          <span className="chat-call-timer">{formatDuration(duration)}</span>
        </div>

        {/* Commandes d'appel */}
        <div className="chat-call-controls-row">
          <button
            type="button"
            className={`chat-call-control-btn ${isMuted ? 'muted' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Activer le micro' : 'Couper le micro'}
          >
            {isMuted ? '🔇' : '🎙️'}
          </button>

          {type === 'video' && (
            <button
              type="button"
              className={`chat-call-control-btn ${isVideoOff ? 'off' : ''}`}
              onClick={() => setIsVideoOff(!isVideoOff)}
              title={isVideoOff ? 'Activer la caméra' : 'Couper la caméra'}
            >
              {isVideoOff ? '🚫' : '📹'}
            </button>
          )}

          <button
            type="button"
            className="chat-call-control-btn end-call"
            onClick={onClose}
            title="Raccrocher"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
};
