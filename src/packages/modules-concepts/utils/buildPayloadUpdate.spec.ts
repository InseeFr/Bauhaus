import { describe, expect, it } from "vitest";

import { CLOSE_MATCH, NARROWER, VERSIONING } from "@sdk/constants";

import { buildPayloadUpdate } from "./buildPayloadUpdate";

const general = {
  id: "c1",
  prefLabelLg1: "Chômage",
  prefLabelLg2: "Unemployment",
  creator: "DG75-A040",
  contributor: "DG75-A040",
  disseminationStatus: "public",
  // Champ hors liste blanche : il ne doit pas partir au serveur.
  unwanted: "à jeter",
} as any;

const notes = { definitionLg1: "Définition", scopeNoteLg1: "Portée" } as any;

const build = (overrides: any = {}) =>
  buildPayloadUpdate(
    overrides.versioning ?? "NO_VERSIONING",
    { notes: overrides.oldNotes ?? notes },
    {
      general,
      notes,
      conceptsWithLinks: overrides.conceptsWithLinks ?? [],
      equivalentLinks: overrides.equivalentLinks,
    },
  );

describe("buildPayloadUpdate", () => {
  it("ne retient du général que les champs de la liste blanche", () => {
    const payload = build() as any;

    expect(payload.prefLabelLg1).toBe("Chômage");
    expect(payload.creator).toBe("DG75-A040");
    expect(payload).not.toHaveProperty("unwanted");
    expect(payload).not.toHaveProperty("id");
  });

  it("traduit le versionnement en booléen", () => {
    expect((build({ versioning: VERSIONING }) as any).versioning).toBe(true);
    expect((build() as any).versioning).toBe(false);
  });

  it("regroupe les concepts liés par type de lien", () => {
    const payload = build({
      conceptsWithLinks: [
        { id: "c2", typeOfLink: NARROWER },
        { id: "c3", typeOfLink: NARROWER },
      ],
    }) as any;

    expect(payload.links).toEqual([{ typeOfLink: NARROWER, ids: ["c2", "c3"] }]);
  });

  it("rassemble les liens d'équivalence en une seule entrée closeMatch", () => {
    const payload = build({
      equivalentLinks: [{ urn: "urn:a" }, { urn: "urn:b" }],
    }) as any;

    expect(payload.links).toContainEqual({
      typeOfLink: CLOSE_MATCH,
      urn: ["urn:a", "urn:b"],
    });
  });

  it("n'ajoute aucune entrée closeMatch quand il n'y a pas d'équivalence", () => {
    expect((build({ equivalentLinks: [] }) as any).links).toEqual([]);
    expect((build() as any).links).toEqual([]);
  });

  it("sépare les notes datables des notes versionnables", () => {
    const payload = build() as any;

    expect(payload).toHaveProperty("datableNotes");
    expect(payload).toHaveProperty("versionableNotes");
  });
});
