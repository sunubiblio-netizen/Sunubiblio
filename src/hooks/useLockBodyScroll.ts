import { useEffect } from 'react';

/**
 * Hook pour verrouiller totalement le défilement de l'arrière-plan sur desktop et mobile (touch).
 * Empêche le rebond tactile (rubber-banding / scroll chaining) sur iOS Safari et Chrome Mobile
 * en fixant le body tout en conservant la position exacte de lecture.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow === 'hidden' ? '' : originalOverflow;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('modal-scroll-locked');
      document.documentElement.classList.remove('modal-scroll-locked');
    };
  }, [isLocked]);
}
