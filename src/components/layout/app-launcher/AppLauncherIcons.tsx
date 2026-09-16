import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// ============================================================================
// 1. APPRENDRE
// ============================================================================

/** Bibliothèque : Livre ouvert aux pages courbées en arche de pétale Sunubiblio */
export const IconBibliotheque: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-book-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="sb-book-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="sb-book-center" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    {/* Page gauche en pétale */}
    <path d="M18 10C14 6.5 7 7 4 8.5C3.4 8.8 3 9.4 3 10.1V24.5C3 25.5 4 26.2 5 25.8C8 24.6 13.5 24.5 17 27.5C17.6 28 18 27.7 18 27V10Z" fill="url(#sb-book-left)" />
    {/* Page droite en pétale */}
    <path d="M18 10C22 6.5 29 7 32 8.5C32.6 8.8 33 9.4 33 10.1V24.5C33 25.5 32 26.2 31 25.8C28 24.6 22.5 24.5 19 27.5C18.4 28 18 27.7 18 27V10Z" fill="url(#sb-book-right)" />
    {/* Reliure / Marque-page floral au centre */}
    <path d="M16.8 6C16.8 5 19.2 5 19.2 6V15C19.2 15.6 18 17 18 17C18 17 16.8 15.6 16.8 15V6Z" fill="url(#sb-book-center)" />
    {/* Micro-lignes de texte souples */}
    <path d="M7 14C9.5 13.3 12.5 13.5 14.5 15M7 18C9.5 17.3 12.5 17.5 14.5 19" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
    <path d="M21.5 15C23.5 13.5 26.5 13.3 29 14M21.5 19C23.5 17.5 26.5 17.3 29 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
  </svg>
);

/** Éducation : Toque universitaire élégante avec pompon aux nuances rose/violet */
export const IconEducation: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-edu-cap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="sb-edu-tassel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    {/* Sommet du chapeau en losange galbé */}
    <path d="M18 6L33 13L18 20L3 13L18 6Z" fill="url(#sb-edu-cap)" />
    {/* Calotte arrondie */}
    <path d="M9 16.2V22.5C9 26 13 29 18 29C23 29 27 26 27 22.5V16.2L18 20.4L9 16.2Z" fill="#312E81" />
    {/* Pompon suspendu avec pétale */}
    <path d="M30 14.5V23.5C30 24.5 28.5 25.5 28.5 27.5C28.5 29 29.5 30 30 30C30.5 30 31.5 29 31.5 27.5C31.5 25.5 30 24.5 30 23.5" stroke="url(#sb-edu-tassel)" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="13" r="2" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/** Concours : Trophée d'excellence épuré aux courbes fines */
export const IconConcours: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-trophy-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
      <linearGradient id="sb-trophy-stem" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    {/* Coupe galbée */}
    <path d="M10 7C8.5 7 8 8 8 9.5C8 16 13 21 18 21C23 21 28 16 28 9.5C28 8 27.5 7 26 7H10Z" fill="url(#sb-trophy-gold)" />
    {/* Anses élégantes */}
    <path d="M8 10H5C3.9 10 3 10.9 3 12C3 15 5.5 17 8 17.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 10H31C32.1 10 33 10.9 33 12C33 15 30.5 17 28 17.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    {/* Étoile de réussite */}
    <path d="M18 10.5L19 12.8L21.5 13L19.5 14.7L20.2 17L18 15.6L15.8 17L16.5 14.7L14.5 13L17 12.8L18 10.5Z" fill="#FFFFFF" fillOpacity="0.95" />
    {/* Pied & socle */}
    <path d="M16 21H20V26H16V21Z" fill="url(#sb-trophy-stem)" />
    <rect x="11" y="26" width="14" height="4" rx="2" fill="#3B82F6" />
  </svg>
);

/** Exercices : Feuille d'évaluation avec coche de validation dynamique */
export const IconExercices: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sheet-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-check-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* Feuille avec coin supérieur replié doux */}
    <path d="M8 6C8 4.9 8.9 4 10 4H22L28 10V30C28 31.1 27.1 32 26 32H10C8.9 32 8 31.1 8 30V6Z" fill="url(#sb-sheet-bg)" />
    <path d="M22 4V9C22 9.6 22.4 10 23 10H28" fill="#93C5FD" fillOpacity="0.5" />
    {/* Lignes d'exercices */}
    <rect x="12" y="13" width="7" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="12" y="18" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    {/* Grande coche de validation */}
    <path d="M15 24L20 28L31 16" stroke="url(#sb-check-glow)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// 2. SAVOIRS & FORMATIONS
