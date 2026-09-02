import { fireEvent, screen, within } from "@testing-library/react";

import { ConceptNotes } from "@model/concepts/concept";

import { BROADER, CLOSE_MATCH, NARROWER, NONE, RELATED } from "@sdk/constants";

import { renderWithRouter } from "../../../../../tests/render";
import { emptyConceptNotes } from "../../../../utils/emptyConceptNotes";
import { ConceptSummary } from "./ConceptSummary";

const renderSummary = (props: Partial<React.ComponentProps<typeof ConceptSummary>> = {}) => {
  const onSelect = vi.fn();
  const { rerender: rerenderWith } = renderWithRouter(
    <ConceptSummary
      notes={emptyConceptNotes as unknown as ConceptNotes}
      disseminationStatus=""
      maxLengthScopeNote={350}
      conceptsWithLinks={[]}
      equivalentLinks={[]}
      activeSection="general"
      activeNote="conceptsScopeNote"
      activeLinkType={NARROWER}
      onSelect={onSelect}
      {...props}
    />,
  );
  const rerender = (next: Partial<React.ComponentProps<typeof ConceptSummary>>) =>
    rerenderWith(
      <ConceptSummary
        notes={emptyConceptNotes as unknown as ConceptNotes}
        disseminationStatus=""
        maxLengthScopeNote={350}
        conceptsWithLinks={[]}
        equivalentLinks={[]}
        activeSection="general"
        activeNote="conceptsScopeNote"
        activeLinkType={NARROWER}
        onSelect={onSelect}
        {...props}
        {...next}
      />,
    );
  return { onSelect, rerender };
};

const entries = () =>
  within(screen.getByRole("navigation"))
    .getAllByRole("button")
    .map((button) => button.textContent);

const entry = (name: RegExp | string) =>
  within(screen.getByRole("navigation")).getByRole("button", { name });

describe("concept-summary", () => {
  it("liste les sections du concept et le détail des notes", () => {
    renderSummary();

    expect(entries()).toEqual([
      "General information",
      "Notes",
      "Définition courteEmpty",
      "DéfinitionTo fix",
      "Note éditorialeEmpty",
      "Note de changementEmpty",
      "Links0",
      "A pour enfant0",
      "A pour parent0",
      "Référence0",
      "Remplace0",
      "Est lié à0",
      "Correspond à0",
    ]);
  });

  it("compte les liens de chaque type", () => {
    renderSummary({
      conceptsWithLinks: [
        { id: "c1", label: "Enfant", typeOfLink: NARROWER },
        { id: "c2", label: "Autre enfant", typeOfLink: NARROWER },
        { id: "c3", label: "Parent", typeOfLink: BROADER },
        { id: "c4", label: "Libre", typeOfLink: NONE },
      ],
      equivalentLinks: [{ urn: "urn:concept:7", typeOfLink: CLOSE_MATCH } as never],
    });

    expect(entry(/A pour enfant/).textContent).toBe("A pour enfant2");
    expect(entry(/A pour parent/).textContent).toBe("A pour parent1");
    expect(entry(/Est lié à/).textContent).toBe("Est lié à0");
    expect(entry(/Correspond à/).textContent).toBe("Correspond à1");
  });

  it("demande l'affichage du type de lien choisi", () => {
    const { onSelect } = renderSummary();

    fireEvent.click(entry(/Est lié à/));

    expect(onSelect).toHaveBeenCalledWith("links", RELATED);
  });

  it("demande l'affichage de la section choisie", () => {
    const { onSelect } = renderSummary();

    fireEvent.click(entry(/Links/));

    expect(onSelect).toHaveBeenCalledWith("links");
  });

  it("demande l'affichage de la note choisie", () => {
    const { onSelect } = renderSummary();

    fireEvent.click(entry(/Note éditoriale/));

    expect(onSelect).toHaveBeenCalledWith("notes", "conceptsEditorialNote");
  });

  it("marque la note affichée", () => {
    renderSummary({ activeSection: "notes", activeNote: "conceptsEditorialNote" });

    expect(entry(/Note éditoriale/)).toHaveAttribute("aria-current", "true");
    expect(entry(/Définition courte/)).not.toHaveAttribute("aria-current");
  });

  it("ne marque aucune note tant qu'une autre section est affichée", () => {
    renderSummary({ activeSection: "links", activeNote: "conceptsEditorialNote" });

    expect(entry(/Note éditoriale/)).not.toHaveAttribute("aria-current");
  });

  it("marque le type de lien affiché", () => {
    renderSummary({ activeSection: "links", activeLinkType: BROADER });

    expect(entry(/A pour parent/)).toHaveAttribute("aria-current", "true");
    expect(entry(/A pour enfant/)).not.toHaveAttribute("aria-current");
  });

  it("ne marque aucun type de lien tant qu'une autre section est affichée", () => {
    renderSummary({ activeSection: "notes", activeLinkType: BROADER });

    expect(entry(/A pour parent/)).not.toHaveAttribute("aria-current");
  });

  it("marque la section affichée", () => {
    renderSummary({ activeSection: "notes" });

    expect(entry("Notes")).toHaveAttribute("aria-current", "true");
    expect(entry(/General information/)).not.toHaveAttribute("aria-current");
  });

  it("ne signale rien sur une note complète", () => {
    renderSummary({
      notes: {
        ...emptyConceptNotes,
        editorialNoteLg1: "<p>Note</p>",
        editorialNoteLg2: "<p>Note</p>",
      } as unknown as ConceptNotes,
    });

    expect(entry(/Note éditoriale/).textContent?.trim()).toBe("Note éditoriale");
  });

  it("compte les liens du concept, correspondances externes comprises", () => {
    renderSummary({
      conceptsWithLinks: [
        { id: "c1", label: "Enfant", typeOfLink: NARROWER },
        { id: "c2", label: "Libre", typeOfLink: NONE },
      ],
      equivalentLinks: [{ urn: "urn:concept:7" } as never],
    });

    expect(entry(/Links/).textContent?.replace(/\s+/g, " ")).toContain("2");
  });

  it("ne compte pas la définition courte comme à corriger sur un concept non public", () => {
    renderSummary({ disseminationStatus: "Privé" });

    expect(entry(/Définition courte/).textContent).toContain("Empty");
  });

  describe("informations générales", () => {
    it("ne signale rien quand aucun champ général n'est en erreur", () => {
      renderSummary();

      expect(entry(/General information/).textContent).toBe("General information");
    });

    it("ne signale rien quand les champs généraux sont présents sans message d'erreur", () => {
      // `validate` renvoie toutes les clés du schéma, message vide comprises.
      renderSummary({
        errorFields: { prefLabelLg1: "", creator: "", disseminationStatus: "" },
      });

      expect(entry(/General information/).textContent).toBe("General information");
    });

    it("cesse de signaler la section une fois le champ corrigé", () => {
      const { rerender } = renderSummary({
        errorFields: { prefLabelLg1: "Le libellé est obligatoire", creator: "" },
      });

      expect(entry(/General information/).textContent).toContain("To fix");

      rerender({ errorFields: { prefLabelLg1: "", creator: "" } });

      expect(entry(/General information/).textContent).toBe("General information");
    });

    it("signale les informations générales à corriger", () => {
      renderSummary({ errorFields: { prefLabelLg1: "Le libellé est obligatoire" } });

      expect(entry(/General information/).textContent).toContain("To fix");
    });

    it("ignore les erreurs qui portent sur une note", () => {
      renderSummary({ errorFields: { definitionLg1: "La définition est obligatoire" } });

      expect(entry(/General information/).textContent).toBe("General information");
    });
  });
});
