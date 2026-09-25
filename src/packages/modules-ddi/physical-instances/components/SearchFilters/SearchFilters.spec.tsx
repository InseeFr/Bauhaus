import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { mockDdiAccess } from "../GlobalActionsCard/actions.testing";
import { SearchFilters } from "./SearchFilters";

vi.mock("react-i18next", async () =>
  (await import("../GlobalActionsCard/translations.testing")).mockTranslations({
    "physicalInstance.view.search": "Rechercher",
    "physicalInstance.view.typeFilter": "Filtrer par type",
    "physicalInstance.view.newVariable": "Nouvelle Variable",
    "physicalInstance.view.saveAll": "Tout enregistrer",
  }),
);

// On monte le vrai <HasAccess> ; seules les sources de privilèges et de
// stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

vi.mock("primereact/inputtext", () => ({
  InputText: ({ value, onChange, placeholder, className, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}));

vi.mock("primereact/dropdown", async () => {
  const { NativeOptions } = await import("../../pages/pages.testing");
  return {
    Dropdown: ({ value, options, onChange, className, ...props }: any) => (
      <select
        value={value}
        onChange={(e) => onChange({ value: e.target.value })}
        className={className}
        {...props}
      >
        <NativeOptions options={options} />
      </select>
    ),
  };
});

vi.mock("primereact/button", () => import("../GlobalActionsCard/actions.testing"));

vi.mock("primereact/iconfield", () => ({
  IconField: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock("primereact/inputicon", () => ({
  InputIcon: ({ className, children }: any) => <span className={className}>{children}</span>,
}));

describe("SearchFilters", () => {
  const mockOnSearchChange = vi.fn();
  const mockOnTypeFilterChange = vi.fn();
  const mockOnNewVariable = vi.fn();
  const mockOnSaveAll = vi.fn();

  const defaultProps = {
    searchValue: "",
    onSearchChange: mockOnSearchChange,
    typeFilter: "all",
    onTypeFilterChange: mockOnTypeFilterChange,
    typeOptions: [
      { label: "Tous types", value: "all" },
      { label: "Code", value: "code" },
      { label: "Numeric", value: "numeric" },
    ],
    onNewVariable: mockOnNewVariable,
    onSaveAll: mockOnSaveAll,
    hasLocalChanges: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut : stratégie ALL → les boutons UPDATE sont rendus.
    mockDdiAccess("UPDATE", "ALL");
  });

  it("should render search input with placeholder", () => {
    render(<SearchFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Rechercher");
    expect(searchInput).toBeInTheDocument();
  });

  it("should render type filter dropdown with options", () => {
    render(<SearchFilters {...defaultProps} />);

    const dropdown = screen.getByLabelText("Filtrer par type");
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText("Tous types")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Numeric")).toBeInTheDocument();
  });

  it("should render new variable button", () => {
    render(<SearchFilters {...defaultProps} />);

    const button = screen.getByText("Nouvelle Variable");
    expect(button).toBeInTheDocument();
  });

  it("should call onSearchChange when search input changes", () => {
    render(<SearchFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Rechercher");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("test search");
  });

  it("should call onTypeFilterChange when dropdown value changes", () => {
    render(<SearchFilters {...defaultProps} />);

    const dropdown = screen.getByLabelText("Filtrer par type");
    fireEvent.change(dropdown, { target: { value: "code" } });

    expect(mockOnTypeFilterChange).toHaveBeenCalledWith("code");
  });

  it("should call onNewVariable when button is clicked", () => {
    render(<SearchFilters {...defaultProps} />);

    const button = screen.getByText("Nouvelle Variable");
    fireEvent.click(button);

    expect(mockOnNewVariable).toHaveBeenCalledTimes(1);
  });

  it("should display current search value", () => {
    render(<SearchFilters {...defaultProps} searchValue="test" />);

    const searchInput = screen.getByPlaceholderText("Rechercher") as HTMLInputElement;
    expect(searchInput.value).toBe("test");
  });

  it("should display current type filter value", () => {
    render(<SearchFilters {...defaultProps} typeFilter="code" />);

    const dropdown = screen.getByLabelText("Filtrer par type") as HTMLSelectElement;
    expect(dropdown.value).toBe("code");
  });

  it("should render save all button", () => {
    render(<SearchFilters {...defaultProps} />);

    const button = screen.getByText("Tout enregistrer");
    expect(button).toBeInTheDocument();
  });

  it("should have save all button disabled when hasLocalChanges is false", () => {
    render(<SearchFilters {...defaultProps} hasLocalChanges={false} />);

    const button = screen.getByText("Tout enregistrer");
    expect(button).toBeDisabled();
  });

  it("should have save all button enabled when hasLocalChanges is true", () => {
    render(<SearchFilters {...defaultProps} hasLocalChanges={true} />);

    const button = screen.getByText("Tout enregistrer");
    expect(button).not.toBeDisabled();
  });

  it("should call onSaveAll when save all button is clicked", () => {
    render(<SearchFilters {...defaultProps} hasLocalChanges={true} />);

    const button = screen.getByText("Tout enregistrer");
    fireEvent.click(button);

    expect(mockOnSaveAll).toHaveBeenCalledTimes(1);
  });

  describe("gating STAMP des boutons UPDATE", () => {
    it("affiche les boutons quand un stamp utilisateur appartient à parents.stamps", () => {
      mockDdiAccess("UPDATE", "STAMP", ["STAMP1"]);

      render(<SearchFilters {...defaultProps} stamps={["STAMP1", "STAMP2"]} />);

      expect(screen.queryByText("Tout enregistrer")).toBeInTheDocument();
      expect(screen.queryByText("Nouvelle Variable")).toBeInTheDocument();
    });

    it("masque les boutons quand aucun stamp utilisateur n'appartient à parents.stamps", () => {
      mockDdiAccess("UPDATE", "STAMP", ["STAMP9"]);

      render(<SearchFilters {...defaultProps} stamps={["STAMP1", "STAMP2"]} />);

      expect(screen.queryByText("Tout enregistrer")).not.toBeInTheDocument();
      expect(screen.queryByText("Nouvelle Variable")).not.toBeInTheDocument();
    });
  });
});
