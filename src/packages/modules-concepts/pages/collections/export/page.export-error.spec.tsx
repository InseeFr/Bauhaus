import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { CollectionApi } from "@sdk/collection-api";

import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useCollections } from "../../../hooks/useCollections";
import { conceptsI18n } from "../../../i18n";
import { createTestQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

vi.mock("@sdk/collection-api", () => ({
  CollectionApi: { getCollectionExportByType: vi.fn(), getCollectionExportZipByType: vi.fn() },
}));

vi.mock("../../../hooks/useCollections", () => ({
  useCollections: vi.fn(),
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

const exportCollectionA = () => {
  renderExportPage();
  fireEvent.click(
    within(screen.getAllByRole("listbox")[0]).getByRole("option", { name: "Collection A" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
  fireEvent.click(screen.getByTestId("export-odt"));
};

describe("Export de collections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCollections as Mock).mockReturnValue({
      data: [
        { id: "c1", label: { value: "Collection A" } },
        { id: "c2", label: { value: "Collection B" } },
      ],
      isLoading: false,
    });
  });

  it("affiche l'indicateur de chargement pendant l'export", async () => {
    (CollectionApi.getCollectionExportByType as Mock).mockReturnValue(new Promise(() => {}));

    exportCollectionA();

    expect(await screen.findByText("Export in progress...")).toBeInTheDocument();
  });

  describe("qui échoue", () => {
    beforeEach(() => {
      (CollectionApi.getCollectionExportByType as Mock).mockRejectedValue(
        sdkRejection.json(500, { message: "L'export a échoué" }),
      );
    });

    it("affiche le message du serveur", async () => {
      exportCollectionA();

      expect(await screen.findByText(/L'export a échoué/)).toBeInTheDocument();
    });

    it("conserve la sélection et laisse l'export de nouveau utilisable", async () => {
      exportCollectionA();
      await screen.findByText(/L'export a échoué/);

      expect(
        within(selectedList()).getByRole("option", { name: "Collection A" }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("disabled-state")).toHaveTextContent("false");
    });
  });

  it("affiche un message quand la réponse ne donne pas le nom du fichier", async () => {
    (CollectionApi.getCollectionExportByType as Mock).mockResolvedValue(new Response("contenu"));

    exportCollectionA();

    expect(
      await screen.findByText(/The exported file could not be downloaded/),
    ).toBeInTheDocument();
  });
});
