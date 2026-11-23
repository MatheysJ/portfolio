import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Chip from "@/components/Common/Chip";
import { PERSONAL_PROJECT_LINK } from "@/constants/contact";
import { useDictionary } from "@/i18n";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import FaceLink from "../FaceLink";
import SectionLabel from "../SectionLabel";

const Projects: React.FC<CubeFaceContentProps> = (props) => {
  const { title, tag, description, stack, recognition, codeLabel } =
    useDictionary().personalProject;
  const link = PERSONAL_PROJECT_LINK;

  return (
    <Face {...props}>
      <Flex direction="column" gap="3">
        <Flex direction="column">
          <Text color="teal.400">
            {title}{" "}
            <Text as="span" color="whiteAlpha.600">
              · {tag}
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
          <SectionLabel>{codeLabel}</SectionLabel>
          <FaceLink href={link.href}>{link.label}</FaceLink>
        </Flex>
      </Flex>
    </Face>
  );
};

export default Projects;
