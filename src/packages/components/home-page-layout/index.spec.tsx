import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomePageLayout } from ".";

const MENU = <button type="button">Nouveau</button>;

describe("HomePageLayout", () => {
  it("displays the title of the page as its main heading", () => {
    render(
      <HomePageLayout title="Fichiers de données" menu={MENU}>
        <p>Liste</p>
      </HomePageLayout>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Fichiers de données" })).toBeVisible();
  });

  it("displays the menu and the content of the page", () => {
    render(
      <HomePageLayout title="Fichiers de données" menu={MENU}>
        <p>Liste</p>
      </HomePageLayout>,
    );

    expect(screen.getByRole("button", { name: "Nouveau" })).toBeVisible();
    expect(screen.getByText("Liste")).toBeVisible();
  });
});
