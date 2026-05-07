import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

import * as utils from "../../utils";
import { generateSimsBeforeSubmit } from "./index";

vi.mock("../../utils", () => ({
  getParentIdName: vi.fn(),
}));

describe("generateSimsBeforeSubmit", () => {
  it("should generate the correct payload for CREATE mode", () => {
    (utils.getParentIdName as Mock).mockReturnValue("parentId");

    const result = generateSimsBeforeSubmit(
      {
        id: "123",
        labelLg1: "Label 1",
        labelLg2: "Label 2",
        created: "2023-01-01",
      },
      "operation",
      "parent123",
      { rubric1: "value1" },
    );

    expect(result).toEqual({
      id: "123",
      labelLg1: "Label 1",
      labelLg2: "Label 2",
      parentId: "parent123",
      created: "2023-01-01",
      rubrics: { rubric1: "value1" },
    });
  });

  it("should use the correct parent ID name based on parent type", () => {
    (utils.getParentIdName as Mock).mockReturnValue("idOperation");

    const result = generateSimsBeforeSubmit(
      {
        id: "123",
        labelLg1: "Label 1",
        labelLg2: "Label 2",
        created: "2023-01-01",
      },
      "indicator",
      "parent789",
      { rubric3: "value3" },
    );

    expect(result.idOperation).toBe("parent789");
    expect(utils.getParentIdName).toHaveBeenCalledWith("indicator");
  });

  describe("auto-updated date rubrics", () => {
    const DCTERMS_MODIFIED = "http://purl.org/dc/terms/modified";

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-05-07T10:00:00.000Z"));
      (utils.getParentIdName as Mock).mockReturnValue("parentId");
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("injects today's date into rubrics flagged with subPropertyOf=dcterms:modified", () => {
      const metadataStructure = {
        S2: {
          idMas: "S2",
          children: {
            "S.2.3": {
              idMas: "S.2.3",
              subPropertyOf: DCTERMS_MODIFIED,
              children: {},
            },
            "S.2.4": {
              idMas: "S.2.4",
              children: {},
            },
          },
        },
      };
      const rubrics = [
        { idAttribute: "S.2.3", value: "2020-01-01T00:00:00.000Z" },
        { idAttribute: "S.2.4", value: "manual" },
      ];

      const result = generateSimsBeforeSubmit(
        { id: "1", labelLg1: "L1", labelLg2: "L2", created: "2023-01-01" },
        "operation",
        "parent",
        rubrics,
        metadataStructure,
      );

      const updated = result.rubrics.find((r) => r.idAttribute === "S.2.3");
      expect(updated.value).toBe("2026-05-07T10:00:00.000Z");

      const untouched = result.rubrics.find((r) => r.idAttribute === "S.2.4");
      expect(untouched.value).toBe("manual");
    });

    it("does nothing when no rubric is flagged", () => {
      const metadataStructure = {
        S1: { idMas: "S1", children: {} },
      };
      const rubrics = [{ idAttribute: "S1", value: "kept" }];

      const result = generateSimsBeforeSubmit(
        { id: "1", labelLg1: "L1", labelLg2: "L2", created: "2023-01-01" },
        "operation",
        "parent",
        rubrics,
        metadataStructure,
      );

      expect(result.rubrics[0].value).toBe("kept");
    });
  });
});
