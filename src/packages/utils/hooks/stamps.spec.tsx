import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useStamps,
  useV2Stamps,
  useStampsOptions,
  useV2StampsOptions,
  useV2StampsMap,
} from "./stamps";
import { StampsApi, V2Api } from "../../sdk";

vi.mock("../../sdk", () => ({
  StampsApi: {
    getStamps: vi.fn(),
  },
  V2Api: {
    getStamps: vi.fn(),
  },
}));

let queryClient: QueryClient;

const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

afterEach(() => {
  queryClient?.clear();
  cleanup();
});

describe("useStamps", () => {
  it("should fetch stamps successfully", async () => {
    const mockStamps = ["stamp1", "stamp2", "stamp3"];
    (StampsApi.getStamps as any).mockResolvedValue(mockStamps);

    const { result } = renderHook(() => useStamps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStamps);
  });

  it("should handle error when fetching stamps", async () => {
    const mockError = new Error("Failed to fetch stamps");
    (StampsApi.getStamps as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useStamps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });
});

describe("useV2Stamps", () => {
  it("should fetch v2 stamps successfully", async () => {
    const mockV2Stamps = [
      { stamp: "stamp1", label: "Label 1" },
      { stamp: "stamp2", label: "Label 2" },
    ];
    (V2Api.getStamps as any).mockResolvedValue(mockV2Stamps);

    const { result } = renderHook(() => useV2Stamps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockV2Stamps);
  });

  it("should handle error when fetching v2 stamps", async () => {
    const mockError = new Error("Failed to fetch v2 stamps");
    (V2Api.getStamps as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useV2Stamps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });
});

describe("useStampsOptions", () => {
  it("should transform stamps into select options", async () => {
    const mockStamps = ["stamp1", "stamp2", "stamp3"];
    (StampsApi.getStamps as any).mockResolvedValue(mockStamps);

    const { result } = renderHook(() => useStampsOptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current).toEqual([
        { value: "stamp1", label: "stamp1" },
        { value: "stamp2", label: "stamp2" },
        { value: "stamp3", label: "stamp3" },
      ]),
    );
  });

  it("should return empty array when no stamps are available", () => {
    (StampsApi.getStamps as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useStampsOptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toEqual([]);
  });
});

describe("useV2StampsOptions", () => {
  // Note: This test verifies the transformation logic is working correctly
  // by checking that stamps are transformed to the expected format
  it("should transform v2 stamps into select options with labels", async () => {
    const mockV2Stamps = [
      { stamp: "DG75-L201", label: "INSEE" },
      { stamp: "DG75-L202", label: "DARES" },
      { stamp: "DG75-G001", label: "Direction Générale" },
    ];
    vi.mocked(V2Api.getStamps).mockResolvedValueOnce(mockV2Stamps as any);

    const { result } = renderHook(() => useV2StampsOptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toHaveLength(3);
      expect(result.current).toContainEqual({ value: "DG75-L201", label: "INSEE" });
      expect(result.current).toContainEqual({ value: "DG75-L202", label: "DARES" });
      expect(result.current).toContainEqual({ value: "DG75-G001", label: "Direction Générale" });
    });
  });
});

describe("useV2StampsMap", () => {
  // Note: This test verifies the Map creation logic is working correctly
  it("should create a map from v2 stamps with stamp as key and label as value", async () => {
    const mockV2Stamps = [
      { stamp: "DG75-L201", label: "INSEE" },
      { stamp: "DG75-L202", label: "DARES" },
      { stamp: "DG75-G001", label: "Direction Générale" },
    ];
    vi.mocked(V2Api.getStamps).mockResolvedValueOnce(mockV2Stamps as any);

    const { result } = renderHook(() => useV2StampsMap(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const map = result.current;
      expect(map.size).toBe(3);
      expect(map.get("DG75-L201")).toBe("INSEE");
      expect(map.get("DG75-L202")).toBe("DARES");
      expect(map.get("DG75-G001")).toBe("Direction Générale");
    });
  });

  it("should allow retrieval of labels using stamp as key", async () => {
    const mockV2Stamps = [{ stamp: "DG75-L201", label: "INSEE" }];
    vi.mocked(V2Api.getStamps).mockResolvedValueOnce(mockV2Stamps as any);

    const { result } = renderHook(() => useV2StampsMap(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const label = result.current.get("DG75-L201");
      expect(label).toBe("INSEE");
    });
  });

  it("should return undefined for non-existent stamp", async () => {
    const mockV2Stamps = [{ stamp: "stamp1", label: "Label 1" }];
    vi.mocked(V2Api.getStamps).mockResolvedValueOnce(mockV2Stamps as any);

    const { result } = renderHook(() => useV2StampsMap(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const label = result.current.get("nonexistent");
      expect(label).toBeUndefined();
    });
  });
});
