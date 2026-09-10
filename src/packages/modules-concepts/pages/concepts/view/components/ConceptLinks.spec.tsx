import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BROADER, CLOSE_MATCH, NARROWER } from "@sdk/constants";

import { ConceptLinks } from "./ConceptLinks";

vi.mock("./LinksList", () => ({
  LinksList: ({ links, lang, alone }: any) => (
    <section>
      <span>
        {lang}|seul:{String(alone)}|liens:{Object.values(links).flat().length}
      </span>
    </section>
  ),
}));

const link = (typeOfLink: string, id: string) => ({ id, typeOfLink }) as any;

describe("ConceptLinks", () => {
  it("ne rend rien quand le concept n'a aucun lien", () => {
    const { container } = render(<ConceptLinks secondLang={false} links={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("rend une seule colonne, occupant toute la largeur, hors seconde langue", () => {
    render(<ConceptLinks secondLang={false} links={[link(NARROWER, "c1")]} />);

    expect(screen.getAllByText(/\|liens:/)).toHaveLength(1);
    expect(screen.getByText("lg1|seul:true|liens:1")).toBeInTheDocument();
  });

  it("rend deux colonnes en seconde langue, aucune n'étant seule", () => {
    render(<ConceptLinks secondLang links={[link(NARROWER, "c1")]} />);

    expect(screen.getByText("lg1|seul:false|liens:1")).toBeInTheDocument();
    expect(screen.getByText("lg2|seul:false|liens:1")).toBeInTheDocument();
  });

  it("regroupe les liens par type", () => {
    render(
      <ConceptLinks
        secondLang={false}
        links={[link(NARROWER, "c1"), link(BROADER, "c2"), link(CLOSE_MATCH, "c3")]}
      />,
    );

    expect(screen.getByText("lg1|seul:true|liens:3")).toBeInTheDocument();
  });

  it("ignore un type de lien inconnu au lieu de casser le regroupement", () => {
    render(
      <ConceptLinks secondLang={false} links={[link(NARROWER, "c1"), link("inventé", "c2")]} />,
    );

    expect(screen.getByText("lg1|seul:true|liens:1")).toBeInTheDocument();
  });

  it("ne rend rien quand tous les liens sont d'un type inconnu", () => {
    const { container } = render(
      <ConceptLinks secondLang={false} links={[link("inventé", "c1")]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
