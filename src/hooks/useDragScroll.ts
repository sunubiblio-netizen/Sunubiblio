'use client';

import { useRef, useEffect } from 'react';

/**
 * Hook de défilement horizontal fluide par glisser-déposer (Drag-to-Scroll / Swipe).
 * Fonctionne parfaitement avec la souris sur ordinateur ET avec le doigt sur smartphone.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;

    // --- SOURIS (Desktop & Emulation tactile) ---
    const handleMouseDown = (e: MouseEvent) => {
      // Ignorer si clic droit
      if (e.button !== 0) return;
      isDown.current = true;
      isDragging.current = false;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      slider.style.cursor = 'grabbing';
      slider.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      if (Math.abs(walk) > 4) {
        isDragging.current = true;
      }
      slider.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUpOrLeave = () => {
      isDown.current = false;
      if (slider) {
        slider.style.cursor = 'grab';
        slider.style.userSelect = '';
      }
    };

    // Empêcher l'activation accidentelle du clic sur un onglet si on était en train de glisser
    const handleClickCapture = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = false;
      }
    };

    // --- ÉVÉNEMENTS TACTILES RENFORCÉS (iOS & Android) ---
    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = slider.scrollLeft;
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentX = e.touches[0].pageX;
      const diff = currentX - touchStartX;
      if (Math.abs(diff) > 5) {
        isDragging.current = true;
      }
    };

    slider.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpOrLeave);
    slider.addEventListener('mouseleave', handleMouseUpOrLeave);
    slider.addEventListener('click', handleClickCapture, true);

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
      slider.removeEventListener('mouseleave', handleMouseUpOrLeave);
      slider.removeEventListener('click', handleClickCapture, true);

      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return ref;
}
