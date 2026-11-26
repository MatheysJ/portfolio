import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { FACES_DATA, FACE_ORDER } from "@/constants/faces";
import { useDictionary } from "@/i18n";
import { getFaceBySlug } from "@/utils/faces";

import { CubeNavProps } from "./types";

const CubeNav: React.FC<CubeNavProps> = ({ activeFace, onSelect }) => {
  const { faces, ui } = useDictionary();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const face = getFaceBySlug(event.currentTarget.hash.slice(1));
    if (face) onSelect(face);
  };

  return (
    <Flex
      as="nav"
      aria-label={ui.sectionsNav}
      wrap="wrap"
      justifyContent="center"
      gap="1"
    >
      {FACE_ORDER.map((face) => {
        const isActive = face === activeFace;
        const label = faces[face];
        const { slug } = FACES_DATA[face];

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
              onClick={handleClick}
            >
              {label}
            </a>
          </Button>
        );
      })}
    </Flex>
  );
};

export default CubeNav;
