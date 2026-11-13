import styled from "styled-components";
import { Sized } from "@/types";

export const Container = styled.div<Sized>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  perspective: ${({ size }) => size * 3}px;
  cursor: grab;
  /* Permite rolar o conteúdo das faces na vertical e arrastar o cubo na horizontal. */
  touch-action: pan-y;

  &[data-dragging="true"] {
    cursor: grabbing;
    user-select: none;
  }
`;

/**
 * Recuo de meio cubo no eixo Z: a face ativa fica exatamente no plano da tela,
 * sem ampliação pela perspectiva (texto nítido em repouso).
 */
export const Scene = styled.div<Sized & { $isTurning: boolean }>`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: ${({ size, $isTurning }) =>
    `translateZ(-${size / 2}px) scale(${$isTurning ? 0.88 : 1})`};
  transition: transform 450ms cubic-bezier(0.33, 1, 0.68, 1);

  @media (prefers-reduced-motion: reduce) {
    transform: ${({ size }) => `translateZ(-${size / 2}px)`};
  }
`;

/**
 * Não gira: só repassa as variáveis de rotação para as faces
 * (ver ROTATION_VARS em useCubeRotation).
 */
export const Cube = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;

  &[data-dragging="true"] > * {
    transition: none;
  }
`;
