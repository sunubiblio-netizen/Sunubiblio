import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

// ============================================================================
// ICÔNES OFFICIELLES SUNUBIBLIO — STYLE « ICONS8 COLOR » (https://icons8.com/icons/color)
// Caractéristiques :
// - ZÉRO arrière-plan carré ou squircle : l'icône est libre, transparente et fluide.
// - Dessin vectoriel multi-teintes riche, moderne et semi-flat (2 à 4 couleurs coordonnées).
// - Palette vivante, chaleureuse et lumineuse adaptée à Sunubiblio (Ambre, Corail, Émeraude, Teal, Or, Violet).
// ============================================================================

// ----------------------------------------------------------------------------
// 1. APPLICATIONS PRINCIPALES
// ----------------------------------------------------------------------------

/** 1. Bibliothèque : Piles de livres colorés & marque-page doré (Style Icons8 Color) */
export const IconBibliotheque: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Livre inférieur (Terracotta / Corail) */}
    <rect x="6" y="32" width="36" height="8" rx="2" fill="#E53935" />
    <path d="M10 32H38V40H10C8.9 40 8 39.1 8 38V34C8 32.9 8.9 32 10 32Z" fill="#D32F2F" />
    <rect x="12" y="34" width="28" height="4" rx="1" fill="#ECEFF1" />
    {/* Livre intermédiaire (Émeraude / Vert académique) */}
    <rect x="9" y="22" width="31" height="8" rx="2" fill="#00897B" />
    <path d="M12 22H36V30H12C10.9 30 10 29.1 10 28V24C10 22.9 10.9 22 12 22Z" fill="#00695C" />
    <rect x="15" y="24" width="23" height="4" rx="1" fill="#ECEFF1" />
    {/* Livre supérieur (Or Ambré Solaire) */}
    <rect x="12" y="12" width="26" height="8" rx="2" fill="#FFA000" />
    <path d="M15 12H34V20H15C13.9 20 13 19.1 13 18V14C13 12.9 13.9 12 15 12Z" fill="#FF8F00" />
    <rect x="17" y="14" width="19" height="4" rx="1" fill="#FFF8E1" />
    {/* Marque-page ruban doré */}
    <path d="M22 6V18L25 15L28 18V6H22Z" fill="#FFD54F" />
  </svg>
);

/** 2. Éducation : Toque universitaire avec pompon or & diplôme (Style Icons8 Color) */
export const IconEducation: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Calotte inférieure de la toque */}
    <path d="M14 24V31C14 34.5 18.5 37 24 37C29.5 37 34 34.5 34 31V24" fill="#37474F" />
    <path d="M16 25V30C16 32.5 19.5 34.5 24 34.5C28.5 34.5 32 32.5 32 30V25" fill="#455A64" />
    {/* Losange supérieur (chapeau) */}
    <path d="M24 10L44 19L24 28L4 19L24 10Z" fill="#263238" />
    <path d="M24 11L42 19L24 27L6 19L24 11Z" fill="#37474F" />
    {/* Bouton central or */}
    <circle cx="24" cy="19" r="2.5" fill="#FFC107" />
    {/* Cordon et pompon or */}
    <path d="M24 19C24 19 36 21 37 28" stroke="#FFA000" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35 28L39 28L37.5 36L36.5 36L35 28Z" fill="#FFC107" />
    {/* Diplôme blanc avec ruban rouge en arrière-plan */}
    <rect x="8" y="38" width="22" height="5" rx="2.5" fill="#ECEFF1" />
    <rect x="16" y="38" width="5" height="5" fill="#E53935" />
  </svg>
);

