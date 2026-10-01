'use client';

import React, { useRef, useEffect } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Glisser-déposer fluide à la souris sur Desktop uniquement (ne bloque JAMAIS le défilement tactile mobile)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
      }
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUpOrLeave = () => {
      isDown = false;
      if (el) {
        el.style.cursor = '';
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUpOrLeave);
    el.addEventListener('mouseleave', onMouseUpOrLeave);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUpOrLeave);
      el.removeEventListener('mouseleave', onMouseUpOrLeave);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  // Séparer les stories des autres utilisateurs (exclure 'Moi' s'il existe)
  const otherStories = stories.filter(
    (s) => s.authorName !== 'Moi' && s.authorName !== 'Vous'
  );

  return (
    <section className="publications-stories-wrapper" aria-label="Stories Sunubiblio">
      <div className="publications-stories-scroll" ref={scrollRef}>
        {/* 1. Premier élément : Ma story avec bouton + centré dans un cercle doux */}
        <div className="story-item story-item-add">
          <button
            type="button"
            className="story-add-circle-btn"
            onClick={onAddStory}
            aria-label="Ajouter à ma story"
            title="Ajouter à ma story"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="story-name-label">Ma story</span>
        </div>

        {/* 2. Stories des membres avec anneau dégradé dynamique */}
        {otherStories.map((story, index) => {
          const firstName = story.authorName.split(' ')[0] || story.authorName;
          const isViewed = story.isViewed;

          return (
            <div key={story.id} className="story-item">
              <button
                type="button"
                className={`story-avatar-btn ${isViewed ? 'is-viewed' : 'is-active'}`}
                onClick={() => onViewStory(story, index)}
                aria-label={`Voir la story de ${story.authorName}`}
              >
                <div className="story-avatar-ring">
                  <div className="story-avatar-inner">
                    <Image
                      src={story.authorAvatar || '/avatar_mamadou.jpg'}
                      alt={story.authorName}
                      width={62}
                      height={62}
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
