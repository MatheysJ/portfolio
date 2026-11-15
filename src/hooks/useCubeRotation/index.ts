import React, { useCallback, useEffect, useRef, useState } from "react";
import { FACES, FACES_DATA, RING_ORDER } from "@/constants/faces";
import { DIRECTIONS, KEY_TO_DIRECTION } from "@/constants/directions";
import { Coordinate } from "@/types";

const TURN_FEEDBACK_MS = 320;
const DRAG_THRESHOLD_PX = 6;
const FLICK_THRESHOLD_DEG = 15;

const mod = (value: number, base: number) => ((value % base) + base) % base;

export const ROTATION_VARS = { x: "--cube-rotate-y", y: "--cube-rotate-x" };

export const toRotationVars = ({ x, y }: Coordinate) => ({
  [ROTATION_VARS.x]: `${x}deg`,
  [ROTATION_VARS.y]: `${y}deg`,
});

const applyRotationVars = (element: HTMLElement, coordinate: Coordinate) =>
  Object.entries(toRotationVars(coordinate)).forEach(([name, value]) =>
    element.style.setProperty(name, value),
  );

export const getActiveFace = ({ x, y }: Coordinate): FACES => {
  if (y < 0) return FACES.TOP;
  if (y > 0) return FACES.BOTTOM;
  return RING_ORDER[mod(Math.round(-x / 90), RING_ORDER.length)];
};

export const getCoordinateTo = (
  face: FACES,
  current: Coordinate,
): Coordinate => {
  const target = FACES_DATA[face].coordinate;

  if (target.y !== 0) return { x: current.x, y: target.y };

  const delta = mod(target.x - current.x + 180, 360) - 180;
  return { x: current.x + delta, y: 0 };
};

export const getCoordinateAfterTurn = (
  direction: DIRECTIONS,
  current: Coordinate,
): Coordinate => {
  const face = getActiveFace(current);
  const isOnRing = current.y === 0;

  switch (direction) {
    case DIRECTIONS.LEFT:
      return { ...current, x: current.x + 90 };
    case DIRECTIONS.RIGHT:
      return { ...current, x: current.x - 90 };
    case DIRECTIONS.UP:
      return { ...current, y: current.y - 90 };
    case DIRECTIONS.DOWN:
      return { ...current, y: current.y + 90 };
  }
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

interface DragState {
  pointerId: number;
  size: number;
  startX: number;
  baseX: number;
  currentX: number;
  isDragging: boolean;
}

const useCubeRotation = () => {
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [isTurning, setIsTurning] = useState(false);
  const [capAngle, setCapAngle] = useState(0);

  const cubeRef = useRef<HTMLDivElement>(null);
  const coordinateRef = useRef(coordinate);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const turnTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  coordinateRef.current = coordinate;

  const rotateTo = useCallback((next: Coordinate) => {
    const current = coordinateRef.current;
    if (next.x === current.x && next.y === current.y) return;

    if (current.y === 0 && next.y !== 0) setCapAngle(mod(current.x, 360));
    coordinateRef.current = next;
    setCoordinate(next);
    setIsTurning(true);
    clearTimeout(turnTimeoutRef.current);
    turnTimeoutRef.current = setTimeout(
      () => setIsTurning(false),
      TURN_FEEDBACK_MS,
    );
  }, []);

  const turn = useCallback(
    (direction: DIRECTIONS) =>
      rotateTo(getCoordinateAfterTurn(direction, coordinateRef.current)),
    [rotateTo],
  );

  const goTo = useCallback(
    (face: FACES) => rotateTo(getCoordinateTo(face, coordinateRef.current)),
    [rotateTo],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      turn(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [turn]);

  useEffect(() => () => clearTimeout(turnTimeoutRef.current), []);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || coordinateRef.current.y !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      size: Math.max(event.currentTarget.getBoundingClientRect().width, 1),
      startX: event.clientX,
      baseX: coordinateRef.current.x,
      currentX: coordinateRef.current.x,
      isDragging: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const cube = cubeRef.current;
    if (!drag || !cube || drag.pointerId !== event.pointerId) return;

    const deltaPx = event.clientX - drag.startX;

    if (!drag.isDragging) {
      if (Math.abs(deltaPx) < DRAG_THRESHOLD_PX) return;

      drag.isDragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
      window.getSelection()?.removeAllRanges();
      cube.dataset.dragging = "true";
    }

    drag.currentX = drag.baseX + (deltaPx / drag.size) * 110;
    applyRotationVars(cube, { x: drag.currentX, y: 0 });
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.isDragging) return;

    delete event.currentTarget.dataset.dragging;
    suppressClickRef.current = true;
    setTimeout(() => (suppressClickRef.current = false), 0);

    const delta = drag.currentX - drag.baseX;
    let steps = Math.round(delta / 90);
    if (steps === 0 && Math.abs(delta) > FLICK_THRESHOLD_DEG) {
      steps = Math.sign(delta);
    }
    const target = { x: drag.baseX + steps * 90, y: 0 };

    const cube = cubeRef.current;
    if (cube) {
      delete cube.dataset.dragging;
      applyRotationVars(cube, target);
    }
    rotateTo(target);
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    coordinate,
    activeFace: getActiveFace(coordinate),
    capAngle,
    isTurning,
    turn,
    goTo,
    cubeRef,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture,
    },
  };
};

export type CubeRotation = ReturnType<typeof useCubeRotation>;

export default useCubeRotation;
