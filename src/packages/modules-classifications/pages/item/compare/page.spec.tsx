import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => params(),
}));

const useClassificationItem = vi.fn();
vi.mock("../../../hooks/useClassificationItem", () => ({
  useClassificationItem: (classificationId: string, itemId: string) =>
    useClassificationItem(classificationId, itemId),
}));

vi.mock("./components/Compare", () => ({
  Compare: ({ classificationId, general, notes, secondLang }: any) => (
    <div>
      <span>classification:{classificationId}</span>
      <span>poste:{general.prefLabelLg1}</span>
      <span>notes:{notes.definitionLg1}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  ),
}));

const renderPage = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Classification item compare page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ classificationId: "nafr2", itemId: "01" });
    useClassificationItem.mockReturnValue({
      isLoading: false,
      item: { general: { prefLabelLg1: "Agriculture" }, notes: { definitionLg1: "Définition" } },
    });
  });

  it("compare le poste demandé dans l'URL", () => {
    renderPage();

    expect(screen.getByText("classification:nafr2")).toBeInTheDocument();
    expect(screen.getByText("poste:Agriculture")).toBeInTheDocument();
    expect(screen.getByText("notes:Définition")).toBeInTheDocument();
    expect(useClassificationItem).toHaveBeenCalledWith("nafr2", "01");
  });

  it("affiche le chargement tant que le poste n'est pas là", () => {
    useClassificationItem.mockReturnValue({ isLoading: true, item: undefined });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("interroge avec des identifiants vides quand l'URL n'en porte pas", () => {
    params.mockReturnValue({});
    renderPage();

    expect(useClassificationItem).toHaveBeenCalledWith("", "");
  });
});
