import { buildPersonJsonLd, getPageUrl } from "@/config/seo";

import {
  DEFAULT_LOCALE,
  LOCALES,
  getDictionary,
  getLocalePath,
  parseLocale,
} from ".";

type Shape = string | Shape[] | { [key: string]: Shape };

const shapeOf = (value: unknown): Shape => {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, shapeOf(entry)]),
    );
  }
  return typeof value;
};

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
};

describe("parseLocale", () => {
  it.each([
    ["en", "en"],
    ["EN", "en"],
    ["en-US", "en"],
    [" en-gb ", "en"],
    [["en", "pt-BR"], "en"],
  ])("reads %j as English", (value, expected) => {
    expect(parseLocale(value)).toBe(expected);
  });

  it.each([undefined, "", "pt", "pt-BR", "fr", "english", []])(
    "falls back to Portuguese for %j",
    (value) => {
      expect(parseLocale(value)).toBe(DEFAULT_LOCALE);
    },
  );
});

describe("dictionaries", () => {
  it("have the same structure in every locale", () => {
    const reference = shapeOf(getDictionary(DEFAULT_LOCALE));
    LOCALES.forEach((locale) =>
      expect(shapeOf(getDictionary(locale))).toEqual(reference),
    );
  });

  it("have no empty texts", () => {
    LOCALES.forEach((locale) =>
      collectStrings(getDictionary(locale)).forEach((text) =>
        expect(text.trim()).not.toBe(""),
      ),
    );
  });

  it("translate the visible texts to English", () => {
    const en = getDictionary("en");
    expect(en.faces.FRONT).toBe("Home");
    expect(en.profile.jobTitle).toBe("Full Stack Software Engineer");
    expect(en.ui.interactionHint).not.toBe(
      getDictionary("pt-BR").ui.interactionHint,
    );
  });
});

describe("locale URLs", () => {
  it("keeps Portuguese at the root and English behind the query param", () => {
    expect(getLocalePath("pt-BR")).toBe("/");
    expect(getLocalePath("en")).toBe("/?lang=en");
    expect(getPageUrl("en")).toMatch(/\/\?lang=en$/);
  });

  it("builds the structured data in the requested language", () => {
    const jsonLd = buildPersonJsonLd(getDictionary("en"), "en");
    expect(jsonLd.jobTitle).toBe("Full Stack Software Engineer");
    expect(jsonLd.url).toBe(getPageUrl("en"));
  });
});
