import React from "react";
import { FACES } from "@/constants/faces";
import { PROFILE } from "@/constants/content";
import { Flex, Text } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";

import { CubeFrontProps } from "./types";
import { CubeFace } from "..";

const Front: React.FC<CubeFrontProps> = (props) => (
  <CubeFace {...props} face={FACES.FRONT} title={PROFILE.name}>
    <Flex h="100%" direction="column" justifyContent="space-between" gap="4">
      <Flex direction="column" gap="3">
        <Text color="whiteAlpha.700">{PROFILE.headline}</Text>
        <Text>{PROFILE.summary}</Text>
        <Flex alignItems="center" gap="1.5" color="whiteAlpha.700">
          <IoLocationSharp />
          <Text>{PROFILE.location}</Text>
        </Flex>
      </Flex>

      <Flex direction="column" alignItems="flex-end" gap="2">
        <Text
          as="p"
          textAlign="end"
          fontSize="max(22px, 7.5cqi)"
          lineHeight="1"
          color="teal.400"
        >
          {PROFILE.role}
        </Text>
        <Text fontSize="0.85em" color="whiteAlpha.600" textAlign="end">
          Arraste, use as setas do teclado ou clique nas bordas
        </Text>
      </Flex>
    </Flex>
  </CubeFace>
);

export default Front;
