import { screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { fetchingPreviousLevels } from "../../../hooks/useClassificationItemClient";
import { params } from "../../../testing/params.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { itemParams, loadingItem, useClassificationItem } from "../item.testing";
import { Component } from "./page";

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

const renderPage = () => renderClassificationsPage(<Component />, { withQueryClient: true });

describe("Classification item view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue(itemParams);
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
    useClassificationItem.mockReturnValue(loadingItem);
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