// ============================================================================

/** Cours : Tablette / pupitre de savoirs avec faisceau lumineux */
export const IconCours: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-cours-board" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="26" height="18" rx="4" fill="url(#sb-cours-board)" />
    {/* Schéma graphique du cours */}
    <path d="M9 19L14 14L19 17L27 11" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="27" cy="11" r="2" fill="#FFFFFF" />
    {/* Trépied / support épuré */}
    <path d="M18 25V30M12 30H24" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Ressources : Coffret d'archives & fiches empilées */
export const IconRessources: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-res-1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-res-2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Couches de ressources superposées */}
    <path d="M18 5L31 11L18 17L5 11L18 5Z" fill="url(#sb-res-1)" />
    <path d="M5 16L18 22L31 16" stroke="url(#sb-res-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 22L18 28L31 22" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Documents : Dossier / document de synthèse */
export const IconDocuments: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-doc-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <path d="M7 6C7 4.9 7.9 4 9 4H20L29 13V30C29 31.1 28.1 32 27 32H9C7.9 32 7 31.1 7 30V6Z" fill="url(#sb-doc-bg)" />
    <path d="M20 4V11C20 12.1 20.9 13 22 13H29" fill="#93C5FD" fillOpacity="0.4" />
    {/* Lignes stylisées */}
    <rect x="11" y="16" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="11" y="21" width="11" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
    <rect x="11" y="26" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

/** Religion : Coupole & faisceau spirituel aux courbes apaisantes */
export const IconReligion: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-rel-dome" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Dôme arrondi avec arche */}
    <path d="M18 5C17.5 7 14 10 11 13C8.5 15.5 8 18 8 20H28C28 18 27.5 15.5 25 13C22 10 18.5 7 18 5Z" fill="url(#sb-rel-dome)" />
    <rect x="7" y="20" width="22" height="10" rx="2" fill="#0F766E" />
    {/* Arche d'entrée */}
    <path d="M15 30V24C15 22.3 16.3 21 18 21C19.7 21 21 22.3 21 24V30H15Z" fill="#F0FDFA" />
    <circle cx="18" cy="4" r="1.5" fill="#38BDF8" />
  </svg>
);

// ============================================================================
// 3. OUTILS & PRODUCTIVITÉ
// ============================================================================

/** Calendrier : Grille de dates avec en-tête dégradé */
export const IconCalendrier: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-cal-top" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="26" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
    <path d="M5 11C5 8.8 6.8 7 9 7H27C29.2 7 31 8.8 31 11V14H5V11Z" fill="url(#sb-cal-top)" />
    {/* Anneaux */}
    <rect x="10" y="4" width="2.5" height="5" rx="1.25" fill="#3B82F6" />
    <rect x="23.5" y="4" width="2.5" height="5" rx="1.25" fill="#3B82F6" />
    {/* Points / jours */}
    <circle cx="11" cy="19" r="1.8" fill="#64748B" />
    <circle cx="18" cy="19" r="1.8" fill="#64748B" />
    <circle cx="25" cy="19" r="1.8" fill="#64748B" />
    <circle cx="11" cy="25" r="1.8" fill="#64748B" />
    <circle cx="18" cy="25" r="2.2" fill="#EC4899" />
    <circle cx="25" cy="25" r="1.8" fill="#64748B" />
  </svg>
);

/** Emploi du temps : Matrice de colonnes horaires structurées */
export const IconEmploiDuTemps: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sched-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <rect x="4" y="5" width="28" height="26" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    {/* Colonnes d'activités */}
    <rect x="8" y="9" width="5" height="12" rx="2" fill="url(#sb-sched-g1)" />
    <rect x="15.5" y="14" width="5" height="13" rx="2" fill="#8B5CF6" />
    <rect x="23" y="9" width="5" height="8" rx="2" fill="#EC4899" />
  </svg>
);

