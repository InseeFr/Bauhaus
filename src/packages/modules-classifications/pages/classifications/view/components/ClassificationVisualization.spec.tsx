import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../../../application/app-context";
import { ClassificationVisualization } from "./ClassificationVisualization";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("./General", () => ({ General: () => <div>général</div> }));
vi.mock("./Notes", () => ({
  Notes: ({ notes }: any) => <div>notes:{notes.scopeNoteLg1}</div>,
}));
vi.mock("./Levels", () => ({
  Levels: ({ levels, classificationId }: any) => (
    <div>
      niveaux:{levels.length}|{classificationId}
    </div>
  ),
}));
vi.mock("./ClassificationControls", () => ({
  ClassificationControls: () => <nav>actions</nav>,
}));

const general = {
  id: "nafr2",
  prefLabelLg1: "NAF rév. 2",
  prefLabelLg2: "NAF rev. 2",
} as any;

const renderVisualization = ({ classification, ...props }: any = {}) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <MemoryRouter>
        <ClassificationVisualization
          classification={{ general, levels: [], ...classification }}
          classificationId="nafr2"
          secondLang={false}
          publish={vi.fn()}
          {...props}
        />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("ClassificationVisualization", () => {
  it("mène à la liste complète des postes", () => {
    renderVisualization();

    expect(screen.getByRole("link", { name: /classification.allItemsTitle/ })).toHaveAttribute(
      "href",
      "/classifications/classification/nafr2/items",
    );
  });

  it("affiche le sous-titre en seconde langue quand il existe", () => {
    renderVisualization();

    expect(screen.getByText("NAF rev. 2")).toBeInTheDocument();
  });

  it("n'affiche pas de sous-titre quand la seconde langue manque", () => {
    renderVisualization({ classification: { general: { ...general, prefLabelLg2: undefined } } });

    expect(screen.queryByText("NAF rev. 2")).not.toBeInTheDocument();
  });

  it("n'affiche le bloc de notes que si une note de portée existe", () => {
    renderVisualization();
    expect(screen.queryByText(/^notes:/)).not.toBeInTheDocument();

    renderVisualization({
      classification: { general: { ...general, scopeNoteLg1: "Portée" } },
    });
    expect(screen.getByText("notes:Portée")).toBeInTheDocument();
  });

  it("n'affiche les niveaux que si la classification en a", () => {
    renderVisualization();
    expect(screen.queryByText(/^niveaux:/)).not.toBeInTheDocument();

    renderVisualization({ classification: { levels: [{ id: "l-1" }] } });
    expect(screen.getByText("niveaux:1|nafr2")).toBeInTheDocument();
  });

  it("affiche l'erreur serveur quand il y en a une", () => {
    renderVisualization({ serverSideError: "Publication refusée" });

    expect(screen.getByText("Publication refusée")).toBeInTheDocument();
  });
});
