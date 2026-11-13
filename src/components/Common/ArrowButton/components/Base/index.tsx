import React from "react";
import { Flex } from "@chakra-ui/react";

import { ArrowButtonBaseProps } from "./types";

const ArrowButtonBase: React.FC<ArrowButtonBaseProps> = (props) => (
  <Flex
    as="button"
    position="absolute"
    zIndex="1"
    cursor="pointer"
    color="currentColor"
    opacity="0.45"
    borderRadius="50%"
    transition="background 300ms ease-out, color 300ms ease-out, opacity 300ms ease-out"
    _hover={{ bg: "teal.400", color: "black", opacity: 1 }}
    _focusVisible={{ opacity: 1, outline: "2px solid", outlineColor: "teal.400" }}
    {...props}
  />
);

export default ArrowButtonBase;
