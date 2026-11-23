import React, { useEffect, useRef } from "react";
import {
  DRAG_DEGREES_PER_SIZE,
  DRAG_THRESHOLD_PX,
  FLICK_THRESHOLD_DEG,
  FLICK_VELOCITY_PX_MS,
  MOMENTUM_FRICTION_PER_FRAME,
  MOMENTUM_MIN_VELOCITY_PX_MS,
  VELOCITY_MIN_SPAN_MS,
  VELOCITY_WINDOW_MS,
} from "@/constants/motion";
import { Axis } from "@/types";
import { clamp } from "@/utils/math";
import { Matrix, multiply, rotation } from "@/utils/orientation";

interface Sample {
  x: number;
  y: number;
  time: number;
}

type DragMode = "rotate" | "scroll";

interface DragState {
  pointerId: number;
  pointerType: string;
  size: number;
  startX: number;
  startY: number;
  samples: Sample[];
  mode: DragMode | null;
  axis: Axis;
  angle: number;
  base: Matrix;
  scroller: HTMLElement | null;
  startScrollTop: number;
}

export interface CubeDragCallbacks {
  getOrientation: () => Matrix;
  /** Scrollable content area of the active face, if any. */
  getScroller: () => HTMLElement | null;
  onStart: (axis: Axis, base: Matrix) => void;
  onMove: (live: Matrix) => void;
  onRelease: (target: Matrix) => void;
}

export const getDragAxis = (deltaX: number, deltaY: number): Axis =>
  Math.abs(deltaX) >= Math.abs(deltaY) ? "y" : "x";

// Same sign convention for angles and velocities: dragging down reveals the top face.
const alongAxis = (axis: Axis, x: number, y: number) =>
  axis === "y" ? x : -y;

export const getDragAngle = (
  axis: Axis,
  deltaX: number,
  deltaY: number,
  size: number,
) =>
  clamp(
    (alongAxis(axis, deltaX, deltaY) / size) * DRAG_DEGREES_PER_SIZE,
    -90,
    90,
  );

/** Turns to apply on release; a fast flick wins over the dragged distance. */
export const getSnapSteps = (angle: number, velocity = 0) => {
  if (Math.abs(velocity) >= FLICK_VELOCITY_PX_MS) {
    const isFlickBack = angle !== 0 && Math.sign(velocity) !== Math.sign(angle);
    return isFlickBack ? 0 : Math.sign(velocity);
  }

  const steps = Math.round(angle / 90);
  if (steps === 0 && Math.abs(angle) > FLICK_THRESHOLD_DEG) {
    return Math.sign(angle);
  }
  return steps;
};

/**
 * Whether a vertical finger movement can still scroll the content.
 * Finger moving up (deltaY < 0) scrolls towards the end.
 */
export const canScrollTowards = (element: HTMLElement, deltaY: number) => {
  const maxScroll = element.scrollHeight - element.clientHeight;
  if (maxScroll <= 1) return false;
  return deltaY < 0
    ? element.scrollTop < maxScroll - 1
    : element.scrollTop > 1;
};

const now = () => performance.now();

const trackSample = (samples: Sample[], x: number, y: number) => {
  const time = now();
  samples.push({ x, y, time });
  while (samples.length > 2 && time - samples[0].time > VELOCITY_WINDOW_MS) {
    samples.shift();
  }
};

/**
 * Release velocity (px/ms) over the last moments of the gesture. A time window
 * avoids spikes from coalesced events and drops to zero once the finger rests.
 */
export const getVelocity = (samples: Sample[], at = now()) => {
  const recent = samples.filter(({ time }) => at - time <= VELOCITY_WINDOW_MS);
  if (recent.length < 2) return { x: 0, y: 0 };

  const first = recent[0];
  const last = recent[recent.length - 1];
  const span = last.time - first.time;
  if (span < VELOCITY_MIN_SPAN_MS) return { x: 0, y: 0 };

  return { x: (last.x - first.x) / span, y: (last.y - first.y) / span };
};

