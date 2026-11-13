import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { FACES } from "@/constants/faces";
import { CERTIFICATIONS, EDUCATION } from "@/constants/content";

import { CubeEducationProps } from "./types";
import { CubeFace } from "..";

const Education: React.FC<CubeEducationProps> = (props) => (
  <CubeFace {...props} face={FACES.BOTTOM} title="FORMAÇÃO">
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="2.5">
        {EDUCATION.map(({ title, place, period }) => (
          <Flex key={title} direction="column">
            <Text>{title}</Text>
            <Text color="whiteAlpha.700">{place}</Text>
            <Text color="whiteAlpha.600" fontSize="0.85em">
              {period}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Flex direction="column" gap="2">
        <Text color="teal.400" fontSize="0.85em">
          Certificações & idiomas
        </Text>
        {CERTIFICATIONS.map(({ title, detail }) => (
          <Flex key={title} direction="column">
            <Text>{title}</Text>
            <Text color="whiteAlpha.700">{detail}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  </CubeFace>
);

export default Education;
