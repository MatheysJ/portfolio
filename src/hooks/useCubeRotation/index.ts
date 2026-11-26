import React, { useCallback, useEffect, useRef, useState } from "react";
import { ORIENTATION_VAR } from "@/constants/cube";
import { DIRECTIONS } from "@/constants/directions";
import { FACES } from "@/constants/faces";
import { TURN_FEEDBACK_MS } from "@/constants/motion";
import {
  IDENTITY,
  IDENTITY_MATRIX3D,
  Matrix,
  TURNS,
  getActiveFace,
  getContentAngle,
  getTurnToFace,
  isSameMatrix,
  multiply,
  rotation,
  toQuaternion,
} from "@/utils/orientation";

import useArrowKeys from "../useArrowKeys";
import useCubeDrag from "./useCubeDrag";
import useFaceScroller from "./useFaceScroller";
import useMouseTilt from "./useMouseTilt";
import useOrientationAnimation, {
  AnimateOptions,
} from "./useOrientationAnimation";

const INITIAL_CONTENT_ANGLES = Object.fromEntries(
  Object.values(FACES).map((face) => [face, 0]),
) as Record<FACES, number>;

const CUBE_STYLE = {
  [ORIENTATION_VAR]: IDENTITY_MATRIX3D,
} as React.CSSProperties;

const useCubeRotation = () => {
  const [orientation, setOrientation] = useState<Matrix>(IDENTITY);
  const [contentAngles, setContentAngles] = useState(INITIAL_CONTENT_ANGLES);
  const [isTurning, setIsTurning] = useState(false);

  const orientationRef = useRef<Matrix>(IDENTITY);
  const turnTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { cubeRef, show, stop, animateTo, tilt } = useOrientationAnimation();

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

  const signalTurn = useCallback(() => {
    setIsTurning(true);
    clearTimeout(turnTimeoutRef.current);
    turnTimeoutRef.current = setTimeout(
      () => setIsTurning(false),
      TURN_FEEDBACK_MS,
    );
  }, []);

  const rotateTo = useCallback(
    (target: Matrix, options?: AnimateOptions) => {
      if (!isSameMatrix(target, orientationRef.current)) {
        straightenFaces([target]);
        orientationRef.current = target;
        setOrientation(target);
        signalTurn();
      }
      animateTo(target, options);
    },
    [animateTo, signalTurn, straightenFaces],
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

  useArrowKeys(turn);
  useMouseTilt(tilt);

  useEffect(() => () => clearTimeout(turnTimeoutRef.current), []);

  const getCurrentFace = useCallback(
    () => getActiveFace(orientationRef.current),
    [],
  );
  const getActiveScroller = useFaceScroller(cubeRef, getCurrentFace);

  const dragHandlers = useCubeDrag({
    getOrientation: () => orientationRef.current,
    getScroller: getActiveScroller,
    onStart: (axis, base) => {
      stop();
      straightenFaces([
        multiply(rotation(axis, 90), base),
        multiply(rotation(axis, -90), base),
      ]);
    },
    onMove: (live) => show(toQuaternion(live), live),
    onRelease: (target) => rotateTo(target, { snap: true }),
  });

  return {
    orientation,
    activeFace: getActiveFace(orientation),
    contentAngles,
    isTurning,
    turn,
    goTo,
    cubeRef,
    cubeStyle: CUBE_STYLE,
    dragHandlers,
  };
};

export type CubeRotation = ReturnType<typeof useCubeRotation>;

export default useCubeRotation;
