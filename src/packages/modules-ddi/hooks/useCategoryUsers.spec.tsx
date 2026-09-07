import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCategoryUsers, useFetchCategoryUsers } from "./useCategoryUsers";
import { DDIApi } from "../../sdk";
import type { CategoryUsage } from "../physical-instances/types/api";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getCategoryUsers: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockResponse: CategoryUsage[] = [
  {
    group: null,
    studyUnit: null,
    physicalInstance: null,
    variable: null,
    codeList: { agencyId: "fr.insee", id: "cl-1", label: "Pays" },
  },
];

describe("useCategoryUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the code lists using the category", async () => {
    vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCategoryUsers("fr.insee", "cat-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledWith("fr.insee", "cat-1");
  });

  it("does not fetch while disabled", () => {
    vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);

    renderHook(() => useCategoryUsers("fr.insee", "cat-1", false), {
      wrapper: createWrapper(),
    });

    expect(DDIApi.getCategoryUsers).not.toHaveBeenCalled();
  });

  it("does not fetch without a category id", () => {
    vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);

    renderHook(() => useCategoryUsers("fr.insee", ""), { wrapper: createWrapper() });

    expect(DDIApi.getCategoryUsers).not.toHaveBeenCalled();
  });
});

describe("useFetchCategoryUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the code lists using the category", async () => {
    vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchCategoryUsers(), {
      wrapper: createWrapper(),
    });

    const usages = await result.current("fr.insee", "cat-1");

    expect(usages).toEqual(mockResponse);
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledWith("fr.insee", "cat-1");
  });

  it("serves subsequent calls for the same category from the query cache", async () => {
    vi.mocked(DDIApi.getCategoryUsers).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchCategoryUsers(), {
      wrapper: createWrapper(),
    });

    await result.current("fr.insee", "cat-1");
    const second = await result.current("fr.insee", "cat-1");

    expect(second).toEqual(mockResponse);
    expect(DDIApi.getCategoryUsers).toHaveBeenCalledTimes(1);
  });
});
