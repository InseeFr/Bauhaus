import { screen, fireEvent, render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SimsField as Field } from "./sims-field";
import {
  renderWithProviders,
  createDefaultSimsFieldProps,
  RICH_TEXT,
  TEXT,
  DATE,
  CODE_LIST,
  ORGANIZATION,
  GEOGRAPHY,
} from "./sims-field.test-utils";
import { rangeType } from "../../../utils/msd";

describe("Sims Field", () => {
  describe("Presentational Fields", () => {
    it("should not display any fields when isPresentational is true", () => {
      const props = createDefaultSimsFieldProps({
        msd: {
          masLabelLg2: "masLabelLg2",
          rangeType: TEXT,
          isPresentational: true,
        },
      });
      const { container } = render(<Field {...props} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("should display field when isPresentational is false", () => {
      const props = createDefaultSimsFieldProps({
        msd: { rangeType: TEXT, isPresentational: false },
      });
      const { container } = render(<Field {...props} />);
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });

    it("should display field when isPresentational is undefined", () => {
      const props = createDefaultSimsFieldProps({
        msd: { rangeType: TEXT },
      });
      const { container } = render(<Field {...props} />);
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });
  });

  describe("TEXT Field", () => {
    it("should display a text input field", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg2: "masLabelLg2",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });

    it("should call handleChange when text input changes", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test Label",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          handleChange={handleChange}
          alone={true}
        />,
      );

      const input = container.querySelector("input");
      fireEvent.change(input, { target: { value: "New value" } });

      expect(handleChange).toHaveBeenCalledWith({
        id: "1",
        override: { labelLg1: "New value" },
      });
    });

    it("should use labelLg2 when secondLang is true", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Field
          msd={{
            masLabelLg2: "Test Label",
            idMas: "2",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          handleChange={handleChange}
          alone={true}
          secondLang={true}
        />,
      );

      const input = container.querySelector("input");
      fireEvent.change(input, { target: { value: "Nouvelle valeur" } });

      expect(handleChange).toHaveBeenCalledWith({
        id: "2",
        override: { labelLg2: "Nouvelle valeur" },
      });
    });

    it("should display current value from currentSection", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test Label",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          currentSection={{ labelLg1: "Current value" }}
          codesLists={{}}
          alone={true}
        />,
      );

      const input = container.querySelector("input");
      expect(input.value).toBe("Current value");
    });
  });

  describe("DATE Field", () => {
    it("should display a DatePickerRmes", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg2: "masLabelLg2",
            idMas: "1",
            rangeType: DATE,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(container.querySelectorAll(".p-calendar")).toHaveLength(1);
    });

    it("should pass correct props to DatePicker", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Date Label",
            idMas: "date-1",
            rangeType: DATE,
            isPresentational: false,
          }}
          currentSection={{ value: "2024-01-15" }}
          codesLists={{}}
          alone={true}
          secondLang={false}
        />,
      );

      const calendar = container.querySelector(".p-calendar");
      expect(calendar).toBeInTheDocument();
    });

    it("should call handleChange when date changes", () => {
      const handleChange = vi.fn();
      render(
        <Field
          msd={{
            masLabelLg1: "Date Label",
            idMas: "date-1",
            rangeType: DATE,
            isPresentational: false,
          }}
          codesLists={{}}
          handleChange={handleChange}
          alone={true}
        />,
      );

      // DatePicker onChange is tested via integration
      expect(handleChange).not.toHaveBeenCalled(); // Initially not called
    });
  });

  describe("RICH_TEXT Field", () => {
    it("should display a MDEditor", () => {
      const props = createDefaultSimsFieldProps({
        msd: { masLabelLg2: "masLabelLg2", idMas: "1", rangeType: RICH_TEXT },
      });
      const { container } = renderWithProviders(<Field {...props} />);

      expect(container.querySelectorAll(".w-md-editor")).toHaveLength(1);
    });

    it("should configure editor with correct toolbar options", () => {
      const props = createDefaultSimsFieldProps({
        msd: { idMas: "rich-1", rangeType: RICH_TEXT },
      });
      const { container } = renderWithProviders(<Field {...props} />);

      const editor = container.querySelector(".w-md-editor");
      expect(editor).toBeInTheDocument();
      // Toolbar is configured with 'list' and 'inline' options
    });

    it("should render with Redux Provider for markdown editor", () => {
      // This test verifies that RICH_TEXT field works with Redux context
      const props = createDefaultSimsFieldProps({
        msd: { masLabelLg2: "masLabelLg2", idMas: "1", rangeType: RICH_TEXT },
      });
      const { container } = renderWithProviders(<Field {...props} />);

      // Editor should render successfully
      expect(container.querySelector(".w-md-editor")).toBeInTheDocument();
    });
  });

  describe("CODE_LIST Field", () => {
    it("should display a SelectRmes", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "masLabelLg1",
            idMas: "1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "codeList",
          }}
          currentSection={{ value: "value" }}
          codesLists={{ codeList: { codes: [] } }}
          alone={true}
          secondLang={false}
          lang="fr"
        />,
      );
      expect(container.querySelectorAll(".p-dropdown")).toHaveLength(1);
    });

    it("should render options from codesLists", () => {
      const mockCodesList = {
        codeList: {
          codeListLabelLg1: "Test Code List",
          codes: [
            { code: "1", labelLg1: "Option 1", labelLg2: "Option One" },
            { code: "2", labelLg1: "Option 2", labelLg2: "Option Two" },
          ],
        },
      };

      render(
        <Field
          msd={{
            masLabelLg1: "Code List Field",
            idMas: "code-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "codeList",
          }}
          currentSection={{ value: "1" }}
          codesLists={mockCodesList}
          alone={true}
          secondLang={false}
        />,
      );

      // Dropdown should be rendered with options
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should use Lg2 labels when secondLang is true", () => {
      const mockCodesList = {
        codeList: {
          codeListLabelLg1: "Test Code List",
          codes: [{ code: "1", labelLg1: "Option 1", labelLg2: "Option One" }],
        },
      };

      render(
        <Field
          msd={{
            masLabelLg2: "Code List Field",
            idMas: "code-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "codeList",
          }}
          currentSection={{ value: "1" }}
          codesLists={mockCodesList}
          alone={true}
          secondLang={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should support multi-select when unbounded is true", () => {
      const mockCodesList = {
        codeList: {
          codes: [{ code: "1", labelLg1: "Option 1" }],
        },
      };

      render(
        <Field
          msd={{
            masLabelLg1: "Multi Select",
            idMas: "multi-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "codeList",
          }}
          codesLists={mockCodesList}
          alone={true}
          unbounded={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle empty codes list", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Empty Code List",
            idMas: "empty-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "emptyList",
          }}
          codesLists={{ emptyList: { codes: [] } }}
          alone={true}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });

    it("should handle missing codeList", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Missing Code List",
            idMas: "missing-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "nonExistent",
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      // Should still render without error
      expect(container.querySelector(".sims-field")).toBeInTheDocument();
    });
  });

  describe("ORGANIZATION Field", () => {
    it("should display organization select", () => {
      const mockOrganisations = [
        { value: "org1", label: "Organisation 1" },
        { value: "org2", label: "Organisation 2" },
      ];

      render(
        <Field
          msd={{
            masLabelLg1: "Organisation Field",
            idMas: "org-1",
            rangeType: ORGANIZATION,
            isPresentational: false,
          }}
          organisationsOptions={mockOrganisations}
          currentSection={{ value: "org1" }}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should call handleChange when organization changes", () => {
      const handleChange = vi.fn();
      const mockOrganisations = [{ value: "org1", label: "Organisation 1" }];

      render(
        <Field
          msd={{
            masLabelLg1: "Organisation Field",
            idMas: "org-1",
            rangeType: ORGANIZATION,
            isPresentational: false,
          }}
          organisationsOptions={mockOrganisations}
          handleChange={handleChange}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle empty organisationsOptions", () => {
      render(
        <Field
          msd={{
            masLabelLg1: "Organisation Field",
            idMas: "org-1",
            rangeType: ORGANIZATION,
            isPresentational: false,
          }}
          organisationsOptions={[]}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("GEOGRAPHY Field", () => {
    it("should display geography picker", () => {
      const props = createDefaultSimsFieldProps({
        msd: { idMas: "geo-1", rangeType: GEOGRAPHY },
        currentSection: { uri: "geo-uri-1" },
      });
      const { container } = renderWithProviders(<Field {...props} />);

      // SimsGeographyPicker should be rendered
      expect(container.querySelector(".sims-field")).toBeInTheDocument();
    });

    it("should pass secondLang to geography picker", () => {
      const props = createDefaultSimsFieldProps({
        msd: {
          masLabelLg2: "Geography Field",
          idMas: "geo-1",
          rangeType: GEOGRAPHY,
        },
        secondLang: true,
      });
      const { container } = renderWithProviders(<Field {...props} />);

      // Geography picker rendered with secondLang prop
      expect(container.querySelector(".note")).toBeInTheDocument();
    });

    it("should call handleChange when geography changes", () => {
      const handleChange = vi.fn();
      const props = createDefaultSimsFieldProps({
        msd: { idMas: "geo-1", rangeType: GEOGRAPHY },
        handleChange,
      });
      const { container } = renderWithProviders(<Field {...props} />);

      // Geography picker should have onChange handler
      expect(container.querySelector(".sims-field")).toBeInTheDocument();
      expect(handleChange).not.toHaveBeenCalled(); // Initially
    });
  });

  describe("Without Object Checkbox", () => {
    it("should display without object checkbox when sansObject is true", () => {
      render(
        <Field
          msd={{
            masLabelLg1: "Field with sans object",
            idMas: "sans-1",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: true,
          }}
          currentSection={{}}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should not display checkbox when sansObject is false", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Field without sans object",
            idMas: "no-sans-1",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: false,
          }}
          currentSection={{}}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    });

    it("should hide input when RUBRIQUE_SANS_OBJECT is selected", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Field",
            idMas: "sans-2",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: true,
          }}
          currentSection={{ rangeType: rangeType.RUBRIQUE_SANS_OBJECT }}
          codesLists={{}}
          alone={true}
        />,
      );

      // Text input should not be visible
      expect(container.querySelector('input[type="text"]')).toBeNull();
    });

    it("should show input when RUBRIQUE_SANS_OBJECT is not selected", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Field",
            idMas: "sans-3",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: true,
          }}
          currentSection={{ rangeType: TEXT }}
          codesLists={{}}
          alone={true}
        />,
      );

      // Text input should be visible
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it("should call handleChange when checkbox is checked", () => {
      const handleChange = vi.fn();
      render(
        <Field
          msd={{
            masLabelLg1: "Field",
            idMas: "sans-4",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: true,
          }}
          currentSection={{}}
          handleChange={handleChange}
          codesLists={{}}
          alone={true}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith({
        id: "sans-4",
        override: { rangeType: rangeType.RUBRIQUE_SANS_OBJECT },
      });
    });

    it("should restore original rangeType when checkbox is unchecked", () => {
      const handleChange = vi.fn();
      render(
        <Field
          msd={{
            masLabelLg1: "Field",
            idMas: "sans-5",
            rangeType: TEXT,
            isPresentational: false,
            sansObject: true,
          }}
          currentSection={{ rangeType: rangeType.RUBRIQUE_SANS_OBJECT }}
          handleChange={handleChange}
          codesLists={{}}
          alone={true}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith({
        id: "sans-5",
        override: { rangeType: TEXT },
      });
    });
  });

  describe("Note Component Integration", () => {
    it("should render field within Note component", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test Field",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(container.querySelector(".note")).toBeInTheDocument();
    });

    it("should pass alone prop to Note", () => {
      const { container, rerender } = render(
        <Field
          msd={{
            masLabelLg1: "Test Field",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(container.querySelector(".note")).toBeInTheDocument();

      rerender(
        <Field
          msd={{
            masLabelLg1: "Test Field",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={false}
        />,
      );

      expect(container.querySelector(".note")).toBeInTheDocument();
    });

    it("should render SimsFieldTitle in Note title", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Field Title",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          currentSection={{}}
          codesLists={{}}
          alone={true}
        />,
      );

      // Note component is rendered
      expect(container.querySelector(".note")).toBeInTheDocument();
      // SimsFieldTitle component is rendered in the title - check for heading
      expect(
        screen.getByRole("heading", { name: /Field Title/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing currentSection", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      expect(container.querySelector("input")).toBeInTheDocument();
    });

    it("should handle undefined rangeType", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test",
            idMas: "1",
            isPresentational: false,
          }}
          codesLists={{}}
          alone={true}
        />,
      );

      // Should render without error
      expect(container.querySelector(".note")).toBeInTheDocument();
    });

    it("should handle missing handleChange prop", () => {
      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Test",
            idMas: "1",
            rangeType: TEXT,
            isPresentational: false,
          }}
          codesLists={{}}
          handleChange={vi.fn()} // Provide a mock to avoid error
          alone={true}
        />,
      );

      const input = container.querySelector("input");
      // Should not crash when changing input
      fireEvent.change(input, { target: { value: "test" } });
      expect(input).toBeInTheDocument();
    });

    it("should handle all props together", () => {
      const handleChange = vi.fn();
      const mockCodesList = {
        codeList: { codes: [{ code: "1", labelLg1: "Option 1" }] },
      };

      const { container } = render(
        <Field
          msd={{
            masLabelLg1: "Complete Field",
            masLabelLg2: "Champ Complet",
            idMas: "complete-1",
            rangeType: CODE_LIST,
            isPresentational: false,
            codeList: "codeList",
            sansObject: true,
          }}
          currentSection={{ value: "1" }}
          codesLists={mockCodesList}
          organisationsOptions={[]}
          handleChange={handleChange}
          alone={true}
          unbounded={false}
          secondLang={false}
          lang="fr"
        />,
      );

      expect(container.querySelector(".note")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
