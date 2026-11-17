import React, { useRef } from "react";
import {
  DRAG_DEGREES_PER_SIZE,
  DRAG_THRESHOLD_PX,
  FLICK_THRESHOLD_DEG,
} from "@/constants/motion";
import { Axis } from "@/types";
import { clamp } from "@/utils/math";
import { Matrix, multiply, rotation } from "@/utils/orientation";

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

export interface CubeDragCallbacks {
  getOrientation: () => Matrix;
  onStart: (axis: Axis, base: Matrix) => void;
  onMove: (live: Matrix) => void;
  onRelease: (target: Matrix) => void;
}

export const getDragAxis = (deltaX: number, deltaY: number): Axis =>
  Math.abs(deltaX) >= Math.abs(deltaY) ? "y" : "x";

export const getDragAngle = (
  axis: Axis,
  deltaX: number,
  deltaY: number,
  size: number,
) => {
  const delta = axis === "y" ? deltaX : -deltaY;
  return clamp((delta / size) * DRAG_DEGREES_PER_SIZE, -90, 90);
};

export const getSnapSteps = (angle: number) => {
  const steps = Math.round(angle / 90);
  if (steps === 0 && Math.abs(angle) > FLICK_THRESHOLD_DEG) {
    return Math.sign(angle);
  }
  return steps;
};

const useCubeDrag = ({
  getOrientation,
  onStart,
  onMove,
  onRelease,
}: CubeDragCallbacks) => {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

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
      base: getOrientation(),
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

      const axis = getDragAxis(deltaX, deltaY);
      if (axis === "x" && drag.pointerType === "touch") {
        dragRef.current = null;
        return;
      }

      drag.axis = axis;
      drag.base = getOrientation();
      onStart(axis, drag.base);
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
      window.getSelection()?.removeAllRanges();
    }

    drag.angle = getDragAngle(drag.axis, deltaX, deltaY, drag.size);
    onMove(multiply(rotation(drag.axis, drag.angle), drag.base));
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.axis) return;

    delete event.currentTarget.dataset.dragging;
    suppressClickRef.current = true;
    setTimeout(() => (suppressClickRef.current = false), 0);

    const steps = getSnapSteps(drag.angle);
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
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
    onClickCapture,
  };
};

export default useCubeDrag;
