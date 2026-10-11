import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

// ============================================================================
// DÉFINITIONS DES DÉGRADÉS & SQUIRCLES INSTAGRAM / LUXE SUNUBIBLIO
// Palette exclusive : Noir Profond (#0f172a, #1e293b), Or Solaire (#f59e0b, #d97706), Blanc Pur (#ffffff)
// Aucun Bleu Roi ni Azur
// ============================================================================

const CommonSquircleDefs: React.FC = () => (
  <defs>
    {/* Dégradé Squircle Noir Profond / Ardoise de Prestige */}
    <linearGradient id="sq-dark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#1E293B" />
      <stop offset="100%" stopColor="#0F172A" />
    </linearGradient>

    {/* Dégradé Squircle Or Solaire / Ambre Chaud Sunubiblio (Applications Vedettes) */}
    <linearGradient id="sq-gold" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FBBF24" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>

    {/* Dégradé Pictogramme Or Solaire Accent */}
    <linearGradient id="sq-accent-gold" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FDE047" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
  </defs>
);

// ============================================================================
// 1. APPLICATIONS PRINCIPALES
// ============================================================================

/** 1. Bibliothèque : Squircle Noir Ardoise + Livre Ouvert Blanc & Marque-page Or */
export const IconBibliotheque: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Livre ouvert moderne */}
    <path d="M11 26C13.5 24.5 17.5 24.5 20 26V14C17.5 12.8 13.5 12.8 11 14V26Z" fill="#FFFFFF" fillOpacity="0.95" />
    <path d="M29 26C26.5 24.5 22.5 24.5 20 26V14C22.5 12.8 26.5 12.8 29 14V26Z" fill="#FFFFFF" />
    <path d="M20 13.5V26" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 2. Éducation : Squircle Noir Ardoise + Toque Universitaire Blanche & Pompon Or */
export const IconEducation: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Mortier académique */}
    <path d="M20 12L31 17.5L20 23L9 17.5L20 12Z" fill="#FFFFFF" />
    <path d="M13.5 20V25C13.5 27 16.5 28.5 20 28.5C23.5 28.5 26.5 27 26.5 25V20" fill="#FFFFFF" fillOpacity="0.85" />
    <path d="M28 18.5V24" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="28" cy="24.5" r="1.5" fill="#F59E0B" />
  </svg>
);

/** 3. Concours : Squircle Or Solaire (Vedette) + Trophée / Coupe d'Excellence Blanche */
export const IconConcours: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-gold)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
    {/* Coupe de concours officielle */}
    <path d="M14 12H26V17.5C26 20.8 23.3 23.5 20 23.5C16.7 23.5 14 20.8 14 17.5V12Z" fill="#FFFFFF" />
    <path d="M14 14H11C10.4 14 10 14.4 10 15C10 17 11.5 18.5 14 18.5V14Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M26 14H29C29.6 14 30 14.4 30 15C30 17 28.5 18.5 26 18.5V14Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M18.5 23.5H21.5V26.5H18.5V23.5Z" fill="#FFFFFF" />
    <rect x="16" y="26.5" width="8" height="3" rx="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="17.5" r="1.8" fill="#F59E0B" />
  </svg>
);

/** 4. Documents : Squircle Noir Ardoise + Fichier Certifié Blanc & Coins Or */
export const IconDocuments: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Feuille certifiée avec coin plié */}
    <path d="M13 11C13 9.9 13.9 9 15 9H22.5L27 13.5V29C27 30.1 26.1 31 25 31H15C13.9 31 13 30.1 13 29V11Z" fill="#FFFFFF" />
    <path d="M22.5 9V13.5H27" fill="#E2E8F0" />
    <rect x="16.5" y="17.5" width="7" height="2" rx="1" fill="#0F172A" />
    <rect x="16.5" y="21.5" width="7" height="2" rx="1" fill="#0F172A" />
    <rect x="16.5" y="25.5" width="4.5" height="2" rx="1" fill="#F59E0B" />
  </svg>
);

/** 5. Professeurs : Squircle Noir Ardoise + Tableau Interactif & Silhouette Or */
export const IconProfesseurs: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Tableau d'enseignement moderne */}
    <rect x="11" y="11" width="18" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.95" />
    <rect x="13" y="13" width="14" height="8" rx="1" fill="#0F172A" />
    <path d="M15 16L17.5 18.5L21 14.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="26" r="2.5" fill="#FFFFFF" />
    <path d="M12 30C12 28.2 14 27.5 16 27.5C18 27.5 20 28.2 20 30" fill="#FFFFFF" />
    <rect x="22" y="24.5" width="6" height="1.8" rx="0.9" fill="#F59E0B" />
  </svg>
);

