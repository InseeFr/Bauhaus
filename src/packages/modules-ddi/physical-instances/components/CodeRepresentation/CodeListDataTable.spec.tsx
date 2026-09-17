import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import type { ComponentProps } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.codeListLabel": "Libellé de la liste de codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCode": "Ajouter un code",
        "physicalInstance.view.code.noCodes": "Aucun code",
        "physicalInstance.view.code.actionsMenu": "Menu des actions",
        "physicalInstance.view.code.moveUp": "Monter",
        "physicalInstance.view.code.moveDown": "Descendre",
        "physicalInstance.view.code.deleteCode": "Supprimer",
        "physicalInstance.view.code.categoryUsage.menuEntry": "Utilisation",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => import("./primereact.testing"));

vi.mock("primereact/button", () => ({
  Button: ({ icon, onClick, label, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {label || icon}
    </button>
  ),
}));

vi.mock("primereact/overlaypanel", () => import("./primereact.testing"));

vi.mock("primereact/datatable", () => ({
  DataTable: ({ value, children, emptyMessage }: any) => {
    const columns = Array.isArray(children) ? children : [children];

    if (!value || value.length === 0) {
      return (
        <table>
          <thead>
            <tr>
              {columns.map((column: any, colIndex: number) => (
                <th key={colIndex}>{column?.props?.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            {columns.map((column: any, colIndex: number) => (
              <th key={colIndex}>{column?.props?.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value?.map((row: any, index: number) => (
            <tr key={index} data-testid={`row-${index}`}>
              {columns.map((column: any, colIndex: number) => {
                if (column?.props?.body) {
                  return <td key={colIndex}>{column.props.body(row, { rowIndex: index })}</td>;
                }
                return <td key={colIndex}>{row[column?.props?.field]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock("primereact/column", () => import("./primereact.testing"));

describe("CodeListDataTable", () => {
  const mockOnCodeListLabelChange = vi.fn();
  const mockOnCellEdit = vi.fn();
  const mockOnDeleteCode = vi.fn();
  const mockOnAddCode = vi.fn();
  const mockOnMoveCode = vi.fn();

  const mockCodes: CodeTableRow[] = [
    { id: "code-1", value: "1", label: "Label 1", categoryId: "category-1" },
    { id: "code-2", value: "2", label: "Label 2", categoryId: "category-2" },
  ];

  const renderDataTable = (props: Partial<ComponentProps<typeof CodeListDataTable>> = {}) =>
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
        {...props}
      />,
    );

  /** Tous les champs texte du tableau (libellé de la liste puis valeur/libellé de chaque code). */
  const allTextboxes = () => {
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0);
    return inputs;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render code list label input", () => {
    renderDataTable();

    expect(screen.getByLabelText("Libellé de la liste de codes")).toBeInTheDocument();
  });

  it("should display initial code list label", () => {
    renderDataTable();

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("Test Label");
  });

  it("should call onCodeListLabelChange when label changes", () => {
    renderDataTable();

    const labelInput = screen.getByLabelText("Libellé de la liste de codes");
    fireEvent.change(labelInput, { target: { value: "New Label" } });

    expect(mockOnCodeListLabelChange).toHaveBeenCalledWith("New Label");
  });

  it("should render table with codes", () => {
    renderDataTable();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(2);
  });

  it("should render Add a code button", () => {
    renderDataTable();

    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });

  it("should call onAddCode when Add a code button is clicked", () => {
    renderDataTable();

    const addButton = screen.getByText("Ajouter un code");
    fireEvent.click(addButton);

    expect(mockOnAddCode).toHaveBeenCalledWith("", "");
  });

  it("should show empty message when no codes", () => {
    renderDataTable({ codes: [] });

    expect(screen.getByText("Aucun code")).toBeInTheDocument();
  });

  it("should render action menu button for each code", () => {
    renderDataTable();

    const menuButtons = screen.getAllByText("pi pi-ellipsis-v");
    expect(menuButtons).toHaveLength(2);
  });

  describe("entrée de menu « Utilisation »", () => {
    it("should call onShowCategoryUsage with the row when the entry is clicked", () => {
      const mockOnShowCategoryUsage = vi.fn();
      renderDataTable({ onShowCategoryUsage: mockOnShowCategoryUsage });

      fireEvent.click(screen.getAllByText("Utilisation")[1]);

      expect(mockOnShowCategoryUsage).toHaveBeenCalledWith(mockCodes[1]);
    });

    it("should not render the entry when no handler is provided", () => {
      renderDataTable();

      expect(screen.queryByText("Utilisation")).not.toBeInTheDocument();
    });
  });

  it.each([
    { field: "value", inputIndex: 1, initialValue: "1", newValue: "updated-value" },
    { field: "label", inputIndex: 2, initialValue: "Label 1", newValue: "Updated Label" },
  ] as const)(
    "should call onCellEdit when code $field is edited",
    ({ field, inputIndex, initialValue, newValue }) => {
      renderDataTable();

      const inputs = screen.getAllByRole("textbox");
      // First input is code list label, then value/label pairs for each code
      const codeInput = inputs[inputIndex] as HTMLInputElement;

      expect(codeInput.value).toBe(initialValue);

      fireEvent.change(codeInput, { target: { value: newValue } });

      expect(mockOnCellEdit).toHaveBeenCalledWith(mockCodes[0], field, newValue);
    },
  );

  it("should render with empty codes array", () => {
    renderDataTable({ codeListLabel: "", codes: [] });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });

  describe("readOnly mode", () => {
    it("should hide the Add a code button when readOnly", () => {
      renderDataTable({ readOnly: true });

      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
    });

    it("should hide the action menu when readOnly", () => {
      renderDataTable({ readOnly: true });

      expect(screen.queryByText("pi pi-ellipsis-v")).not.toBeInTheDocument();
    });

    it("should disable code list label and code inputs when readOnly", () => {
      renderDataTable({ readOnly: true });

      allTextboxes().forEach((input) => {
        expect(input).toHaveAttribute("readOnly");
      });
    });

    it("should grey out the code list label and code inputs when readOnly", () => {
      renderDataTable({ readOnly: true });

      allTextboxes().forEach((input) => {
        expect(input).toHaveClass("code-list-readonly-input");
      });
    });

    it("should not grey out the inputs when editable", () => {
      renderDataTable();

      allTextboxes().forEach((input) => {
        expect(input).not.toHaveClass("code-list-readonly-input");
      });
    });
  });

  describe("guarding an edited cell", () => {
    const mockOnCellCommit = vi.fn(() => Promise.resolve(false));
    const mockOnCodeListLabelCommit = vi.fn(() => Promise.resolve(false));

    /**
     * Reproduit ce que fait le vrai parent : chaque frappe met à jour l'état local, donc la
     * ligne est re-rendue avec la valeur saisie — c'est précisément ce qui rend l'édition fluide.
     */
    const Harness = ({ initialLabel = "Test Label" }: { initialLabel?: string }) => {
      const [codes, setCodes] = useState(mockCodes);
      const [label, setLabel] = useState(initialLabel);
      return (
        <CodeListDataTable
          codeListLabel={label}
          codes={codes}
          onCodeListLabelChange={(newLabel) => {
            mockOnCodeListLabelChange(newLabel);
            setLabel(newLabel);
          }}
          onCodeListLabelCommit={mockOnCodeListLabelCommit}
          onCellEdit={(rowData, field, newValue) => {
            mockOnCellEdit(rowData, field, newValue);
            setCodes((current) =>
              current.map((code) =>
                code.id === rowData.id ? { ...code, [field]: newValue } : code,
              ),
            );
          }}
          onCellCommit={mockOnCellCommit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
        />
      );
    };

    const renderTable = () => render(<Harness />);

    /** Rend le tableau et renvoie le champ du libellé du premier code. */
    const renderFirstLabelInput = () => {
      renderTable();
      return screen.getAllByPlaceholderText("Libellé")[0];
    };

    it("asks for a decision as soon as the user types, on the very first keystroke", async () => {
      const input = renderFirstLabelInput();

      fireEvent.change(input, { target: { value: "E" } });

      // La frappe est appliquée telle quelle — le caractère saisi ne disparaît pas…
      expect(mockOnCellEdit).toHaveBeenCalledWith(expect.anything(), "label", "E");
      // …et la décision est demandée dans la foulée, sans attendre la sortie du champ.
      await vi.waitFor(() =>
        expect(mockOnCellCommit).toHaveBeenCalledWith(
          expect.objectContaining({ id: "code-1" }),
          "label",
          {
            value: "E",
            previousValue: "Label 1",
          },
        ),
      );
    });

    it("asks only once per editing session, whatever the number of keystrokes", async () => {
      const input = renderFirstLabelInput();

      fireEvent.change(input, { target: { value: "E" } });
      await vi.waitFor(() => expect(mockOnCellCommit).toHaveBeenCalledTimes(1));
      fireEvent.change(input, { target: { value: "Eu" } });
      fireEvent.change(input, { target: { value: "Eur" } });

      // La suite de la saisie passe sans repasser par la garde.
      expect(mockOnCellEdit).toHaveBeenCalledTimes(3);
      expect(mockOnCellCommit).toHaveBeenCalledTimes(1);
    });

    it("does not ask anything when the field is merely traversed", () => {
      const input = renderFirstLabelInput();

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(mockOnCellCommit).not.toHaveBeenCalled();
    });

    it("does not take an incoming value for a user edit", () => {
      // Régression : le champ du libellé porte `autoFocus`, il prend le focus avant que l'état
      // ne soit initialisé. Le libellé arrivant ensuite ne doit pas passer pour une saisie.
      render(<Harness initialLabel="" />);
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.focus(labelInput);
      fireEvent.blur(labelInput);

      expect(mockOnCodeListLabelCommit).not.toHaveBeenCalled();
    });

    it("freezes the field while the decision is being resolved", async () => {
      // La garde est asynchrone. Sans ce gel, les caractères tapés pendant sa résolution ne
      // seraient pas couverts par la décision — et disparaîtraient à la création d'une variante.
      let decide: (interrupted: boolean) => void = () => {};
      mockOnCellCommit.mockReturnValueOnce(
        new Promise<boolean>((resolve) => {
          decide = resolve;
        }),
      );
      const input = renderFirstLabelInput();

      fireEvent.change(input, { target: { value: "E" } });

      await vi.waitFor(() => expect(input).toHaveAttribute("readonly"));

      decide(true);
      await vi.waitFor(() => expect(input).not.toHaveAttribute("readonly"));
    });

    it("gives the focus back to the edited cell when a dialog interrupted the edit", async () => {
      // Sans cela, l'utilisateur au clavier est éjecté du tableau après chaque confirmation.
      mockOnCellCommit.mockResolvedValueOnce(true);
      const input = renderFirstLabelInput();

      fireEvent.change(input, { target: { value: "E" } });

      await vi.waitFor(() => expect(input).toHaveFocus());
    });

    it("leaves the focus alone when nothing interrupted the edit", async () => {
      // L'utilisateur n'a pas été dérangé : lui déplacer le focus serait gratuit.
      mockOnCellCommit.mockResolvedValueOnce(false);
      const input = renderFirstLabelInput();

      fireEvent.change(input, { target: { value: "E" } });

      await vi.waitFor(() => expect(mockOnCellCommit).toHaveBeenCalled());
      expect(input).not.toHaveFocus();
    });

    it("guards the code list label the same way", async () => {
      renderTable();
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");

      fireEvent.change(labelInput, { target: { value: "Nouveau" } });

      await vi.waitFor(() =>
        expect(mockOnCodeListLabelCommit).toHaveBeenCalledWith({
          value: "Nouveau",
          previousValue: "Test Label",
        }),
      );
    });
  });
});
