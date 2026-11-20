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
import { ORIENTATION_VAR } from "@/constants/cube";
import { IDENTITY_MATRIX3D, TURNS, toMatrix3d } from "@/utils/orientation";

import useCubeRotation from ".";

const SIZE = 500;

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

  it("starts on the front face with the content upright", () => {
    const { result } = renderHook(() => useCubeRotation());

    expect(result.current.activeFace).toBe(FACES.FRONT);
    expect(result.current.contentAngles[FACES.FRONT]).toBe(0);
    expect(result.current.isTurning).toBe(false);
  });

  it("flags the turn in progress and clears it after the feedback", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.turn(DIRECTIONS.RIGHT));
    expect(result.current.activeFace).toBe(FACES.RIGHT);
    expect(result.current.isTurning).toBe(true);

    act(() => jest.runAllTimers());
    expect(result.current.isTurning).toBe(false);
  });

  it("does not turn when the face is already in front", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.goTo(FACES.FRONT));
    expect(result.current.isTurning).toBe(false);
  });

  it("turns in every direction, even after leaving the ring", () => {
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

  it("straightens the content of the incoming face", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.goTo(FACES.RIGHT));
    act(() => result.current.turn(DIRECTIONS.UP));

    expect(result.current.activeFace).toBe(FACES.TOP);
    expect(result.current.contentAngles[FACES.TOP]).toBe(270);
  });

  it("navigates to any face from any position", () => {
    const { result } = renderHook(() => useCubeRotation());

    act(() => result.current.turn(DIRECTIONS.DOWN));
    act(() => result.current.turn(DIRECTIONS.LEFT));

    Object.values(FACES).forEach((face) => {
      act(() => result.current.goTo(face));
      expect(result.current.activeFace).toBe(face);
    });
  });

  it("responds to the keyboard arrows", () => {
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

  it("ignores the keyboard with modifiers or inside text fields", () => {
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

describe("useCubeRotation · cube in the DOM", () => {
  const onChildClick = jest.fn();

  const scroll = { top: 0 };

  const Harness = ({ scrollable = false }: { scrollable?: boolean }) => {
    const { activeFace, cubeRef, cubeStyle, dragHandlers, turn } =
      useCubeRotation();

    return (
      <div data-testid="container" {...dragHandlers}>
        <div data-testid="cube" ref={cubeRef} style={cubeStyle}>
          <section id="inicio">
            <div
              data-face-scroll=""
              data-testid="scroller"
              ref={(element) => {
                if (!element) return;
                Object.defineProperty(element, "scrollHeight", {
                  configurable: true,
                  value: scrollable ? 900 : 300,
                });
                Object.defineProperty(element, "clientHeight", {
                  configurable: true,
                  value: 300,
                });
                Object.defineProperty(element, "scrollTop", {
                  configurable: true,
                  get: () => scroll.top,
                  set: (value: number) => {
                    scroll.top = Math.max(0, Math.min(value, 600));
                  },
                });
              }}
            />
          </section>
        </div>
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

  const flick = (fromX: number, toX: number, durationMs: number) => {
    const container = screen.getByTestId("container");
    fireEvent.pointerDown(container, { button: 0, clientX: fromX, clientY: 0 });
    const steps = 4;
    for (let index = 1; index <= steps; index++) {
      act(() => jest.advanceTimersByTime(durationMs / steps));
      fireEvent.pointerMove(container, {
        clientX: fromX + ((toX - fromX) * index) / steps,
        clientY: 0,
      });
    }
    fireEvent.pointerUp(container, { clientX: toX, clientY: 0 });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    onChildClick.mockClear();
    scroll.top = 0;
    // jsdom has no layout, so the cube width is mocked.
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ width: SIZE, height: SIZE } as DOMRect);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("animates the orientation to the exact target", () => {
    render(<Harness />);
    expect(orientationOf()).toBe(IDENTITY_MATRIX3D);

    fireEvent.click(screen.getByText("girar"));
    act(() => jest.advanceTimersByTime(400));
    const midway = orientationOf();
    expect(midway).not.toBe(IDENTITY_MATRIX3D);

    act(() => jest.advanceTimersByTime(1000));
    expect(orientationOf()).toBe(toMatrix3d(TURNS[DIRECTIONS.RIGHT]));
  });

  it("changes face when dragged past halfway", () => {
    render(<Harness />);

    drag([400, 0], [100, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("changes face with a short, quick flick", () => {
    render(<Harness />);

    drag([100, 0], [180, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.LEFT);
  });

  it("snaps back to the same face on small drags", () => {
    render(<Harness />);

    drag([100, 0], [115, 0]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);

    act(() => jest.runAllTimers());
    expect(orientationOf()).toBe(IDENTITY_MATRIX3D);
  });

  it("turns vertically when dragging with the mouse", () => {
    render(<Harness />);

    drag([0, 100], [0, 400]);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.TOP);
  });

  it("scrolls the face content with touch while it can still scroll", () => {
    render(<Harness scrollable />);

    drag([0, 400], [0, 100], "touch");
    expect(scroll.top).toBe(300);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });

  it("turns vertically with touch once the content is at the edge", () => {
    render(<Harness scrollable />);

    drag([0, 100], [0, 400], "touch");
    expect(scroll.top).toBe(0);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.TOP);
  });

  it("turns vertically with touch when the face has nothing to scroll", () => {
    render(<Harness />);

    drag([0, 400], [0, 100], "touch");
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.BOTTOM);
  });

  it("keeps scrolling with momentum after a fast touch swipe", () => {
    render(<Harness scrollable />);
    const container = screen.getByTestId("container");

    fireEvent.pointerDown(container, {
      button: 0,
      clientX: 0,
      clientY: 400,
      pointerType: "touch",
    });
    for (let index = 1; index <= 4; index++) {
      act(() => jest.advanceTimersByTime(10));
      fireEvent.pointerMove(container, {
        clientX: 0,
        clientY: 400 - index * 20,
        pointerType: "touch",
      });
    }
    fireEvent.pointerUp(container, { clientY: 320, pointerType: "touch" });
    const released = scroll.top;

    act(() => jest.advanceTimersByTime(500));
    expect(scroll.top).toBeGreaterThan(released);
  });

  it("turns horizontally with touch", () => {
    render(<Harness scrollable />);

    drag([400, 0], [100, 0], "touch");
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("goes back to the same face when the browser cancels the gesture", () => {
    render(<Harness />);
    const container = screen.getByTestId("container");

    fireEvent.pointerDown(container, { button: 0, clientX: 400, clientY: 0 });
    fireEvent.pointerMove(container, { clientX: 100, clientY: 0 });
    fireEvent.pointerCancel(container, { clientX: 100, clientY: 0 });

    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
    act(() => jest.runAllTimers());
    expect(orientationOf()).toBe(IDENTITY_MATRIX3D);
  });

  it("changes face with a fast, short swipe", () => {
    render(<Harness />);

    flick(200, 170, 40);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("does not change face with a slow, short drag", () => {
    render(<Harness />);

    flick(200, 170, 800);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });

  it("turns horizontally after reaching the top", () => {
    render(<Harness />);

    drag([0, 100], [0, 400]);
    act(() => jest.runAllTimers());
    drag([400, 0], [100, 0]);

    expect(screen.getByTestId("face")).toHaveTextContent(FACES.RIGHT);
  });

  it("does not mistake a drag for a click on face elements", () => {
    render(<Harness />);

    drag([400, 0], [100, 0]);
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).not.toHaveBeenCalled();

    act(() => jest.runAllTimers());
    fireEvent.click(screen.getByText("link"));
    expect(onChildClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the click when the pointer barely moves", () => {
    render(<Harness />);
    const button = screen.getByText("link");

    fireEvent.pointerDown(button, { button: 0, clientX: 100, clientY: 0 });
    fireEvent.pointerUp(button, { clientX: 102, clientY: 0 });
    fireEvent.click(button);

    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("face")).toHaveTextContent(FACES.FRONT);
  });
});
