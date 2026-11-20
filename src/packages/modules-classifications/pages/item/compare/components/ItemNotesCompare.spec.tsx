import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ItemNotesCompare } from "./ItemNotesCompare";

const emptyVersion = (version: number) => ({
  version,
  definitionLg1: "",
  definitionLg2: "",
  scopeNoteLg1: "",
  scopeNoteLg2: "",
  coreContentNoteLg1: "",
  coreContentNoteLg2: "",
  additionalContentNoteLg1: "",
  additionalContentNoteLg2: "",
  exclusionNoteLg1: "",
  exclusionNoteLg2: "",
  changeNoteLg1: "",
  changeNoteLg2: "",
});

// Note générale en versions 1, 2 et 3 ; contenu central en versions 2 et 3 ;
// contenu limite uniquement en version 1.
const NOTES = {
  1: {
    ...emptyVersion(1),
    definitionLg1: "Définition v1",
    additionalContentNoteLg1: "Limite v1",
  },
  2: { ...emptyVersion(2), definitionLg1: "Définition v2", coreContentNoteLg1: "Central v2" },
  3: {
    ...emptyVersion(3),
    definitionLg1: "Définition v3",
    definitionLg2: "Definition v3",
    coreContentNoteLg1: "Central v3",
  },
};

const section = (title: string) => screen.getByRole("region", { name: title });

// La liste déroulante pose son panneau en fin de document ; ses options y portent le rôle
// option, mais le panneau reste masqué sous happy-dom, d'où `hidden: true`.
const openVersionSelect = (title: string) => {
  fireEvent.click(within(section(title)).getAllByRole("combobox")[0]);
  return within(screen.getByRole("listbox", { hidden: true }));
};

describe("ItemNotesCompare", () => {
  it("compare par défaut les deux dernières versions de chaque note", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    const definition = section("General note");
    expect(within(definition).getByText("Définition v2")).toBeInTheDocument();
    expect(within(definition).getByText("Définition v3")).toBeInTheDocument();
    expect(within(definition).queryByText("Définition v1")).not.toBeInTheDocument();

    const core = section("Main content");
    expect(within(core).getByText("Central v2")).toBeInTheDocument();
    expect(within(core).getByText("Central v3")).toBeInTheDocument();
  });

  it("affiche le numéro de la version visible de chaque côté", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    const definition = section("General note");
    expect(within(definition).getByText("Version 2")).toBeInTheDocument();
    expect(within(definition).getByText("Version 3")).toBeInTheDocument();
  });

  it("affiche seule l'unique version d'une note qui n'en a qu'une", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    const additional = section("Additional content");
    expect(within(additional).getByText("Limite v1")).toBeInTheDocument();
    expect(within(additional).getByText("Version 1")).toBeInTheDocument();
    expect(within(additional).queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("n'affiche pas les notes qui n'ont aucune version", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    expect(screen.queryByRole("region", { name: "Exclusion note" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Remark" })).not.toBeInTheDocument();
  });

  it("ne propose que les versions où la note existe", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    const options = openVersionSelect("Main content")
      .getAllByRole("option", { hidden: true })
      .map((option) => option.textContent);

    expect(options).toEqual(["2", "3"]);
  });

  it("change la version d'une note sans toucher aux autres", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={false} />);

    fireEvent.click(
      openVersionSelect("General note").getByRole("option", { name: "1", hidden: true }),
    );

    const definition = section("General note");
    expect(within(definition).getByText("Définition v1")).toBeInTheDocument();
    expect(within(definition).queryByText("Définition v2")).not.toBeInTheDocument();
    expect(within(section("Main content")).getByText("Central v2")).toBeInTheDocument();
  });

  it("interprète le markdown des notes", () => {
    const notes = { 1: { ...emptyVersion(1), definitionLg1: "- premier\n- second" } };
    render(<ItemNotesCompare notes={notes} secondLang={false} />);

    const items = within(section("General note")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["premier", "second"]);
  });

  it("neutralise les liens javascript: du markdown", () => {
    const notes = { 1: { ...emptyVersion(1), definitionLg1: "[piège](javascript:alert(1))" } };
    render(<ItemNotesCompare notes={notes} secondLang={false} />);

    const link = within(section("General note")).getByText("piège").closest("a");
    expect(link?.getAttribute("href") ?? "").not.toMatch(/javascript:/);
  });

  it("affiche la seconde langue quand elle est demandée", () => {
    render(<ItemNotesCompare notes={NOTES} secondLang={true} />);

    expect(within(section("General note")).getByText("Definition v3")).toBeInTheDocument();
  });
});
