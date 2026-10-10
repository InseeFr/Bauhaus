import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getClassificationItemGeneral: vi.fn(),
    getClassificationItemNarrowers: vi.fn(),
    putClassificationItemGeneral: vi.fn(),
  },
}));

vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: () => null,
}));

const general = {
  id: "01.11Z",
  prefLabelLg1: "Culture de céréales",
  prefLabelLg2: "Growing of cereals",
};

const NO_PROPERTIES = {} as any;
const EDITION_ENTRIES = ["/classifications/classification/nafr2/item/01.11Z/modify"];

const renderEdition = () =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={EDITION_ENTRIES}>
          <Routes>
            <Route
              path="/classifications/classification/:classificationId/item/:itemId/modify"
              Component={Component}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

const submit = async () => {
  const label = await screen.findByDisplayValue(general.prefLabelLg1);
  fireEvent.submit(label.closest("form")!);
};

describe("modification d'un poste refusée par le serveur", () => {
  beforeEach(() => {
    vi.mocked(ClassificationsApi.getClassificationItemGeneral).mockResolvedValue({ ...general });
    vi.mocked(ClassificationsApi.getClassificationItemNarrowers).mockResolvedValue([]);
  });

  it("affiche l'erreur d'un champ sous sa saisie", async () => {
    vi.mocked(ClassificationsApi.putClassificationItemGeneral).mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg2", message: "Ce champ est obligatoire." }],
    });
    renderEdition();

    await submit();

    const label = await screen.findByDisplayValue(general.prefLabelLg2);
    await waitFor(() => expect(label).toHaveAccessibleDescription("Ce champ est obligatoire."));
    expect(label).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche dans le bandeau une erreur sur un champ absent du formulaire", async () => {
    vi.mocked(ClassificationsApi.putClassificationItemGeneral).mockRejectedValue({
      status: 400,
      errors: [{ field: "altLabels[0].shortLabelUri", message: "Ce champ est obligatoire." }],
    });
    renderEdition();

    await submit();

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
  });
});