/** Mes documents : Portfolio personnel / chemise de classement */
export const IconMesDocuments: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-folder-front" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    {/* Fond dossier */}
    <path d="M5 8C5 6.9 5.9 6 7 6H13L16 9H29C30.1 9 31 9.9 31 11V27C31 28.1 30.1 29 29 29H7C5.9 29 5 28.1 5 27V8Z" fill="#1E3A8A" />
    {/* Document intérieur qui dépasse */}
    <rect x="9" y="10" width="18" height="12" rx="2" fill="#FFFFFF" />
    {/* Rabat avant brillant */}
    <path d="M4 14C4 12.9 4.9 12 6 12H30C31.1 12 32 12.9 32 14V27C32 28.1 31.1 29 30 29H6C4.9 29 4 28.1 4 27V14Z" fill="url(#sb-folder-front)" />
  </svg>
);

/** Téléchargements : Bac de réception avec flèche descendante douce */
export const IconTelechargements: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-dl-arr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Flèche de téléchargement */}
    <path d="M18 6V20M18 20L12 14M18 20L24 14" stroke="url(#sb-dl-arr)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Bac récepteur */}
    <path d="M6 22V27C6 28.6 7.4 30 9 30H27C28.6 30 30 28.6 30 27V22" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// 4. ASSISTANTS & UTILITAIRES
// ============================================================================

/** SunuAI : Le symbole officiel SunuIA (trinité de pétales + vortex intelligent) */
export const IconSunuAI: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <img
    src="/sunuia.svg"
    alt="SunuAI"
    width={size}
    height={size}
    className={className}
    style={{ display: 'block', width: `${size}px`, height: `${size}px`, objectFit: 'contain' }}
  />
);

/** Recherche : Loupe épurée aux reflets azur */
export const IconRecherche: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-srch-rim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="9" stroke="url(#sb-srch-rim)" strokeWidth="3" />
    <path d="M22.5 22.5L30 30" stroke="#EC4899" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="13" cy="13" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

/** Assistant pédagogique : Mentor / étincelle d'apprentissage */
export const IconAssistantPedago: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-tutor-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Étoile de tutorat à 4 branches galbées façon pétale */}
    <path d="M18 4C18 10.5 23.5 16 30 16C23.5 16 18 21.5 18 28C18 21.5 12.5 16 6 16C12.5 16 18 10.5 18 4Z" fill="url(#sb-tutor-g1)" />
    <circle cx="27" cy="8" r="3" fill="#38BDF8" />
    <circle cx="9" cy="25" r="2.5" fill="#FBBF24" />
  </svg>
);

/** Outils PDF : Fiche document avec sceau PDF vectoriel */
export const IconOutilsPDF: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-pdf-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    <path d="M8 5C8 3.9 8.9 3 10 3H22L28 9V29C28 30.1 27.1 31 26 31H10C8.9 31 8 30.1 8 29V5Z" fill="url(#sb-pdf-bg)" />
    <path d="M22 3V9H28" fill="#FCA5A5" fillOpacity="0.4" />
    <text x="11" y="21" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif">PDF</text>
  </svg>
);

// ============================================================================
// 5. COMMUNAUTÉ & ÉCHANGE
// ============================================================================

/** Communauté : Réseau de 3 silhouettes interconnectées */
export const IconCommunaute: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-com-cen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="sb-com-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="sb-com-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    {/* Utilisateur central */}
    <circle cx="18" cy="11" r="4.5" fill="url(#sb-com-cen)" />
    <path d="M11 25C11 21.5 14 19 18 19C22 19 25 21.5 25 25V27H11V25Z" fill="url(#sb-com-cen)" />
    {/* Utilisateur gauche */}
    <circle cx="8" cy="14" r="3" fill="url(#sb-com-left)" />
    <path d="M3 25C3 22.5 5 21 8 21C9.2 21 10.3 21.4 11.2 22.1C10.7 23 10.5 24 10.5 25.2V27H3V25Z" fill="url(#sb-com-left)" />
    {/* Utilisateur droit */}
    <circle cx="28" cy="14" r="3" fill="url(#sb-com-right)" />
    <path d="M33 25C33 22.5 31 21 28 21C26.8 21 25.7 21.4 24.8 22.1C25.3 23 25.5 24 25.5 25.2V27H33V25Z" fill="url(#sb-com-right)" />
  </svg>
);

/** Visio : Caméra vidéo avec optique violette lumineuse */
export const IconVisio: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-cam-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="sb-cam-lens" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
    </defs>
    <rect x="4" y="9" width="19" height="18" rx="4" fill="url(#sb-cam-body)" />
    {/* Objectif frontal */}
    <circle cx="13.5" cy="18" r="4.5" fill="#1E1B4B" />
    <circle cx="13.5" cy="18" r="2.5" fill="#38BDF8" />
    {/* Cône de projection */}
    <path d="M23 15L31 10.5V25.5L23 21V15Z" fill="url(#sb-cam-lens)" />
  </svg>
);

