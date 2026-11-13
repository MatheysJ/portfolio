import React from "react";
import { VscTriangleUp } from "react-icons/vsc";

import { ArrowButtonUpProps } from "./types";
import ArrowButtonBase from "../Base";

const ArrowButtonUp: React.FC<ArrowButtonUpProps> = ({ onClick }) => (
  <ArrowButtonBase
    top="0"
    left="50%"
    height="12"
    width="24"
    transform="translate(-50%, -50%)"
    aria-label="Girar para a seção de cima"
    alignItems="flex-end"
    justifyContent="center"
    pb="1"
    onClick={onClick}
  >
    <VscTriangleUp />
  </ArrowButtonBase>
);

export default ArrowButtonUp;
