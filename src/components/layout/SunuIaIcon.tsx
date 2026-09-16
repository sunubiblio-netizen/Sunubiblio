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
    <img
      src="/sunuia.svg"
      alt="SunuIA"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'block',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};
