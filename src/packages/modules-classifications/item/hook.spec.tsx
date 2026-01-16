import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as clientModule from "./client";
import { useClassificationParentLevels } from "./hook";

const mockData = [{ item: "id1", labelLg1: "Label 1" }];

vi.mock("./client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return {
    ...actual,
    fetchingPreviousLevels: () => {
      return mockData;
    },
  };
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useClassificationParentLevels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls fetchingPreviousLevels and returns data when item.general is defined", async () => {
    const item = { general: { label: "X" } };

    const { result } = renderHook(() => useClassificationParentLevels("class1", "item1", item), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockData));
  });

  it("does not call fetchingPreviousLevels if item.general is undefined", async () => {
    const spy = vi.spyOn(clientModule, "fetchingPreviousLevels");

    const item = {}; // item.general is undefined
    const { result } = renderHook(() => useClassificationParentLevels("class1", "item1", item), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});
