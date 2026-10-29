import { QueryClient } from "@tanstack/react-query";
import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { StructureApi } from "@sdk/structure-api";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { renderWithQuery } from "../../../../tests/render-with-query.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { structureQuery } from "../../../hooks/queries";
import { Component, prefetchEditedStructure } from "./page";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

vi.mock("@sdk/structure-api", () => ({ StructureApi: { getStructure: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

const receivedStructures = new Set<unknown>();

vi.mock("./components/EditionForm", () => ({
  EditionForm: ({ creation, initialStructure }: any) => {
    receivedStructures.add(initialStructure);
    return (
      <form>
        <span>création:{String(creation)}</span>
        <span>id:{initialStructure.id === "" ? "(vide)" : initialStructure.id}</span>
        <span>libellé:{initialStructure.labelLg1}</span>
        <span>composantes:{initialStructure.componentDefinitions?.length ?? "(aucune)"}</span>
      </form>
    );
  },
}));

const structure: any = {
  id: "str-1",
  identifiant: "STR1",
  labelLg1: "Structure FR",
  labelLg2: "Structure EN",
  creator: "DG75",
  contributor: "DG75",
  disseminationStatus: "public",
  componentDefinitions: [
    { component: { id: "c-1" }, order: 1, required: true, attachment: "DataSet", extra: "à jeter" },
  ],
};

const renderPage = (action: "update" | "duplicate" = "update", queryClient?: QueryClient) =>
  renderWithQuery(<Component />, {
    path: `/structures/:id/${action}`,
    route: `/structures/str-1/${action}`,
    queryClient,
  });

describe("Structures edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    receivedStructures.clear();
    vi.mocked(StructureApi.getStructure).mockResolvedValue(structure);
  });

  it("attend la structure avant d'ouvrir le formulaire", async () => {
    vi.mocked(StructureApi.getStructure).mockReturnValue(new Promise(() => undefined));
    renderPage();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("création:false")).not.toBeInTheDocument();
  });

  it("charge la structure et ouvre le formulaire de modification", async () => {
    renderPage();

    expect(await screen.findByText("création:false")).toBeInTheDocument();
    expect(screen.getByText("id:str-1")).toBeInTheDocument();
    expect(StructureApi.getStructure).toHaveBeenCalledWith("str-1");
  });

  it("ouvre le formulaire sur la structure déjà en cache, sans la relire", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
    queryClient.setQueryData(structureQuery("str-1").queryKey, structure);
    renderPage("update", queryClient);

    expect(await screen.findByText("libellé:Structure FR")).toBeInTheDocument();
    expect(StructureApi.getStructure).not.toHaveBeenCalled();
  });

  it("commence à lire la structure depuis le loader de la route", async () => {
    const queryClient = new QueryClient();

    expect(prefetchEditedStructure(queryClient)({ params: { id: "str-1" } } as any)).toBeNull();

    await vi.waitFor(() =>
      expect(queryClient.getQueryData(structureQuery("str-1").queryKey)).toEqual(structure),
    );
  });

  it("vide l'identifiant en duplication, pour que la copie en obtienne un nouveau", async () => {
    renderPage("duplicate");

    expect(await screen.findByText("création:true")).toBeInTheDocument();
    expect(screen.getByText("id:(vide)")).toBeInTheDocument();
    expect(screen.getByText("libellé:Structure FR")).toBeInTheDocument();
  });

  it("ne recopie que les champs utiles des composantes en duplication", async () => {
    renderPage("duplicate");

    expect(await screen.findByText("composantes:1")).toBeInTheDocument();
  });

  (["update", "duplicate"] as const).forEach((action) => {
    it(`ne réinitialise pas le formulaire (${action}) quand la structure est relue en arrière-plan`, async () => {
      const { queryClient } = renderPage(action);
      await screen.findByText("libellé:Structure FR");
      vi.mocked(StructureApi.getStructure).mockResolvedValue({
        ...structure,
        labelLg1: "Modifiée ailleurs",
      });

      // La notification aux composants est différée d'un tour : on attend qu'elle soit rendue.
      await act(async () => {
        await queryClient.invalidateQueries({ queryKey: structureQuery("str-1").queryKey });
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(StructureApi.getStructure).toHaveBeenCalledTimes(2);
      expect(receivedStructures.size).toBe(1);
      expect(screen.getByText("libellé:Structure FR")).toBeInTheDocument();
    });
  });

  it("indique que la structure à modifier est introuvable au lieu d'un formulaire vide", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(404));
    renderPage();

    await expectItemNotFound();
    expect(screen.queryByText("création:false")).not.toBeInTheDocument();
  });

  it("indique que la structure à dupliquer n'a pas pu être chargée", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(500));
    renderPage("duplicate");

    await expectItemLoadFailed();
    expect(screen.queryByText("création:true")).not.toBeInTheDocument();
  });
});
