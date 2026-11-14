'use client';

import React from 'react';

interface BaatWordmarkProps {
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Wordmark calligraphique officiel "Baat" conforme à 100% au tracé de la marque
 * (lettrage d'origine avec B ouvert, double a en vagues douces et t arrondi).
 */
export const BaatWordmark: React.FC<BaatWordmarkProps> = ({
  height = 22,
  className = '',
}) => {
  const width = Math.round((height * 605) / 162);

  return (
    <img
      src="/baat-wordmark.png"
      alt="Baat"
      width={width}
      height={height}
      className={className}
      style={{
        height: `${height}px`,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  );
};
