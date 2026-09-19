'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProfileResource, StoryTargetPayload } from '@/types/profile';
import { AddResourceModal } from './AddResourceModal';

interface ProfileResourcesSectionProps {
  resources: ProfileResource[];
  authorName?: string;
  authorAvatar?: string;
  onAddToStory?: (target: StoryTargetPayload) => void;
}

export const ProfileResourcesSection: React.FC<ProfileResourcesSectionProps> = ({
  resources: initialResources,
  authorName,
  authorAvatar,
  onAddToStory,
}) => {
  const [resources, setResources] = useState<ProfileResource[]>(initialResources);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddResource = (newRes: ProfileResource) => {
    setResources([newRes, ...resources]);
  };

  return (
    <section className="profile-resources-section" aria-label="Ressources Pédagogiques">
      <div className="profile-section-header-bar">
        <div className="profile-section-title-cluster">
          <div className="section-title-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <div className="section-title-text-group">
            <h2 className="section-main-heading">Ressources & Documents</h2>
            <p className="section-sub-heading">
              Supports de cours, fiches récapitulatives et annales publiés par l’enseignant.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-add-publication-action"
          aria-label="Ajouter une ressource"
          title="Ajouter une ressource"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-action-text-desktop">Ajouter une ressource</span>
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">📚</div>
          <h4>Aucune ressource publiée</h4>
          <p>Ajoutez votre premier cours, fascicule ou fiche récapitulative pour vos apprenants.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Ajouter une ressource
          </button>
        </div>
      ) : (
        <div className="profile-resources-grid">
          {resources.map((res) => (
            <div key={res.id} className="resource-card-item">
              <div className="resource-card-top">
                <div className="resource-type-cluster">
                  <span className="resource-type-pill">{res.type}</span>
                  {res.isPremium ? (
                    <span className="resource-premium-badge">★ Premium</span>
                  ) : (
                    <span className="resource-free-badge">Accès libre</span>
                  )}
                </div>
                <span className="resource-format-tag">{res.fileFormat} • {res.pagesCount} p.</span>
              </div>

              <h3 className="resource-card-title">{res.title}</h3>

              <div className="resource-card-tags-row">
                <span className="resource-tag-chip">📚 {res.subject}</span>
                <span className="resource-tag-chip">🎓 {res.level}</span>
              </div>

              <div className="resource-card-footer">
                <div className="resource-stats-group">
                  <span className="resource-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {res.viewsCount}
                  </span>
                  <span className="resource-stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {res.downloadCount}
                  </span>
                </div>

                <div className="resource-card-actions-row">
                  {onAddToStory && (
                    <button
                      type="button"
                      className="resource-card-story-btn"
                      onClick={() =>
                        onAddToStory({
                          contentType: 'ressource',
                          contentId: res.id,
                          title: res.title,
                          subtitle: `${res.fileFormat} • ${res.pagesCount} pages`,
                          description: `Ressource éducative : ${res.subject} (${res.level})`,
                          badge: res.fileFormat,
                          metaText: `${res.subject} • ${res.level}`,
                          authorName: authorName || 'Mamadou Diop',
                          authorAvatar: authorAvatar || '/avatar_mamadou.jpg',
                          sharedHref: res.href,
                        })
                      }
                      title="Ajouter à la story (24h)"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                      <span>Story</span>
                    </button>
                  )}

                  <Link href={res.href} className="btn-access-resource">
                    <span>Consulter</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'ajout de ressource */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddResource={handleAddResource}
      />
    </section>
  );
};
