import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import "../../../i18n";
import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";
import { Component } from "./page";

vi.mock("../../../hooks/usePhysicalInstancesSearch");
vi.mock("@utils/hooks/useTitle");
vi.mock("@components/select-rmes", () => ({
  Select: ({ inputId, value, options, onChange, disabled }: any) => (
    <select
      id={inputId}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="" />
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

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
  ...over,
});

const mockData = (data: PhysicalInstanceSearchRow[], isLoading = false) =>
  vi.mocked(usePhysicalInstancesSearch).mockReturnValue({ data, isLoading } as any);

describe("Physical instances advanced search page", () => {
  it("shows a loading state while fetching", () => {
    mockData([], true);
    render(<Component />, { wrapper });
    expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
  });

  const twoRows = () => [
    row({
      id: "pi-1",
      label: "Recensement",
      studyUnitId: "su-1",
      studyUnitLabel: "Étude A",
      groupId: "g1",
      groupLabel: "Groupe X",
    }),
    row({
      id: "pi-2",
      label: "Enquête emploi",
      studyUnitId: "su-2",
      studyUnitLabel: "Étude B",
      groupId: "g2",
      groupLabel: "Groupe Y",
    }),
  ];

  it("renders each physical instance with its study unit and group labels", () => {
    mockData(twoRows());

    render(<Component />, { wrapper });

    expect(screen.getByRole("link", { name: "Recensement" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enquête emploi" })).toBeInTheDocument();
    // Libellés visibles dans la colonne du tableau.
    expect(screen.getByRole("cell", { name: "Étude A" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Groupe Y" })).toBeInTheDocument();
  });

  it("offers the distinct groups as select options", () => {
    mockData(twoRows());

    render(<Component />, { wrapper });

    expect(screen.getByRole("option", { name: "Groupe X" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Groupe Y" })).toBeInTheDocument();
  });

  it("disables the study unit select until a group is selected", async () => {
    const user = userEvent.setup();
    mockData(twoRows());

    render(<Component />, { wrapper });

    // Comboboxes dans l'ordre du DOM : [0] groupe, [1] étude.
    const [groupSelect, studyUnitSelect] = screen.getAllByRole("combobox");
    expect(studyUnitSelect).toBeDisabled();
    // Aucune étude proposée tant qu'aucun groupe n'est choisi.
    expect(screen.queryByRole("option", { name: "Étude A" })).not.toBeInTheDocument();

    await user.selectOptions(groupSelect, "g1");

    expect(studyUnitSelect).toBeEnabled();
  });

  it("only offers the study units of the selected group", async () => {
    const user = userEvent.setup();
    mockData(twoRows());

    render(<Component />, { wrapper });

    await user.selectOptions(screen.getAllByRole("combobox")[0], "g1");

    expect(screen.getByRole("option", { name: "Étude A" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Étude B" })).not.toBeInTheDocument();
  });

  it("links each row to the physical instance view page", () => {
    mockData([row({ id: "pi-1", label: "Recensement" })]);

    render(<Component />, { wrapper });

    expect(screen.getByRole("link", { name: "Recensement" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1",
    );
  });

  it("filters the results by the physical instance label", async () => {
    const user = userEvent.setup();
    mockData(twoRows());

    render(<Component />, { wrapper });

    await user.type(screen.getByRole("textbox"), "Recens");

    expect(screen.getByRole("link", { name: "Recensement" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Enquête emploi" })).not.toBeInTheDocument();
  });

  it("filters the results by the selected group", async () => {
    const user = userEvent.setup();
    mockData(twoRows());

    render(<Component />, { wrapper });

    // [0] groupe.
    await user.selectOptions(screen.getAllByRole("combobox")[0], "g1");

    expect(screen.getByRole("link", { name: "Recensement" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Enquête emploi" })).not.toBeInTheDocument();
  });

  it("filters the results by the selected study unit within a group", async () => {
    const user = userEvent.setup();
    mockData([
      row({
        id: "pi-1",
        label: "PI Un",
        studyUnitId: "su-1",
        studyUnitLabel: "Étude A",
        groupId: "g1",
        groupLabel: "Groupe X",
      }),
      row({
        id: "pi-2",
        label: "PI Deux",
        studyUnitId: "su-2",
        studyUnitLabel: "Étude B",
        groupId: "g1",
        groupLabel: "Groupe X",
      }),
    ]);

    render(<Component />, { wrapper });

    // On choisit d'abord le groupe (les deux PI restent), puis une étude du groupe.
    await user.selectOptions(screen.getAllByRole("combobox")[0], "g1");
    await user.selectOptions(screen.getAllByRole("combobox")[1], "su-2");

    expect(screen.getByRole("link", { name: "PI Deux" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "PI Un" })).not.toBeInTheDocument();
  });
});
