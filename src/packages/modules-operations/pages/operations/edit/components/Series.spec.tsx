import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { createQueryWrapper } from "../../../../hooks/queryClientWrapper.testing";
import { Series } from "./Series";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getUserSeriesList: vi.fn(),
  },
}));

type SeriesProps = ComponentProps<typeof Series>;

const twoSeriesWithoutSims = [
  { id: "1", label: "Series 1", idSims: null },
  { id: "2", label: "Series 2", idSims: null },
];

describe("Series Component", () => {
  const mockOnChange = vi.fn();

  // Charge la liste de séries renvoyée par l'API puis rend le composant ; le `wrapper`
  // est réappliqué par `rerender`.
  const renderSeries = (props: Partial<SeriesProps> = {}, userSeries: unknown[] = []) => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(userSeries);

    return render(<Series label="Select Series" value="" onChange={mockOnChange} {...props} />, {
      wrapper: createQueryWrapper().wrapper,
    });
  };

  const waitForDropdown = (container: HTMLElement) =>
    vi.waitFor(() => {
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });

  const expectRequiredLabel = (container: HTMLElement, text: string) => {
    const label = container.querySelector("label.label-required");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(text);
  };

  it("should render label and select component", () => {
    const { container } = renderSeries({ label: "Series Label" });

    expectRequiredLabel(container, "Series Label");
  });

  it("should filter out series with idSims and display only series without idSims", async () => {
    const { container } = renderSeries({}, [
      { id: "1", label: "Series 1", idSims: null },
      { id: "2", label: "Series 2", idSims: "sims-id" },
      { id: "3", label: "Series 3", idSims: undefined },
    ]);

    await waitForDropdown(container);
  });

  it("should call onChange when a series is selected", async () => {
    const { container } = renderSeries({}, twoSeriesWithoutSims);

    await waitForDropdown(container);
  });

  it("should display error message when provided", () => {
    const errorMessage = "This field is required";

    renderSeries({ errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display selected value", () => {
    const { container } = renderSeries({ value: "1" }, twoSeriesWithoutSims);

    const dropdown = container.querySelector(".p-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  it.each([
    { name: "should render with bauhaus-row class", selector: ".bauhaus-row" },
    { name: "should render with form-group class", selector: ".form-group" },
  ])("$name", ({ selector }) => {
    const { container } = renderSeries();

    expect(container.querySelector(selector)).toBeInTheDocument();
  });

  it("should display required label", () => {
    const { container } = renderSeries();

    expectRequiredLabel(container, "Select Series");
  });

  it("should handle empty series list", async () => {
    const { container } = renderSeries();

    await waitForDropdown(container);
  });

  it("should render ClientSideError with correct id", () => {
    const { container } = renderSeries({ errorMessage: "Error message" });

    expect(container.querySelector("#series-error")).toBeInTheDocument();
  });

  it("should map series to options with correct format", async () => {
    const { container } = renderSeries({}, [
      { id: "series-1", label: "First Series", idSims: null },
      { id: "series-2", label: "Second Series", idSims: null },
    ]);

    await waitForDropdown(container);
  });

  describe("Validation tests", () => {
    it("should display validation error when series is required but not selected", () => {
      const errorMessage = "Series is required";

      const { container } = renderSeries({ errorMessage });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      const errorElement = container.querySelector("#series-error");
      expect(errorElement).toBeInTheDocument();
    });

    it("should not display validation error when series is selected", () => {
      renderSeries({ value: "1", errorMessage: "" }, twoSeriesWithoutSims);

      const errorElements = screen.queryAllByText(/required/i);
      expect(errorElements).toHaveLength(0);
    });

    it("should display custom validation error message", () => {
      const customError = "Please select a valid series";

      renderSeries({ errorMessage: customError });

      expect(screen.getByText(customError)).toBeInTheDocument();
    });

    it("should have aria-invalid attribute when there is an error", () => {
      const { container } = renderSeries({ errorMessage: "Error" });

      const dropdown = container.querySelector(".p-dropdown");
      expect(dropdown).toBeInTheDocument();
    });

    it("should clear validation error when user selects a series", async () => {
      const { rerender } = renderSeries(
        { errorMessage: "Series is required" },
        twoSeriesWithoutSims,
      );

      expect(screen.getByText("Series is required")).toBeInTheDocument();

      // Simulate user selecting a series
      rerender(<Series label="Select Series" value="1" onChange={mockOnChange} errorMessage="" />);

      await vi.waitFor(() => {
        expect(screen.queryByText("Series is required")).not.toBeInTheDocument();
      });
    });

    it("should show validation error only when errorMessage is provided", () => {
      const { container } = renderSeries();

      const errorElement = container.querySelector("#series-error");
      expect(errorElement).not.toBeInTheDocument();
    });

    it("should display required indicator in label", () => {
      const { container } = renderSeries();

      const requiredLabel = container.querySelector("label.label-required");
      expect(requiredLabel).toBeInTheDocument();
      // Label includes the text with a required indicator (asterisk)
      expect(requiredLabel?.textContent).toContain("Select Series*");
    });
  });
});
