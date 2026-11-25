import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/i18n";

import LocaleSwitcher from ".";

const renderIn = (locale: "pt-BR" | "en") =>
  render(
    <LocaleProvider locale={locale}>
      <LocaleSwitcher />
    </LocaleProvider>,
  );

describe("LocaleSwitcher", () => {
  const assign = jest.fn();
  const originalLocation = window.location;

  beforeEach(() => {
    assign.mockClear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, hash: "#stack", assign },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("links to each language with plain URLs that work without JavaScript", () => {
    renderIn("pt-BR");

    expect(screen.getByRole("link", { name: "Português" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/?lang=en",
    );
  });

  it("marks the current language and labels the menu in it", () => {
    renderIn("en");

    expect(screen.getByRole("navigation", { name: "Language" })).toBeVisible();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Português" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps the current face when switching languages", () => {
    renderIn("pt-BR");

    fireEvent.click(screen.getByRole("link", { name: "English" }));
    expect(assign).toHaveBeenCalledWith("/?lang=en#stack");
  });

  it("does nothing when the current language is clicked", () => {
    renderIn("pt-BR");

    fireEvent.click(screen.getByRole("link", { name: "Português" }));
    expect(assign).not.toHaveBeenCalled();
  });
});
