import { vi } from "vitest";

/**
 * Remplacement partiel de `@utils/hooks/users` : on monte le vrai <HasAccess>, seules les
 * sources de privilèges et de stamps sont mockées.
 *
 * Usage :
 * `vi.mock("@utils/hooks/users", async (importOriginal) =>
 *   (await import("<chemin>/privileges.testing")).mockUsersHooks(importOriginal));`
 */
export const mockUsersHooks = async (importOriginal: <T>() => Promise<T>) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  usePrivileges: vi.fn(),
  useUserStamps: vi.fn(),
});

/** Réponse de `usePrivileges` accordant `privilege` sur les PhysicalInstances DDI. */
export const ddiPrivileges = (privilege: string, strategy: string) => ({
  privileges: [
    {
      application: "DDI_PHYSICALINSTANCE",
      privileges: [{ privilege, strategy }],
    },
  ],
});
