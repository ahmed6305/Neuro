// Sound effect URLs - map to files in /public/sounds/
export const sounds = {
  click: "/sounds/click.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  levelUp: "/sounds/level-up.mp3",
  // You can add more as needed
};

// Tone generation fallback if audio files aren't available
export function playTone(frequency: number, duration: number = 100) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    // Audio context not available
  }
}
