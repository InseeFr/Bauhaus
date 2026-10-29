import { QueryClient } from "@tanstack/react-query";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { Component as StructureComponent } from "@model/structures/Component";

import { ConceptsApi } from "@sdk/concepts-api";
import { StructureApi } from "@sdk/structure-api";
import { saveComponent } from "@sdk/structures/saveComponent";

import { useGoBack } from "@utils/hooks/useGoBack";

import { subscribeToGlobalErrors } from "../../../../application/global-error-toast/notifier";
import { createQueryClient } from "../../../../application/query-client";
import { expectItemNotFound } from "../../../../tests/loading-error.testing";
import { renderWithQuery } from "../../../../tests/render-with-query.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { mutualizedComponentQuery } from "../../../hooks/queries";
import { Component, prefetchEditedComponent } from "./page";

vi.mock("@sdk/structure-api", () => ({
  StructureApi: {
    getMutualizedComponent: vi.fn(),
    getMutualizedAttributes: vi.fn(),
  },
}));
vi.mock("@sdk/concepts-api", () => ({ ConceptsApi: { getConceptList: vi.fn() } }));
vi.mock("@sdk/stamps-api", async () => (await import("../../../mocks.testing")).emptyStampsApi());
vi.mock("@sdk/structures/saveComponent", () => ({ saveComponent: vi.fn() }));

vi.mock("@sdk/codelists-api", () => ({
  CodelistsApi: {
    getCodelists: vi.fn().mockResolvedValue([]),
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: vi.fn(() => vi.fn()) }));

vi.mock("@components/business/creators-input", () => ({ CreatorsInput: () => <div /> }));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <div />,
}));

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../mocks.testing")).usersHookWithCreatePrivilege(
    await importOriginal(),
    "STRUCTURE_COMPONENT",
  ),
);

const mutualizedComponent = {
  id: "c1",
  identifiant: "c1",
  labelLg1: "Composante 1",
  labelLg2: "Component 1",
  type: "http://purl.org/linked-data/cube#DimensionProperty",
};

const EDIT_ROUTE = "/structures/components/c1/modify";
const CREATE_ROUTE = "/structures/components/create";

const renderAt = (route: string, queryClient?: QueryClient) =>
  renderWithQuery(<Component />, {
    path: route === CREATE_ROUTE ? CREATE_ROUTE : "/structures/components/:id/modify",
    route,
    queryClient,
  });

const renderPage = async (route = EDIT_ROUTE, queryClient?: QueryClient) => {
  const view = renderAt(route, queryClient);
  await screen.findByDisplayValue("Composante 1");
  return view;
};

