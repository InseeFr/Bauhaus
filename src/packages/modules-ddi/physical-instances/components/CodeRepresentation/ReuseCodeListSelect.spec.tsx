import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ReuseCodeListSelect } from "./ReuseCodeListSelect";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.selectCodeList": "Sélectionnez une liste de codes",
        "physicalInstance.view.code.loadingCodeLists": "Chargement des listes de codes...",
        "physicalInstance.view.code.errorLoadingCodeLists":
          "Erreur lors du chargement des listes de codes",
        "physicalInstance.view.code.noCodeListsAvailable": "Aucune liste de codes disponible",
        "physicalInstance.view.code.groupCodeListsSection": "Listes du groupe",
        "physicalInstance.view.code.groupCodeListsSectionNamed": "Groupe : {{group}}",
        "physicalInstance.view.code.mutualizedCodeListsSection": "Listes mutualisées",
        "physicalInstance.view.code.mutualizedReadOnly": "Liste mutualisée (lecture seule)",
      };
      let value = translations[key] || key;
      if (options) {
        for (const [name, replacement] of Object.entries(options)) {
          value = value.replace(`{{${name}}}`, replacement);
        }
      }
      return value;
    },
  }),
}));

vi.mock("react-router-dom", () => import("./reactRouter.testing"));

const mockUseAllCodeLists = vi.fn();

vi.mock("../../../hooks/useAllCodeLists", () => ({
  useAllCodeLists: () => mockUseAllCodeLists(),
}));

vi.mock("primereact/progressspinner", () => import("./primereact.testing"));

vi.mock("primereact/message", () => import("./primereact.testing"));

vi.mock("primereact/dropdown", () => import("./primereact.testing"));

const GROUP_LABEL = "Base permanente des équipements";
const GROUP_SECTION = `Groupe : ${GROUP_LABEL}`;
const MUTUALIZED_SECTION = "Listes mutualisées";

