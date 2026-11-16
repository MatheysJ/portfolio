import React from "react";
import { FACE_ORDER, FACES } from "@/constants/faces";

import {
  CubeContact,
  CubeEducation,
  CubeExperiences,
  CubeFaceContentProps,
  CubeFront,
  CubeProjects,
  CubeTools,
} from "./components";
import * as S from "./styles";
import { CubeProps } from "./types";

/** Conteúdo exibido em cada face do cubo. */
const FACE_CONTENT: Record<FACES, React.FC<CubeFaceContentProps>> = {
  [FACES.FRONT]: CubeFront,
  [FACES.RIGHT]: CubeExperiences,
  [FACES.TOP]: CubeProjects,
  [FACES.BACK]: CubeTools,
  [FACES.BOTTOM]: CubeEducation,
  [FACES.LEFT]: CubeContact,
};

const Cube: React.FC<CubeProps> = ({ color, background, rotation }) => {
  const {
    activeFace,
    contentAngles,
    isTurning,
    turn,
    cubeRef,
    cubeStyle,
    dragHandlers,
  } = rotation;

  return (
    <S.Container {...dragHandlers}>
      <S.Scene $isTurning={isTurning}>
        <S.Cube ref={cubeRef} style={cubeStyle}>
          {FACE_ORDER.map((face) => {
            const Content = FACE_CONTENT[face];
            return (
              <Content
                key={face}
                face={face}
                color={color}
                background={background}
                onTurn={turn}
                isActive={activeFace === face}
                contentAngle={contentAngles[face]}
              />
            );
          })}
        </S.Cube>
      </S.Scene>
    </S.Container>
  );
};

export default Cube;
