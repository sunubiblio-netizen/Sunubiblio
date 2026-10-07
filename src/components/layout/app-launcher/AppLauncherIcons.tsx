import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// ============================================================================
// 1. APPRENDRE
// ============================================================================

/** Bibliothèque : Livre ouvert aux pages courbées en arche de pétale Sunubiblio */
export const IconBibliotheque: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-book-l" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="sb-book-r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="sb-book-spine" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    {/* Page gauche en pétale */}
    <path d="M18 10C14 6.5 7 7 4 8.5C3.4 8.8 3 9.4 3 10.1V24.5C3 25.5 4 26.2 5 25.8C8 24.6 13.5 24.5 17 27.5C17.6 28 18 27.7 18 27V10Z" fill="url(#sb-book-l)" />
    {/* Page droite en pétale */}
    <path d="M18 10C22 6.5 29 7 32 8.5C32.6 8.8 33 9.4 33 10.1V24.5C33 25.5 32 26.2 31 25.8C28 24.6 22.5 24.5 19 27.5C18.4 28 18 27.7 18 27V10Z" fill="url(#sb-book-r)" />
    {/* Reliure / Marque-page floral */}
    <path d="M16.8 6C16.8 5 19.2 5 19.2 6V15C19.2 15.6 18 17 18 17C18 17 16.8 15.6 16.8 15V6Z" fill="url(#sb-book-spine)" />
    {/* Lignes de savoir discrètes */}
    <path d="M7 14C9.5 13.3 12.5 13.5 14.5 15M7 18C9.5 17.3 12.5 17.5 14.5 19" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
    <path d="M21.5 15C23.5 13.5 26.5 13.3 29 14M21.5 19C23.5 17.5 26.5 17.3 29 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
  </svg>
);

/** Éducation : Toque universitaire avec pompon aux nuances rose/violet */
export const IconEducation: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-edu-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="sb-edu-t" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <path d="M18 6L33 13L18 20L3 13L18 6Z" fill="url(#sb-edu-c)" />
    <path d="M9 16.2V22.5C9 26 13 29 18 29C23 29 27 26 27 22.5V16.2L18 20.4L9 16.2Z" fill="#312E81" />
    <path d="M30 14.5V23.5C30 24.5 28.5 25.5 28.5 27.5C28.5 29 29.5 30 30 30C30.5 30 31.5 29 31.5 27.5C31.5 25.5 30 24.5 30 23.5" stroke="url(#sb-edu-t)" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="13" r="2" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/** Concours : Trophée d'excellence épuré aux courbes fines */
export const IconConcours: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-tr-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <path d="M10 7C8.5 7 8 8 8 9.5C8 16 13 21 18 21C23 21 28 16 28 9.5C28 8 27.5 7 26 7H10Z" fill="url(#sb-tr-g)" />
    <path d="M8 10H5C3.9 10 3 10.9 3 12C3 15 5.5 17 8 17.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 10H31C32.1 10 33 10.9 33 12C33 15 30.5 17 28 17.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 10.5L19 12.8L21.5 13L19.5 14.7L20.2 17L18 15.6L15.8 17L16.5 14.7L14.5 13L17 12.8L18 10.5Z" fill="#FFFFFF" fillOpacity="0.95" />
    <path d="M16 21H20V26H16V21Z" fill="#4F46E5" />
    <rect x="11" y="26" width="14" height="4" rx="2" fill="#3B82F6" />
  </svg>
);

