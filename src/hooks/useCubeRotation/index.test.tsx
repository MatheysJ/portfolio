import React from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";
import { TURNS, toMatrix3d } from "@/utils/orientation";

import useCubeRotation, { IDENTITY_MATRIX3D, ORIENTATION_VAR } from ".";

const SIZE = 500;

// jsdom não implementa PointerEvent nem pointer capture.
class PointerEventPolyfill extends MouseEvent {
  pointerId: number;
  pointerType: string;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.pointerType = init.pointerType ?? "mouse";
  }
}

beforeAll(() => {
  window.PointerEvent ??= PointerEventPolyfill as typeof PointerEvent;
  Element.prototype.setPointerCapture ??= jest.fn();
});

describe("useCubeRotation", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("começa na face frontal, com o conteúdo em pé", () => {
    const { result } = renderHook(() => useCubeRotation());

    expect(result.current.activeFace).toBe(FACES.FRONT);
    expect(result.current.contentAngles[FACES.FRONT]).toBe(0);
    expect(result.current.isTurning).toBe(false);
  });

  it("marca o giro em andamento e libera após o feedback", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.turn(DIRECTIONS.RIGHT));
    expect(result.current.activeFace).toBe(FACES.RIGHT);
    expect(result.current.isTurning).toBe(true);

    act(() => jest.runAllTimers());
    expect(result.current.isTurning).toBe(false);
  });

  it("não dispara giro quando a face já está de frente", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.goTo(FACES.FRONT));
    expect(result.current.isTurning).toBe(false);
  });

  it("gira em todas as direções, inclusive depois de sair do anel", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.turn(DIRECTIONS.UP));
    expect(result.current.activeFace).toBe(FACES.TOP);

    act(() => result.current.turn(DIRECTIONS.UP));
    expect(result.current.activeFace).toBe(FACES.BACK);

    act(() => result.current.turn(DIRECTIONS.RIGHT));
    act(() => result.current.turn(DIRECTIONS.RIGHT));
    act(() => result.current.turn(DIRECTIONS.RIGHT));
    act(() => result.current.turn(DIRECTIONS.RIGHT));
    expect(result.current.activeFace).toBe(FACES.BACK);
  });

  it("endireita o conteúdo da face que chega", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.goTo(FACES.RIGHT));
    act(() => result.current.turn(DIRECTIONS.UP));

    expect(result.current.activeFace).toBe(FACES.TOP);
    expect(result.current.contentAngles[FACES.TOP]).toBe(270);
  });

  it("navega até qualquer face, de qualquer posição", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.turn(DIRECTIONS.DOWN));
    act(() => result.current.turn(DIRECTIONS.LEFT));

    Object.values(FACES).forEach((face) => {
      act(() => result.current.goTo(face));
      expect(result.current.activeFace).toBe(face);
    });
  });

  it("responde às setas do teclado", () => {
    const { result } = renderHook(() => useCubeRotation());

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
    const { result } = renderHook(() => useCubeRotation());
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

describe("useCubeRotation · cubo no DOM", () => {
  const onChildClick = jest.fn();

  const Harness = () => {
    const { activeFace, cubeRef, cubeStyle, dragHandlers, turn } =
      useCubeRotation();

    return (
      <div data-testid="container" {...dragHandlers}>
        <div data-testid="cube" ref={cubeRef} style={cubeStyle} />
        <button onClick={onChildClick}>link</button>
        <button onClick={() => turn(DIRECTIONS.RIGHT)}>girar</button>
        <span data-testid="face">{activeFace}</span>
      </div>
    );
  };

  const orientationOf = () =>
    screen.getByTestId("cube").style.getPropertyValue(ORIENTATION_VAR);

  const drag = (
    from: [number, number],
    to: [number, number],
    pointerType = "mouse",
  ) => {
    const container = screen.getByTestId("container");
    const [x1, y1] = from;
    const [x2, y2] = to;
    fireEvent.pointerDown(container, {
      button: 0,
      clientX: x1,
      clientY: y1,
      pointerType,
    });
    fireEvent.pointerMove(container, {
      clientX: (x1 + x2) / 2,
      clientY: (y1 + y2) / 2,
      pointerType,
    });
    fireEvent.pointerMove(container, { clientX: x2, clientY: y2, pointerType });
    fireEvent.pointerUp(container, { clientX: x2, clientY: y2, pointerType });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    onChildClick.mockClear();
    // jsdom não calcula layout: simula o cubo com SIZE px de largura.
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ width: SIZE, height: SIZE } as DOMRect);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("anima a orientação até o alvo exato", () => {
    render(<Harness />);
    expect(orientationOf()).toBe(IDENTITY_MATRIX3D);

    fireEvent.click(screen.getByText("girar"));
    act(() => jest.advanceTimersByTime(400));
    const midway = orientationOf();
    expect(midway).not.toBe(IDENTITY_MATRIX3D);

    act(() => jest.advanceTimersByTime(1000));
    expect(orientationOf()).toBe(toMatrix3d(TURNS[DIRECTIONS.RIGHT]));
  });

  it("troca de face ao arrastar mais da metade", () => {
    render(<Harness />);

    drag([400, 0], [100, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("troca de face com um arraste curto e decidido", () => {
    render(<Harness />);

    drag([100, 0], [180, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.LEFT);
  });

  it("volta para a mesma face em arrastes pequenos", () => {
    render(<Harness />);

    drag([100, 0], [115, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);

    act(() => jest.runAllTimers());
    expect(orientationOf()).toBe(IDENTITY_MATRIX3D);
  });

  it("gira na vertical ao arrastar com o mouse", () => {
    render(<Harness />);

    drag([0, 100], [0, 400]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.TOP);
  });

  it("deixa o arraste vertical do touch para a rolagem do conteúdo", () => {
    render(<Harness />);

    drag([0, 100], [0, 400], "touch");
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });

  it("gira na horizontal depois de chegar ao topo", () => {
    render(<Harness />);

    drag([0, 100], [0, 400]);
    act(() => jest.runAllTimers());
    drag([400, 0], [100, 0]);

    // No topo, a face à direita na tela continua sendo a RIGHT.
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("não confunde arraste com clique nos elementos da face", () => {
    render(<Harness />);

    drag([400, 0], [100, 0]);
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).not.toHaveBeenCalled();

    act(() => jest.runAllTimers());
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).toHaveBeenCalledTimes(1);
  });

  it("mantém o clique quando o ponteiro quase não se move", () => {
    render(<Harness />);
    const button = screen.getByText("link");

    fireEvent.pointerDown(button, { button: 0, clientX: 100, clientY: 0 });
    fireEvent.pointerUp(button, { clientX: 102, clientY: 0 });
    fireEvent.click(button);

    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });
});
