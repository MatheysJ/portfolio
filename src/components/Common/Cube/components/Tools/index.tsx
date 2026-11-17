import React from "react";
import { Flex } from "@chakra-ui/react";
import Chip from "@/components/Common/Chip";
import { STACK } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import SectionLabel from "../SectionLabel";

const Tools: React.FC<CubeFaceContentProps> = (props) => (
  <Face {...props}>
    <Flex direction="column" gap="2.5">
      {STACK.map(({ group, items }) => (
        <Flex key={group} direction="column" gap="1">
          <SectionLabel>{group}</SectionLabel>
          <Flex as="ul" wrap="wrap" gap="1.5">
            {items.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  </Face>
);

export default Tools;
