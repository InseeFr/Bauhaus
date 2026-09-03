import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
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

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, placeholder, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={id || placeholder}
      {...props}
    />
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ icon, onClick, label, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {label || icon}
    </button>
  ),
}));

// Le contenu du menu contextuel est rendu en ligne : les entrées sont ainsi directement
// interrogeables, sans avoir à ouvrir un vrai overlay.
vi.mock("primereact/overlaypanel", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");
  return {
    OverlayPanel: forwardRef(({ children }: any, ref: any) => {
      useImperativeHandle(ref, () => ({ toggle: () => {}, hide: () => {} }));
      return <div>{children}</div>;
    }),
  };
});

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

vi.mock("primereact/column", () => ({
  Column: () => null,
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render code list label input", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByLabelText("Libellé de la liste de codes")).toBeInTheDocument();
  });

  it("should display initial code list label", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("Test Label");
  });

  it("should call onCodeListLabelChange when label changes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes");
    fireEvent.change(labelInput, { target: { value: "New Label" } });

    expect(mockOnCodeListLabelChange).toHaveBeenCalledWith("New Label");
  });

  it("should render table with codes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(2);
  });

  it("should render Add a code button", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });

  it("should call onAddCode when Add a code button is clicked", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const addButton = screen.getByText("Ajouter un code");
    fireEvent.click(addButton);

    expect(mockOnAddCode).toHaveBeenCalledWith("", "");
  });

  it("should show empty message when no codes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByText("Aucun code")).toBeInTheDocument();
  });

  it("should render action menu button for each code", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const menuButtons = screen.getAllByText("pi pi-ellipsis-v");
    expect(menuButtons).toHaveLength(2);
  });

  describe("entrée de menu « Utilisation »", () => {
    it("should call onShowCategoryUsage with the row when the entry is clicked", () => {
      const mockOnShowCategoryUsage = vi.fn();
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
          onShowCategoryUsage={mockOnShowCategoryUsage}
        />,
      );

      fireEvent.click(screen.getAllByText("Utilisation")[1]);

      expect(mockOnShowCategoryUsage).toHaveBeenCalledWith(mockCodes[1]);
    });

    it("should not render the entry when no handler is provided", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
        />,
      );

      expect(screen.queryByText("Utilisation")).not.toBeInTheDocument();
    });
  });

  it("should call onCellEdit when code value is edited", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    // First input is code list label, then value/label pairs for each code
    const codeValueInput = inputs[1] as HTMLInputElement;

    expect(codeValueInput.value).toBe("1");

    fireEvent.change(codeValueInput, { target: { value: "updated-value" } });

    expect(mockOnCellEdit).toHaveBeenCalledWith(mockCodes[0], "value", "updated-value");
  });

  it("should call onCellEdit when code label is edited", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    // First input is code list label, then value/label pairs for each code
    const codeLabelInput = inputs[2] as HTMLInputElement;

    expect(codeLabelInput.value).toBe("Label 1");

    fireEvent.change(codeLabelInput, { target: { value: "Updated Label" } });

    expect(mockOnCellEdit).toHaveBeenCalledWith(mockCodes[0], "label", "Updated Label");
  });

  it("should render with empty codes array", () => {
    render(
      <CodeListDataTable
        codeListLabel=""
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });

  describe("readOnly mode", () => {
    it("should hide the Add a code button when readOnly", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
          readOnly
        />,
      );

      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
    });

    it("should hide the action menu when readOnly", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
          readOnly
        />,
      );

      expect(screen.queryByText("pi pi-ellipsis-v")).not.toBeInTheDocument();
    });

    it("should disable code list label and code inputs when readOnly", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
          readOnly
        />,
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("readOnly");
      });
    });

    it("should grey out the code list label and code inputs when readOnly", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
          readOnly
        />,
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
        expect(input).toHaveClass("code-list-readonly-input");
      });
    });

    it("should not grey out the inputs when editable", () => {
      render(
        <CodeListDataTable
          codeListLabel="Test Label"
          codes={mockCodes}
          onCodeListLabelChange={mockOnCodeListLabelChange}
          onCellEdit={mockOnCellEdit}
          onDeleteCode={mockOnDeleteCode}
          onAddCode={mockOnAddCode}
          onMoveCode={mockOnMoveCode}
        />,
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
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

    it("asks for a decision as soon as the user types, on the very first keystroke", async () => {
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

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
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

      fireEvent.change(input, { target: { value: "E" } });
      await vi.waitFor(() => expect(mockOnCellCommit).toHaveBeenCalledTimes(1));
      fireEvent.change(input, { target: { value: "Eu" } });
      fireEvent.change(input, { target: { value: "Eur" } });

      // La suite de la saisie passe sans repasser par la garde.
      expect(mockOnCellEdit).toHaveBeenCalledTimes(3);
      expect(mockOnCellCommit).toHaveBeenCalledTimes(1);
    });

    it("does not ask anything when the field is merely traversed", () => {
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

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
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

      fireEvent.change(input, { target: { value: "E" } });

      await vi.waitFor(() => expect(input).toHaveAttribute("readonly"));

      decide(true);
      await vi.waitFor(() => expect(input).not.toHaveAttribute("readonly"));
    });

    it("gives the focus back to the edited cell when a dialog interrupted the edit", async () => {
      // Sans cela, l'utilisateur au clavier est éjecté du tableau après chaque confirmation.
      mockOnCellCommit.mockResolvedValueOnce(true);
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

      fireEvent.change(input, { target: { value: "E" } });

      await vi.waitFor(() => expect(input).toHaveFocus());
    });

    it("leaves the focus alone when nothing interrupted the edit", async () => {
      // L'utilisateur n'a pas été dérangé : lui déplacer le focus serait gratuit.
      mockOnCellCommit.mockResolvedValueOnce(false);
      renderTable();
      const input = screen.getAllByPlaceholderText("Libellé")[0];

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
