import { PropsWithChildren } from "react";

import { MODULE, Privilege, PRIVILEGE, usePrivileges, useUserStamps } from "@utils/hooks/users";

import { AppName } from "../../application/app-context";

export type RoleCheck = string | [string, (value: string) => boolean];
export type RoleChecks = RoleCheck[];

export const hasAccessToModule = (module: AppName, privileges: Privilege[] | undefined) => {
  if (!privileges || privileges.length === 0) {
    return false;
  }

  const modulePrefixMap: Record<AppName, string> = {
    concepts: "CONCEPT",
    classifications: "CLASSIFICATION",
    operations: "OPERATION",
    structures: "STRUCTURE",
    codelists: "CODESLIST",
    datasets: "DATASET",
    ddi: "DDI",
  };

  const applicationPrefix = modulePrefixMap[module];
  if (!applicationPrefix) {
    return false;
  }

  return privileges.some(
    (p) =>
      p.application.startsWith(applicationPrefix) &&
      p.privileges.some((priv) => priv.strategy !== "NONE"),
  );
};

export interface AuthorizationGuardOptions {
  module: MODULE;
  privilege: PRIVILEGE;
  stamps?: string[];
  complementaryCheck?: boolean;
  check?: (stamp: string) => boolean;
}

interface UserStamp {
  stamp: string;
}

const findPrivilegeForModule = (privileges: Privilege[], module: MODULE, privilege: PRIVILEGE) => {
  const currentModule = privileges.find((d) => d.application === module);
  return currentModule?.privileges.find((p) => p.privilege === privilege);
};

const hasStampAccess = (
  userStamps: UserStamp[],
  allowedStamps: string[],
  complementaryCheck: boolean,
  check: (stamp: string) => boolean,
): boolean => {
  if (allowedStamps.length === 0) {
    return userStamps.some((userStamp) => complementaryCheck && check(userStamp.stamp));
  }
  return userStamps.some(
    (userStamp) =>
      allowedStamps.includes(userStamp.stamp) && complementaryCheck && check(userStamp.stamp),
  );
};

export const useAuthorizationGuard = ({
  module,
  privilege,
  stamps: stampsProps = [],
  complementaryCheck = true,
  check = () => true,
}: AuthorizationGuardOptions): boolean => {
  const stamps = Array.isArray(stampsProps) ? stampsProps : [stampsProps];

  const { privileges } = usePrivileges();
  const { data: userStamps = [] } = useUserStamps();

  if (!privileges) {
    return false;
  }

  const currentPrivilege = findPrivilegeForModule(privileges, module, privilege);

  if (currentPrivilege?.strategy === "ALL") {
    return true;
  }

  if (currentPrivilege?.strategy === "STAMP") {
    return hasStampAccess(userStamps, stamps, complementaryCheck, check);
  }

  return false;
};

export const HasAccess = ({
  children,
  module,
  privilege,
  stamps = [],
  complementaryCheck = true,
  check = () => true,
}: Readonly<
  PropsWithChildren<{
    module: MODULE;
    privilege: PRIVILEGE;
    fallback?: any;
    complementaryCheck?: boolean;
    stamps?: string[];
    check?: (stamp: string) => boolean;
  }>
>) => {
  const isAuthorized = useAuthorizationGuard({
    module,
    privilege,
    stamps,
    complementaryCheck,
    check,
  });

  if (!isAuthorized) {
    return null;
  }
  return children;
};
