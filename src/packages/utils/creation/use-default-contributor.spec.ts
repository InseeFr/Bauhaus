import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useOrganizations } from "../hooks/organizations";
import { usePrivileges, useUserStamps } from "../hooks/users";

import { useIsDefaultContributorPending } from "./use-default-contributor";

vi.mock("../hooks/organizations", () => ({ useOrganizations: vi.fn() }));

vi.mock("../hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

const mockUseOrganizations = vi.mocked(useOrganizations);
const mockUsePrivileges = vi.mocked(usePrivileges);
const mockUseUserStamps = vi.mocked(useUserStamps);

const settled = () => {
  mockUseOrganizations.mockReturnValue({ isPlaceholderData: false } as ReturnType<
    typeof useOrganizations
  >);
  mockUseUserStamps.mockReturnValue({ isPlaceholderData: false } as ReturnType<
    typeof useUserStamps
  >);
  mockUsePrivileges.mockReturnValue({ privileges: [], isPending: false });
};

describe("useIsDefaultContributorPending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    settled();
  });

  it("est en attente tant que le référentiel des organisations n'est pas chargé", () => {
    mockUseOrganizations.mockReturnValue({ isPlaceholderData: true } as ReturnType<
      typeof useOrganizations
    >);

    const { result } = renderHook(() => useIsDefaultContributorPending());

    expect(result.current).toBe(true);
  });

  it("est en attente tant que le timbre de l'utilisateur n'est pas chargé", () => {
    mockUseUserStamps.mockReturnValue({ isPlaceholderData: true } as ReturnType<
      typeof useUserStamps
    >);

    const { result } = renderHook(() => useIsDefaultContributorPending());

    expect(result.current).toBe(true);
  });

  it("est en attente tant que les droits de l'utilisateur ne sont pas chargés", () => {
    mockUsePrivileges.mockReturnValue({ privileges: [], isPending: true });

    const { result } = renderHook(() => useIsDefaultContributorPending());

    expect(result.current).toBe(true);
  });

  it("n'est plus en attente une fois les trois sources chargées", () => {
    const { result } = renderHook(() => useIsDefaultContributorPending());

    expect(result.current).toBe(false);
  });
});
