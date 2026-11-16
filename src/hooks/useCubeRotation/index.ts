import React, { useCallback, useEffect, useRef, useState } from "react";
import { FACES } from "@/constants/faces";
import { DIRECTIONS, KEY_TO_DIRECTION } from "@/constants/directions";
import {
  Axis,
  IDENTITY,
  Matrix,
  Quaternion,
  TURNS,
  fromQuaternion,
  getActiveFace,
  getContentAngle,
  getTurnToFace,
  isSameMatrix,
  multiply,
  rotation,
  slerp,
  toMatrix3d,
  toQuaternion,
} from "@/utils/orientation";

const TURN_FEEDBACK_MS = 320;
const TURN_DURATION_MS = 850;
const SNAP_DURATION_MS = 450;
const DRAG_THRESHOLD_PX = 6;
const FLICK_THRESHOLD_DEG = 15;
/** Graus de giro por largura do cubo arrastada. */
const DRAG_DEGREES_PER_SIZE = 110;

/** Variável CSS lida pelas faces: `transform: matrix3d(var(...)) ...`. */
export const ORIENTATION_VAR = "--cube-orientation";
export const IDENTITY_MATRIX3D = toMatrix3d(IDENTITY);

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const INITIAL_CONTENT_ANGLES = Object.fromEntries(
  Object.values(FACES).map((face) => [face, 0]),
) as Record<FACES, number>;

interface DragState {
  pointerId: number;
  pointerType: string;
  size: number;
  startX: number;
  startY: number;
  axis: Axis | null;
  angle: number;
  base: Matrix;
}

interface Animation {
  frame: number;
}

const useCubeRotation = () => {
  const [orientation, setOrientation] = useState<Matrix>(IDENTITY);
  const [contentAngles, setContentAngles] = useState(INITIAL_CONTENT_ANGLES);
  const [isTurning, setIsTurning] = useState(false);

  const cubeRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<Matrix>(IDENTITY);
  /** Orientação exibida neste instante (pode estar no meio de um giro). */
  const shownRef = useRef<Quaternion>(toQuaternion(IDENTITY));
  const animationRef = useRef<Animation | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const turnTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const paint = useCallback((matrix: Matrix) => {
    cubeRef.current?.style.setProperty(ORIENTATION_VAR, toMatrix3d(matrix));
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current.frame);
    animationRef.current = null;
  }, []);

  /** Anima da orientação exibida até o alvo, pelo menor caminho. */
  const animateTo = useCallback(
    (target: Matrix, { snap = false } = {}) => {
      const isRetarget = animationRef.current !== null;
      stopAnimation();

      const from = shownRef.current;
      const to = toQuaternion(target);
      const duration = prefersReducedMotion()
        ? 0
        : snap
          ? SNAP_DURATION_MS
          : TURN_DURATION_MS;
      // Ao mudar de alvo no meio de um giro, desacelera em vez de recomeçar
      // devagar, para o movimento não "engasgar".
      const ease = snap || isRetarget ? easeOutCubic : easeInOutQuart;
      let start: number | null = null;

      const step = (now: number) => {
        start ??= now;
        const progress = duration ? Math.min((now - start) / duration, 1) : 1;

        if (progress < 1) {
          shownRef.current = slerp(from, to, ease(progress));
          paint(fromQuaternion(shownRef.current));
          animationRef.current = { frame: requestAnimationFrame(step) };
          return;
        }

        shownRef.current = to;
        paint(target);
        animationRef.current = null;
      };

      animationRef.current = { frame: requestAnimationFrame(step) };
    },
    [paint, stopAnimation],
  );

  /** Prepara o conteúdo das faces que vão aparecer para chegarem "em pé". */
  const straightenFaces = useCallback((targets: Matrix[]) => {
    setContentAngles((current) => {
      const next = { ...current };
      targets.forEach((target) => {
        const face = getActiveFace(target);
        next[face] = getContentAngle(face, target);
      });
      return next;
    });
  }, []);

  const rotateTo = useCallback(
    (target: Matrix, options?: { snap?: boolean }) => {
      if (!isSameMatrix(target, orientationRef.current)) {
        straightenFaces([target]);
        orientationRef.current = target;
        setOrientation(target);
        setIsTurning(true);
        clearTimeout(turnTimeoutRef.current);
        turnTimeoutRef.current = setTimeout(
          () => setIsTurning(false),
          TURN_FEEDBACK_MS,
        );
      }
      animateTo(target, options);
    },
    [animateTo, straightenFaces],
  );

  const turn = useCallback(
    (direction: DIRECTIONS) =>
      rotateTo(multiply(TURNS[direction], orientationRef.current)),
    [rotateTo],
  );

  const goTo = useCallback(
    (face: FACES) => {
      const turnToFace = getTurnToFace(face, orientationRef.current);
      if (turnToFace) rotateTo(multiply(turnToFace, orientationRef.current));
    },
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

  useEffect(
    () => () => {
      clearTimeout(turnTimeoutRef.current);
      stopAnimation();
    },
    [stopAnimation],
  );

  /*
   * Arraste: o eixo é decidido pela direção dominante do movimento. Em touch,
   * o arraste vertical fica com a rolagem do conteúdo (touch-action: pan-y).
   * Durante o arraste a orientação é aplicada direto no DOM, sem re-render.
   */
  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      size: Math.max(event.currentTarget.getBoundingClientRect().width, 1),
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
      angle: 0,
      base: orientationRef.current,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.axis) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD_PX) {
        return;
      }

      const axis: Axis = Math.abs(deltaX) >= Math.abs(deltaY) ? "y" : "x";
      if (axis === "x" && drag.pointerType === "touch") {
        dragRef.current = null;
        return;
      }

      drag.axis = axis;
      drag.base = orientationRef.current;
      stopAnimation();
      straightenFaces([
        multiply(rotation(axis, 90), drag.base),
        multiply(rotation(axis, -90), drag.base),
      ]);
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
      window.getSelection()?.removeAllRanges();
    }

    // Arrastar para baixo revela a face de cima (giro negativo em X).
    const delta = drag.axis === "y" ? deltaX : -deltaY;
    drag.angle = Math.max(
      -90,
      Math.min(90, (delta / drag.size) * DRAG_DEGREES_PER_SIZE),
    );

    const live = multiply(rotation(drag.axis, drag.angle), drag.base);
    shownRef.current = toQuaternion(live);
    paint(live);
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.axis) return;

    delete event.currentTarget.dataset.dragging;
    suppressClickRef.current = true;
    setTimeout(() => (suppressClickRef.current = false), 0);

    let steps = Math.round(drag.angle / 90);
    if (steps === 0 && Math.abs(drag.angle) > FLICK_THRESHOLD_DEG) {
      steps = Math.sign(drag.angle);
    }

    rotateTo(multiply(rotation(drag.axis, steps * 90), drag.base), {
      snap: true,
    });
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    orientation,
    activeFace: getActiveFace(orientation),
    contentAngles,
    isTurning,
    turn,
    goTo,
    cubeRef,
    /**
     * Estilo inicial do cubo. É constante de propósito: depois da montagem a
     * orientação é pintada direto no DOM a cada quadro, e o React não pode
     * sobrescrevê-la ao re-renderizar.
     */
    cubeStyle: { [ORIENTATION_VAR]: IDENTITY_MATRIX3D } as React.CSSProperties,
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
