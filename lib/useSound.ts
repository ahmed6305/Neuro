"use client";

const cache = new Map<string, HTMLAudioElement>();

export function useSound(url: string, volume = 0.7) {
  function play() {
    try {
      let audio = cache.get(url);
      if (!audio) {
        audio = new Audio(url);
        audio.volume = volume;
        cache.set(url, audio);
      }
      // Clone to allow overlapping sounds
      const clone = audio.cloneNode(true) as HTMLAudioElement;
      clone.volume = volume;
      void clone.play().catch(() => {
        // Silently fail if audio can't play (e.g., no permission)
      });
    } catch (e) {
      // Silently fail
    }
  }

  return { play };
}
