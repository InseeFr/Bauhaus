import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Mock, vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { DatasetsApi } from "@sdk/datasets-api";
import { fetchCodelist, OrganizationsApi } from "@sdk/index";

import { AppContextProvider } from "../../../../application/app-context";
import { testsI18n as i18n } from "../../../../tests/i18n";
import { Component } from "./page";

// `@sdk/index` réexporte `@sdk/datasets-api` : simuler le module dédié suffit à ce
// que la page et `useDataset` voient le même faux `DatasetsApi`.
vi.mock("@sdk/datasets-api", () => ({
  DatasetsApi: {
    getById: vi.fn(),
    getArchivageUnits: vi.fn(),
    publish: vi.fn(),
    deleteDataset: vi.fn(),
  },
}));

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  fetchCodelist: vi.fn(),
  OrganizationsApi: { getOrganizations: vi.fn() },
  StructureApi: { getStructures: vi.fn().mockResolvedValue([]) },
  ThemesApi: { getThemes: vi.fn().mockResolvedValue([]) },
}));

// Le bloc d'informations générales résout l'origine du jeu de données à partir des
// séries et opérations, servies par un module SDK distinct de l'index.
vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getSeriesList: vi.fn().mockResolvedValue([{ iri: "http://serie/s1", label: "Série 1" }]),
    getOperationsList: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@uiw/react-md-editor/nohighlight", () => ({
  default: { Markdown: ({ source }: { source: string }) => <div>{source}</div> },
}));

vi.mock("@utils/hooks/users", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@utils/hooks/users")>()),
  usePrivileges: () => ({
    privileges: [
      {
        application: "DATASET_DATASET",
        privileges: [
          { privilege: "PUBLISH", strategy: "ALL" },
          { privilege: "DELETE", strategy: "ALL" },
          { privilege: "UPDATE", strategy: "ALL" },
          { privilege: "CREATE", strategy: "ALL" },
        ],
      },
    ],
  }),
  useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
}));

vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

const dataset = {
  id: "jd1000",
  labelLg1: "Recensement",
  labelLg2: "Census",
  subTitleLg1: "Le sous-titre",
  subTitleLg2: "The subtitle",
  landingPageLg1: "http://fr",
  landingPageLg2: "http://en",
  linkedDocuments: ["http://doc1", "http://doc2"],
  descriptionLg1: "Description fr",
  descriptionLg2: "Description en",
  abstractLg1: "Résumé fr",
  abstractLg2: "Abstract en",
  cautionLg1: "Avertissement fr",
  cautionLg2: "Warning en",
  disseminationStatus: "http://.../PublicGenerique",
  processStep: "http://step/collect",
  archiveUnit: "http://archive/u1",
  validationState: "Unpublished",
  type: "http://type/micro",
  statisticalUnit: ["http://unit/household"],
  temporalResolution: "http://freq/A",
  spacialCoverage: "http://geo/france",
  spacialResolutions: ["http://geotype/commune"],
  observationNumber: 12,
  timeSeriesNumber: 34,
  catalogRecord: { creator: "http://org/insee", contributor: ["http://org/dares"] },
} as unknown as Dataset;

const renderPage = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
          <MemoryRouter initialEntries={["/datasets/jd1000"]}>
            <Routes>
              <Route path="/datasets/:id" element={<Component />} />
              <Route path="/datasets" element={<div>Dataset list</div>} />
            </Routes>
          </MemoryRouter>
        </AppContextProvider>
      </I18nextProvider>
    </QueryClientProvider>,
  );

