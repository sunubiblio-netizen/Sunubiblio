'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  href: string;
  type: 'contest' | 'exercise' | 'ai' | 'system';
  isUnread: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'FASTEF 2026 : Nouvelle Annale Disponible',
    message: 'L’épreuve de Didactique & Pédagogie 2024 avec correction officielle vient d’être ajoutée.',
    time: 'Il y a 2h',
    href: '/concours/fastef',
    type: 'contest',
    isUnread: true,
  },
  {
    id: 'n2',
    title: 'Rappel d’Entraînement',
    message: 'Votre session de test « Mathématiques Terminale S » peut être reprise à tout moment.',
    time: 'Il y a 5h',
    href: '/exercices',
    type: 'exercise',
    isUnread: true,
  },
  {
    id: 'n3',
    title: 'Tuteur IA Sunubiblio',
    message: 'Le moteur d’explication pas à pas et le vérificateur anti-plagiat ont été mis à jour.',
    time: 'Hier',
    href: '/ia',
    type: 'ai',
    isUnread: false,
  },
];

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  return (
    <div className="notif-popover-wrapper" ref={popoverRef}>
      <button
        type="button"
        className={`header-icon-btn ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Notifications"
        title="Centre de notifications"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="notif-badge-dot" title={`${unreadCount} notification(s) non lue(s)`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown-card" role="dialog" aria-label="Boîte de notifications">
          <div className="notif-card-header">
            <div className="header-title-box">
              <span className="card-heading">Notifications</span>
              {unreadCount > 0 && <span className="unread-counter">{unreadCount} nouvelles</span>}
            </div>
            {unreadCount > 0 && (
              <button type="button" className="mark-read-text-btn" onClick={markAllRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="notif-list-scroll">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.href}
                className={`notif-item-row ${notif.isUnread ? 'is-unread' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`notif-type-icon type-${notif.type}`}>
                  {notif.type === 'contest' && '🏆'}
                  {notif.type === 'exercise' && '📝'}
                  {notif.type === 'ai' && '🤖'}
                  {notif.type === 'system' && '🔔'}
                </div>

                <div className="notif-item-content">
                  <div className="notif-item-title-row">
                    <strong className="notif-title">{notif.title}</strong>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                  <p className="notif-text">{notif.message}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="notif-card-footer">
            <Link href="/profil#notifications" className="view-all-notifs-link" onClick={() => setIsOpen(false)}>
              Voir toutes les activités
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
