import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { buildCorrespondenceClassificationLinks } from "./buildCorrespondenceClassificationLinks";

vi.mock("../i18n", () => ({ default: { t: (key: string) => key } }));

const correspondence = {
  idFirstClass: "nafr2",
  firstClassLabelLg1: "NAF rév. 2",
  firstClassLabelLg2: "NAF rev. 2",
  idSecondClass: "cpf",
  secondClassLabelLg1: "CPF",
  secondClassLabelLg2: "CPF EN",
};

const renderLinks = (overrides: any = {}, secondLang = false) =>
  render(
    <MemoryRouter>
      {buildCorrespondenceClassificationLinks({ ...correspondence, ...overrides }, secondLang)}
    </MemoryRouter>,
  );

describe("buildCorrespondenceClassificationLinks", () => {
  it("lie la classification source et la classification cible", () => {
    renderLinks();

    expect(screen.getByRole("link", { name: "NAF rév. 2" })).toHaveAttribute(
      "href",
      "/classifications/classification/nafr2",
    );
    expect(screen.getByRole("link", { name: "CPF" })).toHaveAttribute(
      "href",
      "/classifications/classification/cpf",
    );
  });

  it("intitule chaque lien de son rôle dans la correspondance", () => {
    renderLinks();

    expect(screen.getByText(/correspondence.sourceClassification/)).toBeInTheDocument();
    expect(screen.getByText(/correspondence.targetClassification/)).toBeInTheDocument();
  });

  it("affiche les libellés de seconde langue quand elle est active", () => {
    renderLinks({}, true);

    expect(screen.getByRole("link", { name: "NAF rev. 2" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CPF EN" })).toBeInTheDocument();
  });

  it("omet la source quand la correspondance n'en porte pas", () => {
    renderLinks({ firstClassLabelLg1: undefined });

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "CPF" })).toBeInTheDocument();
  });

  it("omet la cible quand la correspondance n'en porte pas", () => {
    renderLinks({ secondClassLabelLg1: undefined });

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "NAF rév. 2" })).toBeInTheDocument();
  });

  it("rend une liste vide plutôt que rien quand aucune classification n'est renseignée", () => {
    renderLinks({ firstClassLabelLg1: undefined, secondClassLabelLg1: undefined });

    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});
