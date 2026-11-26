import styled, { css, keyframes } from "styled-components";

const MOBILE_LIMIT = 14;

const rise = (drift: string) => keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
    opacity: 0;
  }
  12% {
    opacity: 0.75;
  }
  50% {
    transform: translate3d(${drift}, -55vh, 0) rotate(90deg);
  }
  85% {
    opacity: 0.5;
  }
  100% {
    transform: translate3d(0, -110vh, 0) rotate(180deg);
    opacity: 0;
  }
`;

const DRIFTS = [rise("-24px"), rise("18px"), rise("6px")];

export const Field = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  @media (max-width: 600px) {
    & > :nth-child(n + ${MOBILE_LIMIT + 1}) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export const Ember = styled.span<{ $drift: number }>`
  position: absolute;
  bottom: -12px;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.55);
  opacity: 0;
  will-change: transform, opacity;
  ${({ $drift }) => css`
    animation-name: ${DRIFTS[$drift]};
  `}
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;
