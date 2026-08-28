import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";
import { VariableEditForm } from "./VariableEditForm";
import type {
  NumericRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";

let mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn((updater: any, _options?: any) => {
  if (typeof updater === "function") {
    mockSearchParams = new URLSearchParams(updater(mockSearchParams));
  } else if (updater instanceof URLSearchParams) {
    mockSearchParams = new URLSearchParams(updater);
  }
});

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

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
        "physicalInstance.view.tabs.information": "Informations",
        "physicalInstance.view.tabs.representation": "Représentation",
        "physicalInstance.view.tabs.ddiXml": "Aperçu DDI XML",
      };
      return translations[key] || key;
    },
  }),
}));

// On monte le vrai <HasAccess> ; seules les sources de privilèges et de
// stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

const ddiPrivileges = (strategy: string) => ({
  privileges: [
    {
      application: "DDI_PHYSICALINSTANCE",
      privileges: [{ privilege: "UPDATE", strategy }],
    },
  ],
});

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
  Button: ({ label, onClick, type = "button", disabled }: any) => (
    <button type={type} onClick={onClick} disabled={disabled}>
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
  TabView: ({ children, activeIndex, onTabChange }: any) => {
    const panels = Array.isArray(children) ? children : [children];
    return (
      <div data-testid="tabview" data-active-index={activeIndex}>
        <div role="tablist">
          {panels.map((_child: any, index: number) => (
            <div key={index} role="tab" onClick={() => onTabChange?.({ index })}>
              {`Tab ${index}`}
            </div>
          ))}
        </div>
        {children}
      </div>
    );
  },
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
  VariableRepresentationTab: ({ selectedType, onTypeChange, typeOptions }: any) => (
    <div data-testid="variable-representation-tab">
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
  DdiPreview: (props: any) => (
    <div data-testid="ddi-preview" data-version-date={props.variableVersionDate}>
      DDI Preview Component
    </div>
  ),
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
    // Par défaut : stratégie ALL → les boutons UPDATE sont rendus.
    (usePrivileges as any).mockReturnValue(ddiPrivileges("ALL"));
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });
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

  it("should keep the sentinel values reference in the save payload, whatever the type (#1566)", () => {
    const missingValuesReference = {
      $type: "ManagedMissingValuesRepresentation",
      URN: "urn:ddi:fr.insee:mmvr-1:1",
      Agency: "fr.insee",
      ID: "mmvr-1",
      Version: "1",
    } as const;
    const numericVariableWithSentinel = {
      ...defaultVariable,
      missingValuesReference,
    };

    render(
      <VariableEditForm
        variable={numericVariableWithSentinel}
        typeOptions={typeOptions}
        onSave={mockOnSave}
      />,
    );

    fireEvent.click(screen.getByText("Mettre à jour"));

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "numeric",
        missingValuesReference,
      }),
    );
  });

  it("should disable save while the sentinel MMVR has no label (#1566)", () => {
    const variableWithUnlabeledSentinel = {
      ...defaultVariable,
      missingValuesReference: {
        $type: "ManagedMissingValuesRepresentation",
        URN: "urn:ddi:fr.insee:mmvr-1:1",
        Agency: "fr.insee",
        ID: "mmvr-1",
        Version: "1",
      } as const,
      sentinelMmvr: {
        $type: "ManagedMissingValuesRepresentation",
        ID: "mmvr-1",
        Agency: "fr.insee",
        Version: "1",
        Label: [{ "@language": "fr-FR", "@value": "" }],
      } as any,
    };

    render(
      <VariableEditForm
        variable={variableWithUnlabeledSentinel}
        typeOptions={typeOptions}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText("Mettre à jour").closest("button")).toBeDisabled();
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
        $type: "CodeRepresentationBaseType",
        BlankIsMissingValue: false,
        CodeListReference: {
          $type: "CodeList",
          URN: "urn:ddi:fr.insee:codelist-1:1",
          Agency: "fr.insee",
          ID: "codelist-1",
          Version: "1",
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

  it("should preserve isGeographic from variable prop in onSave payload", () => {
    // La checkbox isGeographic a été retirée de l'UI : la valeur n'est plus éditable mais reste
    // portée par la variable et renvoyée telle quelle au save (round-trip DDI préservé).
    const geoVariable = {
      ...defaultVariable,
      isGeographic: true,
    };

    render(
      <VariableEditForm variable={geoVariable} typeOptions={typeOptions} onSave={mockOnSave} />,
    );

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

    expect(updatedNameInput.value).toBe("differentVar");
    expect(updatedLabelInput.value).toBe("Different Variable");
    expect(updatedDescriptionInput.value).toBe("Different description");
    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
  });

  describe("Tab management", () => {
    beforeEach(() => {
      mockSearchParams = new URLSearchParams();
      mockSetSearchParams.mockClear();
    });

    it("should initialize with first tab active when no URL param", () => {
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

    it("should restore active tab from URL on initial load", () => {
      mockSearchParams.set("tab", "1");

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "1");
    });

    it("should default to tab 0 for invalid tab values in URL", () => {
      mockSearchParams.set("tab", "abc");

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

    it("should default to tab 0 for out-of-range tab values in URL", () => {
      mockSearchParams.set("tab", "99");

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

    it("should set tab search param when a non-first tab is clicked", () => {
      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      const tabs = screen.getAllByRole("tab");
      fireEvent.click(tabs[1]);

      expect(mockSearchParams.get("tab")).toBe("1");
    });

    it("should delete tab search param when first tab is selected", () => {
      mockSearchParams.set("tab", "1");

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

      const tabs = screen.getAllByRole("tab");
      fireEvent.click(tabs[0]);

      expect(mockSearchParams.has("tab")).toBe(false);
    });

    it("should reset to first tab when variable changes", () => {
      const { rerender } = render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
        />,
      );

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

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });

    it("should initialize with first tab active for new variable", () => {
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
      const mockUUID = "11111111-1111-1111-1111-111111111111" as const;
      using _randomUUIDSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

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
    });

    it("should duplicate variable with representation data", () => {
      const mockUUID = "22222222-2222-2222-2222-222222222222" as const;
      using _randomUUIDSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      const variableWithRepresentation = {
        ...defaultVariable,
        numericRepresentation: {
          $type: "NumericRepresentationBaseType" as const,
          NumericTypeCode: "Double",
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
            $type: "NumericRepresentationBaseType",
            NumericTypeCode: "Double",
          },
        }),
      );
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

  describe("gating STAMP des boutons UPDATE", () => {
    it("affiche les boutons dupliquer/enregistrer quand un stamp utilisateur appartient à parents.stamps", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByText("Dupliquer")).toBeInTheDocument();
      expect(screen.queryByText("Mettre à jour")).toBeInTheDocument();
    });

    it("masque les boutons dupliquer/enregistrer quand aucun stamp utilisateur n'appartient à parents.stamps", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP9" }] });

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByText("Dupliquer")).not.toBeInTheDocument();
      expect(screen.queryByText("Mettre à jour")).not.toBeInTheDocument();
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

  describe("onDirtyChange", () => {
    it("should report a pristine form when nothing has been edited", () => {
      const onDirtyChange = vi.fn();

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
    });

    it("should report a dirty form once a field has been edited", () => {
      const onDirtyChange = vi.fn();

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      fireEvent.change(screen.getByLabelText("Label"), {
        target: { value: "Nouveau libellé" },
      });

      expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    });

    it("should report a pristine form again when the edit is reverted", () => {
      const onDirtyChange = vi.fn();

      render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      const labelInput = screen.getByLabelText("Label");
      fireEvent.change(labelInput, { target: { value: "Nouveau libellé" } });
      fireEvent.change(labelInput, { target: { value: "Test Variable" } });

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
    });

    it("should always report a new variable as dirty", () => {
      const onDirtyChange = vi.fn();

      render(
        <VariableEditForm
          variable={{ id: "new", label: "", name: "", description: "", type: "text" }}
          typeOptions={typeOptions}
          isNew={true}
          onSave={mockOnSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    });

    it("should report a pristine form when it is unmounted", () => {
      const onDirtyChange = vi.fn();

      const { unmount } = render(
        <VariableEditForm
          variable={defaultVariable}
          typeOptions={typeOptions}
          onSave={mockOnSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      fireEvent.change(screen.getByLabelText("Label"), {
        target: { value: "Nouveau libellé" },
      });
      unmount();

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
    });
  });
});

describe("VariableEditForm DDI preview", () => {
  it("should forward the stored versionDate of the variable to the DDI preview", () => {
    render(
      <VariableEditForm
        variable={{
          id: "var-1",
          label: "Test Variable",
          name: "testVar",
          type: "numeric",
          versionDate: "2026-01-15T09:30:00+01:00",
        }}
        typeOptions={[{ label: "Numérique", value: "numeric" }]}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getAllByRole("tab")[2]);

    expect(screen.getByTestId("ddi-preview")).toHaveAttribute(
      "data-version-date",
      "2026-01-15T09:30:00+01:00",
    );
  });
});
