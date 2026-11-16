import { FACES, FACES_DATA } from "@/constants/faces";

import { getFaceBySlug, getFaceHash, getFaceTitle } from "./faces";

describe("utils/faces", () => {
  it("encontra cada face pelo slug e ignora slugs desconhecidos", () => {
    Object.values(FACES).forEach((face) =>
      expect(getFaceBySlug(FACES_DATA[face].slug)).toBe(face),
    );
    expect(getFaceBySlug("")).toBeUndefined();
    expect(getFaceBySlug("nao-existe")).toBeUndefined();
  });

  it("deixa a face inicial sem hash", () => {
    expect(getFaceHash(FACES.FRONT)).toBe("");
    expect(getFaceHash(FACES.RIGHT)).toBe("#experiencia");
  });

  it("usa o nome da seção em maiúsculas como título", () => {
    expect(getFaceTitle(FACES.BOTTOM)).toBe("FORMAÇÃO");
    expect(getFaceTitle(FACES.RIGHT)).toBe("EXPERIÊNCIA");
  });
});
