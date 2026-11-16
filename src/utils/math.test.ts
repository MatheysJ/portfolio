import { clamp, mod } from "./math";

describe("utils/math", () => {
  it("mod devolve sempre um resto positivo", () => {
    expect(mod(-90, 360)).toBe(270);
    expect(mod(450, 360)).toBe(90);
    expect(mod(0, 360)).toBe(0);
  });

  it("clamp limita ao intervalo", () => {
    expect(clamp(120, -90, 90)).toBe(90);
    expect(clamp(-120, -90, 90)).toBe(-90);
    expect(clamp(30, -90, 90)).toBe(30);
  });
});
