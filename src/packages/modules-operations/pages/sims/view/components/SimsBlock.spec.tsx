import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { rangeType } from "../../../../constants/rangeType";
import { SimsBlock } from "./SimsBlock";

// Chaque type de rubrique délègue à un bloc dédié : on ne vérifie ici que l'aiguillage.
vi.mock("./SimsBlockText", () => ({
  SimsBlockText: ({ isSecondLang }: any) => <span>texte:{String(isSecondLang)}</span>,
}));
vi.mock("./SimsBlockDate", () => ({ SimsBlockDate: () => <span>date</span> }));
vi.mock("./SimsBlockRichText", () => ({
  SimsBlockRichText: ({ isSecondLang }: any) => <span>riche:{String(isSecondLang)}</span>,
}));
vi.mock("./SimsBlockCodelist", () => ({
  SimsBlockCodelist: ({ multi }: any) => <span>liste:{String(multi)}</span>,
}));
vi.mock("./SimsBlockOrganization", () => ({
  SimsBlockOrganization: () => <span>organisation</span>,
}));
vi.mock("./SimsBlockGeography", () => ({ SimsBlockGeography: () => <span>géographie</span> }));
vi.mock("./SimsBlockWithoutObject", () => ({
  SimsBlockWithoutObject: () => <span>sans objet</span>,
}));

const msd = { masLabelLg1: "Rubrique" };

const renderBlock = (props = {}) => render(<SimsBlock msd={msd} codelists={{}} {...props} />);

describe("SimsBlock", () => {
  it("ne rend rien quand la rubrique n'a pas de libellé", () => {
    const { container } = renderBlock({ msd: {} });

    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien pour une rubrique purement présentationnelle", () => {
    const { container } = renderBlock({
      msd: { masLabelLg1: "Section", isPresentational: true },
      currentSection: { rangeType: rangeType.TEXT },
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("rend un bloc texte", () => {
    renderBlock({ currentSection: { rangeType: rangeType.TEXT } });

    expect(screen.getByText("texte:false")).toBeInTheDocument();
  });

  it("propage la seconde langue au bloc texte", () => {
    renderBlock({ currentSection: { rangeType: rangeType.TEXT }, isSecondLang: true });

    expect(screen.getByText("texte:true")).toBeInTheDocument();
  });

  it("rend un bloc date quand la rubrique porte une valeur", () => {
    renderBlock({ currentSection: { rangeType: rangeType.DATE, value: "2026-01-01" } });

    expect(screen.getByText("date")).toBeInTheDocument();
  });

  it("n'affiche pas de date pour une rubrique vide", () => {
    renderBlock({ currentSection: { rangeType: rangeType.DATE } });

    expect(screen.queryByText("date")).not.toBeInTheDocument();
  });

  it("rend un bloc texte enrichi", () => {
    renderBlock({ currentSection: { rangeType: rangeType.RICH_TEXT } });

    expect(screen.getByText("riche:false")).toBeInTheDocument();
  });

  it("rend une liste de codes quand la liste attendue est connue", () => {
    renderBlock({
      currentSection: { rangeType: rangeType.CODE_LIST, codeList: "CL_FREQ" },
      codelists: { CL_FREQ: [{ id: "A" }] },
    });

    expect(screen.getByText("liste:false")).toBeInTheDocument();
  });

  it("passe la liste en multi-valuée quand la rubrique est non bornée", () => {
    renderBlock({
      currentSection: { rangeType: rangeType.CODE_LIST, codeList: "CL_FREQ" },
      codelists: { CL_FREQ: [] },
      unbounded: true,
    });

    expect(screen.getByText("liste:true")).toBeInTheDocument();
  });

  it("n'affiche pas de liste de codes tant que la liste n'est pas chargée", () => {
    renderBlock({
      currentSection: { rangeType: rangeType.CODE_LIST, codeList: "CL_ABSENTE" },
      codelists: {},
    });

    expect(screen.queryByText(/^liste:/)).not.toBeInTheDocument();
  });

  it("rend un bloc organisation", () => {
    renderBlock({ currentSection: { rangeType: rangeType.ORGANIZATION } });

    expect(screen.getByText("organisation")).toBeInTheDocument();
  });

  it("rend un bloc géographie", () => {
    renderBlock({ currentSection: { rangeType: rangeType.GEOGRAPHY } });

    expect(screen.getByText("géographie")).toBeInTheDocument();
  });

  it("rend un bloc « rubrique sans objet »", () => {
    renderBlock({ currentSection: { rangeType: rangeType.RUBRIQUE_SANS_OBJECT } });

    expect(screen.getByText("sans objet")).toBeInTheDocument();
  });

  it("ne rend aucun bloc pour un type de rubrique inconnu", () => {
    const { container } = renderBlock({ currentSection: { rangeType: "INCONNU" } });

    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend aucun bloc quand aucune rubrique courante n'est fournie", () => {
    const { container } = renderBlock();

    expect(container).toBeEmptyDOMElement();
  });
});