/** 3. Concours : Trophée coupe d'or avec étoile & socle en bois (Style Icons8 Color) */
export const IconConcours: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Poignée gauche */}
    <path d="M14 14H10C7.8 14 6 15.8 6 18C6 22 9.5 24.5 14 25V21C11.5 21 9.5 19.5 9.5 18C9.5 16.9 10.4 16 11.5 16H14V14Z" fill="#FFA000" />
    {/* Poignée droite */}
    <path d="M34 14H38C40.2 14 42 15.8 42 18C42 22 38.5 24.5 34 25V21C36.5 21 38.5 19.5 38.5 18C38.5 16.9 37.6 16 36.5 16H34V14Z" fill="#FFA000" />
    {/* Corps principal de la coupe (Or éclatant) */}
    <path d="M12 8H36V20C36 26.6 30.6 32 24 32C17.4 32 12 26.6 12 20V8Z" fill="#FFC107" />
    {/* Reflet lumineux sur la coupe */}
    <path d="M15 10H20V24C17.5 22.8 15.5 20.2 15 17V10Z" fill="#FFE082" />
    {/* Étoile de victoire */}
    <polygon points="24,14 25.8,18 30,18.4 26.8,21.2 27.8,25.4 24,23.2 20.2,25.4 21.2,21.2 18,18.4 22.2,18" fill="#FFF9C4" />
    {/* Pied & tige de la coupe */}
    <path d="M21 32H27V37H21V32Z" fill="#FFA000" />
    {/* Socle en bois acajou verni */}
    <rect x="14" y="37" width="20" height="6" rx="2" fill="#5D4037" />
    {/* Plaque d'or sur le socle */}
    <rect x="18" y="39" width="12" height="2" rx="1" fill="#FFD54F" />
  </svg>
);

/** 4. Documents : Feuille avec coin plié, lignes colorées & sceau vert (Style Icons8 Color) */
export const IconDocuments: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Feuille de papier principale */}
    <path d="M10 8C10 5.8 11.8 4 14 4H28L38 14V40C38 42.2 36.2 44 34 44H14C11.8 44 10 42.2 10 40V8Z" fill="#F5F7FA" stroke="#CFD8DC" strokeWidth="2" />
    {/* Coin plié avec ombre */}
    <path d="M28 4V14H38L28 4Z" fill="#B0BEC5" />
    <path d="M28 14V4L38 14H28Z" fill="#CFD8DC" />
    {/* Lignes de texte calibrées */}
    <rect x="16" y="18" width="14" height="3" rx="1.5" fill="#FF9800" />
    <rect x="16" y="24" width="18" height="2.5" rx="1.25" fill="#78909C" />
    <rect x="16" y="29" width="18" height="2.5" rx="1.25" fill="#78909C" />
    <rect x="16" y="34" width="12" height="2.5" rx="1.25" fill="#00897B" />
    {/* Sceau de validation vert */}
    <circle cx="34" cy="36" r="6" fill="#4CAF50" />
    <path d="M31.5 36L33.5 38L37 34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 5. Professeurs : Tableau d'enseignement avec formules & silhouette (Style Icons8 Color) */
export const IconProfesseurs: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cadre en bois du tableau */}
    <rect x="4" y="6" width="40" height="26" rx="3" fill="#8D6E63" />
    {/* Surface vert ardoise du tableau */}
    <rect x="7" y="9" width="34" height="20" rx="1.5" fill="#2E7D32" />
    {/* Craies & formules sur le tableau */}
    <path d="M12 15L16 21M16 15L12 21" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 18H28" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" />
    <circle cx="34" cy="18" r="2.5" stroke="#FFE082" strokeWidth="1.8" />
    {/* Rebord porte-craie */}
    <rect x="14" y="27" width="10" height="1.5" rx="0.75" fill="#FFF9C4" />
    {/* Buste de l'enseignant au premier plan */}
    <circle cx="24" cy="34" r="5" fill="#FFB74D" />
    <path d="M14 44C14 39.5 18 38 24 38C30 38 34 39.5 34 44" fill="#37474F" />
    {/* Cravate rouge */}
    <polygon points="24,39 25.5,42 24,44 22.5,42" fill="#E53935" />
  </svg>
);

