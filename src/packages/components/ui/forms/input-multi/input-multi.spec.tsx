import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { InputMulti } from "./index";

vi.mock("primereact/chips", () => ({
  Chips: ({
    value = [],
    onChange,
    placeholder,
    separator,
    allowDuplicate,
    addOnBlur,
    "aria-label": ariaLabel,
  }: {
    value: string[];
    onChange: (e: any) => void;
    placeholder?: string;
    separator?: string;
    allowDuplicate?: boolean;
    addOnBlur?: boolean;
    "aria-label"?: string;
  }) => (
    <input
      data-testid="chips-input"
      value={value.join(",")}
      onChange={(e) => onChange({ value: e.target.value?.split(",") })}
      placeholder={placeholder}
      data-separator={separator}
      data-allow-duplicate={allowDuplicate}
      data-add-on-blur={addOnBlur}
      aria-label={ariaLabel}
    />
  ),
}));

describe("InputMultiRmes", () => {
  const handleChangeLg1 = vi.fn();
  const handleChangeLg2 = vi.fn();

  afterEach(() => {
    handleChangeLg1.mockClear();
    handleChangeLg2.mockClear();
  });

  it("should render a single input when handleChangeLg2 is not provided", () => {
    render(
      <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
    );

    expect(screen.getByText("testLabel")).toBeInTheDocument();
    expect(screen.getAllByTestId("chips-input").length).toBe(1);
  });

  it("should render two inputs when handleChangeLg2 is provided", () => {
    render(
      <InputMulti
        inputLg1={["value1"]}
        inputLg2={["value2"]}
        labelLg1="Libellé alternatif"
        labelLg2="Alternative label"
        handleChangeLg1={handleChangeLg1}
        handleChangeLg2={handleChangeLg2}
      />,
    );

    expect(screen.getByText("Libellé alternatif")).toBeInTheDocument();
    expect(screen.getByText("Alternative label")).toBeInTheDocument();
    expect(screen.getAllByTestId("chips-input").length).toBe(2);
  });

  it("should call handleChangeLg1 when the first input changes", () => {
    render(
      <InputMulti
        inputLg1={["value1"]}
        labelLg1="altLabelTitle"
        handleChangeLg1={handleChangeLg1}
      />,
    );

    const input = screen.getByTestId("chips-input");
    fireEvent.change(input, { target: { value: "newValue1,newValue2" } });

    expect(handleChangeLg1).toHaveBeenCalledWith(["newValue1", "newValue2"]);
  });

  it("should call handleChangeLg2 when the second input changes", () => {
    render(
      <InputMulti
        inputLg1={["value1"]}
        inputLg2={["value2"]}
        labelLg1="altLabelTitle"
        labelLg2="altLabelTitle"
        handleChangeLg1={handleChangeLg1}
        handleChangeLg2={handleChangeLg2}
      />,
    );

    const inputs = screen.getAllByTestId("chips-input");
    fireEvent.change(inputs[1], { target: { value: "newValue3,newValue4" } });

    expect(handleChangeLg2).toHaveBeenCalledWith(["newValue3", "newValue4"]);
  });

  describe("UX improvements", () => {
    it("should render placeholder text for better user guidance", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      const input = screen.getByTestId("chips-input");
      expect(input.getAttribute("placeholder")).toBe("Tapez une valeur et appuyez sur Entrée");
    });

    it("should render help text explaining how to add values", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      expect(
        screen.getByText("Appuyez sur Entrée ou virgule pour ajouter une valeur"),
      ).toBeInTheDocument();
    });

    it("should render help text for both inputs when handleChangeLg2 is provided", () => {
      render(
        <InputMulti
          inputLg1={["value1"]}
          inputLg2={["value2"]}
          labelLg1="testLabel"
          labelLg2="testLabel"
          handleChangeLg1={handleChangeLg1}
          handleChangeLg2={handleChangeLg2}
        />,
      );

      const helpTexts = screen.getAllByText(
        "Appuyez sur Entrée ou virgule pour ajouter une valeur",
      );
      expect(helpTexts.length).toBe(2);
    });

    it("should configure Chips with comma separator for better UX", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      const input = screen.getByTestId("chips-input");
      expect(input.getAttribute("data-separator")).toBe(",");
    });

    it("should prevent duplicate values", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      const input = screen.getByTestId("chips-input");
      expect(input.getAttribute("data-allow-duplicate")).toBe("false");
    });

    it("should add value on blur for better UX", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      const input = screen.getByTestId("chips-input");
      expect(input.getAttribute("data-add-on-blur")).toBe("true");
    });

    it("should have accessible aria-label with instructions", () => {
      render(
        <InputMulti inputLg1={["value1"]} labelLg1="testLabel" handleChangeLg1={handleChangeLg1} />,
      );

      const input = screen.getByTestId("chips-input");
      expect(input.getAttribute("aria-label")).toBe(
        "testLabel - Appuyez sur Entrée ou virgule pour ajouter",
      );
    });
  });
});
