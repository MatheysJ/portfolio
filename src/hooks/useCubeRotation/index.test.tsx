import React from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

import useCubeRotation, {
  getActiveFace,
  getCoordinateAfterTurn,
  getCoordinateTo,
  toRotationVars,
} from ".";

const SIZE = 500;

// jsdom não implementa PointerEvent nem pointer capture.
class PointerEventPolyfill extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

beforeAll(() => {
  window.PointerEvent ??= PointerEventPolyfill as typeof PointerEvent;
  Element.prototype.setPointerCapture ??= jest.fn();
});

describe("getActiveFace", () => {
  it.each([
    [{ x: 0, y: 0 }, FACES.FRONT],
    [{ x: -90, y: 0 }, FACES.RIGHT],
    [{ x: 180, y: 0 }, FACES.BACK],
    [{ x: -180, y: 0 }, FACES.BACK],
    [{ x: 90, y: 0 }, FACES.LEFT],
    [{ x: -450, y: 0 }, FACES.RIGHT],
    [{ x: 720, y: 0 }, FACES.FRONT],
    [{ x: 180, y: -90 }, FACES.TOP],
    [{ x: -90, y: 90 }, FACES.BOTTOM],
  ])("%j → %s", (coordinate, face) => {
    expect(getActiveFace(coordinate)).toBe(face);
  });
});

describe("getCoordinateTo", () => {
  it("gira pelo caminho mais curto até uma face do anel", () => {
    expect(getCoordinateTo(FACES.LEFT, { x: 0, y: 0 })).toEqual({ x: 90, y: 0 });
    expect(getCoordinateTo(FACES.RIGHT, { x: 0, y: 0 })).toEqual({
      x: -90,
      y: 0,
    });
    // Após várias voltas, não "desenrola" o cubo: anda só 90°.
    expect(getCoordinateTo(FACES.FRONT, { x: -270, y: 0 })).toEqual({
      x: -360,
      y: 0,
    });
  });

  it("apenas inclina para chegar ao topo ou à base", () => {
    expect(getCoordinateTo(FACES.TOP, { x: -90, y: 0 })).toEqual({
      x: -90,
      y: -90,
    });
    expect(getCoordinateTo(FACES.BOTTOM, { x: 180, y: 0 })).toEqual({
      x: 180,
      y: 90,
    });
  });

  it("volta ao anel a partir do topo", () => {
    expect(getCoordinateTo(FACES.FRONT, { x: -90, y: -90 })).toEqual({
      x: 0,
      y: 0,
    });
  });
});

describe("getCoordinateAfterTurn", () => {
  const ring = { x: 0, y: 0 };
  const top = { x: 0, y: -90 };
  const bottom = { x: 0, y: 90 };

  it("gira 90° na horizontal enquanto está no anel", () => {
    expect(getCoordinateAfterTurn(DIRECTIONS.LEFT, ring)).toEqual({ x: 90, y: 0 });
    expect(getCoordinateAfterTurn(DIRECTIONS.RIGHT, ring)).toEqual({
      x: -90,
      y: 0,
    });
  });

  it("ignora giros horizontais no topo e na base", () => {
    expect(getCoordinateAfterTurn(DIRECTIONS.LEFT, top)).toBe(top);
    expect(getCoordinateAfterTurn(DIRECTIONS.RIGHT, bottom)).toBe(bottom);
  });

  it("navega verticalmente entre anel, topo e base", () => {
    expect(getCoordinateAfterTurn(DIRECTIONS.UP, ring)).toEqual(top);
    expect(getCoordinateAfterTurn(DIRECTIONS.DOWN, ring)).toEqual(bottom);
    expect(getCoordinateAfterTurn(DIRECTIONS.DOWN, top)).toEqual(ring);
    expect(getCoordinateAfterTurn(DIRECTIONS.UP, bottom)).toEqual(ring);
  });

  it("não passa do topo nem da base", () => {
    expect(getCoordinateAfterTurn(DIRECTIONS.UP, top)).toBe(top);
    expect(getCoordinateAfterTurn(DIRECTIONS.DOWN, bottom)).toBe(bottom);
  });
});

