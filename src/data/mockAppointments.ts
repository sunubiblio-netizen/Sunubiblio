/**
 * Sunubiblio — Données Mock Rendez-vous
 *
 * Basées sur les vrais professeurs de mockProfessors.ts.
 * Toutes les données sont cohérentes avec l'écosystème Sunubiblio.
 *
 * NOTE: En production, ces données viennent de l'API serveur
 * après vérification de l'identité + autorisation de l'utilisateur.
 */

import { Appointment, AppointmentFilterState, AppointmentStats } from '@/types/appointment';

// Référence temporelle simulée = 17 septembre 2026
const TODAY = '2026-09-17';
const TODAY_DATE = new Date('2026-09-17T00:00:00');

export const MOCK_APPOINTMENTS: Appointment[] = [
  // ─── AUJOURD'HUI ───────────────────────────────────────────────────────────
  {
    id: 'rdv-001',
    studentId: 'user-student-demo',
    professorId: 'prof-1',
    professorName: 'Dr. Cheikh Anta Diop Fall',
    professorAvatar: '/images/professors/cheikh-fall.jpg',
    professorVerified: true,
    professorRating: 4.95,
    subject: 'Mathématiques',
    type: 'cours',
    mode: 'visio',
    date: TODAY,
    startTime: '14:30',
    endTime: '16:00',
    durationMinutes: 90,
    status: 'today',
    pricePerHour: 8000,
    totalPrice: 12000,
    currency: 'FCFA',
    isPaid: true,
    visioLink: 'https://visio.sunubiblio.com/rdv-001-secure',
    visioAvailable: true,
    description: 'Révision des fonctions dérivées et intégrales — Terminale S2',
    notes: 'Préparer les exercices du chapitre 4 du manuel.',
    bookedAt: '2026-09-12T10:30:00',
    canModify: false,
    canCancel: false,
    hasReview: false,
    canReview: false,
  },

  // ─── À VENIR (DEMAIN) ──────────────────────────────────────────────────────
  {
    id: 'rdv-002',
    studentId: 'user-student-demo',
    professorId: 'prof-2',
    professorName: 'Mme Aminata Sow Ndiaye',
    professorAvatar: '/images/professors/aminata-ndiaye.jpg',
    professorVerified: true,
    professorRating: 4.88,
    subject: 'Physique-Chimie',
    type: 'cours',
    mode: 'visio',
    date: '2026-09-18',
    startTime: '17:00',
    endTime: '19:00',
    durationMinutes: 120,
    status: 'upcoming',
    pricePerHour: 6000,
    totalPrice: 12000,
    currency: 'FCFA',
    isPaid: true,
    visioAvailable: false,
    description: 'Mécanique des fluides et électrocinétique — Terminale S1',
    bookedAt: '2026-09-14T09:00:00',
    canModify: true,
    canCancel: true,
    hasReview: false,
    canReview: false,
  },

  // ─── À VENIR (CETTE SEMAINE) ───────────────────────────────────────────────
  {
    id: 'rdv-003',
    studentId: 'user-student-demo',
    professorId: 'prof-3',
    professorName: 'M. Mamadou Lamine Sarr',
    professorAvatar: '/images/professors/mamadou-sarr.jpg',
    professorVerified: true,
    professorRating: 4.92,
    subject: 'Philosophie',
    type: 'cours',
    mode: 'presentiel',
    date: '2026-09-20',
    startTime: '10:00',
    endTime: '11:30',
    durationMinutes: 90,
    status: 'upcoming',
    pricePerHour: 5000,
    totalPrice: 7500,
    currency: 'FCFA',
    isPaid: false,
    location: 'Centre Culturel Blaise Senghor, Dakar — Salle 12',
    description: 'Dissertation philosophique — Méthode et plan pour le Bac L',
    bookedAt: '2026-09-15T14:00:00',
    canModify: true,
    canCancel: true,
    hasReview: false,
    canReview: false,
  },

  // ─── EN ATTENTE ────────────────────────────────────────────────────────────
  {
    id: 'rdv-004',
    studentId: 'user-student-demo',
    professorId: 'prof-4',
    professorName: 'Dr. Ibrahima Diallo',
    professorAvatar: '/images/professors/ibrahima-diallo.jpg',
    professorVerified: true,
    professorRating: 4.78,
    subject: 'Prépa Concours FASTEF / ENA',
    type: 'formation',
    mode: 'visio',
    date: '2026-09-22',
    startTime: '09:00',
    endTime: '11:00',
    durationMinutes: 120,
    status: 'pending',
    pricePerHour: 10000,
    totalPrice: 20000,
    currency: 'FCFA',
    isPaid: false,
    description: 'Préparation intensive aux épreuves écrites du concours FASTEF — Module 1',
    bookedAt: '2026-09-16T16:00:00',
    canModify: true,
    canCancel: true,
    hasReview: false,
    canReview: false,
  },

  // ─── TERMINÉS ──────────────────────────────────────────────────────────────
  {
    id: 'rdv-005',
    studentId: 'user-student-demo',
    professorId: 'prof-1',
    professorName: 'Dr. Cheikh Anta Diop Fall',
    professorAvatar: '/images/professors/cheikh-fall.jpg',
    professorVerified: true,
    professorRating: 4.95,
    subject: 'Mathématiques',
    type: 'cours',
    mode: 'visio',
    date: '2026-09-10',
    startTime: '15:00',
    endTime: '16:30',
    durationMinutes: 90,
    status: 'completed',
    pricePerHour: 8000,
    totalPrice: 12000,
    currency: 'FCFA',
    isPaid: true,
    description: 'Suites numériques — Convergence et limites',
    bookedAt: '2026-09-07T11:00:00',
    hasReview: true,
    canReview: false,
    canModify: false,
    canCancel: false,
  },
  {
    id: 'rdv-006',
    studentId: 'user-student-demo',
    professorId: 'prof-2',
    professorName: 'Mme Aminata Sow Ndiaye',
    professorAvatar: '/images/professors/aminata-ndiaye.jpg',
    professorVerified: true,
    professorRating: 4.88,
    subject: 'Physique-Chimie',
    type: 'cours',
    mode: 'domicile',
    date: '2026-09-08',
    startTime: '16:00',
    endTime: '18:00',
    durationMinutes: 120,
    status: 'completed',
    pricePerHour: 6000,
    totalPrice: 12000,
    currency: 'FCFA',
    isPaid: true,
    location: 'Domicile étudiant — Mermoz, Dakar',
    description: 'Thermodynamique — 1er et 2nd principes',
    bookedAt: '2026-09-04T09:00:00',
    hasReview: false,
    canReview: true,
    canModify: false,
    canCancel: false,
  },

  // ─── ANNULÉ ────────────────────────────────────────────────────────────────
  {
    id: 'rdv-007',
    studentId: 'user-student-demo',
    professorId: 'prof-5',
    professorName: 'M. Ousmane Ba',
    professorAvatar: undefined,
    professorVerified: false,
    professorRating: 4.65,
    subject: 'Histoire-Géographie',
    type: 'cours',
    mode: 'presentiel',
    date: '2026-09-13',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    status: 'cancelled',
    pricePerHour: 4500,
    totalPrice: 9000,
    currency: 'FCFA',
    isPaid: false,
    description: 'Géopolitique africaine contemporaine — Lycée',
    bookedAt: '2026-09-10T14:30:00',
    updatedAt: '2026-09-12T09:00:00',
    hasReview: false,
    canReview: false,
    canModify: false,
    canCancel: false,
  },
];

