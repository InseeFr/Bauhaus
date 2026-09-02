import { describe, expect, it } from "vitest";

import { initializeContributorProperty, resolveContributorIri } from "./contributor-init";

describe("initializeContributorProperty", () => {
  it("should initialize contributor with user stamp if isContributor and isCreation are true", () => {
    const result = initializeContributorProperty(true, true, "user123");
    expect(result).toEqual({ contributor: ["user123"] });
  });

  it("should return an empty object if isContributor is false", () => {
    const result = initializeContributorProperty(false, true, "user123");
    expect(result).toEqual({});
  });

  it("should return an empty object if isCreation is false", () => {
    const result = initializeContributorProperty(true, false, "user123");
    expect(result).toEqual({});
  });

  it("should return an empty object if both isContributor and isCreation are false", () => {
    const result = initializeContributorProperty(false, false, "user123");
    expect(result).toEqual({});
  });

  it("should return an empty object when no contributor could be resolved", () => {
    const result = initializeContributorProperty(true, true, undefined);
    expect(result).toEqual({});
  });
});

describe("resolveContributorIri", () => {
  const organizations = [
    { iri: "http://bauhaus/organizations/insee/HIE2001201", id: "HIE2001201", label: "Division" },
    { iri: "http://bauhaus/organizations/insee/HIE2000001", id: "HIE2000001", label: "DG" },
  ];
  const defaultContributor = "http://bauhaus/organizations/insee/HIE2004937";

  it("résout le timbre de l'utilisateur en IRI de son organization", () => {
    const result = resolveContributorIri({
      userStamp: "HIE2001201",
      organizations,
      defaultContributor,
      useUserOrganization: true,
    });

    expect(result).toBe("http://bauhaus/organizations/insee/HIE2001201");
  });

  it("retombe sur le contributeur par défaut quand le timbre est inconnu du référentiel", () => {
    const result = resolveContributorIri({
      userStamp: "DG75-F302",
      organizations,
      defaultContributor,
      useUserOrganization: true,
    });

    expect(result).toBe(defaultContributor);
  });

  it("utilise le contributeur par défaut quand l'objet ne doit pas être rattaché à l'utilisateur", () => {
    const result = resolveContributorIri({
      userStamp: "HIE2001201",
      organizations,
      defaultContributor,
      useUserOrganization: false,
    });

    expect(result).toBe(defaultContributor);
  });

  // Le back écrit dc:contributor avec addTripleUri : une valeur qui n'est pas
  // une IRI absolue le fait échouer (« Not a valid (absolute) IRI »). Mieux
  // vaut ne rien pré-remplir que de pré-remplir une valeur non enregistrable.
  it("ignore un contributeur par défaut mal configuré", () => {
    const result = resolveContributorIri({
      userStamp: "DG75-F302",
      organizations,
      defaultContributor: "DG75-L201",
      useUserOrganization: true,
    });

    expect(result).toBeUndefined();
  });

  it("retourne undefined quand rien n'est résolvable", () => {
    const result = resolveContributorIri({
      userStamp: undefined,
      organizations: [],
      defaultContributor: undefined,
      useUserOrganization: true,
    });

    expect(result).toBeUndefined();
  });
});
