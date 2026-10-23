import { useEffect } from 'react';
import { soundFx } from '../utils/audio';

export const useSpacebarInteraction = (onTrigger: () => void, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        soundFx.playPing();
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger, enabled]);
};