/** Exercices : Feuille d'évaluation avec validation dynamique */
export const IconExercices: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-ex-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-ex-ck" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M8 6C8 4.9 8.9 4 10 4H22L28 10V30C28 31.1 27.1 32 26 32H10C8.9 32 8 31.1 8 30V6Z" fill="url(#sb-ex-bg)" />
    <path d="M22 4V9C22 9.6 22.4 10 23 10H28" fill="#93C5FD" fillOpacity="0.5" />
    <rect x="12" y="13" width="7" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="12" y="18" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M15 24L20 28L31 16" stroke="url(#sb-ex-ck)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// 2. SAVOIRS & FORMATIONS
// ============================================================================

/** Cours : Écran pédagogique interactif avec trajectoire d'apprentissage */
export const IconCours: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-crs-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="26" height="18" rx="4" fill="url(#sb-crs-bg)" />
    <path d="M9 19L14 14L19 17L27 11" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="27" cy="11" r="2" fill="#FFFFFF" />
    <path d="M18 25V30M12 30H24" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Ressources : Couches d'archives de savoirs académiques */
export const IconRessources: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-res-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-res-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M18 5L31 11L18 17L5 11L18 5Z" fill="url(#sb-res-a)" />
    <path d="M5 16L18 22L31 16" stroke="url(#sb-res-b)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 22L18 28L31 22" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Documents : Document numérique avec pli souple et lignes d'écriture */
export const IconDocuments: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-doc-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <path d="M7 6C7 4.9 7.9 4 9 4H20L29 13V30C29 31.1 28.1 32 27 32H9C7.9 32 7 31.1 7 30V6Z" fill="url(#sb-doc-g)" />
    <path d="M20 4V11C20 12.1 20.9 13 22 13H29" fill="#93C5FD" fillOpacity="0.4" />
    <rect x="11" y="16" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="11" y="21" width="11" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
    <rect x="11" y="26" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

/** Religion : Symbole abstrait de spiritualité, neutre, apaisant et respectueux */
export const IconReligion: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-rel-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <path d="M18 5C17.5 7 14 10 11 13C8.5 15.5 8 18 8 20H28C28 18 27.5 15.5 25 13C22 10 18.5 7 18 5Z" fill="url(#sb-rel-g)" />
    <rect x="7" y="20" width="22" height="10" rx="2" fill="#0F766E" />
    <path d="M15 30V24C15 22.3 16.3 21 18 21C19.7 21 21 22.3 21 24V30H15Z" fill="#F0FDFA" />
    <circle cx="18" cy="4" r="1.5" fill="#38BDF8" />
  </svg>
);

// ============================================================================
// 3. COMMUNAUTÉ
// ============================================================================

/** Communauté : Silhouettes reliées avec harmonie */
export const IconCommunaute: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-com-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="sb-com-l" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="sb-com-r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="11" r="4.5" fill="url(#sb-com-c)" />
    <path d="M11 25C11 21.5 14 19 18 19C22 19 25 21.5 25 25V27H11V25Z" fill="url(#sb-com-c)" />
    <circle cx="8" cy="14" r="3" fill="url(#sb-com-l)" />
    <path d="M3 25C3 22.5 5 21 8 21C9.2 21 10.3 21.4 11.2 22.1C10.7 23 10.5 24 10.5 25.2V27H3V25Z" fill="url(#sb-com-l)" />
    <circle cx="28" cy="14" r="3" fill="url(#sb-com-r)" />
    <path d="M33 25C33 22.5 31 21 28 21C26.8 21 25.7 21.4 24.8 22.1C25.3 23 25.5 24 25.5 25.2V27H33V25Z" fill="url(#sb-com-r)" />
  </svg>
);

/** Profil : Silhouette épurée avec dégradé royal */
export const IconProfil: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-prf-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="12" r="6" fill="url(#sb-prf-g)" />
    <path d="M7 30C7 24.5 11.5 21 18 21C24.5 21 29 24.5 29 30V32H7V30Z" fill="url(#sb-prf-g)" />
  </svg>
);

/** Publications : Flux d'articles et plume d'écriture */
export const IconPublications: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-pub-p" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="22" height="24" rx="3" fill="#F8FAFC" stroke="#6366F1" strokeWidth="1.8" />
    <line x1="9" y1="12" x2="20" y2="12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="17" x2="23" y2="17" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="9" y1="22" x2="19" y2="22" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 28L31 9L29 7L20 26L22 28Z" fill="url(#sb-pub-p)" />
  </svg>
);

/** Groupes : Salons thématiques d'apprentissage */
export const IconGroupes: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-grp-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="sb-grp-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M6 16C6 11 10.5 7 16 7C21.5 7 26 11 26 16C26 21 21.5 25 16 25C14.2 25 12.5 24.5 11 23.6L6 25L7.4 20.7C6.5 19.3 6 17.7 6 16Z" fill="url(#sb-grp-a)" />
    <path d="M19 18C19 14.7 22.1 12 26 12C29.9 12 33 14.7 33 18C33 21.3 29.9 24 26 24C24.8 24 23.6 23.7 22.6 23.1L19 24L20 21.2C19.4 20.2 19 19.1 19 18Z" fill="url(#sb-grp-b)" />
  </svg>
);

