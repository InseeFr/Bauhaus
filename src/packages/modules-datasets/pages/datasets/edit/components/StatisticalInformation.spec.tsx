import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { Mock, vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { fetchCodelist, StructureApi } from "@sdk/index";

import {
  CL_DATA_TYPES,
  CL_FREQ,
  CL_GEO,
  CL_STAT_UNIT,
  CL_TYPE_GEO,
} from "../../../../../constants/code-lists";
import { testsI18n as i18n } from "../../../../../tests/i18n";
import { StatisticalInformation } from "./StatisticalInformation";

vi.mock("@sdk/index", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdk/index")>();
  return {
    ...actual,
    fetchCodelist: vi.fn(),
    StructureApi: { getStructures: vi.fn() },
  };
});

const codelists: Record<string, unknown> = {
  [CL_DATA_TYPES]: { codes: [{ iri: "http://type/micro", labelLg1: "Microdonnées" }] },
  [CL_STAT_UNIT]: { codes: [{ iri: "http://unit/household", labelLg1: "Ménage" }] },
  [CL_FREQ]: { codes: [{ iri: "http://freq/A", labelLg1: "Annuelle" }] },
  [CL_GEO]: { codes: [{ iri: "http://geo/france", labelLg1: "France" }] },
  [CL_TYPE_GEO]: { codes: [{ iri: "http://geotype/commune", labelLg1: "Commune" }] },
};

const renderPanel = (dataset: Partial<Dataset>) => {
  const setEditingDataset = vi.fn();
  const rendered = render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <StatisticalInformation
          editingDataset={dataset as Dataset}
          setEditingDataset={setEditingDataset}
        />
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return { ...rendered, setEditingDataset };
};

// PrimeReact ne monte le panneau d'options qu'à l'ouverture du select.
const pickOption = async (label: string, option: string) => {
  const group = screen.getByText(label).closest(".form-group")!;
  fireEvent.click(group.querySelector(".p-dropdown-trigger, .p-multiselect-trigger")!);
  fireEvent.click(await screen.findByText(option));
};

describe("Dataset statistical information panel", () => {
  beforeEach(() => {
    (fetchCodelist as Mock).mockImplementation((notation: string) =>
      Promise.resolve(codelists[notation]),
    );
    (StructureApi.getStructures as Mock).mockResolvedValue([]);
  });

  it("displays the observation and time series counts of the dataset", () => {
    renderPanel({ observationNumber: 12, timeSeriesNumber: 34 });

    expect(screen.getByLabelText("Number of observations")).toHaveValue(12);
    expect(screen.getByLabelText("Number of time series")).toHaveValue(34);
  });

  it("displays the geographical vintage of the dataset", () => {
    renderPanel({ spacialTemporal: "2024-01-01" });

    expect(screen.getByLabelText("Geographical vintage")).toHaveValue("2024-01-01");
  });

  it.each([
    ["Number of observations", "observationNumber"],
    ["Number of time series", "timeSeriesNumber"],
  ])("updates %s in the dataset", (label, field) => {
    const { setEditingDataset } = renderPanel({});

    fireEvent.change(screen.getByLabelText(label), { target: { value: "42" } });

    expect(setEditingDataset).toHaveBeenCalledWith({ [field]: "42" });
  });

  it("updates the geographical vintage in the dataset", () => {
    const { setEditingDataset } = renderPanel({});

    fireEvent.change(screen.getByLabelText("Geographical vintage"), {
      target: { value: "2025-01-01" },
    });

    expect(setEditingDataset).toHaveBeenCalledWith({ spacialTemporal: "2025-01-01" });
  });

  it.each([
    ["Data type", "Microdonnées", "type", "http://type/micro"],
    ["Temporal resolution", "Annuelle", "temporalResolution", "http://freq/A"],
    ["Spatial area covered", "France", "spacialCoverage", "http://geo/france"],
  ])("stores the %s picked from its codelist", async (label, option, field, value) => {
    const { setEditingDataset } = renderPanel({});

    await pickOption(label, option);

    await waitFor(() => expect(setEditingDataset).toHaveBeenCalledWith({ [field]: value }));
  });

  it.each([
    ["Statistical units", "Ménage", "statisticalUnit", "http://unit/household"],
    ["Spatial resolution", "Commune", "spacialResolutions", "http://geotype/commune"],
  ])("stores the multiple %s picked from their codelist", async (label, option, field, value) => {
    const { setEditingDataset } = renderPanel({});

    await pickOption(label, option);

    await waitFor(() => expect(setEditingDataset).toHaveBeenCalledWith({ [field]: [value] }));
  });

  it("stores the data structure chosen through its child field", async () => {
    (StructureApi.getStructures as Mock).mockResolvedValue([
      { iri: "http://structure/s1", labelLg1: "Structure 1" },
    ]);
    const { setEditingDataset } = renderPanel({});

    await pickOption("Data structure", "Choose a structure");

    await waitFor(() => expect(setEditingDataset).toHaveBeenCalledWith({ dataStructure: "" }));
  });

  it("merges the temporal coverage of its child field into the dataset", async () => {
    const { setEditingDataset } = renderPanel({ labelLg1: "Recensement" });

    await pickOption("Time period covered", "Year");

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith(
        expect.objectContaining({
          labelLg1: "Recensement",
          temporalCoverageDataType: "http://www.w3.org/2001/XMLSchema#gYear",
        }),
      ),
    );
  });
});
