import React from "react";
import { Box } from "@chakra-ui/react";

import { ChipProps } from "./types";

const Chip: React.FC<ChipProps> = ({ children }) => (
  <Box
    as="li"
    listStyleType="none"
    px="2"
    py="0.5"
    border="1px solid"
    borderColor="whiteAlpha.300"
    borderRadius="sm"
    fontSize="0.9em"
    whiteSpace="nowrap"
  >
    {children}
  </Box>
);

export default Chip;
