import { FACE_PLACEMENT } from "@/constants/cube";
import { DIRECTIONS } from "@/constants/directions";
import { FACES } from "@/constants/faces";
import { mod, toDegrees } from "@/utils/math";

import { rotation, rotationX, rotationY, transform } from "./matrix";
import { Matrix, Vector } from "./types";

const SCREEN_FRONT: Vector = [0, 0, 1];
const SCREEN_UP: Vector = [0, -1, 0];

export const TURNS: Record<DIRECTIONS, Matrix> = {
  [DIRECTIONS.RIGHT]: rotationY(-90),
  [DIRECTIONS.LEFT]: rotationY(90),
  [DIRECTIONS.UP]: rotationX(-90),
  [DIRECTIONS.DOWN]: rotationX(90),
};

const FACE_FRAMES = (Object.keys(FACE_PLACEMENT) as FACES[]).map((face) => {
  const { axis, degrees } = FACE_PLACEMENT[face];
  const placement = rotation(axis, degrees);
  return {
    face,
    normal: transform(placement, SCREEN_FRONT),
    up: transform(placement, SCREEN_UP),
  };
});

const getFrame = (face: FACES) => FACE_FRAMES.find((f) => f.face === face)!;

export const getActiveFace = (orientation: Matrix): FACES =>
  FACE_FRAMES.reduce((best, frame) =>
    transform(orientation, frame.normal)[2] >
    transform(orientation, best.normal)[2]
      ? frame
      : best,
  ).face;

export const getContentAngle = (face: FACES, orientation: Matrix) => {
  const [x, y] = transform(orientation, getFrame(face).up);
  const tilt = toDegrees(Math.atan2(x, -y));
  return mod(Math.round(-tilt / 90) * 90, 360);
};

export const getTurnToFace = (
  face: FACES,
  orientation: Matrix,
): Matrix | null => {
  const [x, y, z] = transform(orientation, getFrame(face).normal).map(
    Math.round,
  );

  if (z === 1) return null;
  if (x === 1) return TURNS[DIRECTIONS.RIGHT];
  if (x === -1) return TURNS[DIRECTIONS.LEFT];
  if (y === -1) return TURNS[DIRECTIONS.UP];
  if (y === 1) return TURNS[DIRECTIONS.DOWN];
  return rotationY(180);
};
