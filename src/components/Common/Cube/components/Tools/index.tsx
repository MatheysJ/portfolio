import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { FACES } from "@/constants/faces";
import { STACK } from "@/constants/content";
import { Chip } from "@/components/Common";

import { CubeToolsProps } from "./types";
import { CubeFace } from "..";

const Tools: React.FC<CubeToolsProps> = (props) => (
  <CubeFace {...props} face={FACES.BACK} title="STACK">
    <Flex direction="column" gap="2.5">
      {STACK.map(({ group, items }) => (
        <Flex key={group} direction="column" gap="1">
          <Text color="teal.400" fontSize="0.85em">
            {group}
          </Text>
          <Flex as="ul" wrap="wrap" gap="1.5">
            {items.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  </CubeFace>
);

export default Tools;
