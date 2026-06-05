import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReuseCodeListSelect } from "./ReuseCodeListSelect";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.selectCodeList": "Sélectionnez une liste de codes",
        "physicalInstance.view.code.loadingCodesLists": "Chargement des listes de codes...",
        "physicalInstance.view.code.errorLoadingCodesLists":
          "Erreur lors du chargement des listes de codes",
        "physicalInstance.view.code.noCodesListsAvailable": "Aucune liste de codes disponible",
        "physicalInstance.view.code.groupCodesListsSection": "Listes du groupe",
        "physicalInstance.view.code.mutualizedCodesListsSection": "Listes mutualisées",
        "physicalInstance.view.code.mutualizedReadOnly": "Liste mutualisée (lecture seule)",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({
    id: "test-physical-instance-id",
    agencyId: "fr.insee",
  }),
}));

const mockUseAllCodesLists = vi.fn();

vi.mock("../../../hooks/useAllCodesLists", () => ({
  useAllCodesLists: () => mockUseAllCodesLists(),
}));

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: ({ style }: any) => (
    <div data-testid="progress-spinner" style={style}>
      Loading...
    </div>
  ),
}));

vi.mock("primereact/message", () => ({
  Message: ({ severity, text }: any) => <div data-testid={`message-${severity}`}>{text}</div>,
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({
    value,
    options,
    onChange,
    placeholder,
    className,
    optionGroupLabel,
    optionGroupChildren,
    optionLabel,
    optionValue,
    itemTemplate,
  }: any) => (
    <select
      data-testid="codes-list-dropdown"
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
      className={className}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options?.map((group: any) => (
        <optgroup key={group[optionGroupLabel]} label={group[optionGroupLabel]}>
          {group[optionGroupChildren].map((option: any) => (
            <option key={option[optionValue]} value={option[optionValue]}>
              {itemTemplate ? itemTemplate(option) : option[optionLabel]}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  ),
}));

describe("ReuseCodeListSelect", () => {
  const mockOnCodeListSelect = vi.fn();

  const mockCodesLists = [
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAllCodesLists.mockReturnValue({
      data: mockCodesLists,
      isLoading: false,
      error: null,
    });
  });

  it("should render dropdown when data is loaded", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();
  });

  it("should display loading spinner when loading", () => {
    mockUseAllCodesLists.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
    expect(screen.getByText("Chargement des listes de codes...")).toBeInTheDocument();
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display error message when loading fails", () => {
    mockUseAllCodesLists.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Network error"),
    });

    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    expect(screen.getByTestId("message-error")).toBeInTheDocument();
    expect(screen.getByText("Erreur lors du chargement des listes de codes")).toBeInTheDocument();
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display info message when no codes lists are available", () => {
    mockUseAllCodesLists.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    expect(screen.getByTestId("message-info")).toBeInTheDocument();
    expect(screen.getByText("Aucune liste de codes disponible")).toBeInTheDocument();
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display codes lists options", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const options = screen.getAllByRole("option");
    expect(options.some((opt) => opt.textContent === "Liste des statuts professionnels")).toBe(
      true,
    );
    expect(options.some((opt) => opt.textContent === "Liste des pays")).toBe(true);
  });

  it("should format option value as agency-id", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const dropdown = screen.getByTestId("codes-list-dropdown");
    const options = dropdown.querySelectorAll("option");

    const firstOption = Array.from(options).find(
      (opt) => opt.textContent === "Liste des statuts professionnels",
    );
    expect(firstOption?.getAttribute("value")).toBe("fr.insee-list-1");
  });

  it("should call onCodeListSelect when an option is selected", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const dropdown = screen.getByTestId("codes-list-dropdown");
    fireEvent.change(dropdown, { target: { value: "fr.insee-list-1" } });

    expect(mockOnCodeListSelect).toHaveBeenCalledWith("fr.insee-list-1");
  });

  it("should display selected value", () => {
    render(
      <ReuseCodeListSelect
        selectedCodeListId="fr.insee-list-2"
        onCodeListSelect={mockOnCodeListSelect}
      />,
    );

    const dropdown = screen.getByTestId("codes-list-dropdown") as HTMLSelectElement;
    expect(dropdown.value).toBe("fr.insee-list-2");
  });

  it("should split options into a group section and a mutualized section", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const dropdown = screen.getByTestId("codes-list-dropdown");
    const groups = dropdown.querySelectorAll("optgroup");
    expect(Array.from(groups).map((g) => g.getAttribute("label"))).toEqual([
      "Listes du groupe",
      "Listes mutualisées",
    ]);

    const groupSection = dropdown.querySelector('optgroup[label="Listes du groupe"]');
    const mutualizedSection = dropdown.querySelector('optgroup[label="Listes mutualisées"]');
    expect(groupSection?.querySelector('option[value="fr.insee-list-1"]')).not.toBeNull();
    expect(mutualizedSection?.querySelector('option[value="fr.insee-list-2"]')).not.toBeNull();
  });

  it("should show a read-only lock on mutualized options only", () => {
    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const dropdown = screen.getByTestId("codes-list-dropdown");
    const groupOption = dropdown.querySelector('option[value="fr.insee-list-1"]');
    const mutualizedOption = dropdown.querySelector('option[value="fr.insee-list-2"]');
    expect(groupOption?.querySelector('[data-testid="mutualized-lock"]')).toBeNull();
    expect(mutualizedOption?.querySelector('[data-testid="mutualized-lock"]')).not.toBeNull();
  });

  it("should not render a section that has no code list", () => {
    mockUseAllCodesLists.mockReturnValue({
      data: [{ id: "g1", label: "Liste groupe", agencyId: "fr.insee", mutualized: false }],
      isLoading: false,
      error: null,
    });

    render(
      <ReuseCodeListSelect selectedCodeListId={null} onCodeListSelect={mockOnCodeListSelect} />,
    );

    const groups = screen.getByTestId("codes-list-dropdown").querySelectorAll("optgroup");
    expect(Array.from(groups).map((g) => g.getAttribute("label"))).toEqual(["Listes du groupe"]);
  });
});
