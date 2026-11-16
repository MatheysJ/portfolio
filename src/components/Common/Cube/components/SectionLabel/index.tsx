import React from "react";
import { Text } from "@chakra-ui/react";
import { ChildrenAsProps } from "@/types";

/** Rótulo de um bloco dentro de uma face ("Como trabalho", "E-mail"…). */
const SectionLabel: React.FC<ChildrenAsProps> = ({ children }) => (
  <Text color="teal.400" fontSize="0.85em">
    {children}
  </Text>
);

export default SectionLabel;
