import React from "react";
import { Flex } from "@chakra-ui/react";
import { useCubeRotation, useHashNavigation } from "@/hooks";

import { Cube, CubeNav } from "..";

const Outdoor: React.FC = () => {
  const rotation = useCubeRotation();
  useHashNavigation(rotation.activeFace, rotation.goTo);

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
      <Cube color="white" rotation={rotation} />
      <CubeNav activeFace={rotation.activeFace} onSelect={rotation.goTo} />
    </Flex>
  );
};

export default Outdoor;
