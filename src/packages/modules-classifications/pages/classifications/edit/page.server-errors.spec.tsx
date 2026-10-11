import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getClassificationGeneral: vi.fn(),
    getClassificationLevels: vi.fn(),
    getSeriesList: vi.fn(),
    putClassification: vi.fn(),
  },
}));

// Saisies sans rapport avec les erreurs de champ : elles lisent leurs options par d'autres API.
vi.mock("./components/ClassificationSelect", () => ({
  ClassificationSelect: () => <select aria-label="classification" />,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => null,
}));
vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => null,
}));
vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => null,
}));
vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: () => null,
}));

const general = {
  id: "nafr2",
  prefLabelLg1: "Nomenclature d'activités française",
  prefLabelLg2: "French classification of activities",
  homepage: "https://www.insee.fr",
};

const NO_PROPERTIES = {} as any;
const EDITION_ENTRIES = ["/classifications/classification/nafr2/modify"];

const renderEdition = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={EDITION_ENTRIES}>
          <Routes>
            <Route path="/classifications/classification/:id/modify" Component={Component} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

const submit = async () => {
  const label = await screen.findByDisplayValue(general.prefLabelLg1);
  fireEvent.submit(label.closest("form")!);
};

describe("modification d'une nomenclature refusée par le serveur", () => {
  beforeEach(() => {
    vi.mocked(ClassificationsApi.getClassificationGeneral).mockResolvedValue({ ...general });
    vi.mocked(ClassificationsApi.getClassificationLevels).mockResolvedValue([]);
    vi.mocked(ClassificationsApi.getSeriesList).mockResolvedValue([]);
  });

  it("affiche l'erreur d'un champ sous sa saisie", async () => {
    vi.mocked(ClassificationsApi.putClassification).mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg1", message: "3 caractères maximum." }],
    });
    renderEdition();

    await submit();

    const label = await screen.findByDisplayValue(general.prefLabelLg1);
    await waitFor(() => expect(label).toHaveAccessibleDescription("3 caractères maximum."));
    expect(label).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche l'erreur d'un lien sous sa saisie", async () => {
    vi.mocked(ClassificationsApi.putClassification).mockRejectedValue({
      status: 400,
      errors: [{ field: "homepage", message: "Cette adresse n'est pas une URL valide." }],
    });
    renderEdition();

    await submit();

    const homepage = await screen.findByDisplayValue(general.homepage);
    await waitFor(() =>
      expect(homepage).toHaveAccessibleDescription("Cette adresse n'est pas une URL valide."),
    );
  });

  it("affiche dans le bandeau une erreur sur un champ absent du formulaire", async () => {
    vi.mocked(ClassificationsApi.putClassification).mockRejectedValue({
      status: 400,
      errors: [{ field: "creator", message: "Ce champ est obligatoire." }],
    });
    renderEdition();

    await submit();

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
  });
});
