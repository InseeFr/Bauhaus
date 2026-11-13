import { fireEvent, screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { Mock, vi } from "vitest";

import { UNPUBLISHED } from "@model/ValidationState";

import { ConceptsApi } from "@sdk/index";

import { renderWithAppContext } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useConcept } from "../../../hooks/useConcept";
import { emptyConceptNotes } from "../../../utils/emptyConceptNotes";
import { Component } from "./page";

const PAGE = <Component />;

vi.mock("@sdk/index", () => ({
  ConceptsApi: { getConceptExport: vi.fn() },
}));

vi.mock("../../../hooks/useConcept", () => ({
  useConcept: vi.fn(),
}));

// Les boutons soumis à droits interrogent l'API des utilisateurs ; seul l'export sert ici.
vi.mock("../../../../auth/components/auth", () => ({
  HasAccess: () => null,
}));

// Contenu de la fiche, alimenté par des référentiels : sans objet pour l'export.
vi.mock("@components/check-second-lang", () => ({ CheckSecondLang: () => null }));
vi.mock("./components/ConceptGeneral", () => ({ ConceptGeneral: () => null }));
vi.mock("./components/ConceptLinks", () => ({ ConceptLinks: () => null }));

describe("Export d'un concept depuis sa fiche qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useConcept as Mock).mockReturnValue({
      data: {
        general: {
          id: "c1",
          prefLabelLg1: "Concept A",
          creator: "DG75-L201",
          validationState: UNPUBLISHED,
          conceptVersion: "1",
        },
        notes: emptyConceptNotes,
        links: [],
      },
      isLoading: false,
      refetch: vi.fn(),
    });
    (ConceptsApi.getConceptExport as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "L'export a échoué" }),
    );
  });

  it("affiche le message du serveur et laisse l'export de nouveau utilisable", async () => {
    renderWithAppContext(
      <Routes>
        <Route path="/" element={PAGE} />
      </Routes>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(await screen.findByText(/L'export a échoué/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeEnabled();
  });
});
