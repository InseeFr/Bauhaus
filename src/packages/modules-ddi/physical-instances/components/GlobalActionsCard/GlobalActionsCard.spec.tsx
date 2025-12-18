import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GlobalActionsCard } from "./GlobalActionsCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.globalActions": "Actions Globales",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/card", () => ({
  Card: ({ title, children }: any) => (
    <div data-testid="card">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock("./GlobalActionToolbar", () => ({
  GlobalActionToolbar: ({ onExport, onDuplicate }: any) => (
    <div data-testid="global-action-toolbar">
      <button onClick={() => onExport("DDI3")}>Export Toolbar</button>
      {onDuplicate && <button onClick={onDuplicate}>Duplicate Toolbar</button>}
    </div>
  ),
}));

vi.mock("./PhysicalInstancesDataTable", () => ({
  PhysicalInstancesDataTable: ({
    variables,
    onRowClick,
    onDeleteClick,
    unsavedVariableIds,
  }: any) => (
    <div data-testid="physical-instances-data-table">
      <div>Variables: {variables.length}</div>
      <div>Unsaved: {unsavedVariableIds.length}</div>
    </div>
  ),
}));

describe("GlobalActionsCard", () => {
  const mockOnExport = vi.fn();
  const mockOnDuplicate = vi.fn();
  const mockOnRowClick = vi.fn();
  const mockOnDeleteClick = vi.fn();

  const mockVariables = [
    {
      id: "1",
      name: "Variable1",
      label: "Label 1",
      type: "Code",
      lastModified: "2024-01-01",
    },
    {
      id: "2",
      name: "Variable2",
      label: "Label 2",
      type: "Numeric",
      lastModified: "2024-01-02",
    },
  ];

  const defaultProps = {
    variables: mockVariables,
    onExport: mockOnExport,
    onDuplicate: mockOnDuplicate,
    onRowClick: mockOnRowClick,
    onDeleteClick: mockOnDeleteClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render card with title", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    expect(screen.getByText("Actions Globales")).toBeInTheDocument();
  });

  it("should render GlobalActionToolbar component", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    expect(screen.getByTestId("global-action-toolbar")).toBeInTheDocument();
  });

  it("should render PhysicalInstancesDataTable component", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    expect(screen.getByTestId("physical-instances-data-table")).toBeInTheDocument();
  });

  it("should pass onExport prop to GlobalActionToolbar", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    const exportButton = screen.getByText("Export Toolbar");
    exportButton.click();

    expect(mockOnExport).toHaveBeenCalledWith("DDI3");
  });

  it("should pass variables to PhysicalInstancesDataTable", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    expect(screen.getByText(`Variables: ${mockVariables.length}`)).toBeInTheDocument();
  });

  it("should pass unsavedVariableIds to PhysicalInstancesDataTable", () => {
    render(<GlobalActionsCard {...defaultProps} unsavedVariableIds={["1", "2"]} />);

    expect(screen.getByText("Unsaved: 2")).toBeInTheDocument();
  });

  it("should use empty array as default for unsavedVariableIds", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    expect(screen.getByText("Unsaved: 0")).toBeInTheDocument();
  });

  it("should render without optional callbacks", () => {
    const propsWithoutOptionals = {
      variables: mockVariables,
      onExport: mockOnExport,
    };

    expect(() => render(<GlobalActionsCard {...propsWithoutOptionals} />)).not.toThrow();
  });

  it("should render with empty variables array", () => {
    const propsWithEmptyVariables = {
      ...defaultProps,
      variables: [],
    };

    render(<GlobalActionsCard {...propsWithEmptyVariables} />);

    expect(screen.getByText("Variables: 0")).toBeInTheDocument();
  });

  it("should pass onDuplicate prop to GlobalActionToolbar", () => {
    render(<GlobalActionsCard {...defaultProps} />);

    const duplicateButton = screen.getByText("Duplicate Toolbar");
    duplicateButton.click();

    expect(mockOnDuplicate).toHaveBeenCalledTimes(1);
  });

  it("should render without onDuplicate callback", () => {
    const propsWithoutDuplicate = {
      variables: mockVariables,
      onExport: mockOnExport,
    };

    expect(() => render(<GlobalActionsCard {...propsWithoutDuplicate} />)).not.toThrow();
  });
});
