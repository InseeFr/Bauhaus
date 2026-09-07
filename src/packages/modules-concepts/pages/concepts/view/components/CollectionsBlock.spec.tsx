import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { CollectionsBlock } from "./CollectionsBlock";

const useCollections = vi.fn();
vi.mock("../../../../hooks/useCollections", () => ({
  useCollections: () => useCollections(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { size: number }) => `${key}:${options?.size}`,
  }),
}));

const collections = [
  { id: "col-1", label: { value: "Collection A" } },
  { id: "col-2", label: { value: "Collection B" } },
];

const renderBlock = (collectionsIds?: string[]) =>
  render(
    <MemoryRouter>
      <CollectionsBlock collectionsIds={collectionsIds} />
    </MemoryRouter>,
  );

describe("CollectionsBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCollections.mockReturnValue({ data: collections });
  });

  it("rend un lien par collection du concept", () => {
    renderBlock(["col-1", "col-2"]);

    expect(screen.getByRole("link", { name: "Collection A" })).toHaveAttribute(
      "href",
      "/concepts/collections/col-1",
    );
    expect(screen.getByRole("link", { name: "Collection B" })).toBeInTheDocument();
  });

  it("compte les collections dans le titre", () => {
    renderBlock(["col-1"]);

    expect(screen.getByText("concept.general.collectionsListTitle:1")).toBeInTheDocument();
  });

  it("ignore une collection inconnue du référentiel", () => {
    renderBlock(["col-1", "col-inconnue"]);

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("ne rend rien quand le concept n'appartient à aucune collection", () => {
    const { container } = renderBlock([]);

    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien quand aucune collection n'est passée", () => {
    const { container } = renderBlock();

    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien tant que le référentiel des collections n'est pas chargé", () => {
    useCollections.mockReturnValue({ data: undefined });

    const { container } = renderBlock(["col-1"]);

    expect(container).toBeEmptyDOMElement();
  });
});
