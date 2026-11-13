import React from "react";
import { VscTriangleDown } from "react-icons/vsc";

import { ArrowButtonDownProps } from "./types";
import ArrowButtonBase from "../Base";

const ArrowButtonDown: React.FC<ArrowButtonDownProps> = ({ onClick }) => (
  <ArrowButtonBase
    bottom="0"
    left="50%"
    height="12"
    width="24"
    transform="translate(-50%, 50%)"
    aria-label="Girar para a seção de baixo"
    alignItems="flex-start"
    justifyContent="center"
    pt="1"
    onClick={onClick}
  >
    <VscTriangleDown />
  </ArrowButtonBase>
);

export default ArrowButtonDown;
