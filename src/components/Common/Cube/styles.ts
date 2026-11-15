import styled from "styled-components";

/**
 * Tamanho do cubo calculado só com CSS: o HTML gerado no servidor já sai com o
 * tamanho certo para qualquer tela, sem depender de JavaScript.
 */
export const CUBE_SIZE = "var(--cube-size)";

export const Container = styled.div`
  --cube-size: clamp(
    280px,
    min(calc(100vw - 48px), calc(100dvh - 190px)),
    540px
  );

  width: ${CUBE_SIZE};
  height: ${CUBE_SIZE};
  perspective: calc(${CUBE_SIZE} * 3);
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
export const Scene = styled.div<{ $isTurning: boolean }>`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateZ(calc(${CUBE_SIZE} / -2))
    scale(${({ $isTurning }) => ($isTurning ? 0.88 : 1)});
  transition: transform 450ms cubic-bezier(0.33, 1, 0.68, 1);

  @media (prefers-reduced-motion: reduce) {
    transform: translateZ(calc(${CUBE_SIZE} / -2));
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
