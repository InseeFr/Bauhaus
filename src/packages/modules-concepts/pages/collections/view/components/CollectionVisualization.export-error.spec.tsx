import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { Mock, vi } from "vitest";

import { CollectionGeneral } from "@model/concepts/collection";
import { UNPUBLISHED } from "@model/ValidationState";

import { CollectionApi } from "@sdk/collection-api";

import { sdkRejection } from "../../../../../tests/sdk-rejection.testing";
import { conceptsI18n } from "../../../../i18n";
import { createTestQueryClient } from "../../../../testing/query-client.testing";
import { CollectionVisualization } from "./CollectionVisualization";

vi.mock("@sdk/collection-api", () => ({
  CollectionApi: { getCollectionExportByType: vi.fn(), getCollectionExportZipByType: vi.fn() },
}));

// Les boutons soumis à droits interrogent l'API des utilisateurs ; seul l'export sert ici.
vi.mock("../../../../../auth/components/auth", () => ({
  HasAccess: () => null,
}));

vi.mock("@components/check-second-lang", () => ({
  CheckSecondLang: () => null,
}));

vi.mock(
  "../../../../components/ExportButtons",
  () => import("../../../../testing/export-buttons.testing"),
);

const GENERAL: CollectionGeneral = {
  id: "c1",
  prefLabelLg1: "Collection A",
  creator: "",
  validationState: UNPUBLISHED,
};
const NO_MEMBERS: never[] = [];

const renderCollection = () =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <I18nextProvider i18n={conceptsI18n}>
        <MemoryRouter>
          <CollectionVisualization
            id="c1"
            general={GENERAL}
            members={NO_MEMBERS}
            validateCollection={vi.fn()}
            secondLang={false}
          />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );

describe("Export d'une collection depuis sa fiche qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (CollectionApi.getCollectionExportByType as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "L'export a échoué" }),
    );
  });

  it("affiche le message du serveur et laisse l'export de nouveau utilisable", async () => {
    renderCollection();

    fireEvent.click(screen.getByTestId("export-odt"));

    expect(await screen.findByText(/L'export a échoué/)).toBeInTheDocument();
    expect(screen.getByTestId("export-odt")).toBeEnabled();
  });
});
