import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { usePhysicalInstances } from "../../../hooks/usePhysicalInstances";
import { Component } from "./home";

vi.mock("../../../hooks/usePhysicalInstances");
vi.mock("@utils/hooks/useTitle");
vi.mock("./menu", () => ({
  HomePageMenu: () => <div data-testid="home-page-menu">Menu</div>,
}));
vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
}));
vi.mock("react-i18next", async () => {
  const originalModule = await vi.importActual<typeof import("react-i18next")>("react-i18next");
  return {
    ...originalModule,
    useTranslation: (ns?: string, options?: any) => {
      if (options?.i18n) {
        return originalModule.useTranslation(ns, options);
      }
      return {
        t: (key: string) => {
          const translations: Record<string, string> = {
            "ddi.title": "Variables",
            "physicalInstance.pluralTitle": "Physical Instances",
            "physicalInstance.homePageTitle": "Physical Instances - Search",
          };
          return translations[key] ?? key;
        },
      };
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Home Component", () => {
  it("should show loading state when data is loading", () => {
    vi.mocked(usePhysicalInstances).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    render(<Component />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
  });

  it("should render SearchableList when data is loaded", () => {
    const mockData = [
      { id: "1", name: "Physical Instance 1" },
      { id: "2", name: "Physical Instance 2" },
    ];

    vi.mocked(usePhysicalInstances).mockReturnValue({
      data: mockData,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<Component />, { wrapper: createWrapper() });

    expect(screen.getByText("Physical Instances - Search")).toBeInTheDocument();
    expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
  });

  it("should render empty list when no data", () => {
    vi.mocked(usePhysicalInstances).mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<Component />, { wrapper: createWrapper() });

    expect(screen.getByText("Physical Instances - Search")).toBeInTheDocument();
    expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
  });

  it("should handle undefined data gracefully", () => {
    vi.mocked(usePhysicalInstances).mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<Component />, { wrapper: createWrapper() });

    expect(screen.getByText("Physical Instances - Search")).toBeInTheDocument();
    expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
  });

  it("should filter on the date as displayed (JJ/MM/AAAA)", async () => {
    vi.mocked(usePhysicalInstances).mockReturnValue({
      data: [
        {
          id: "1",
          label: "Enquête Emploi",
          versionDate: "2026-02-01T14:26:32.961778",
          agency: "fr.insee",
        },
        {
          id: "2",
          label: "Enquête Logement",
          versionDate: "2025-11-13T10:00:00",
          agency: "fr.insee",
        },
      ],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    render(<Component />, { wrapper: createWrapper() });

    await userEvent.type(screen.getByPlaceholderText("Label..."), "01/02/2026");

    expect(screen.getByText("Enquête Emploi (01/02/2026)")).toBeInTheDocument();
    expect(screen.queryByText("Enquête Logement (13/11/2025)")).not.toBeInTheDocument();
  });
});
