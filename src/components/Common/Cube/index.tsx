import React from "react";
import { FACES } from "@/constants/faces";

import {
  CubeContact,
  CubeEducation,
  CubeExperiences,
  CubeFront,
  CubeProjects,
  CubeTools,
} from "./components";
import * as S from "./styles";
import { CubeProps } from "./types";

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

  const getFaceProps = (face: FACES) => ({
    color,
    background,
    onTurn: turn,
    isActive: activeFace === face,
    contentAngle: contentAngles[face],
  });

  return (
    <S.Container {...dragHandlers}>
      <S.Scene $isTurning={isTurning}>
        <S.Cube
          ref={cubeRef}
          style={cubeStyle}
        >
          <CubeFront {...getFaceProps(FACES.FRONT)} />
          <CubeExperiences {...getFaceProps(FACES.RIGHT)} />
          <CubeTools {...getFaceProps(FACES.BACK)} />
          <CubeContact {...getFaceProps(FACES.LEFT)} />
          <CubeProjects {...getFaceProps(FACES.TOP)} />
          <CubeEducation {...getFaceProps(FACES.BOTTOM)} />
        </S.Cube>
      </S.Scene>
    </S.Container>
  );
};

export default Cube;
