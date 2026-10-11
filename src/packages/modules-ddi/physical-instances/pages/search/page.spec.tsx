import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ChangeEvent, ReactNode, useCallback } from "react";
import { MemoryRouter } from "react-router";

import "../../../i18n";
import { useTitle } from "@utils/hooks/useTitle";

import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";
import { Component } from "./page";

vi.mock("../../../hooks/usePhysicalInstancesSearch");
vi.mock("@utils/hooks/useTitle");
vi.mock("@components/select-rmes", async () => {
  const { NativeOptions } = await import("../pages.testing");
  return {
    Select: ({ inputId, value, options, onChange, disabled }: any) => {
      const handleChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value || null),
        [onChange],
      );
      return (
        <select id={inputId} value={value ?? ""} disabled={disabled} onChange={handleChange}>
          <option value="">-</option>
          <NativeOptions options={options} />
        </select>
      );
    },
  };
});

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

  it("titles the document with the module name first, then Advanced search", () => {
    mockData([]);
    render(<Component />, { wrapper });
    expect(useTitle).toHaveBeenCalledWith("Physical Instances - Advanced search");
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

  // [0] groupe.
  const renderWithGroupG1Selected = async () => {
    const user = userEvent.setup();
    mockData(twoRows());

    render(<Component />, { wrapper });

    await user.selectOptions(screen.getAllByRole("combobox")[0], "g1");
  };

  it("only offers the study units of the selected group", async () => {
    await renderWithGroupG1Selected();

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
    await renderWithGroupG1Selected();

    expect(screen.getByRole("link", { name: "Recensement" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Enquête emploi" })).not.toBeInTheDocument();
  });

  it("clears every criterion when the reset button is clicked", async () => {
    const user = userEvent.setup();
    await renderWithGroupG1Selected();
    await user.type(screen.getByRole("textbox"), "Recens");

    await user.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("");
    expect(screen.getByRole("link", { name: "Enquête emploi" })).toBeInTheDocument();
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
  it("keeps one table row per hit when a physical instance is attached to several study units", async () => {
    const user = userEvent.setup();
    // Le back renvoie une ligne par rattachement : la même PI (même id) sur deux études.
    mockData([
      row({ id: "pi-1", label: "Partagée", studyUnitId: "su-1", studyUnitLabel: "Étude A" }),
      row({ id: "pi-2", label: "Autre", studyUnitId: "su-2", studyUnitLabel: "Étude B" }),
      row({ id: "pi-1", label: "Partagée", studyUnitId: "su-3", studyUnitLabel: "Étude C" }),
    ]);

    render(<Component />, { wrapper });

    await user.type(screen.getByRole("textbox"), "Autre");
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Part");

    const studyUnitCells = screen
      .getAllByRole("row")
      .slice(1)
      .map((tr) => tr.querySelectorAll("td")[2]?.textContent);
    expect(studyUnitCells).toEqual(["Étude A", "Étude C"]);
  });
});
