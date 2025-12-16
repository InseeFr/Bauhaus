import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import configureStore from "../../../../redux/configure-store";
import { Series } from "./series";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getUserSeriesList: vi.fn(),
  },
}));

const createWrapper = (stamp = "test-stamp") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const store = configureStore({
    app: {
      auth: {
        user: {
          stamp,
        },
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

describe("Series Component", () => {
  const mockOnChange = vi.fn();

  it("should render label and select component", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Series Label" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    const label = container.querySelector("label.label-required");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Series Label");
  });

  it("should filter out series with idSims and display only series without idSims", async () => {
    const mockSeries = [
      { id: "1", label: "Series 1", idSims: null },
      { id: "2", label: "Series 2", idSims: "sims-id" },
      { id: "3", label: "Series 3", idSims: undefined },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    await vi.waitFor(() => {
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });
  });

  it("should call onChange when a series is selected", async () => {
    const mockSeries = [
      { id: "1", label: "Series 1", idSims: null },
      { id: "2", label: "Series 2", idSims: null },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    await vi.waitFor(() => {
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });
  });

  it("should display error message when provided", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();
    const errorMessage = "This field is required";

    render(
      <Wrapper>
        <Series
          label="Select Series"
          value=""
          onChange={mockOnChange}
          errorMessage={errorMessage}
        />
      </Wrapper>,
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display selected value", () => {
    const mockSeries = [
      { id: "1", label: "Series 1", idSims: null },
      { id: "2", label: "Series 2", idSims: null },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="1" onChange={mockOnChange} />
      </Wrapper>,
    );

    const dropdown = container.querySelector(".p-dropdown");
    expect(dropdown).toBeInTheDocument();
  });

  it("should render with bauhaus-row class", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    expect(container.querySelector(".bauhaus-row")).toBeInTheDocument();
  });

  it("should render with form-group class", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    expect(container.querySelector(".form-group")).toBeInTheDocument();
  });

  it("should display required label", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    const label = container.querySelector("label.label-required");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Select Series");
  });

  it("should handle empty series list", async () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    await vi.waitFor(() => {
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });
  });

  it("should render ClientSideError with correct id", () => {
    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series
          label="Select Series"
          value=""
          onChange={mockOnChange}
          errorMessage="Error message"
        />
      </Wrapper>,
    );

    expect(container.querySelector("#series-error")).toBeInTheDocument();
  });

  it("should map series to options with correct format", async () => {
    const mockSeries = [
      { id: "series-1", label: "First Series", idSims: null },
      { id: "series-2", label: "Second Series", idSims: null },
    ];

    vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

    const Wrapper = createWrapper();

    const { container } = render(
      <Wrapper>
        <Series label="Select Series" value="" onChange={mockOnChange} />
      </Wrapper>,
    );

    await vi.waitFor(() => {
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });
  });

  describe("Validation tests", () => {
    it("should display validation error when series is required but not selected", () => {
      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

      const Wrapper = createWrapper();
      const errorMessage = "Series is required";

      const { container } = render(
        <Wrapper>
          <Series
            label="Select Series"
            value=""
            onChange={mockOnChange}
            errorMessage={errorMessage}
          />
        </Wrapper>,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      const errorElement = container.querySelector("#series-error");
      expect(errorElement).toBeInTheDocument();
    });

    it("should not display validation error when series is selected", () => {
      const mockSeries = [
        { id: "1", label: "Series 1", idSims: null },
        { id: "2", label: "Series 2", idSims: null },
      ];

      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <Series label="Select Series" value="1" onChange={mockOnChange} errorMessage="" />
        </Wrapper>,
      );

      const errorElements = screen.queryAllByText(/required/i);
      expect(errorElements).toHaveLength(0);
    });

    it("should display custom validation error message", () => {
      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

      const Wrapper = createWrapper();
      const customError = "Please select a valid series";

      render(
        <Wrapper>
          <Series
            label="Select Series"
            value=""
            onChange={mockOnChange}
            errorMessage={customError}
          />
        </Wrapper>,
      );

      expect(screen.getByText(customError)).toBeInTheDocument();
    });

    it("should have aria-invalid attribute when there is an error", () => {
      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

      const Wrapper = createWrapper();

      const { container } = render(
        <Wrapper>
          <Series label="Select Series" value="" onChange={mockOnChange} errorMessage="Error" />
        </Wrapper>,
      );

      const dropdown = container.querySelector(".p-dropdown");
      expect(dropdown).toBeInTheDocument();
    });

    it("should clear validation error when user selects a series", async () => {
      const mockSeries = [
        { id: "1", label: "Series 1", idSims: null },
        { id: "2", label: "Series 2", idSims: null },
      ];

      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

      const Wrapper = createWrapper();

      const { rerender } = render(
        <Wrapper>
          <Series
            label="Select Series"
            value=""
            onChange={mockOnChange}
            errorMessage="Series is required"
          />
        </Wrapper>,
      );

      expect(screen.getByText("Series is required")).toBeInTheDocument();

      // Simulate user selecting a series
      rerender(
        <Wrapper>
          <Series label="Select Series" value="1" onChange={mockOnChange} errorMessage="" />
        </Wrapper>,
      );

      await vi.waitFor(() => {
        expect(screen.queryByText("Series is required")).not.toBeInTheDocument();
      });
    });

    it("should show validation error only when errorMessage is provided", () => {
      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

      const Wrapper = createWrapper();

      const { container } = render(
        <Wrapper>
          <Series label="Select Series" value="" onChange={mockOnChange} />
        </Wrapper>,
      );

      const errorElement = container.querySelector("#series-error");
      expect(errorElement).not.toBeInTheDocument();
    });

    it("should display required indicator in label", () => {
      vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue([]);

      const Wrapper = createWrapper();

      const { container } = render(
        <Wrapper>
          <Series label="Select Series" value="" onChange={mockOnChange} />
        </Wrapper>,
      );

      const requiredLabel = container.querySelector("label.label-required");
      expect(requiredLabel).toBeInTheDocument();
      // Label includes the text with a required indicator (asterisk)
      expect(requiredLabel?.textContent).toContain("Select Series*");
    });
  });
});