describe("ReuseCodeListSelect", () => {
  const mockOnCodeListSelect = vi.fn();

  const mockCodeLists = [
    {
      id: "list-1",
      label: "Liste des statuts professionnels",
      agencyId: "fr.insee",
      mutualized: false,
    },
    {
      id: "list-2",
      label: "Liste des pays",
      agencyId: "fr.insee",
      mutualized: true,
    },
  ];

  /** Réponse du hook : pas de liste, pas de libellé de groupe, ni chargement ni erreur. */
  const mockAllCodeLists = (result: {
    data?: unknown[];
    groupLabel?: string;
    isLoading?: boolean;
    error?: Error | null;
  }) =>
    mockUseAllCodeLists.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      ...result,
    });

  /** Trois listes (deux « Pays » de versions différentes, une « Catégories ») d'une même origine. */
  const versionedCodeLists = (mutualized: boolean) =>
    [
      { id: "pays-old", label: "Pays", versionDate: "2024-01-15T00:00:00" },
      { id: "pays-new", label: "Pays", versionDate: "2026-06-29T00:00:00" },
      { id: "cat", label: "Catégories", versionDate: "2025-01-01T00:00:00" },
    ].map((codeList) => ({ ...codeList, agencyId: "fr.insee", mutualized }));

  const renderSelect = (selectedCodeListId: string | null = null) =>
    render(
      <ReuseCodeListSelect
        selectedCodeListId={selectedCodeListId}
        onCodeListSelect={mockOnCodeListSelect}
      />,
    );

  const dropdown = () => screen.getByTestId("code-list-dropdown");

  const sectionLabels = () =>
    Array.from(dropdown().querySelectorAll("optgroup")).map((g) => g.getAttribute("label"));

  const sectionOptions = (sectionLabel: string) =>
    Array.from(
      dropdown().querySelector(`optgroup[label="${sectionLabel}"]`)!.querySelectorAll("option"),
    );

  const optionByValue = (value: string) => dropdown().querySelector(`option[value="${value}"]`);

  beforeEach(() => {
    vi.clearAllMocks();
    mockAllCodeLists({ data: mockCodeLists, groupLabel: GROUP_LABEL });
  });

  it("should render dropdown when data is loaded", () => {
    renderSelect();

    expect(dropdown()).toBeInTheDocument();
  });

  it("should display loading spinner when loading", () => {
    mockAllCodeLists({ isLoading: true });

    renderSelect();

    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
    expect(screen.getByText("Chargement des listes de codes...")).toBeInTheDocument();
    expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display error message when loading fails", () => {
    mockAllCodeLists({ error: new Error("Network error") });

    renderSelect();

    expect(screen.getByTestId("message-error")).toBeInTheDocument();
    expect(screen.getByText("Erreur lors du chargement des listes de codes")).toBeInTheDocument();
    expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display info message when no codes lists are available", () => {
    mockAllCodeLists({});

    renderSelect();

    expect(screen.getByTestId("message-info")).toBeInTheDocument();
    expect(screen.getByText("Aucune liste de codes disponible")).toBeInTheDocument();
    expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display codes lists options", () => {
    renderSelect();

    const options = screen.getAllByRole("option");
    expect(options.some((opt) => opt.textContent === "Liste des statuts professionnels")).toBe(
      true,
    );
    expect(options.some((opt) => opt.textContent === "Liste des pays")).toBe(true);
  });

  it("should format option value as agency-id", () => {
    renderSelect();

    const options = dropdown().querySelectorAll("option");

    const firstOption = Array.from(options).find(
      (opt) => opt.textContent === "Liste des statuts professionnels",
    );
    expect(firstOption?.getAttribute("value")).toBe("fr.insee-list-1");
  });

  it("should call onCodeListSelect when an option is selected", () => {
    renderSelect();

    fireEvent.change(dropdown(), { target: { value: "fr.insee-list-1" } });

    expect(mockOnCodeListSelect).toHaveBeenCalledWith("fr.insee-list-1");
  });

  it("should display selected value", () => {
    renderSelect("fr.insee-list-2");

    expect((dropdown() as HTMLSelectElement).value).toBe("fr.insee-list-2");
  });

  it("should split options into a group section labelled with the group and a mutualized section", () => {
    renderSelect();

    // L'en-tête de la section « groupe » porte le libellé du groupe parent de la PI, préfixé.
    expect(sectionLabels()).toEqual([GROUP_SECTION, MUTUALIZED_SECTION]);

    const groupSection = dropdown().querySelector(`optgroup[label="${GROUP_SECTION}"]`);
    const mutualizedSection = dropdown().querySelector(`optgroup[label="${MUTUALIZED_SECTION}"]`);
    expect(groupSection?.querySelector('option[value="fr.insee-list-1"]')).not.toBeNull();
    expect(mutualizedSection?.querySelector('option[value="fr.insee-list-2"]')).not.toBeNull();
  });

  it("should fall back to the generic group section label when no group label is available", () => {
    mockAllCodeLists({ data: mockCodeLists, groupLabel: undefined });

    renderSelect();

    expect(sectionLabels()).toEqual(["Listes du groupe", MUTUALIZED_SECTION]);
  });

  it("should show a read-only lock on mutualized options only", () => {
    renderSelect();

    const groupOption = optionByValue("fr.insee-list-1");
    const mutualizedOption = optionByValue("fr.insee-list-2");
    expect(groupOption?.querySelector('[data-testid="mutualized-lock"]')).toBeNull();
    expect(mutualizedOption?.querySelector('[data-testid="mutualized-lock"]')).not.toBeNull();
  });

  it("should sort mutualized code lists alphabetically (ascending) by label", () => {
    mockAllCodeLists({
      data: [
        { id: "m1", label: "Zèbre", agencyId: "fr.insee", mutualized: true },
        { id: "m2", label: "Abeille", agencyId: "fr.insee", mutualized: true },
        { id: "m3", label: "Mouton", agencyId: "fr.insee", mutualized: true },
      ],
    });

    renderSelect();

    const labels = sectionOptions(MUTUALIZED_SECTION).map((o) => o.textContent);
    expect(labels).toEqual(["Abeille", "Mouton", "Zèbre"]);
  });

  it("orders mutualized lists by label asc, then most recent versionDate first for equal labels", () => {
    mockAllCodeLists({ data: versionedCodeLists(true) });

    renderSelect();

    const values = sectionOptions(MUTUALIZED_SECTION).map((o) => o.getAttribute("value"));
    // Catégories < Pays ; à libellé égal (Pays), la version la plus récente (2026) avant 2024.
    expect(values).toEqual(["fr.insee-cat", "fr.insee-pays-new", "fr.insee-pays-old"]);
  });

  it("orders group lists by label asc, then most recent versionDate first for equal labels", () => {
    mockAllCodeLists({ data: versionedCodeLists(false), groupLabel: GROUP_LABEL });

    renderSelect();

    const values = sectionOptions(GROUP_SECTION).map((o) => o.getAttribute("value"));
    expect(values).toEqual(["fr.insee-cat", "fr.insee-pays-new", "fr.insee-pays-old"]);
  });

  it("should display the label only, not the technical name", () => {
    mockAllCodeLists({
      data: [
        {
          id: "m1",
          label: "Libellé lisible",
          name: "CL_NOM_TECHNIQUE",
          agencyId: "fr.insee",
          mutualized: true,
        },
      ],
    });

    renderSelect();

    const option = optionByValue("fr.insee-m1");
    expect(option?.textContent).toContain("Libellé lisible");
    expect(option?.textContent).not.toContain("CL_NOM_TECHNIQUE");
  });

  it("should append the versionDate (JJ/MM/AAAA) in parentheses to the option label", () => {
    mockAllCodeLists({
      data: [
        {
          id: "m1",
          label: "Liste des pays",
          agencyId: "fr.insee",
          mutualized: true,
          versionDate: "2026-06-29T14:26:32.961778",
        },
      ],
    });

    renderSelect();

    expect(optionByValue("fr.insee-m1")?.textContent).toContain("Liste des pays (29/06/2026)");
  });

  it("should not render a section that has no code list", () => {
    mockAllCodeLists({
      data: [{ id: "g1", label: "Liste groupe", agencyId: "fr.insee", mutualized: false }],
    });

    renderSelect();

    expect(sectionLabels()).toEqual(["Listes du groupe"]);
  });
});