/** 6. Établissements : Façade de campus universitaire avec horloge & colonnes (Style Icons8 Color) */
export const IconEtablissements: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Toit fronton rouge brique */}
    <polygon points="24,6 42,16 6,16" fill="#E53935" />
    {/* Tour de l'horloge centrale */}
    <rect x="20" y="10" width="8" height="7" fill="#D32F2F" />
    <circle cx="24" cy="13.5" r="2.5" fill="#FFF9C4" />
    <path d="M24 12V13.5L25.2 14" stroke="#37474F" strokeWidth="0.8" />
    {/* Frise supérieure blanche */}
    <rect x="8" y="16" width="32" height="3" fill="#ECEFF1" />
    {/* 4 Colonnes classiques blanches avec ombres */}
    <rect x="10" y="19" width="4" height="17" fill="#ECEFF1" />
    <rect x="18" y="19" width="4" height="17" fill="#ECEFF1" />
    <rect x="26" y="19" width="4" height="17" fill="#ECEFF1" />
    <rect x="34" y="19" width="4" height="17" fill="#ECEFF1" />
    {/* Ombres des colonnes */}
    <rect x="13" y="19" width="1" height="17" fill="#CFD8DC" />
    <rect x="21" y="19" width="1" height="17" fill="#CFD8DC" />
    <rect x="29" y="19" width="1" height="17" fill="#CFD8DC" />
    <rect x="37" y="19" width="1" height="17" fill="#CFD8DC" />
    {/* Porte d'entrée en chêne cintré */}
    <path d="M22 36V26C22 24.9 22.9 24 24 24C25.1 24 26 24.9 26 26V36H22Z" fill="#FFA000" />
    {/* Marches du perron */}
    <rect x="6" y="36" width="36" height="3" fill="#B0BEC5" />
    <rect x="4" y="39" width="40" height="4" rx="1" fill="#90A4AE" />
  </svg>
);

// ----------------------------------------------------------------------------
// 2. COURS & RENDEZ-VOUS
// ----------------------------------------------------------------------------

/** 7. Cours : Écran interactif d'apprentissage avec graphe & bouton play (Style Icons8 Color) */
export const IconCours: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cadre de l'écran */}
    <rect x="6" y="6" width="36" height="26" rx="3" fill="#37474F" />
    {/* Vitre de l'écran */}
    <rect x="8" y="8" width="32" height="22" rx="1.5" fill="#E0F2F1" />
    {/* Bouton play vidéo rouge */}
    <circle cx="24" cy="19" r="6" fill="#E53935" />
    <polygon points="22.5,16 27,19 22.5,22" fill="#FFFFFF" />
    {/* Barre de progression vidéo orange */}
    <rect x="11" y="27" width="26" height="2" rx="1" fill="#B2DFDB" />
    <rect x="11" y="27" width="16" height="2" rx="1" fill="#FF9800" />
    {/* Pied & support de l'écran */}
    <path d="M22 32H26V37H22V32Z" fill="#78909C" />
    <rect x="16" y="37" width="16" height="3" rx="1.5" fill="#90A4AE" />
  </svg>
);

/** 8. Visio / Cours en direct : Caméra vidéo rouge avec ondes live (Style Icons8 Color) */
export const IconVisio: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Boîtier caméra rouge vif */}
    <rect x="6" y="14" width="24" height="20" rx="4" fill="#E53935" />
    <rect x="8" y="16" width="20" height="16" rx="2.5" fill="#EF5350" />
    {/* Objectif triangulaire caméra */}
    <polygon points="30,20 40,14 40,34 30,28" fill="#C62828" />
    <polygon points="31,21 38,16 38,32 31,27" fill="#E53935" />
    {/* Lentille centrale avec reflet */}
    <circle cx="18" cy="24" r="5" fill="#263238" />
    <circle cx="18" cy="24" r="3.5" fill="#4FC3F7" />
    <circle cx="19" cy="23" r="1.2" fill="#FFFFFF" />
    {/* Point indicateur REC */}
    <circle cx="10" cy="18" r="1.5" fill="#FFEB3B" />
    {/* Ondes de diffusion en direct (Live arcs) */}
    <path d="M12 9C15.5 6 20.5 6 24 9" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 6C14 2 22 2 27 6" stroke="#FFA000" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** 9. Agenda / Calendrier : Page à spirales, bande rouge & date (Style Icons8 Color) */
export const IconCalendrier: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Feuille de calendrier blanche */}
    <rect x="6" y="10" width="36" height="32" rx="4" fill="#F5F7FA" stroke="#CFD8DC" strokeWidth="2" />
    {/* Bandeau supérieur rouge éclatant */}
    <path d="M6 14C6 11.8 7.8 10 10 10H38C40.2 10 42 11.8 42 14V18H6V14Z" fill="#E53935" />
    {/* Anneaux de reliure en spirale */}
    <rect x="12" y="6" width="3" height="7" rx="1.5" fill="#78909C" />
    <rect x="22.5" y="6" width="3" height="7" rx="1.5" fill="#78909C" />
    <rect x="33" y="6" width="3" height="7" rx="1.5" fill="#78909C" />
    {/* Pastilles et grille du calendrier */}
    <circle cx="14" cy="26" r="2.5" fill="#FF9800" />
    <circle cx="24" cy="26" r="2.5" fill="#00897B" />
    <circle cx="34" cy="26" r="2.5" fill="#37474F" />
    <circle cx="14" cy="34" r="2.5" fill="#37474F" />
    {/* Étoile de rendez-vous aujourd'hui */}
    <polygon points="24,31 25.2,33.5 28,33.8 26,35.7 26.5,38.5 24,37.1 21.5,38.5 22,35.7 20,33.8 22.8,33.5" fill="#FFC107" />
    <circle cx="34" cy="34" r="2.5" fill="#E53935" />
  </svg>
);

