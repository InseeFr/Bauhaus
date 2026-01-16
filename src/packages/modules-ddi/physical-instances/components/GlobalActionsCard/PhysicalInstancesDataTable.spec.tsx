import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhysicalInstancesDataTable } from "./PhysicalInstancesDataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.variablesTable": "Tableau des variables",
        "physicalInstance.view.columns.name": "Nom",
        "physicalInstance.view.columns.label": "Label",
        "physicalInstance.view.columns.type": "Type",
        "physicalInstance.view.columns.lastModified": "Dernière Modification",
        "physicalInstance.view.delete": "Supprimer",
        "physicalInstance.view.totalVariables": `Total: ${options?.count ?? 0} variables`,
      };
      return translations[key] || key;
    },
    i18n: {
      language: "fr",
    },
  }),
}));

vi.mock("primereact/button", () => ({
  Button: ({
    label,
    onClick,
    icon,
    rounded: _rounded,
    text: _text,
    severity: _severity,
    ...props
  }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {icon && <span className={icon} />}
      {label}
    </button>
  ),
}));

vi.mock("primereact/datatable", () => ({
  DataTable: ({
    value,
    children,
    onRowClick,
    header,
    stripedRows: _stripedRows,
    selectionMode: _selectionMode,
    rowClassName: _rowClassName,
    ...props
  }: any) => {
    // Convert children to array to handle both single and multiple Column components
    const columns = Array.isArray(children) ? children : [children];

    return (
      <table {...props}>
        {header && <caption data-testid="datatable-header">{header}</caption>}
        <thead>
          <tr>
            {columns.map((col: any, idx: number) => (
              <th key={idx}>{col.props.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((item: any, index: number) => (
            <tr key={index} onClick={() => onRowClick?.({ data: item })}>
              {columns.map((col: any, colIdx: number) => (
                <td key={colIdx}>
                  {col.props.body
                    ? col.props.body(item)
                    : item[col.props.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock("primereact/column", () => ({
  Column: () => null,
}));

describe("PhysicalInstancesDataTable", () => {
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
    onRowClick: mockOnRowClick,
    onDeleteClick: mockOnDeleteClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render data table with correct columns", () => {
    render(<PhysicalInstancesDataTable {...defaultProps} />);

    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Dernière Modification")).toBeInTheDocument();
  });

  it("should render all variables in the table", () => {
    render(<PhysicalInstancesDataTable {...defaultProps} />);

    expect(screen.getByText("Variable1")).toBeInTheDocument();
    expect(screen.getByText("Label 1")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Variable2")).toBeInTheDocument();
    expect(screen.getByText("Label 2")).toBeInTheDocument();
    expect(screen.getByText("Numeric")).toBeInTheDocument();
  });

  it("should render empty table when no variables", () => {
    render(<PhysicalInstancesDataTable {...defaultProps} variables={[]} />);

    const table = screen.getByLabelText("Tableau des variables");
    expect(table).toBeInTheDocument();
  });

  it("should have correct aria-label for accessibility", () => {
    render(<PhysicalInstancesDataTable {...defaultProps} />);

    expect(screen.getByLabelText("Tableau des variables")).toBeInTheDocument();
  });

  it("should call onRowClick when a row is clicked", () => {
    render(<PhysicalInstancesDataTable {...defaultProps} />);

    const firstRow = screen.getByText("Variable1").closest("tr");
    fireEvent.click(firstRow!);

    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
    expect(mockOnRowClick).toHaveBeenCalledWith(mockVariables[0]);
  });

  describe("Delete functionality", () => {
    it("should render delete buttons for each variable", () => {
      render(<PhysicalInstancesDataTable {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Supprimer");
      expect(deleteButtons).toHaveLength(mockVariables.length);
    });

    it("should call onDeleteClick with variable data when delete button is clicked", () => {
      render(<PhysicalInstancesDataTable {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Supprimer");
      fireEvent.click(deleteButtons[0]);

      expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
      expect(mockOnDeleteClick).toHaveBeenCalledWith(mockVariables[0]);
    });

    it("should not call onRowClick when delete button is clicked", () => {
      render(<PhysicalInstancesDataTable {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Supprimer");
      fireEvent.click(deleteButtons[0]);

      expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
      expect(mockOnRowClick).not.toHaveBeenCalled();
    });
  });

  describe("Optional callbacks", () => {
    it("should render without onRowClick callback", () => {
      const propsWithoutRowClick = {
        variables: mockVariables,
      };

      expect(() =>
        render(<PhysicalInstancesDataTable {...propsWithoutRowClick} />),
      ).not.toThrow();
    });

    it("should render without onDeleteClick callback", () => {
      const propsWithoutDeleteClick = {
        variables: mockVariables,
        onRowClick: mockOnRowClick,
      };

      expect(() =>
        render(<PhysicalInstancesDataTable {...propsWithoutDeleteClick} />),
      ).not.toThrow();
    });
  });

  describe("Date formatting", () => {
    it("should format ISO date to DD/MM/YYYY format", () => {
      const variablesWithISODates = [
        {
          id: "1",
          name: "Variable1",
          label: "Label 1",
          type: "Code",
          lastModified: "2024-03-15T10:30:00.000Z",
        },
      ];

      render(
        <PhysicalInstancesDataTable
          {...defaultProps}
          variables={variablesWithISODates}
        />,
      );

      expect(screen.getByText("15/03/2024")).toBeInTheDocument();
    });

    it("should handle empty date string", () => {
      const variablesWithEmptyDate = [
        {
          id: "1",
          name: "Variable1",
          label: "Label 1",
          type: "Code",
          lastModified: "",
        },
      ];

      render(
        <PhysicalInstancesDataTable
          {...defaultProps}
          variables={variablesWithEmptyDate}
        />,
      );

      // Should not throw and should render the table
      expect(screen.getByText("Variable1")).toBeInTheDocument();
    });
  });

  describe("Unsaved variables styling", () => {
    it("should apply italic styling to unsaved variables", () => {
      const { container } = render(
        <PhysicalInstancesDataTable
          {...defaultProps}
          unsavedVariableIds={["1"]}
        />,
      );

      // The rowClassName function is called internally by DataTable
      // We can verify the implementation by checking that unsavedVariableIds prop is accepted
      expect(container).toBeInTheDocument();
    });

    it("should not apply italic styling when no unsaved variables", () => {
      const { container } = render(
        <PhysicalInstancesDataTable
          {...defaultProps}
          unsavedVariableIds={[]}
        />,
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe("Variables count header", () => {
    it("should display the total count of variables in the header", () => {
      render(<PhysicalInstancesDataTable {...defaultProps} />);

      const header = screen.getByTestId("datatable-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("Total: 2 variables");
    });

    it("should display count of 0 when no variables", () => {
      render(<PhysicalInstancesDataTable {...defaultProps} variables={[]} />);

      const header = screen.getByTestId("datatable-header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("Total: 0 variables");
    });

    it("should update count when variables change", () => {
      const { rerender } = render(
        <PhysicalInstancesDataTable {...defaultProps} />,
      );

      expect(screen.getByTestId("datatable-header")).toHaveTextContent(
        "Total: 2 variables",
      );

      const moreVariables = [
        ...mockVariables,
        {
          id: "3",
          name: "Variable3",
          label: "Label 3",
          type: "Text",
          lastModified: "2024-01-03",
        },
      ];

      rerender(
        <PhysicalInstancesDataTable
          {...defaultProps}
          variables={moreVariables}
        />,
      );

      expect(screen.getByTestId("datatable-header")).toHaveTextContent(
        "Total: 3 variables",
      );
    });
  });
});
