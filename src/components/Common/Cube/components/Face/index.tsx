import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ArrowButton } from "@/components/Common";
import { FACES, FACES_DATA } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

import { CubeFaceProps } from "./types";
import * as S from "./styles";

const Face: React.FC<CubeFaceProps> = ({
  children,
  size,
  background,
  color,
  face,
  onTurn,
  isActive,
  contentAngle = 0,
  title,
}) => {
  const isTop = face === FACES.TOP;
  const isBottom = face === FACES.BOTTOM;
  const isOnRing = !isTop && !isBottom;

  return (
    <S.Face
      size={size}
      background={background}
      color={color}
      face={face}
      id={face}
      aria-label={FACES_DATA[face].label}
      // Faces fora de vista não recebem foco, cliques nem leitores de tela.
      inert={!isActive}
    >
      <Box
        position="absolute"
        inset="0"
        transform={`rotate(${contentAngle}deg)`}
      >
        {isOnRing && (
          <>
            <ArrowButton.Left onClick={() => onTurn(DIRECTIONS.LEFT)} />
            <ArrowButton.Right onClick={() => onTurn(DIRECTIONS.RIGHT)} />
          </>
        )}
        {!isTop && <ArrowButton.Up onClick={() => onTurn(DIRECTIONS.UP)} />}
        {!isBottom && (
          <ArrowButton.Down onClick={() => onTurn(DIRECTIONS.DOWN)} />
        )}

        <Flex h="100%" direction="column" px="9" py="8" gap="3">
          {title && (
            <Text
              as="h2"
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
  );
};

export default Face;
