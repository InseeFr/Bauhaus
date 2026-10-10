import { screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";

import { params } from "./params.testing";
import { renderClassificationsPage } from "./render.testing";

type ResolvableMock = { mockResolvedValue(value: any): unknown };

/**
 * Doublure de la vue d'une page « général + membres » (familles, séries) : `prop` est le nom de
 * la propriété qui porte l'objet affiché (`family`, `series`).
 */
export const mockGeneralMembersVisualization =
  (prop: string) =>
  ({ secondLang, ...props }: Record<string, any>) => (
    <div>
      <span>libellé:{props[prop].general.prefLabelLg1 ?? "(aucun)"}</span>
      <span>membres:{props[prop].members.length}</span>
      <span>secondeLangue:{String(secondLang)}</span>
    </div>
  );

/**
 * Comportement commun aux pages de visualisation qui chargent un général et des membres en
 * parallèle (familles, séries). La vue doit être doublée par `mockGeneralMembersVisualization` ;
 * l'identifiant `id` est fourni à la page par les paramètres de route.
 */
export const itBehavesLikeAGeneralAndMembersViewPage = ({
  page,
  getGeneral,
  getMembers,
  id,
  label,
}: {
  page: ReactElement;
  getGeneral: ResolvableMock;
  getMembers: ResolvableMock;
  id: string;
  label: string;
}) => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id });
    getGeneral.mockResolvedValue({ prefLabelLg1: label });
    getMembers.mockResolvedValue([
      { id: "m-1", labelLg1: "Membre 1" },
      { id: "m-2", labelLg1: "Membre 2" },
    ]);
  });

  it("attend les deux appels avant d'afficher quoi que ce soit", async () => {
    renderClassificationsPage(page);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(`libellé:${label}`)).toBeInTheDocument());
    expect(screen.getByText("membres:2")).toBeInTheDocument();
    expect(getGeneral).toHaveBeenCalledWith(id);
    expect(getMembers).toHaveBeenCalledWith(id);
  });

  it("tolère une réponse vide de part et d'autre", async () => {
    getGeneral.mockResolvedValue(undefined);
    getMembers.mockResolvedValue(undefined);
    renderClassificationsPage(page);

    await waitFor(() => expect(screen.getByText("membres:0")).toBeInTheDocument());
    expect(screen.getByText("libellé:(aucun)")).toBeInTheDocument();
  });

  it("passe l'état de seconde langue à la vue", async () => {
    renderClassificationsPage(page);

    await waitFor(() => expect(screen.getByText("secondeLangue:false")).toBeInTheDocument());
  });
};
