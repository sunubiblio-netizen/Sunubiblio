/**
 * Sunubiblio — Types Agenda
 *
 * Unifie la gestion des :
 * 1. Rendez-vous pédagogiques (avec professeurs)
 * 2. Cours & Séances d'entraînement
 * 3. Formations & Préparations concours
 * 4. Événements académiques & Examens
 */

import { TeachingMode } from './professor';
import { AppointmentStatus } from './appointment';

export type AgendaViewMode = 'rendez-vous' | 'emploi-du-temps' | 'calendrier';

export type CalendarScale = 'mois' | 'semaine' | 'jour';

export type AgendaItemType =
  | 'cours'       // Cours / Séance
  | 'formation'   // Prépa ou formation
  | 'rdv'         // Rendez-vous
  | 'evenement'   // Événement
  | 'tache'       // Tâche
  | 'rappel'      // Rappel
  | 'visio'       // Séance Visioconférence
  | 'examen';     // Examen blanc ou évaluation

export interface AgendaItem {
  id: string;
  type: AgendaItemType;
  title: string;
  subject: string;
  date: string;               // ISO YYYY-MM-DD (ex: '2026-09-17')
  startTime: string;          // '14:30'
  endTime: string;            // '16:00'
  durationMinutes: number;
  mode: TeachingMode | 'en_ligne';
  status: AppointmentStatus;

  // Intervenant / Professeur (si cours/rdv/formation)
  professorId?: string;
  professorName?: string;
  professorAvatar?: string;
  professorVerified?: boolean;
  professorRating?: number;

  // Modalité & Liens
  visioLink?: string;
  visioAvailable?: boolean;
  location?: string;

  // Descriptif
  description?: string;
  notes?: string;

  // Financier
  price?: number;
  currency?: string;
  isPaid?: boolean;

  // Droits & Permissions (vérifiées côté serveur)
  canReview?: boolean;
  canCancel?: boolean;
  canModify?: boolean;

  // Identité visuelle discrète
  sticker?: string;
  badgeLabel?: string;
}

export interface NewAppointmentFormData {
  type: AgendaItemType;
  professorId: string;
  subject: string;
  mode: TeachingMode;
  date: string;
  startTime: string;
  durationMinutes: number;
  description?: string;
}
