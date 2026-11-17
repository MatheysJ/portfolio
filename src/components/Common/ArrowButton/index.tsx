import React from "react";
import { Flex } from "@chakra-ui/react";

import { ARROW_LAYOUT } from "./constants";
import { ArrowButtonProps } from "./types";

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick }) => {
  const { icon: Icon, label, ...layout } = ARROW_LAYOUT[direction];

  return (
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
      _focusVisible={{
        opacity: 1,
        outline: "2px solid",
        outlineColor: "teal.400",
      }}
      aria-label={label}
      onClick={() => onClick(direction)}
      {...layout}
    >
      <Icon />
    </Flex>
  );
};

export default ArrowButton;