// ----------------------------------------------------------------------------
// 3. RESSOURCES & SAVOIRS
// ----------------------------------------------------------------------------

/** 10. Ressources : Dossier archive kraft avec intercalaires colorés (Style Icons8 Color) */
export const IconRessources: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Intercalaires sortant du dossier */}
    <rect x="10" y="8" width="10" height="12" rx="2" fill="#E53935" />
    <rect x="18" y="11" width="14" height="12" rx="2" fill="#00897B" />
    <rect x="26" y="6" width="12" height="14" rx="2" fill="#FF9800" />
    {/* Boîte archive kraft */}
    <path d="M4 18C4 16.9 4.9 16 6 16H42C43.1 16 44 16.9 44 18V38C44 40.2 42.2 42 40 42H8C5.8 42 4 40.2 4 38V18Z" fill="#A1887F" />
    <path d="M4 22H44V38C44 40.2 42.2 42 40 42H8C5.8 42 4 40.2 4 38V22Z" fill="#8D6E63" />
    {/* Poignée centrale */}
    <rect x="19" y="27" width="10" height="4" rx="2" fill="#D7CCC8" />
  </svg>
);

/** 11. Mes Documents : Dossier jaune ambré ouvert avec fichier blanc (Style Icons8 Color) */
export const IconMesDocuments: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Dos du dossier avec onglet */}
    <path d="M6 10C6 8.9 6.9 8 8 8H18L22 12H40C41.1 12 42 12.9 42 14V34C42 36.2 40.2 38 38 38H8C6.9 38 6 37.1 6 36V10Z" fill="#FFA000" />
    {/* Feuille de papier blanc qui sort */}
    <rect x="12" y="14" width="24" height="16" rx="2" fill="#FFFFFF" />
    <rect x="16" y="18" width="12" height="2" rx="1" fill="#78909C" />
    <rect x="16" y="22" width="16" height="2" rx="1" fill="#78909C" />
    {/* Rabat avant du dossier (plus clair et légèrement incliné) */}
    <path d="M4 18H44L40 38C40 39.1 39.1 40 38 40H8C6.9 40 6 39.1 6 38L4 18Z" fill="#FFC107" />
  </svg>
);

/** 12. Religion : Dôme de mosquée émeraude avec croissant d'or (Style Icons8 Color) */
export const IconReligion: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Flèche et croissant d'or */}
    <rect x="23" y="4" width="2" height="6" fill="#FFA000" />
    <path d="M24 4C26.2 4 28 5.8 28 8C28 10.2 26.2 12 24 12C23.2 12 22.5 11.8 21.8 11.4C23.2 10.8 24.2 9.5 24.2 8C24.2 6.5 23.2 5.2 21.8 4.6C22.5 4.2 23.2 4 24 4Z" fill="#FFC107" />
    {/* Dôme oriental vert émeraude */}
    <path d="M24 10C24 10 36 15 36 26C36 28 34.5 29 32 29H16C13.5 29 12 28 12 26C12 15 24 10 24 10Z" fill="#2E7D32" />
    {/* Reflet de lumière sur le dôme */}
    <path d="M24 12C24 12 29 16 30 24C28 25 25 25 24 25V12Z" fill="#43A047" />
    {/* Façade en marbre blanc */}
    <rect x="10" y="29" width="28" height="13" fill="#ECEFF1" />
    {/* Porte arquée avec illumination dorée */}
    <path d="M20 42V35C20 32.8 21.8 31 24 31C26.2 31 28 32.8 28 35V42H20Z" fill="#FFA000" />
    <path d="M22 42V36C22 34.9 22.9 34 24 34C25.1 34 26 34.9 26 36V42H22Z" fill="#FFD54F" />
    {/* Soubassement */}
    <rect x="8" y="42" width="32" height="3" rx="1" fill="#CFD8DC" />
  </svg>
);

