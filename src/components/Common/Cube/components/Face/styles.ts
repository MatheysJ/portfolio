import styled from "styled-components";
import { Faceable, Paintable, Sized } from "@/types";
import { FACES } from "@/constants/faces";
import { ROTATION_VARS } from "@/hooks/useCubeRotation";

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

export const Face = styled.div<Faceable & Sized & Paintable>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
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
  transform: ${({ face, size }) =>
    `rotateX(var(${ROTATION_VARS.y}, 0deg)) rotateY(var(${ROTATION_VARS.x}, 0deg)) ${FACE_ROTATION[face]} translateZ(${size / 2}px)`};
  transition: transform 850ms ${TURN_EASING};
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
