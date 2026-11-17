import { getDragAngle, getDragAxis, getSnapSteps } from "./useCubeDrag";

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
});
