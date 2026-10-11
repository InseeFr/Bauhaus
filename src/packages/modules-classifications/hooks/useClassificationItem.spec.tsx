import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { useClassificationItem, useClassificationParentLevels } from "./useClassificationItem";
import * as clientModule from "./useClassificationItemClient";

const mockData = [{ item: "id1", labelLg1: "Label 1" }];

vi.mock("./useClassificationItemClient", async () => {
  const actual = await vi.importActual<typeof import("./useClassificationItemClient")>(
    "./useClassificationItemClient",
  );
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
    using spy = vi.spyOn(clientModule, "fetchingPreviousLevels");

    const item = {}; // item.general is undefined
    const { result } = renderHook(() => useClassificationParentLevels("class1", "item1", item), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("useClassificationItem", () => {
  const noRetryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      {children}
    </QueryClientProvider>
  );

  it("expose l'échec de lecture du poste", async () => {
    const rejection = sdkRejection.emptyBody(404);
    using _generalSpy = vi
      .spyOn(ClassificationsApi, "getClassificationItemGeneral")
      .mockRejectedValue(rejection);
    using _narrowersSpy = vi
      .spyOn(ClassificationsApi, "getClassificationItemNarrowers")
      .mockResolvedValue([]);

    const { result } = renderHook(() => useClassificationItem("class1", "item1", true), {
      wrapper: noRetryWrapper,
    });

    await waitFor(() => expect(result.current.error).toBe(rejection));
  });
});
