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
  slerp,
  toMatrix3d,
  toQuaternion,
} from "@/utils/orientation";

export interface AnimateOptions {
  /** Encaixe ao soltar um arraste: mais curto e só desacelerando. */
  snap?: boolean;
}

/**
 * Pinta a orientação do cubo direto no DOM (variável CSS), sem re-render do
 * React, e anima entre orientações por slerp, sempre pelo menor caminho.
 */
const useOrientationAnimation = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  /** Orientação exibida neste instante (pode estar no meio de um giro). */
  const shownRef = useRef<Quaternion>(toQuaternion(IDENTITY));
  const frameRef = useRef<number | null>(null);

  const show = useCallback(
    (quaternion: Quaternion, matrix: Matrix = fromQuaternion(quaternion)) => {
      shownRef.current = quaternion;
      cubeRef.current?.style.setProperty(ORIENTATION_VAR, toMatrix3d(matrix));
    },
    [],
  );

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  /** Anima da orientação exibida até o alvo, pelo menor caminho. */
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
      // Ao mudar de alvo no meio de um giro, desacelera em vez de recomeçar
      // devagar, para o movimento não "engasgar".
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

  return { cubeRef, show, stop, animateTo };
};

export default useOrientationAnimation;
