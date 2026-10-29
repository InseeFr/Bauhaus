import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { DatasetSelect } from "./DatasetSelect";

vi.mock("react-i18next", async () =>
  (await import("../translations.testing")).translationsModule({
    "dataset.title": "Dataset",
  }),
);

const mockUseDatasetsForDistributions = vi.fn();

vi.mock("../../../../hooks/useDatasetsForDistributions", () => ({
  useDatasetsForDistributions: () => mockUseDatasetsForDistributions(),
}));

const renderDatasetSelect = (props: Partial<ComponentProps<typeof DatasetSelect>> = {}) => {
  const mockOnChange = vi.fn();
  const rendered = render(
    <DatasetSelect disabled={false} value="" onChange={mockOnChange} {...props} />,
  );
  return { ...rendered, mockOnChange };
};

const expectDatasetLabel = (container: HTMLElement) => {
  const label = container.querySelector('label[for="idDataset"]');
  expect(label?.textContent).toContain("Dataset");
};

describe("DatasetSelect", () => {
  const mockDatasets = [
    { id: "1", label: "Dataset 1" },
    { id: "2", label: "Dataset 2" },
    { id: "3", label: "Dataset 3" },
  ];

  beforeEach(() => {
    mockUseDatasetsForDistributions.mockReturnValue({
      data: mockDatasets,
    });
  });

  it("should render the component with label", () => {
    const { container } = renderDatasetSelect();

    expectDatasetLabel(container);
  });

  it("should render Select with correct props", () => {
    const { container } = renderDatasetSelect({ value: "2" });

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement).not.toBeNull();
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = renderDatasetSelect({ disabled: true, value: "1" });

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement?.getAttribute("data-p-disabled")).toBe("true");
  });

  it("should not be disabled when disabled prop is false", () => {
    const { container } = renderDatasetSelect({ value: "1" });

    const selectElement = container.querySelector(".p-dropdown");
    expect(selectElement?.getAttribute("data-p-disabled")).toBe("false");
  });

  it("should call onChange when value changes", () => {
    const { container, mockOnChange } = renderDatasetSelect({ value: "1" });

    const dropdownTrigger = container.querySelector(".p-dropdown-trigger");
    if (dropdownTrigger) {
      fireEvent.click(dropdownTrigger);
      const options = screen.getAllByText("Dataset 2");
      fireEvent.click(options[options.length - 1]);
    }

    expect(mockOnChange).toHaveBeenCalledWith("2");
  });

  it("should display error when error prop is provided", () => {
    const errorMessage = "This field is required";

    renderDatasetSelect({ error: errorMessage });

    expect(screen.getByText(errorMessage)).not.toBeNull();
  });

  it("should not display error when error prop is not provided", () => {
    renderDatasetSelect({ value: "1" });

    const errorElement = screen.queryByText(/error/i);
    expect(errorElement).toBeNull();
  });

  it("should render with empty datasets", () => {
    mockUseDatasetsForDistributions.mockReturnValue({
      data: undefined,
    });

    const { container } = renderDatasetSelect();

    expectDatasetLabel(container);
  });

  it("should display correct value from datasets", () => {
    const { container } = renderDatasetSelect({ value: "2" });

    const selectedValue = container.querySelector(".p-dropdown-label");
    expect(selectedValue?.textContent).toBe("Dataset 2");
  });
});
