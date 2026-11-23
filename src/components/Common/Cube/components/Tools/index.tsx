import React from "react";
import { Flex } from "@chakra-ui/react";
import Chip from "@/components/Common/Chip";
import { useDictionary } from "@/i18n";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import SectionLabel from "../SectionLabel";

const Tools: React.FC<CubeFaceContentProps> = (props) => {
  const { stack } = useDictionary();

  return (
    <Face {...props}>
      <Flex direction="column" gap="2.5">
        {stack.map(({ group, items }) => (
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
};

export default Tools;
