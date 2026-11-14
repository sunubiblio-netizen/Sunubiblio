'use client';

import React from 'react';

interface BaatWordmarkProps {
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Wordmark calligraphique officiel "Baat" fidèle au lettrage de la marque,
 * adapté aux couleurs du site (#1e1b4b par défaut).
 */
export const BaatWordmark: React.FC<BaatWordmarkProps> = ({
  height = 24,
  color = '#1e1b4b',
  className = '',
}) => {
  const width = Math.round((height * 224) / 68);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 224 68"
      width={width}
      height={height}
      fill="none"
      className={className}
      aria-label="Baat"
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Lettre B : barre supérieure ouverte + boucle inférieure calligraphique */}
      <path
        d="M 10 12 L 48 12 C 58 12 60 21 51 25 L 25 32 C 13 35 10 42 10 56"
        stroke={color}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 10 57 C 32 57 59 55 60 43 C 61 33 44 30 27 32"
        stroke={color}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Double 'a' fluide relié en vague continue (aa) */}
      <path
        d="M 67 56 L 87 30 C 90 26 95 26 98 30 L 112 52 C 115 56 120 56 123 52 L 138 30 C 141 26 146 26 149 30 L 164 55"
        stroke={color}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Croissants calligraphiques intérieurs des deux 'a' */}
      <path
        d="M 75 47 Q 92 38 107 47 Q 92 43 75 47 Z"
        fill={color}
      />
      <path
        d="M 126 47 Q 143 38 158 47 Q 143 43 126 47 Z"
        fill={color}
      />

      {/* Lettre t : hampe arrondie + courbe inférieure + barre horizontale */}
      <path
        d="M 183 12 L 183 45 C 183 55 190 58 200 58 C 209 58 214 54 215 49"
        stroke={color}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 167 27 L 207 27"
        stroke={color}
        strokeWidth="6.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

