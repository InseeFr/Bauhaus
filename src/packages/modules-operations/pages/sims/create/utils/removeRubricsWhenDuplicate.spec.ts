import { Rubric } from "../../../../../model/Sims";
import { CREATE, DUPLICATE } from "../../constants";
import { removeRubricsWhenDuplicate } from "./removeRubricsWhenDuplicate";

describe("removeRubricsWhenDuplicate", () => {
  it("should remove rubrics in the blacklist when mode is DUPLICATE", () => {
    const rubrics = {
      "I.6.4": { labelLg1: "Text 1", labelLg2: "Text 2", rangeType: "PLAIN" },
      "A.1.1": { labelLg1: "Other 1", labelLg2: "Other 2", rangeType: "PLAIN" },
    } as unknown as Record<string, Rubric>;
    const result = removeRubricsWhenDuplicate(DUPLICATE, rubrics);
    expect(result).toEqual({
      "A.1.1": { labelLg1: "Other 1", labelLg2: "Other 2", rangeType: "PLAIN" },
    });
  });

  it("should keep all rubrics when mode is not DUPLICATE", () => {
    const rubrics = {
      "I.6.4": { labelLg1: "Text 1", labelLg2: "Text 2", rangeType: "PLAIN" },
      "A.1.1": { labelLg1: "Other 1", labelLg2: "Other 2", rangeType: "PLAIN" },
    } as unknown as Record<string, Rubric>;
    const result = removeRubricsWhenDuplicate(CREATE, rubrics);
    expect(result).toEqual(rubrics);
  });

  it("should keep rich text labels unchanged", () => {
    const rubrics = {
      "A.1.1": {
        labelLg1: "Rich Text 1",
        labelLg2: "Rich Text 2",
        rangeType: "RICH_TEXT",
      },
    } as unknown as Record<string, Rubric>;
    const result = removeRubricsWhenDuplicate(CREATE, rubrics);
    expect(result).toEqual({
      "A.1.1": {
        labelLg1: "Rich Text 1",
        labelLg2: "Rich Text 2",
        rangeType: "RICH_TEXT",
      },
    });
  });

  it("should handle an empty rubrics object gracefully", () => {
    const result = removeRubricsWhenDuplicate(DUPLICATE, {});
    expect(result).toEqual({});
  });

  it("should handle undefined rubrics gracefully", () => {
    const result = removeRubricsWhenDuplicate(DUPLICATE);
    expect(result).toEqual({});
  });
});
