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
}

const HORIZONTAL: FlexProps = { top: "50%", height: "24", width: "12" };
const VERTICAL: FlexProps = { left: "50%", height: "12", width: "24" };

export const ARROW_LAYOUT: Record<DIRECTIONS, ArrowLayout> = {
  [DIRECTIONS.LEFT]: {
    ...HORIZONTAL,
    left: "0",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
    justifyContent: "flex-end",
    pr: "1",
    icon: VscTriangleLeft,
  },
  [DIRECTIONS.RIGHT]: {
    ...HORIZONTAL,
    right: "0",
    transform: "translate(50%, -50%)",
    alignItems: "center",
    justifyContent: "flex-start",
    pl: "1",
    icon: VscTriangleRight,
  },
  [DIRECTIONS.UP]: {
    ...VERTICAL,
    top: "0",
    transform: "translate(-50%, -50%)",
    alignItems: "flex-end",
    justifyContent: "center",
    pb: "1",
    icon: VscTriangleUp,
  },
  [DIRECTIONS.DOWN]: {
    ...VERTICAL,
    bottom: "0",
    transform: "translate(-50%, 50%)",
    alignItems: "flex-start",
    justifyContent: "center",
    pt: "1",
    icon: VscTriangleDown,
  },
};
