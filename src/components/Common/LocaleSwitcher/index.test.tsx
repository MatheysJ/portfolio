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

const currentUrl = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/#stack");
    document.documentElement.lang = "";
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

  it("switches the language in place and keeps the URL in sync", () => {
    renderIn("pt-BR");

    fireEvent.click(screen.getByRole("link", { name: "English" }));

    expect(screen.getByRole("navigation", { name: "Language" })).toBeVisible();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(document.documentElement.lang).toBe("en");
    expect(currentUrl()).toBe("/?lang=en#stack");

    fireEvent.click(screen.getByRole("link", { name: "Português" }));

    expect(document.documentElement.lang).toBe("pt-BR");
    expect(currentUrl()).toBe("/#stack");
  });

  it("does nothing when the current language is clicked", () => {
    renderIn("pt-BR");
    const replaceState = jest.spyOn(window.history, "replaceState");

    fireEvent.click(screen.getByRole("link", { name: "Português" }));

    expect(replaceState).not.toHaveBeenCalled();
    replaceState.mockRestore();
  });
});
