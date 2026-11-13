import React from "react";
import { FACES } from "@/constants/faces";
import { toRotationVars } from "@/hooks/useCubeRotation";

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

const Cube: React.FC<CubeProps> = ({ size, color, background, rotation }) => {
  const {
    coordinate,
    activeFace,
    capAngle,
    isTurning,
    turn,
    cubeRef,
    dragHandlers,
  } = rotation;

  const getFaceProps = (face: FACES) => ({
    size,
    color,
    background,
    onTurn: turn,
    isActive: activeFace === face,
  });

  return (
    <S.Container size={size} {...dragHandlers}>
      <S.Scene size={size} $isTurning={isTurning}>
        <S.Cube
          ref={cubeRef}
          style={toRotationVars(coordinate) as React.CSSProperties}
        >
          <CubeFront {...getFaceProps(FACES.FRONT)} />
          <CubeExperiences {...getFaceProps(FACES.RIGHT)} />
          <CubeTools {...getFaceProps(FACES.BACK)} />
          <CubeContact {...getFaceProps(FACES.LEFT)} />
          <CubeProjects
            {...getFaceProps(FACES.TOP)}
            contentAngle={capAngle}
          />
          <CubeEducation
            {...getFaceProps(FACES.BOTTOM)}
            contentAngle={-capAngle}
          />
        </S.Cube>
      </S.Scene>
    </S.Container>
  );
};

export default Cube;
