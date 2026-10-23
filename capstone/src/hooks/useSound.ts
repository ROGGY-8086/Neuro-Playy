import { useState, useEffect, useCallback } from 'react';
import { soundFx } from '../utils/audio';

const STORAGE_KEY = 'capstone_sound_enabled';

export function useSound(initialDefault = true) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // ignore
    }
    return initialDefault;
  });

  useEffect(() => {
    soundFx.enabled = soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEY, String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      soundFx.playSuccessChime();
    }
  }, [soundEnabled]);

  const playNotice = useCallback(() => {
    if (soundEnabled) {
      soundFx.playSoftNoticeTone();
    }
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (soundEnabled) {
      soundFx.playClick();
    }
  }, [soundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playSuccess,
    playNotice,
    playClick,
  };
}
