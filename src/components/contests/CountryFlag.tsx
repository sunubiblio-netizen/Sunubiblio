'use client';

import React from 'react';

export interface CountryFlagProps {
  country?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  title?: string;
}

/**
 * Reusable, pixel-perfect CountryFlag component.
 * Displays a lightweight SVG flag of Senegal (or any other configured country),
 * sized appropriately with subtle rounded corners and clean borders.
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  country = 'senegal',
  size = 'sm',
  className = '',
  title,
}) => {
  const normalized = (country || 'senegal').toLowerCase().trim();

  // Dimensions based on size prop (standard 3:2 flag aspect ratio)
  const dimensions = {
    xs: { width: 14, height: 9.5, rx: 1.5 },
    sm: { width: 18, height: 12, rx: 2 },
    md: { width: 22, height: 14.5, rx: 2.5 },
  }[size] || { width: 18, height: 12, rx: 2 };

  // Flag definitions
  const renderFlagContent = () => {
    switch (normalized) {
      case 'senegal':
      case 'sn':
        return (
          <>
            <title>{title || 'Sénégal'}</title>
            {/* Green stripe */}
            <rect x="0" y="0" width="300" height="600" fill="#00853f" />
            {/* Yellow stripe */}
            <rect x="300" y="0" width="300" height="600" fill="#fdef42" />
            {/* Red stripe */}
            <rect x="600" y="0" width="300" height="600" fill="#e31b23" />
            {/* Central green 5-pointed star */}
            <polygon
              points="450,185 478,272 569,272 495,325 524,412 450,359 376,412 405,325 331,272 422,272"
              fill="#00853f"
            />
          </>
        );

      case 'cote_ivoire':
      case 'ci':
      case 'ivory_coast':
        return (
          <>
            <title>{title || 'Côte d’Ivoire'}</title>
            <rect x="0" y="0" width="300" height="600" fill="#f77f00" />
            <rect x="300" y="0" width="300" height="600" fill="#ffffff" />
            <rect x="600" y="0" width="300" height="600" fill="#009e49" />
          </>
        );

      case 'mali':
      case 'ml':
        return (
          <>
            <title>{title || 'Mali'}</title>
            <rect x="0" y="0" width="300" height="600" fill="#14b53a" />
            <rect x="300" y="0" width="300" height="600" fill="#fcd116" />
            <rect x="600" y="0" width="300" height="600" fill="#ce1126" />
          </>
        );

      case 'france':
      case 'fr':
        return (
          <>
            <title>{title || 'France'}</title>
            <rect x="0" y="0" width="300" height="600" fill="#002395" />
            <rect x="300" y="0" width="300" height="600" fill="#ffffff" />
            <rect x="600" y="0" width="300" height="600" fill="#ed2939" />
          </>
        );

      case 'cameroun':
      case 'cm':
      case 'cameroon':
        return (
          <>
            <title>{title || 'Cameroun'}</title>
            <rect x="0" y="0" width="300" height="600" fill="#007a5e" />
            <rect x="300" y="0" width="300" height="600" fill="#ce1126" />
            <rect x="600" y="0" width="300" height="600" fill="#fcd116" />
            <polygon
              points="450,210 475,285 555,285 490,332 515,407 450,360 385,407 410,332 345,285 425,285"
              fill="#fcd116"
            />
          </>
        );

      default:
        // Default to Senegal flag as platform baseline
        return (
          <>
            <title>{title || 'Sénégal'}</title>
            <rect x="0" y="0" width="300" height="600" fill="#00853f" />
            <rect x="300" y="0" width="300" height="600" fill="#fdef42" />
            <rect x="600" y="0" width="300" height="600" fill="#e31b23" />
            <polygon
              points="450,185 478,272 569,272 495,325 524,412 450,359 376,412 405,325 331,272 422,272"
              fill="#00853f"
            />
          </>
        );
    }
  };

  const countryDisplayName =
    title ||
    (normalized === 'senegal' || normalized === 'sn'
      ? 'Sénégal'
      : normalized === 'cote_ivoire' || normalized === 'ci'
      ? 'Côte d’Ivoire'
      : normalized === 'mali' || normalized === 'ml'
      ? 'Mali'
      : normalized === 'france' || normalized === 'fr'
      ? 'France'
      : normalized === 'cameroun' || normalized === 'cm'
      ? 'Cameroun'
      : 'Sénégal');

  return (
    <span
      className={`country-flag-badge ${className}`}
      title={countryDisplayName}
      aria-label={`Drapeau ${countryDisplayName}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 900 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: `${dimensions.rx}px`,
          overflow: 'hidden',
          display: 'block',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.15)',
          border: '1px solid rgba(15, 23, 42, 0.12)',
        }}
      >
        {renderFlagContent()}
      </svg>
    </span>
  );
};
