import { screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { params } from "../../../testing/params.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

const useClassificationLevel = vi.fn();
vi.mock("../../../hooks/useClassificationLevel", () => ({
  useClassificationLevel: (classificationId: string, levelId: string) =>
    useClassificationLevel(classificationId, levelId),
}));

vi.mock("./components/LevelVisualization", () => ({
  LevelVisualization: ({ level, secondLang }: any) => (
    <div>
      <span>niveau:{level.prefLabelLg1}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  ),
}));

const renderPage = () => renderClassificationsPage(<Component />);

describe("Classifications level view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ classificationId: "nafr2", levelId: "divisions" });
    useClassificationLevel.mockReturnValue({
      isLoading: false,
      level: { prefLabelLg1: "Divisions" },
    });
  });

  it("affiche le niveau demandé dans l'URL", () => {
    renderPage();

    expect(screen.getByText("niveau:Divisions")).toBeInTheDocument();
    expect(useClassificationLevel).toHaveBeenCalledWith("nafr2", "divisions");
  });

  it("affiche le chargement tant que le niveau n'est pas là", () => {
    useClassificationLevel.mockReturnValue({ isLoading: true, level: undefined });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("affiche le chargement quand le niveau reste introuvable", () => {
    useClassificationLevel.mockReturnValue({ isLoading: false, level: undefined });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("interroge avec des identifiants vides quand l'URL n'en porte pas", () => {
    params.mockReturnValue({});
    renderPage();

    expect(useClassificationLevel).toHaveBeenCalledWith("", "");
  });
});
