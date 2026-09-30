import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/concepts-api";

import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useConcepts } from "../../../hooks/useConcepts";
import { conceptsI18n } from "../../../i18n";
import { createTestQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: { getConceptExportZipType: vi.fn() },
}));

vi.mock("../../../hooks/useConcepts", () => ({
  useConcepts: vi.fn(),
}));

vi.mock(
  "../../../components/ExportButtons",
  () => import("../../../testing/export-buttons.testing"),
);

const renderExportPage = () =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <I18nextProvider i18n={conceptsI18n}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );

const selectedList = () => screen.getAllByRole("listbox")[1];

const exportConceptA = async () => {
  renderExportPage();
  fireEvent.click(
    within(screen.getAllByRole("listbox")[0]).getByRole("option", { name: "Concept A" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
  fireEvent.click(screen.getByTestId("export-ods"));
  return screen.findByText(/L'export a échoué/);
};

describe("Export de concepts qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useConcepts as Mock).mockReturnValue({
      concepts: [
        { id: "1", label: "Concept A" },
        { id: "2", label: "Concept B" },
      ],
      isLoading: false,
    });
    (ConceptsApi.getConceptExportZipType as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "L'export a échoué" }),
    );
  });

  it("affiche le message du serveur", async () => {
    await exportConceptA();
  });

  it("conserve la sélection et laisse l'export de nouveau utilisable", async () => {
    await exportConceptA();

    expect(within(selectedList()).getByRole("option", { name: "Concept A" })).toBeInTheDocument();
    expect(screen.getByTestId("disabled-state")).toHaveTextContent("false");
  });
});