/** 6. Établissements : Squircle Noir Ardoise + Colonnes Universitaires Blanc & Or */
export const IconEtablissements: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Façade institutionnelle */}
    <path d="M20 11L30 16H10L20 11Z" fill="#FFFFFF" />
    <rect x="12" y="18" width="2.5" height="8" rx="1" fill="#FFFFFF" />
    <rect x="16.5" y="18" width="2.5" height="8" rx="1" fill="#F59E0B" />
    <rect x="21" y="18" width="2.5" height="8" rx="1" fill="#F59E0B" />
    <rect x="25.5" y="18" width="2.5" height="8" rx="1" fill="#FFFFFF" />
    <rect x="9.5" y="26.5" width="21" height="3" rx="1" fill="#FFFFFF" />
  </svg>
);

// ============================================================================
// 2. COURS & RENDEZ-VOUS
// ============================================================================

/** 7. Cours : Squircle Noir Ardoise + Moniteur Interactif Blanc & Courbe Or */
export const IconCours: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="10" y="12" width="20" height="14" rx="2.5" fill="#FFFFFF" />
    <rect x="12" y="14" width="16" height="10" rx="1.5" fill="#0F172A" />
    <path d="M14 21L17.5 18L20 20L24 15.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="15.5" r="1.5" fill="#FFFFFF" />
    <path d="M17 26.5H23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 8. Visio : Squircle Or Solaire (Vedette) + Caméra Vidéo Ronde Blanche */
export const IconVisio: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-gold)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
    <rect x="10" y="14" width="14" height="12" rx="3" fill="#FFFFFF" />
    <path d="M24 17.5L30 13.5V26.5L24 22.5V17.5Z" fill="#FFFFFF" />
    <circle cx="17" cy="20" r="2.5" fill="#D97706" />
  </svg>
);

/** 9. Agenda / Calendrier */
export const IconCalendrier: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="11" y="12" width="18" height="17" rx="3" fill="#FFFFFF" />
    <path d="M11 17H29V14C29 12.9 28.1 12 27 12H13C11.9 12 11 12.9 11 14V17Z" fill="#0F172A" />
    <rect x="15" y="10" width="2" height="4" rx="1" fill="#F59E0B" />
    <rect x="23" y="10" width="2" height="4" rx="1" fill="#F59E0B" />
    <circle cx="16" cy="21" r="1.2" fill="#0F172A" />
    <circle cx="20" cy="21" r="1.2" fill="#0F172A" />
    <circle cx="24" cy="21" r="1.2" fill="#F59E0B" />
    <circle cx="16" cy="25" r="1.2" fill="#0F172A" />
    <circle cx="20" cy="25" r="1.2" fill="#F59E0B" />
    <circle cx="24" cy="25" r="1.2" fill="#0F172A" />
  </svg>
);

// ============================================================================
// 3. RESSOURCES & DOCUMENTS
// ============================================================================

/** 10. Ressources */
export const IconRessources: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="11" y="17" width="18" height="13" rx="2" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="13" y="14" width="14" height="13" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="15" y="11" width="10" height="13" rx="2" fill="#FFFFFF" />
    <circle cx="20" cy="18" r="2.5" fill="#F59E0B" />
  </svg>
);

/** 11. Mes Documents */
export const IconMesDocuments: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M10 14C10 12.9 10.9 12 12 12H17L19.5 15H28C29.1 15 30 15.9 30 17V26C30 27.1 29.1 28 28 28H12C10.9 28 10 27.1 10 26V14Z" fill="#FFFFFF" />
    <path d="M10 18H30V26C30 27.1 29.1 28 28 28H12C10.9 28 10 27.1 10 26V18Z" fill="#F59E0B" fillOpacity="0.85" />
  </svg>
);

/** 12. Religion */
export const IconReligion: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M20 10C21.5 13 25 15 25 18C25 20.8 22.8 23 20 23C17.2 23 15 20.8 15 18C15 15 18.5 13 20 10Z" fill="#F59E0B" />
    <rect x="12" y="23" width="16" height="7" rx="1" fill="#FFFFFF" />
    <path d="M17 30V26C17 24.3 18.3 23 20 23C21.7 23 23 24.3 23 26V30" fill="#0F172A" />
  </svg>
);

/** 13. Notes */
export const IconNotes: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="12" y="10" width="16" height="20" rx="3" fill="#FFFFFF" />
    <rect x="15" y="15" width="10" height="2" rx="1" fill="#0F172A" />
    <rect x="15" y="19" width="10" height="2" rx="1" fill="#0F172A" />
    <rect x="15" y="23" width="6" height="2" rx="1" fill="#F59E0B" />
  </svg>
);

// ============================================================================
// 4. COMMERCE & ABONNEMENTS
// ============================================================================

/** 14. Marketplace */
export const IconMarketplace: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-gold)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
    <path d="M12 14H28L29.5 27C29.6 27.8 28.9 28.5 28.1 28.5H11.9C11.1 28.5 10.4 27.8 10.5 27L12 14Z" fill="#FFFFFF" />
    <path d="M16 14V12C16 9.8 17.8 8 20 8C22.2 8 24 9.8 24 12V14" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="2.5" fill="#D97706" />
  </svg>
);

export const IconVendreLivre: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="11" y="11" width="14" height="18" rx="2" fill="#FFFFFF" />
    <circle cx="26" cy="25" r="5" fill="#F59E0B" />
    <path d="M26 22V28M23 25H29" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconMesVentes: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M11 25L17 19L22 23L29 15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="29" cy="15" r="2" fill="#F59E0B" />
  </svg>
);

