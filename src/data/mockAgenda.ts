/**
 * Sunubiblio — Données & Utilitaires Agenda
 *
 * Basé sur les vrais rendez-vous de mockAppointments.ts
 * et les professeurs de mockProfessors.ts.
 * Date de référence : Jeudi 17 Septembre 2026.
 */

import { AgendaItem } from '@/types/agenda';
import { MOCK_APPOINTMENTS } from './mockAppointments';

export const AGENDA_REFERENCE_DATE = '2026-09-17';

// Conversion des rendez-vous existants en items d'agenda enrichis
const APPOINTMENT_ITEMS: AgendaItem[] = MOCK_APPOINTMENTS.map((appt) => {
  let sticker = '📅';
  let badgeLabel = 'Rendez-vous';

  if (appt.mode === 'visio') {
    sticker = '🖥';
  } else if (appt.type === 'formation') {
    sticker = '🎓';
    badgeLabel = 'Formation';
  } else if (appt.type === 'cours') {
    sticker = '📚';
    badgeLabel = 'Cours particulier';
  }

  return {
    id: appt.id,
    type: appt.type,
    title: `${appt.subject} — avec ${appt.professorName.split(' ').slice(-1)[0]}`,
    subject: appt.subject,
    date: appt.date,
    startTime: appt.startTime,
    endTime: appt.endTime,
    durationMinutes: appt.durationMinutes,
    mode: appt.mode,
    status: appt.status,
    professorId: appt.professorId,
    professorName: appt.professorName,
    professorAvatar: appt.professorAvatar,
    professorVerified: appt.professorVerified,
    professorRating: appt.professorRating,
    visioLink: appt.visioLink,
    visioAvailable: appt.visioAvailable,
    location: appt.location,
    description: appt.description,
    notes: appt.notes,
    price: appt.totalPrice,
    currency: appt.currency,
    isPaid: appt.isPaid,
    canReview: appt.canReview,
    canCancel: appt.canCancel,
    canModify: appt.canModify,
    sticker,
    badgeLabel,
  };
});

// Événements complémentaires pour l'emploi du temps et le calendrier
const ACADEMIC_EVENTS: AgendaItem[] = [
  {
    id: 'evt-001',
    type: 'formation',
    title: 'Visio en direct : Didactique FASTEF',
    subject: 'Pédagogie & Concours',
    date: '2026-09-17',
    startTime: '18:00',
    endTime: '19:30',
    durationMinutes: 90,
    mode: 'visio',
    status: 'today',
    visioLink: 'https://visio.sunubiblio.com/fastef-didactique',
    visioAvailable: true,
    description: 'Séance interactive d’analyse de cas et didactique pour le concours FASTEF 2026.',
    sticker: '🖥',
    badgeLabel: 'Séance Visio',
  },
  {
    id: 'evt-002',
    type: 'evenement',
    title: 'Dépôt Dossiers FASTEF 2026',
    subject: 'Concours FASTEF',
    date: '2026-09-19',
    startTime: '09:00',
    endTime: '17:00',
    durationMinutes: 480,
    mode: 'presentiel',
    status: 'upcoming',
    location: 'Direction des Examens et Concours (DEXCO), Dakar',
    description: 'Date limite impérative pour le dépôt physique des dossiers de candidature.',
    sticker: '🔔',
    badgeLabel: 'Échéance Concours',
  },
  {
    id: 'evt-003',
    type: 'cours',
    title: 'Révision collective Bac S2 — Probabilités',
    subject: 'Mathématiques',
    date: '2026-09-15',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    mode: 'visio',
    status: 'completed',
    description: 'Séance de questions/réponses sur les variables aléatoires et lois binomiales.',
    sticker: '📚',
    badgeLabel: 'Révision Groupe',
  },
  {
    id: 'evt-004',
    type: 'examen',
    title: 'Test blanc Algèbre & Matrices',
    subject: 'Mathématiques Supérieur',
    date: '2026-09-16',
    startTime: '15:00',
    endTime: '17:00',
    durationMinutes: 120,
    mode: 'en_ligne',
    status: 'completed',
    description: 'Auto-évaluation chronométrée en conditions réelles d’examen.',
    sticker: '✨',
    badgeLabel: 'Évaluation',
  },
  {
    id: 'evt-005',
    type: 'formation',
    title: 'Atelier Méthodologie Dissertation Bac L',
    subject: 'Français & Philosophie',
    date: '2026-09-24',
    startTime: '16:00',
    endTime: '18:00',
    durationMinutes: 120,
    mode: 'visio',
    status: 'upcoming',
    visioLink: 'https://visio.sunubiblio.com/atelier-dissert',
    visioAvailable: false,
    description: 'Structure de plan dialectique et argumentation philosophique.',
    sticker: '🎓',
    badgeLabel: 'Atelier Méthode',
  },
];

export const INITIAL_AGENDA_ITEMS: AgendaItem[] = [
  ...APPOINTMENT_ITEMS,
  ...ACADEMIC_EVENTS,
];

// Helper : Formater la date en français
export function formatAgendaDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  if (dateStr === AGENDA_REFERENCE_DATE) return "Aujourd'hui";

  const tomorrow = new Date(new Date(AGENDA_REFERENCE_DATE).setDate(new Date(AGENDA_REFERENCE_DATE).getDate() + 1))
    .toISOString()
    .slice(0, 10);
  if (dateStr === tomorrow) return 'Demain';

  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// Helper : Formater la durée
export function formatAgendaDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

// Helper : Obtenir les dates de la semaine courante (du Lundi au Dimanche)
export function getWeekDates(refDate: Date): Date[] {
  const day = refDate.getDay();
  // Lundi = 1, Dimanche = 0 -> diff pour atteindre le Lundi
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

// Helper : Formater YYYY-MM-DD
export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper : Générer la matrice du mois pour le calendrier
export interface CalendarCell {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  items: AgendaItem[];
}

export function getMonthMatrix(year: number, month: number, allItems: AgendaItem[]): CalendarCell[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Jour de la semaine du 1er du mois (0 = Dimanche, 1 = Lundi, etc.)
  const startDay = firstDay.getDay();
  const leadingDays = startDay === 0 ? 6 : startDay - 1;

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - leadingDays);

  const weeks: CalendarCell[][] = [];
  let currentPointer = new Date(startDate);

  // Toujours 5 ou 6 semaines (42 cellules max)
  for (let w = 0; w < 6; w++) {
    const week: CalendarCell[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = toISODate(currentPointer);
      const isCurrentMonth = currentPointer.getMonth() === month;
      const isToday = dateStr === AGENDA_REFERENCE_DATE;
      const items = allItems.filter((it) => it.date === dateStr);

      week.push({
        date: new Date(currentPointer),
        dateStr,
        dayNumber: currentPointer.getDate(),
        isCurrentMonth,
        isToday,
        items,
      });

      currentPointer.setDate(currentPointer.getDate() + 1);
    }
    weeks.push(week);

    // Si on a dépassé la fin du mois et que la semaine est finie, on s'arrête
    if (currentPointer > lastDay && w >= 4) {
      break;
    }
  }

  return weeks;
}
