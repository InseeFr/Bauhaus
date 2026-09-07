import { fireEvent, screen } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import { EquivalentLinks } from "./EquivalentLinks";

const renderLinks = (links: never[] = []) => {
  const updateEquivalentLinks = vi.fn();
  renderWithRouter(<EquivalentLinks links={links} updateEquivalentLinks={updateEquivalentLinks} />);
  return { updateEquivalentLinks };
};

const input = () => screen.getByPlaceholderText("New link");
const addButton = () => screen.getByRole("button", { name: "Add" });
const type = (value: string) => fireEvent.change(input(), { target: { value } });

describe("EquivalentLinks", () => {
  it("n'autorise pas l'ajout tant que rien n'est saisi", () => {
    renderLinks();

    expect(addButton()).toBeDisabled();
  });

  it("autorise l'ajout d'une URL", () => {
    renderLinks();

    type("https://stats.oecd.org/glossary/detail.asp?ID=2288");

    expect(addButton()).toBeEnabled();
  });

  it("autorise l'ajout d'une URN", () => {
    renderLinks();

    type("urn:concept:42");

    expect(addButton()).toBeEnabled();
  });

  it("refuse une saisie qui n'est pas une URI", () => {
    renderLinks();

    type("Commerce de gros");

    expect(addButton()).toBeDisabled();
  });

  it("explique pourquoi la saisie est refusée", () => {
    renderLinks();

    type("Commerce de gros");

    expect(screen.getByText(/URI/)).toBeInTheDocument();
  });

  it("ne reproche rien tant que le champ est vide", () => {
    renderLinks();

    expect(screen.queryByText(/URI/)).not.toBeInTheDocument();
  });

  it("cesse de reprocher une fois la saisie corrigée", () => {
    renderLinks();

    type("Commerce de gros");
    type("urn:concept:42");

    expect(screen.queryByText(/URI/)).not.toBeInTheDocument();
  });

  it("remonte le lien ajouté", () => {
    const { updateEquivalentLinks } = renderLinks();

    type("urn:concept:42");
    fireEvent.click(addButton());

    expect(updateEquivalentLinks).toHaveBeenCalledWith([
      expect.objectContaining({ urn: "urn:concept:42" }),
    ]);
  });

  it("enregistre l'URI sans les espaces qui l'entourent", () => {
    const { updateEquivalentLinks } = renderLinks();

    type("  urn:concept:42  ");
    fireEvent.click(addButton());

    expect(updateEquivalentLinks).toHaveBeenCalledWith([
      expect.objectContaining({ urn: "urn:concept:42" }),
    ]);
  });
});
