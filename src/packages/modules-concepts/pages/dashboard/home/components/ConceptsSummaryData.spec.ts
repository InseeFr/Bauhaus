import { buildData } from "./ConceptsSummary";
import { MODIFIED, UNPUBLISHED, VALIDATED } from "@model/ValidationState";
import { ConceptForAdvancedSearch } from "../../../../types/concept";

const makeConcept = (
  overrides: Partial<ConceptForAdvancedSearch> = {},
): ConceptForAdvancedSearch => ({
  id: "1",
  label: "Concept",
  created: "",
  modified: "",
  disseminationStatus: "http://id.insee.fr/interop/niveauDeDiffusion/PublicGenerique",
  validationState: VALIDATED,
  definition: "",
  creator: "DG75-L201",
  isTopConceptOf: "false",
  valid: null,
  altLabel: null,
  ...overrides,
});

describe("buildData", () => {
  it("returns 4 rows with zeros for an empty list", () => {
    const rows = buildData([]);
    expect(rows).toHaveLength(4);
    rows.forEach((row) => {
      expect(row.total).toBe(0);
      expect(row.generic).toBe(0);
      expect(row.specific).toBe(0);
      expect(row.private).toBe(0);
    });
  });

  it("counts total concepts correctly", () => {
    const concepts = [makeConcept(), makeConcept({ id: "2" })];
    const [totalRow] = buildData(concepts);
    expect(totalRow.total).toBe(2);
  });

  it("counts generic dissemination status correctly", () => {
    const concepts = [
      makeConcept({ disseminationStatus: "PublicGenerique" }),
      makeConcept({ disseminationStatus: "PublicSpecifique" }),
    ];
    const [totalRow] = buildData(concepts);
    expect(totalRow.generic).toBe(1);
    expect(totalRow.specific).toBe(1);
    expect(totalRow.private).toBe(0);
  });

  it("counts private dissemination status correctly", () => {
    const concepts = [makeConcept({ disseminationStatus: "Prive" })];
    const [totalRow] = buildData(concepts);
    expect(totalRow.private).toBe(1);
  });

  it("counts top concepts correctly", () => {
    const concepts = [
      makeConcept({ isTopConceptOf: "true" }),
      makeConcept({ id: "2", isTopConceptOf: "false" }),
    ];
    const rows = buildData(concepts);
    expect(rows[1].total).toBe(1);
  });

  it("counts provisional concepts (validationState not Validated, incl. Modified)", () => {
    const concepts = [
      makeConcept({ validationState: UNPUBLISHED }),
      makeConcept({ id: "2", validationState: MODIFIED }),
      makeConcept({ id: "3", validationState: VALIDATED }),
    ];
    const rows = buildData(concepts);
    expect(rows[2].total).toBe(2);
  });

  it("counts valid-date concepts when valid is set", () => {
    const concepts = [makeConcept({ valid: "2025-01-01" }), makeConcept({ id: "2", valid: null })];
    const rows = buildData(concepts);
    expect(rows[3].total).toBe(1);
  });
});
