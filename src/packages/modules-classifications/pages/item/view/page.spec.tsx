import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AppContextProvider } from "../../../../application/app-context";
import { fetchingPreviousLevels } from "../../../hooks/useClassificationItemClient";
import { Component } from "./page";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useParams: () => params(),
}));

const useClassificationItem = vi.fn();
vi.mock("../../../hooks/useClassificationItem", () => ({
  useClassificationItem: (classificationId: string, itemId: string, withNotes: boolean) =>
    useClassificationItem(classificationId, itemId, withNotes),
}));

vi.mock("../../../hooks/useClassificationItemClient", () => ({
  fetchingPreviousLevels: vi.fn().mockResolvedValue([]),
}));

vi.mock("./components/ItemVisualization", () => ({
  ItemVisualization: ({ item, secondLang }: any) => (
    <div>
      <span>poste:{item.general.prefLabelLg1}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  ),
}));

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );
};

describe("Classification item view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ classificationId: "nafr2", itemId: "01" });
    useClassificationItem.mockReturnValue({
      isLoading: false,
      item: { general: { prefLabelLg1: "Agriculture" } },
    });
  });

  it("affiche le poste demandé, notes comprises", () => {
    renderPage();

    expect(screen.getByText("poste:Agriculture")).toBeInTheDocument();
    expect(useClassificationItem).toHaveBeenCalledWith("nafr2", "01", true);
  });

  it("précharge les niveaux parents pour l'écran suivant", () => {
    renderPage();

    expect(fetchingPreviousLevels).toHaveBeenCalledWith("nafr2", { prefLabelLg1: "Agriculture" });
  });

  it("affiche le chargement tant que le poste n'est pas là", () => {
    useClassificationItem.mockReturnValue({ isLoading: true, item: undefined });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(fetchingPreviousLevels).not.toHaveBeenCalled();
  });

  it("ne précharge rien quand le poste revient sans général", () => {
    useClassificationItem.mockReturnValue({ isLoading: false, item: {} });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(fetchingPreviousLevels).not.toHaveBeenCalled();
  });
});
