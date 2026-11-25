export const EMBER_COUNT = 28;
export const DRIFT_VARIANTS = 3;

export interface Ember {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

// Deterministic (seeded) so server and client render the same markup.
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

export const createEmbers = (count = EMBER_COUNT, seed = 7): Ember[] => {
  const random = seeded(seed);

  return Array.from({ length: count }, (_, index) => {
    const duration = 16 + random() * 14;
    return {
      left: +(random() * 100).toFixed(2),
      size: 2 + Math.floor(random() * 3),
      duration: +duration.toFixed(1),
      // Negative delays start each ember mid-flight, so the screen is never empty.
      delay: -+(random() * duration).toFixed(1),
      drift: index % DRIFT_VARIANTS,
    };
  });
};
