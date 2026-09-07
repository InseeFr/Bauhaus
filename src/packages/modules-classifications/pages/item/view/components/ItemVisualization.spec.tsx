import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../../../application/app-context";
import { ItemVisualization } from "./ItemVisualization";

vi.mock("../../../../components/General", () => ({
  General: ({ classificationId }: any) => <div>général:{classificationId}</div>,
}));
vi.mock("./ItemControls", () => ({
  ItemControls: ({ classificationId, itemId, version }: any) => (
    <nav>
      actions:{classificationId}|{itemId}|{version}
    </nav>
  ),
}));
vi.mock("./Narrowers", () => ({
  Narrowers: ({ narrowers }: any) => <div>enfants:{narrowers?.length ?? "(aucun)"}</div>,
}));
vi.mock("./ClassificationNotes", () => ({
  ClassificationNotes: ({ notes }: any) => <div>notes:{notes.definitionLg1}</div>,
}));

const general = {
  classificationId: "nafr2",
  itemId: "01",
  conceptVersion: 3,
  prefLabelLg1: "Agriculture",
  prefLabelLg2: "Agriculture EN",
};

const renderItem = (item: any = {}, secondLang = false) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <ItemVisualization
        item={{ general, notes: undefined, narrowers: [], ...item }}
        secondLang={secondLang}
      />
    </AppContextProvider>,
  );

describe("ItemVisualization", () => {
  it("affiche le poste et ses actions", () => {
    renderItem();

    expect(screen.getByText("Agriculture")).toBeInTheDocument();
    expect(screen.getByText("actions:nafr2|01|3")).toBeInTheDocument();
    expect(screen.getByText("général:nafr2")).toBeInTheDocument();
  });

  it("affiche le sous-titre en seconde langue quand elle est active", () => {
    renderItem({}, true);

    expect(screen.getByText("Agriculture EN")).toBeInTheDocument();
  });

  it("n'affiche pas de sous-titre hors seconde langue", () => {
    renderItem();

    expect(screen.queryByText("Agriculture EN")).not.toBeInTheDocument();
  });

  it("n'affiche pas de sous-titre quand la seconde langue manque", () => {
    renderItem({ general: { ...general, prefLabelLg2: undefined } }, true);

    expect(screen.queryByText("Agriculture EN")).not.toBeInTheDocument();
  });

  it("n'affiche le bloc de notes que si le poste en a", () => {
    renderItem();
    expect(screen.queryByText(/^notes:/)).not.toBeInTheDocument();

    renderItem({ notes: { definitionLg1: "Définition" } });
    expect(screen.getByText("notes:Définition")).toBeInTheDocument();
  });

  it("affiche toujours les postes enfants, même vides", () => {
    renderItem();

    expect(screen.getByText("enfants:0")).toBeInTheDocument();
  });
});
