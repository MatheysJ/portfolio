import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import ArrowButton from "@/components/Common/ArrowButton";
import { DIRECTIONS } from "@/constants/directions";
import { FACES_DATA } from "@/constants/faces";
import { FACE_SCROLL_ATTRIBUTE } from "@/hooks/useCubeRotation/useFaceScroller";
import { getFaceTitle } from "@/utils/faces";

import { CubeFaceProps } from "./types";
import { FaceContext } from "./context";
import * as S from "./styles";

const ARROWS = Object.values(DIRECTIONS);

const Face: React.FC<CubeFaceProps> = ({
  children,
  background,
  color,
  face,
  onTurn,
  isActive,
  contentAngle = 0,
  title = getFaceTitle(face),
  titleAs = "h2",
}) => {
  const { label, slug } = FACES_DATA[face];

  return (
    <FaceContext.Provider value={{ isActive }}>
      <S.Face
        background={background}
        color={color}
        face={face}
        $isActive={isActive}
        id={slug}
        aria-label={label}
      >
        <Box
          position="absolute"
          inset="0"
          transform={`rotate(${contentAngle}deg)`}
        >
          <Box display="contents" inert={!isActive}>
            {ARROWS.map((direction) => (
              <ArrowButton
                key={direction}
                direction={direction}
                onClick={onTurn}
              />
            ))}
          </Box>

          <Flex h="100%" direction="column" px="9" py="8" gap="3">
            <Text
              as={titleAs}
              fontSize="max(22px, 7cqi)"
              lineHeight="1"
              letterSpacing="tight"
            >
              {title}
            </Text>
            <Flex
              direction="column"
              flex="1"
              minH="0"
              overflowY="auto"
              overscrollBehavior="contain"
              {...{ [FACE_SCROLL_ATTRIBUTE]: "" }}
              fontSize="max(12px, 3.1cqi)"
              lineHeight="1.45"
              css={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--chakra-colors-teal-500) transparent",
              }}
            >
              {children}
            </Flex>
          </Flex>
        </Box>
      </S.Face>
    </FaceContext.Provider>
  );
};

export default Face;
