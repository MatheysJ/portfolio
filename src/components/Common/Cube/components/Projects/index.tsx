import React from "react";
import { Box, Flex, List, Text } from "@chakra-ui/react";
import { FACES } from "@/constants/faces";
import { CASE_STUDY, PROJECTS } from "@/constants/content";

import { CubeProjectsProps } from "./types";
import { CubeFace } from "..";

const Projects: React.FC<CubeProjectsProps> = (props) => (
  <CubeFace {...props} face={FACES.TOP} title="PROJETOS">
    <Flex direction="column" gap="4">
      {PROJECTS.map(({ title, role, points }) => (
        <Flex key={title} direction="column" gap="1">
          <Text color="teal.400">{title}</Text>
          <Text color="whiteAlpha.700">{role}</Text>
          <List.Root ps="4" gap="0.5" listStyleType="square">
            {points.map((point) => (
              <List.Item key={point} _marker={{ color: "teal.400" }}>
                {point}
              </List.Item>
            ))}
          </List.Root>
        </Flex>
      ))}

      <Flex direction="column" gap="1.5">
        <Text color="teal.400">
          <Text as="span" color="whiteAlpha.600">
            Case ·{" "}
          </Text>
          {CASE_STUDY.title}
        </Text>
        {CASE_STUDY.steps.map(({ label, text }) => (
          <Box key={label} borderLeft="2px solid" borderColor="teal.700" ps="2.5">
            <Text fontSize="0.85em" color="whiteAlpha.600">
              {label}
            </Text>
            <Text>{text}</Text>
          </Box>
        ))}
      </Flex>
    </Flex>
  </CubeFace>
);

export default Projects;
