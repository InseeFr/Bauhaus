import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { useCodesLists } from "./useCodesLists";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodesList: vi.fn(),
    getCodesListCodes: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const makeNode = (idMas: string, codeList: string | undefined, children = {}) => ({
  idMas,
  codeList,
  rangeType: codeList ? "CODE_LIST" : "TEXT",
  children,
});

describe("useCodesLists", () => {
  it("fetches every code list referenced by metadataStructure, traversing children", async () => {
    vi.mocked(CodelistsApi.getCodesList).mockImplementation((notation: string) =>
      Promise.resolve({ notation, codeListLabelLg1: `label ${notation}` }),
    );
    vi.mocked(CodelistsApi.getCodesListCodes).mockResolvedValue({
      items: [{ code: "c1", labelLg1: "Code 1", labelLg2: "Code 1 EN" }],
    });

    const metadataStructure = {
      ROOT_A: makeNode("ROOT_A", "CL_FOO", {
        CHILD_A1: makeNode("CHILD_A1", "CL_BAR"),
      }),
      ROOT_B: makeNode("ROOT_B", undefined, {
        CHILD_B1: makeNode("CHILD_B1", "CL_BAZ"),
      }),
    };

    const { result } = renderHook(() => useCodesLists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const notationsFetched = vi
      .mocked(CodelistsApi.getCodesList)
      .mock.calls.map(([n]) => n)
      .sort();
    expect(notationsFetched).toEqual(["CL_BAR", "CL_BAZ", "CL_FOO"]);

    expect(result.current.codesLists).toMatchObject({
      CL_FOO: { notation: "CL_FOO", codes: expect.any(Array) },
      CL_BAR: { notation: "CL_BAR", codes: expect.any(Array) },
      CL_BAZ: { notation: "CL_BAZ", codes: expect.any(Array) },
    });
  });

  it("does not duplicate fetches when the same code list is referenced twice", async () => {
    vi.mocked(CodelistsApi.getCodesList).mockImplementation((notation: string) =>
      Promise.resolve({ notation }),
    );
    vi.mocked(CodelistsApi.getCodesListCodes).mockResolvedValue({ items: [] });

    const metadataStructure = {
      A: makeNode("A", "CL_FOO", {
        B: makeNode("B", "CL_FOO"),
      }),
    };

    const { result } = renderHook(() => useCodesLists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const fooCalls = vi
      .mocked(CodelistsApi.getCodesList)
      .mock.calls.filter(([n]) => n === "CL_FOO");
    expect(fooCalls).toHaveLength(1);
  });

  it("returns an empty codesLists object when metadataStructure has no code list", async () => {
    const metadataStructure = {
      ROOT: makeNode("ROOT", undefined),
    };

    const { result } = renderHook(() => useCodesLists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(vi.mocked(CodelistsApi.getCodesList)).not.toHaveBeenCalled();
    expect(result.current.codesLists).toEqual({});
  });
});
