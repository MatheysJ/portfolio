import React from "react";
import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useDictionary } from "@/i18n";

import Face from "../Face";
import { CubeFaceContentProps } from "../Face/types";
import SectionLabel from "../SectionLabel";

const Experiences: React.FC<CubeFaceContentProps> = (props) => {
  const { experience, workStyle, ui } = useDictionary();

  return (
    <Face {...props}>
      <Flex direction="column" gap="4">
        <Flex direction="column">
          <Text color="teal.400">
            {experience.company}{" "}
            <Text as="span" color="whiteAlpha.600">
              ({experience.companyNote})
            </Text>
          </Text>
          <Text>{experience.role}</Text>
          <Text color="whiteAlpha.600">
            {experience.period} · {experience.workModel}
          </Text>
          <Text color="whiteAlpha.600">{experience.note}</Text>
        </Flex>

        {experience.works.map(({ title, stack, text, metric }) => (
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
          <SectionLabel>{ui.workStyleLabel}</SectionLabel>
          <List.Root gap="1" ps="4" listStyleType="square">
            {workStyle.map((item) => (
              <List.Item key={item} _marker={{ color: "teal.400" }}>
                {item}
              </List.Item>
            ))}
          </List.Root>
        </Flex>
      </Flex>
    </Face>
  );
};

export default Experiences;
