import React from "react";
import { Flex } from "@chakra-ui/react";
import { useCubeRotation, useViewportSize } from "@/hooks";

import { Cube, CubeNav } from "..";

const MAX_CUBE_SIZE = 540;
const MIN_CUBE_SIZE = 280;
/** Espaço reservado para a navegação e respiro vertical. */
const VERTICAL_RESERVED = 190;

const Outdoor: React.FC = () => {
  const { width, height } = useViewportSize();
  const size = Math.round(
    Math.max(
      MIN_CUBE_SIZE,
      Math.min(MAX_CUBE_SIZE, width - 48, height - VERTICAL_RESERVED),
    ),
  );

  const rotation = useCubeRotation(size);

  return (
    <Flex
      as="main"
      minH="100dvh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="10"
      px="4"
      py="8"
    >
      <Cube color="white" size={size} rotation={rotation} />
      <CubeNav activeFace={rotation.activeFace} onSelect={rotation.goTo} />
    </Flex>
  );
};

export default Outdoor;
