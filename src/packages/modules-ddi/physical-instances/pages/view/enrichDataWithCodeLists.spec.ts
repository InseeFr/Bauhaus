import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { enrichDataWithCodeLists } from "./enrichDataWithCodeLists";
import { DDIApi } from "../../../../sdk";

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    getMutualizedCodesList: vi.fn(),
  },
}));

const newQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const codeVariable = (codeListId: string, agency = "fr.insee") => ({
  $type: "Variable",
  ID: `var-${codeListId}`,
  VariableRepresentation: {
    CodeRepresentation: {
      CodeListReference: { Agency: agency, ID: codeListId, Version: "1" },
    },
  },
});

describe("enrichDataWithCodeLists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("injects the CodeList and Category referenced by code variables into the data", async () => {
    vi.mocked(DDIApi.getMutualizedCodesList).mockResolvedValue({
      CodeList: [
        {
          Agency: "fr.insee",
          ID: "cl-1",
          Code: [{ ID: "c-1", CategoryReference: { ID: "cat-1" } }],
        },
      ],
      Category: [{ ID: "cat-1", Label: [{ "@language": "fr-FR", "@value": "A" }] }],
    } as any);

    const data = {
      Variable: [codeVariable("cl-1")],
    } as any;

    const result = await enrichDataWithCodeLists(newQueryClient(), data);

    expect(DDIApi.getMutualizedCodesList).toHaveBeenCalledWith("fr.insee", "cl-1");
    expect(result.CodeList?.map((cl: any) => cl.ID)).toEqual(["cl-1"]);
    expect(result.Category?.map((c: any) => c.ID)).toEqual(["cat-1"]);
  });

  it("returns the data unchanged and calls no API when there is no code variable", async () => {
    const data = {
      Variable: [{ $type: "Variable", ID: "v1", VariableRepresentation: {} }],
    } as any;

    const result = await enrichDataWithCodeLists(newQueryClient(), data);

    expect(result).toBe(data);
    expect(DDIApi.getMutualizedCodesList).not.toHaveBeenCalled();
  });

  it("deduplicates a CodeList referenced by several variables", async () => {
    vi.mocked(DDIApi.getMutualizedCodesList).mockResolvedValue({
      CodeList: [{ Agency: "fr.insee", ID: "cl-1", Code: [] }],
      Category: [],
    } as any);

    const data = {
      Variable: [codeVariable("cl-1"), codeVariable("cl-1")],
    } as any;

    const result = await enrichDataWithCodeLists(newQueryClient(), data);

    expect(result.CodeList).toHaveLength(1);
  });
});