/** 13. Notes : Bloc-notes spirale à lignes avec crayon jaune (Style Icons8 Color) */
export const IconNotes: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Page de bloc-notes */}
    <rect x="8" y="6" width="32" height="36" rx="3" fill="#FFF9C4" stroke="#FFF59D" strokeWidth="2" />
    {/* Lignes d'écriture bleutées */}
    <line x1="16" y1="16" x2="34" y2="16" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="22" x2="34" y2="22" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="28" x2="34" y2="28" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="34" x2="26" y2="34" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    {/* Reliure spirale à gauche */}
    <circle cx="8" cy="12" r="2" fill="#78909C" />
    <circle cx="8" cy="20" r="2" fill="#78909C" />
    <circle cx="8" cy="28" r="2" fill="#78909C" />
    <circle cx="8" cy="36" r="2" fill="#78909C" />
    {/* Crayon jaune taillé posé en biais */}
    <g transform="translate(18, 12) rotate(35)">
      <rect x="0" y="0" width="6" height="22" fill="#FFC107" />
      <polygon points="0,22 6,22 3,28" fill="#FFE082" />
      <polygon points="2,26 4,26 3,28" fill="#37474F" />
      <rect x="0" y="-4" width="6" height="4" fill="#E53935" />
    </g>
  </svg>
);

// ----------------------------------------------------------------------------
// 4. COMMERCE, TARIFS & SERVICES
// ----------------------------------------------------------------------------

/** 14. Marketplace : Sac de shopping corail avec anses & étiquette (Style Icons8 Color) */
export const IconMarketplace: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Anses du sac */}
    <path d="M18 16V11C18 7.7 20.7 5 24 5C27.3 5 30 7.7 30 11V16" stroke="#FFA000" strokeWidth="3" strokeLinecap="round" />
    {/* Corps du sac de shopping rouge corail */}
    <path d="M10 16H38L41 40C41 41.7 39.7 43 38 43H10C8.3 43 7 41.7 7 40L10 16Z" fill="#E53935" />
    <path d="M10 16H38L36 43H10L10 16Z" fill="#EF5350" />
    {/* Motif central ou étoile d'achat */}
    <polygon points="24,24 25.5,28 29.5,28.5 26.5,31.2 27.5,35 24,33 20.5,35 21.5,31.2 18.5,28.5 22.5,28" fill="#FFF9C4" />
  </svg>
);

/** 15. Vendre un livre : Livre avec étiquette de prix verte (Style Icons8 Color) */
export const IconVendreLivre: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Livre ouvert ou fermé */}
    <rect x="8" y="10" width="26" height="32" rx="3" fill="#00897B" />
    <rect x="12" y="12" width="22" height="28" rx="2" fill="#ECEFF1" />
    <rect x="10" y="10" width="6" height="32" rx="2" fill="#00695C" />
    {/* Étiquette de prix verte avec ficelle */}
    <path d="M26 12L38 24L32 30L20 18V12H26Z" fill="#4CAF50" />
    <circle cx="23" cy="15" r="1.5" fill="#FFFFFF" />
    <text x="27" y="24" fill="#FFFFFF" fontSize="6" fontWeight="bold">F</text>
  </svg>
);

/** 16. Mes Ventes : Graphique ascendant avec pièces d'or (Style Icons8 Color) */
export const IconMesVentes: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Fond ardoise de graphique */}
    <rect x="6" y="8" width="36" height="30" rx="3" fill="#F5F7FA" stroke="#CFD8DC" strokeWidth="2" />
    {/* Barres de progression */}
    <rect x="12" y="24" width="5" height="10" rx="1" fill="#90CAF9" />
    <rect x="21" y="18" width="5" height="16" rx="1" fill="#42A5F5" />
    <rect x="30" y="12" width="5" height="22" rx="1" fill="#4CAF50" />
    {/* Flèche verte de croissance */}
    <path d="M10 28L22 16L29 20L37 10" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="32 10 38 10 38 16" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 17. Mes Achats : Panier shopping garni de fournitures (Style Icons8 Color) */
