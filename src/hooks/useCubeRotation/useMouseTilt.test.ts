import { TILT_MAX_DEG } from "@/constants/motion";
import { IDENTITY, transform } from "@/utils/orientation";

import { approachTilt, getTiltAngles, getTiltMatrix } from "./useMouseTilt";

const WIDTH = 1000;
const HEIGHT = 800;

describe("mouse tilt rules", () => {
  it("rests when the mouse is at the center of the page", () => {
    expect(getTiltAngles(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT)).toEqual({
      x: 0,
      y: 0,
    });
    expect(getTiltMatrix({ x: 0, y: 0 })).toEqual(IDENTITY);
  });

  it("reaches the maximum tilt at the edges and never goes past it", () => {
    expect(getTiltAngles(WIDTH, 0, WIDTH, HEIGHT)).toEqual({
      x: TILT_MAX_DEG,
      y: TILT_MAX_DEG,
    });
    expect(getTiltAngles(-500, HEIGHT * 3, WIDTH, HEIGHT)).toEqual({
      x: -TILT_MAX_DEG,
      y: -TILT_MAX_DEG,
    });
  });

  it("turns the front face toward the mouse", () => {
    const [x, y] = transform(
      getTiltMatrix(getTiltAngles(WIDTH, 0, WIDTH, HEIGHT)),
      [0, 0, 1],
    );

    expect(x).toBeGreaterThan(0);
    expect(y).toBeLessThan(0);
  });

  it("eases toward the target and settles exactly on it", () => {
    const target = { x: 2, y: -2 };
    const halfway = approachTilt({ x: 0, y: 0 }, target, 16);

    expect(halfway.x).toBeGreaterThan(0);
    expect(halfway.x).toBeLessThan(target.x);
    expect(halfway.y).toBeLessThan(0);
    expect(halfway.y).toBeGreaterThan(target.y);
    expect(approachTilt(halfway, target, 5000)).toBe(target);
  });
});
