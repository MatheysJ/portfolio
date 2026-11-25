import styled, { css } from "styled-components";

export const Nav = styled.nav`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(5, 7, 8, 0.72);
  backdrop-filter: blur(6px);
  font-size: 12px;
  letter-spacing: 0.06em;
  transition: border-color 200ms ease-out;

  &:hover,
  &:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const Option = styled.a<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  min-width: 36px;
  min-height: 28px;
  justify-content: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #a3a3a3;
  transition:
    color 200ms ease-out,
    background 200ms ease-out;

  &:hover {
    color: #ffffff;
  }

  &:focus-visible {
    outline: 2px solid #2dd4bf;
    outline-offset: 2px;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: #000000;
      background: #5eead4;

      &:hover {
        color: #000000;
      }
    `}
`;
