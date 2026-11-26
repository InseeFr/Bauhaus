import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { createQueryWrapper } from "../../../hooks/queryClient.testing";
import { usePhysicalInstances } from "../../../hooks/usePhysicalInstances";
import { Component } from "./home";

vi.mock("../../../hooks/usePhysicalInstances");
vi.mock("@utils/hooks/useTitle");
vi.mock("./menu", () => ({
  HomePageMenu: ({
    onCreate,
    onCreateFrom,
  }: {
    onCreate: () => void;
    onCreateFrom: () => void;
  }) => (
    <>
      <button type="button" data-testid="home-page-menu-create" onClick={onCreate}>
        Nouveau
      </button>
      <button type="button" data-testid="home-page-menu" onClick={onCreateFrom}>
        Nouveau à partir de…
      </button>
    </>
  ),
}));
vi.mock("../../components/NewFromDialog/NewFromDialog", () => ({
  NewFromDialog: ({ visible, onHide }: { visible: boolean; onHide: () => void }) =>
    visible ? (
      <dialog open aria-label="new-from">
        <button type="button" onClick={onHide}>
          close-new-from
        </button>
      </dialog>
    ) : null,
}));
vi.mock("../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog", () => ({
  PhysicalInstanceDialog: ({ visible, onHide }: { visible: boolean; onHide: () => void }) =>
    visible ? (
      <dialog open aria-label="create">
        <button type="button" onClick={onHide}>
          close-create
        </button>
      </dialog>
    ) : null,
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

const LocationSearch = () => <output data-testid="location-search">{useLocation().search}</output>;

const renderHome = (initialEntry = "/ddi/physical-instances") => {
  const QueryWrapper = createQueryWrapper();
  render(<Component />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryWrapper>
        <MemoryRouter initialEntries={[initialEntry]}>
          {children}
          <LocationSearch />
        </MemoryRouter>
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

  it("ouvre « Nouveau à partir de… » depuis le menu", async () => {
    mockPhysicalInstances([]);
    renderHome();
    expect(screen.queryByRole("dialog", { name: "new-from" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("home-page-menu"));

    expect(screen.getByRole("dialog", { name: "new-from" })).toBeInTheDocument();
  });

  describe("modale ouverte mémorisée dans l'URL (?dialog=)", () => {
    for (const { dialog, name } of [
      { dialog: "create", name: "create" },
      { dialog: "new-from", name: "new-from" },
    ]) {
      it(`ouvre la modale « ${name} » au chargement de ?dialog=${dialog}`, () => {
        mockPhysicalInstances([]);

        renderHome(`/ddi/physical-instances?dialog=${dialog}`);

        expect(screen.getByRole("dialog", { name })).toBeInTheDocument();
      });
    }

    it("n'ouvre aucune modale pour une valeur inconnue", () => {
      mockPhysicalInstances([]);

      renderHome("/ddi/physical-instances?dialog=inconnue");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    for (const { testId, dialog } of [
      { testId: "home-page-menu-create", dialog: "create" },
      { testId: "home-page-menu", dialog: "new-from" },
    ]) {
      it(`écrit ?dialog=${dialog} à l'ouverture depuis le menu`, async () => {
        mockPhysicalInstances([]);
        renderHome();

        await userEvent.click(screen.getByTestId(testId));

        expect(screen.getByTestId("location-search")).toHaveTextContent(`?dialog=${dialog}`);
      });
    }

    for (const { dialog, close } of [
      { dialog: "create", close: "close-create" },
      { dialog: "new-from", close: "close-new-from" },
    ]) {
      it(`retire ?dialog=${dialog} à la fermeture en gardant les autres paramètres`, async () => {
        mockPhysicalInstances([]);
        renderHome(`/ddi/physical-instances?search=emploi&dialog=${dialog}`);

        await userEvent.click(screen.getByText(close));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.getByTestId("location-search")).toHaveTextContent(/^\?search=emploi$/);
      });
    }
  });
});