/** Discussions : Échanges et messagerie en direct */
export const IconDiscussions: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-disc-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M5 15C5 9.5 10 5 16.5 5C23 5 28 9.5 28 15C28 20.5 23 25 16.5 25C14.5 25 12.6 24.5 11 23.5L5 25.5L6.8 20.5C5.6 18.9 5 17 5 15Z" fill="url(#sb-disc-g)" />
    <circle cx="12" cy="15" r="1.8" fill="#FFFFFF" />
    <circle cx="16.5" cy="15" r="1.8" fill="#FFFFFF" />
    <circle cx="21" cy="15" r="1.8" fill="#FFFFFF" />
  </svg>
);

// ============================================================================
// 4. VISIO & RENDEZ-VOUS
// ============================================================================

/** Visio : Caméra vidéo avec optique violette lumineuse */
export const IconVisio: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-cam-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-cam-l" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
    </defs>
    <rect x="4" y="9" width="19" height="18" rx="4" fill="url(#sb-cam-b)" />
    <circle cx="13.5" cy="18" r="4.5" fill="#1E1B4B" />
    <circle cx="13.5" cy="18" r="2.5" fill="#38BDF8" />
    <path d="M23 15L31 10.5V25.5L23 21V15Z" fill="url(#sb-cam-l)" />
  </svg>
);

/** Mes rendez-vous : Séances programmées & horloge de révision */
export const IconMesRendezVous: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-rdv-top" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="sb-rdv-ck" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="26" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
    <path d="M5 11C5 8.8 6.8 7 9 7H27C29.2 7 31 8.8 31 11V14H5V11Z" fill="url(#sb-rdv-top)" />
    {/* Horloge / pastille de validation */}
    <circle cx="24" cy="24" r="7" fill="url(#sb-rdv-ck)" />
    <path d="M21.5 24L23.5 26L26.5 22" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Calendrier : Grille des dates clés et concours */
export const IconCalendrier: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-cal-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="26" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
    <path d="M5 11C5 8.8 6.8 7 9 7H27C29.2 7 31 8.8 31 11V14H5V11Z" fill="url(#sb-cal-g)" />
    <rect x="10" y="4" width="2.5" height="5" rx="1.25" fill="#3B82F6" />
    <rect x="23.5" y="4" width="2.5" height="5" rx="1.25" fill="#3B82F6" />
    <circle cx="11" cy="19" r="1.8" fill="#64748B" />
    <circle cx="18" cy="19" r="1.8" fill="#64748B" />
    <circle cx="25" cy="19" r="1.8" fill="#64748B" />
    <circle cx="11" cy="25" r="1.8" fill="#64748B" />
    <circle cx="18" cy="25" r="2.2" fill="#EC4899" />
    <circle cx="25" cy="25" r="1.8" fill="#64748B" />
  </svg>
);

/** Agenda : Point d'entrée calendrier et organisation */
export const IconAgenda: React.FC<IconProps> = IconCalendrier;

/** Emploi du temps : Planning hebdomadaire */
export const IconEmploiDuTemps: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sch-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <rect x="4" y="5" width="28" height="26" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="8" y="9" width="5" height="12" rx="2" fill="url(#sb-sch-g)" />
    <rect x="15.5" y="14" width="5" height="13" rx="2" fill="#8B5CF6" />
    <rect x="23" y="9" width="5" height="8" rx="2" fill="#EC4899" />
  </svg>
);

// ============================================================================
// 5. OUTILS & PRODUCTIVITÉ
// ============================================================================

/** Mes documents : Portfolio personnel / dossier de stockage */
export const IconMesDocuments: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-fld-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M5 8C5 6.9 5.9 6 7 6H13L16 9H29C30.1 9 31 9.9 31 11V27C31 28.1 30.1 29 29 29H7C5.9 29 5 28.1 5 27V8Z" fill="#1E3A8A" />
    <rect x="9" y="10" width="18" height="12" rx="2" fill="#FFFFFF" />
    <path d="M4 14C4 12.9 4.9 12 6 12H30C31.1 12 32 12.9 32 14V27C32 28.1 31.1 29 30 29H6C4.9 29 4 28.1 4 27V14Z" fill="url(#sb-fld-g)" />
  </svg>
);

