import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { CollectionApi } from "@sdk/new-collection-api";

import { useCollectionSave, CollectionSaveData } from "./useCollectionSave";

vi.mock("react-router-dom", () => ({
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
});
