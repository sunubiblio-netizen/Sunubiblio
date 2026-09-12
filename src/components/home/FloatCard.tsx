import React from 'react';

interface FloatCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor?: string;
  className?: string;
}

export const FloatCard: React.FC<FloatCardProps> = ({
  icon,
  title,
  subtitle,
  accentColor = '#6366f1',
  className = '',
}) => {
  return (
    <div className={`float-card ${className}`}>
      <div className="float-card-icon-wrap" style={{ color: accentColor }}>
        {icon}
      </div>
      <div className="float-card-content">
        <h4 className="float-card-title">{title}</h4>
        <p className="float-card-subtitle">{subtitle}</p>
        <div className="float-card-accent" style={{ background: accentColor }} />
      </div>
    </div>
  );
};
