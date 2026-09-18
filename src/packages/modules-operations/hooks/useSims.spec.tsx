import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { createQueryWrapper } from "./queryClientWrapper.testing";
import { useSims, useSaveSims, usePublishSims } from "./useSims";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getSims: vi.fn(),
    getOperation: vi.fn(),
    getSerie: vi.fn(),
    getIndicatorById: vi.fn(),
    getOperationsWithoutReport: vi.fn(),
    postSims: vi.fn(),
    putSims: vi.fn(),
    publishSims: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { lng?: string }) =>
      options?.lng === "fr" ? "Documentation " : "Documentation EN ",
  }),
}));

const renderLoadedSims = async (id: string) => {
  const { wrapper } = createQueryWrapper();
  const { result } = renderHook(() => useSims(id), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  return result;
};

// Lance la mutation et attend son succès ; le queryClient est exposé pour les espions.
const runMutation = async <T,>(
  useMutationHook: () => { mutate: (input: T) => void; isSuccess: boolean; data?: unknown },
  input: T,
  wrapperAndClient = createQueryWrapper(),
) => {
  const { result } = renderHook(() => useMutationHook(), { wrapper: wrapperAndClient.wrapper });
  result.current.mutate(input);
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  return result;
};

describe("useSims", () => {
  it("ne requête rien tant qu'aucun identifiant n'est fourni", () => {
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useSims(undefined), { wrapper });

    expect(OperationsApi.getSims).not.toHaveBeenCalled();
    expect(result.current.sims).toBeUndefined();
  });

  it("indexe les rubriques par identifiant d'attribut", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({
      id: "1500",
      rubrics: [
        { idAttribute: "I.1", value: "un" },
        { idAttribute: "I.2", value: "deux" },
      ],
    });

    const result = await renderLoadedSims("1500");

    expect(result.current.sims.rubrics).toEqual({
      "I.1": { idAttribute: "I.1", idMas: "I.1", value: "un" },
      "I.2": { idAttribute: "I.2", idMas: "I.2", value: "deux" },
    });
  });

  it("accepte un SIMS sans rubrique", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500" });

    const result = await renderLoadedSims("1500");

    expect(result.current.sims.rubrics).toEqual({});
  });

  it("remonte les opérations sœurs sans documentation quand le SIMS porte sur une opération", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500", idOperation: "o1" });
    vi.mocked(OperationsApi.getOperation).mockResolvedValue({ series: { id: "s1" } });
    vi.mocked(OperationsApi.getOperationsWithoutReport).mockResolvedValue([{ id: "o2" }]);

    const result = await renderLoadedSims("1500");

    expect(OperationsApi.getOperationsWithoutReport).toHaveBeenCalledWith("s1");
    expect(result.current.sims.parentsWithoutSims).toEqual([{ id: "o2" }]);
  });

  it("ne cherche pas d'opération sœur quand le SIMS ne porte pas sur une opération", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500", idSeries: "s1" });

    const result = await renderLoadedSims("1500");

    expect(OperationsApi.getOperationsWithoutReport).not.toHaveBeenCalled();
    expect(result.current.sims.parentsWithoutSims).toEqual([]);
  });
});

describe("useSaveSims", () => {
  it("crée le SIMS quand il n'a pas encore d'identifiant", async () => {
    vi.mocked(OperationsApi.postSims).mockResolvedValue("1500");

    const result = await runMutation(useSaveSims, { labelLg1: "un", labelLg2: "one" });

    expect(OperationsApi.postSims).toHaveBeenCalledWith({ labelLg1: "un", labelLg2: "one" });
    expect(result.current.data).toBe("1500");
  });

  it("met à jour le SIMS quand il a déjà un identifiant", async () => {
    vi.mocked(OperationsApi.putSims).mockResolvedValue(undefined);

    const result = await runMutation(useSaveSims, { id: "1500", labelLg1: "un", labelLg2: "one" });

    expect(OperationsApi.putSims).toHaveBeenCalled();
    expect(result.current.data).toBe("1500");
  });

  it.each([
    ["idOperation", "getOperation"],
    ["idSeries", "getSerie"],
    ["idIndicator", "getIndicatorById"],
  ] as const)("compose les libellés depuis le parent désigné par %s", async (idKey, apiMethod) => {
    vi.mocked(OperationsApi[apiMethod]).mockResolvedValue({
      prefLabelLg1: "Recensement",
      prefLabelLg2: "Census",
    });
    vi.mocked(OperationsApi.postSims).mockResolvedValue("1500");

    await runMutation(useSaveSims, { [idKey]: "p1" });

    expect(OperationsApi[apiMethod]).toHaveBeenCalledWith("p1");
    expect(OperationsApi.postSims).toHaveBeenCalledWith(
      expect.objectContaining({
        labelLg1: "Documentation Recensement",
        labelLg2: "Documentation EN Census",
      }),
    );
  });

  it("laisse le SIMS inchangé quand aucun parent n'est renseigné", async () => {
    vi.mocked(OperationsApi.postSims).mockResolvedValue("1500");

    await runMutation(useSaveSims, { rubrics: [] });

    expect(OperationsApi.postSims).toHaveBeenCalledWith({ rubrics: [] });
  });

  it("invalide le cache du SIMS enregistré", async () => {
    vi.mocked(OperationsApi.putSims).mockResolvedValue("1500");
    const wrapperAndClient = createQueryWrapper();
    using invalidate = vi.spyOn(wrapperAndClient.queryClient, "invalidateQueries");

    await runMutation(useSaveSims, { id: "1500", labelLg1: "un" }, wrapperAndClient);

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["sims", "1500"] });
  });
});

describe("usePublishSims", () => {
  it("publie le SIMS et invalide son cache", async () => {
    vi.mocked(OperationsApi.publishSims).mockResolvedValue("1500");
    const wrapperAndClient = createQueryWrapper();
    using invalidate = vi.spyOn(wrapperAndClient.queryClient, "invalidateQueries");

    await runMutation(usePublishSims, { id: "1500" }, wrapperAndClient);

    expect(OperationsApi.publishSims).toHaveBeenCalledWith({ id: "1500" });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["sims", "1500"] });
  });
});
