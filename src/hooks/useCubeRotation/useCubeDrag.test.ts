import { getDragAngle, getDragAxis, getSnapSteps } from "./useCubeDrag";

describe("regras do arraste", () => {
  it("escolhe o eixo pela direção dominante", () => {
    expect(getDragAxis(40, 10)).toBe("y");
    expect(getDragAxis(-10, 40)).toBe("x");
  });

  it("limita o ângulo a uma face para cada lado", () => {
    expect(getDragAngle("y", 10_000, 0, 500)).toBe(90);
    expect(getDragAngle("y", -10_000, 0, 500)).toBe(-90);
  });

  it("arrastar para baixo gira negativo em X (revela a face de cima)", () => {
    expect(getDragAngle("x", 0, 100, 500)).toBeLessThan(0);
  });

  it("encaixa no giro mais próximo, mas um arraste curto já troca de face", () => {
    expect(getSnapSteps(5)).toBe(0);
    expect(getSnapSteps(20)).toBe(1);
    expect(getSnapSteps(-20)).toBe(-1);
    expect(getSnapSteps(80)).toBe(1);
  });
});
