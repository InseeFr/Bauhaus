import { QueryClient } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { subscribeToGlobalErrors } from "../../../../application/global-error-toast/notifier";
import { createQueryClient } from "../../../../application/query-client";
import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { renderWithQuery } from "../../../../tests/render-with-query.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { structureQuery } from "../../../hooks/queries";
import { Component, prefetchStructure, StructureView } from "./page";

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  StructureApi: { getStructure: vi.fn(), deleteStructure: vi.fn(), publishStructure: vi.fn() },
}));

vi.mock("@utils/hooks/users", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@utils/hooks/users")>()),
  usePrivileges: () => ({
    privileges: [
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [
          { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL },
          { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
        ],
      },
    ],
    isPending: false,
  }),
  useUserStamps: () => ({ data: [{ stamp: "stamp" }] }),
}));

vi.mock("./components/GlobalInformationsPanel", () => ({
  GlobalInformationsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/DescriptionsPanel", () => ({
  DescriptionsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/ComponentsPanel", () => ({
  ComponentsPanel: vi.fn(() => <div></div>),
}));

const unpublished = {
  id: "1",
  labelLg1: "Structure FR",
  validationState: "Unpublished",
} as Structure;

const titledStructure = { labelLg1: "labelLg1" } as Structure;

const renderPage = (queryClient?: QueryClient) =>
  renderWithQuery(<Component />, { path: "/structures/:id", route: "/structures/1", queryClient });

describe("<StructureView />", () => {
  it("should display labelLg1", async () => {
    const { container } = renderWithQuery(
      <StructureView
        publish={vi.fn()}
        onDeleteError={vi.fn()}
        structure={titledStructure}
      ></StructureView>,
    );

    await screen.findByText("labelLg1");
    expect(container.querySelector("h2")!.innerHTML).toEqual("labelLg1");
  });
});

describe("Structure view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi.getStructure).mockResolvedValue(unpublished);
  });

  it("attend la structure avant de l'afficher", async () => {
    vi.mocked(StructureApi.getStructure).mockReturnValue(new Promise(() => undefined));

    renderPage();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(StructureApi.getStructure).toHaveBeenCalledWith("1");
  });

  it("affiche la structure lue", async () => {
    renderPage();

    expect(await screen.findByText("Structure FR")).toBeInTheDocument();
  });

  it("indique que la structure est introuvable au lieu d'une page vide", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(404));

    renderPage();

    await expectItemNotFound();
  });

  it("indique que la structure n'a pas pu être chargée", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(500));

    renderPage();

    await expectItemLoadFailed();
  });

  it("commence à lire la structure depuis le loader de la route", async () => {
    const queryClient = new QueryClient();

    expect(prefetchStructure(queryClient)({ params: { id: "1" } } as any)).toBeNull();

    await vi.waitFor(() =>
      expect(queryClient.getQueryData(structureQuery("1").queryKey)).toEqual(unpublished),
    );
  });

  it("relit la structure après sa publication", async () => {
    vi.mocked(StructureApi.publishStructure).mockResolvedValue(undefined);
    renderPage();
    await screen.findByText("Structure FR");
    vi.mocked(StructureApi.getStructure).mockResolvedValue({
      ...unpublished,
      labelLg1: "Structure publiée",
    } as Structure);

    await userEvent.click(screen.getByRole("button", { name: /publish/i }));

    expect(await screen.findByText("Structure publiée")).toBeInTheDocument();
    expect(StructureApi.publishStructure).toHaveBeenCalledWith(unpublished);
  });

  it("affiche l'erreur serveur quand la publication échoue", async () => {
    vi.mocked(StructureApi.publishStructure).mockRejectedValue(
      sdkRejection.text(500, "Publication refusée"),
    );
    renderPage();

    await userEvent.click(await screen.findByRole("button", { name: /publish/i }));

    expect(await screen.findByText(/Publication refusée/)).toBeInTheDocument();
    expect(screen.getByText("Structure FR")).toBeInTheDocument();
  });

  it("reste sur la fiche et affiche l'erreur quand la suppression échoue", async () => {
    vi.mocked(StructureApi.deleteStructure).mockRejectedValue(
      sdkRejection.text(500, "Suppression impossible"),
    );
    const { router } = renderPage();

    await userEvent.click(await screen.findByRole("button", { name: /delete/i }));

    expect(await screen.findByText(/Suppression impossible/)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/structures/1");
    expect(screen.getByText("Structure FR")).toBeInTheDocument();
  });

  it("périme les structures en cache avant de revenir à la liste", async () => {
    // La liste n'est pas déclarée dans ce rendu : le routeur signale la route absente.
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(["structures"], [unpublished]);
    vi.mocked(StructureApi.deleteStructure).mockResolvedValue("");
    const { router } = renderPage(queryClient);

    await userEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/structures"));
    expect(StructureApi.deleteStructure).toHaveBeenCalledWith("1");
    expect(queryClient.getQueryState(["structures"])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryData(structureQuery("1").queryKey)).toBeUndefined();
  });

  it("désactive la publication pendant l'envoi", async () => {
    vi.mocked(StructureApi.publishStructure).mockReturnValue(new Promise(() => undefined));
    renderPage();

    await userEvent.click(await screen.findByRole("button", { name: /publish/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /publish/i })).toBeDisabled());
    expect(screen.getByText("Structure FR")).toBeInTheDocument();
  });

  it("périme les listes de structures, qui affichent son statut, après la publication", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(["structures"], [unpublished]);
    vi.mocked(StructureApi.publishStructure).mockResolvedValue(undefined);
    renderPage(queryClient);

    await userEvent.click(await screen.findByRole("button", { name: /publish/i }));

    await waitFor(() =>
      expect(queryClient.getQueryState(["structures"])?.isInvalidated).toBe(true),
    );
  });

  it("n'ajoute pas de toast global à l'échec de publication affiché sur la fiche", async () => {
    const notified = vi.fn();
    const unsubscribe = subscribeToGlobalErrors(notified);
    vi.mocked(StructureApi.publishStructure).mockRejectedValue(
      sdkRejection.text(500, "Publication refusée"),
    );
    renderPage(createQueryClient());

    await userEvent.click(await screen.findByRole("button", { name: /publish/i }));

    expect(await screen.findByText(/Publication refusée/)).toBeInTheDocument();
    unsubscribe();
    expect(notified).not.toHaveBeenCalled();
  });

  it("remplace l'échec de publication par celui de la suppression qui suit", async () => {
    vi.mocked(StructureApi.publishStructure).mockRejectedValue(
      sdkRejection.text(500, "Publication refusée"),
    );
    vi.mocked(StructureApi.deleteStructure).mockRejectedValue(
      sdkRejection.text(500, "Suppression impossible"),
    );
    renderPage();
    await userEvent.click(await screen.findByRole("button", { name: /publish/i }));
    await screen.findByText(/Publication refusée/);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(await screen.findByText(/Suppression impossible/)).toBeInTheDocument();
    expect(screen.queryByText(/Publication refusée/)).not.toBeInTheDocument();
  });

  it("désactive la suppression pendant l'envoi", async () => {
    vi.mocked(StructureApi.deleteStructure).mockReturnValue(new Promise(() => undefined));
    renderPage();

    await userEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled());
  });
});
