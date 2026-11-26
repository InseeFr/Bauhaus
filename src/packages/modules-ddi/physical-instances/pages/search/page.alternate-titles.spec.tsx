import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router";

import "../../../i18n";
import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";
import { Component } from "./page";

// Vrais selects (non mockés, contrairement à page.spec.tsx) : c'est leur recherche qui est testée.
vi.mock("../../../hooks/usePhysicalInstancesSearch");
vi.mock("@utils/hooks/useTitle");

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

const row = (over: Partial<PhysicalInstanceSearchRow>): PhysicalInstanceSearchRow => ({
  agency: "fr.insee",
  id: "pi",
  label: "",
  versionDate: null,
  studyUnitAgency: "fr.insee",
  studyUnitId: "su",
  studyUnitLabel: "",
  groupAgency: "fr.insee",
  groupId: "g",
  groupLabel: "",
  studyUnitAlternateTitles: [],
  groupAlternateTitles: [],
  ...over,
});

const rows = [
  row({
    id: "pi-1",
    label: "Fichier RP",
    studyUnitId: "su-1",
    studyUnitLabel: "Recensement 2026",
    studyUnitAlternateTitles: ["RP 2026"],
    groupId: "g1",
    groupLabel: "Recensement de la population",
    groupAlternateTitles: ["RP"],
  }),
  row({
    id: "pi-2",
    label: "Fichier SAEC",
    studyUnitId: "su-2",
    studyUnitLabel: "Enquête annuelle 2026",
    studyUnitAlternateTitles: ["SAEC 2026"],
    groupId: "g1",
    groupLabel: "Recensement de la population",
    groupAlternateTitles: ["RP"],
  }),
  row({
    id: "pi-3",
    label: "Fichier EEC",
    studyUnitId: "su-3",
    studyUnitLabel: "Enquête emploi 2026",
    groupId: "g2",
    groupLabel: "Enquête emploi en continu",
    groupAlternateTitles: ["EEC"],
  }),
];

/** Ouvre le select en position `index` (0 groupe, 1 étude), tape `search` dans son filtre. */
const searchInSelect = async (index: number, search: string) => {
  fireEvent.click(screen.getAllByRole("combobox")[index]);
  const listbox = await screen.findByRole("listbox", { hidden: true });
  fireEvent.change(document.querySelector(".p-dropdown-filter")!, { target: { value: search } });
  return listbox;
};

const optionLabels = (listbox: HTMLElement) =>
  within(listbox)
    .getAllByRole("option", { hidden: true })
    .map((option) => option.textContent);

describe("Physical instances advanced search page, alternate titles", () => {
  beforeEach(() => {
    vi.mocked(usePhysicalInstancesSearch).mockReturnValue({ data: rows, isLoading: false } as any);
  });

  it("finds a group by its alternate title", async () => {
    render(<Component />, { wrapper });

    const listbox = await searchInSelect(0, "EEC");

    await waitFor(() => expect(optionLabels(listbox)).toEqual(["Enquête emploi en continu"]));
  });

  it("finds a study unit of the selected group by its alternate title", async () => {
    render(<Component />, { wrapper });
    const groups = await searchInSelect(0, "RP");
    await waitFor(() => expect(optionLabels(groups)).toEqual(["Recensement de la population"]));
    fireEvent.click(within(groups).getByRole("option", { hidden: true }));

    const studyUnits = await searchInSelect(1, "SAEC");

    await waitFor(() => expect(optionLabels(studyUnits)).toEqual(["Enquête annuelle 2026"]));
  });
});
