import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { Mock, vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { fetchCodelist, OrganizationsApi, ThemesApi } from "@sdk/index";

import { testsI18n as i18n } from "../../../../../tests/i18n";
import { GlobalInformation } from "./GlobalInformation";

vi.mock("@sdk/index", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdk/index")>();
  return {
    ...actual,
    fetchCodelist: vi.fn(),
    ThemesApi: { getThemes: vi.fn() },
    OrganizationsApi: { getOrganizations: vi.fn() },
  };
});

const frequencies = {
  codes: [
    { iri: "http://freq/A", labelLg1: "Annuelle" },
    { iri: "http://freq/M", labelLg1: "Mensuelle" },
  ],
};

const renderPanel = (dataset: Partial<Dataset>, clientSideErrors = {}) => {
  const setEditingDataset = vi.fn();
  const setClientSideErrors = vi.fn();
  const rendered = render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <GlobalInformation
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

// PrimeReact ne monte le panneau d'options qu'à l'ouverture du Dropdown : sans ce
// clic sur le déclencheur, aucune option n'existe dans le DOM.
const openSelect = async (label: string) => {
  const field = screen.getByText(label).closest("label")!;
  fireEvent.click(field.querySelector(".p-dropdown-trigger, .p-multiselect-trigger")!);
  return field;
};

describe("Dataset global information panel", () => {
  beforeEach(() => {
    (fetchCodelist as Mock).mockResolvedValue(frequencies);
    (ThemesApi.getThemes as Mock).mockResolvedValue([
      { uri: "http://theme/eco", label: { value: "Économie", lang: "fr" } },
    ]);
    (OrganizationsApi.getOrganizations as Mock).mockResolvedValue([
      { iri: "http://org/insee", label: "INSEE" },
    ]);
  });

  it("displays the titles, subtitles and landing pages of the dataset", () => {
    renderPanel({
      labelLg1: "Recensement",
      labelLg2: "Census",
      subTitleLg1: "Sous-titre",
      subTitleLg2: "Subtitle",
      landingPageLg1: "http://fr",
      landingPageLg2: "http://en",
    });

    expect(screen.getByLabelText(/Intitulé/)).toHaveValue("Recensement");
    expect(screen.getByLabelText(/^Title/)).toHaveValue("Census");
    expect(screen.getByLabelText("Sous-titre")).toHaveValue("Sous-titre");
    expect(screen.getByLabelText("Subtitle")).toHaveValue("Subtitle");
    expect(screen.getByLabelText("Page de présentation")).toHaveValue("http://fr");
    expect(screen.getByLabelText("Landing page")).toHaveValue("http://en");
  });

  it("keeps only the date part of the issued and updated timestamps", () => {
    renderPanel({ issued: "2024-01-31T10:00:00", updated: "2024-06-30T23:59:00" });

    expect(screen.getByLabelText("Date of first release of data")).toHaveValue("2024-01-31");
    expect(screen.getByLabelText("Data modification date")).toHaveValue("2024-06-30");
  });

  it("leaves the issued and updated dates untouched when they carry no time part", () => {
    renderPanel({ issued: "2024-01-31", updated: "2024-06-30" });

    expect(screen.getByLabelText("Date of first release of data")).toHaveValue("2024-01-31");
    expect(screen.getByLabelText("Data modification date")).toHaveValue("2024-06-30");
  });

  it("updates the dataset and resets the error message when a main title is typed", () => {
    const { setEditingDataset, setClientSideErrors } = renderPanel({ labelLg1: "Recensement" });

    fireEvent.change(screen.getByLabelText(/Intitulé/), { target: { value: "Enquête" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      labelLg1: "Enquête",
    });
    expect(setClientSideErrors.mock.calls[0][0]({ fields: { labelLg1: "error" } })).toEqual({
      fields: { labelLg1: "error" },
      errorMessage: [],
    });
  });

  it("updates the dataset and resets the error message when an english title is typed", () => {
    const { setEditingDataset, setClientSideErrors } = renderPanel({ labelLg2: "Census" });

    fireEvent.change(screen.getByLabelText(/^Title/), { target: { value: "Survey" } });

    expect(setEditingDataset).toHaveBeenCalledWith({ labelLg2: "Survey" });
    expect(setClientSideErrors).toHaveBeenCalled();
  });

  it.each([
    ["Sous-titre", "subTitleLg1"],
    ["Subtitle", "subTitleLg2"],
    ["Page de présentation", "landingPageLg1"],
    ["Landing page", "landingPageLg2"],
  ])("updates %s in the dataset", (label, field) => {
    const { setEditingDataset } = renderPanel({});

    fireEvent.change(screen.getByLabelText(label), { target: { value: "new" } });

    expect(setEditingDataset).toHaveBeenCalledWith({ [field]: "new" });
  });

  it.each([
    ["Date of first release of data", "issued"],
    ["Data modification date", "updated"],
  ])("updates %s in the dataset", (label, field) => {
    const { setEditingDataset } = renderPanel({});

    fireEvent.change(screen.getByLabelText(label), { target: { value: "2025-02-03" } });

    expect(setEditingDataset).toHaveBeenCalledWith({ [field]: "2025-02-03" });
  });

  it("offers the codes of the frequency codelist and stores the selected one", async () => {
    const { setEditingDataset } = renderPanel({});

    await openSelect("Update frequency");
    fireEvent.click(await screen.findByText("Annuelle"));

    expect(setEditingDataset).toHaveBeenCalledWith({ accrualPeriodicity: "http://freq/A" });
  });

  it("stores the selected themes", async () => {
    const { setEditingDataset } = renderPanel({});

    await openSelect("Theme");
    fireEvent.click(await screen.findByText("Économie"));

    expect(setEditingDataset).toHaveBeenCalledWith({ themes: ["http://theme/eco"] });
  });

  it("displays the client side error of a title", () => {
    renderPanel({}, { fields: { labelLg1: "The title is required" } });

    expect(screen.getByText("The title is required")).toBeInTheDocument();
  });

  it("stores the organization responsible for publishing the data", async () => {
    const { setEditingDataset } = renderPanel({});

    await openSelect("Responsible body for publishing the data");
    fireEvent.click(await screen.findByText("INSEE"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({ publisher: "http://org/insee" }),
    );
  });

  it("stores the keywords typed for each language", () => {
    const { setEditingDataset, container } = renderPanel({ keywords: { lg1: [], lg2: [] } });

    const chips = container.querySelectorAll(".p-chips-input-token input");
    fireEvent.keyDown(chips[0], { key: "Enter" });
    fireEvent.change(chips[0], { target: { value: "population" } });
    fireEvent.keyDown(chips[0], { key: "Enter" });

    expect(setEditingDataset).toHaveBeenCalledWith({
      keywords: { lg1: ["population"], lg2: [] },
    });
  });

  it("stores the linked documents", () => {
    const { setEditingDataset, container } = renderPanel({ linkedDocuments: [] });

    const chips = container.querySelectorAll(".p-chips-input-token input");
    const linkedDocuments = chips[chips.length - 1];
    fireEvent.change(linkedDocuments, { target: { value: "http://doc" } });
    fireEvent.keyDown(linkedDocuments, { key: "Enter" });

    expect(setEditingDataset).toHaveBeenCalledWith({ linkedDocuments: ["http://doc"] });
  });

  it("renders the two keyword fields side by side", () => {
    const { container } = renderPanel({ keywords: { lg1: ["a"], lg2: ["b"] } });

    expect(within(container).getAllByText("a")).not.toHaveLength(0);
    expect(within(container).getAllByText("b")).not.toHaveLength(0);
  });
});
