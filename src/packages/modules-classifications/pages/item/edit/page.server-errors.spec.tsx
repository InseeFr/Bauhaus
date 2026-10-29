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

describe("réactivation du bouton Sauvegarder après une validation refusée", () => {
  beforeEach(() => {
    vi.mocked(ClassificationsApi.getClassificationItemGeneral).mockResolvedValue({
      ...general,
      altLabelLg1: "",
    });
    vi.mocked(ClassificationsApi.getClassificationItemNarrowers).mockResolvedValue([]);
  });

  const saveButton = () => screen.getByRole("button", { name: /Sauvegarder|Save/i });

  /** Vide les deux intitulés requis puis tente d'enregistrer. */
  const submitWithEmptyTitles = async () => {
    const labelLg1 = await screen.findByDisplayValue(general.prefLabelLg1);
    const labelLg2 = screen.getByDisplayValue(general.prefLabelLg2);
    fireEvent.change(labelLg1, { target: { value: "" } });
    fireEvent.change(labelLg2, { target: { value: "" } });
    fireEvent.submit(labelLg1.closest("form")!);
    return { labelLg1, labelLg2 };
  };

  it("garde le bouton désactivé quand seul un champ facultatif est modifié", async () => {
    renderEdition();
    await submitWithEmptyTitles();

    fireEvent.change(document.getElementById("altLabelLg1")!, {
      target: { value: "Autre intitulé" },
    });

    expect(saveButton()).toBeDisabled();
  });

  it("garde le bouton désactivé tant qu'un intitulé requis est vide", async () => {
    renderEdition();
    const { labelLg1, labelLg2 } = await submitWithEmptyTitles();

    fireEvent.change(labelLg1, { target: { value: "Intitulé" } });

    expect(saveButton()).toBeDisabled();
    expect(labelLg1).toHaveAttribute("aria-invalid", "false");
    expect(labelLg2).toHaveAttribute("aria-invalid", "true");
  });

  it("réactive le bouton dès que tous les champs requis sont renseignés", async () => {
    renderEdition();
    const { labelLg1, labelLg2 } = await submitWithEmptyTitles();

    fireEvent.change(labelLg1, { target: { value: "Intitulé" } });
    fireEvent.change(labelLg2, { target: { value: "Title" } });

    expect(saveButton()).toBeEnabled();
  });
});

describe("titres abrégés d'un poste", () => {
  beforeEach(() => {
    vi.mocked(ClassificationsApi.getClassificationItemGeneral).mockResolvedValue({
      ...general,
      altLabels: [
        {
          length: "10",
          shortLabelLg1: "Céréales",
          shortLabelLg2: "Cereals",
          shortLabelUri: "uri10",
        },
      ],
    });
    vi.mocked(ClassificationsApi.getClassificationItemNarrowers).mockResolvedValue([]);
    vi.mocked(ClassificationsApi.putClassificationItemGeneral).mockResolvedValue(undefined);
  });

  it("refuse un titre abrégé plus long que sa longueur maximale", async () => {
    renderEdition();
    const shortLabel = await screen.findByDisplayValue("Céréales");

    fireEvent.change(shortLabel, { target: { value: "Culture de céréales" } });
    fireEvent.submit(shortLabel.closest("form")!);

    expect(shortLabel).toHaveAttribute("aria-invalid", "true");
    expect(ClassificationsApi.putClassificationItemGeneral).not.toHaveBeenCalled();
  });

  it("enregistre le titre abrégé modifié", async () => {
    renderEdition();
    const shortLabel = await screen.findByDisplayValue("Céréales");

    fireEvent.change(shortLabel, { target: { value: "Blé" } });
    fireEvent.submit(shortLabel.closest("form")!);

    await waitFor(() =>
      expect(ClassificationsApi.putClassificationItemGeneral).toHaveBeenCalledWith(
        "nafr2",
        "01.11Z",
        expect.objectContaining({
          altLabels: [
            {
              length: "10",
              shortLabelLg1: "Blé",
              shortLabelLg2: "Cereals",
              shortLabelUri: "uri10",
            },
          ],
        }),
      ),
    );
  });
});