/** Téléchargements : Bac récepteur avec flèche descendante */
export const IconTelechargements: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-dl-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M18 6V20M18 20L12 14M18 20L24 14" stroke="url(#sb-dl-g)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 22V27C6 28.6 7.4 30 9 30H27C28.6 30 30 28.6 30 27V22" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Favoris : Étoile scintillante aux pétales doux */
export const IconFavoris: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-fav-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <path d="M18 4L22.2 12.6L31.6 14L24.8 20.6L26.4 30L18 25.6L9.6 30L11.2 20.6L4.4 14L13.8 12.6L18 4Z" fill="url(#sb-fav-g)" stroke="#FBBF24" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

/** Historique : Horloge de consultation cyclique */
export const IconHistorique: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-hst-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <path d="M18 6C11.4 6 6 11.4 6 18C6 24.6 11.4 30 18 30C23.6 30 28.3 26.2 29.6 21" stroke="url(#sb-hst-g)" strokeWidth="3" strokeLinecap="round" />
    <path d="M29 6V12H23" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 11V18L23 21" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Notes : Bloc-notes moderne avec lignes douces et pointe d'écriture */
export const IconNotes: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-not-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect x="6" y="5" width="24" height="27" rx="3" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
    <path d="M6 10H30" stroke="#FBBF24" strokeWidth="1.5" />
    <line x1="10" y1="16" x2="26" y2="16" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
    <line x1="10" y1="21" x2="22" y2="21" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
    <line x1="10" y1="26" x2="18" y2="26" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
    <circle cx="26" cy="26" r="3" fill="url(#sb-not-g)" />
  </svg>
);

// ============================================================================
// 6. ASSISTANTS & UTILITAIRES
// ============================================================================

/** Sunubiblio AI : Symbole vectoriel officiel pur de l'intelligence Sunubiblio */
export const IconSunubiblioAI: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <img
    src="/sunuia.svg"
    alt="Sunubiblio AI"
    width={size}
    height={size}
    className={className}
    style={{ display: 'block', width: `${size}px`, height: `${size}px`, objectFit: 'contain' }}
  />
);

/** Recherche : Loupe épurée aux reflets azur */
export const IconRecherche: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sr-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="9" stroke="url(#sb-sr-g)" strokeWidth="3" />
    <path d="M22.5 22.5L30 30" stroke="#EC4899" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="13" cy="13" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/** Assistant : Tuteur pas-à-pas avec étincelle florale */
export const IconAssistant: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-ast-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M18 4C18 10.5 23.5 16 30 16C23.5 16 18 21.5 18 28C18 21.5 12.5 16 6 16C12.5 16 18 10.5 18 4Z" fill="url(#sb-ast-g)" />
    <circle cx="27" cy="8" r="3" fill="#38BDF8" />
    <circle cx="9" cy="25" r="2.5" fill="#FBBF24" />
  </svg>
);

/** Outils documentaires : Suite d'outils numériques (PDF, conversions, annotations) */
export const IconOutilsDoc: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-otl-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <rect x="6" y="5" width="20" height="26" rx="3" fill="url(#sb-otl-g)" />
    <path d="M10 12H20M10 17H17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Clé d'outils / plume transversale */}
    <circle cx="25" cy="25" r="7" fill="#EC4899" />
    <path d="M22.5 25L24.5 27L27.5 23" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// 7. COMMERCE
// ============================================================================

/** Marketplace : Sac commercial stylisé avec logo floral gravé */
export const IconMarketplace: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-mkt-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M12 14V10C12 6.7 14.7 4 18 4C21.3 4 24 6.7 24 10V14" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M7 12L5 30C5 31.1 5.9 32 7 32H29C30.1 32 31 31.1 31 30L29 12H7Z" fill="url(#sb-mkt-g)" />
    <circle cx="18" cy="22" r="2.5" fill="#FFFFFF" />
  </svg>
);

