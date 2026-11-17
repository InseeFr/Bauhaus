import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import type { CategoryUsage } from "../physical-instances/types/api";
import { renderQueryHook } from "./queryClient.testing";
import { useCategoryUsers, useFetchCategoryUsers } from "./useCategoryUsers";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getCategoryUsers: vi.fn(),
  },
}));

const mockResponse: CategoryUsage[] = [
  {
    group: null,
    studyUnit: null,
    physicalInstance: null,
    variable: null,
    codeList: { agencyId: "fr.insee", id: "cl-1", label: "Pays" },
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);
});

describe("useCategoryUsers", () => {
  it("fetches the code lists using the category", async () => {
    const { result } = renderQueryHook(() => useCategoryUsers("fr.insee", "cat-1"));

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledWith("fr.insee", "cat-1");
  });

  it("does not fetch while disabled", () => {
    renderQueryHook(() => useCategoryUsers("fr.insee", "cat-1", false));

    expect(DDIApi.getCategoryUsers).not.toHaveBeenCalled();
  });

  it("does not fetch without a category id", () => {
    renderQueryHook(() => useCategoryUsers("fr.insee", ""));

    expect(DDIApi.getCategoryUsers).not.toHaveBeenCalled();
  });
});

describe("useFetchCategoryUsers", () => {
  it("fetches the code lists using the category", async () => {
    const { result } = renderQueryHook(() => useFetchCategoryUsers());

    const usages = await result.current("fr.insee", "cat-1");

    expect(usages).toEqual(mockResponse);
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledWith("fr.insee", "cat-1");
  });

  it("serves subsequent calls for the same category from the query cache", async () => {
    const { result } = renderQueryHook(() => useFetchCategoryUsers());

    await result.current("fr.insee", "cat-1");
    const second = await result.current("fr.insee", "cat-1");

    expect(second).toEqual(mockResponse);
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledTimes(1);
  });
});
