import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { ChangeEvent, useCallback } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";
import { Mock, vi } from "vitest";

import { ConceptGeneral } from "@model/concepts/concept";
import { UNPUBLISHED } from "@model/ValidationState";

import { ConceptsApi } from "@sdk/concepts-api";

import { useAppContext } from "../../../../application/app-context";
import { testsI18n } from "../../../../tests/i18n";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { createTestQueryClient } from "../../../testing/query-client.testing";
import { emptyConceptNotes } from "../../../utils/emptyConceptNotes";
import { Component } from "./page";

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: { postConcept: vi.fn(), putConcept: vi.fn() },
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("../../../hooks/useConcept", () => ({
  useConcept: vi.fn(),
}));

vi.mock("../../../hooks/useConcepts", () => ({
  useConcepts: vi.fn(),
}));

// Le vrai formulaire des informations générales interroge plusieurs référentiels
// (collections, timbres) ; seul le libellé sert ici à vérifier que la saisie survit.
vi.mock("./components/ConceptGeneralEdition", () => ({
  ConceptGeneralEdition: ({
    general,
    handleChange,
  }: {
    general: ConceptGeneral;
    handleChange: (update: Partial<ConceptGeneral>) => void;
  }) => {
    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => handleChange({ prefLabelLg1: e.target.value }),
      [handleChange],
    );
    return (
      <label>
        Libellé
        <input value={general.prefLabelLg1} onChange={onChange} />
      </label>
    );
  },
}));

const concept = {
  general: {
    id: "c1",
    contributor: "DG75-L201",
    creator: "DG75-L201",
    prefLabelLg1: "Concept initial",
    // Un statut non public dispense de la définition courte.
    disseminationStatus: "http://id.insee.fr/codes/base/statutDiffusion/Prive",
    validationState: UNPUBLISHED,
    collections: [],
  },
  notes: { ...emptyConceptNotes, definitionLg1: "<p>Définition</p>" },
  links: [],
};

const INITIAL_ENTRIES = ["/concepts/c1/modify"];
const PAGE = <Component />;

const renderEditPage = () =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <I18nextProvider i18n={testsI18n}>
        <MemoryRouter initialEntries={INITIAL_ENTRIES}>
          <Routes>
            <Route path="/concepts/:id/modify" element={PAGE} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );

describe("Enregistrement d'un concept qui échoue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppContext as Mock).mockReturnValue({
      lg1: "fr",
      lg2: "en",
      properties: { maxLengthScopeNote: "5000" },
    });
    (useConcepts as Mock).mockReturnValue({ concepts: [], isLoading: false });
    (useConcept as Mock).mockReturnValue({ data: concept, isLoading: false });
    (ConceptsApi.putConcept as Mock).mockRejectedValue(
      sdkRejection.json(409, { message: "Le libellé est déjà utilisé" }),
    );
  });

  const saveWithNewLabel = async () => {
    renderEditPage();
    fireEvent.change(screen.getByLabelText("Libellé"), { target: { value: "Libellé modifié" } });
    fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));
    return screen.findByText("Le libellé est déjà utilisé");
  };

  it("affiche le message du serveur au-dessus du formulaire", async () => {
    await saveWithNewLabel();
  });

  it("conserve la saisie", async () => {
    await saveWithNewLabel();

    expect(screen.getByLabelText("Libellé")).toHaveValue("Libellé modifié");
  });

  it("laisse le bouton « Sauvegarder » actif pour réessayer", async () => {
    await saveWithNewLabel();

    expect(screen.getByRole("button", { name: /Sauvegarder|Save/ })).toBeEnabled();
  });
});
