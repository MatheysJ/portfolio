import React from "react";

import { createEmbers } from "./particles";
import * as S from "./styles";

const EMBERS = createEmbers();

const Embers: React.FC = () => (
  <S.Field aria-hidden>
    {EMBERS.map(({ left, size, duration, delay, drift }, index) => (
      <S.Ember
        key={index}
        $drift={drift}
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    ))}
  </S.Field>
);

export default Embers;
