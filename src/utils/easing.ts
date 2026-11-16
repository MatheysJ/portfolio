export type Easing = (progress: number) => number;

export const easeInOutQuart: Easing = (t) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

export const easeOutCubic: Easing = (t) => 1 - (1 - t) ** 3;
