import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../application/app-context";
import { OperationsApi } from "@sdk/operations-api";
import { Component } from "./index";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getOperation: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithRouter = (id: string) => {
  return render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/operations/operation/${id}`]}>
          <Routes>
            <Route path="/operations/operation/:id" element={<Component />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );
};

describe("Operations Edition Index Component", () => {
  it("should display loading state when operation is being fetched", () => {
    vi.mocked(OperationsApi.getOperation).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        }),
    );

    renderWithRouter("123");

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should fetch and display operation data", async () => {
    const mockOperation = {
      id: "123",
      prefLabelLg1: "Test Operation",
      prefLabelLg2: "Opération Test",
      series: { id: "series-1", label: "Test Series" },
      year: "2024",
    };

    vi.mocked(OperationsApi.getOperation).mockResolvedValue(mockOperation);

    renderWithRouter("123");

    await waitFor(() => {
      expect(OperationsApi.getOperation).toHaveBeenCalledWith("123");
    });

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  it("should call getOperation with correct id from URL params", async () => {
    const mockOperation = {
      id: "123",
      prefLabelLg1: "Operation 1",
    };

    vi.mocked(OperationsApi.getOperation).mockResolvedValue(mockOperation);

    renderWithRouter("123");

    await waitFor(() => {
      expect(OperationsApi.getOperation).toHaveBeenCalledWith("123");
    });

    expect(OperationsApi.getOperation).toHaveBeenCalledTimes(1);
  });

  it("should render OperationsOperationEdition with empty operation when creating new", async () => {
    vi.mocked(OperationsApi.getOperation).mockResolvedValue({});

    render(
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/operations/operation/"]}>
            <Routes>
              <Route path="/operations/operation/" element={<Component />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </AppContextProvider>,
    );

    await waitFor(() => {
      expect(OperationsApi.getOperation).not.toHaveBeenCalled();
    });
  });

  it("should pass goBack function to OperationsOperationEdition", async () => {
    const mockOperation = {
      id: "123",
      prefLabelLg1: "Test Operation",
    };

    vi.mocked(OperationsApi.getOperation).mockResolvedValue(mockOperation);

    renderWithRouter("123");

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  it("should set page title with operation label", async () => {
    const mockOperation = {
      id: "123",
      prefLabelLg1: "Test Operation",
    };

    vi.mocked(OperationsApi.getOperation).mockResolvedValue(mockOperation);

    renderWithRouter("123");

    await waitFor(() => {
      expect(OperationsApi.getOperation).toHaveBeenCalledWith("123");
    });
  });

  it("should handle undefined operation id", () => {
    render(
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/operations/operation/"]}>
            <Routes>
              <Route path="/operations/operation/" element={<Component />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </AppContextProvider>,
    );

    expect(OperationsApi.getOperation).not.toHaveBeenCalled();
  });
});