/** Groupes : Bulles de discussion imbriquées en harmonie */
export const IconGroupes: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-grp-1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="sb-grp-2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Première bulle */}
    <path d="M6 16C6 11 10.5 7 16 7C21.5 7 26 11 26 16C26 21 21.5 25 16 25C14.2 25 12.5 24.5 11 23.6L6 25L7.4 20.7C6.5 19.3 6 17.7 6 16Z" fill="url(#sb-grp-1)" />
    {/* Deuxième bulle en superposition douce */}
    <path d="M19 18C19 14.7 22.1 12 26 12C29.9 12 33 14.7 33 18C33 21.3 29.9 24 26 24C24.8 24 23.6 23.7 22.6 23.1L19 24L20 21.2C19.4 20.2 19 19.1 19 18Z" fill="url(#sb-grp-2)" />
  </svg>
);

/** Publications : Journal / flux d'articles partagés */
export const IconPublications: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-pub-pen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <rect x="5" y="7" width="22" height="24" rx="3" fill="#F8FAFC" stroke="#6366F1" strokeWidth="1.8" />
    <line x1="9" y1="12" x2="20" y2="12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="17" x2="23" y2="17" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="9" y1="22" x2="19" y2="22" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
    {/* Plume d'écriture moderne */}
    <path d="M22 28L31 9L29 7L20 26L22 28Z" fill="url(#sb-pub-pen)" />
  </svg>
);

// ============================================================================
// 6. BOUTIQUE & CRÉATION
// ============================================================================

/** Vendre : Étiquette prix élégante avec bouton de monétisation */
export const IconVendre: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sell-tag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M6 18L18 6H29C30.1 6 31 6.9 31 8V19L19 31L6 18Z" fill="url(#sb-sell-tag)" />
    <circle cx="24" cy="13" r="2.5" fill="#FFFFFF" />
    <path d="M14 20L19 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Publier : Partage d'œuvre avec flèche ascensionnelle */
export const IconPublier: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-pub-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M18 4L26 12H20V23H16V12H10L18 4Z" fill="url(#sb-pub-glow)" />
    <path d="M6 23V29C6 30.1 6.9 31 8 31H28C29.1 31 30 30.1 30 29V23" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Mes ventes : Graphique ascendant de performance */
export const IconMesVentes: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sales-arr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="6" y="21" width="5" height="9" rx="1.5" fill="#93C5FD" />
    <rect x="14" y="16" width="5" height="14" rx="1.5" fill="#6366F1" />
    <rect x="22" y="10" width="5" height="20" rx="1.5" fill="#4F46E5" />
    {/* Courbe montante */}
    <path d="M7 16L15 11L25 5M25 5H19M25 5V11" stroke="url(#sb-sales-arr)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Marketplace : Sac de shopping stylisé avec anse arrondie */
export const IconMarketplace: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-shop-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    {/* Anse du sac */}
    <path d="M12 14V10C12 6.7 14.7 4 18 4C21.3 4 24 6.7 24 10V14" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
    {/* Corps du sac */}
    <path d="M7 12L5 30C5 31.1 5.9 32 7 32H29C30.1 32 31 31.1 31 30L29 12H7Z" fill="url(#sb-shop-body)" />
    {/* Fleur Sunubiblio gravée au centre du sac */}
    <circle cx="18" cy="22" r="2.5" fill="#FFFFFF" />
  </svg>
);

// ============================================================================
// 7. MON ESPACE
// ============================================================================

/** Profil : Silhouette humaine raffinée avec anneau de compétences */
export const IconProfil: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-user-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="12" r="6" fill="url(#sb-user-grad)" />
    <path d="M7 30C7 24.5 11.5 21 18 21C24.5 21 29 24.5 29 30V32H7V30Z" fill="url(#sb-user-grad)" />
  </svg>
);

/** Favoris : Étoile scintillante aux pétales doux */
export const IconFavoris: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-fav-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
    <path d="M18 4L22.2 12.6L31.6 14L24.8 20.6L26.4 30L18 25.6L9.6 30L11.2 20.6L4.4 14L13.8 12.6L18 4Z" fill="url(#sb-fav-star)" stroke="#FBBF24" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

