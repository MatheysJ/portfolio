import React from "react";
import { VscTriangleRight } from "react-icons/vsc";

import { ArrowButtonRightProps } from "./types";
import ArrowButtonBase from "../Base";

const ArrowButtonRight: React.FC<ArrowButtonRightProps> = ({ onClick }) => (
  <ArrowButtonBase
    right="0"
    top="50%"
    height="24"
    width="12"
    transform="translate(50%, -50%)"
    aria-label="Girar para a seção da direita"
    alignItems="center"
    justifyContent="flex-start"
    pl="1"
    onClick={onClick}
  >
    <VscTriangleRight />
  </ArrowButtonBase>
);

export default ArrowButtonRight;
