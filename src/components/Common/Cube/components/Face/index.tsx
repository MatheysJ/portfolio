import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ArrowButton } from "@/components/Common";
import { FACES_DATA } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

import { CubeFaceProps } from "./types";
import { FaceContext } from "./context";
import * as S from "./styles";

const Face: React.FC<CubeFaceProps> = ({
  children,
  background,
  color,
  face,
  onTurn,
  isActive,
  contentAngle = 0,
  title,
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
            <ArrowButton.Left onClick={() => onTurn(DIRECTIONS.LEFT)} />
            <ArrowButton.Right onClick={() => onTurn(DIRECTIONS.RIGHT)} />
            <ArrowButton.Up onClick={() => onTurn(DIRECTIONS.UP)} />
            <ArrowButton.Down onClick={() => onTurn(DIRECTIONS.DOWN)} />
          </Box>

          <Flex h="100%" direction="column" px="9" py="8" gap="3">
            {title && (
              <Text
                as={titleAs}
                fontSize="max(22px, 7cqi)"
                lineHeight="1"
                letterSpacing="tight"
              >
                {title}
              </Text>
            )}
            <Flex
              direction="column"
              flex="1"
              minH="0"
              overflowY="auto"
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
