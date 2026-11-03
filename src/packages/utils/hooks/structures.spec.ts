import { QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";

import { StructureApi } from "@sdk/structure-api";

import { STRUCTURES_KEY, structuresQuery } from "./structures";

vi.mock("@sdk/structure-api", () => ({ StructureApi: { getStructures: vi.fn() } }));

describe("structuresQuery", () => {
  it("reads the structures list", async () => {
    vi.mocked(StructureApi.getStructures).mockResolvedValue([{ id: "dsd1" }]);

    expect(await new QueryClient().fetchQuery(structuresQuery())).toEqual([{ id: "dsd1" }]);
  });

  it("is stored under the prefix shared by every structures read", () => {
    expect(structuresQuery().queryKey).toEqual(STRUCTURES_KEY);
  });
});
