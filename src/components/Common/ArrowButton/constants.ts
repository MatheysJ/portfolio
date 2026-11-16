import { FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  VscTriangleDown,
  VscTriangleLeft,
  VscTriangleRight,
  VscTriangleUp,
} from "react-icons/vsc";
import { DIRECTIONS } from "@/constants/directions";

interface ArrowLayout extends FlexProps {
  icon: IconType;
  label: string;
}

const HORIZONTAL: FlexProps = { top: "50%", height: "24", width: "12" };
const VERTICAL: FlexProps = { left: "50%", height: "12", width: "24" };

/** Posição, ícone e rótulo da seta de cada borda da face. */
export const ARROW_LAYOUT: Record<DIRECTIONS, ArrowLayout> = {
  [DIRECTIONS.LEFT]: {
    ...HORIZONTAL,
    left: "0",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
    justifyContent: "flex-end",
    pr: "1",
    icon: VscTriangleLeft,
    label: "Girar para a seção da esquerda",
  },
  [DIRECTIONS.RIGHT]: {
    ...HORIZONTAL,
    right: "0",
    transform: "translate(50%, -50%)",
    alignItems: "center",
    justifyContent: "flex-start",
    pl: "1",
    icon: VscTriangleRight,
    label: "Girar para a seção da direita",
  },
  [DIRECTIONS.UP]: {
    ...VERTICAL,
    top: "0",
    transform: "translate(-50%, -50%)",
    alignItems: "flex-end",
    justifyContent: "center",
    pb: "1",
    icon: VscTriangleUp,
    label: "Girar para a seção de cima",
  },
  [DIRECTIONS.DOWN]: {
    ...VERTICAL,
    bottom: "0",
    transform: "translate(-50%, 50%)",
    alignItems: "flex-start",
    justifyContent: "center",
    pt: "1",
    icon: VscTriangleDown,
    label: "Girar para a seção de baixo",
  },
};
