import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DistributionApi } from "@sdk/distributions-api";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const distribution = {
  id: "d1000",
  idDataset: "jd1000",
  labelLg1: "Fichier détail",
  labelLg2: "Detailed file",
  accessUrl: "https://www.insee.fr/fr/statistiques/1",
  url: "https://www.insee.fr/fr/statistiques/fichier/1.zip",
};

vi.mock("@sdk/distributions-api", () => ({
  DistributionApi: {
    getById: vi.fn(() => Promise.resolve(distribution)),
    getDatasets: vi.fn(() => Promise.resolve([{ id: "jd1000", label: "Recensement" }])),
    putDistribution: vi.fn(),
  },
}));

vi.mock("@components/rich-editor/react-md-editor", () => ({ MDEditor: () => null }));

vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => vi.fn() }));

const NO_PROPERTIES = {} as any;

const renderEdition = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/datasets/distributions/d1000/modify"]}>
          <Routes>
            <Route path="/datasets/distributions/:id/modify" Component={Component} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

const save = async () =>
  userEvent.click(await screen.findByRole("button", { name: /save|sauvegarder/i }));

describe("modification d'une distribution refusée par le serveur", () => {
  beforeEach(() => {
    vi.mocked(DistributionApi.putDistribution).mockReset();
  });

  it.each([
    ["labelLg1", distribution.labelLg1],
    ["labelLg2", distribution.labelLg2],
    ["accessUrl", distribution.accessUrl],
    ["url", distribution.url],
  ])("affiche l'erreur de %s sous sa saisie", async (field, value) => {
    vi.mocked(DistributionApi.putDistribution).mockRejectedValue({
      status: 400,
      errors: [{ field, message: "Erreur du serveur." }],
    });
    renderEdition();

    await save();

    const input = await screen.findByDisplayValue(value);
    await waitFor(() => expect(input).toHaveAccessibleDescription("Erreur du serveur."));
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(/Erreur du serveur/, { selector: "li" })).toBeNull();
  });

  it("affiche l'erreur du jeu de données sous sa saisie, pas dans le bandeau", async () => {
    vi.mocked(DistributionApi.putDistribution).mockRejectedValue({
      status: 400,
      errors: [{ field: "idDataset", message: "Ce champ est obligatoire." }],
    });
    const { container } = renderEdition();

    await save();

    await waitFor(() =>
      expect(container.querySelector("#idDataset-error")).toHaveTextContent(
        "Ce champ est obligatoire.",
      ),
    );
    expect(screen.queryByText(/Ce champ est obligatoire/, { selector: "li" })).toBeNull();
  });

  it("affiche dans le bandeau une erreur sur un champ sans emplacement", async () => {
    vi.mocked(DistributionApi.putDistribution).mockRejectedValue({
      status: 400,
      errors: [{ field: "byteSize", message: "Doit être positif." }],
    });
    renderEdition();

    await save();

    expect(await screen.findByRole("alert")).toHaveTextContent("Doit être positif.");
    expect(await screen.findByDisplayValue(distribution.labelLg1)).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
