'use client';

import React from 'react';
import Image from 'next/image';
import { PublicationStory } from '@/types/publication';

interface PublicationsStoriesBarProps {
  stories: PublicationStory[];
  onAddStory: () => void;
  onViewStory: (story: PublicationStory, index: number) => void;
}

export const PublicationsStoriesBar: React.FC<PublicationsStoriesBarProps> = ({
  stories,
  onAddStory,
  onViewStory,
}) => {
  // 1. Identifier la story de l'utilisateur ("Ma story" / "Moi")
  const myStoryIndex = stories.findIndex(
    (s) => s.authorName === 'Moi' || s.authorName === 'Vous'
  );
  const myStory = myStoryIndex !== -1 ? stories[myStoryIndex] : null;

  // 2. Stories des autres membres (Mamadou, Aïssatou, Fatou, Ibrahima...)
  const otherStories = stories
    .map((story, originalIndex) => ({ story, originalIndex }))
    .filter((item) => item.originalIndex !== myStoryIndex);

  return (
    <section className="publications-stories-wrapper" aria-label="Stories Sunubiblio">
      <div className="publications-stories-scroll">
        {/* 1. PREMIÈRE POSITION — AJOUT ("Ma story") */}
        <div className="story-item story-item-my">
          <div className="story-avatar-container-wrapper">
            <button
              type="button"
              className={`story-avatar-btn ${
                myStory
                  ? myStory.isViewed
                    ? 'is-viewed'
                    : 'is-active'
                  : 'is-none'
              }`}
              onClick={() => {
                if (myStory) {
                  onViewStory(myStory, myStoryIndex);
                } else {
                  onAddStory();
                }
              }}
              aria-label={
                myStory
                  ? 'Voir ma story'
                  : 'Créer ma story'
              }
            >
              <div className="story-avatar-ring">
                <div className="story-avatar-inner">
                  <Image
                    src={myStory?.authorAvatar || '/avatar_mamadou.jpg'}
                    alt="Ma story"
                    width={66}
                    height={66}
                    className="story-avatar-img"
                  />
                </div>
              </div>
            </button>

            {/* Bouton '+' propre intégré dans un petit cercle en bas à droite */}
            <button
              type="button"
              className="story-plus-badge"
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              title="Ajouter une story"
              aria-label="Ajouter une story"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          <span className="story-name-label story-my-label">Ma story</span>
        </div>

        {/* 2. STORIES DES UTILISATEURS (Mamadou, Aïssatou, Fatou, Ibrahima...) */}
        {otherStories.map(({ story, originalIndex }) => {
          const firstName = story.authorName.split(' ')[0] || story.authorName;
          const isViewed = story.isViewed;

          return (
            <div key={story.id} className="story-item">
              <button
                type="button"
                className={`story-avatar-btn ${isViewed ? 'is-viewed' : 'is-active'}`}
                onClick={() => onViewStory(story, originalIndex)}
                aria-label={`Voir la story de ${story.authorName}`}
              >
                <div className="story-avatar-ring">
                  <div className="story-avatar-inner">
                    <Image
                      src={story.authorAvatar || '/avatar_mamadou.jpg'}
                      alt={story.authorName}
                      width={66}
                      height={66}
                      className="story-avatar-img"
                    />
                  </div>
                </div>
              </button>
              <span className="story-name-label" title={story.authorName}>
                {firstName}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
