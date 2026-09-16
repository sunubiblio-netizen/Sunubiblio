import React from 'react';

interface SunuIaIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SunuIaIcon: React.FC<SunuIaIconProps> = ({
  size = 20,
  className = '',
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <defs>
        {/* Dégradé Pétale 1 : Cyan vers Bleu Royal */}
        <linearGradient id="sunuIaG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Dégradé Pétale 2 : Indigo vers Violet Électrique */}
        <linearGradient id="sunuIaG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        {/* Dégradé Pétale 3 : Violet vers Rose Magenta */}
        <linearGradient id="sunuIaG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Lueur subtile du noyau intelligent */}
        <radialGradient id="sunuIaCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="45%" stopColor="#E0E7FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo d'ambiance ultra-léger */}
      <circle cx="24" cy="24" r="21" fill="url(#sunuIaG2)" fillOpacity="0.08" />

      {/* Groupe de 3 pétales arrondis en vortex dynamique */}
      <g>
        {/* Pétale 1 (Haut - Cyan / Bleu) */}
        <path
          d="M 24 17.5 C 27.5 10 37 7.5 40 14 C 42.5 19.5 39.5 25 32 25.5 C 27.5 25.8 24.5 21.5 24 17.5 Z"
          fill="url(#sunuIaG1)"
        />

        {/* Pétale 2 (Bas Droite - Indigo / Violet) */}
        <g transform="rotate(120 24 24)">
          <path
            d="M 24 17.5 C 27.5 10 37 7.5 40 14 C 42.5 19.5 39.5 25 32 25.5 C 27.5 25.8 24.5 21.5 24 17.5 Z"
            fill="url(#sunuIaG2)"
          />
        </g>

        {/* Pétale 3 (Bas Gauche - Magenta / Rose) */}
        <g transform="rotate(240 24 24)">
          <path
            d="M 24 17.5 C 27.5 10 37 7.5 40 14 C 42.5 19.5 39.5 25 32 25.5 C 27.5 25.8 24.5 21.5 24 17.5 Z"
            fill="url(#sunuIaG3)"
          />
        </g>
      </g>

      {/* Noyau d'intelligence SunuIA : halo doux + micro-étincelle de synthèse */}
      <circle cx="24" cy="24" r="5.5" fill="url(#sunuIaCoreGlow)" />
      <path
        d="M 24 20 C 24 22.2 22.2 24 20 24 C 22.2 24 24 25.8 24 28 C 24 25.8 25.8 24 28 24 C 25.8 24 24 22.2 24 20 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
    </svg>
  );
};
