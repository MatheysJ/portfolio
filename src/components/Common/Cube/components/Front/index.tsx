import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { IoLaptopOutline, IoLocationSharp } from "react-icons/io5";
import { PROFILE } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";

// Rendered through CSS ::before so crawlers and AI agents do not read it as content.
const INTERACTION_HINT = "Arraste, use as setas do teclado ou clique nas bordas";

const Front: React.FC<CubeFaceContentProps> = (props) => (
  <Face {...props} title={PROFILE.name} titleAs="h1">
    <Flex h="100%" direction="column" justifyContent="space-between" gap="4">
      <Flex direction="column" gap="3">
        <Text color="whiteAlpha.700">{PROFILE.headline}</Text>
        <Text>{PROFILE.summary}</Text>
        <Flex direction="column" gap="1" color="whiteAlpha.700">
          <Flex alignItems="center" gap="1.5">
            <IoLocationSharp aria-hidden />
            <Text>{PROFILE.location}</Text>
          </Flex>
          <Flex alignItems="center" gap="1.5">
            <IoLaptopOutline aria-hidden />
            <Text>{PROFILE.workModel}</Text>
          </Flex>
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
        <Text
          aria-hidden
          fontSize="0.85em"
          color="whiteAlpha.600"
          textAlign="end"
          css={{ "&::before": { content: `"${INTERACTION_HINT}"` } }}
        />
      </Flex>
    </Flex>
  </Face>
);

export default Front;
