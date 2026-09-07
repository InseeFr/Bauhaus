import { BROADER, CLOSE_MATCH, NARROWER } from "@sdk/constants";

import { resolveConceptSection } from "./conceptSection";

describe("resolveConceptSection", () => {
  it("ouvre les informations générales par défaut", () => {
    expect(resolveConceptSection(undefined)).toEqual({
      section: "general",
      note: "conceptsScopeNote",
      linkType: NARROWER,
    });
  });

  it("ouvre la section demandée", () => {
    expect(resolveConceptSection("links").section).toBe("links");
    expect(resolveConceptSection("notes").section).toBe("notes");
  });

  it("ouvre la première note quand seule la section des notes est demandée", () => {
    expect(resolveConceptSection("notes").note).toBe("conceptsScopeNote");
  });

  it("ouvre le premier type quand seule la section des liens est demandée", () => {
    expect(resolveConceptSection("links").linkType).toBe(NARROWER);
  });

  it("ouvre la note demandée, dans sa section", () => {
    expect(resolveConceptSection("conceptsEditorialNote")).toEqual({
      section: "notes",
      note: "conceptsEditorialNote",
      linkType: NARROWER,
    });
  });

  it("ouvre le type de lien demandé, dans sa section", () => {
    expect(resolveConceptSection(BROADER)).toEqual({
      section: "links",
      note: "conceptsScopeNote",
      linkType: BROADER,
    });
  });

  it("ouvre les correspondances externes comme un type de lien", () => {
    expect(resolveConceptSection(CLOSE_MATCH)).toEqual({
      section: "links",
      note: "conceptsScopeNote",
      linkType: CLOSE_MATCH,
    });
  });

  it("retombe sur les informations générales quand la clé est inconnue", () => {
    expect(resolveConceptSection("inexistante").section).toBe("general");
  });
});
