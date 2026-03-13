import { Howl } from "howler";

let sounds: Record<string, Howl> | null = null;
let muted = false;

function getSounds() {
  if (!sounds) {
    sounds = {
      correct: new Howl({ src: ["/sounds/correct.mp3"], volume: 0.5 }),
      wrong: new Howl({ src: ["/sounds/wrong.mp3"], volume: 0.4 }),
      gameover: new Howl({ src: ["/sounds/gameover.mp3"], volume: 0.5 }),
      victory: new Howl({ src: ["/sounds/victory.mp3"], volume: 0.5 }),
      tick: new Howl({ src: ["/sounds/tick.mp3"], volume: 0.2 }),
    };
  }
  return sounds;
}

export function playSound(name: "correct" | "wrong" | "gameover" | "victory" | "tick") {
  if (muted) return;
  try {
    getSounds()[name]?.play();
  } catch {
    // Silently fail if sounds not loaded
  }
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}