/*
 * Touch gestures are fully handled here (the cube uses touch-action: none):
 * a vertical swipe scrolls the face while its content can still scroll in
 * that direction and turns the cube once it is at the edge, like nested
 * scrolling on mobile.
 */
const useCubeDrag = ({
  getOrientation,
  getScroller,
  onStart,
  onMove,
  onRelease,
}: CubeDragCallbacks) => {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const momentumFrameRef = useRef<number | null>(null);

  const stopMomentum = () => {
    if (momentumFrameRef.current !== null) {
      cancelAnimationFrame(momentumFrameRef.current);
    }
    momentumFrameRef.current = null;
  };

  useEffect(() => stopMomentum, []);

  const startMomentum = (scroller: HTMLElement, velocityY: number) => {
    let velocity = -velocityY;
    let last: number | null = null;

    const step = (time: number) => {
      const elapsed = last === null ? 16 : time - last;
      last = time;
      scroller.scrollTop += velocity * elapsed;
      velocity *= MOMENTUM_FRICTION_PER_FRAME ** (elapsed / 16);

      const atEdge = !canScrollTowards(scroller, -velocity);
      if (Math.abs(velocity) < MOMENTUM_MIN_VELOCITY_PX_MS || atEdge) {
        momentumFrameRef.current = null;
        return;
      }
      momentumFrameRef.current = requestAnimationFrame(step);
    };

    momentumFrameRef.current = requestAnimationFrame(step);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    stopMomentum();

    dragRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      size: Math.max(event.currentTarget.getBoundingClientRect().width, 1),
      startX: event.clientX,
      startY: event.clientY,
      samples: [{ x: event.clientX, y: event.clientY, time: now() }],
      mode: null,
      axis: "y",
      angle: 0,
      base: getOrientation(),
      scroller: null,
      startScrollTop: 0,
    };
  };

  const begin = (
    drag: DragState,
    event: React.PointerEvent<HTMLElement>,
    deltaX: number,
    deltaY: number,
  ) => {
    drag.axis = getDragAxis(deltaX, deltaY);

    const scroller = drag.axis === "x" ? getScroller() : null;
    const isTouch = drag.pointerType === "touch";
    if (isTouch && scroller && canScrollTowards(scroller, deltaY)) {
      drag.mode = "scroll";
      drag.scroller = scroller;
      drag.startScrollTop = scroller.scrollTop;
    } else {
      drag.mode = "rotate";
      drag.base = getOrientation();
      onStart(drag.axis, drag.base);
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
    window.getSelection()?.removeAllRanges();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    trackSample(drag.samples, event.clientX, event.clientY);
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.mode) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD_PX) {
        return;
      }
      begin(drag, event, deltaX, deltaY);
    }

    if (drag.mode === "scroll" && drag.scroller) {
      drag.scroller.scrollTop = drag.startScrollTop - deltaY;
      return;
    }

    drag.angle = getDragAngle(drag.axis, deltaX, deltaY, drag.size);
    onMove(multiply(rotation(drag.axis, drag.angle), drag.base));
  };

  const finish = (
    event: React.PointerEvent<HTMLElement>,
    { cancelled }: { cancelled: boolean },
  ) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.mode) return;

    delete event.currentTarget.dataset.dragging;
    suppressClickRef.current = true;
    setTimeout(() => (suppressClickRef.current = false), 0);

    const velocity = getVelocity(drag.samples);

    if (drag.mode === "scroll") {
      if (!cancelled && drag.scroller) startMomentum(drag.scroller, velocity.y);
      return;
    }

    // The browser took over the gesture: go back, never commit a turn.
    if (cancelled) {
      onRelease(drag.base);
      return;
    }

    const steps = getSnapSteps(
      drag.angle,
      alongAxis(drag.axis, velocity.x, velocity.y),
    );
    onRelease(multiply(rotation(drag.axis, steps * 90), drag.base));
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (event: React.PointerEvent<HTMLElement>) =>
      finish(event, { cancelled: false }),
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) =>
      finish(event, { cancelled: true }),
    onClickCapture,
  };
};

export default useCubeDrag;
