type UsersHooksModule = typeof import("@utils/hooks/users");

/**
 * Fabrique du module `@utils/hooks/users` simulé : l'utilisateur détient, avec la
 * stratégie ALL, les privilèges donnés sur les jeux de données. À appeler depuis la
 * factory d'un `vi.mock`, via un import dynamique.
 */
export const usersHooksWithDatasetPrivileges = async (
  importOriginal: <T = UsersHooksModule>() => Promise<T>,
  privileges: string[],
) => ({
  ...(await importOriginal<UsersHooksModule>()),
  usePrivileges: () => ({
    privileges: [
      {
        application: "DATASET_DATASET",
        privileges: privileges.map((privilege) => ({ privilege, strategy: "ALL" })),
      },
    ],
  }),
  useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
});