/** Vendre un livre : Livre combiné avec un étiquetage commercial discret */
export const IconVendreLivre: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-vdl-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="sb-vdl-t" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Livre de base */}
    <path d="M5 8C5 6.9 5.9 6 7 6H25C26.1 6 27 6.9 27 8V26C27 27.1 26.1 28 25 28H7C5.9 28 5 27.1 5 26V8Z" fill="url(#sb-vdl-b)" />
    <rect x="8" y="11" width="10" height="2" rx="1" fill="#93C5FD" />
    <rect x="8" y="16" width="7" height="2" rx="1" fill="#93C5FD" />
    {/* Étiquette prix en superposition */}
    <circle cx="25" cy="23" r="7.5" fill="url(#sb-vdl-t)" />
    <text x="22" y="26.5" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif">+</text>
  </svg>
);

/** Mes ventes : Graphique de performance et suivi des commandes */
export const IconMesVentes: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-vnt-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="6" y="21" width="5" height="9" rx="1.5" fill="#93C5FD" />
    <rect x="14" y="16" width="5" height="14" rx="1.5" fill="#6366F1" />
    <rect x="22" y="10" width="5" height="20" rx="1.5" fill="#4F46E5" />
    <path d="M7 16L15 11L25 5M25 5H19M25 5V11" stroke="url(#sb-vnt-g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Mes achats : Panier d'achat avec validation de commande */
export const IconMesAchats: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-ach-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M5 8H8L11 22H27L30 11H10" stroke="url(#sb-ach-g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="13" cy="27" r="2.5" fill="#4F46E5" />
    <circle cx="25" cy="27" r="2.5" fill="#4F46E5" />
    <path d="M16 16L19 18.5L24 13.5" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// 8. MON COMPTE & SERVICES
// ============================================================================

/** Formules & Tarifs : Pass d'abonnement SaaS premium aux courbes galbées Sunubiblio */
export const IconFormulesTarifs: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-trf-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="sb-trf-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Carte d'accès premium arrondie */}
    <rect x="4" y="6" width="28" height="24" rx="5" fill="url(#sb-trf-card)" />
    {/* Micro-bande supérieure brillante */}
    <path d="M4 12C4 8.7 6.7 6 10 6H26C29.3 6 32 8.7 32 12V13H4V12Z" fill="#FFFFFF" fillOpacity="0.15" />
    {/* Étoile / Badge central doré aux reflets doux */}
    <circle cx="18" cy="18" r="5.5" fill="url(#sb-trf-star)" />
    <path d="M18 14.5L19.2 16.8L21.5 17L19.8 18.6L20.3 21L18 19.8L15.7 21L16.2 18.6L14.5 17L16.8 16.8L18 14.5Z" fill="#FFFFFF" />
    {/* Micro-lignes de niveau SaaS */}
    <rect x="8" y="24" width="6" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
    <rect x="22" y="24" width="6" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
  </svg>
);

/** Professeurs : Enseignant bienveillant au tableau interactif Sunubiblio */
export const IconProfesseurs: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-prof-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="sb-prof-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Tableau / Fond pédagogique arrondi */}
    <rect x="4" y="5" width="28" height="22" rx="4" fill="url(#sb-prof-grad)" />
    {/* Support du tableau */}
    <path d="M12 27L10 32M24 27L26 32" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 30H29" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    {/* Silhouette de l'enseignant au tableau */}
    <circle cx="14" cy="13" r="3" fill="#FFFFFF" />
    <path d="M9 22C9 19 11 18 14 18C17 18 19 19 19 22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    {/* Formules et tracés de savoir */}
    <path d="M21 11H27M21 15H25" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
    {/* Micro-étoile d'excellence pédagogique */}
    <circle cx="26" cy="20" r="2.5" fill="url(#sb-prof-star)" />
  </svg>
);

/** Établissements : Façade académique & institutionnelle moderne avec dôme et colonnade dorée/azur */
export const IconEtablissements: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-etab-ped" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="sb-etab-dome" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="sb-etab-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    <path d="M18 4C14.5 4 12 7.2 12 10.5H24C24 7.2 21.5 4 18 4Z" fill="url(#sb-etab-dome)" />
    <path d="M4 12L18 6L32 12H4Z" fill="url(#sb-etab-ped)" />
    <circle cx="18" cy="10" r="1.5" fill="url(#sb-etab-star)" />
    <rect x="5" y="12" width="26" height="2" rx="0.5" fill="#DBEAFE" />
    <rect x="7" y="14" width="3" height="11" rx="1" fill="#2563EB" />
    <rect x="13.5" y="14" width="3" height="11" rx="1" fill="#3B82F6" />
    <rect x="19.5" y="14" width="3" height="11" rx="1" fill="#3B82F6" />
    <rect x="26" y="14" width="3" height="11" rx="1" fill="#2563EB" />
    <path d="M16 25V20C16 18.9 16.9 18 18 18C19.1 18 20 18.9 20 20V25H16Z" fill="#1E3A8A" />
    <rect x="4" y="25" width="28" height="2.5" rx="1" fill="#1E293B" />
    <rect x="2" y="27.5" width="32" height="3" rx="1.5" fill="url(#sb-etab-ped)" />
  </svg>
);

