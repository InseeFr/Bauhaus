import { buildData } from "./summary";
import { ConceptForAdvancedSearch } from "../../../../../types/concept";

const makeConcept = (
  overrides: Partial<ConceptForAdvancedSearch> = {},
): ConceptForAdvancedSearch => ({
  id: "1",
  label: "Concept",
  created: "",
  modified: "",
  disseminationStatus: "http://id.insee.fr/interop/niveauDeDiffusion/PublicGenerique",
  validationStatus: "true",
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

  it("counts provisional concepts (validationStatus false)", () => {
    const concepts = [
      makeConcept({ validationStatus: "false" }),
      makeConcept({ id: "2", validationStatus: "true" }),
    ];
    const rows = buildData(concepts);
    expect(rows[2].total).toBe(1);
  });

  it("counts valid-date concepts when valid is set", () => {
    const concepts = [makeConcept({ valid: "2025-01-01" }), makeConcept({ id: "2", valid: null })];
    const rows = buildData(concepts);
    expect(rows[3].total).toBe(1);
  });
});
