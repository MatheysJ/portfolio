import {
  canScrollTowards,
  getDragAngle,
  getDragAxis,
  getSnapSteps,
  getVelocity,
} from "./useCubeDrag";

describe("drag rules", () => {
  it("picks the axis from the dominant direction", () => {
    expect(getDragAxis(40, 10)).toBe("y");
    expect(getDragAxis(-10, 40)).toBe("x");
  });

  it("limits the angle to one face in each direction", () => {
    expect(getDragAngle("y", 10_000, 0, 500)).toBe(90);
    expect(getDragAngle("y", -10_000, 0, 500)).toBe(-90);
  });

  it("dragging down turns negative on X (reveals the top face)", () => {
    expect(getDragAngle("x", 0, 100, 500)).toBeLessThan(0);
  });

  it("snaps to the nearest turn, but a short flick already changes face", () => {
    expect(getSnapSteps(5)).toBe(0);
    expect(getSnapSteps(20)).toBe(1);
    expect(getSnapSteps(-20)).toBe(-1);
    expect(getSnapSteps(80)).toBe(1);
  });

  it("a fast flick changes face even after a tiny drag", () => {
    expect(getSnapSteps(3, 0.6)).toBe(1);
    expect(getSnapSteps(-3, -0.6)).toBe(-1);
  });

  it("a fast flick back cancels a long drag", () => {
    expect(getSnapSteps(70, -0.6)).toBe(0);
  });

  it("ignores slow releases when picking the flick direction", () => {
    expect(getSnapSteps(5, 0.1)).toBe(0);
  });

  it("measures velocity over the end of the gesture", () => {
    const samples = [
      { x: 0, y: 0, time: 0 },
      { x: 30, y: 0, time: 40 },
      { x: 60, y: 0, time: 80 },
    ];
    expect(getVelocity(samples, 80).x).toBeCloseTo(0.75);
  });

  it("drops velocity to zero when the pointer rests before release", () => {
    const samples = [
      { x: 0, y: 0, time: 0 },
      { x: 60, y: 0, time: 80 },
    ];
    expect(getVelocity(samples, 400)).toEqual({ x: 0, y: 0 });
  });

  it("ignores bursts too short to measure", () => {
    const samples = [
      { x: 0, y: 0, time: 0 },
      { x: 60, y: 0, time: 1 },
    ];
    expect(getVelocity(samples, 1)).toEqual({ x: 0, y: 0 });
  });

  it("knows when vertical content can still scroll in each direction", () => {
    const element = {
      scrollHeight: 900,
      clientHeight: 300,
      scrollTop: 0,
    } as HTMLElement;

    expect(canScrollTowards(element, -50)).toBe(true);
    expect(canScrollTowards(element, 50)).toBe(false);

    Object.assign(element, { scrollTop: 600 });
    expect(canScrollTowards(element, -50)).toBe(false);
    expect(canScrollTowards(element, 50)).toBe(true);
  });

  it("never scrolls content that fits", () => {
    const element = {
      scrollHeight: 300,
      clientHeight: 300,
      scrollTop: 0,
    } as HTMLElement;
    expect(canScrollTowards(element, -50)).toBe(false);
  });
});
