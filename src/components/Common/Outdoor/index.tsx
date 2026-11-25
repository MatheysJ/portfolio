import React from "react";
import { Flex } from "@chakra-ui/react";
import { useCubeRotation, useHashNavigation } from "@/hooks";

import Cube from "../Cube";
import CubeNav from "../CubeNav";
import Embers from "../Embers";
import LocaleSwitcher from "../LocaleSwitcher";

const Outdoor: React.FC = () => {
  const rotation = useCubeRotation();
  useHashNavigation(rotation.activeFace, rotation.goTo);

  return (
    <>
      <Embers />
      <LocaleSwitcher />
      <Flex
        as="main"
        position="relative"
        zIndex="1"
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
    </>
  );
};

export default Outdoor;
