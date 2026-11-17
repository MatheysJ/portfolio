import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Chip from "@/components/Common/Chip";
import { PERSONAL_PROJECT } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import FaceLink from "../FaceLink";
import SectionLabel from "../SectionLabel";

const Projects: React.FC<CubeFaceContentProps> = (props) => {
  const { title, description, stack, recognition, link } = PERSONAL_PROJECT;

  return (
    <Face {...props}>
      <Flex direction="column" gap="3">
        <Flex direction="column">
          <Text color="teal.400">
            {title}{" "}
            <Text as="span" color="whiteAlpha.600">
              · projeto pessoal
            </Text>
          </Text>
          <Text>{description}</Text>
        </Flex>

        <Flex as="ul" wrap="wrap" gap="1.5">
          {stack.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </Flex>

        <Text color="whiteAlpha.800">{recognition}</Text>

        <Flex direction="column">
          <SectionLabel>Código (gateway)</SectionLabel>
          <FaceLink href={link.href}>{link.label}</FaceLink>
        </Flex>
      </Flex>
    </Face>
  );
};

export default Projects;
