import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { loadCodeListForVariable } from "./loadCodeListForVariable";
import { DDIApi } from "../../../../sdk";

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    getMutualizedCodesList: vi.fn(),
  },
}));

const newQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe("loadCodeListForVariable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the CodeList by its CodeListReference and returns matching codeList + categories", async () => {
    vi.mocked(DDIApi.getMutualizedCodesList).mockResolvedValue({
      CodeList: [
        {
          Agency: "fr.insee",
          ID: "cl-1",
          Label: [{ "@language": "fr-FR", "@value": "Ma CL" }],
          Code: [
            { ID: "c-1", CategoryReference: { ID: "cat-1" } },
            { ID: "c-2", CategoryReference: { ID: "cat-2" } },
          ],
        },
      ],
      Category: [
        { ID: "cat-1", Label: [{ "@language": "fr-FR", "@value": "A" }] },
        { ID: "cat-2", Label: [{ "@language": "fr-FR", "@value": "B" }] },
        { ID: "cat-orphan", Label: [{ "@language": "fr-FR", "@value": "Orph" }] },
      ],
    } as any);

    const result = await loadCodeListForVariable(newQueryClient(), {
      CodeListReference: { Agency: "fr.insee", ID: "cl-1", Version: "1" },
    } as any);

    expect(DDIApi.getMutualizedCodesList).toHaveBeenCalledWith("fr.insee", "cl-1");
    expect(result.codeList?.ID).toBe("cl-1");
    const catIds = (result.categories ?? []).map((c) => c.ID).sort();
    expect(catIds).toEqual(["cat-1", "cat-2"]);
  });

  it("returns an empty result and does not call the API when the reference lacks Agency or ID", async () => {
    const result = await loadCodeListForVariable(newQueryClient(), {
      CodeListReference: {},
    } as any);

    expect(result).toEqual({});
    expect(DDIApi.getMutualizedCodesList).not.toHaveBeenCalled();
  });
});
