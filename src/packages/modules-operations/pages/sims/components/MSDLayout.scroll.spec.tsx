import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MSDLayout } from "./MSDLayout";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Tout le sommaire est déplié : chaque section et chaque sous-bloc est monté.
vi.mock("../utils/isOpen", () => ({ isOpen: () => true }));

const rubric = (idMas: string, children: Record<string, any> = {}) => ({
  idMas,
  masLabelBasedOnCurrentLang: `libellé ${idMas}`,
  children,
});

const metadataStructure = {
  "S.1": rubric("S.1", { "S.1.1": rubric("S.1.1") }),
  "S.3": rubric("S.3", { "S.3.1": rubric("S.3.1", { "S.3.1.1": rubric("S.3.1.1") }) }),
} as any;

/** Le formulaire porte une ancre par rubrique, comme `AdvancedSimsCreation`. */
const Content = () => (
  <>
    {["S.1", "S.1.1", "S.3", "S.3.1", "S.3.1.1"].map((id) => (
      <div key={id} id={id} data-testid={`rubrique-${id}`} />
    ))}
  </>
);

const renderLayout = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/sims/*",
        element: (
          <MSDLayout
            metadataStructure={metadataStructure}
            storeCollapseState
            baseUrl="/sims/"
            disableSectionAnchor={false}
          >
            <Content />
          </MSDLayout>
        ),
      },
    ],
    { initialEntries: ["/sims/"] },
  );
  render(<RouterProvider router={router} />);
};

describe("MSDLayout — défilement vers une rubrique", () => {
  const scrolled: Element[] = [];

  beforeEach(() => {
    scrolled.length = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    Element.prototype.scrollIntoView = vi.fn(function (this: Element) {
      scrolled.push(this);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("fait défiler une seule fois, même quand tout le sommaire est déplié", async () => {
    renderLayout();

    await userEvent.click(screen.getByRole("button", { name: "S.3.1 - libellé S.3.1" }));

    expect(scrolled).toHaveLength(1);
  });

  it("amène la rubrique du formulaire, pas le bouton qui la déplie dans le sommaire", async () => {
    renderLayout();

    await userEvent.click(screen.getByRole("button", { name: "S.3.1 - libellé S.3.1" }));

    expect(scrolled[0]).toBe(screen.getByTestId("rubrique-S.3.1"));
  });

  it("ne donne à aucun élément du sommaire l'identifiant d'une rubrique", () => {
    renderLayout();

    expect(document.querySelectorAll("[id='S.3.1']")).toHaveLength(1);
  });
});
