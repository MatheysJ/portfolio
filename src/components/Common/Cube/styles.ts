import styled from "styled-components";

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
  /* Every swipe is handled in JS (see useCubeDrag); pinch zoom stays native where supported. */
  touch-action: none;
  touch-action: pinch-zoom;

  &[data-dragging="true"] {
    cursor: grabbing;
    user-select: none;
  }
`;

// Pulled back half a cube so the active face sits on the screen plane and text stays sharp.
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

// Must not rotate itself: edge-on at 90°, the browser stops delivering clicks to the faces.
export const Cube = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;
