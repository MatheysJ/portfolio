import React from "react";
import { Box, Flex, List, Text } from "@chakra-ui/react";
import { EXPERIENCE, WORK_STYLE } from "@/constants/content";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import SectionLabel from "../SectionLabel";

const Experiences: React.FC<CubeFaceContentProps> = (props) => (
  <Face {...props}>
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Text color="teal.400">
          {EXPERIENCE.company}{" "}
          <Text as="span" color="whiteAlpha.600">
            ({EXPERIENCE.companyNote})
          </Text>
        </Text>
        <Text>{EXPERIENCE.role}</Text>
        <Text color="whiteAlpha.600">
          {EXPERIENCE.period} · {EXPERIENCE.workModel}
        </Text>
        <Text color="whiteAlpha.600">{EXPERIENCE.note}</Text>
      </Flex>

      {EXPERIENCE.works.map(({ title, stack, text, metric }) => (
        <Flex
          key={title}
          direction="column"
          gap="1"
          borderLeft="2px solid"
          borderColor="teal.700"
          ps="2.5"
        >
          <Text color="teal.400">{title}</Text>
          <Text fontSize="0.85em" color="whiteAlpha.600">
            {stack}
          </Text>
          <Text>{text}</Text>
          {metric && (
            <Box mt="1">
              <Text color="teal.300" fontSize="1.15em">
                {metric.value}
              </Text>
              <Text fontSize="0.85em" color="whiteAlpha.700">
                {metric.detail}
              </Text>
            </Box>
          )}
        </Flex>
      ))}

      <Flex direction="column" gap="1">
        <SectionLabel>Como trabalho</SectionLabel>
        <List.Root gap="1" ps="4" listStyleType="square">
          {WORK_STYLE.map((item) => (
            <List.Item key={item} _marker={{ color: "teal.400" }}>
              {item}
            </List.Item>
          ))}
        </List.Root>
      </Flex>
    </Flex>
  </Face>
);

export default Experiences;
