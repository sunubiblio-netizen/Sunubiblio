import { useEffect } from 'react';

/**
 * Hook pour verrouiller totalement le défilement de l'arrière-plan sur desktop et mobile (touch).
 * Empêche le rebond tactile (rubber-banding / scroll chaining) sur iOS Safari et Chrome Mobile
 * en fixant le body tout en conservant la position exacte de lecture.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Figer l'arrière-plan
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
    document.body.classList.add('modal-scroll-locked');
    document.documentElement.classList.add('modal-scroll-locked');

    return () => {
      // Restaurer les styles et la position de défilement exacte
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.touchAction = originalBodyTouchAction;
      document.body.classList.remove('modal-scroll-locked');
      document.documentElement.classList.remove('modal-scroll-locked');

      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
