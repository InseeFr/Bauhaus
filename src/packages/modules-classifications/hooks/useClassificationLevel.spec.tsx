import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { useClassificationLevel } from "./useClassificationLevel";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: {
    getClassificationLevelGeneral: vi.fn(),
    getClassificationLevelMembers: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

const renderUseClassificationLevel = () =>
  renderHook(() => useClassificationLevel("nafr2", "divisions"), { wrapper });

describe("useClassificationLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ClassificationsApi.getClassificationLevelGeneral).mockResolvedValue({
      id: "divisions",
      prefLabelLg1: "Divisions",
    } as any);
    vi.mocked(ClassificationsApi.getClassificationLevelMembers).mockResolvedValue([] as any);
  });

  it("assemble le général et les membres du niveau", async () => {
    const { result } = renderUseClassificationLevel();

    await waitFor(() =>
      expect(result.current.level).toEqual({
        general: { id: "divisions", prefLabelLg1: "Divisions" },
        members: [],
      }),
    );
  });

  it("expose l'échec de lecture du général", async () => {
    const rejection = sdkRejection.emptyBody(404);
    vi.mocked(ClassificationsApi.getClassificationLevelGeneral).mockRejectedValue(rejection);

    const { result } = renderUseClassificationLevel();

    await waitFor(() => expect(result.current.error).toBe(rejection));
  });

  it("expose l'échec de lecture des membres", async () => {
    const rejection = sdkRejection.emptyBody(500);
    vi.mocked(ClassificationsApi.getClassificationLevelMembers).mockRejectedValue(rejection);

    const { result } = renderUseClassificationLevel();

    await waitFor(() => expect(result.current.error).toBe(rejection));
  });
});
