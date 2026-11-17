import styled from "styled-components";
import { FACE_PLACEMENT, ORIENTATION_VAR } from "@/constants/cube";
import { FACES } from "@/constants/faces";
import { Faceable, Paintable } from "@/types";
import { IDENTITY_MATRIX3D } from "@/utils/orientation";

import { CUBE_SIZE } from "../../styles";

const GRID_LINE = "rgba(255, 255, 255, 0.04)";
const FACE_BACKGROUND = "#050708";

const toCssRotation = (face: FACES) => {
  const { axis, degrees } = FACE_PLACEMENT[face];
  return `rotate${axis.toUpperCase()}(${degrees}deg)`;
};

export const Face = styled.section<
  Faceable & Paintable & { $isActive: boolean }
>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
  /* Hidden faces would otherwise intercept clicks meant for the active one. */
  pointer-events: ${({ $isActive }) => ($isActive ? "auto" : "none")};
  container-type: inline-size;
  color: ${({ color }) => color};
  background:
    repeating-linear-gradient(
      0deg,
      ${GRID_LINE} 0px,
      ${GRID_LINE} 1px,
      transparent 1px,
      transparent 16px
    ),
    repeating-linear-gradient(
      90deg,
      ${GRID_LINE} 0px,
      ${GRID_LINE} 1px,
      transparent 1px,
      transparent 16px
    ),
    ${({ background }) => background ?? FACE_BACKGROUND};
  box-shadow: ${({ color }) => `inset 0 0 0 1px ${color}`};
  transform: ${({ face }) =>
    `matrix3d(var(${ORIENTATION_VAR}, ${IDENTITY_MATRIX3D})) ${toCssRotation(face)} translateZ(calc(${CUBE_SIZE} / 2))`};
  will-change: transform;
`;
