import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { Mock, vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { DisseminationStatus } from "@sdk/dissemination-status";
import { DatasetsApi, fetchCodelist, OrganizationsApi } from "@sdk/index";
import { OperationsApi } from "@sdk/operations-api";

import {
  CL_ACCESS_RIGHTS,
  CL_CONF_STATUS,
  CL_PROCESS_STEP,
} from "../../../../../constants/code-lists";
import { testsI18n as i18n } from "../../../../../tests/i18n";
import { InternalManagement } from "./InternalManagement";

vi.mock("@sdk/index", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdk/index")>();
  return {
    ...actual,
    fetchCodelist: vi.fn(),
    DatasetsApi: { getArchivageUnits: vi.fn() },
    OrganizationsApi: { getOrganizations: vi.fn() },
  };
});

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getSeriesList: vi.fn(), getOperationsList: vi.fn() },
}));

vi.mock("@sdk/dissemination-status", () => ({
  DisseminationStatus: { getDisseminationStatus: vi.fn() },
}));

const codelists: Record<string, unknown> = {
  [CL_ACCESS_RIGHTS]: { codes: [{ iri: "http://rights/open", labelLg1: "Ouvert" }] },
  [CL_CONF_STATUS]: { codes: [{ iri: "http://conf/public", labelLg1: "Public" }] },
  [CL_PROCESS_STEP]: { codes: [{ iri: "http://step/collect", labelLg1: "Collecte" }] },
};

const renderPanel = (dataset: Partial<Dataset>, clientSideErrors = {}) => {
  const setEditingDataset = vi.fn();
  const setClientSideErrors = vi.fn();
  const rendered = render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <InternalManagement
          editingDataset={dataset as Dataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
          setClientSideErrors={setClientSideErrors}
        />
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return { ...rendered, setEditingDataset, setClientSideErrors };
};

// PrimeReact ne monte le panneau d'options qu'à l'ouverture : sans ce clic sur le
// déclencheur, aucune option n'existe dans le DOM.
const openSelect = async (label: string) => {
  const field = screen.getAllByText(label)[0].closest("label")!;
  fireEvent.click(field.querySelector(".p-dropdown-trigger, .p-multiselect-trigger")!);
  return field;
};

describe("Dataset internal management panel", () => {
  beforeEach(() => {
    (fetchCodelist as Mock).mockImplementation((notation: string) =>
      Promise.resolve(codelists[notation]),
    );
    (DatasetsApi.getArchivageUnits as Mock).mockResolvedValue([
      { value: "http://archive/u1", label: "Unité 1" },
    ]);
    (OrganizationsApi.getOrganizations as Mock).mockResolvedValue([
      { iri: "http://org/insee", label: "INSEE" },
    ]);
    (OperationsApi.getSeriesList as Mock).mockResolvedValue([
      { iri: "http://serie/s1", label: "Série 1" },
    ]);
    (OperationsApi.getOperationsList as Mock).mockResolvedValue([
      { iri: "http://operation/o1", label: "Opération 1", seriesIri: "http://serie/s1" },
    ]);
    (DisseminationStatus.getDisseminationStatus as Mock).mockResolvedValue([
      { url: "http://status/public", label: "Public generic" },
    ]);
  });

  it("displays the alternative identifier of the dataset", () => {
    renderPanel({ altIdentifier: "ALT-1000" });

    expect(screen.getByLabelText("Alternative identifier")).toHaveValue("ALT-1000");
  });

  it("updates the alternative identifier and resets the error message", () => {
    const { setEditingDataset, setClientSideErrors } = renderPanel({ altIdentifier: "ALT-1000" });

    fireEvent.change(screen.getByLabelText("Alternative identifier"), {
      target: { value: "ALT-2000" },
    });

    expect(setEditingDataset).toHaveBeenCalledWith({ altIdentifier: "ALT-2000" });
    expect(setClientSideErrors.mock.calls[0][0]({ fields: { altIdentifier: "e" } })).toEqual({
      fields: { altIdentifier: "e" },
      errorMessage: [],
    });
  });

  it("displays the client side errors of the panel", () => {
    renderPanel(
      {},
      {
        fields: {
          altIdentifier: "Invalid identifier",
          creator: "Owner is required",
          contributor: "Contributor is required",
          disseminationStatus: "Status is required",
          wasGeneratedIRIs: "Origin is required",
        },
      },
    );

    expect(screen.getByText("Invalid identifier")).toBeInTheDocument();
    expect(screen.getByText("Owner is required")).toBeInTheDocument();
    expect(screen.getByText("Contributor is required")).toBeInTheDocument();
    expect(screen.getByText("Status is required")).toBeInTheDocument();
    expect(screen.getByText("Origin is required")).toBeInTheDocument();
  });

  it("stores the owner of the catalog record", async () => {
    const { setEditingDataset, setClientSideErrors } = renderPanel({
      catalogRecord: { contributor: ["DG75-L001"] } as any,
    });

    await openSelect("Owner");
    fireEvent.click(await screen.findByText("INSEE"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({
        catalogRecord: { contributor: ["DG75-L001"], creator: "http://org/insee" },
      }),
    );
    expect(setClientSideErrors).toHaveBeenCalled();
  });

  it("stores the contributors of the catalog record", async () => {
    const { setEditingDataset } = renderPanel({ catalogRecord: { creator: "INSEE" } as any });

    await openSelect("Contributors");
    fireEvent.click(await screen.findByText("INSEE"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({
        catalogRecord: { creator: "INSEE", contributor: ["http://org/insee"] },
      }),
    );
  });

  it("stores the dissemination status", async () => {
    const { setEditingDataset } = renderPanel({});

    const group = screen.getByText("Dissemination status").closest(".form-group")!;
    fireEvent.click(group.querySelector(".p-dropdown-trigger")!);
    fireEvent.click(await screen.findByText("Public generic"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({
        disseminationStatus: "http://status/public",
      }),
    );
  });

  it("offers the series and their operations as origins, and stores the selected ones", async () => {
    const { setEditingDataset } = renderPanel({});

    const field = screen.getByText("Produced from").closest(".form-group")!;
    fireEvent.click(field.querySelector(".p-multiselect-trigger")!);

    expect(await screen.findByText("Série 1")).toBeInTheDocument();
    expect(screen.getByText("Opération 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Série 1"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({ wasGeneratedIRIs: ["http://serie/s1"] }),
    );
  });

  it.each([
    ["Access rights", "Ouvert", "accessRights", "http://rights/open"],
    ["Confidentiality status", "Public", "confidentialityStatus", "http://conf/public"],
    ["Processes using the data", "Collecte", "processStep", "http://step/collect"],
    ["Archive unit", "Unité 1", "archiveUnit", "http://archive/u1"],
  ])("stores the %s picked from its codelist", async (label, option, field, value) => {
    const { setEditingDataset, container } = renderPanel({});

    const group = screen.getByText(label).closest(".form-group")!;
    fireEvent.click(group.querySelector(".p-dropdown-trigger")!);
    fireEvent.click(await screen.findByText(option));

    await waitFor(() => expect(setEditingDataset).toHaveBeenCalledWith({ [field]: value }));
    expect(container).toBeTruthy();
  });
});
