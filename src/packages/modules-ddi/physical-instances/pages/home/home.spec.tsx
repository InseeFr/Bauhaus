import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { createQueryWrapper } from "../../../hooks/queryClient.testing";
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

const renderHome = () => {
  const QueryWrapper = createQueryWrapper();
  render(<Component />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryWrapper>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryWrapper>
    ),
  });
};

const mockPhysicalInstances = (data: unknown, isLoading = false) =>
  vi.mocked(usePhysicalInstances).mockReturnValue({
    data,
    isLoading,
    isSuccess: !isLoading,
    isError: false,
    error: null,
  } as any);

describe("Home Component", () => {
  it("should show loading state when data is loading", () => {
    mockPhysicalInstances(undefined, true);

    renderHome();

    expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
  });

  for (const { name, data } of [
    {
      name: "should render SearchableList when data is loaded",
      data: [
        { id: "1", name: "Physical Instance 1" },
        { id: "2", name: "Physical Instance 2" },
      ],
    },
    { name: "should render empty list when no data", data: [] },
    { name: "should handle undefined data gracefully", data: undefined },
  ]) {
    it(name, () => {
      mockPhysicalInstances(data);

      renderHome();

      expect(screen.getByText("Physical Instances - Search")).toBeInTheDocument();
      expect(screen.queryByText("Loading in progress...")).not.toBeInTheDocument();
    });
  }

  it("should filter on the date as displayed (JJ/MM/AAAA)", async () => {
    mockPhysicalInstances([
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
    ]);

    renderHome();

    await userEvent.type(screen.getByPlaceholderText("Label..."), "01/02/2026");

    expect(screen.getByText("Enquête Emploi (01/02/2026)")).toBeInTheDocument();
    expect(screen.queryByText("Enquête Logement (13/11/2025)")).not.toBeInTheDocument();
  });
});
