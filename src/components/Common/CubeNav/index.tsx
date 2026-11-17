import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { FACES_DATA, FACE_ORDER } from "@/constants/faces";

import { CubeNavProps } from "./types";

const CubeNav: React.FC<CubeNavProps> = ({ activeFace, onSelect }) => (
  <Flex
    as="nav"
    aria-label="Seções"
    wrap="wrap"
    justifyContent="center"
    gap="1"
  >
    {FACE_ORDER.map((face) => {
      const isActive = face === activeFace;
      const { label, slug } = FACES_DATA[face];

      return (
        <Button
          key={face}
          asChild
          size="sm"
          variant={isActive ? "solid" : "ghost"}
          colorPalette="teal"
          fontFamily="inherit"
          {...(isActive && { bg: "teal.300", color: "black" })}
        >
          <a
            href={`#${slug}`}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onSelect(face);
            }}
          >
            {label}
          </a>
        </Button>
      );
    })}
  </Flex>
);

export default CubeNav;
