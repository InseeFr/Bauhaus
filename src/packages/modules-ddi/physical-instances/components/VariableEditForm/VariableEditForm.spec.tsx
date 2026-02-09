import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VariableEditForm } from "./VariableEditForm";
import type {
  NumericRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.editVariable": "Modifier la variable",
        "physicalInstance.view.newVariable": "Ajouter une variable",
        "physicalInstance.view.add": "Ajouter",
        "physicalInstance.view.update": "Mettre à jour",
        "physicalInstance.view.duplicate": "Dupliquer",
        "physicalInstance.view.columns.label": "Label",
        "physicalInstance.view.columns.name": "Nom",
        "physicalInstance.view.columns.description": "Description",
        "physicalInstance.view.columns.type": "Type",
        "physicalInstance.view.selectType": "Sélectionnez un type",
        "physicalInstance.view.isGeographic": "Variable géographique",
        "physicalInstance.view.tabs.information": "Informations",
        "physicalInstance.view.tabs.representation": "Représentation",
        "physicalInstance.view.tabs.ddiXml": "Aperçu DDI XML",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/card", () => ({
  Card: ({ title, children }: any) => (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, required }: any) => (
    <input id={id} value={value} onChange={onChange} required={required} />
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ id, value, onChange, options, required }: any) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
      required={required}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, type = "button" }: any) => (
    <button type={type} onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock("primereact/checkbox", () => ({
  Checkbox: ({ inputId, checked, onChange }: any) => (
    <input
      type="checkbox"
      id={inputId}
      checked={checked}
      onChange={(e) => onChange({ checked: e.target.checked })}
    />
  ),
}));

vi.mock("primereact/inputtextarea", () => ({
  InputTextarea: ({ id, value, onChange, rows }: any) => (
    <textarea id={id} value={value} onChange={onChange} rows={rows} />
  ),
}));

vi.mock("primereact/tabview", () => ({
  TabView: ({ children, activeIndex }: any) => (
    <div data-testid="tabview" data-active-index={activeIndex}>
      {children}
    </div>
  ),
  TabPanel: ({ header, children }: any) => (
    <div>
      <h3>{header}</h3>
      {children}
    </div>
  ),
}));

vi.mock("../NumericRepresentation/NumericRepresentation", () => ({
  NumericRepresentation: () => (
    <div data-testid="numeric-representation">Numeric Representation Component</div>
  ),
}));

vi.mock("../DateRepresentation/DateRepresentation", () => ({
  DateRepresentation: () => (
    <div data-testid="date-representation">Date Representation Component</div>
  ),
}));

vi.mock("../TextRepresentation/TextRepresentation", () => ({
  TextRepresentation: () => (
    <div data-testid="text-representation">Text Representation Component</div>
  ),
}));

vi.mock("../CodeRepresentation/CodeRepresentation", () => ({
  CodeRepresentation: () => (
    <div data-testid="code-representation">Code Representation Component</div>
  ),
}));

vi.mock("./VariableInformationTab", () => ({
  VariableInformationTab: ({
    name,
    label,
    description,
    onNameChange,
    onLabelChange,
    onDescriptionChange,
  }: any) => (
    <div data-testid="variable-information-tab">
      <label htmlFor="variable-name">Nom</label>
      <input
        id="variable-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <label htmlFor="variable-label">Label</label>
      <input
        id="variable-label"
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        required
      />
      <label htmlFor="variable-description">Description</label>
      <textarea
        id="variable-description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={5}
      />
    </div>
  ),
}));

vi.mock("./VariableRepresentationTab", () => ({
  VariableRepresentationTab: ({
    isGeographic,
    selectedType,
    onIsGeographicChange,
    onTypeChange,
    typeOptions,
  }: any) => (
    <div data-testid="variable-representation-tab">
      <label htmlFor="variable-isGeographic">Variable géographique</label>
      <input
        type="checkbox"
        id="variable-isGeographic"
        checked={isGeographic}
        onChange={(e) => onIsGeographicChange(e.target.checked)}
      />
      <label htmlFor="variable-type">Type</label>
      <select
        id="variable-type"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        required
      >
        {typeOptions.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedType === "numeric" && (
        <div data-testid="numeric-representation">Numeric Representation Component</div>
      )}
      {selectedType === "date" && (
        <div data-testid="date-representation">Date Representation Component</div>
      )}
      {selectedType === "text" && (
        <div data-testid="text-representation">Text Representation Component</div>
      )}
      {selectedType === "code" && (
        <div data-testid="code-representation">Code Representation Component</div>
      )}
    </div>
  ),
}));

vi.mock("./DdiPreview", () => ({
  DdiPreview: () => <div data-testid="ddi-preview">DDI Preview Component</div>,
}));

describe("VariableEditForm", () => {
  const mockOnSave = vi.fn();
  const mockOnDuplicate = vi.fn();

  const typeOptions = [
    { label: "Numérique", value: "numeric" },
    { label: "Date", value: "date" },
    { label: "Texte", value: "text" },
    { label: "Code", value: "code" },
  ];

  const defaultVariable = {
    id: "var-1",
    label: "Test Variable",
    name: "testVar",
    description: "Test description",
    type: "numeric",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnDuplicate.mockClear();
  });

  it("should render the form with title", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByText("Modifier la variable - testVar")).toBeInTheDocument();
  });

  it("should display variable name, label, description and type", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText("Description") as HTMLTextAreaElement;
    const typeSelect = screen.getByRole("combobox", {
      name: "Type",
    }) as HTMLSelectElement;

    expect(nameInput.value).toBe("testVar");
    expect(labelInput.value).toBe("Test Variable");
    expect(descriptionInput.value).toBe("Test description");
    expect(typeSelect.value).toBe("numeric");
  });

  it("should show NumericRepresentation when type is numeric", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByTestId("numeric-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("date-representation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("text-representation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-representation")).not.toBeInTheDocument();
  });

  it("should show DateRepresentation when type is date", () => {
    const dateVariable = { ...defaultVariable, type: "date" };

    render(
      <VariableEditForm variable={dateVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should show TextRepresentation when type is text", () => {
    const textVariable = { ...defaultVariable, type: "text" };

    render(
      <VariableEditForm variable={textVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByTestId("text-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should show CodeRepresentation when type is code", () => {
    const codeVariable = { ...defaultVariable, type: "code" };

    render(
      <VariableEditForm variable={codeVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByTestId("code-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should update representation component when type changes", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    expect(screen.getByTestId("numeric-representation")).toBeInTheDocument();

    const typeSelect = screen.getByRole("combobox", { name: "Type" });
    fireEvent.change(typeSelect, { target: { value: "date" } });

    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should call onSave with correct data on form submit", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "var-1",
        label: "Test Variable",
        name: "testVar",
        description: "Test description",
        type: "numeric",
      }),
    );
  });

  it("should update label and call onSave with new value", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const labelInput = screen.getByLabelText("Label");
    fireEvent.change(labelInput, { target: { value: "Updated Label" } });

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "Updated Label",
      }),
    );
  });

  it("should update name and call onSave with new value", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const nameInput = screen.getByLabelText("Nom");
    fireEvent.change(nameInput, { target: { value: "updatedVar" } });

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "updatedVar",
      }),
    );
  });

  it("should only include numericRepresentation when type is numeric", () => {
    const numericRepresentation: NumericRepresentation = {
      NumericTypeCode: "Integer",
    };

    const variable = {
      ...defaultVariable,
      type: "numeric",
      numericRepresentation,
    };

    render(<VariableEditForm variable={variable} typeOptions={typeOptions} onSave={mockOnSave} />);

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    const savedData = mockOnSave.mock.calls[0][0];
    expect(savedData).toHaveProperty("numericRepresentation");
    expect(savedData).not.toHaveProperty("dateRepresentation");
    expect(savedData).not.toHaveProperty("textRepresentation");
    expect(savedData).not.toHaveProperty("codeRepresentation");
    expect(savedData).not.toHaveProperty("codeList");
    expect(savedData).not.toHaveProperty("categories");
  });

  it("should update when variable prop changes", () => {
    const { rerender } = render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const newVariable = {
      id: "var-2",
      label: "New Variable",
      name: "newVar",
      description: "New description",
      type: "date",
    };

    rerender(
      <VariableEditForm variable={newVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText("Description") as HTMLTextAreaElement;
    const typeSelect = screen.getByRole("combobox", {
      name: "Type",
    }) as HTMLSelectElement;

    expect(nameInput.value).toBe("newVar");
    expect(labelInput.value).toBe("New Variable");
    expect(descriptionInput.value).toBe("New description");
    expect(typeSelect.value).toBe("date");
    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
  });

  it("should handle all representation types correctly", () => {
    const variableWithAllRepresentations = {
      ...defaultVariable,
      type: "code",
      codeRepresentation: {
        "@blankIsMissingValue": "false",
        CodeListReference: {
          Agency: "fr.insee",
          ID: "codelist-1",
          Version: "1",
          TypeOfObject: "CodeList",
        },
      } as CodeRepresentation,
      codeList: {
        ID: "codelist-1",
      } as CodeList,
      categories: [] as Category[],
    };

    render(
      <VariableEditForm
        variable={variableWithAllRepresentations}
        typeOptions={typeOptions}
        onSave={mockOnSave}
      />,
    );

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        codeRepresentation: expect.any(Object),
        codeList: expect.any(Object),
        categories: expect.any(Array),
      }),
    );
  });

  it("should display and toggle isGeographic checkbox", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const checkbox = screen.getByLabelText("Variable géographique") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("should initialize isGeographic from variable prop", () => {
    const geoVariable = {
      ...defaultVariable,
      isGeographic: true,
    };

    render(
      <VariableEditForm variable={geoVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const checkbox = screen.getByLabelText("Variable géographique") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("should include isGeographic in onSave payload", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const checkbox = screen.getByLabelText("Variable géographique");
    fireEvent.click(checkbox);

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        isGeographic: true,
      }),
    );
  });

  it("should handle label changes with reducer", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    expect(labelInput.value).toBe("Test Variable");

    fireEvent.change(labelInput, { target: { value: "New Label" } });
    expect(labelInput.value).toBe("New Label");

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "New Label",
      }),
    );
  });

  it("should handle name changes with reducer", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    expect(nameInput.value).toBe("testVar");

    fireEvent.change(nameInput, { target: { value: "newName" } });
    expect(nameInput.value).toBe("newName");

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "newName",
      }),
    );
  });

  it("should handle type changes with reducer", () => {
    render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const typeSelect = screen.getByRole("combobox", {
      name: "Type",
    }) as HTMLSelectElement;
    expect(typeSelect.value).toBe("numeric");

    fireEvent.change(typeSelect, { target: { value: "text" } });
    expect(typeSelect.value).toBe("text");
    expect(screen.getByTestId("text-representation")).toBeInTheDocument();

    const saveButton = screen.getByText("Mettre à jour");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "text",
      }),
    );
  });

  it("should reset state when variable prop changes", () => {
    const { rerender } = render(
      <VariableEditForm variable={defaultVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    fireEvent.change(labelInput, { target: { value: "Modified Label" } });
    expect(labelInput.value).toBe("Modified Label");

    const newVariable = {
      id: "var-2",
      label: "Different Variable",
      name: "differentVar",
      description: "Different description",
      type: "date",
      isGeographic: true,
    };

    rerender(
      <VariableEditForm variable={newVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

    const updatedNameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    const updatedLabelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const updatedDescriptionInput = screen.getByLabelText("Description") as HTMLTextAreaElement;
    const checkbox = screen.getByLabelText("Variable géographique") as HTMLInputElement;

    expect(updatedNameInput.value).toBe("differentVar");
    expect(updatedLabelInput.value).toBe("Different Variable");
    expect(updatedDescriptionInput.value).toBe("Different description");
    expect(checkbox.checked).toBe(true);
    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
  });

  describe("Tab management", () => {
    it("should initialize with first tab active (activeIndex=0)", () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });

    it("should reset to first tab when variable changes", () => {
      const { rerender } = render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      // Vérifier que le premier onglet est actif
      let tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");

      // Changer de variable
      const newVariable = {
        id: "var-2",
        label: "New Variable",
        name: "newVar",
        description: "New description",
        type: "text",
      };

      rerender(
        <VariableEditForm variable={newVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
      );

      // Le premier onglet devrait toujours être actif après le changement de variable
      tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });

    it("should reset to first tab when new variable is clicked", () => {
      const newVariable = {
        id: "new",
        label: "",
        name: "",
        description: "",
        type: "text",
      };

      render(
        <VariableEditForm variable={newVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
      );

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });
  });

  describe("Duplicate functionality", () => {
    it("should duplicate variable when duplicate button is clicked", () => {
      const mockUUID = "test-uuid-1234";
      vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDuplicate={mockOnDuplicate}
        />,
      );

      const duplicateButton = screen.getByText("Dupliquer");
      fireEvent.click(duplicateButton);

      expect(mockOnDuplicate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUUID,
          name: "testVar (copy)",
          label: "Test Variable (copy)",
          description: "Test description",
          type: "numeric",
        }),
      );

      vi.restoreAllMocks();
    });

    it("should duplicate variable with representation data", () => {
      const mockUUID = "test-uuid-5678";
      vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      const variableWithRepresentation = {
        ...defaultVariable,
        numericRepresentation: {
          "@decimalPositions": "2",
          "@type": "Double",
        },
      };

      render(
        <VariableEditForm
          variable={variableWithRepresentation}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDuplicate={mockOnDuplicate}
        />,
      );

      const duplicateButton = screen.getByText("Dupliquer");
      fireEvent.click(duplicateButton);

      expect(mockOnDuplicate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUUID,
          name: "testVar (copy)",
          label: "Test Variable (copy)",
          numericRepresentation: {
            "@decimalPositions": "2",
            "@type": "Double",
          },
        }),
      );

      vi.restoreAllMocks();
    });

    it("should not call onDuplicate if prop is not provided", () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      const duplicateButton = screen.getByText("Dupliquer");
      fireEvent.click(duplicateButton);

      // Should not throw an error
      expect(mockOnDuplicate).not.toHaveBeenCalled();
    });
  });

  describe("isNew prop functionality", () => {
    it('should display "Ajouter une variable" title when isNew is true', () => {
      const newVariable = {
        id: "new",
        label: "",
        name: "",
        description: "",
        type: "text",
      };

      render(
        <VariableEditForm
          variable={newVariable}
          typeOptions={typeOptions}
          isNew={true}
          onSave={mockOnSave}
        />,
      );

      expect(screen.getByText("Ajouter une variable")).toBeInTheDocument();
      expect(screen.queryByText(/Modifier la variable/)).not.toBeInTheDocument();
    });

    it('should display "Modifier la variable" title when isNew is false', () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          isNew={false}
          onSave={mockOnSave}
        />,
      );

      expect(screen.getByText("Modifier la variable - testVar")).toBeInTheDocument();
      expect(screen.queryByText("Ajouter une variable")).not.toBeInTheDocument();
    });

    it('should display "Ajouter" button when isNew is true', () => {
      const newVariable = {
        id: "new",
        label: "",
        name: "",
        description: "",
        type: "text",
      };

      render(
        <VariableEditForm
          variable={newVariable}
          typeOptions={typeOptions}
          isNew={true}
          onSave={mockOnSave}
        />,
      );

      expect(screen.getByText("Ajouter")).toBeInTheDocument();
      expect(screen.queryByText("Mettre à jour")).not.toBeInTheDocument();
    });

    it('should display "Mettre à jour" button when isNew is false', () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          isNew={false}
          onSave={mockOnSave}
        />,
      );

      expect(screen.getByText("Mettre à jour")).toBeInTheDocument();
      expect(screen.queryByText("Ajouter")).not.toBeInTheDocument();
    });

    it('should display "Mettre à jour" button by default when isNew is not provided', () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      expect(screen.getByText("Mettre à jour")).toBeInTheDocument();
      expect(screen.queryByText("Ajouter")).not.toBeInTheDocument();
    });

    it('should call onSave correctly when "Ajouter" button is clicked', () => {
      const newVariable = {
        id: "new",
        label: "New Var",
        name: "newVar",
        description: "",
        type: "text",
      };

      render(
        <VariableEditForm
          variable={newVariable}
          typeOptions={typeOptions}
          isNew={true}
          onSave={mockOnSave}
        />,
      );

      const addButton = screen.getByText("Ajouter");
      fireEvent.click(addButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "new",
          label: "New Var",
          name: "newVar",
          type: "text",
        }),
      );
    });
  });
});
