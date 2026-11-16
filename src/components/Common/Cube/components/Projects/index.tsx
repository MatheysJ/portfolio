import React from "react";
import { FACES } from "@/constants/faces";
import { Chip } from "@/components/Common";
import { Flex, Link, Text } from "@chakra-ui/react";
import { PERSONAL_PROJECT } from "@/constants/content";

import { useFaceFocus } from "../Face/context";
import { CubeProjectsProps } from "./types";
import { CubeFace } from "..";

const ProjectLink: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => {
  const focus = useFaceFocus();

  return (
    <Link
      {...focus}
      href={href}
      target="_blank"
      rel="noreferrer"
      color="inherit"
      _hover={{ color: "teal.300" }}
    >
      {label}
    </Link>
  );
};

const Projects: React.FC<CubeProjectsProps> = (props) => {
  const { title, description, stack, recognition, link } = PERSONAL_PROJECT;

  return (
    <CubeFace {...props} face={FACES.TOP} title="PROJETOS">
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
          <Text fontSize="0.85em" color="teal.400">
            Código (gateway)
          </Text>
          <ProjectLink href={link.href} label={link.label} />
        </Flex>
      </Flex>
    </CubeFace>
  );
};

export default Projects;
