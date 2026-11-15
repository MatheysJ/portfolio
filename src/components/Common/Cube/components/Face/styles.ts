import styled from "styled-components";
import { Faceable, Paintable } from "@/types";
import { FACES } from "@/constants/faces";
import { ROTATION_VARS } from "@/hooks/useCubeRotation";

import { CUBE_SIZE } from "../../styles";

const FACE_ROTATION: Record<FACES, string> = {
  [FACES.TOP]: "rotateX(90deg)",
  [FACES.BOTTOM]: "rotateX(-90deg)",
  [FACES.RIGHT]: "rotateY(90deg)",
  [FACES.LEFT]: "rotateY(-90deg)",
  [FACES.FRONT]: "rotateY(0deg)",
  [FACES.BACK]: "rotateY(180deg)",
};

const TURN_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

const GRID_LINE = "rgba(255, 255, 255, 0.04)";

export const Face = styled.section<Faceable & Paintable & { $isActive: boolean }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
  /* Faces fora de vista não interceptam cliques da face ativa. */
  pointer-events: ${({ $isActive }) => ($isActive ? "auto" : "none")};
  /* Permite tipografia proporcional ao tamanho da face (unidades cqi). */
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
    ${({ background }) => background ?? "#050708"};
  box-shadow: ${({ color }) => `inset 0 0 0 1px ${color}`};
  /* Rotação do cubo (variáveis no elemento pai) + posição da face no cubo. */
  transform: ${({ face }) =>
    `rotateX(var(${ROTATION_VARS.y}, 0deg)) rotateY(var(${ROTATION_VARS.x}, 0deg)) ${FACE_ROTATION[face]} translateZ(calc(${CUBE_SIZE} / 2))`};
  transition: transform 850ms ${TURN_EASING};
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
