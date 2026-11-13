import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const distribution = {
  id: "d1000",
  idDataset: "jd1000",
  labelLg1: "",
  labelLg2: "",
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

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

const type = (input: HTMLElement, value: string) => fireEvent.change(input, { target: { value } });

const label = (id: string) => document.getElementById(id)!;

// Après un enregistrement refusé par la validation, le bouton ne se réactive que lorsque tous les
// champs obligatoires sont renseignés, comme pour les concepts.
describe("réactivation du bouton Sauvegarder d'une distribution", () => {
  it("reste désactivé quand seul un champ facultatif est modifié", async () => {
    renderEdition();
    await save();

    type(screen.getByDisplayValue(distribution.accessUrl), "https://www.insee.fr/fr/accueil");

    expect(saveButton()).toBeDisabled();
  });

  it("reste désactivé tant qu'un intitulé obligatoire est vide", async () => {
    renderEdition();
    await save();

    type(label("labelLg1"), "Fichier détail");

    expect(saveButton()).toBeDisabled();
    expect(label("labelLg1")).not.toHaveAttribute("aria-invalid", "true");
    expect(label("labelLg2")).toHaveAttribute("aria-invalid", "true");
  });

  it("se réactive dès que tous les champs obligatoires sont renseignés", async () => {
    renderEdition();
    await save();

    type(label("labelLg1"), "Fichier détail");
    type(label("labelLg2"), "Detailed file");

    expect(saveButton()).toBeEnabled();
  });
});
