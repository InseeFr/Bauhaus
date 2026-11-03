import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const dataset = {
  id: "jd1000",
  validationState: "Validated",
  labelLg1: "",
  labelLg2: "",
  altIdentifier: "rp-2026",
  disseminationStatus: "http://status/public",
  wasGeneratedIRIs: ["http://serie/s1"],
  catalogRecord: { creator: "INSEE", contributor: ["DG75-L001"] },
};

vi.mock("../../../hooks/useDataset", () => ({
  useDataset: () => ({ data: dataset, status: "success" }),
}));

vi.mock("@sdk/datasets-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/datasets-api")>()),
  DatasetsApi: { putDataset: vi.fn(), getArchivageUnits: vi.fn(() => Promise.resolve([])) },
}));
vi.mock("@sdk/codelists-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/codelists-api")>()),
  fetchCodelist: vi.fn(() => Promise.resolve({ codes: [] })),
}));
vi.mock("@sdk/themes-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/themes-api")>()),
  ThemesApi: { getThemes: vi.fn(() => Promise.resolve([])) },
}));
vi.mock("@sdk/organizations-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/organizations-api")>()),
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

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

const type = (id: string, value: string) =>
  fireEvent.change(document.getElementById(id)!, { target: { value } });

// Après un enregistrement refusé par la validation, le bouton ne se réactive que lorsque tous les
// champs obligatoires sont renseignés, comme pour les concepts.
describe("réactivation du bouton Sauvegarder d'un jeu de données", () => {
  it("reste désactivé quand seul un champ facultatif est modifié", async () => {
    renderEdition();
    await save();

    type("subtitleLg1", "Sous-titre");

    expect(saveButton()).toBeDisabled();
  });

  it("reste désactivé tant qu'un intitulé obligatoire est vide", async () => {
    renderEdition();
    await save();

    type("labelLg1", "Recensement");

    expect(saveButton()).toBeDisabled();
    expect(document.getElementById("labelLg1")).not.toHaveAttribute("aria-invalid", "true");
    expect(document.getElementById("labelLg2")).toHaveAttribute("aria-invalid", "true");
  });

  it("se réactive dès que tous les champs obligatoires sont renseignés", async () => {
    renderEdition();
    await save();

    type("labelLg1", "Recensement");
    type("labelLg2", "Census");

    expect(saveButton()).toBeEnabled();
  });
});
