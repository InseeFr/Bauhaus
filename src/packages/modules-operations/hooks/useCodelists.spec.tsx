import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { useCodelists } from "./useCodelists";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelist: vi.fn(),
    getCodelistCodes: vi.fn(),
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

describe("useCodelists", () => {
  it("fetches every code list referenced by metadataStructure, traversing children", async () => {
    vi.mocked(CodelistsApi.getCodelist).mockImplementation((notation: string) =>
      Promise.resolve({ notation, codeListLabelLg1: `label ${notation}` }),
    );
    vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue({
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

    const { result } = renderHook(() => useCodelists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const notationsFetched = vi
      .mocked(CodelistsApi.getCodelist)
      .mock.calls.map(([n]: [string]) => n)
      .sort();
    expect(notationsFetched).toEqual(["CL_BAR", "CL_BAZ", "CL_FOO"]);

    expect(result.current.codelists).toMatchObject({
      CL_FOO: { notation: "CL_FOO", codes: expect.any(Array) },
      CL_BAR: { notation: "CL_BAR", codes: expect.any(Array) },
      CL_BAZ: { notation: "CL_BAZ", codes: expect.any(Array) },
    });
  });

  it("does not duplicate fetches when the same code list is referenced twice", async () => {
    vi.mocked(CodelistsApi.getCodelist).mockImplementation((notation: string) =>
      Promise.resolve({ notation }),
    );
    vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue({ items: [] });

    const metadataStructure = {
      A: makeNode("A", "CL_FOO", {
        B: makeNode("B", "CL_FOO"),
      }),
    };

    const { result } = renderHook(() => useCodelists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const fooCalls = vi
      .mocked(CodelistsApi.getCodelist)
      .mock.calls.filter(([n]: [string]) => n === "CL_FOO");
    expect(fooCalls).toHaveLength(1);
  });

  it("returns an empty codelist object when metadataStructure has no code list", async () => {
    const metadataStructure = {
      ROOT: makeNode("ROOT", undefined),
    };

    const { result } = renderHook(() => useCodelists(metadataStructure), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(vi.mocked(CodelistsApi.getCodelist)).not.toHaveBeenCalled();
    expect(result.current.codelists).toEqual({});
  });
});
