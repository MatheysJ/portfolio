export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const mod = (value: number, base: number) =>
  ((value % base) + base) % base;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