export const IconMesAchats: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Livres et articles dans le panier */}
    <rect x="15" y="12" width="10" height="14" rx="2" fill="#FF9800" transform="rotate(-10 15 12)" />
    <rect x="23" y="10" width="12" height="16" rx="2" fill="#E53935" transform="rotate(12 23 10)" />
    {/* Panier métallique avec anse */}
    <path d="M12 18H36L34 32C34 33.1 33.1 34 32 34H16C14.9 34 14 33.1 14 32L12 18Z" fill="#78909C" />
    <path d="M24 6C19.6 6 16 9.6 16 14V18H32V14C32 9.6 28.4 6 24 6Z" stroke="#B0BEC5" strokeWidth="2.5" fill="none" />
    <rect x="10" y="17" width="28" height="3" rx="1.5" fill="#455A64" />
  </svg>
);

/** 18. Formules & Tarifs : Couronne dorée royale ornée de rubis & émeraudes (Style Icons8 Color) */
export const IconFormulesTarifs: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Couronne en or sculpté */}
    <path d="M6 34L10 16L19 24L24 12L29 24L38 16L42 34H6Z" fill="#FFC107" />
    <path d="M6 34L10 16L19 24L24 12L29 24L38 16L42 34H6Z" stroke="#FFA000" strokeWidth="2" />
    {/* Perles dorées au sommet des pointes */}
    <circle cx="10" cy="16" r="3" fill="#FFE082" />
    <circle cx="24" cy="12" r="3.5" fill="#FFE082" />
    <circle cx="38" cy="16" r="3" fill="#FFE082" />
    {/* Bandeau inférieur de la couronne */}
    <rect x="6" y="34" width="36" height="7" rx="2" fill="#FFA000" />
    {/* Pierres précieuses serties */}
    <circle cx="13" cy="37.5" r="2.2" fill="#E53935" />
    <circle cx="24" cy="37.5" r="2.5" fill="#4CAF50" />
    <circle cx="35" cy="37.5" r="2.2" fill="#E53935" />
    {/* Étoile de brillance */}
    <polygon points="24,20 25.5,23 28.5,23.5 26.2,25.5 27,28.5 24,27 21,28.5 21.8,25.5 19.5,23.5 22.5,23" fill="#FFF9C4" />
  </svg>
);

// ----------------------------------------------------------------------------
// 5. FONCTIONS COMPLÉMENTAIRES (IA, EXERCICES, COMMUNAUTÉ)
// ----------------------------------------------------------------------------

/** 19. Exercices & QCM : Presse-papier avec coche verte & crayon (Style Icons8 Color) */
export const IconExercices: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Planchette en bois du presse-papier */}
    <rect x="8" y="6" width="32" height="38" rx="3" fill="#8D6E63" />
    {/* Feuille de contrôle blanche */}
    <rect x="11" y="10" width="26" height="31" rx="1.5" fill="#F5F7FA" />
    {/* Pince métallique supérieure */}
    <rect x="18" y="4" width="12" height="5" rx="2" fill="#B0BEC5" />
    {/* Questions avec coches et radios */}
    <circle cx="16" cy="18" r="3" fill="#4CAF50" />
    <path d="M14.5 18L15.5 19.5L18 16.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="22" y="17" width="12" height="2" rx="1" fill="#78909C" />
    <circle cx="16" cy="26" r="3" fill="#4CAF50" />
    <path d="M14.5 26L15.5 27.5L18 24.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="22" y="25" width="12" height="2" rx="1" fill="#78909C" />
    <circle cx="16" cy="34" r="3" stroke="#FFA000" strokeWidth="1.5" fill="#FFF8E1" />
    <rect x="22" y="33" width="8" height="2" rx="1" fill="#78909C" />
  </svg>
);

/** 20. Assistant IA / SunuIA : Étoile scintillante multi-couleur (Style Icons8 Color) */
export const IconAssistantIA: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Étoile principale à 4 branches en or éclatant */}
    <path d="M24 4C24 15 29 20 40 20C29 20 24 25 24 36C24 25 19 20 8 20C19 20 24 15 24 4Z" fill="#FFC107" />
    <path d="M24 8C24 15 27 18 34 20C27 22 24 25 24 32C24 25 21 22 14 20C21 18 24 15 24 8Z" fill="#FFE082" />
    {/* Étoile satellite supérieure droite en violet */}
    <path d="M37 6C37 10 39 12 43 12C39 12 37 14 37 18C37 14 35 12 31 12C35 12 37 10 37 6Z" fill="#AB47BC" />
    {/* Étoile satellite inférieure gauche en turquoise */}
    <path d="M11 30C11 34 13 36 17 36C13 36 11 38 11 42C11 38 9 36 5 36C9 36 11 34 11 30Z" fill="#26A69A" />
    {/* Cœur lumineux de l'étoile */}
    <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" />
  </svg>
);

