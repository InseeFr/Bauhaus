import { Mock, expect, vi } from "vitest";

import type { AuthorizationGuardOptions } from "../../auth/components/auth";

/**
 * Remplaçant de `auth/components/auth`, à brancher par
 * `vi.mock("<chemin>/auth/components/auth", () => import("<chemin>/testing/auth.testing"))`.
 */
export const useAuthorizationGuard: Mock = vi.fn();

/** Garde demandée par les formulaires de création de liste de codes. */
export const CODELIST_CREATE_GUARD: AuthorizationGuardOptions = {
  module: "CODESLIST_CODESLIST",
  privilege: "CREATE",
};

/** Vérifie qu'une garde accordée est interrogée avec le module et le privilège de création. */
export const expectCreateGuardGranted = (
  guard: (options: AuthorizationGuardOptions) => boolean,
) => {
  vi.mocked(guard).mockReturnValue(true);

  const result = guard(CODELIST_CREATE_GUARD);

  expect(guard).toHaveBeenCalledWith({
    module: "CODESLIST_CODESLIST",
    privilege: "CREATE",
  });
  expect(result).toBe(true);
};
