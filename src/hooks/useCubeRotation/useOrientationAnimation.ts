import { useCallback, useEffect, useRef } from "react";
import { ORIENTATION_VAR } from "@/constants/cube";
import { SNAP_DURATION_MS, TURN_DURATION_MS } from "@/constants/motion";
import { prefersReducedMotion } from "@/utils/dom";
import { easeInOutQuart, easeOutCubic } from "@/utils/easing";
import {
  IDENTITY,
  Matrix,
  Quaternion,
  fromQuaternion,
  multiply,
  slerp,
  toMatrix3d,
  toQuaternion,
} from "@/utils/orientation";

export interface AnimateOptions {
  snap?: boolean;
}

const useOrientationAnimation = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef<Quaternion>(toQuaternion(IDENTITY));
  const shownMatrixRef = useRef<Matrix>(IDENTITY);
  const tiltRef = useRef<Matrix>(IDENTITY);
  const frameRef = useRef<number | null>(null);

  const render = useCallback(() => {
    cubeRef.current?.style.setProperty(
      ORIENTATION_VAR,
      toMatrix3d(multiply(tiltRef.current, shownMatrixRef.current)),
    );
  }, []);

  const show = useCallback(
    (quaternion: Quaternion, matrix: Matrix = fromQuaternion(quaternion)) => {
      shownRef.current = quaternion;
      shownMatrixRef.current = matrix;
      render();
    },
    [render],
  );

  const tilt = useCallback(
    (matrix: Matrix) => {
      tiltRef.current = matrix;
      if (frameRef.current === null) render();
    },
    [render],
  );

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const animateTo = useCallback(
    (target: Matrix, { snap = false }: AnimateOptions = {}) => {
      const isRetarget = frameRef.current !== null;
      stop();

      const from = shownRef.current;
      const to = toQuaternion(target);
      const duration = prefersReducedMotion()
        ? 0
        : snap
          ? SNAP_DURATION_MS
          : TURN_DURATION_MS;
      const ease = snap || isRetarget ? easeOutCubic : easeInOutQuart;
      let start: number | null = null;

      const step = (now: number) => {
        start ??= now;
        const progress = duration ? Math.min((now - start) / duration, 1) : 1;

        if (progress < 1) {
          show(slerp(from, to, ease(progress)));
          frameRef.current = requestAnimationFrame(step);
          return;
        }

        show(to, target);
        frameRef.current = null;
      };

      frameRef.current = requestAnimationFrame(step);
    },
    [show, stop],
  );

  useEffect(() => stop, [stop]);

  return { cubeRef, show, stop, animateTo, tilt };
};

export default useOrientationAnimation;
