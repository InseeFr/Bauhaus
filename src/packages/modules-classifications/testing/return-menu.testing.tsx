import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { mockGoBack } from "./component-mocks.testing";

// Ces mocks sont enregistrés à l'import de ce module : le spec doit donc l'importer AVANT le
// menu testé (ce que garantit l'ordre des imports, les chemins parents précédant `./menu`).
vi.mock("@utils/hooks/useGoBack", () => import("./component-mocks.testing"));
vi.mock("@components/action-toolbar", () => import("./component-mocks.testing"));
vi.mock("@components/buttons/buttons-with-icons", () => import("./component-mocks.testing"));

/**
 * Comportement commun aux menus « Retour » des sous-pages d'une nomenclature (postes, arbre) :
 * le bouton renvoie vers la nomenclature, c'est-à-dire l'URL courante privée de son dernier segment.
 */
export const itBehavesLikeAReturnMenu = (menu: ReactElement, segment: string) => {
  const pathname = `/classifications/classification/coicop2016/${segment}`;

  const renderMenu = (initialPath = pathname) =>
    render(<MemoryRouter initialEntries={[initialPath]}>{menu}</MemoryRouter>);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("se rend sans planter", () => {
    renderMenu();
  });

  it("affiche le bouton Retour", () => {
    renderMenu();
    expect(screen.getByTestId("return-button")).toBeInTheDocument();
  });

  it("rend l'ActionToolbar", () => {
    renderMenu();
    expect(screen.getByTestId("action-toolbar")).toBeInTheDocument();
  });

  it(`appelle goBack avec le chemin sans /${segment} au clic`, () => {
    renderMenu(pathname);
    fireEvent.click(screen.getByTestId("return-button"));
    expect(mockGoBack).toHaveBeenCalledWith("/classifications/classification/coicop2016");
  });
};
