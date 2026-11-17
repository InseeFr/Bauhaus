import { ReactNode } from "react";
import { vi } from "vitest";

import {
  MODULE,
  Privilege,
  PRIVILEGE,
  STRATEGIES,
  STRATEGY,
  UserStamp,
} from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, renderWithRouter } from "./render";

/** Droits d'une application : chaque privilège listé avec la même stratégie. */
export const rbacFor = (
  application: MODULE,
  privileges: PRIVILEGE[] = [],
  strategy: STRATEGY = STRATEGIES.ALL,
): Privilege => ({
  application,
  privileges: privileges.map((privilege) => ({ privilege, strategy })),
});

/**
 * Installe les droits puis charge le module testé : l'import doit rester dynamique
 * (et écrit dans le spec, pour résoudre son chemin relatif) afin de voir le mock.
 */
export const importWithRbac = async <M,>(
  rbac: Privilege[],
  loadModule: () => Promise<M>,
  stamps?: UserStamp[],
): Promise<M> => {
  mockReactQueryForRbac(rbac, stamps);
  return loadModule();
};

/** À passer à `afterEach` : chaque test réimporte le module sous ses propres droits. */
export const resetRbacMocks = () => {
  vi.resetModules();
  vi.clearAllMocks();
};

export const renderWithRbac = async <M,>(
  rbac: Privilege[],
  loadModule: () => Promise<M>,
  element: (module: M) => ReactNode,
  stamps?: UserStamp[],
) => {
  const module = await importWithRbac(rbac, loadModule, stamps);
  return renderWithRouter(element(module));
};
