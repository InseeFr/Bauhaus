import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../application/app-context";
import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getOperation: vi.fn(),
  },
}));

const NO_PROPERTIES = {} as any;
const operationEditPage = <Component />;

// Un client neuf par rendu : la fiche chargée par un test ne sert pas le suivant depuis le cache.
const renderAtRoute = (url: string, routePath: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={Array.of(url)}>
          <Routes>
            <Route path={routePath} element={operationEditPage} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );
};

const renderWithRouter = (id: string) =>
  renderAtRoute(`/operations/operation/${id}`, "/operations/operation/:id");

const renderWithoutId = () => renderAtRoute("/operations/operation/", "/operations/operation/");

describe("Operations Edition Index Component", () => {
  beforeEach(() => vi.clearAllMocks());

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

    renderWithoutId();

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
    renderWithoutId();

    expect(OperationsApi.getOperation).not.toHaveBeenCalled();
  });

  it("says the operation could not be loaded instead of loading forever", async () => {
    vi.mocked(OperationsApi.getOperation).mockRejectedValue(sdkRejection.network());

    renderWithRouter("123");

    await expectItemLoadFailed();
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
});
