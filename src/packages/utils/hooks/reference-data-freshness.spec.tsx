import { beforeEach, describe, expect, it, vi } from "vitest";

import { StampsApi, ThemesApi, V2Api } from "@sdk/index";
import { UsersApi } from "@sdk/users-api";

import { mountAgainLongAfter } from "../../tests/query-freshness.testing";
import { useStamps, useV2Stamps } from "./stamps";
import { useThemes } from "./themes";
import { usePrivileges, useUserStamps } from "./users";

vi.mock("../../sdk", () => ({
  StampsApi: { getStamps: vi.fn() },
  V2Api: { getStamps: vi.fn() },
  ThemesApi: { getThemes: vi.fn() },
}));

vi.mock("@sdk/users-api", () => ({
  UsersApi: { getInfo: vi.fn(), getStamp: vi.fn() },
}));

/** Les référentiels ne changent pas en cours de session : ils sont lus une seule fois. */
describe("reference data", () => {
  beforeEach(() => {
    vi.mocked(StampsApi.getStamps).mockResolvedValue([]);
    vi.mocked(V2Api.getStamps).mockResolvedValue([]);
    vi.mocked(ThemesApi.getThemes).mockResolvedValue([]);
    vi.mocked(UsersApi.getInfo).mockResolvedValue([]);
    vi.mocked(UsersApi.getStamp).mockResolvedValue([]);
    vi.clearAllMocks();
  });

  it("reads the privileges of the user once", async () => {
    await mountAgainLongAfter(() => {
      const { isPending } = usePrivileges();
      return { isSuccess: !isPending, isFetching: false };
    });

    expect(UsersApi.getInfo).toHaveBeenCalledTimes(1);
  });

  it("reads the stamps of the user once", async () => {
    await mountAgainLongAfter(() => useUserStamps());

    expect(UsersApi.getStamp).toHaveBeenCalledTimes(1);
  });

  it("reads the stamps once", async () => {
    await mountAgainLongAfter(() => useStamps());

    expect(StampsApi.getStamps).toHaveBeenCalledTimes(1);
  });

  it("reads the v2 stamps once", async () => {
    await mountAgainLongAfter(() => useV2Stamps());

    expect(V2Api.getStamps).toHaveBeenCalledTimes(1);
  });

  it("reads the themes once", async () => {
    await mountAgainLongAfter(() => useThemes());

    expect(ThemesApi.getThemes).toHaveBeenCalledTimes(1);
  });
});
