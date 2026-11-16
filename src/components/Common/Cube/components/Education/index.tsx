import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { CERTIFICATIONS, EDUCATION } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import SectionLabel from "../SectionLabel";

const Education: React.FC<CubeFaceContentProps> = (props) => (
  <Face {...props}>
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
        <SectionLabel>Certificações & idiomas</SectionLabel>
        {CERTIFICATIONS.map(({ title, detail }) => (
          <Flex key={title} direction="column">
            <Text>{title}</Text>
            <Text color="whiteAlpha.700">{detail}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  </Face>
);

export default Education;
