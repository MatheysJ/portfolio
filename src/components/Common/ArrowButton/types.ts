import { DIRECTIONS } from "@/constants/directions";

export interface ArrowButtonProps {
  direction: DIRECTIONS;
  onClick: (direction: DIRECTIONS) => void;
}
