import { Mock, expect, vi } from "vitest";

import type { PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

/**
 * Remplaçant de `@utils/hooks/users`, à brancher par
 * `vi.mock("@utils/hooks/users", () => import("<chemin>/testing/users.testing"))`.
 * Le spec importe ensuite `usePrivileges` / `useUserStamps` depuis `@utils/hooks/users`
 * et obtient ces mêmes `vi.fn()`.
 */
export const usePrivileges: Mock = vi.fn();
export const useUserStamps: Mock = vi.fn();

type Stamps = { stamp: string }[] | undefined;
type StampsHook = () => { data: Stamps };

/** Fait renvoyer `data` par `useUserStamps`. */
export const mockUserStamps = (data: Stamps) => useUserStamps.mockReturnValue({ data });

/** Appelle `hook` et renvoie ses timbres ainsi que le premier d'entre eux. */
export const readFirstStamp = (hook: StampsHook) => {
  const { data } = hook();
  return { data, stamp: data?.[0]?.stamp };
};

/** Vérifie que `hook` expose `stamps` sous la propriété `data` (et plus `datas`). */
export const expectStampsExposedAsData = (hook: StampsHook, stamps: Stamps) => {
  mockUserStamps(stamps);

  const result = hook();

  expect(result).toHaveProperty("data");
  expect(result.data).toEqual(stamps);
  expect(result).not.toHaveProperty("datas");
};

type Grant = { privilege: PRIVILEGE; strategy: STRATEGY };

/** Accorde `grants` sur le module des listes de codes à un utilisateur portant `stamps`. */
export const mockCodelistPrivileges = (grants: Grant[], stamps: string[] = []) => {
  usePrivileges.mockReturnValue({
    privileges: grants.length ? [{ application: "CODESLIST_CODESLIST", privileges: grants }] : [],
  });
  useUserStamps.mockReturnValue({ data: stamps.map((stamp) => ({ stamp })) });
};
