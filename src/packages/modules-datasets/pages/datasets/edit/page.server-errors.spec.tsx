import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatasetsApi } from "@sdk/index";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const dataset = {
  id: "jd1000",
  validationState: "Validated",
  labelLg1: "Recensement",
  labelLg2: "Census",
  altIdentifier: "rp-2026",
  disseminationStatus: "http://status/public",
  wasGeneratedIRIs: ["http://serie/s1"],
  catalogRecord: { creator: "INSEE", contributor: ["DG75-L001"] },
};

vi.mock("../../../hooks/useDataset", () => ({
  useDataset: () => ({ data: dataset, status: "success" }),
}));

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  DatasetsApi: { putDataset: vi.fn(), getArchivageUnits: vi.fn(() => Promise.resolve([])) },
  fetchCodelist: vi.fn(() => Promise.resolve({ codes: [] })),
  ThemesApi: { getThemes: vi.fn(() => Promise.resolve([])) },
  OrganizationsApi: { getOrganizations: vi.fn(() => Promise.resolve([])) },
}));

vi.mock("../../../hooks/useSeriesOperationsOptions", () => ({
  useSeriesOperationsOptions: () => [],
}));

// Saisies métier sans rapport avec les erreurs de champ : elles lisent leurs options par d'autres
// API. Les emplacements d'erreur sont rendus à côté d'elles, par le panneau.
vi.mock("@components/business/creators-input", () => ({ CreatorsInput: () => null }));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => null,
}));
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => null,
}));

// Onglets sans emplacement d'erreur serveur.
vi.mock("./components/Notes", () => ({ Notes: () => null }));
vi.mock("./components/StatisticalInformation", () => ({ StatisticalInformation: () => null }));
vi.mock("./components/Lineage", () => ({ Lineage: () => null }));

vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => vi.fn() }));

const NO_PROPERTIES = {} as any;

const renderEdition = (section = "globalInformation") =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/datasets/jd1000/modify?section=${section}`]}>
          <Routes>
            <Route path="/datasets/:id/modify" Component={Component} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

const save = () => userEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

describe("modification d'un jeu de données refusée par le serveur", () => {
  beforeEach(() => {
    vi.mocked(DatasetsApi.putDataset).mockReset();
  });

  it("affiche l'erreur d'un intitulé sous sa saisie", async () => {
    vi.mocked(DatasetsApi.putDataset).mockRejectedValue({
      status: 400,
      errors: [{ field: "labelLg2", message: "3 caractères maximum." }],
    });
    renderEdition();

    await save();

    const label = await screen.findByDisplayValue(dataset.labelLg2);
    await waitFor(() => expect(label).toHaveAccessibleDescription("3 caractères maximum."));
    expect(label).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche dans le bandeau une erreur sur un champ sans emplacement", async () => {
    vi.mocked(DatasetsApi.putDataset).mockRejectedValue({
      status: 400,
      errors: [{ field: "observationNumber", message: "Doit être positif." }],
    });
    renderEdition();

    await save();

    expect(await screen.findByRole("alert")).toHaveTextContent("Doit être positif.");
    expect(await screen.findByDisplayValue(dataset.labelLg1)).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("affiche l'erreur de l'identifiant alternatif sous sa saisie", async () => {
    vi.mocked(DatasetsApi.putDataset).mockRejectedValue({
      status: 400,
      errors: [{ field: "altIdentifier", message: "Caractères interdits." }],
    });
    renderEdition("internalManagement");

    await save();

    const altIdentifier = await screen.findByDisplayValue(dataset.altIdentifier);
    await waitFor(() => expect(altIdentifier).toHaveAccessibleDescription("Caractères interdits."));
    expect(altIdentifier).toHaveAttribute("aria-invalid", "true");
  });

  // Le back nomme les champs du catalogRecord par leur chemin, le formulaire par leur seul nom.
  it.each([
    ["catalogRecord.creator", "creator-error"],
    ["catalogRecord.contributor", "contributor-error"],
    ["disseminationStatus", "disseminationStatus-error"],
  ])("affiche l'erreur %s sous sa saisie, pas dans le bandeau", async (field, slotId) => {
    vi.mocked(DatasetsApi.putDataset).mockRejectedValue({
      status: 400,
      errors: [{ field, message: "Ce champ est obligatoire." }],
    });
    const { container } = renderEdition("internalManagement");

    await save();

    await waitFor(() =>
      expect(container.querySelector(`#${slotId}`)).toHaveTextContent("Ce champ est obligatoire."),
    );
    expect(screen.queryByText(/Ce champ est obligatoire/, { selector: "li" })).toBeNull();
  });

  it("signale l'onglet de gestion interne quand il porte une erreur sans être affiché", async () => {
    vi.mocked(DatasetsApi.putDataset).mockRejectedValue({
      status: 400,
      errors: [{ field: "catalogRecord.creator", message: "Ce champ est obligatoire." }],
    });
    renderEdition();

    await save();

    const entry = await screen.findByRole("button", { name: /^Internal management/ });
    await waitFor(() => expect(entry).toHaveTextContent("Internal managementTo fix"));
  });
});