/** 21. Antiplagiat : Bouclier de vérification & loupe d'analyse (Style Icons8 Color) */
export const IconAntiplagiat: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bouclier protecteur bleu acier */}
    <path d="M24 4L38 10V22C38 31.5 32 39.5 24 43C16 39.5 10 31.5 10 22V10L24 4Z" fill="#455A64" />
    <path d="M24 7L35 12V22C35 29.5 30.5 36.5 24 39.5V7Z" fill="#546E7A" />
    {/* Coche verte de validation */}
    <circle cx="24" cy="22" r="8" fill="#4CAF50" />
    <path d="M20 22L23 25L28 19" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 22. Communauté : Groupe de 3 amis connectés (Style Icons8 Color) */
export const IconCommunaute: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Personnage de gauche (Émeraude) */}
    <circle cx="14" cy="18" r="4.5" fill="#FFCC80" />
    <path d="M7 36C7 30.5 10 28 14 28C18 28 21 30.5 21 36" fill="#00897B" />
    {/* Personnage de droite (Violet) */}
    <circle cx="34" cy="18" r="4.5" fill="#FFCC80" />
    <path d="M27 36C27 30.5 30 28 34 28C38 28 41 30.5 41 36" fill="#8E24AA" />
    {/* Personnage central au premier plan (Ambre / Orange) */}
    <circle cx="24" cy="14" r="5.5" fill="#FFB74D" />
    <path d="M15 36C15 29 19 26 24 26C29 26 33 29 33 36" fill="#FF9800" />
  </svg>
);

/** 23. Profil : Portrait utilisateur moderne avec badge d'or (Style Icons8 Color) */
export const IconProfil: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Tête & cheveux */}
    <circle cx="24" cy="16" r="8" fill="#FFB74D" />
    <path d="M17 14C17 9.5 20 8 24 8C28 8 31 9.5 31 14C31 15 30 15 29 14C27 12 21 12 19 14C18 15 17 15 17 14Z" fill="#5D4037" />
    {/* Buste / Veste ardoise & col blanc */}
    <path d="M10 40C10 31.5 16 28 24 28C32 28 38 31.5 38 40" fill="#37474F" />
    <polygon points="24,28 27,34 24,37 21,34" fill="#ECEFF1" />
    {/* Étoile de certification dorée */}
    <circle cx="34" cy="14" r="4" fill="#FFC107" />
    <polygon points="34,11.5 35,13.5 37,13.8 35.5,15.2 36,17.2 34,16.2 32,17.2 32.5,15.2 31,13.8 33,13.5" fill="#FFF9C4" />
  </svg>
);

/** 24. Favoris : Cœur rouge rubis avec éclat doré (Style Icons8 Color) */
export const IconFavoris: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cœur rouge rubis */}
    <path d="M24 40L21.5 37.7C12.5 29.5 6.5 24.1 6.5 17.5C6.5 12 10.7 7.8 16.2 7.8C19.3 7.8 22.3 9.2 24 11.5C25.7 9.2 28.7 7.8 31.8 7.8C37.3 7.8 41.5 12 41.5 17.5C41.5 24.1 35.5 29.5 26.5 37.7L24 40Z" fill="#E53935" />
    {/* Reflet de brillance */}
    <path d="M16 12C12.7 12 10 14.7 10 18" stroke="#FFCDD2" strokeWidth="2.5" strokeLinecap="round" />
    {/* Étoile étincelante d'or */}
    <polygon points="35,7 36,9.5 38.5,10 36.8,11.8 37.5,14 35,13 32.5,14 33.2,11.8 31.5,10 34,9.5" fill="#FFD54F" />
  </svg>
);

/** 25. Historique : Horloge avec aiguilles & flèche circulaire de retour (Style Icons8 Color) */
export const IconHistorique: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cadran d'horloge avec cerclage doré */}
    <circle cx="24" cy="24" r="18" fill="#FFA000" />
    <circle cx="24" cy="24" r="15" fill="#ECEFF1" />
    {/* Heures & Aiguilles */}
    <circle cx="24" cy="24" r="2" fill="#E53935" />
    <line x1="24" y1="24" x2="24" y2="15" stroke="#37474F" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="24" x2="31" y2="24" stroke="#E53935" strokeWidth="2" strokeLinecap="round" />
    {/* Flèche circulaire de rembobinage */}
    <path d="M10 24C10 16.3 16.3 10 24 10" stroke="#00897B" strokeWidth="3" strokeLinecap="round" />
    <polyline points="7 14 10 24 20 21" stroke="#00897B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 26. Téléchargements : Dossier jaune avec flèche verte de téléchargement (Style Icons8 Color) */