export const IconMesAchats: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M13 14H27L25 24H15L13 14Z" fill="#FFFFFF" />
    <circle cx="16" cy="27" r="2" fill="#F59E0B" />
    <circle cx="24" cy="27" r="2" fill="#F59E0B" />
  </svg>
);

/** Formules & Tarifs (VIP Gold) */
export const IconFormulesTarifs: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-gold)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
    {/* Couronne VIP or et blanc */}
    <path d="M12 25L14 15L20 19L26 15L28 25H12Z" fill="#FFFFFF" />
    <circle cx="14" cy="14" r="1.5" fill="#D97706" />
    <circle cx="20" cy="18" r="1.5" fill="#D97706" />
    <circle cx="26" cy="14" r="1.5" fill="#D97706" />
  </svg>
);

// ============================================================================
// 5. FONCTIONS SUPPLÉMENTAIRES (IA, EXERCICES, COMMUNAUTÉ)
// ============================================================================

export const IconExercices: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <rect x="11" y="10" width="18" height="20" rx="3" fill="#FFFFFF" />
    <path d="M15 16L18 19L25 12" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="15" y="22" width="10" height="2" rx="1" fill="#0F172A" />
  </svg>
);

export const IconAssistantIA: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M20 10C20 15 25 20 30 20C25 20 20 25 20 30C20 25 15 20 10 20C15 20 20 15 20 10Z" fill="#F59E0B" />
    <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
  </svg>
);

export const IconAntiplagiat: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M20 11L28 14V20C28 25 24 28 20 29C16 28 12 25 12 20V14L20 11Z" fill="#FFFFFF" />
    <path d="M17 19L19.5 21.5L23.5 16.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCommunaute: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <circle cx="15" cy="17" r="3" fill="#FFFFFF" />
    <path d="M10 26C10 23.5 12.5 22 15 22C17.5 22 20 23.5 20 26" fill="#FFFFFF" />
    <circle cx="25" cy="17" r="3" fill="#F59E0B" />
    <path d="M20 26C20 23.5 22.5 22 25 22C27.5 22 30 23.5 30 26" fill="#F59E0B" />
  </svg>
);

export const IconProfil: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <circle cx="20" cy="16" r="4" fill="#FFFFFF" />
    <path d="M12 28C12 24.5 15.5 23 20 23C24.5 23 28 24.5 28 28" fill="#FFFFFF" />
    <circle cx="25" cy="14" r="1.5" fill="#F59E0B" />
  </svg>
);

export const IconFavoris: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-gold)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
    <path d="M20 26.5L12 18.5C10 16.5 10 13.5 12 11.5C14 9.5 17 9.5 19 11.5L20 12.5L21 11.5C23 9.5 26 9.5 28 11.5C30 13.5 30 16.5 28 18.5L20 26.5Z" fill="#FFFFFF" />
  </svg>
);

export const IconHistorique: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="8" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M20 16V20L23 22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconTelechargements: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M20 12V22M20 22L16 18M20 22L24 18" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 24V26C12 27.1 12.9 28 14 28H26C27.1 28 28 27.1 28 26V24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconPublications: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M12 28L15 25H27C28.1 25 29 24.1 29 23V13C29 11.9 28.1 11 27 11H13C11.9 11 11 11.9 11 13V27C11 27.6 11.4 28 12 28Z" fill="#FFFFFF" />
    <rect x="15" y="15" width="10" height="2" rx="1" fill="#0F172A" />
    <rect x="15" y="19" width="6" height="2" rx="1" fill="#F59E0B" />
  </svg>
);

export const IconGroupes: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <circle cx="20" cy="16" r="3.5" fill="#F59E0B" />
    <circle cx="13" cy="18" r="2.5" fill="#FFFFFF" />
    <circle cx="27" cy="18" r="2.5" fill="#FFFFFF" />
    <path d="M15 28C15 25.5 17.5 24 20 24C22.5 24 25 25.5 25 28" fill="#F59E0B" />
  </svg>
);

export const IconDiscussions: React.FC<IconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <CommonSquircleDefs />
    <rect width="40" height="40" rx="12" fill="url(#sq-dark)" />
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    <path d="M12 24V14C12 12.9 12.9 12 14 12H24C25.1 12 26 12.9 26 14V20C26 21.1 25.1 22 24 22H16L12 25V24Z" fill="#FFFFFF" />
    <circle cx="16" cy="17" r="1.5" fill="#F59E0B" />
    <circle cx="20" cy="17" r="1.5" fill="#0F172A" />
    <circle cx="24" cy="17" r="1.5" fill="#0F172A" />
  </svg>
);

export const IconMesRendezVous = IconCalendrier;
export const IconEmploiDuTemps = IconCalendrier;
export const IconRecherche = IconBibliotheque;
export const IconAssistant = IconAssistantIA;
export const IconOutilsDoc = IconDocuments;

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
