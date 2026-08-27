import { Dataset } from "../../../../model/Dataset";
import { buildDuplicatedDataset } from "./buildDuplicatedDataset";

const dataset = {
  id: "jd1000",
  altIdentifier: "ALT-1000",
  validationState: "Validated",
  labelLg1: "Recensement",
  labelLg2: "Census",
  issued: "2024-01-01",
  updated: "2024-06-01",
  themes: ["http://theme/1"],
  catalogRecord: {
    creator: "INSEE",
    contributor: ["DG75-L001"],
    created: "2024-01-01T10:00:00",
    updated: "2024-06-01T10:00:00",
  },
} as unknown as Dataset;

describe("buildDuplicatedDataset", () => {
  it("copies the descriptive fields of the source dataset", () => {
    const duplicated = buildDuplicatedDataset(dataset);

    expect(duplicated.labelLg1).toBe("Recensement");
    expect(duplicated.labelLg2).toBe("Census");
    expect(duplicated.issued).toBe("2024-01-01");
    expect(duplicated.updated).toBe("2024-06-01");
    expect(duplicated.themes).toEqual(["http://theme/1"]);
  });

  it("drops the identity and the publication state of the source dataset", () => {
    const duplicated = buildDuplicatedDataset(dataset);

    expect(duplicated).not.toHaveProperty("id");
    expect(duplicated).not.toHaveProperty("altIdentifier");
    expect(duplicated).not.toHaveProperty("validationState");
  });

  it("keeps the stamps of the catalog record but drops its dates", () => {
    const duplicated = buildDuplicatedDataset(dataset);

    expect(duplicated.catalogRecord).toEqual({
      creator: "INSEE",
      contributor: ["DG75-L001"],
    });
  });

  it("does not fail when the source dataset has no catalog record", () => {
    const duplicated = buildDuplicatedDataset({} as unknown as Dataset);

    expect(duplicated.catalogRecord).toEqual({
      creator: undefined,
      contributor: undefined,
    });
  });
});
