import { screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { params } from "../../../testing/params.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { itemParams, loadingItem, useClassificationItem } from "../item.testing";
import { Component } from "./page";

vi.mock("./components/Compare", () => ({
  Compare: ({ classificationId, general, notes, secondLang }: any) => (
    <div>
      <span>classification:{classificationId}</span>
      <span>poste:{general.prefLabelLg1}</span>
      <span>notes:{notes.definitionLg1}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  ),
}));

const renderPage = () => renderClassificationsPage(<Component />);

describe("Classification item compare page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue(itemParams);
    useClassificationItem.mockReturnValue({
      isLoading: false,
      item: { general: { prefLabelLg1: "Agriculture" }, notes: { definitionLg1: "Définition" } },
    });
  });

  it("compare le poste demandé dans l'URL", () => {
    renderPage();

    expect(screen.getByText("classification:nafr2")).toBeInTheDocument();
    expect(screen.getByText("poste:Agriculture")).toBeInTheDocument();
    expect(screen.getByText("notes:Définition")).toBeInTheDocument();
    expect(useClassificationItem).toHaveBeenCalledWith("nafr2", "01");
  });

  it("affiche le chargement tant que le poste n'est pas là", () => {
    useClassificationItem.mockReturnValue(loadingItem);
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("interroge avec des identifiants vides quand l'URL n'en porte pas", () => {
    params.mockReturnValue({});
    renderPage();

    expect(useClassificationItem).toHaveBeenCalledWith("", "");
  });
});