describe("Dataset view page", () => {
  beforeEach(() => {
    (DatasetsApi.getById as Mock).mockResolvedValue(dataset);
    (DatasetsApi.getArchivageUnits as Mock).mockResolvedValue([
      { value: "http://archive/u1", label: "Unité 1" },
    ]);
    (DatasetsApi.publish as Mock).mockResolvedValue("jd1000");
    (DatasetsApi.deleteDataset as Mock).mockResolvedValue("jd1000");
    (fetchCodelist as Mock).mockResolvedValue({
      codes: [{ iri: "http://step/collect", labelLg1: "Collecte" }],
    });
    (OrganizationsApi.getOrganizations as Mock).mockResolvedValue([
      { iri: "http://org/insee", label: "INSEE" },
      { iri: "http://org/dares", label: "DARES" },
    ]);
  });

  it("displays a loader while the dataset is being fetched", () => {
    (DatasetsApi.getById as Mock).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
  });

  it("displays the first language content of the dataset", async () => {
    renderPage();

    expect(await screen.findByText("Recensement")).toBeInTheDocument();
    expect(screen.getByText("Le sous-titre")).toBeInTheDocument();
    expect(screen.getByText("http://fr")).toBeInTheDocument();
    expect(screen.getByText("Description fr")).toBeInTheDocument();
    expect(screen.getByText("Résumé fr")).toBeInTheDocument();
    expect(screen.getByText("Avertissement fr")).toBeInTheDocument();
  });

  it("hides the second language content until it is asked for", async () => {
    renderPage();

    await screen.findByText("Recensement");
    expect(screen.queryByText("The subtitle")).not.toBeInTheDocument();
    expect(screen.queryByText("Description en")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByText("The subtitle")).toBeInTheDocument();
    expect(screen.getByText("http://en")).toBeInTheDocument();
    expect(screen.getByText("Description en")).toBeInTheDocument();
    expect(screen.getByText("Abstract en")).toBeInTheDocument();
    expect(screen.getByText("Warning en")).toBeInTheDocument();
  });

  it("displays the linked documents as links", async () => {
    renderPage();

    const link = await screen.findByRole("link", { name: "http://doc1" });
    expect(link).toHaveAttribute("href", "http://doc1");
    expect(screen.getByRole("link", { name: "http://doc2" })).toBeInTheDocument();
  });

  it("displays the internal management block resolved against its reference data", async () => {
    renderPage();

    const block = (await screen.findByText("Internal management")).closest(".note")!;
    await waitFor(() => expect(block).toHaveTextContent("Owner : INSEE"));
    expect(block).toHaveTextContent("Contributors : DARES");
    expect(block).toHaveTextContent("Dissemination status : Public generic");
    expect(block).toHaveTextContent("Processes using the data : Collecte");
    expect(block).toHaveTextContent("Archive unit : Unité 1");
  });

  it("omits the process step and the archive unit when the dataset carries none", async () => {
    (DatasetsApi.getById as Mock).mockResolvedValue({
      ...dataset,
      processStep: undefined,
      archiveUnit: undefined,
    });

    renderPage();

    const block = (await screen.findByText("Internal management")).closest(".note")!;
    expect(block).not.toHaveTextContent("Collecte");
    expect(block).not.toHaveTextContent("Unité 1");
  });

  it("publishes the dataset", async () => {
    renderPage();

    await userEvent.click(await screen.findByText("Publish"));

    await waitFor(() => expect(DatasetsApi.publish).toHaveBeenCalledWith("jd1000"));
  });

  it("displays the server side error raised by the publication", async () => {
    (DatasetsApi.publish as Mock).mockRejectedValue({ message: "Publication refused" });

    renderPage();

    await userEvent.click(await screen.findByText("Publish"));

    expect(await screen.findByText("Publication refused")).toBeInTheDocument();
  });

  it("asks for a confirmation before deleting, and does nothing when it is refused", async () => {
    renderPage();

    await userEvent.click(await screen.findByText("Delete"));
    await userEvent.click(screen.getByText("No"));

    await waitFor(() => expect(screen.queryByText("Yes")).not.toBeInTheDocument());
    expect(DatasetsApi.deleteDataset).not.toHaveBeenCalled();
  });

  it("deletes the dataset and goes back to the list once the deletion is confirmed", async () => {
    renderPage();

    await userEvent.click(await screen.findByText("Delete"));
    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => expect(DatasetsApi.deleteDataset).toHaveBeenCalledWith("jd1000"));
    expect(await screen.findByText("Dataset list")).toBeInTheDocument();
  });

  it("displays the server side error raised by the deletion", async () => {
    (DatasetsApi.deleteDataset as Mock).mockRejectedValue({ message: "Deletion refused" });

    renderPage();

    await userEvent.click(await screen.findByText("Delete"));
    await userEvent.click(screen.getByText("Yes"));

    expect(await screen.findByText("Deletion refused")).toBeInTheDocument();
  });
});
