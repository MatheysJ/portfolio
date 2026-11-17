import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

import {
  IDENTITY,
  Matrix,
  TURNS,
  fromQuaternion,
  getActiveFace,
  getContentAngle,
  getTurnToFace,
  isSameMatrix,
  multiply,
  rotationX,
  rotationY,
  slerp,
  toMatrix3d,
  toQuaternion,
  transform,
} from ".";

const ALL_DIRECTIONS = Object.values(DIRECTIONS);

const turnAll = (directions: DIRECTIONS[], start: Matrix = IDENTITY) =>
  directions.reduce((m, direction) => multiply(TURNS[direction], m), start);

const rotateOnScreen = ([x, y]: readonly number[], degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return [
    Math.round(x * Math.cos(radians) - y * Math.sin(radians)),
    Math.round(x * Math.sin(radians) + y * Math.cos(radians)),
  ];
};

const isActiveFaceUpright = (orientation: Matrix) => {
  const face = getActiveFace(orientation);
  const placement: Record<FACES, Matrix> = {
    [FACES.FRONT]: IDENTITY,
    [FACES.BACK]: rotationY(180),
    [FACES.RIGHT]: rotationY(90),
    [FACES.LEFT]: rotationY(-90),
    [FACES.TOP]: rotationX(90),
    [FACES.BOTTOM]: rotationX(-90),
  };
  const up = transform(multiply(orientation, placement[face]), [0, -1, 0]);
  const shown = rotateOnScreen(up, getContentAngle(face, orientation));
  return shown[0] === 0 && shown[1] === -1;
};

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe("turns", () => {
  it.each([
    [DIRECTIONS.RIGHT, FACES.RIGHT],
    [DIRECTIONS.LEFT, FACES.LEFT],
    [DIRECTIONS.UP, FACES.TOP],
    [DIRECTIONS.DOWN, FACES.BOTTOM],
  ])("%s from the start shows %s", (direction, face) => {
    expect(getActiveFace(turnAll([direction]))).toBe(face);
  });

  it("two turns in the same direction show the opposite face", () => {
    ALL_DIRECTIONS.forEach((direction) => {
      expect(getActiveFace(turnAll([direction, direction]))).toBe(FACES.BACK);
    });
  });

  it("four turns in the same direction return to the same face, from any position", () => {
    const random = seeded(42);

    for (let run = 0; run < 50; run++) {
      const start = turnAll(
        Array.from({ length: 6 }, () => ALL_DIRECTIONS[Math.floor(random() * 4)]),
      );

      ALL_DIRECTIONS.forEach((direction) => {
        const end = turnAll([direction, direction, direction, direction], start);
        expect(isSameMatrix(end, start)).toBe(true);
        expect(getActiveFace(end)).toBe(getActiveFace(start));
      });
    }
  });

  it("opposite turns cancel each other out", () => {
    expect(turnAll([DIRECTIONS.UP, DIRECTIONS.DOWN])).toEqual(IDENTITY);
    expect(turnAll([DIRECTIONS.LEFT, DIRECTIONS.RIGHT])).toEqual(IDENTITY);
  });

  it("keeps exact values (no floating-point residue)", () => {
    const m = turnAll([
      DIRECTIONS.UP,
      DIRECTIONS.RIGHT,
      DIRECTIONS.DOWN,
      DIRECTIONS.LEFT,
      DIRECTIONS.UP,
    ]);
    m.forEach((value) => expect([-1, 0, 1]).toContain(value));
  });
});

describe("getContentAngle", () => {
  it("keeps the content upright on simple turns", () => {
    expect(getContentAngle(FACES.TOP, turnAll([DIRECTIONS.UP]))).toBe(0);
    expect(getContentAngle(FACES.BOTTOM, turnAll([DIRECTIONS.DOWN]))).toBe(0);
    expect(getContentAngle(FACES.RIGHT, turnAll([DIRECTIONS.RIGHT]))).toBe(0);
  });

  it("straightens the top when reached from a side face", () => {
    const orientation = turnAll([DIRECTIONS.RIGHT, DIRECTIONS.UP]);
    expect(getActiveFace(orientation)).toBe(FACES.TOP);
    expect(getContentAngle(FACES.TOP, orientation)).toBe(270);
  });

  it("straightens a side face reached after passing through the top", () => {
    const orientation = turnAll([DIRECTIONS.UP, DIRECTIONS.RIGHT]);
    expect(isActiveFaceUpright(orientation)).toBe(true);
  });

  it("leaves the active face upright after any sequence of turns", () => {
    const random = seeded(7);

    for (let run = 0; run < 300; run++) {
      const orientation = turnAll(
        Array.from(
          { length: 1 + Math.floor(random() * 12) },
          () => ALL_DIRECTIONS[Math.floor(random() * 4)],
        ),
      );
      expect(isActiveFaceUpright(orientation)).toBe(true);
    }
  });
});

describe("getTurnToFace", () => {
  it("does not turn when the face is already in front", () => {
    expect(getTurnToFace(FACES.FRONT, IDENTITY)).toBeNull();
  });

  it("brings any face to the front from any orientation", () => {
    const random = seeded(3);

    for (let run = 0; run < 50; run++) {
      const start = turnAll(
        Array.from({ length: 5 }, () => ALL_DIRECTIONS[Math.floor(random() * 4)]),
      );

      Object.values(FACES).forEach((face) => {
        const turn = getTurnToFace(face, start);
        const end = turn ? multiply(turn, start) : start;
        expect(getActiveFace(end)).toBe(face);
      });
    }
  });

  it("uses a single 90° turn for neighboring faces", () => {
    expect(getTurnToFace(FACES.RIGHT, IDENTITY)).toEqual(TURNS[DIRECTIONS.RIGHT]);
    expect(getTurnToFace(FACES.TOP, IDENTITY)).toEqual(TURNS[DIRECTIONS.UP]);
  });
});

describe("quaternions", () => {
  it("convert matrix → quaternion → matrix losslessly", () => {
    const random = seeded(11);

    for (let run = 0; run < 50; run++) {
      const m = turnAll(
        Array.from({ length: 6 }, () => ALL_DIRECTIONS[Math.floor(random() * 4)]),
      );
      expect(isSameMatrix(fromQuaternion(toQuaternion(m)), m)).toBe(true);
    }
  });

  it("interpolate along the shortest path (90° turn, never 270°)", () => {
    // These orientations yield quaternions with a negative dot product.
    const from = turnAll([DIRECTIONS.UP, DIRECTIONS.UP]);
    const to = multiply(TURNS[DIRECTIONS.UP], from);

    const middle = fromQuaternion(
      slerp(toQuaternion(from), toQuaternion(to), 0.5),
    );
    const halfway = multiply(rotationX(-45), from);
    expect(isSameMatrix(middle, halfway)).toBe(true);
  });

  it("reach the exact target at the end of the interpolation", () => {
    const from = IDENTITY;
    const to = TURNS[DIRECTIONS.RIGHT];
    expect(
      isSameMatrix(
        fromQuaternion(slerp(toQuaternion(from), toQuaternion(to), 1)),
        to,
      ),
    ).toBe(true);
  });
});

describe("toMatrix3d", () => {
  it("outputs the identity in CSS format", () => {
    expect(toMatrix3d(IDENTITY)).toBe(
      "1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1",
    );
  });

  it("transposes the matrix (CSS reads column by column)", () => {
    expect(toMatrix3d(rotationY(90))).toBe(
      "0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1",
    );
  });
});
