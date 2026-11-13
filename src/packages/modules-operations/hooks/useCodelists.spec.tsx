import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { createQueryWrapper } from "./queryClientWrapper.testing";
import { useCodelists } from "./useCodelists";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelist: vi.fn(),
    getCodelistCodes: vi.fn(),
  },
}));

const makeNode = (idMas: string, codeList: string | undefined, children = {}) => ({
  idMas,
  codeList,
  rangeType: codeList ? "CODE_LIST" : "TEXT",
  children,
});

// Chaque liste renvoie sa propre notation, sans aucun code.
const mockEmptyCodelists = () => {
  vi.mocked(CodelistsApi.getCodelist).mockImplementation((notation: string) =>
    Promise.resolve({ notation }),
  );
  vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue({ items: [] });
};

const renderUseCodelistsUntilLoaded = async (
  metadataStructure: Parameters<typeof useCodelists>[0],
) => {
  const { result } = renderHook(() => useCodelists(metadataStructure), {
    wrapper: createQueryWrapper().wrapper,
  });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  return result;
};

const fetchedNotations = () =>
  vi.mocked(CodelistsApi.getCodelist).mock.calls.map(([n]: [string]) => n);

describe("useCodelists", () => {
  it("fetches every code list referenced by metadataStructure, traversing children", async () => {
    vi.mocked(CodelistsApi.getCodelist).mockImplementation((notation: string) =>
      Promise.resolve({ notation, codeListLabelLg1: `label ${notation}` }),
    );
    vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue({
      items: [{ code: "c1", labelLg1: "Code 1", labelLg2: "Code 1 EN" }],
    });

    const result = await renderUseCodelistsUntilLoaded({
      ROOT_A: makeNode("ROOT_A", "CL_FOO", {
        CHILD_A1: makeNode("CHILD_A1", "CL_BAR"),
      }),
      ROOT_B: makeNode("ROOT_B", undefined, {
        CHILD_B1: makeNode("CHILD_B1", "CL_BAZ"),
      }),
    });

    expect(fetchedNotations().sort()).toEqual(["CL_BAR", "CL_BAZ", "CL_FOO"]);

    expect(result.current.codelists).toMatchObject({
      CL_FOO: { notation: "CL_FOO", codes: expect.any(Array) },
      CL_BAR: { notation: "CL_BAR", codes: expect.any(Array) },
      CL_BAZ: { notation: "CL_BAZ", codes: expect.any(Array) },
    });
  });

  it("does not duplicate fetches when the same code list is referenced twice", async () => {
    mockEmptyCodelists();

    await renderUseCodelistsUntilLoaded({
      A: makeNode("A", "CL_FOO", {
        B: makeNode("B", "CL_FOO"),
      }),
    });

    expect(fetchedNotations().filter((n: string) => n === "CL_FOO")).toHaveLength(1);
  });

  it("returns an empty codelist object when metadataStructure has no code list", async () => {
    const result = await renderUseCodelistsUntilLoaded({
      ROOT: makeNode("ROOT", undefined),
    });

    expect(vi.mocked(CodelistsApi.getCodelist)).not.toHaveBeenCalled();
    expect(result.current.codelists).toEqual({});
  });

  it("fetches the code lists in locale alphabetical order, whatever their case", async () => {
    mockEmptyCodelists();

    await renderUseCodelistsUntilLoaded({
      ROOT: makeNode("ROOT", "cl_activite", {
        CHILD: makeNode("CHILD", "CL_Zone"),
      }),
    });

    expect(fetchedNotations()).toEqual(["cl_activite", "CL_Zone"]);
  });
});
