import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { FACES_DATA, NAV_ORDER } from "@/constants/faces";

import { CubeNavProps } from "./types";

const CubeNav: React.FC<CubeNavProps> = ({ activeFace, onSelect }) => (
  <Flex
    as="nav"
    aria-label="Seções"
    wrap="wrap"
    justifyContent="center"
    gap="1"
  >
    {NAV_ORDER.map((face) => {
      const isActive = face === activeFace;

      return (
        <Button
          key={face}
          size="sm"
          variant={isActive ? "solid" : "ghost"}
          colorPalette="teal"
          // Preto sobre teal claro: contraste AA (o branco sobre teal.600 não atinge).
          {...(isActive && { bg: "teal.300", color: "black" })}
          fontFamily="inherit"
          aria-current={isActive ? "page" : undefined}
          onClick={() => onSelect(face)}
        >
          {FACES_DATA[face].label}
        </Button>
      );
    })}
  </Flex>
);

export default CubeNav;