describe("useCubeRotation", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("começa na face frontal", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));

    expect(result.current.activeFace).toBe(FACES.FRONT);
    expect(result.current.isTurning).toBe(false);
  });

  it("marca o giro em andamento e libera após o feedback", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));

    act(() => result.current.turn(DIRECTIONS.RIGHT));
    expect(result.current.activeFace).toBe(FACES.RIGHT);
    expect(result.current.isTurning).toBe(true);

    act(() => jest.runAllTimers());
    expect(result.current.isTurning).toBe(false);
  });

  it("não dispara giro quando a posição não muda", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));

    act(() => result.current.goTo(FACES.FRONT));
    expect(result.current.isTurning).toBe(false);
  });

  it("ajusta o conteúdo do topo conforme a face de origem", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));

    act(() => result.current.goTo(FACES.RIGHT));
    act(() => result.current.turn(DIRECTIONS.UP));

    expect(result.current.activeFace).toBe(FACES.TOP);
    expect(result.current.capAngle).toBe(270);
  });

  it("responde às setas do teclado", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft" });
    });
    expect(result.current.activeFace).toBe(FACES.LEFT);

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp" });
    });
    expect(result.current.activeFace).toBe(FACES.TOP);
  });

  it("ignora o teclado com modificadores ou em campos de texto", () => {
    const { result } = renderHook(() => useCubeRotation(SIZE));
    const input = document.createElement("input");
    document.body.appendChild(input);

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight", ctrlKey: true });
      fireEvent.keyDown(input, { key: "ArrowRight" });
    });

    expect(result.current.activeFace).toBe(FACES.FRONT);
    input.remove();
  });
});

describe("useCubeRotation · arraste", () => {
  const onChildClick = jest.fn();

  const DragHarness = () => {
    const { activeFace, cubeRef, dragHandlers } = useCubeRotation(SIZE);

    return (
      <div data-testid="container" {...dragHandlers}>
        <div ref={cubeRef} />
        <button onClick={onChildClick}>link</button>
        <span data-testid="face">{activeFace}</span>
      </div>
    );
  };

  const drag = (fromX: number, toX: number) => {
    const container = screen.getByTestId("container");
    fireEvent.pointerDown(container, { button: 0, clientX: fromX });
    fireEvent.pointerMove(container, { clientX: (fromX + toX) / 2 });
    fireEvent.pointerMove(container, { clientX: toX });
    fireEvent.pointerUp(container, { clientX: toX });
  };

  beforeEach(() => onChildClick.mockClear());

  it("troca de face ao arrastar mais da metade", () => {
    render(<DragHarness />);

    drag(400, 100);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("troca de face com um arraste curto e decidido", () => {
    render(<DragHarness />);

    drag(100, 180);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.LEFT);
  });

  it("volta para a mesma face em arrastes pequenos", () => {
    render(<DragHarness />);

    drag(100, 115);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });

  it("não confunde arraste com clique nos elementos da face", () => {
    jest.useFakeTimers();
    render(<DragHarness />);

    drag(400, 100);
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).not.toHaveBeenCalled();

    act(() => jest.runAllTimers());
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("mantém o clique quando o ponteiro quase não se move", () => {
    render(<DragHarness />);
    const button = screen.getByText("link");

    fireEvent.pointerDown(button, { button: 0, clientX: 100 });
    fireEvent.pointerUp(button, { clientX: 102 });
    fireEvent.click(button);

    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });
});

describe("toRotationVars", () => {
  it("gera as variáveis CSS de rotação a partir da coordenada", () => {
    expect(toRotationVars({ x: -90, y: 45 })).toEqual({
      "--cube-rotate-y": "-90deg",
      "--cube-rotate-x": "45deg",
    });
  });
});
