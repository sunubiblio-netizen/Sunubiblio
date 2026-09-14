'use client';

import React from 'react';
import { ReligionResource } from '@/types/religion';
import { ReligionResourceCard } from './ReligionResourceCard';

interface ReligionPopularResourcesProps {
  resources: ReligionResource[];
  onConsultResource: (resource: ReligionResource) => void;
}

export const ReligionPopularResources: React.FC<ReligionPopularResourcesProps> = ({
  resources,
  onConsultResource,
}) => {
  if (!resources || resources.length === 0) return null;

  return (
    <section className="religion-popular-section">
      <div className="container">
        <div className="religion-section-header">
          <div>
            <div className="section-pill-tag">Œuvres Fondamentales</div>
            <h2 className="religion-section-title">Ressources Phares &amp; Patrimoniales</h2>
            <p className="religion-section-subtitle">
              Traités historiques, poésies mystiques et ouvrages fondateurs particulièrement consultés.
            </p>
          </div>
        </div>

        <div className="religion-cards-grid">
          {resources.map((resource) => (
            <ReligionResourceCard
              key={resource.id}
              resource={resource}
              onConsult={onConsultResource}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
