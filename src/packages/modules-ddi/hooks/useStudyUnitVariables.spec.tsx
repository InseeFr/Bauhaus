import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { expectIdleQuery, renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { useStudyUnitVariables, useStudyUnitVariableUsages } from "./useStudyUnitVariables";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getStudyUnitVariables: vi.fn(),
    getStudyUnitVariableUsages: vi.fn(),
  },
}));

describe("useStudyUnitVariables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the Variable items of the study unit variable scheme", async () => {
    const sexe = { $type: "Variable", Agency: "fr.insee", ID: "var-1", Version: "2" };
    vi.mocked(DDIApi.getStudyUnitVariables).mockResolvedValue({ items: [sexe] });

    const { result } = await renderQueryHookUntil(
      () => useStudyUnitVariables("fr.insee", "su-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual([sexe]);
    expect(DDIApi.getStudyUnitVariables).toHaveBeenCalledWith("fr.insee", "su-1");
  });

  it("should not fetch anything while the study unit is unknown", () => {
    const { result } = renderQueryHook(() => useStudyUnitVariables("", ""));

    expectIdleQuery(result.current, DDIApi.getStudyUnitVariables);
  });

  it("should not fetch anything until it is enabled", () => {
    const { result } = renderQueryHook(() => useStudyUnitVariables("fr.insee", "su-1", false));

    expectIdleQuery(result.current, DDIApi.getStudyUnitVariables);
  });
});

describe("useStudyUnitVariableUsages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the variables used by each physical instance of the study unit", async () => {
    const usages = [
      {
        studyUnitAgencyId: "fr.insee",
        studyUnitId: "su-1",
        studyUnitLabel: null,
        physicalInstanceAgencyId: "fr.insee",
        physicalInstanceId: "pi-1",
        physicalInstanceLabel: "Fichier 2024",
        variableAgencyId: "fr.insee",
        variableId: "var-1",
        variableLabel: "Sexe",
      },
    ];
    vi.mocked(DDIApi.getStudyUnitVariableUsages).mockResolvedValue(usages);

    const { result } = await renderQueryHookUntil(
      () => useStudyUnitVariableUsages("fr.insee", "su-1"),
      "isSuccess",
    );

    expect(result.current.data).toEqual(usages);
    expect(DDIApi.getStudyUnitVariableUsages).toHaveBeenCalledWith("fr.insee", "su-1");
  });

  it("should not fetch anything while the study unit is unknown", () => {
    const { result } = renderQueryHook(() => useStudyUnitVariableUsages("", ""));

    expectIdleQuery(result.current, DDIApi.getStudyUnitVariableUsages);
  });
});