/** Historique : Horloge / flèche temporelle cyclique */
export const IconHistorique: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-hist-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <path d="M18 6C11.4 6 6 11.4 6 18C6 24.6 11.4 30 18 30C23.6 30 28.3 26.2 29.6 21" stroke="url(#sb-hist-g1)" strokeWidth="3" strokeLinecap="round" />
    <path d="M29 6V12H23" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 11V18L23 21" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Abonnement : Diamant / Couronne Gold Sunubiblio */
export const IconAbonnement: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-sub-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Diamant facetté */}
    <path d="M10 8L4 16L18 31L32 16L26 8H10Z" fill="url(#sb-sub-gold)" />
    <path d="M4 16H32M18 31L12 16L10 8M18 31L24 16L26 8M18 8V16" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.85" />
  </svg>
);

/** Paramètres : Roue dentée raffinée aux contours adoucis */
export const IconParametres: React.FC<IconProps> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-set-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <path d="M18 13C15.2 13 13 15.2 13 18C13 20.8 15.2 23 18 23C20.8 23 23 20.8 23 18C23 15.2 20.8 13 18 13Z" fill="#3B82F6" />
    <path d="M30 16.5H27.8C27.6 15.7 27.2 15 26.7 14.3L28.2 12.8C28.6 12.4 28.6 11.7 28.2 11.3L25.3 8.4C24.9 8 24.2 8 23.8 8.4L22.3 9.9C21.6 9.4 20.9 9.1 20.1 8.9V6.6C20.1 6.1 19.6 5.6 19.1 5.6H14.9C14.4 5.6 13.9 6.1 13.9 6.6V8.9C13.1 9.1 12.4 9.4 11.7 9.9L10.2 8.4C9.8 8 9.1 8 8.7 8.4L5.8 11.3C5.4 11.7 5.4 12.4 5.8 12.8L7.3 14.3C6.8 15 6.4 15.7 6.2 16.5H4C3.4 16.5 3 17 3 17.5V21.5C3 22 3.4 22.5 4 22.5H6.2C6.4 23.3 6.8 24 7.3 24.7L5.8 26.2C5.4 26.6 5.4 27.3 5.8 27.7L8.7 30.6C9.1 31 9.8 31 10.2 30.6L11.7 29.1C12.4 29.6 13.1 29.9 13.9 30.1V32.4C13.9 32.9 14.4 33.4 14.9 33.4H19.1C19.6 33.4 20.1 32.9 20.1 32.4V30.1C20.9 29.9 21.6 29.6 22.3 29.1L23.8 30.6C24.2 31 24.9 31 25.3 30.6L28.2 27.7C28.6 27.3 28.6 26.6 28.2 26.2L26.7 24.7C27.2 24 27.6 23.3 27.8 22.5H30C30.6 22.5 31 22 31 21.5V17.5C31 17 30.6 16.5 30 16.5Z" stroke="url(#sb-set-g1)" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// REGISTRE UNIFIÉ DES ICÔNES SUNUBIBLIO
// ============================================================================

export const AppLauncherIconRegistry: Record<string, React.FC<IconProps>> = {
  // Apprendre
  book: IconBibliotheque,
  education: IconEducation,
  concours: IconConcours,
  exercices: IconExercices,
  // Savoirs
  cours: IconCours,
  ressources: IconRessources,
  documents: IconDocuments,
  religion: IconReligion,
  // Outils
  calendrier: IconCalendrier,
  emploi_du_temps: IconEmploiDuTemps,
  mes_documents: IconMesDocuments,
  telechargements: IconTelechargements,
  // Assistants
  sunuai: IconSunuAI,
  recherche: IconRecherche,
  assistant_pedago: IconAssistantPedago,
  outils_pdf: IconOutilsPDF,
  // Communauté
  communaute: IconCommunaute,
  visio: IconVisio,
  groupes: IconGroupes,
  publications: IconPublications,
  // Boutique
  vendre: IconVendre,
  publier: IconPublier,
  mes_ventes: IconMesVentes,
  marketplace: IconMarketplace,
  // Mon Espace
  profil: IconProfil,
  favoris: IconFavoris,
  historique: IconHistorique,
  abonnement: IconAbonnement,
  parametres: IconParametres,
};

export const getAppLauncherIcon = (iconId: string): React.FC<IconProps> => {
  return AppLauncherIconRegistry[iconId] || IconBibliotheque;
};
