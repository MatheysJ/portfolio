import React from "react";
import { FACES } from "@/constants/faces";
import { EXPERIENCE } from "@/constants/content";
import { Flex, List, Text } from "@chakra-ui/react";

import { CubeExperiencesProps } from "./types";
import { CubeFace } from "..";

const Experiences: React.FC<CubeExperiencesProps> = (props) => (
  <CubeFace {...props} face={FACES.RIGHT} title="EXPERIÊNCIA">
    <Flex direction="column" gap="3">
      <Flex direction="column">
        <Text color="teal.400">
          {EXPERIENCE.company}{" "}
          <Text as="span" color="whiteAlpha.600">
            ({EXPERIENCE.companyNote})
          </Text>
        </Text>
        <Text>{EXPERIENCE.role}</Text>
        <Text color="whiteAlpha.600">{EXPERIENCE.period}</Text>
      </Flex>

      <List.Root gap="1.5" ps="4" listStyleType="square">
        {EXPERIENCE.highlights.map((highlight) => (
          <List.Item key={highlight} _marker={{ color: "teal.400" }}>
            {highlight}
          </List.Item>
        ))}
      </List.Root>

      <Text color="whiteAlpha.700">{EXPERIENCE.practices}</Text>
    </Flex>
  </CubeFace>
);

export default Experiences;
