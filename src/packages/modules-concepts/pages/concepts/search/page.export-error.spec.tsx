import { fireEvent, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { renderWithRouter } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { Component } from "./page";

vi.mock("@sdk/index", () => ({
  ConceptsApi: { getConceptSearchList: vi.fn(), getConceptExportZipType: vi.fn() },
}));

// Champs de recherche alimentés par des référentiels : sans objet pour l'export.
vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => null,
}));

vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => null,
}));

vi.mock(
  "../../../components/ExportButtons",
  () => import("../../../testing/export-buttons.testing"),
);

describe("Export depuis la recherche avancée qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ConceptsApi.getConceptSearchList as Mock).mockResolvedValue([{ id: "1", label: "Concept A" }]);
    (ConceptsApi.getConceptExportZipType as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "L'export a échoué" }),
    );
  });

  it("affiche le message du serveur et laisse l'export de nouveau utilisable", async () => {
    renderWithRouter(<Component />);

    fireEvent.click(await screen.findByTestId("export-ods"));

    expect(await screen.findByText(/L'export a échoué/)).toBeInTheDocument();
    expect(screen.getByTestId("export-ods")).toBeEnabled();
  });
});
