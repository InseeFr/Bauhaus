import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { ConceptsApi } from "@sdk/index";

import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { conceptsI18n } from "../../../i18n";
import { Component } from "./page";

vi.mock("@sdk/index", () => ({
  ConceptsApi: { getConceptValidateList: vi.fn(), putConceptValidList: vi.fn() },
}));

const renderValidationPage = () =>
  render(
    <I18nextProvider i18n={conceptsI18n}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </I18nextProvider>,
  );

const selectedList = () => screen.getAllByRole("listbox")[1];

const selectAndPublishConceptA = async () => {
  renderValidationPage();
  fireEvent.click(
    within((await screen.findAllByRole("listbox"))[0]).getByRole("option", {
      name: "Concept A",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
};

const publishConceptA = async () => {
  await selectAndPublishConceptA();
  return screen.findByText(/La publication a échoué/);
};

describe("Publication de concepts en lot qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ConceptsApi.getConceptValidateList as Mock).mockResolvedValue([
      { id: "1", label: "Concept A" },
      { id: "2", label: "Concept B" },
    ]);
    (ConceptsApi.putConceptValidList as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "La publication a échoué" }),
    );
  });

  it("affiche le message du serveur", async () => {
    await publishConceptA();
  });

  it("conserve la sélection pour que la publication puisse être relancée", async () => {
    await publishConceptA();

    expect(within(selectedList()).getByRole("option", { name: "Concept A" })).toBeVisible();
  });
});

describe("Chargement des concepts à publier qui échoue", () => {
  it("affiche le message du serveur au lieu d'une liste vide muette", async () => {
    (ConceptsApi.getConceptValidateList as Mock).mockRejectedValue(
      sdkRejection.json(500, { message: "Lecture des concepts impossible" }),
    );

    renderValidationPage();

    expect(await screen.findByText(/Lecture des concepts impossible/)).toBeInTheDocument();
  });
});

describe("Publication de concepts en lot qui réussit", () => {
  it("n'affiche plus que les concepts restant à publier", async () => {
    (ConceptsApi.getConceptValidateList as Mock)
      .mockResolvedValueOnce([
        { id: "1", label: "Concept A" },
        { id: "2", label: "Concept B" },
      ])
      .mockResolvedValue([{ id: "2", label: "Concept B" }]);
    (ConceptsApi.putConceptValidList as Mock).mockResolvedValue({});

    await selectAndPublishConceptA();

    await waitFor(() => {
      expect(screen.queryByRole("option", { name: "Concept A" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("option", { name: "Concept B" })).toBeVisible();
  });
});
