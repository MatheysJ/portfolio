import { FACES, FACES_DATA } from "@/constants/faces";

import { getFaceBySlug, getFaceHash, getFaceTitle } from "./faces";

describe("utils/faces", () => {
  it("finds each face by slug and ignores unknown slugs", () => {
    Object.values(FACES).forEach((face) =>
      expect(getFaceBySlug(FACES_DATA[face].slug)).toBe(face),
    );
    expect(getFaceBySlug("")).toBeUndefined();
    expect(getFaceBySlug("nao-existe")).toBeUndefined();
  });

  it("leaves the initial face without a hash", () => {
    expect(getFaceHash(FACES.FRONT)).toBe("");
    expect(getFaceHash(FACES.RIGHT)).toBe("#experiencia");
  });

  it("uses the uppercased section name as the title", () => {
    expect(getFaceTitle(FACES.BOTTOM)).toBe("FORMAÇÃO");
    expect(getFaceTitle(FACES.RIGHT)).toBe("EXPERIÊNCIA");
  });
});