/** Calcul des statistiques réelles à partir des données */
export function computeAppointmentStats(appointments: Appointment[]): AppointmentStats {
  const today = new Date(TODAY).toDateString();

  const upcoming = appointments.filter(
    (a) => a.status === 'upcoming'
  ).length;

  const todayCount = appointments.filter(
    (a) => a.status === 'today' || (a.date === TODAY && a.status === 'upcoming')
  ).length;

  const completed = appointments.filter((a) => a.status === 'completed').length;
  const pending = appointments.filter((a) => a.status === 'pending').length;

  const totalSpent = appointments
    .filter((a) => a.isPaid && a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.totalPrice, 0);

  return { upcoming, today: todayCount, completed, pending, totalSpent };
}

/** Filtrage client-side (simulé) */
export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilterState
): Appointment[] {
  const today = new Date(TODAY);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return appointments.filter((a) => {
    // Recherche textuelle
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        a.professorName.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    // Statut
    if (filters.status !== 'all' && a.status !== filters.status) return false;

    // Mode
    if (filters.mode !== 'all' && a.mode !== filters.mode) return false;

    // Type
    if (filters.type !== 'all' && a.type !== filters.type) return false;

    // Période
    if (filters.period !== 'all') {
      const aDate = new Date(a.date);
      if (filters.period === 'today') {
        if (a.date !== TODAY) return false;
      } else if (filters.period === 'this_week') {
        if (aDate < startOfWeek || aDate > endOfWeek) return false;
      } else if (filters.period === 'this_month') {
        if (aDate < startOfMonth || aDate > endOfMonth) return false;
      }
    }

    return true;
  });
}

/** Formater la date en français */
export function formatAppointmentDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const todayStr = TODAY;
  const tomorrowStr = new Date(new Date(TODAY).setDate(new Date(TODAY).getDate() + 1))
    .toISOString()
    .slice(0, 10);

  if (dateStr === todayStr) return "Aujourd'hui";
  if (dateStr === tomorrowStr) return 'Demain';

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return d.toLocaleDateString('fr-FR', options);
}

/** Temps restant avant le RDV (si <= 24h) */
export function getTimeUntil(dateStr: string, startTime: string): string | null {
  const rdvDate = new Date(`${dateStr}T${startTime}:00`);
  const now = new Date(`${TODAY}T12:00:00`); // Référence simulée
  const diffMs = rdvDate.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffMs <= 0) return null;
  if (diffH === 0) return `Dans ${diffM} min`;
  if (diffH < 24) return `Dans ${diffH}h${diffM > 0 ? diffM : ''}`;
  return null;
}
