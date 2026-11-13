import React from "react";
import { VscTriangleLeft } from "react-icons/vsc";

import { ArrowButtonLeftProps } from "./types";
import ArrowButtonBase from "../Base";

const ArrowButtonLeft: React.FC<ArrowButtonLeftProps> = ({ onClick }) => (
  <ArrowButtonBase
    left="0"
    top="50%"
    height="24"
    width="12"
    transform="translate(-50%, -50%)"
    aria-label="Girar para a seção da esquerda"
    alignItems="center"
    justifyContent="flex-end"
    pr="1"
    onClick={onClick}
  >
    <VscTriangleLeft />
  </ArrowButtonBase>
);

export default ArrowButtonLeft;