export const IconTelechargements: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Dossier jaune ambré */}
    <path d="M6 14C6 11.8 7.8 10 10 10H18L22 14H38C40.2 14 42 15.8 42 18V38C42 40.2 40.2 42 38 42H10C7.8 42 6 40.2 6 38V14Z" fill="#FFC107" />
    {/* Rebord avant légèrement plus foncé */}
    <path d="M6 22H42V38C42 40.2 40.2 42 38 42H10C7.8 42 6 40.2 6 38V22Z" fill="#FFA000" />
    {/* Cercle blanc de fond pour la flèche */}
    <circle cx="24" cy="28" r="9" fill="#FFFFFF" />
    {/* Flèche de téléchargement verte */}
    <path d="M24 22V32M24 32L20 28M24 32L28 28" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 27. Publications : Carte de post avec paysage & texte (Style Icons8 Color) */
export const IconPublications: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Carte blanche de publication */}
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#F5F7FA" stroke="#CFD8DC" strokeWidth="2" />
    {/* Image / Miniature paysage */}
    <rect x="10" y="12" width="28" height="14" rx="2" fill="#E0F2F1" />
    <polygon points="12,24 18,17 25,24" fill="#00897B" />
    <polygon points="22,24 28,19 36,24" fill="#4CAF50" />
    <circle cx="32" cy="16" r="2.5" fill="#FFC107" />
    {/* Lignes de texte du post */}
    <rect x="10" y="30" width="18" height="2" rx="1" fill="#78909C" />
    <rect x="10" y="34" width="12" height="2" rx="1" fill="#B0BEC5" />
    {/* Cœur d'interaction rouge */}
    <path d="M34 32C34 30.5 35 29.5 36.5 29.5C37.5 29.5 38.2 30 38.5 30.8C38.8 30 39.5 29.5 40.5 29.5C42 29.5 43 30.5 43 32C43 34 38.5 36 38.5 36C38.5 36 34 34 34 32Z" fill="#E53935" />
  </svg>
);

/** 28. Groupes : Table ronde / Réunion collaborative (Style Icons8 Color) */
export const IconGroupes: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Table ronde centrale */}
    <circle cx="24" cy="24" r="8" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="1.5" />
    {/* Participant haut (Ambre) */}
    <circle cx="24" cy="11" r="3.5" fill="#FFB74D" />
    {/* Participant bas (Émeraude) */}
    <circle cx="24" cy="37" r="3.5" fill="#00897B" />
    {/* Participant gauche (Coral) */}
    <circle cx="11" cy="24" r="3.5" fill="#E53935" />
    {/* Participant droite (Violet) */}
    <circle cx="37" cy="24" r="3.5" fill="#8E24AA" />
  </svg>
);

/** 29. Discussions : Deux bulles de chat colorées superposées (Style Icons8 Color) */
export const IconDiscussions: React.FC<IconProps> = ({ size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bulle arrière (Violette / Lilas) */}
    <path d="M22 8H36C39.3 8 42 10.7 42 14V24C42 27.3 39.3 30 36 30H34V35L28 30H22C18.7 30 16 27.3 16 24V14C16 10.7 18.7 8 22 8Z" fill="#8E24AA" />
    {/* Bulle avant (Ambre Solaire) */}
    <path d="M12 16H28C31.3 16 34 18.7 34 22V32C34 35.3 31.3 38 28 38H20L14 43V38H12C8.7 38 6 35.3 6 32V22C6 18.7 8.7 16 12 16Z" fill="#FF9800" />
    {/* Points de conversation blancs */}
    <circle cx="15" cy="27" r="1.8" fill="#FFFFFF" />
    <circle cx="20" cy="27" r="1.8" fill="#FFFFFF" />
    <circle cx="25" cy="27" r="1.8" fill="#FFFFFF" />
  </svg>
);

// Alias pratiques pour assurer une compatibilité totale
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
