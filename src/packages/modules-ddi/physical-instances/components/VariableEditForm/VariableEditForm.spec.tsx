import { render, screen, fireEvent } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { ddiPrivileges } from "../../../privileges.testing";
import type {
  NumericRepresentation,
  CodeRepresentation,
  CodeList,
  Category,
} from "../../types/api";
import { VariableEditForm } from "./VariableEditForm";
import {
  expectRepresentation,
  nonNumericRepresentationCases,
  searchParamsMock,
  typeOptions,
  urlTabCases,
} from "./variableForm.testing";

vi.mock(
  "react-router-dom",
  async () => (await import("./variableForm.testing")).searchParamsRouterModule,
);

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({
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
  }),
);

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

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

vi.mock("primereact/dropdown", () => import("../representation.testing"));
vi.mock("primereact/button", () => import("../representation.testing"));

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
  TabView: ({ children, activeIndex, onTabChange }: any) => (
    <div data-testid="tabview" data-active-index={activeIndex}>
      <div role="tablist">
        {(Array.isArray(children) ? children : [children]).map((_child: any, index: number) => (
          <div key={index} role="tab" onClick={() => onTabChange?.({ index })}>
            {`Tab ${index}`}
          </div>
        ))}
      </div>
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

// Chaque rendu de l'onglet est enregistré : c'est le seul moyen d'observer un rendu intermédiaire
// où l'identité de la variable et sa représentation ne se correspondent pas.
const { representationTabRenders } = vi.hoisted(() => ({
  representationTabRenders: [] as { variableId: string; selectedType: string }[],
}));

vi.mock("./VariableRepresentationTab", () => ({
  VariableRepresentationTab: ({ variableId, selectedType, onTypeChange, typeOptions }: any) => {
    representationTabRenders.push({ variableId, selectedType });
    return (
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
    );
  },
}));

vi.mock("./DdiPreview", () => ({
  DdiPreview: (props: any) => (
    <div data-testid="ddi-preview" data-version-date={props.variableVersionDate}>
      DDI Preview Component
    </div>
  ),
}));

type FormProps = ComponentProps<typeof VariableEditForm>;

describe("VariableEditForm", () => {
  const mockOnSave = vi.fn();
  const mockOnDuplicate = vi.fn();

  const defaultVariable = {
    id: "var-1",
    label: "Test Variable",
    name: "testVar",
    description: "Test description",
    type: "numeric",
  };

  const emptyNewVariable = {
    id: "new",
    label: "",
    name: "",
    description: "",
    type: "text",
  };

  const formElement = (props: Partial<FormProps> = {}) => (
    <VariableEditForm
      variable={defaultVariable}
      typeOptions={typeOptions}
      onSave={mockOnSave}
      {...props}
    />
  );

  const renderForm = (props: Partial<FormProps> = {}) => render(formElement(props));

  const getFields = () => ({
    nameInput: screen.getByLabelText("Nom") as HTMLInputElement,
    labelInput: screen.getByLabelText("Label") as HTMLInputElement,
    descriptionInput: screen.getByLabelText("Description") as HTMLTextAreaElement,
    typeSelect: screen.getByRole("combobox", { name: "Type" }) as HTMLSelectElement,
  });

  const changeField = (label: string, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  const clickSave = () => fireEvent.click(screen.getByText("Mettre à jour"));

  const expectActiveTab = (index: string) =>
    expect(screen.getByTestId("tabview")).toHaveAttribute("data-active-index", index);

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnDuplicate.mockClear();
    representationTabRenders.length = 0;
    // Par défaut : stratégie ALL → les boutons UPDATE sont rendus.
    (usePrivileges as any).mockReturnValue(ddiPrivileges("UPDATE", "ALL"));
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });
  });

  it("should render the form with title", () => {
    renderForm();

    expect(screen.getByText("Modifier la variable - testVar")).toBeInTheDocument();
  });

  it("should display variable name, label, description and type", () => {
    renderForm();

    const { nameInput, labelInput, descriptionInput, typeSelect } = getFields();

    expect(nameInput.value).toBe("testVar");
    expect(labelInput.value).toBe("Test Variable");
    expect(descriptionInput.value).toBe("Test description");
    expect(typeSelect.value).toBe("numeric");
  });

  it("should show NumericRepresentation when type is numeric", () => {
    renderForm();

    expectRepresentation("numeric", ["date", "text", "code"]);
  });

  for (const { name, type } of nonNumericRepresentationCases) {
    it(name, () => {
      renderForm({ variable: { ...defaultVariable, type } });

      expectRepresentation(type, ["numeric"]);
    });
  }

  it("should never render the representation of the previous variable under the new variable id", () => {
    const codeVariable = { ...defaultVariable, id: "var-code", type: "code" };
    const textVariable = { ...defaultVariable, id: "var-text", type: "text" };

    const { rerender } = renderForm({ variable: codeVariable });

    rerender(formElement({ variable: textVariable }));

    expect(representationTabRenders).not.toContainEqual({
      variableId: "var-text",
      selectedType: "code",
    });
  });

  it("should update representation component when type changes", () => {
    renderForm();

    expect(screen.getByTestId("numeric-representation")).toBeInTheDocument();

    const typeSelect = screen.getByRole("combobox", { name: "Type" });
    fireEvent.change(typeSelect, { target: { value: "date" } });

    expectRepresentation("date", ["numeric"]);
  });

  it("should call onSave with correct data on form submit", () => {
    renderForm();

    clickSave();

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

    renderForm({ variable: { ...defaultVariable, missingValuesReference } });

    clickSave();

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

    renderForm({ variable: variableWithUnlabeledSentinel });

    expect(screen.getByText("Mettre à jour").closest("button")).toBeDisabled();
  });

  for (const { name, field, key, value } of [
    {
      name: "should update label and call onSave with new value",
      field: "Label",
      key: "label",
      value: "Updated Label",
    },
    {
      name: "should update name and call onSave with new value",
      field: "Nom",
      key: "name",
      value: "updatedVar",
    },
  ]) {
    it(name, () => {
      renderForm();

      changeField(field, value);

      clickSave();

      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ [key]: value }));
    });
  }

  it("should only include numericRepresentation when type is numeric", () => {
    const numericRepresentation: NumericRepresentation = {
      NumericTypeCode: "Integer",
    };

    renderForm({ variable: { ...defaultVariable, type: "numeric", numericRepresentation } });

    clickSave();

    const savedData = mockOnSave.mock.calls[0][0];
    expect(savedData).toHaveProperty("numericRepresentation");
    expect(savedData).not.toHaveProperty("dateRepresentation");
    expect(savedData).not.toHaveProperty("textRepresentation");
    expect(savedData).not.toHaveProperty("codeRepresentation");
    expect(savedData).not.toHaveProperty("codeList");
    expect(savedData).not.toHaveProperty("categories");
  });

  it("should update when variable prop changes", () => {
    const { rerender } = renderForm();

    const newVariable = {
      id: "var-2",
      label: "New Variable",
      name: "newVar",
      description: "New description",
      type: "date",
    };

    rerender(formElement({ variable: newVariable }));

    const { nameInput, labelInput, descriptionInput, typeSelect } = getFields();

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

    renderForm({ variable: variableWithAllRepresentations });

    clickSave();

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
    renderForm({ variable: { ...defaultVariable, isGeographic: true } });

    clickSave();

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        isGeographic: true,
      }),
    );
  });

  for (const { name, field, key, initial, value } of [
    {
      name: "should handle label changes with reducer",
      field: "Label",
      key: "label",
      initial: "Test Variable",
      value: "New Label",
    },
    {
      name: "should handle name changes with reducer",
      field: "Nom",
      key: "name",
      initial: "testVar",
      value: "newName",
    },
  ]) {
    it(name, () => {
      renderForm();

      const input = screen.getByLabelText(field) as HTMLInputElement;
      expect(input.value).toBe(initial);

      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);

      clickSave();

      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ [key]: value }));
    });
  }

  it("should handle type changes with reducer", () => {
    renderForm();

    const { typeSelect } = getFields();
    expect(typeSelect.value).toBe("numeric");

    fireEvent.change(typeSelect, { target: { value: "text" } });
    expect(typeSelect.value).toBe("text");
    expect(screen.getByTestId("text-representation")).toBeInTheDocument();

    clickSave();

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "text",
      }),
    );
  });

  it("should reset state when variable prop changes", () => {
    const { rerender } = renderForm();

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

    rerender(formElement({ variable: newVariable }));

    const updated = getFields();

    expect(updated.nameInput.value).toBe("differentVar");
    expect(updated.labelInput.value).toBe("Different Variable");
    expect(updated.descriptionInput.value).toBe("Different description");
    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
  });

  describe("Tab management", () => {
    beforeEach(() => {
      searchParamsMock.reset();
    });

    it("should initialize with first tab active when no URL param", () => {
      renderForm();

      expectActiveTab("0");
    });

    for (const { name, tab, expectedIndex } of urlTabCases) {
      it(name, () => {
        searchParamsMock.current.set("tab", tab);

        renderForm();

        expectActiveTab(expectedIndex);
      });
    }

    it("should set tab search param when a non-first tab is clicked", () => {
      renderForm();

      const tabs = screen.getAllByRole("tab");
      fireEvent.click(tabs[1]);

      expect(searchParamsMock.current.get("tab")).toBe("1");
    });

    it("should delete tab search param when first tab is selected", () => {
      searchParamsMock.current.set("tab", "1");

      renderForm();

      const tabs = screen.getAllByRole("tab");
      fireEvent.click(tabs[0]);

      expect(searchParamsMock.current.has("tab")).toBe(false);
    });

    it("should reset to first tab when variable changes", () => {
      const { rerender } = renderForm();

      const newVariable = {
        id: "var-2",
        label: "New Variable",
        name: "newVar",
        description: "New description",
        type: "text",
      };

      rerender(formElement({ variable: newVariable }));

      expectActiveTab("0");
    });

    it("should initialize with first tab active for new variable", () => {
      renderForm({ variable: emptyNewVariable });

      expectActiveTab("0");
    });
  });

  describe("Duplicate functionality", () => {
    const duplicate = (
      mockUUID: `${string}-${string}-${string}-${string}-${string}`,
      variable: FormProps["variable"] = defaultVariable,
    ) => {
      using _randomUUIDSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      renderForm({ variable, onDuplicate: mockOnDuplicate });

      fireEvent.click(screen.getByText("Dupliquer"));
    };

    it("should duplicate variable when duplicate button is clicked", () => {
      const mockUUID = "11111111-1111-1111-1111-111111111111" as const;
      duplicate(mockUUID);

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
      duplicate(mockUUID, {
        ...defaultVariable,
        numericRepresentation: {
          $type: "NumericRepresentationBaseType" as const,
          NumericTypeCode: "Double",
        },
      });

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
      renderForm();

      const duplicateButton = screen.getByText("Dupliquer");
      fireEvent.click(duplicateButton);

      // Should not throw an error
      expect(mockOnDuplicate).not.toHaveBeenCalled();
    });
  });

  describe("gating STAMP des boutons UPDATE", () => {
    const renderWithUserStamp = (userStamp: string) => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("UPDATE", "STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: userStamp }] });

      renderForm({ stamps: ["STAMP1", "STAMP2"] });
    };

    it("affiche les boutons dupliquer/enregistrer quand un stamp utilisateur appartient à parents.stamps", () => {
      renderWithUserStamp("STAMP1");

      expect(screen.queryByText("Dupliquer")).toBeInTheDocument();
      expect(screen.queryByText("Mettre à jour")).toBeInTheDocument();
    });

    it("masque les boutons dupliquer/enregistrer quand aucun stamp utilisateur n'appartient à parents.stamps", () => {
      renderWithUserStamp("STAMP9");

      expect(screen.queryByText("Dupliquer")).not.toBeInTheDocument();
      expect(screen.queryByText("Mettre à jour")).not.toBeInTheDocument();
    });
  });

  describe("isNew prop functionality", () => {
    it('should display "Ajouter une variable" title when isNew is true', () => {
      renderForm({ variable: emptyNewVariable, isNew: true });

      expect(screen.getByText("Ajouter une variable")).toBeInTheDocument();
      expect(screen.queryByText(/Modifier la variable/)).not.toBeInTheDocument();
    });

    it('should display "Modifier la variable" title when isNew is false', () => {
      renderForm({ isNew: false });

      expect(screen.getByText("Modifier la variable - testVar")).toBeInTheDocument();
      expect(screen.queryByText("Ajouter une variable")).not.toBeInTheDocument();
    });

    for (const { name, props, shown, absent } of [
      {
        name: 'should display "Ajouter" button when isNew is true',
        props: { variable: emptyNewVariable, isNew: true },
        shown: "Ajouter",
        absent: "Mettre à jour",
      },
      {
        name: 'should display "Mettre à jour" button when isNew is false',
        props: { isNew: false },
        shown: "Mettre à jour",
        absent: "Ajouter",
      },
      {
        name: 'should display "Mettre à jour" button by default when isNew is not provided',
        props: {},
        shown: "Mettre à jour",
        absent: "Ajouter",
      },
    ]) {
      it(name, () => {
        renderForm(props);

        expect(screen.getByText(shown)).toBeInTheDocument();
        expect(screen.queryByText(absent)).not.toBeInTheDocument();
      });
    }

    it('should call onSave correctly when "Ajouter" button is clicked', () => {
      const newVariable = {
        id: "new",
        label: "New Var",
        name: "newVar",
        description: "",
        type: "text",
      };

      renderForm({ variable: newVariable, isNew: true });

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
    const renderTrackingDirtiness = (props: Partial<FormProps> = {}) => {
      const onDirtyChange = vi.fn();
      const rendered = renderForm({ onDirtyChange, ...props });
      return { onDirtyChange, ...rendered };
    };

    it("should report a pristine form when nothing has been edited", () => {
      const { onDirtyChange } = renderTrackingDirtiness();

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
    });

    it("should report a dirty form once a field has been edited", () => {
      const { onDirtyChange } = renderTrackingDirtiness();

      changeField("Label", "Nouveau libellé");

      expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    });

    it("should report a pristine form again when the edit is reverted", () => {
      const { onDirtyChange } = renderTrackingDirtiness();

      changeField("Label", "Nouveau libellé");
      changeField("Label", "Test Variable");

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
    });

    it("should always report a new variable as dirty", () => {
      const { onDirtyChange } = renderTrackingDirtiness({
        variable: emptyNewVariable,
        isNew: true,
      });

      expect(onDirtyChange).toHaveBeenLastCalledWith(true);
    });

    it("should report a pristine form when it is unmounted", () => {
      const { onDirtyChange, unmount } = renderTrackingDirtiness();

      changeField("Label", "Nouveau libellé");
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
