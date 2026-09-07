import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

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

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const createWrapper = (queryClient = createQueryClient()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe("useSims", () => {
  it("ne requête rien tant qu'aucun identifiant n'est fourni", () => {
    const { wrapper } = createWrapper();

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
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSims("1500"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.sims.rubrics).toEqual({
      "I.1": { idAttribute: "I.1", idMas: "I.1", value: "un" },
      "I.2": { idAttribute: "I.2", idMas: "I.2", value: "deux" },
    });
  });

  it("accepte un SIMS sans rubrique", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500" });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSims("1500"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.sims.rubrics).toEqual({});
  });

  it("remonte les opérations sœurs sans documentation quand le SIMS porte sur une opération", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500", idOperation: "o1" });
    vi.mocked(OperationsApi.getOperation).mockResolvedValue({ series: { id: "s1" } });
    vi.mocked(OperationsApi.getOperationsWithoutReport).mockResolvedValue([{ id: "o2" }]);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSims("1500"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(OperationsApi.getOperationsWithoutReport).toHaveBeenCalledWith("s1");
    expect(result.current.sims.parentsWithoutSims).toEqual([{ id: "o2" }]);
  });

  it("ne cherche pas d'opération sœur quand le SIMS ne porte pas sur une opération", async () => {
    vi.mocked(OperationsApi.getSims).mockResolvedValue({ id: "1500", idSeries: "s1" });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSims("1500"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(OperationsApi.getOperationsWithoutReport).not.toHaveBeenCalled();
    expect(result.current.sims.parentsWithoutSims).toEqual([]);
  });
});

describe("useSaveSims", () => {
  it("crée le SIMS quand il n'a pas encore d'identifiant", async () => {
    vi.mocked(OperationsApi.postSims).mockResolvedValue("1500");
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSaveSims(), { wrapper });
    result.current.mutate({ labelLg1: "un", labelLg2: "one" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(OperationsApi.postSims).toHaveBeenCalledWith({ labelLg1: "un", labelLg2: "one" });
    expect(result.current.data).toBe("1500");
  });

  it("met à jour le SIMS quand il a déjà un identifiant", async () => {
    vi.mocked(OperationsApi.putSims).mockResolvedValue(undefined);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSaveSims(), { wrapper });
    result.current.mutate({ id: "1500", labelLg1: "un", labelLg2: "one" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSaveSims(), { wrapper });
    result.current.mutate({ [idKey]: "p1" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSaveSims(), { wrapper });
    result.current.mutate({ rubrics: [] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(OperationsApi.postSims).toHaveBeenCalledWith({ rubrics: [] });
  });

  it("invalide le cache du SIMS enregistré", async () => {
    vi.mocked(OperationsApi.putSims).mockResolvedValue("1500");
    const { wrapper, queryClient } = createWrapper();
    using invalidate = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSaveSims(), { wrapper });
    result.current.mutate({ id: "1500", labelLg1: "un" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["sims", "1500"] });
  });
});

describe("usePublishSims", () => {
  it("publie le SIMS et invalide son cache", async () => {
    vi.mocked(OperationsApi.publishSims).mockResolvedValue("1500");
    const { wrapper, queryClient } = createWrapper();
    using invalidate = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishSims(), { wrapper });
    result.current.mutate({ id: "1500" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(OperationsApi.publishSims).toHaveBeenCalledWith({ id: "1500" });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["sims", "1500"] });
  });
});
