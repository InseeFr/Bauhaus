import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentType } from "react";

type DatalistInputProps = { value: string; onChange: (value: string) => void };

/**
 * Comportement commun des champs texte adossés à une datalist de suggestions.
 * Déclare les tests dans le `describe` appelant.
 */
export const itBehavesLikeADatalistInput = ({
  Input,
  label,
  id,
  options,
}: {
  Input: ComponentType<DatalistInputProps>;
  label: string;
  id: string;
  options: string[];
}) => {
  const renderInput = (value = "") => {
    const mockOnChange = vi.fn();
    const rendered = render(<Input value={value} onChange={mockOnChange} />);
    return { ...rendered, mockOnChange };
  };

  it("should render the component with label", () => {
    renderInput();

    expect(screen.getByText(label)).not.toBeNull();
  });

  it("should render input with correct id", () => {
    renderInput();

    const input = screen.getByLabelText(label);
    expect(input).not.toBeNull();
    expect(input.id).toBe(id);
  });

  it("should render datalist with correct options", () => {
    const { container } = renderInput();

    const datalist = container.querySelector(`#${id}-list`);
    expect(datalist).not.toBeNull();

    const renderedOptions = datalist?.querySelectorAll("option");
    expect(renderedOptions?.length).toBe(options.length);
    options.forEach((option, index) => {
      expect(renderedOptions?.[index].value).toBe(option);
    });
  });

  it("should display the value", () => {
    renderInput("CSV");

    const input = screen.getByLabelText(label) as HTMLInputElement;
    expect(input.value).toBe("CSV");
  });

  it("should call onChange when value changes", () => {
    const { mockOnChange } = renderInput();

    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value: "PARQUET" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("PARQUET");
  });

  it("should link input to datalist", () => {
    renderInput();

    const input = screen.getByLabelText(label) as HTMLInputElement;
    expect(input.getAttribute("list")).toBe(`${id}-list`);
  });
};
