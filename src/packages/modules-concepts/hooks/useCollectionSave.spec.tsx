import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

import { CollectionApi } from "@sdk/new-collection-api";

import { useCollectionSave, CollectionSaveData } from "./useCollectionSave";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@sdk/new-collection-api", () => ({
  CollectionApi: {
    postCollection: vi.fn(),
    putCollection: vi.fn(),
  },
}));

describe("useCollectionSave", () => {
  let queryClient: QueryClient;
  const mockNavigate = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it("redirects to the real collection id (untouched) after an update, even when it contains uppercase letters", async () => {
    (CollectionApi.putCollection as Mock).mockResolvedValue("Collection-001");

    const data: CollectionSaveData = {
      general: { id: "Collection-001", prefLabelLg1: "Ma collection" } as never,
      members: [{ id: "concept-1" }] as never,
    };

    const { result } = renderHook(() => useCollectionSave("Collection-001"), { wrapper });

    result.current.save(data);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/concepts/collections/Collection-001");
    });
  });

  it("exposes the save error and leaves the saving state when the API rejects", async () => {
    const apiError = { status: 500, message: "Erreur du serveur" };
    (CollectionApi.putCollection as Mock).mockRejectedValue(apiError);

    const data: CollectionSaveData = {
      general: { id: "Collection-001", prefLabelLg1: "Ma collection" } as never,
      members: [] as never,
    };

    const { result } = renderHook(() => useCollectionSave("Collection-001"), { wrapper });

    act(() => result.current.save(data));

    await waitFor(() => {
      expect(result.current.saveError).toEqual(apiError);
    });
    expect(result.current.isSaving).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
