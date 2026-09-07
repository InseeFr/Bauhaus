import { describe, expect, it } from "vitest";

import { cx } from "./cx";

describe("cx", () => {
  it("assemble les classes fournies", () => {
    expect(cx("list-group", "documentsbloc")).toBe("list-group documentsbloc");
  });

  it("ignore les valeurs absentes plutôt que de produire des espaces parasites", () => {
    expect(cx("row", undefined)).toBe("row");
    expect(cx(undefined, "row")).toBe("row");
    expect(cx(undefined, null, "")).toBe("");
  });

  it("ignore les branches désactivées d'une condition", () => {
    const required = false;
    expect(cx("w-100", required && "label-required")).toBe("w-100");
  });

  it("garde les branches actives d'une condition", () => {
    const required = true;
    expect(cx("w-100", required && "label-required")).toBe("w-100 label-required");
  });

  it("retourne une chaîne vide quand rien n'est fourni", () => {
    expect(cx()).toBe("");
  });
});
