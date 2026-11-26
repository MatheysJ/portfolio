import { useEffect } from "react";
import {
  TILT_MAX_DEG,
  TILT_REST_DEG,
  TILT_SMOOTHING_MS,
} from "@/constants/motion";
import { prefersReducedMotion } from "@/utils/dom";
import { clamp } from "@/utils/math";
import { Matrix, multiply, rotationX, rotationY } from "@/utils/orientation";

export interface TiltAngles {
  x: number;
  y: number;
}

const REST: TiltAngles = { x: 0, y: 0 };

const toUnit = (position: number, size: number) =>
  clamp((position / size) * 2 - 1, -1, 1);

export const getTiltAngles = (
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): TiltAngles => ({
  x: -toUnit(clientY, height) * TILT_MAX_DEG || 0,
  y: toUnit(clientX, width) * TILT_MAX_DEG || 0,
});

export const getTiltMatrix = ({ x, y }: TiltAngles): Matrix =>
  multiply(rotationX(x), rotationY(y));

export const approachTilt = (
  current: TiltAngles,
  target: TiltAngles,
  elapsedMs: number,
): TiltAngles => {
  const factor = 1 - Math.exp(-elapsedMs / TILT_SMOOTHING_MS);
  const next = {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
  const isSettled =
    Math.abs(target.x - next.x) < TILT_REST_DEG &&
    Math.abs(target.y - next.y) < TILT_REST_DEG;

  return isSettled ? target : next;
};

const canTilt = () =>
  !!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

const useMouseTilt = (onTilt: (tilt: Matrix) => void) => {
  useEffect(() => {
    if (!canTilt()) return;

    let current = REST;
    let target = REST;
    let frame: number | null = null;
    let lastTime: number | null = null;

    const step = (now: number) => {
      current = approachTilt(current, target, now - (lastTime ?? now - 16));
      onTilt(getTiltMatrix(current));

      const isSettled = current === target;
      lastTime = isSettled ? null : now;
      frame = isSettled ? null : requestAnimationFrame(step);
    };

    const moveTo = (next: TiltAngles) => {
      target = next;
      frame ??= requestAnimationFrame(step);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (prefersReducedMotion()) {
        moveTo(REST);
        return;
      }
      moveTo(
        getTiltAngles(
          event.clientX,
          event.clientY,
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) moveTo(REST);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [onTilt]);
};

export default useMouseTilt;