describe("page d'édition d'une composante mutualisée", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue(mutualizedComponent);
    vi.mocked(StructureApi.getMutualizedAttributes).mockResolvedValue([]);
    vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([]);
  });

  it("charge la composante à modifier", async () => {
    await renderPage();

    expect(StructureApi.getMutualizedComponent).toHaveBeenCalledWith("c1");
    expect(screen.getByDisplayValue("Composante 1")).toBeInTheDocument();
  });

  it("attend la composante avant d'ouvrir le formulaire", async () => {
    vi.mocked(StructureApi.getMutualizedComponent).mockReturnValue(new Promise(() => undefined));
    renderAt(EDIT_ROUTE);

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save|sauvegarder/i })).not.toBeInTheDocument();
  });

  it("ouvre le formulaire sur les données déjà en cache, sans les relire", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
    queryClient.setQueryData(
      mutualizedComponentQuery("c1").queryKey,
      mutualizedComponent as unknown as StructureComponent,
    );
    queryClient.setQueryData(["structures", "components", "attributes"], []);
    queryClient.setQueryData(["concepts"], []);
    await renderPage(EDIT_ROUTE, queryClient);

    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
    expect(StructureApi.getMutualizedAttributes).not.toHaveBeenCalled();
    expect(ConceptsApi.getConceptList).not.toHaveBeenCalled();
  });

  it("commence à lire la composante depuis le loader de la route", async () => {
    const queryClient = new QueryClient();

    expect(prefetchEditedComponent(queryClient)({ params: { id: "c1" } } as any)).toBeNull();

    await vi.waitFor(() =>
      expect(queryClient.getQueryData(mutualizedComponentQuery("c1").queryKey)).toEqual(
        mutualizedComponent,
      ),
    );
  });

  it("ne relit aucune composante depuis le loader de la création", () => {
    const queryClient = new QueryClient();

    prefetchEditedComponent(queryClient)({ params: {} } as any);

    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
  });

  it("garde la saisie quand la composante et ses listes sont relues en arrière-plan", async () => {
    const { queryClient } = await renderPage();
    fireEvent.change(screen.getByDisplayValue("Composante 1"), {
      target: { value: "Saisie en cours" },
    });

    await act(async () => {
      await queryClient.invalidateQueries({ queryKey: ["structures"] });
      await queryClient.invalidateQueries({ queryKey: ["concepts"] });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(StructureApi.getMutualizedComponent).toHaveBeenCalledTimes(2);
    expect(screen.getByDisplayValue("Saisie en cours")).toBeInTheDocument();
  });

  it("indique que la composante à modifier est introuvable au lieu d'un formulaire vide", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getMutualizedComponent).mockRejectedValue(
      sdkRejection.json(404, { message: "Component not found" }),
    );
    renderAt(EDIT_ROUTE);

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save|sauvegarder/i })).not.toBeInTheDocument();
  });

  it("ne charge aucune composante à la création", async () => {
    renderAt(CREATE_ROUTE);

    expect(await screen.findByRole("button", { name: /save|sauvegarder/i })).toBeInTheDocument();
    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
  });

  it("enregistre la composante", async () => {
    vi.mocked(saveComponent).mockResolvedValue("c1");
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(saveComponent).toHaveBeenCalledWith(expect.objectContaining({ identifiant: "c1" })),
    );
  });

  it("périme la composante et les listes en cache avant de revenir sur sa fiche", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["structures", "components"], []);
    queryClient.setQueryData(["structures", "components", "c1"], mutualizedComponent);
    let invalidatedAtGoBack: (boolean | undefined)[] = [];
    vi.mocked(useGoBack).mockReturnValue(() => {
      invalidatedAtGoBack = [
        queryClient.getQueryState(["structures", "components"])?.isInvalidated,
        queryClient.getQueryState(["structures", "components", "c1"])?.isInvalidated,
      ];
    });
    vi.mocked(saveComponent).mockResolvedValue("c1");
    await renderPage(undefined, queryClient);

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() => expect(invalidatedAtGoBack).toEqual([true, true]));
  });

  it("n'ajoute pas de toast global à l'échec affiché dans le formulaire", async () => {
    const notified = vi.fn();
    const unsubscribe = subscribeToGlobalErrors(notified);
    vi.mocked(saveComponent).mockRejectedValue(sdkRejection.text(500, "Refusé"));
    await renderPage(undefined, createQueryClient());

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText(/Refusé/)).toBeInTheDocument();
    unsubscribe();
    expect(notified).not.toHaveBeenCalled();
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    vi.mocked(saveComponent).mockRejectedValue("Erreur serveur");
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
  });

  it("affiche une erreur de champ du serveur sous la saisie, comme une erreur client", async () => {
    vi.mocked(saveComponent).mockRejectedValue(
      sdkRejection.json(400, {
        message: "Validation failed",
        errors: [{ field: "labelLg1", message: "size must be between 0 and 3" }],
      }),
    );
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(screen.getByDisplayValue("Composante 1")).toHaveAccessibleDescription(
        "size must be between 0 and 3",
      ),
    );
    expect(screen.getByDisplayValue("Composante 1")).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche dans le bandeau une erreur du serveur sur un champ absent du formulaire", async () => {
    vi.mocked(saveComponent).mockRejectedValue(
      sdkRejection.json(400, {
        message: "Validation failed",
        errors: [{ field: "altLabelLg1", message: "size must be between 0 and 3" }],
      }),
    );
    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(
      await screen.findByText("altLabelLg1 : size must be between 0 and 3"),
    ).toBeInTheDocument();
  });
});
