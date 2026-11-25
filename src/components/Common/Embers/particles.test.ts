import { DRIFT_VARIANTS, EMBER_COUNT, createEmbers } from "./particles";

describe("createEmbers", () => {
  it("is deterministic so server and client markup match", () => {
    expect(createEmbers()).toEqual(createEmbers());
  });

  it("creates small, slow embers spread across the screen", () => {
    const embers = createEmbers();

    expect(embers).toHaveLength(EMBER_COUNT);
    embers.forEach(({ left, size, duration, delay, drift }) => {
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(100);
      expect(size).toBeGreaterThanOrEqual(2);
      expect(size).toBeLessThanOrEqual(4);
      expect(duration).toBeGreaterThanOrEqual(16);
      expect(duration).toBeLessThanOrEqual(30);
      expect(delay).toBeLessThanOrEqual(0);
      expect(-delay).toBeLessThanOrEqual(duration);
      expect(drift).toBeLessThan(DRIFT_VARIANTS);
    });
  });
});
