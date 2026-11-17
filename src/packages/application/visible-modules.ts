import { useMemo } from "react";

import { usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule } from "../auth/components/auth";
import { useAppContext } from "./app-context";
import type { AppName } from "./app-context";

/* Deux raisons de ne pas proposer un module : il se déclare masqué, ou il est hors des
   droits de l'utilisateur. Un module masqué peut rester joignable par URL. */
export const useVisibleModules = (): AppName[] => {
  const { privileges = [] } = usePrivileges();

  const {
    properties: { modules },
  } = useAppContext();

  return useMemo(
    () =>
      modules
        .filter((m) => m.show && hasAccessToModule(m.identifier, privileges))
        .map((m) => m.identifier),
    [modules, privileges],
  );
};
