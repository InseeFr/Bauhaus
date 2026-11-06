import { beforeEach, describe, expect, it, vi } from "vitest";

import { DDIApi } from "@sdk/index";

import { createQueryClient } from "../../application/query-client";
import { mountAgainLongAfter } from "../../tests/query-freshness.testing";
import { loadCodeListForVariable } from "../physical-instances/pages/view/loadCodeListForVariable";
import { envelope } from "../physical-instances/types/ddi4Items.testing";
import { useMutualizedCodeList } from "./useMutualizedCodeList";
import { useMutualizedCodeListCodes } from "./useMutualizedCodeListCodes";
import { useMutualizedCodeLists } from "./useMutualizedCodeLists";
import { usePhysicalInstancesData } from "./usePhysicalInstance";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstance: vi.fn(),
    getMutualizedCodeList: vi.fn(),
    getMutualizedCodeListCodes: vi.fn(),
    getMutualizedCodeLists: vi.fn(),
  },
}));

/**
 * Lectures lourdes de Colectica (jusqu'à 31 Mo pour une liste, plusieurs secondes pour une PI) : en
 * cache jusqu'à leur éviction explicite après une sauvegarde, jamais périmées d'elles-mêmes.
 */
describe("heavy DDI reads", () => {
  beforeEach(() => {
    vi.mocked(DDIApi.getPhysicalInstance).mockResolvedValue(envelope({}) as any);
    vi.mocked(DDIApi.getMutualizedCodeList).mockResolvedValue(
      envelope({ CodeList: [{ $type: "CodeList", Agency: "fr.insee", ID: "cl-1" }] } as any) as any,
    );
    vi.mocked(DDIApi.getMutualizedCodeListCodes).mockResolvedValue({} as any);
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue([]);
    vi.clearAllMocks();
  });

  it("reads a physical instance once", async () => {
    await mountAgainLongAfter(() => usePhysicalInstancesData("fr.insee", "pi-1"));

    expect(DDIApi.getPhysicalInstance).toHaveBeenCalledTimes(1);
  });

  it("reads a reused code list once", async () => {
    await mountAgainLongAfter(() => useMutualizedCodeList("fr.insee", "cl-1"));

    expect(DDIApi.getMutualizedCodeList).toHaveBeenCalledTimes(1);
  });

  it("reads the light view of a mutualized code list once", async () => {
    await mountAgainLongAfter(() => useMutualizedCodeListCodes("fr.insee", "cl-1"));

    expect(DDIApi.getMutualizedCodeListCodes).toHaveBeenCalledTimes(1);
  });

  it("reads the catalog of mutualized code lists once", async () => {
    await mountAgainLongAfter(() => useMutualizedCodeLists());

    expect(DDIApi.getMutualizedCodeLists).toHaveBeenCalledTimes(1);
  });

  it("reads the code list of a variable once, however late the variable is opened again", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      const queryClient = createQueryClient();
      const codeRepresentation = { CodeListReference: { Agency: "fr.insee", ID: "cl-1" } } as any;

      await loadCodeListForVariable(queryClient, codeRepresentation, { skipMutualized: true });
      vi.setSystemTime(Date.now() + 10 * 60_000);
      await loadCodeListForVariable(queryClient, codeRepresentation, { skipMutualized: true });

      expect(DDIApi.getMutualizedCodeList).toHaveBeenCalledTimes(1);
      expect(DDIApi.getMutualizedCodeLists).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
