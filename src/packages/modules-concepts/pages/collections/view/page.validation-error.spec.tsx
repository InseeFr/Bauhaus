import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";
import { Mock, vi } from "vitest";

import { UNPUBLISHED } from "@model/ValidationState";

import { ConceptsApi } from "@sdk/index";
import { CollectionApi } from "@sdk/new-collection-api";

import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { conceptsI18n } from "../../../i18n";
import { createTestQueryClient } from "../../../testing/query-client.testing";
import { Component } from "./page";

vi.mock("@sdk/index", () => ({
  ConceptsApi: { putCollectionValidList: vi.fn() },
}));

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: { getCollectionById: vi.fn(), getCollectionMembersList: vi.fn() },
}));

// Seul le bouton de publication sert ici : les droits sont accordés sans interroger l'API.
vi.mock("../../../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: ReactNode }) => children,
  useAuthorizationGuard: () => false,
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: { defaultContributor: "defaultContributor" },
    secondLang: { value: false, toggle: vi.fn() },
  }),
}));

vi.mock("@components/check-second-lang", () => ({
  CheckSecondLang: () => null,
}));

const renderCollection = () =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <I18nextProvider i18n={conceptsI18n}>
        <MemoryRouter initialEntries={["/concepts/collections/c1"]}>
          <Routes>
            <Route path="/concepts/collections/:id" element={<Component />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );

describe("Publication d'une collection depuis sa fiche qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (CollectionApi.getCollectionById as Mock).mockResolvedValue({
      id: "c1",
      labels: [{ lang: "fr", value: "Collection A" }],
      validationState: UNPUBLISHED,
    });
    (CollectionApi.getCollectionMembersList as Mock).mockResolvedValue([]);
    (ConceptsApi.putCollectionValidList as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "La publication a échoué" }),
    );
  });

  it("affiche le message du serveur et laisse la collection publiable", async () => {
    renderCollection();

    fireEvent.click(await screen.findByRole("button", { name: "Publish" }));

    expect(await screen.findByText(/La publication a échoué/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeEnabled();
  });
});