/** Assistant IA : Étincelle d'intelligence artificielle multi-branches aux reflets violet, rose et cyan */
export const IconAssistantIA: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-aia-main" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
      <linearGradient id="sb-aia-sat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    <path d="M18 3C18 10.2 23.8 16 31 16C23.8 16 18 21.8 18 29C18 21.8 12.2 16 5 16C12.2 16 18 10.2 18 3Z" fill="url(#sb-aia-main)" />
    <path d="M28 4C28 6.5 30 8.5 32.5 8.5C30 8.5 28 10.5 28 13C28 10.5 26 8.5 23.5 8.5C26 8.5 28 6.5 28 4Z" fill="url(#sb-aia-sat)" />
    <circle cx="8" cy="27" r="2.5" fill="#38BDF8" />
    <circle cx="18" cy="16" r="3" fill="#FFFFFF" fillOpacity="0.95" />
  </svg>
);

/** Antiplagiat : Bouclier d'intégrité académique avec balayage spectral de similarité */
export const IconAntiplagiat: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-anti-shd" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="sb-anti-beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <path d="M18 4L31 8V17C31 24.5 25.5 30 18 32C10.5 30 5 24.5 5 17V8L18 4Z" fill="url(#sb-anti-shd)" />
    <rect x="11" y="10" width="14" height="15" rx="2" fill="#FFFFFF" fillOpacity="0.95" />
    <rect x="13.5" y="13" width="9" height="1.6" rx="0.8" fill="#94A3B8" />
    <rect x="13.5" y="16.5" width="7" height="1.6" rx="0.8" fill="#94A3B8" />
    <rect x="13.5" y="20" width="8" height="1.6" rx="0.8" fill="#94A3B8" />
    <rect x="9" y="17.5" width="18" height="2" rx="1" fill="url(#sb-anti-beam)" />
    <circle cx="24" cy="23" r="5" fill="#10B981" />
    <path d="M22 23L23.5 24.5L26 21.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// REGISTRE DES ICÔNES SUNUBIBLIO
// ============================================================================

export const AppLauncherIconRegistry: Record<string, React.FC<IconProps>> = {
  // Applications Principales
  book: IconBibliotheque,
  education: IconEducation,
  concours: IconConcours,
  documents: IconDocuments,
  professeurs: IconProfesseurs,
  etablissements: IconEtablissements,
  exercices: IconExercices,
  assistant_ia: IconAssistantIA,
  antiplagiat: IconAntiplagiat,
  cours: IconCours,
  visio: IconVisio,
  agenda: IconCalendrier,
  ressources: IconRessources,
  mes_documents: IconMesDocuments,
  religion: IconReligion,
  notes: IconNotes,

  // Savoirs & Utilitaires complémentaires
  rendez_vous: IconMesRendezVous,
  calendrier: IconCalendrier,
  emploi_du_temps: IconEmploiDuTemps,
  telechargements: IconTelechargements,
  favoris: IconFavoris,
  historique: IconHistorique,
  communaute: IconCommunaute,
  profil: IconProfil,
  publications: IconPublications,
  groupes: IconGroupes,
  discussions: IconDiscussions,
  sunubiblio_ai: IconAssistantIA,
  recherche: IconRecherche,
  assistant: IconAssistant,
  outils_doc: IconOutilsDoc,

  // Commerce
  marketplace: IconMarketplace,
  vendre_livre: IconVendreLivre,
  mes_ventes: IconMesVentes,
  mes_achats: IconMesAchats,

  // Mon Compte & Services
  tarifs: IconFormulesTarifs,
};

export const getAppLauncherIcon = (iconId: string): React.FC<IconProps> => {
  return AppLauncherIconRegistry[iconId] || IconBibliotheque;
};
